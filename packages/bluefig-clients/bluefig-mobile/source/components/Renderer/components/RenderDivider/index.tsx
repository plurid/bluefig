// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        StyleSheet,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewDivider,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    container: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
});


export interface RenderDividerProperties {
    element: ViewDivider;
}

const RenderDivider: React.FC<RenderDividerProperties> = (
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


    // #region render
    return (
        <View
            style={[
                styles.container,
            ]}
        >
            <View
                style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: isDarkMode ? Colors.white : Colors.black,
                }}
            />
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderDivider;
// #endregion exports
