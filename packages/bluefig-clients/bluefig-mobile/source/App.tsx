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
        Text,
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

    import {
        ViewRouteClient,
        ActionPayload,
    } from './data/interfaces';

    import Renderer from './components/Renderer';
    import DeviceItem from './components/DeviceItem';

    import Context from './services/context';
    import bluetooth from './services/bluetooth';

    import {
        identifyValue,
    } from './services/utilities';
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

    const generalStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
        color: isDarkMode ? Colors.white : Colors.black,
    };
    // #endregion properties


    // #region state
    const [
        location,
        setLocation,
    ] = useState('/devices');

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
        valuesStore,
        setValuesStore,
    ] = useState<Record<string, any>>({});

    const [
        view,
        setView,
    ] = useState<ViewRouteClient | null>(null);

    const [
        viewError,
        setViewError,
    ] = useState('');
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

    const sendAction = async (
        actionName: string,
    ) => {
        try {
            if (
                !activeDevice
                || !viewCharacteristic
                || !view
            ) {
                return;
            }

            if (!view.actions) {
                return;
            }

            const collectArguments = () => {
                const actionArguments: any[] = [];

                if (!view.actions) {
                    return actionArguments;
                }

                const argumentsData = view.actions[actionName];
                if (!argumentsData) {
                    return actionArguments;
                }

                for (const argumentName of argumentsData) {
                    // based on the argumentName get the value from the values store
                    const value = getValue(argumentName);
                    actionArguments.push(value);
                }

                return actionArguments;
            }
            const actionArguments = collectArguments();

            const actionPayload: ActionPayload = {
                view: view.location,
                name: actionName,
                arguments: actionArguments,
            };

            const data = Buffer.from(JSON.stringify(actionPayload));
            const result = await viewCharacteristic.writeWithResponse(
                data.toString('base64'),
            );
        } catch (error) {
            console.log('error', error);
        }
    }


    const setValue = (
        key: string,
        value: any,
    ) => {
        const newValuesStore = {
            ...valuesStore,
        };
        newValuesStore[key] = value;

        setValuesStore({
            ...newValuesStore,
        });
    }

    const getValue = (
        key: string,
    ) => {
        return valuesStore[key];
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
            try {
                const data = await viewCharacteristic.read();
                if (!data.value) {
                    return;
                }

                const buffer = Buffer.from(data.value, 'base64');
                const value = buffer.toString();
                const viewFromValue = JSON.parse(value);
                const identifiedValue = identifyValue(viewFromValue);
                setView(identifiedValue);
                setViewError('');
            } catch (error) {
                setViewError('no view');
                return;
            }
        }

        read();
    }, [
        viewCharacteristic,
    ]);
    // #endregion effects


    // #region context
    const context = {
        view,
        isDarkMode,
        imagesData: {},

        setValue,
        getValue,
        sendAction,
    };
    // #endregion context


    // #region render
    const ViewLocation = () => {
        if (loading) {
            return (
                <View
                    style={[
                        styles.container,
                        styles.horizontal,
                    ]}
                >
                    <ActivityIndicator />
                </View>
            );
        }

        switch (location) {
            case '/devices':
                return (
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        refreshControl={
                            <RefreshControl
                                refreshing={loading}
                                onRefresh={onRefresh}
                            />
                        }
                        style={generalStyle}
                    >
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
                                            setValuesStore({});
                                            setLocation('/device');
                                        }}
                                    />
                                );
                            })}
                        </View>
                    </ScrollView>
                );
            case '/device':
                if (viewError) {
                    return (
                        <View>
                            <Text>
                                {viewError}
                            </Text>
                        </View>
                    );
                }

                if (!view) {
                    return (<></>);
                }

                return (
                    <Renderer />
                );
            default:
                return (<></>);
        }
    }

    return (
        <SafeAreaView
            style={generalStyle}
        >
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            />

            <Context.Provider
                value={context}
            >
                <ViewLocation />
            </Context.Provider>
        </SafeAreaView>
    );
    // #endregion render
};
// #endregion module



// #region exports
export default App;
// #endregion exports
