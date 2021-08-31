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
    import BluefigViewCharacteristic from './objects/BluefigViewCharacteristic';
    // #endregion internal
// #endregion imports



// #region module
const main = (
    bluefigService?: BluefigService,
) => {
    bluefigService = bluefigService || new BluefigService();


    bleno.on(BLUETOOTH.STATE_CHANGE, (state) => {
        if (!bluefigService) {
            return;
        }

        if (state === BLUETOOTH.POWERED_ON) {
            bleno.startAdvertising(
                BLUEFIG_SERVICE_NAME,
                [bluefigService.uuid],
                (error) => {
                    if (error) {
                        console.log(`Bluetooth startAdvertising error`, error);
                    }
                },
            );
        } else {
            bleno.stopAdvertising();
        }
    });


    bleno.on(BLUETOOTH.ADVERTISING_START, (error) => {
        if (!bluefigService) {
            return;
        }

        if (error) {
            console.log(`Bluetooth startAdvertising event error`, error);
            return;
        }

        bleno.setServices([
            bluefigService,
        ]);
    });
}


if (require.main === module) {
    main();
}
// #endregion module



// #region exports
export * from '~data/interfaces';

export {
    BluefigService,
    BluefigViewCharacteristic,
};

export default main;
// #endregion exports
