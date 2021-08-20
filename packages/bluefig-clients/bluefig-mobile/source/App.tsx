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
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
});


const Section: React.FC<{
    title: string;
}> = ({
    children,
    title,
}) => {
    // #region properties
    const isDarkMode = useColorScheme() === 'dark';
    // #endregion properties


    // #region render
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
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

            for (const stateDevice of devices) {
                if (stateDevice.id === device.id) {
                    return;
                }
            }

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
        bluetooth.onStateChange((state) => {
            const subscription = bluetooth.onStateChange((state) => {
                if (state === 'PoweredOn') {
                    scanAndConnect();
                    subscription.remove();
                }
            }, true);

            return () => subscription.remove();
        });
    }, [bluetooth]);
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
                            <Section
                                key={device.id}
                                title={device.name || device.id}
                            >
                                device
                            </Section>
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
