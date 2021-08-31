// #region module
const views = {
    '/text': {
        title: 'text',
        elements: [
            {
                type: 'text',
                value: 'Text',
            },
        ],
    },
    '/input-text': {
        title: 'input text',
        elements: [
            {
                type: 'input-text',
                title: 'Input Text',
                store: 'inputText',
            },
        ],
    },
    '/input-select': {
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
                ],
                initial: 1,
                exclusive: true,
            },
        ],
    },
    '/input-switch': {
        title: 'input switch',
        elements: [
            {
                type: 'input-switch',
                title: 'Input Switch',
                store: 'inputSwitch',
            },
        ],
    },
    '/input-slider': {
        title: 'input slider',
        elements: [
            {
                type: 'input-slider',
                title: 'Input Slider',
                store: 'inputSlider',
            },
        ],
    },
    '/button': {
        title: 'button',
        elements: [
            {
                type: 'button',
                title: 'Button',
                action: 'actionButton',
            },
        ],
    },
    '/image': {
        title: 'image',
        elements: [
            {
                type: 'image',
                source: 'bluefig-logo-128x128.jpg',
            },
        ],
    },
    '/file': {
        title: 'file',
        elements: [
            {
                type: 'file',
                title: 'Sample File.png',
                source: 'a-file.txt',
            },
        ],
    },
    '/divider': {
        title: 'divider',
        elements: [
            {
                type: 'divider',
            },
        ],
    },
    '/list': {
        title: 'list',
        elements: [
            {
                type: 'list',
                items: [
                    {
                        type: 'text',
                        value: 'Text In List',
                    },
                    {
                        type: 'input-text',
                        title: 'Input Text In List',
                        store: 'inputTextInList',
                    },
                ],
            },
        ],
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
