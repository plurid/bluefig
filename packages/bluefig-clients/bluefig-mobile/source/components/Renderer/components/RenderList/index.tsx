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
        ViewList,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';

    import Renderer from '../../index';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderListProperties {
    element: ViewList;
}

const RenderList: React.FC<RenderListProperties> = (
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
    } = context;
    // #endregion context


    // #region properties
    const {
        element,
    } = properties;

    if (
        !element
        || !element.items
        || element.items.length === 0
    ) {
        return (
            <View />
        );
    }

    const {
        items,
    } = element;
    // #endregion properties


    // #region render
    return (
        <Renderer
            elements={items}
        />
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderList;
// #endregion exports
