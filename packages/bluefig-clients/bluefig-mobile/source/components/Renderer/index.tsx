// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewElement,
    } from '../../data/interfaces';
    // #endregion external


    // #region internal
    import RenderText from './components/RenderText';
    import RenderInputText from './components/RenderInputText';
    import RenderInputSelect from './components/RenderInputSelect';
    import RenderButton from './components/RenderButton';
    import RenderImage from './components/RenderImage';
    import RenderList from './components/RenderList';
    // #endregion internal
// #endregion imports



// #region module
export interface RendererProperties {
    view: {
        elements: ViewElement[];
    };

    sendAction: (
        actionName: string,
    ) => void;
}

const Renderer: React.FC<RendererProperties> = (
    properties,
) => {
    // #region properties
    const {
        view,

        sendAction,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <View>
            {view.elements && view.elements.map(element => {
                if (!element?.type) {
                    return (
                        <View
                            key={Math.random() + ''}
                        />
                    );
                }

                switch (element.type) {
                    case 'text':
                        return (
                            <RenderText
                                key={Math.random() + ''}
                                element={element}
                            />
                        );
                    case 'input-text':
                        return (
                            <RenderInputText
                                key={Math.random() + ''}
                                element={element}
                                sendAction={sendAction}
                            />
                        );
                    case 'input-select':
                        return (
                            <RenderInputSelect
                                key={Math.random() + ''}
                                element={element}
                                sendAction={sendAction}
                            />
                        );
                    case 'button':
                        return (
                            <RenderButton
                                key={Math.random() + ''}
                                element={element}
                                sendAction={sendAction}
                            />
                        );
                    case 'image':
                        return (
                            <RenderImage
                                key={Math.random() + ''}
                                element={element}
                                sendAction={sendAction}
                            />
                        );
                    case 'list':
                        return (
                            <RenderList
                                key={Math.random() + ''}
                                element={element}
                                sendAction={sendAction}
                            />
                        );
                }
            })}
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Renderer;
// #endregion exports
