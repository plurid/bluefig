// #region imports
    // #region libraries
    import React from 'react';

    import {
        StatusBar,
    } from 'expo-status-bar';

    import {
        StyleSheet,
        Text,
        View,
    } from 'react-native';
    // #endregion libraries
// #endregion imports



// #region module
function App() {
    return (
        <View
            style={styles.container}
        >
            <Text>
                bluefig
            </Text>

            <StatusBar
                style="auto"
            />
        </View>
    );
}

const styles = StyleSheet.create(
    {
        container: {
            flex: 1,
            backgroundColor: '#fff',
            alignItems: 'center',
            justifyContent: 'center',
        },
    },
);
// #endregion module



// #region exports
export default App;
// #endregion exports
