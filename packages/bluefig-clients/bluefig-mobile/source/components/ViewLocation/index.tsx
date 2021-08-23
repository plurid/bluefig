// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        ScrollView,
        View,
        Text,
        Button,
        RefreshControl,

        StyleSheet,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';

    import {
        Device,
    } from 'react-native-ble-plx';
    // #endregion libraries


    // #region external
    import Renderer from '../Renderer';
    import DeviceItem from '../DeviceItem';
    import Loading from '../Loading';

    import Context from '../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
});


export interface ViewLocationProperties {
    loading: boolean;
    location: string;
    generalStyle: any;
    viewError: string;
    devices: Device[];

    onRefresh: () => void;
    handleConnect: (device: Device) => void;
    handleDisconnect: () => void;
}

const ViewLocation: React.FC<ViewLocationProperties> = (
    properties,
) => {
    // #region context
    const context = useContext(Context);
    if (!context) {
        return (
            <View />
        );
    }

    const {
        view,
        isDarkMode,
    } = context;
    // #endregion context


    // #region properties
    const {
        loading,
        location,
        generalStyle,
        viewError,
        devices,

        onRefresh,
        handleConnect,
        handleDisconnect,
    } = properties;
    // #endregion properties


    // #region render
    if (loading) {
        return (
            <Loading />
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
                        {devices.length === 0 && (
                            <View>
                                <Text>
                                    no devices
                                </Text>
                            </View>
                        )}

                        {devices.map(device => {
                            return (
                                <DeviceItem
                                    key={device.id}
                                    title={device.localName || device.name || device.id}
                                    onPress={() => {
                                        handleConnect(device)
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
                return (
                    <Loading />
                );
            }

            return (
                <View>
                    <Button
                        title="Disconnect"
                        onPress={() => {
                            handleDisconnect();
                        }}
                    />

                    <Renderer
                        key={'renderer' + location}
                    />
                </View>
            );
        default:
            return (<View />);
    }
    // #endregion render
}
// #endregion module



// #region exports
export default ViewLocation;
// #endregion exports
