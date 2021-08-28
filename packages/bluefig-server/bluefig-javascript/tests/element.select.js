// #region module
const views = {
    '/': {
        title: 'input select',
        elements: [
            {
                type: 'input-select',
                title: 'Input Select',
                store: 'inputSelect',
                options: [
                    'one',
                    'two',
                    'three',
                    'four',
                    'five',
                ],
                action: 'inputSelect',
            },
        ],
        actions: {
            'inputSelect': {
                arguments: [
                    'inputSelect',
                ],
                execution: async (
                    payload,
                ) => {
                    console.log('inputSelect payload', payload);
                },
            },
        },
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
