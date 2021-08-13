// #region imports
    // #region libraries
    import React, {
        useState,
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

        NativeModules,
        NativeEventEmitter,
    } from 'react-native';
    // #endregion libraries
// #endregion imports



// #region module
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);


const App = () => {
    // #region state
    const [
        peripherals,
        setPeripherals,
    ] = useState<any[]>([]);
    // #endregion state


    // #region effects
    useEffect(() => {
        BleManager.start({
            showAlert: false,
        });

        const handleBle = (
            data: any,
        ) => {
            console.log(data) // Name of peripheral device
            setPeripherals(peripherals => [
                ...peripherals,
                data,
            ]);
        }
        bleManagerEmitter.addListener(
            'BleManagerDiscoverPeripheral',
            handleBle,
        );

        return () => {
            bleManagerEmitter.removeListener(
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
            {peripherals.map(peripheral => {
                return (
                    <Text
                        key={Math.random() + ''}
                    >
                        {peripheral.name}
                    </Text>
                );
            })}

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
