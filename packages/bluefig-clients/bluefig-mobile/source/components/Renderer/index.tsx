// #region imports
    // #region libraries
    import React, {
        useState,
        useEffect,
    } from 'react';

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
// #endregion imports



// #region module
const styles = StyleSheet.create({
    sectionText: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
});


export interface RendererProperties {
    view: {
        elements: any[];
    };
}

const Renderer: React.FC<RendererProperties> = (
    properties,
) => {
    // #region properties
    const {
        view,
    } = properties;

    const isDarkMode = useColorScheme() === 'dark';
    // #endregion properties


    // #region render
    return (
        <View>
            {view.elements.map(element => {
                switch (element.type) {
                    case 'text':
                        return (
                            <Text
                                key={Math.random() + ''}
                                style={[
                                    styles.sectionText,
                                    {
                                        color: isDarkMode ? Colors.white : Colors.black,
                                    },
                                ]}
                            >
                                {element.value}
                            </Text>
                        );
                    case 'button':
                        return (
                            <Button
                                key={Math.random() + ''}
                                title={element.title}
                                onPress={() => {
                                    // call action
                                }}
                            />
                        );
                }
            })}
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default Renderer;
// #endregion exports
