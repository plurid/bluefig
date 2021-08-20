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
        useColorScheme,
        View,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';

    import {
        Device,
    } from 'react-native-ble-plx';
    // #endregion libraries


    // #region internal
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
        devices,
        setDevices,
    ] = useState<Device[]>([]);

    const [
        activeDevice,
        setActiveDevice,
    ] = useState<Device | null>(null);
    // #endregion state


    // #region handlers
    const scanAndConnect = () => {
        bluetooth.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }

            if (!device) {
                return;
            }

            // for (const stateDevice of devices) {
            //     if (stateDevice.id === device.id) {
            //         return;
            //     }
            // }

            setDevices([
                ...devices,
                device,
            ]);

            setTimeout(() => {
                bluetooth.stopDeviceScan();
            }, 15_000);
        });
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
        // devices.length,
        bluetooth,
    ]);

    useEffect(() => {
        const connect = async () => {
            try {
                if (!activeDevice) {
                    return;
                }

                const closedDevice = await activeDevice.cancelConnection();
                const connectedDevice = await closedDevice.connect();
                const servicedDevice = await connectedDevice.discoverAllServicesAndCharacteristics();
                const services = await servicedDevice.services();

                for (const service of services) {
                    console.log('service', service.id);
                }
            } catch (error) {
                console.log('connect error', error);
            }
        }

        connect();
    }, [
        activeDevice,
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
                style={backgroundStyle}
            >
                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}
                >
                    {devices.map(device => {
                        return (
                            <DeviceItem
                                key={device.id}
                                title={device.name || device.id}
                                onPress={async () => {
                                    setActiveDevice(device);
                                }}
                            />
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
    // #endregion render
};
// #endregion module



// #region exports
export default App;
// #endregion exports
