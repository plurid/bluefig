// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        StyleSheet,
    } from 'react-native';
    // #endregion libraries


    // #region internal
    import SelectionItem from './SelectionItem';
    // #endregion internal
// #endregion imports



// #region module
const styles = StyleSheet.create({
    container: {
        padding: 10,
        paddingBottom: 20,
    },
});


export interface MultiSelectProperties {
    items: string[];
    selected: string[];

    onChange: (selected: string[]) => void;
}

const MultiSelect: React.FC<MultiSelectProperties> = (
    properties,
) => {
    // #region properties
    const {
        items,
        selected,

        onChange,
    } = properties;
    // #endregion properties


    // #region render
    return (
        <View
            style={[
                styles.container,
            ]}
        >
            {items.map((item) => {
                return (
                    <SelectionItem
                        key={Math.random() + ''}
                        title={item}
                        selected={selected.includes(item)}
                        change={(
                            title,
                            value,
                        ) => {
                            if (value) {
                                const newSelected = [
                                    ...new Set([
                                        ...selected,
                                        title,
                                    ]),
                                ];
                                onChange(newSelected);
                                return;
                            }

                            const newSelected = selected.filter(value => value !== title);
                            onChange(newSelected);
                        }}
                    />
                )
            })}
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default MultiSelect;
// #endregion exports
