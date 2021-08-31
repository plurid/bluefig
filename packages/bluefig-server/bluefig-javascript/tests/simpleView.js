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
                type: 'text',
                value: 'Selectable text',
                selectable: true,
            },
            {
                type: 'text',
                value: `Long text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus massa at turpis vulputate ultrices. Quisque eget mattis sapien, in luctus mauris. Morbi vitae diam neque. Ut vestibulum neque in ex feugiat facilisis. Ut iaculis lorem mauris, vitae tincidunt mi laoreet id. Praesent vel mi non ex dignissim vehicula. Donec a risus sit amet arcu euismod imperdiet ut id felis. Aenean sed tellus neque. Donec quis accumsan nulla. Mauris in nunc risus. Nam sagittis leo arcu, id volutpat augue tristique vitae. Phasellus posuere vehicula blandit. Fusce nec lorem ac tellus finibus pretium. Morbi ipsum nisi, ornare vitae ante gravida, pellentesque pretium neque. Donec non turpis nec nisl fermentum elementum. Mauris pellentesque maximus odio, consectetur aliquam diam egestas non.`,
                selectable: true,
            },
            {
                type: 'input-text',
                title: 'Input Text',
                store: 'inputText',
            },
            {
                type: 'input-text',
                title: 'Input Text With Initial',
                store: 'inputTextWithInitial',
                initial: 'value',
            },
            {
                type: 'input-select',
                title: 'Input Select',
                options: [
                    'one',
                    'two',
                    'three',
                    'four',
                ],
                store: 'inputSelect',
            },
            {
                type: 'input-switch',
                title: 'Input Switch',
                store: 'inputSwitch',
            },
            // {
            //     type: 'image',
            //     source: 'bluefig-logo-128x128.png',
            //     alignment: 'center',
            // },
            {
                type: 'button',
                title: 'Click Me',
                action: 'click',
            },
            {
                type: 'list',
                items: [
                    {
                        type: 'text',
                        value: 'Simple Title',
                    },
                    {
                        type: 'text',
                        value: 'Selectable text',
                        selectable: true,
                    },
                    {
                        type: 'input-text',
                        title: 'Input Text In List',
                        store: 'inputTextInList',
                    },
                    {
                        type: 'list',
                        items: [
                            {
                                type: 'text',
                                value: 'Simple Title',
                            },
                            {
                                type: 'text',
                                value: 'Selectable text',
                                selectable: true,
                            },
                            {
                                type: 'input-text',
                                title: 'Input Text In Nested List',
                                store: 'inputTextInNestedList',
                            },
                        ],
                    }
                ],
            },
        ],
        actions: {
            // click: async () => {
            //     console.log('clicked');
            // },
            'click': {
                arguments: [
                    'inputText',
                    'inputTextWithInitial',
                    'inputSelect',
                ],
                execution: async (
                    ...args
                ) => {
                    console.log('Click action called', args);

                    return views['/test'];
                },
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



    '/readme-example': {
        title: 'Index View',
        elements: [
            {
                type: 'text',
                value: 'this is a simple view',
            },
            {
                type: 'input-text',
                title: 'Input Text',
                store: 'inputTextStore',
            },
            {
                type: 'button',
                title: 'Click Me',
                action: 'clickAction',
            },
        ],
        actions: {
            'clickAction': {
                arguments: [
                    'inputTextStore',
                ],
                execution: async (
                    payload,
                ) => {
                    console.log('Click action called', payload.inputTextStore);
                },
            },
        },
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
