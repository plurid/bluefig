// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        KeyboardAvoidingView,
        ScrollView,
        View,
        Text,

        StyleSheet,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import Context from '../../services/context';
    // #endregion external


    // #region internal
    import RenderText from './components/RenderText';
    import RenderInputText from './components/RenderInputText';
    import RenderInputSelect from './components/RenderInputSelect';
    import RenderInputSwitch from './components/RenderInputSwitch';
    import RenderInputSlider from './components/RenderInputSlider';
    import RenderButton from './components/RenderButton';
    import RenderImage from './components/RenderImage';
    import RenderFile from './components/RenderFile';
    import RenderDivider from './components/RenderDivider';
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
    'input-switch': RenderInputSwitch,
    'input-slider': RenderInputSlider,
    'button': RenderButton,
    'image': RenderImage,
    'file': RenderFile,
    'divider': RenderDivider,
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
        isDarkMode,
        sendingAction,
    } = context;
    if (
        !view
        || !view.elements
    ) {
        return (
            <View />
        );
    }
    // #endregion context


    // #region render
    return (
        <KeyboardAvoidingView
            behavior="padding"
        >
            <View
                style={[
                    styles.container,
                    {
                        opacity: sendingAction ? 0.3 : 1,
                    },
                ]}
                pointerEvents={sendingAction ? 'none' : 'auto'}
            >
                <ScrollView
                    contentContainerStyle={{
                        paddingBottom: 60,
                    }}
                >
                    {view.title && (
                        <View>
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: isDarkMode ? Colors.white : Colors.black,
                                    fontSize: 24,
                                    marginTop: 20,
                                    marginBottom: 20,
                                }}
                            >
                                {view.title}
                            </Text>
                        </View>
                    )}

                    {view.elements.map(element => {
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
