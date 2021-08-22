// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';
    // #endregion libraries


    // #region internal
    import {
        BLUEFIG_SERVICE_NAME,

        BLUETOOTH,
    } from './data/constants';

    import BluefigService from './objects/BluefigService';
    // #endregion internal
// #endregion imports



// #region module
const main = () => {
    const bluefigService = new BluefigService();


    bleno.on(BLUETOOTH.STATE_CHANGE, (state) => {
        if (state === BLUETOOTH.POWERED_ON) {
            bleno.startAdvertising(
                BLUEFIG_SERVICE_NAME,
                [bluefigService.uuid],
                (error) => {
                    if (error) {
                        console.log(error);
                    }
                },
            );
        } else {
            bleno.stopAdvertising();
        }
    });


    bleno.on(BLUETOOTH.ADVERTISING_START, (error) => {
        if (error) {
            return;
        }

        bleno.setServices([
            bluefigService,
        ]);
    });
}


main();
// #endregion module
