// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        Text,
        StyleSheet,
        useColorScheme,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewInputSelect,
    } from '../../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface RenderInputSelectProperties {
    element: ViewInputSelect;

    sendAction: (
        actionName: string,
    ) => void;
}

const RenderInputSelect: React.FC<RenderInputSelectProperties> = (
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
