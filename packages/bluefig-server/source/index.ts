// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';
    // #endregion libraries


    // #region internal
    import {
        BLUEFIG_SERVICE_UUID,
        BLUEFIG_VIEW_CHARACTERISTIC_UUID,

        BLUEFIG_SERVICE_NAME,

        viewsPath,
    } from './data/constants';

    import {
        ViewsServer,
    } from '~data/interfaces';
    // #endregion internal
// #endregion imports



// #region module
class BluefigViewCharacteristic extends bleno.Characteristic {
    private views: ViewsServer = {};


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


        this.loadViews();
    }


    private loadViews() {
        try {
            const views = require(viewsPath);
            this.views = views;

            console.log('Views loaded.');
        } catch (error) {
            console.log('Could not load views.');
        }
    }


    public async onWriteRequest(
        data: any,
        offset: any,
        withoutResponse: any,
        callback: any,
    ) {
        try {
            // parsed from data
            const actionPayload = {
                view: '/test',
                name: 'click',
                arguments: [],
            };

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

    public onReadRequest(
        offset: any,
        callback: any,
    ) {
        // load view based on request
        const view = this.views['/test'];
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

        const viewable = {
            title,
            elements,
            actions: viewableActions,
        };

        callback(this.RESULT_SUCCESS, Buffer.from(JSON.stringify(viewable)));
    }
}


class BluefigService extends bleno.PrimaryService {
    constructor() {
        super({
            uuid: BLUEFIG_SERVICE_UUID,
            characteristics: [
                new BluefigViewCharacteristic(),
            ],
        });
    }
}


const main = () => {
    const bluefigService = new BluefigService();


    //
    // Wait until the BLE radio powers on before attempting to advertise.
    // If you don't have a BLE radio, then it will never power on!
    //
    bleno.on('stateChange', (state) => {
        if (state === 'poweredOn') {
            //
            // We will also advertise the service ID in the advertising packet,
            // so it's easier to find.
            //
            bleno.startAdvertising(BLUEFIG_SERVICE_NAME, [bluefigService.uuid], (error) => {
                if (error) {
                    console.log(error);
                }
            });
        } else {
            bleno.stopAdvertising();
        }
    });


    bleno.on('advertisingStart', (error) => {
        if (error) {
            return;
        }

        console.log('advertising...');
        //
        // Once we are advertising, it's time to set up our services,
        // along with our characteristics.
        //
        bleno.setServices([
            bluefigService,
        ]);
    });
}


main();
// #endregion module
