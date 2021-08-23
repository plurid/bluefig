// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        ActivityIndicator,

        StyleSheet,
    } from 'react-native';
    // #endregion libraries
// #endregion imports



// #region module
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10,
    },
});


const Loading: React.FC<any> = () => (
    <View
        style={[
            styles.container,
            styles.horizontal,
        ]}
    >
        <ActivityIndicator />
    </View>
);
// #endregion module



// #region exports
export default Loading;
// #endregion exports
