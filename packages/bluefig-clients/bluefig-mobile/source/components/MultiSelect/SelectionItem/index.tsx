// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        Text,
        Switch,
        StyleSheet,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import Context from '../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    container: {
        padding: 20,
        display: 'flex',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        minHeight: 22,
    },
});


export interface SelectionItemProperties {
    title: string;
    selected: boolean;

    change: (
        title: string,
        value: boolean,
    ) => void;
}

const SelectionItem: React.FC<SelectionItemProperties> = (
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
        isDarkMode,
    } = context;
    // #endregion context


    // #region properties
    const {
        title,
        selected,

        change,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <View
            style={[
                styles.container,
            ]}
        >
            <Text
                style={[
                    styles.text,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}
            >
                {title}
            </Text>

            <Switch
                value={selected}
                onValueChange={(value) => {
                    change(
                        title,
                        value,
                    );
                }}
                trackColor={{
                    true: '#454f54',
                }}
            />
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default SelectionItem;
// #endregion exports
