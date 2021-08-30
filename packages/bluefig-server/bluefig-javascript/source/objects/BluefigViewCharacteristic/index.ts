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
    private readings: Record<string, ViewRouteServer | any> = {};
    private notifications: string[] = [];
    private token = '';


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


    private resolveViewLocation(
        view: ViewRouteServer,
    ) {
        if (view.location) {
            return view.location;
        }

        for (const [key, value] of Object.entries(this.views)) {
            if (!value) {
                continue;
            }

            if (
                view.title === value.title
                && view.elements?.length === value.elements?.length
                && view.actions?.length === value.actions?.length
            ) {
                return key;
            }
        }

        return;
    }

    private async resolveViewable(
        view: ViewRouteServer,
        location?: string,
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
            location: location || view.location || `/${Math.random()}`,
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
            if (!id) {
                return;
            }

            const view = this.readings[id];
            if (!view) {
                return;
            }
            const viewable = await this.resolveViewable(
                view,
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


    private async bluefigNotification(
        notification: string,
    ) {
        this.notifications.push(notification);
    }

    private async bluefigEvent(
        type: string,
        payload?: any,
    ) {
        type = type.trim().toLowerCase();

        switch (type) {
            case 'set-token':
                if (typeof payload === 'string') {
                    this.token = payload;
                }
                break;
        }
    }

    private async triggerAction(
        data: string,
    ) {
        try {
            const actionPayload = base64ToData<ActionPayload>(data);
            if (
                !actionPayload
                || !actionPayload.view
            ) {
                return;
            }

            if (this.hooks?.beforeAction) {
                const hook = await this.hooks.beforeAction(
                    actionPayload,
                    this.bluefigNotification.bind(this),
                );

                if (typeof hook === 'string') {
                    actionPayload.view = hook;
                }

                if (typeof hook === 'boolean') {
                    if (!hook) {
                        return;
                    }
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
                    undefined,
                    this.bluefigNotification.bind(this),
                    this.bluefigEvent.bind(this),
                );
            }

            return await actionData.execution(
                {
                    ...actionPayload.arguments,
                },
                this.bluefigNotification.bind(this),
                this.bluefigEvent.bind(this),
            );
        } catch (error) {
            return;
        }
    }


    private handleResourceRead(
        data: any,
        resourceOverwrite?: string,
    ) {
        if (typeof (data as Request).resource !== 'string') {
            return false;
        }

        const request = data as Request;
        const {
            resource,
            id,
        } = request;

        this.reading = {
            resource: resourceOverwrite || resource,
            id: id || Math.random() + '',
        };

        return true;
    }

    private async handleChunkWriting(
        data: any,
    ) {
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
                const location = this.resolveViewLocation(actionResult);
                if (!location) {
                    return;
                }

                this.readings[id] = {
                    location,
                    ...actionResult,
                };
                this.reading = {
                    resource: `response:${id}`,
                    id,
                };
            }
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
                    this.bluefigNotification.bind(this),
                );

                if (typeof allow === 'string') {
                    const resourceRead = this.handleResourceRead(
                        data,
                        allow,
                    );
                    if (!resourceRead) {
                        callback(this.RESULT_UNLIKELY_ERROR);
                        return;
                    }

                    callback(this.RESULT_SUCCESS);
                    return;
                }

                if (typeof allow === 'boolean') {
                    if (!allow) {
                        callback(this.RESULT_UNLIKELY_ERROR);
                        return;
                    }
                }
            }


            const resourceRead = this.handleResourceRead(data);
            if (resourceRead) {
                callback(this.RESULT_SUCCESS);
                return;
            }


            await this.handleChunkWriting(data);
            callback(this.RESULT_SUCCESS);
        } catch (error) {
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

        const baseResponse: WriteChunk = {
            id,
            data: '',
            end: 0,
        };

        if (this.token) {
            baseResponse.token = this.token;
            this.token = '';
        }

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
            this.readings = {};
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
