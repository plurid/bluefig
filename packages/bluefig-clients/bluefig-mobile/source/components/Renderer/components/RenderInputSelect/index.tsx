// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        Text,
        StyleSheet,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewInputSelect,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderInputSelectProperties {
    element: ViewInputSelect;
}

const RenderInputSelect: React.FC<RenderInputSelectProperties> = (
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


    // #region render
    if (
        !element.store
        || !element.options
        || element.options.length === 0
    ) {
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

        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderInputSelect;
// #endregion exports
