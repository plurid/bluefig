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
        ViewButton,
    } from '../../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderButtonProperties {
    element: ViewButton;

    sendAction: (
        actionName: string,
    ) => void;
}

const RenderButton: React.FC<RenderButtonProperties> = (
    properties,
) => {
    // #region properties
    const {
        element,

        sendAction,
    } = properties;
    // #endregion properties


    // #region render
    if (
        !element.title
        || !element.action
    ) {
        return (
            <View />
        );
    }

    return (
        <Button
            key={Math.random() + ''}
            title={element.title}
            onPress={() => {
                sendAction(
                    element.action,
                );
            }}
        />
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderButton;
// #endregion exports
