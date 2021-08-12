// #region imports
    // #region libraries
    import {
        BluetoothSerialPortServer,
    } from 'bluetooth-serial-port';
    // #endregion libraries


    // #region internal
    import View from './objects/View';
    // #endregion internal
// #endregion imports



// #region module
const CHANNEL = parseInt(process.env.BLUEFIG_SERVER_CHANNEL || '') || 10;
const UUID = process.env.BLUEFIG_SERVER_UUID || '2d5b3ea0-fb32-11eb-9a03-0242ac130003';


const main = () => {
    const server = new BluetoothSerialPortServer();
    const view = new View(server);


    server.on('data', (buffer) => {
        view.handle(buffer);
    });

    server.listen(
        (
            clientAddress,
        ) => {
            console.log('Client: ' + clientAddress + ' connected!');
        },
        (
            error,
        ) => {
            console.error('Something wrong happened!:' + error);
        },
        {
            uuid: UUID,
            channel: CHANNEL,
        },
    );
}


main();
// #endregion module
