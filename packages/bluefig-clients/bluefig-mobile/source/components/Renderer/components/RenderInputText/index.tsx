// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        Text,
        TextInput,
        StyleSheet,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewInputText,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    text: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
});


export interface RenderInputTextProperties {
    element: ViewInputText;
}

const RenderInputText: React.FC<RenderInputTextProperties> = (
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
        isDarkMode,

        setValue,
        getValue,
    } = context;
    // #endregion context


    // #region properties
    const {
        element,
    } = properties;
    // #endregion properties


    // #region handlers
    const onChangeText = (
        value: string,
    ) => {
        setValue(
            element.store,
            value,
        );
    }
    // #endregion handlers


    // #region render
    if (!element.store) {
        return (
            <View />
        );
    }

    return (
        <View
            style={[
                styles.container,
            ]}
        >
            {element.title && (
                <Text
                    style={[
                        styles.text,
                        {
                            color: isDarkMode ? Colors.white : Colors.black,
                        },
                    ]}
                >
                    {element.title}
                </Text>
            )}

            <TextInput
                key={`input-${(element as any).id}`}
                value={getValue(element.store)}
                onChangeText={onChangeText}
                style={[
                    styles.text,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}
            />
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderInputText;
// #endregion exports
