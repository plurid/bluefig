// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        Text,
        Button,

        StyleSheet,
        useColorScheme,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import Separator from '../Separator';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        textAlign: 'center',
    },
});


export interface DeviceItemProperties {
    title: string;
    onPress: () => void;
}

const DeviceItem: React.FC<DeviceItemProperties> = (
    properties,
) => {
    // #region properties
    const {
        title,
        onPress,
    } = properties;

    const isDarkMode = useColorScheme() === 'dark';
    // #endregion properties


    // #region render
    return (
        <View
            style={styles.container}
        >
            <Text
                style={[
                    styles.title,
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
}
// #endregion module



// #region exports
export default DeviceItem;
// #endregion exports
