// #region imports
    // #region libraries
    import React from 'react';

    import {
        View,
        Text,
        TextInput,
        Button,
        StyleSheet,
        useColorScheme,
    } from 'react-native';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewElement,
    } from '../../data/interfaces';
    // #endregion external
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
        elements: ViewElement[];
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
                    case 'input-text':
                        if (!element.store) {
                            return;
                        }

                        return (
                            <View>
                                {element.title && (
                                    <Text>
                                        {element.title}
                                    </Text>
                                )}

                                <TextInput
                                    onChangeText={() => {}}
                                    value={element?.initial || ''}
                                />
                            </View>
                        );
                    case 'input-select':
                        if (
                            !element.store
                            || !element.options
                            || element.options.length === 0
                        ) {
                            return;
                        }

                        return (
                            <View>
                                {element.title && (
                                    <Text>
                                        {element.title}
                                    </Text>
                                )}

                            </View>
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
                    case 'image':
                        if (!element.source) {
                            return;
                        }

                        return (
                            <View>
                            </View>
                        );
                    case 'list':
                        if (
                            !element.items
                            || element.items.length === 0
                        ) {
                            return;
                        }

                        return (
                            <View>
                            </View>
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
