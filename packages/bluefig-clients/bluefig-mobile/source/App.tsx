// #region imports
    // #region libraries
    import {
        Buffer,
    } from 'buffer';

    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        SafeAreaView,
        ScrollView,
        View,
        StatusBar,
        RefreshControl,
        ActivityIndicator,

        StyleSheet,
        useColorScheme,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';

    import {
        Device,
        Characteristic,
    } from 'react-native-ble-plx';
    // #endregion libraries


    // #region internal
    import {
        BLUEFIG_SERVICE_UUID,
        BLUEFIG_VIEW_CHARACTERISTIC_UUID,
    } from './data/constants';

    import bluetooth from './services/bluetooth';

    import Renderer from './components/Renderer';
    import DeviceItem from './components/DeviceItem';
    // #endregion internal
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


const App = () => {
    // #region properties
    const isDarkMode = useColorScheme() === 'dark';

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    // #endregion properties


    // #region state
    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        devices,
        setDevices,
    ] = useState<Device[]>([]);

    const [
        activeDevice,
        setActiveDevice,
    ] = useState<Device | null>(null);

    const [
        viewCharacteristic,
        setViewCharacteristic,
    ] = useState<Characteristic | null>(null);

    const [
        view,
        setView,
    ] = useState<any>();
    // #endregion state


    // #region handlers
    const scanAndConnect = () => {
        let setState = false;
        const scannedDevices: Device[]  = [];

        bluetooth.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }

            if (!device) {
                return;
            }

            for (const scannedDevice of scannedDevices) {
                if (scannedDevice.id === device.id) {
                    return;
                }
            }

            scannedDevices.push(device);

            setTimeout(() => {
                bluetooth.stopDeviceScan();

                if (!setState) {
                    setDevices([
                        ...scannedDevices,
                    ]);
                    setLoading(false);
                    setState = true;
                }
            }, 10_000);
        });
    }

    const onRefresh = () => {
        setLoading(true);
        setDevices([]);
        setActiveDevice(null);

        scanAndConnect();
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        console.log('devices.length', devices.length);

        bluetooth.onStateChange((state) => {
            const subscription = bluetooth.onStateChange((state) => {
                if (state === 'PoweredOn') {
                    scanAndConnect();
                    subscription.remove();
                }
            }, true);

            return () => subscription.remove();
        });
    }, [
        devices.length,
        // bluetooth,
    ]);

    useEffect(() => {
        const connect = async () => {
            try {
                if (!activeDevice) {
                    return;
                }

                const connectedDevice = await activeDevice.connect();
                const servicedDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
                const services = await servicedDevice.services();

                for (const service of services) {
                    console.log('service', service.uuid);
                    let viewCharacteristicFound = false;

                    if (service.uuid === BLUEFIG_SERVICE_UUID) {
                        console.log('bluefig service', service.uuid);
                        const characteristics = await service.characteristics();

                        for (const characteristic of characteristics) {
                            console.log('characteristic', characteristic.uuid);
                            if (characteristic.uuid === BLUEFIG_VIEW_CHARACTERISTIC_UUID) {
                                console.log('view characteristic', characteristic.uuid);
                                setViewCharacteristic(characteristic);
                                viewCharacteristicFound = true;
                                break;
                            }
                        }
                    }

                    if (viewCharacteristicFound) {
                        break;
                    }
                }
            } catch (error) {
                console.log('connect error', error);
            }
        }

        connect();
    }, [
        activeDevice,
    ]);

    useEffect(() => {
        if (!viewCharacteristic) {
            return;
        }

        const read = async () => {
            const data = await viewCharacteristic.read();
            if (!data.value) {
                return;
            }

            const buffer = Buffer.from(data.value, 'base64');
            const value = buffer.toString();
            console.log('value', value);

            const viewFromValue = {
                elements: [
                    {
                        type: 'text',
                        value: 'one',
                    },
                    {
                        type: 'button',
                        title: 'two',
                    },
                ],
            };
            setView(viewFromValue);
        }

        read();
    }, [
        viewCharacteristic,
    ]);
    // #endregion effects


    // #region render
    return (
        <SafeAreaView
            style={backgroundStyle}
        >
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={onRefresh}
                    />
                }
                style={backgroundStyle}
            >
                {loading && (
                    <View
                        style={[
                            styles.container,
                            styles.horizontal,
                        ]}
                    >
                        <ActivityIndicator />
                    </View>
                )}

                {!loading && !viewCharacteristic && (
                    <View
                        style={{
                            backgroundColor: isDarkMode ? Colors.black : Colors.white,
                            height: '100%',
                        }}
                    >
                        {devices.map(device => {
                            return (
                                <DeviceItem
                                    key={device.id}
                                    title={device.localName || device.name || device.id}
                                    onPress={async () => {
                                        setActiveDevice(device);
                                    }}
                                />
                            );
                        })}
                    </View>
                )}

                {!loading && viewCharacteristic && view && (
                    <Renderer
                        view={view}
                    />
                )}
            </ScrollView>
        </SafeAreaView>
    );
    // #endregion render
};
// #endregion module



// #region exports
export default App;
// #endregion exports
