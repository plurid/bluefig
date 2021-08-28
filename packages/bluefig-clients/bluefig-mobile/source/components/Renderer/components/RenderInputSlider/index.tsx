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
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewInputSlider,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
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


export interface RenderInputSliderProperties {
    element: ViewInputSlider;
}

const RenderInputSlider: React.FC<RenderInputSliderProperties> = (
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
    ) {
        return (
            <View />
        );
    }

    const {
        store,
        initial,
        title,
        action,
        maximum,
        minimum,
        step,
    } = element;

    const storeValue = getValue(store);
    const sliderValue = typeof storeValue === 'number'
        ? storeValue
        : typeof initial === 'number'
            ? initial
            : false;
    // #endregion properties


    // #region effects
    useEffect(() => {
        const storeValue = getValue(store);

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'undefined'
        ) {
            setValue(store, false);
            return;
        }

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'number'
        ) {
            setValue(store, initial);
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


        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderInputSlider;
// #endregion exports