// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

    import {
        SafeAreaView,
        ScrollView,
        StatusBar,
        StyleSheet,
        Text,
        Button,
        ActivityIndicator,
        useColorScheme,
        View,
        RefreshControl,
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
    // #endregion internal
// #endregion imports



// #region module
const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    separator: {
        marginVertical: 8,
        borderBottomColor: '#737373',
        borderBottomWidth: StyleSheet.hairlineWidth,
    },


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


const Separator = () => (
    <View style={styles.separator} />
);


const DeviceItem: React.FC<{
    title: string;
    onPress: () => void,
}> = ({
    title,
    onPress,
}) => {
    // #region properties
    const isDarkMode = useColorScheme() === 'dark';
    // #endregion properties


    // #region render
    return (
        <View
            style={styles.sectionContainer}
        >
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}
            >
                {title}
            </Text>

            <Button
                title="Connect"
                onPress={() => onPress()}
            />

            <Separator />
        </View>
    );
    // #endregion render
};


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

                {!loading && viewCharacteristic && (
                    <View>
                        <Text
                            style={[
                                styles.sectionTitle,
                                {
                                    color: isDarkMode ? Colors.white : Colors.black,
                                },
                            ]}
                        >
                            viewCharacteristic {viewCharacteristic.uuid}
                        </Text>
                    </View>
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
