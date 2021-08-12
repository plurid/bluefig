// #region imports
    // #region libraries
    import {
        BluetoothSerialPortServer,
    } from 'bluetooth-serial-port';
    // #endregion libraries
// #endregion imports



// #region module
class View {
    private server: BluetoothSerialPortServer;


    constructor(
        server: BluetoothSerialPortServer,
    ) {
        this.server = server;

        this.loadViews();
    }


    private loadViews() {

    }


    public handle(
        buffer: Buffer,
    ) {
        console.log('Received data from client: ' + buffer);

        console.log('Sending data to the client');

        this.server.write(Buffer.from('...'), (
            error: any,
        ) => {
            if (error) {
                console.log('Error!');
            }
        });
    }
}
// #endregion module



// #region exports
export default View;
// #endregion exports
