// #region imports
    // #region libraries
    import {
        BluetoothSerialPortServer,
    } from 'bluetooth-serial-port';
    // #endregion libraries
// #endregion imports



// #region module
const CHANNEL = parseInt(process.env.BLUEFIG_SERVER_CHANNEL || '') || 10;
const UUID = process.env.BLUEFIG_SERVER_UUID || '2d5b3ea0-fb32-11eb-9a03-0242ac130003';


const main = () => {
    const server = new BluetoothSerialPortServer();

    server.on('data', (buffer) => {
        console.log('Received data from client: ' + buffer);

        console.log('Sending data to the client');

        server.write(Buffer.from('...'), (
            error: any,
        ) => {
            if (error) {
                console.log('Error!');
            }
        });
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
