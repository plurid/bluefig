// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';
    // #endregion libraries


    // #region internal
    import {
        BLUEFIG_SERVICE_NAME,
    } from './data/constants';

    import BluefigService from './objects/BluefigService';
    // #endregion internal
// #endregion imports



// #region module
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
