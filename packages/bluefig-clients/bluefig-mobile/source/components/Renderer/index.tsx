// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        KeyboardAvoidingView,
        ScrollView,
        View,

        StyleSheet,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewElement,
    } from '../../data/interfaces';

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
const styles = StyleSheet.create({
    container: {
        paddingBottom: 60,
    },
});

export const RenderComponents: Record<string, React.FC<any> | undefined> = {
    'text': RenderText,
    'input-text': RenderInputText,
    'input-select': RenderInputSelect,
    'button': RenderButton,
    'image': RenderImage,
    'list': RenderList,
};


export interface RendererProperties {
    elements?: ViewElement[];
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


    // #region properties
    const {
        elements,
    } = properties;

    const renderElements = elements || view.elements || [];
    // #endregion properties


    // #region render
    return (
        <KeyboardAvoidingView
            behavior="padding"
        >
            <View
                style={[
                    styles.container,
                ]}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 60,
                    }}
                >
                    {renderElements.map(element => {
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
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Renderer;
// #endregion exports
