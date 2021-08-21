// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        Text,
        TextInput,
        Button,
        StyleSheet,
        useColorScheme,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewImage,
    } from '../../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderImageProperties {
    element: ViewImage;

    sendAction: (
        actionName: string,
    ) => void;
}

const RenderImage: React.FC<RenderImageProperties> = (
    properties,
) => {
    // #region properties
    const {
        element,

        sendAction,
    } = properties;
    // #endregion properties


    // #region render
    if (!element.source) {
        return (
            <View />
        );
    }

    return (
        <View>
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderImage;
// #endregion exports
