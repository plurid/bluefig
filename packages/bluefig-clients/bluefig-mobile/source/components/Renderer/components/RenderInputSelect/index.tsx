// #region imports
    // #region libraries
    import React, {
        useEffect,
        useContext,
    } from 'react';

    import {
        View,
        Text,
        StyleSheet,
    } from 'react-native';

    import {
        Picker,
    } from '@react-native-picker/picker';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewInputSelect,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    text: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        minHeight: 22,
    },
});


export interface RenderInputSelectProperties {
    element: ViewInputSelect;
}

const RenderInputSelect: React.FC<RenderInputSelectProperties> = (
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

        setValue,
        getValue,
        sendAction,
    } = context;
    // #endregion context


    // #region properties
    const {
        element,
    } = properties;

    if (
        !element
        || !element.store
        || !element.options
        || element.options.length === 0
    ) {
        return (
            <View />
        );
    }

    const {
        store,
        options,
        initial,
        title,
        action,
    } = element;

    const storeValue = getValue(store);
    const selected = typeof storeValue !== 'undefined'
        ? storeValue[1]
        : typeof initial === 'number'
            ? options[initial]
            : typeof initial === 'string'
                ? options.find(option => option === initial) || options[0]
                : options[0];
    // #endregion properties


    // #region effects
    useEffect(() => {
        const storeValue = getValue(store);

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'undefined'
        ) {
            setValue(store, [0, options[0]]);
            return;
        }

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'number'
        ) {
            setValue(store, [initial, options[initial]]);
        }

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'string'
        ) {
            const initialIndex = options.indexOf(initial);

            if (initialIndex >= 0) {
                setValue(store, [initialIndex, options[initialIndex]]);
            } else {
                setValue(store, [0, options[0]]);
            }
        }
    }, []);
    // #endregion effects


    // #region render
    return (
        <View
            style={[
                styles.container,
            ]}
        >
            {title && (
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
            )}

            <Picker
                selectedValue={selected}
                onValueChange={(itemValue, itemIndex) => {
                    setValue(
                        store,
                        [itemIndex, itemValue],
                        action,
                    );
                }}
            >
                {options.map((option) => {
                    return (
                        <Picker.Item
                            key={Math.random() + ''}
                            label={option}
                            value={option}
                            color={isDarkMode ? Colors.white : Colors.black}
                        />
                    );
                })}
            </Picker>
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderInputSelect;
// #endregion exports
