// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import Context from '../../services/context';
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
export const RenderComponents: Record<string, React.FC<any> | undefined> = {
    'text': RenderText,
    'input-text': RenderInputText,
    'input-select': RenderInputSelect,
    'button': RenderButton,
    'image': RenderImage,
    'list': RenderList,
};


export interface RendererProperties {
}

const Renderer: React.FC<RendererProperties> = (
    properties,
) => {
    // #region context
    const context = useContext(Context);
    if (!context) {
        return (
            <View />
        );
    }

    const {
        view,
    } = context;
    if (!view) {
        return (
            <View />
        );
    }
    // #endregion context


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

                const Component = RenderComponents[element.type];
                if (!Component) {
                    return (
                        <View
                            key={Math.random() + ''}
                        />
                    );
                }

                return (
                    <Component
                        key={(element as any).id || Math.random() + ''}
                        element={element}
                    />
                );
            })}
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Renderer;
// #endregion exports
