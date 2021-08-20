// #region imports
    // #region libraries
    import noble from '@abandonware/noble';
    // #endregion libraries


    // #region imports
    import {
        viewsPath,
    } from '~data/constants';

    import {
        Views,
        RequestView,
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
    private server: any;

    private views: Views = {};


    constructor(
        server: any,
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

    private async handleNotFound(
        error?: string,
    ) {
        this.writeError(error);
    }

    private async handleError(
        error?: string,
    ) {
        this.writeError(error);
    }


    public async handle(
        buffer: Buffer,
    ) {
        try {
            const data: RequestView = JSON.parse(buffer.toString());

            const view = this.views[data.view];
            if (!view) {
                this.handleNotFound('not found');
                return;
            }

            if (view.actions && data.action) {
                const action = view.actions[data.action];
                if (!action) {
                    this.handleNotFound('no action');
                    return;
                }
                const result = await action(data.payload);

                if (result) {
                    this.server.write(
                        Buffer.from(JSON.stringify({
                            view: result,
                        })),
                        writeErrorHandle,
                    );
                    return;
                }
            }

            this.server.write(
                Buffer.from(JSON.stringify({
                    view,
                })),
                writeErrorHandle,
            );
        } catch (error) {
            this.handleError('error');
        }
    }
}
// #endregion module



// #region exports
export default View;
// #endregion exports
