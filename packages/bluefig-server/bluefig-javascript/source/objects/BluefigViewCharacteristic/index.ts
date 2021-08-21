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
    } from '~data/interfaces';

    import {
        resolveElements,
    } from '~services/logic';
    // #endregion external
// #endregion imports



// #region module
class BluefigViewCharacteristic extends bleno.Characteristic {
    private views: ViewsServer = {};
    private hooks: Hooks | null = null;


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


    public async onWriteRequest(
        data: Buffer,
        offset: number,
        withoutResponse: boolean,
        callback: (
            result: number,
            // data?: string,
        ) => void,
    ) {
        try {
            const dataValue = data.toString();
            const actionPayload: ActionPayload = JSON.parse(dataValue);

            if (!actionPayload.view) {
                callback(this.RESULT_UNLIKELY_ERROR);
                return;
            }

            if (this.hooks?.beforeWrite) {
                const allow = await this.hooks.beforeWrite(
                    actionPayload.view,
                );

                if (!allow) {
                    callback(this.RESULT_UNLIKELY_ERROR);
                    return;
                }
            }

            const view = this.views[actionPayload.view];
            if (!view || !view.actions) {
                callback(this.RESULT_UNLIKELY_ERROR);
                return;
            }

            const actionData = view.actions[actionPayload.name];
            if (!actionData) {
                callback(this.RESULT_UNLIKELY_ERROR);
                return;
            }


            try {
                if (typeof actionData === 'function') {
                    const result = await actionData();
                    if (!result) {
                        callback(this.RESULT_SUCCESS);
                    }

                    // send result data back
                    callback(this.RESULT_SUCCESS);

                    return;
                }

                const result = await actionData.execution(
                    ...actionPayload.arguments,
                );
                if (!result) {
                    callback(this.RESULT_SUCCESS);
                }

                // send result data back
                callback(this.RESULT_SUCCESS);
            } catch (error) {
                // action call error
                callback(this.RESULT_UNLIKELY_ERROR);
            }
        } catch (error) {
            // action definition error
            callback(this.RESULT_UNLIKELY_ERROR);
        }
    }

    public async onReadRequest(
        offset: any,
        callback: any,
    ) {
        // load view based on request
        const viewLocation = '/test-2';


        if (this.hooks?.beforeRead) {
            const allow = await this.hooks.beforeRead(
                viewLocation,
            );

            if (!allow) {
                callback(this.RESULT_UNLIKELY_ERROR);
                return;
            }
        }


        const view = this.views[viewLocation];
        if (!view) {
            callback(this.RESULT_UNLIKELY_ERROR);
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

                viewableActions[key] = value.arguments || [];
            }
        }

        const resolvedElements = await resolveElements(elements);

        const viewable: ViewRouteClient = {
            location: viewLocation,
            title,
            elements: resolvedElements,
            actions: viewableActions,
        };

        callback(this.RESULT_SUCCESS, Buffer.from(JSON.stringify(viewable)));
    }
}
// #endregion module



// #region exports
export default BluefigViewCharacteristic;
// #endregion exports
