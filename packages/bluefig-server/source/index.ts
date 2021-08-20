// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';
    // #endregion libraries
// #endregion imports



// #region module
const BLUEFIG_NAME = 'Bluefig';
const BLUEFIG_UUID = '2d5b3ea0-fb32-11eb-9a03-0242ac130003';
const BLUEFIG_VIEW_UUID = '2d5b3ea0-fb32-11eb-9a03-0242ac130004';


class BluefigViewCharacteristic extends bleno.Characteristic {
    constructor() {
        super({
            uuid: BLUEFIG_VIEW_UUID,
            properties: ['read', 'write'],
            descriptors: [
                new bleno.Descriptor({
                    uuid: '2901',
                    value: 'Gets or sets the bluefig view.',
                }),
            ],
        });
    }


    public onWriteRequest(
        data: any,
        offset: any,
        withoutResponse: any,
        callback: any,
    ) {
        callback(this.RESULT_SUCCESS);
    }

    public onReadRequest(
        offset: any,
        callback: any,
    ) {
        callback(this.RESULT_SUCCESS, Buffer.from('1'));
    }
}


class BluefigService extends bleno.PrimaryService {
    constructor() {
        super({
            uuid: BLUEFIG_UUID,
            characteristics: [
                new BluefigViewCharacteristic(),
            ]
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
            bleno.startAdvertising(BLUEFIG_NAME, [bluefigService.uuid], (error) => {
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
