// #region module
const views = {
    '/': {
        title: 'elements',
        elements: [
            {
                type: 'button',
                title: 'Text',
                action: 'viewText',
            },
            {
                type: 'button',
                title: 'Input Text',
                action: 'viewInputText',
            },
            {
                type: 'button',
                title: 'Input Select',
                action: 'viewInputSelect',
            },
            {
                type: 'button',
                title: 'Input Switch',
                action: 'viewInputSwitch',
            },
            {
                type: 'button',
                title: 'Input Slider',
                action: 'viewInputSlider',
            },
            {
                type: 'button',
                title: 'Button',
                action: 'viewButton',
            },
            {
                type: 'button',
                title: 'Image',
                action: 'viewImage',
            },
            {
                type: 'button',
                title: 'File',
                action: 'viewFile',
            },
            {
                type: 'button',
                title: 'Divider',
                action: 'viewDivider',
            },
            {
                type: 'button',
                title: 'List',
                action: 'viewList',
            },
        ],
        actions: {
            'viewText': async () => {
                return views['/text'];
            },
            'viewInputText': async () => {
                return views['/input-text'];
            },
            'viewInputSelect': async () => {
                return views['/input-select'];
            },
            'viewInputSwitch': async () => {
                return views['/input-switch'];
            },
            'viewInputSlider': async () => {
                return views['/input-slider'];
            },
            'viewButton': async () => {
                return views['/button'];
            },
            'viewImage': async () => {
                return views['/image'];
            },
            'viewFile': async () => {
                return views['/file'];
            },
            'viewDivider': async () => {
                return views['/divider'];
            },
            'viewList': async () => {
                return views['/list'];
            },
        },
    },
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
