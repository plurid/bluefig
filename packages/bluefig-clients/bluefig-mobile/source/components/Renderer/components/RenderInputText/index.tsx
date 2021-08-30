// #region imports
    // #region libraries
    import React, {
        useContext,
        useEffect,
    } from 'react';

    import {
        View,
        Text,
        TextInput,
        StyleSheet,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewInputText,
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


export interface RenderInputTextProperties {
    element: ViewInputText;
}

const RenderInputText: React.FC<RenderInputTextProperties> = (
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
    ) {
        return (
            <View />
        );
    }

    const {
        store,
        title,
        initial,
        secure,
    } = element;

    const storeValue = getValue(store);
    const textValue = typeof storeValue === 'string'
        ? storeValue
        : typeof initial === 'string'
            ? initial
            : '';
    // #endregion properties


    // #region handlers
    const onChangeText = (
        value: string,
    ) => {
        setValue(
            store,
            value || '',
        );
    }
    // #endregion handlers


    // #region effects
    useEffect(() => {
        const storeValue = getValue(store);

        if (
            typeof storeValue === 'undefined'
            && typeof initial === 'string'
        ) {
            setValue(
                store,
                initial,
            );
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
                    {textValue ? title : ''}
                </Text>
            )}

            <TextInput
                key={`input-${(element as any).id}`}
                value={textValue}
                onChangeText={onChangeText}
                style={[
                    styles.text,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}
                placeholder={title}
                spellCheck={false}
                autoCorrect={false}
                autoCapitalize="none"
                autoCompleteType="off"
                secureTextEntry={secure}
            />
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderInputText;
// #endregion exports
