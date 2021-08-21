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

    sendAction: (
        actionName: string,
    ) => void;
}

const Renderer: React.FC<RendererProperties> = (
    properties,
) => {
    // #region properties
    const {
        view,

        sendAction,
    } = properties;

    const isDarkMode = useColorScheme() === 'dark';
    // #endregion properties


    // #region render
    return (
        <View>
            {view.elements && view.elements.map(element => {
                if (!element?.type) {
                    return;
                }

                switch (element.type) {
                    case 'text':
                        if (!element.value) {
                            return;
                        }

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
                        if (
                            !element.title
                            || !element.action
                        ) {
                            return;
                        }

                        return (
                            <Button
                                key={Math.random() + ''}
                                title={element.title}
                                onPress={() => {
                                    sendAction(
                                        element.action,
                                    );
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
