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

        Request,
        Response,
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

    private reading: any | null = null;
    private readings: Record<string, any> = {};


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
        location: string,
    ) {
        const view = this.views[location];
        if (!view) {
            return;
        }

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
        };

        return viewable;
    }

    private async resolveReadResource(
        resource: string,
    ) {
        // TO EXTEND for other resources

        const viewable = await this.resolveViewable(resource);
        return viewable;
    }

    private triggerAction(
        data: string,
    ) {
        try {
            const payload = base64ToData(data);

            // console.log('onWriteRequest finished writing', data);
            // console.log('onWriteRequest finished writing', base64ToData(data));

            // trigger end
            // const actionPayload = bufferToData<ActionPayload>(buffer);
            // if (!actionPayload) {
            //     return;
            // }

            // if (!actionPayload.view) {
            //     callback(this.RESULT_UNLIKELY_ERROR);
            //     return;
            // }

            // if (this.hooks?.beforeWrite) {
            //     const hook = await this.hooks.beforeWrite(
            //         actionPayload.view,
            //     );

            //     if (!hook) {
            //         callback(this.RESULT_UNLIKELY_ERROR);
            //         return;
            //     }

            //     if (typeof hook === 'string') {
            //         actionPayload.view = hook;
            //     }
            // }

            // const view = this.views[actionPayload.view];
            // if (!view || !view.actions) {
            //     callback(this.RESULT_UNLIKELY_ERROR);
            //     return;
            // }

            // const actionData = view.actions[actionPayload.name];
            // if (!actionData) {
            //     callback(this.RESULT_UNLIKELY_ERROR);
            //     return;
            // }


            // try {
            //     if (typeof actionData === 'function') {
            //         const result = await actionData();
            //         if (!result) {
            //             callback(this.RESULT_SUCCESS);
            //         }

            //         // send result data back
            //         callback(this.RESULT_SUCCESS);

            //         return;
            //     }

            //     const result = await actionData.execution(
            //         ...actionPayload.arguments,
            //     );
            //     if (!result) {
            //         callback(this.RESULT_SUCCESS);
            //     }

            //     // send result data back
            //     callback(this.RESULT_SUCCESS);
            // } catch (error) {
            //     // action call error
            //     callback(this.RESULT_UNLIKELY_ERROR);
            // }
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
                    id,
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
                this.triggerAction(
                    data,
                );
            }

            callback(this.RESULT_SUCCESS);
        } catch (error) {
            // action definition error
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }

    public async onReadRequest(
        callOffset: number,
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

        const readingData = this.readings[id];

        const baseResponse = {
            id,
            data: '',
            end: 0,
        };

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
                sent: 1,
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
