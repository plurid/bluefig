// #region imports
    // #region libraries
    import React, {
        useEffect,
    } from 'react';

    import BleManager from 'react-native-ble-manager';

    import {
        StatusBar,
    } from 'expo-status-bar';

    import {
        StyleSheet,
        Text,
        View,

        NativeAppEventEmitter,
    } from 'react-native';
    // #endregion libraries
// #endregion imports



// #region module
const App = () =>{
    // #region effects
    useEffect(() => {
        BleManager.start({
            showAlert: false,
        });

        const handleBle = (
            data: any,
        ) => {
            console.log(data) // Name of peripheral device
        }
        NativeAppEventEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleBle,
        );

        return () => {
            NativeAppEventEmitter.removeListener(
                'BleManagerDiscoverPeripheral',
                handleBle,
            );
        }
    }, [

    ]);
    // #endregion effects


    // #region render
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
    // #endregion render
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
