// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        Button,
        StyleSheet,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewButton,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderButtonProperties {
    element: ViewButton;
}

const RenderButton: React.FC<RenderButtonProperties> = (
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
        sendAction,
    } = context;
    // #endregion context


    // #region properties
    const {
        element,
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
