// #region imports
    // #region libraries
    import {
        BluetoothSerialPortServer,
    } from 'bluetooth-serial-port';
    // #endregion libraries


    // #region imports
    import {
        viewsPath,
    } from '~data/constants';

    import {
        ViewRoute,
    } from '~data/interfaces';
    // #endregion imports
// #endregion imports



// #region module
export const writeErrorHandle = (
    error: any,
) => {
    if (error) {
        console.log('Error!');
    }
};


class View {
    private server: BluetoothSerialPortServer;

    private views: Record<string, ViewRoute> = {};


    constructor(
        server: BluetoothSerialPortServer,
    ) {
        this.server = server;

        this.loadViews();
    }


    private loadViews() {
        try {
            const views = require(viewsPath);
            this.views = views;
        } catch (error) {
            console.log('Could not load views.');
        }
    }

    private writeError(
        errorText?: string,
    ) {
        this.server.write(
            Buffer.from(JSON.stringify({
                errorText,
            })),
            writeErrorHandle,
        );
    }


    public async handle(
        buffer: Buffer,
    ) {
        try {
            const data = JSON.parse(buffer.toString());

            const view = this.views[data.view];
            if (!view) {
                this.writeError('not found');
            }

            if (view.actions && data.action) {
                const action = view.actions[data.action];
                const result = await action(data.payload);

                if (result) {
                    this.server.write(
                        Buffer.from(JSON.stringify({
                            view: result,
                        })),
                        writeErrorHandle,
                    );
                }
            }

            this.server.write(
                Buffer.from(JSON.stringify({
                    view,
                })),
                writeErrorHandle,
            );
        } catch (error) {
            this.writeError('error');
        }
    }
}
// #endregion module



// #region exports
export default View;
// #endregion exports
