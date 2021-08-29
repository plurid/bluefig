// #region module
const views = {
    '/': {
        title: 'notifications',
        elements: [
            {
                type: 'button',
                title: 'Notify',
                action: 'notify',
            },
        ],
        actions: {
            'notify': {
                arguments: [],
                execution: async (
                    _,
                    notify,
                ) => {
                    const id = Math.random() + '';

                    const message = `notify ${id}`;
                    console.log(`notify with message '${message}'`, );

                    notify(message);

                    return views['/'];
                },
            },
        },
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
