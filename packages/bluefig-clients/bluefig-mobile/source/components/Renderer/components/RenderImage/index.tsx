// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        StyleSheet,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewImage,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderImageProperties {
    element: ViewImage;
}

const RenderImage: React.FC<RenderImageProperties> = (
    properties,
) => {
    // #region context
    const context = useContext(Context);
    if (!context) {
        return (
            <View />
        );
    }
    // #endregion context


    // #region properties
    const {
        element,
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
