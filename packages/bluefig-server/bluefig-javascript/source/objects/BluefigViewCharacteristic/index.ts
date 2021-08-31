// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';

    import delog from '@plurid/delog';

    import {
        uuid,
    } from '@plurid/plurid-functions';
    // #endregion libraries


    // #region external
    import {
        BLUEFIG_VIEW_CHARACTERISTIC_UUID,
        BLUEFIG_RESPONSE,

        HOOKS_PATH,
        VIEWS_PATH,
    } from '~data/constants';

    import {
        ViewsServer,
        Hooks,
        ActionPayload,
        ViewRouteClient,
        ViewRouteServer,

        Request,
        Reading,
        ReadingData,
        WriteChunk,
    } from '~data/interfaces';

    import {
        resolveElements,
    } from '~logic/index';

    import {
        bufferToData,
        dataToBase64,
        base64ToData,

        chunker,
    } from '~utilities/index';
    // #endregion external
// #endregion imports



// #region module
class BluefigViewCharacteristic extends bleno.Characteristic {
    private views: ViewsServer = {};
    private hooks: Hooks | null = null;
    private notifications: string[] = [];
    private token = '';

    private chunks: Record<string, any> = {};
    private reading: Reading | null = null;
    private readingsData: Record<string, ReadingData | undefined> = {};
    private actionViews: Record<string, ViewRouteServer | undefined> = {};


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
            this.views = require(VIEWS_PATH);
            delog({
                text: 'bluefig loaded views',
            });
        } catch (error) {
            delog({
                text: 'bluefig could not load views',
                level: 'warn',
            });
        }

        try {
            if (HOOKS_PATH) {
                this.hooks = require(HOOKS_PATH);
                delog({
                    text: 'bluefig loaded hooks',
                });
            }
        } catch (error) {
            delog({
                text: 'bluefig could not load hooks',
                level: 'warn',
            });
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

        const viewableActions: Record<string, string[]> = {};
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
            location: location || view.location || `/${uuid.generate()}`,
            title,
            elements: resolvedElements,
            actions: viewableActions,
        };

        if (this.notifications.length > 0) {
            viewable.notifications = [
                ...this.notifications,
            ];

            this.notifications = [];
        }

        return viewable;
    }

    private async resolveReadResource(
        resource: string,
    ) {
        if (resource.startsWith(BLUEFIG_RESPONSE)) {
            const id = resource.replace(BLUEFIG_RESPONSE, '');
            if (!id) {
                return;
            }

            const view = this.actionViews[id];
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
                delog({
                    text: 'triggerAction warn :: actionPayload has no view',
                    level: 'warn',
                });
                return;
            }

            if (this.hooks?.beforeAction) {
                const hook = await this.hooks.beforeAction(
                    actionPayload,
                    this.bluefigNotification.bind(this),
                    this.bluefigEvent.bind(this),
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
            delog({
                text: 'triggerAction error',
                level: 'error',
                error,
            });

            return;
        }
    }


    private handleResourceRead(
        data: Request,
        resourceOverwrite?: string,
    ) {
        const {
            resource,
            id,
        } = data;

        this.reading = {
            resource: resourceOverwrite || resource,
            id: id || uuid.generate(),
        };

        return true;
    }

    private async handleChunkWriting(
        chunk: WriteChunk,
    ) {
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
                    delog({
                        text: 'handleChunkWriting error :: location not resolved',
                        level: 'warn',
                    });
                    return;
                }

                this.actionViews[id] = {
                    location,
                    ...actionResult,
                };
                this.reading = {
                    resource: BLUEFIG_RESPONSE + id,
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


            if (typeof (data as Request).resource === 'string') {
                const request = data as Request;

                if (this.hooks?.checkToken) {
                    const allow = await this.hooks.checkToken(
                        {
                            token: this.token || data.token,
                        },
                        this.bluefigNotification.bind(this),
                        this.bluefigEvent.bind(this),
                    );

                    if (typeof allow === 'string') {
                        const resourceRead = this.handleResourceRead(
                            request,
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

                const resourceRead = this.handleResourceRead(
                    request,
                );
                if (resourceRead) {
                    callback(this.RESULT_SUCCESS);
                    return;
                }
            }


            await this.handleChunkWriting(
                data as WriteChunk,
            );
            callback(this.RESULT_SUCCESS);
        } catch (error) {
            delog({
                text: 'onWriteRequest error',
                level: 'error',
                error,
            });

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
        try {
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

            const readingData = this.readingsData[id];

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
                this.readingsData[id] = {
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
                this.readingsData = {};
                this.actionViews = {};
            } else {
                // sending intermediary chunks
                (this.readingsData[id] as ReadingData).sent += 1;
            }
        } catch (error) {
            delog({
                text: 'onReadRequest error',
                level: 'error',
                error,
            });

            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }
}
// #endregion module



// #region exports
export default BluefigViewCharacteristic;
// #endregion exports
