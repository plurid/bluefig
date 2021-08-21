// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        StyleSheet,
    } from 'react-native';
    // #endregion libraries
// #endregion imports



// #region module
const styles = StyleSheet.create({
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});


const Separator: React.FC<any> = () => (
    <View
        style={styles.separator}
    />
);
// #endregion module



// #region exports
export default Separator;
// #endregion exports
