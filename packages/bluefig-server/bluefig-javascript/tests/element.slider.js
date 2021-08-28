// #region module
const views = {
    '/': {
        title: 'input slider',
        elements: [
            {
                type: 'input-slider',
                title: 'Input Slider',
                store: 'inputSlider',
                initial: 20,
                action: 'inputSlider',
                maximum: 50,
                minimum: 20,
                step: 1,
            },
        ],
        actions: {
            'inputSlider': {
                arguments: [
                    'inputSlider',
                ],
                execution: async (
                    payload,
                ) => {
                    console.log('inputSlider payload', payload);
                },
            },
        },
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
