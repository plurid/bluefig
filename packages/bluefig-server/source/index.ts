// #region imports
    // #region libraries
    import noble from '@abandonware/noble';
    // #endregion libraries


    // #region internal
    import View from './objects/View';
    // #endregion internal
// #endregion imports



// #region module
const CHANNEL = parseInt(process.env.BLUEFIG_SERVER_CHANNEL || '') || 10;
const UUID = process.env.BLUEFIG_SERVER_UUID || '2d5b3ea0-fb32-11eb-9a03-0242ac130003';


const main = () => {
    noble.on('stateChange', (state) => {
        if (state === 'poweredOn') {
            //
            // Once the BLE radio has been powered on, it is possible
            // to begin scanning for services. Pass an empty array to
            // scan for all services (uses more time and power).
            //
            console.log('scanning...');
            noble.startScanning([UUID], false);
        }
        else {
          noble.stopScanning();
        }
    });


    noble.on('discover', (peripheral) => {
        // we found a peripheral, stop scanning
        noble.stopScanning();

        //
        // The advertisment data contains a name, power level (if available),
        // certain advertised service uuids, as well as manufacturer data,
        // which could be formatted as an iBeacon.
        //
        console.log('found peripheral:', peripheral.advertisement);

        //
        // Once the peripheral has been discovered, then connect to it.
        //
        peripheral.connect((err) => {
            //
            // Once the peripheral has been connected, then discover the
            // services and characteristics of interest.
            //
            peripheral.discoverServices([UUID], (err, services) => {
                services.forEach((service) => {
                    //
                    // This must be the service we were looking for.
                    //
                    console.log('found service:', service.uuid);

                    //
                    // So, discover its characteristics.
                    //
                    service.discoverCharacteristics([], (err, characteristics) => {
                        characteristics.forEach((characteristic) => {
                            //
                            // Loop through each characteristic and match them to the
                            // UUIDs that we know about.
                            //
                            console.log('found characteristic:', characteristic.uuid);
                        });
                    });
                });
            });
        });
    });
}


main();
// #endregion module
