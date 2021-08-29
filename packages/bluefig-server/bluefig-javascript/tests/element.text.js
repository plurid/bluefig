// #region module
const views = {
    '/': {
        title: 'text',
        elements: [
            {
                type: 'text',
                value: 'Text',
            },
            {
                type: 'button',
                title: 'Next',
                action: 'next',
            },
        ],
        actions: {
            'next': () => {
                return views['/long-text'];
            },
        },
    },
    '/long-text': {
        title: 'text long',
        elements: [
            {
                type: 'text',
                value: `Long text Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum faucibus massa at turpis vulputate ultrices. Quisque eget mattis sapien, in luctus mauris. Morbi vitae diam neque. Ut vestibulum neque in ex feugiat facilisis. Ut iaculis lorem mauris, vitae tincidunt mi laoreet id. Praesent vel mi non ex dignissim vehicula. Donec a risus sit amet arcu euismod imperdiet ut id felis. Aenean sed tellus neque. Donec quis accumsan nulla. Mauris in nunc risus. Nam sagittis leo arcu, id volutpat augue tristique vitae. Phasellus posuere vehicula blandit. Fusce nec lorem ac tellus finibus pretium. Morbi ipsum nisi, ornare vitae ante gravida, pellentesque pretium neque. Donec non turpis nec nisl fermentum elementum. Mauris pellentesque maximus odio, consectetur aliquam diam egestas non.`,
                selectable: true,
            },
            {
                type: 'button',
                title: 'Previous',
                action: 'previous',
            },
        ],
        actions: {
            'previous': () => {
                return views['/'];
            },
        },
    },
};
// #endregion module



// #region exports
module.exports = views;
// #endregion exports
