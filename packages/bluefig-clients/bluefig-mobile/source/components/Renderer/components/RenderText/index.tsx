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

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewText,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    sectionText: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        padding: 20,
    },
});


export interface RenderTextProperties {
    element: ViewText;
}

const RenderText: React.FC<RenderTextProperties> = (
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
        element
    } = properties;
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
            selectable={!!element.selectable}
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
