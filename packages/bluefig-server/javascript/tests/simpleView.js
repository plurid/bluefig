// #region module
const views = {
    '/': {
        title: 'one',
        elements: [
            {
                type: 'text',
                value: 'Simple Title',
            },
            {
                type: 'input-text',
                title: 'Name',
                store: 'name',
            },
            {
                type: 'button',
                title: 'Click Me',
                action: 'click',
            },
        ],
        actions: {
            click: async () => {
                console.log('clicked');
            },
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
                execution: async () => {
                    console.log('Click action called');
                },
            },
        },
    },


    '/test-2': {
        elements: [
            {
                type: 'text',
                value: 'one',
            },
            {
                type: 'input-text',
                title: 'Name',
                store: 'name',
            },
            {
                type: 'button',
                title: 'two',
                action: 'click',
            },
        ],
        actions: {
            'click': {
                arguments: [
                    'name',
                ],
                execution: async (
                    name,
                ) => {
                    console.log(`Click action called with name ${name}`);
                },
            },
        },
    },


    '/test-3': {
        elements: [
            {
                type: 'text',
                value: 'one',
            },
            {
                type: 'input-text',
                title: 'Name',
                store: 'name',
            },
            {
                type: 'input-select',
                title: 'Select',
                store: 'select',
                options: [
                    'one',
                    'two',
                    'three',
                ],
                initial: 1,
                exclusive: true,
                action: 'select',
            },
            {
                type: 'button',
                title: 'two',
                action: 'click',
            },
        ],
        actions: {
            'click': {
                arguments: [
                    'name',
                ],
                execution: async (
                    name,
                ) => {
                    console.log(`Click action called with name ${name}`);
                },
            },
            'select': {
                arguments: [
                    'select',
                ],
                execution: async (
                    select,
                ) => {
                    console.log(`Select action called with exclusive selection ${select}`);
                },
            }
        },
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
