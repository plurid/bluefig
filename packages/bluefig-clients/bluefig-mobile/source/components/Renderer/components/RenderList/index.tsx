// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        StyleSheet,
        useColorScheme,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewList,
    } from '../../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderListProperties {
    element: ViewList;

    sendAction: (
        actionName: string,
    ) => void;
}

const RenderList: React.FC<RenderListProperties> = (
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
        !element.items
        || element.items.length === 0
    ) {
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
export default RenderList;
// #endregion exports
