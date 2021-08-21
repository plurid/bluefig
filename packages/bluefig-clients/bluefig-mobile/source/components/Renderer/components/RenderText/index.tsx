// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        Text,
        StyleSheet,
        useColorScheme,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewText,
    } from '../../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    sectionText: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
});


export interface RenderTextProperties {
    element: ViewText;
}

const RenderText: React.FC<RenderTextProperties> = (
    properties,
) => {
    // #region properties
    const {
        element
    } = properties;

    const isDarkMode = useColorScheme() === 'dark';
    // #endregion properties


    // #region render
    if (!element.value) {
        return (
            <View />
        );
    }

    return (
        <Text
            key={Math.random() + ''}
            style={[
                styles.sectionText,
                {
                    color: isDarkMode ? Colors.white : Colors.black,
                },
            ]}
        >
            {element.value}
        </Text>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderText;
// #endregion exports
