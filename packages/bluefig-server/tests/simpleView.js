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
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
