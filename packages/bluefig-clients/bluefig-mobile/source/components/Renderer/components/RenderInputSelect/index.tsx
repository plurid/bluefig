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

    import MultiSelect from '../../../MultiSelect';

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
        exclusive,
    } = element;

    const storeValue = getValue(store);

    const resolveSelectedValue = () => {
        if (exclusive) {
            if (typeof storeValue !== 'undefined') {
                return storeValue[1];
            }

            if (typeof initial === 'number') {
                return options[initial];
            }

            if (typeof initial === 'string') {
                const value = options.find(option => option === initial);
                if (value) {
                    return value;
                }
            }

            return options[0];
        }


        if (typeof storeValue !== 'undefined') {
            const selected = [];
            for (const stored of storeValue) {
                selected.push(stored[1]);
            }

            return selected;
        }

        if (Array.isArray(initial)) {
            const selected: string[] = [];

            for (const value of initial) {
                if (typeof value === 'number') {
                    selected.push(options[value]);
                    continue;
                }

                if (typeof value === 'string') {
                    const item = options.find(option => option === value);
                    if (item) {
                        selected.push(item);
                        continue;
                    }
                }
            }

            return [
                ...selected,
            ];
        }

        if (typeof initial === 'number') {
            return [
                options[initial],
            ];
        }

        if (typeof initial === 'string') {
            const value = options.find(option => option === initial);
            if (value) {
                return [
                    value,
                ];
            }
        }

        return [];
    }
    const selected = resolveSelectedValue();
    // #endregion properties


    // #region effects
    useEffect(() => {
        const storeValue = getValue(store);

        if (exclusive) {
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
                return;
            }

            if (
                typeof storeValue === 'undefined'
                && typeof initial === 'string'
            ) {
                const initialIndex = options.indexOf(initial);

                if (initialIndex >= 0) {
                    setValue(store, [initialIndex, options[initialIndex]]);
                    return;
                }
            }

            return;
        }


        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'undefined'
        ) {
            setValue(store, []);
            return;
        }

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'number'
        ) {
            setValue(store, [
                options[initial],
            ]);
            return;
        }

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'string'
        ) {
            const initialIndex = options.indexOf(initial);

            if (initialIndex >= 0) {
                setValue(store, [
                    options[initialIndex],
                ]);
                return;
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

            {exclusive && (
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
            )}

            {!exclusive && (
                <MultiSelect
                    items={options}
                    selected={selected}
                    onChange={(selected: string[]) => {
                        const selectedTuples: [number, string][] = [];

                        for (const select of selected) {
                            const index = options.indexOf(select);
                            selectedTuples.push([
                                index, select,
                            ]);
                        }

                        setValue(
                            store,
                            selectedTuples,
                            action,
                        );
                    }}
                />
            )}
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderInputSelect;
// #endregion exports
