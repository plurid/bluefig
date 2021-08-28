// #region imports
    // #region libraries
    import React, {
        useState,
        useCallback,
        useEffect,
    } from 'react';

    import {
        SafeAreaView,
        StatusBar,

        StyleSheet,
        useColorScheme,
    } from 'react-native';

    import {
        Device,
        Characteristic,
    } from 'react-native-ble-plx';
    // #endregion libraries


    // #region internal
    import {
        BLUEFIG_SERVICE_UUID,
        BLUEFIG_VIEW_CHARACTERISTIC_UUID,

        VIEW_INDEX,
    } from './data/constants';

    import {
        ViewRouteClient,
        ActionPayload,
    } from './data/interfaces';

    import ViewLocation from './components/ViewLocation';

    import Context from './services/context';
    import bluetooth from './services/bluetooth';

    import {
        identifyView,

        dataToBase64,
        base64ToData,

        readData,
        writeData,
    } from './services/utilities';
    // #endregion internal
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


const App = () => {
    // #region properties
    const isDarkMode = useColorScheme() === 'dark';

    const generalStyle = {
        flexGrow: 1,
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
        viewCharacteristicFound,
        setViewCharacteristicFound,
    ] = useState(false);

    const [
        accessToken,
        setAccessToken,
    ] = useState<string | undefined>();

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
        let timeoutSet = false;
        const scannedDevices: Device[]  = [];
        const scanStart = Date.now();
        const scanTime = 2_000;

        bluetooth.startDeviceScan(null, null, (error, device) => {
            if (error) {
                // Handle error (scanning will be stopped automatically)
                return
            }

            if (
                !device
                || !device.serviceUUIDs
            ) {
                const scanEnd = Date.now();

                if (scanStart + scanTime + 1_000 < scanEnd) {
                    setLoading(false);
                    bluetooth.stopDeviceScan();
                }

                return;
            }

            if (!device.serviceUUIDs.includes(BLUEFIG_SERVICE_UUID)) {
                return;
            }

            for (const scannedDevice of scannedDevices) {
                if (scannedDevice.id === device.id) {
                    return;
                }
            }

            scannedDevices.push(device);

            setTimeout(() => {
                if (timeoutSet) {
                    return;
                }
                timeoutSet = true;

                bluetooth.stopDeviceScan();
                setDevices([
                    ...scannedDevices,
                ]);
                setLoading(false);
            }, scanTime);
        });
    }

    const onRefresh = () => {
        setLoading(true);
        setDevices([]);
        setActiveDevice(null);

        scanAndConnect();
    }


    const getView = async (
        location: string,
    ) => {
        try {
            if (!viewCharacteristic) {
                return;
            }

            const {
                characteristic,
                data,
                finished,
            } = await readData(
                viewCharacteristic,
                location,
            );

            if (!finished) {
                return;
            }

            const view = base64ToData(data);
            if (!view) {
                return;
            }

            if (view.token) {
                setAccessToken(view.token);
            }

            const identifiedView = identifyView(view);
            if (!identifiedView) {
                setViewError('invalid view');
                return;
            }

            setView(identifiedView);
            setViewError('');
            setViewCharacteristic(characteristic);
        } catch (error) {
            setViewError('no view');
        }
    }


    const sendAction = useCallback(async (
        actionName: string,
        updatedValuesStore?: any,
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
                const actionArguments: Record<string, any> = {};

                if (!view.actions) {
                    return actionArguments;
                }

                const argumentsData = view.actions[actionName];
                if (!argumentsData) {
                    return actionArguments;
                }

                for (const argumentName of argumentsData) {
                    const value = getValue(
                        argumentName,
                        updatedValuesStore,
                    );

                    actionArguments[argumentName] = value;
                }

                return actionArguments;
            }
            const actionArguments = collectArguments();


            const actionPayload: ActionPayload = {
                view: view.location,
                name: actionName,
                arguments: actionArguments,
                token: accessToken,
            };

            const {
                characteristic,
                data,
                finished,
            } = await writeData(
                viewCharacteristic,
                dataToBase64(actionPayload),
                accessToken,
                true,
            );
            setViewCharacteristic(characteristic);

            if (!finished) {
                return;
            }

            if (data) {
                const view = base64ToData(data);
                if (
                    !view
                    || !view.location
                ) {
                    return;
                }

                const identifiedView = identifyView(view);
                if (!identifiedView) {
                    setViewError('invalid view');
                    return;
                }
                setView(identifiedView);
            }
        } catch (error) {
            console.log('error', error);
        }
    }, [
        valuesStore,
    ]);

    const setValue = useCallback((
        key: string,
        value: any,
        action?: string,
    ) => {
        const newValue: any = {};
        newValue[key] = value;

        setValuesStore(previousState => {
            const newValuesStore = {
                ...previousState,
                ...newValue,
            };

            if (action) {
                sendAction(
                    action,
                    newValuesStore,
                );
            }

            return newValuesStore;
        });

    }, [
        valuesStore,
    ]);

    const getValue = useCallback((
        key: string,
        updatedValuesStore?: any,
    ) => {
        if (updatedValuesStore) {
            return updatedValuesStore[key];
        }

        return valuesStore[key];
    }, [
        valuesStore,
    ]);


    const handleConnect = (
        device: Device,
    ) => {
        setActiveDevice(device);
        setValuesStore({});
        setLocation('/device');
    }

    const handleDisconnect = () => {
        // reset device data
        setDevices([]);
        setActiveDevice(null);
        setViewCharacteristic(null);
        setViewCharacteristicFound(false);
        setAccessToken(undefined);
        setValuesStore({});
        setView(null);
        setViewError('');

        setLoading(true);
        setLocation('/devices');

        scanAndConnect();
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
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
        bluetooth,
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
                    // console.log('service', service.uuid);
                    let viewCharacteristicFound = false;

                    if (service.uuid === BLUEFIG_SERVICE_UUID) {
                        // console.log('bluefig service', service.uuid);
                        const characteristics = await service.characteristics();

                        for (const characteristic of characteristics) {
                            // console.log('characteristic', characteristic.uuid);
                            if (characteristic.uuid === BLUEFIG_VIEW_CHARACTERISTIC_UUID) {
                                // console.log('view characteristic', characteristic.uuid);
                                setViewCharacteristic(characteristic);
                                viewCharacteristicFound = true;
                                setViewCharacteristicFound(true);
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
        getView(VIEW_INDEX);
    }, [
        viewCharacteristicFound,
    ]);
    // #endregion effects


    // #region context
    const context = {
        view,
        isDarkMode,

        setValue,
        getValue,
        sendAction,
    };
    // #endregion context


    // #region render
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
                <ViewLocation
                    loading={loading}
                    location={location}
                    generalStyle={generalStyle}
                    viewError={viewError}
                    devices={devices}
                    activeDevice={activeDevice}

                    onRefresh={onRefresh}
                    handleConnect={handleConnect}
                    handleDisconnect={() => handleDisconnect()}
                />
            </Context.Provider>
        </SafeAreaView>
    );
    // #endregion render
};
// #endregion module



// #region exports
export default App;
// #endregion exports
