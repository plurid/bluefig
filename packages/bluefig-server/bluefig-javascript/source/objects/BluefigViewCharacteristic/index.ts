// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';
    // #endregion libraries


    // #region external
    import {
        BLUEFIG_VIEW_CHARACTERISTIC_UUID,

        hooksPath,
        viewsPath,
    } from '~data/constants';

    import {
        ViewsServer,
        Hooks,
        ActionPayload,
        ViewRouteClient,
        ViewRouteServer,

        Request,
        Response,
        Reading,
        WriteChunk,
    } from '~data/interfaces';

    import {
        resolveElements,
    } from '~services/logic';

    import {
        bufferToData,
        dataToBase64,
        base64ToData,

        chunker,
    } from '~services/utilities';
    // #endregion external
// #endregion imports



// #region module
class BluefigViewCharacteristic extends bleno.Characteristic {
    private views: ViewsServer = {};
    private hooks: Hooks | null = null;

    private chunks: Record<string, any> = {};

    private reading: Reading | null = null;
    private readings: Record<string, any> = {};
    private notifications: string[] = [];


    constructor() {
        super({
            uuid: BLUEFIG_VIEW_CHARACTERISTIC_UUID,
            properties: ['read', 'write'],
            descriptors: [
                new bleno.Descriptor({
                    uuid: '2901',
                    value: 'Gets or sets the bluefig view.',
                }),
            ],
        });


        this.loadConfiguration();
    }


    private loadConfiguration() {
        try {
            const views = require(viewsPath);
            this.views = views;
            console.log('Views loaded.');

            const hooks = require(hooksPath);
            this.hooks = hooks;
            console.log('Hooks loaded.');
        } catch (error) {
            console.log('Could not load.');
        }
    }

    private async resolveViewable(
        view: ViewRouteServer,
        location: string,
    ) {
        const {
            title,
            elements,
            actions,
        } = view;

        const viewableActions: any = {};
        if (actions) {
            for (const [key, value] of Object.entries(actions)) {
                if (!value) {
                    continue;
                }

                if (typeof value === 'function') {
                    continue;
                }

                viewableActions[key] = value.arguments || [];
            }
        }

        const resolvedElements = await resolveElements(elements);

        const viewable: ViewRouteClient = {
            location,
            title,
            elements: resolvedElements,
            actions: viewableActions,
            notifications: [
                ...this.notifications,
            ],
        };

        this.notifications = [];

        return viewable;
    }

    private async resolveReadResource(
        resource: string,
    ) {
        if (resource.startsWith('response:')) {
            const id = resource.replace('response:', '');
            const view = this.readings[id];
            if (!view) {
                return;
            }
            const viewable = await this.resolveViewable(
                view,
                `/_bluefig-response/${id}`,
            );
            return viewable;
        }


        const view = this.views[resource];
        if (!view) {
            return;
        }

        const viewable = await this.resolveViewable(
            view,
            resource,
        );
        return viewable;
    }

    private async actionNotification(
        notification: string,
    ) {
        this.notifications.push(notification);
    }

    private async triggerAction(
        data: string,
    ) {
        try {
            const actionPayload = base64ToData<ActionPayload>(data);
            if (!actionPayload) {
                return;
            }

            if (!actionPayload.view) {
                return;
            }

            if (this.hooks?.beforeWrite) {
                const hook = await this.hooks.beforeWrite(
                    actionPayload.view,
                );

                if (!hook) {
                    return;
                }

                if (typeof hook === 'string') {
                    actionPayload.view = hook;
                }
            }

            const view = this.views[actionPayload.view];
            if (!view || !view.actions) {
                return;
            }

            const actionData = view.actions[actionPayload.name];
            if (!actionData) {
                return;
            }


            if (typeof actionData === 'function') {
                return await actionData(
                    this.actionNotification.bind(this),
                );
            }

            return await actionData.execution(
                ...actionPayload.arguments,
                this.actionNotification.bind(this),
            );
        } catch (error) {
            return;
        }
    }


    public async onWriteRequest(
        buffer: Buffer,
        offset: number,
        withoutResponse: boolean,
        callback: (
            result: number,
        ) => void,
    ) {
        try {
            const data = bufferToData<Request | WriteChunk>(buffer);
            if (!data) {
                callback(this.RESULT_UNLIKELY_ERROR);
                return;
            }

            if (this.hooks?.checkToken) {
                const allow = await this.hooks.checkToken(
                    data.token,
                    'write',
                );

                if (!allow) {
                    callback(this.RESULT_UNLIKELY_ERROR);
                    return;
                }
            }

            if ((data as Request).resource) {
                // Reading.
                const request = data as Request;
                const {
                    resource,
                    id,
                } = request;

                this.reading = {
                    resource,
                    id: id || Math.random() + '',
                };

                callback(this.RESULT_SUCCESS);
                return;
            }


            // Writing.
            const chunk = data as WriteChunk;
            const {
                end,
                id,
                data: chunkData,
            } = chunk;

            const currentChunk = this.chunks[id] || '';
            const updateChunkData = currentChunk + chunkData;
            this.chunks[id] = updateChunkData;

            if (end) {
                const data = this.chunks[id];
                const actionResult = await this.triggerAction(
                    data,
                );

                if (actionResult) {
                    this.readings[id] = actionResult;
                    this.reading = {
                        resource: `response:${id}`,
                        id,
                    };
                }
            }

            callback(this.RESULT_SUCCESS);
        } catch (error) {
            // action definition error
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }

    public async onReadRequest(
        offset: number,
        callback: (
            result: number,
            data?: Buffer,
        ) => void,
    ) {
        if (!this.reading) {
            callback(this.RESULT_UNLIKELY_ERROR);
            return;
        }

        const {
            resource,
            id,
        } = this.reading;

        const baseResponse = {
            id,
            data: '',
            end: 0,
        };

        const readingData = this.readings[id];

        if (!readingData) {
            const readResource = await this.resolveReadResource(resource);
            const resourceString = dataToBase64(readResource);

            const chunks = chunker(
                baseResponse,
                resourceString,
            );

            if (chunks.length === 1) {
                callback(
                    this.RESULT_SUCCESS,
                    Buffer.from(chunks[0]),
                );

                this.reading = null;
                return;
            }


            callback(
                this.RESULT_SUCCESS,
                Buffer.from(chunks[0]),
            );
            this.readings[id] = {
                chunks,
                sent: 0,
            };
            return;
        }


        const nextChunkIndex = readingData.sent + 1;
        const nextChunk = readingData.chunks[nextChunkIndex];
        if (!nextChunk) {
            callback(this.RESULT_UNLIKELY_ERROR);
            return;
        }


        callback(
            this.RESULT_SUCCESS,
            Buffer.from(nextChunk),
        );

        if (nextChunkIndex === readingData.chunks.length - 1) {
            // last chunk was sent
            this.reading = null;
            delete this.readings[id];
        } else {
            // sending intermediary chunks
            this.readings[id].sent += 1;
        }
    }
}
// #endregion module



// #region exports
export default BluefigViewCharacteristic;
// #endregion exports
