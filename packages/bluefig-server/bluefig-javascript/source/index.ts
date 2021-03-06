// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';

    import delog from '@plurid/delog';
    // #endregion libraries


    // #region internal
    import {
        SERVICE_NAME,

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
                SERVICE_NAME,
                [bluefigService.uuid],
                (error) => {
                    if (error) {
                        delog({
                            text: 'startAdvertising error',
                            level: 'error',
                            error,
                        });
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
            delog({
                text: 'startAdvertising event error',
                level: 'error',
                error,
            });
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
export * from '~data/constants/bluefig';

export {
    BluefigService,
    BluefigViewCharacteristic,
};

export default main;
// #endregion exports
