// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        Text,
        TextInput,
        StyleSheet,
        useColorScheme,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewInputText,
    } from '../../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderInputTextProperties {
    element: ViewInputText;

    sendAction: (
        actionName: string,
    ) => void;
}

const RenderInputText: React.FC<RenderInputTextProperties> = (
    properties,
) => {
    // #region properties
    const {
        element,

        sendAction,
    } = properties;
    // #endregion properties


    // #region render
    if (!element.store) {
        return (
            <View />
        );
    }

    return (
        <View>
            {element.title && (
                <Text>
                    {element.title}
                </Text>
            )}

            <TextInput
                value={element?.initial || ''}
                onChangeText={() => {}}
            />
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderInputText;
// #endregion exports
