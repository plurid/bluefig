// #region module
const views = {
    '/': {
        title: 'one',
        elements: [
            {
                type: 'text',
                content: 'Simple Title',
            },
            {
                type: 'button',
                content: 'Click Me',
                action: 'click',
            },
        ],
        actions: {
            click: async () => {
                console.log('clicked');
            }
        },
    },

    '/test': {
        elements: [
            {
                type: 'text',
                value: 'one',
            },
            {
                type: 'button',
                title: 'two',
                action: 'click',
            },
        ],
        actions: {
            'click': {
                arguments: [],
                execution: () => {
                    console.log('Click action called');
                },
            },
        },
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
