// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        Text,
        Button,
        Share,

        StyleSheet,
    } from 'react-native';

    import RNFS from 'react-native-fs';

    import {
        Colors,
    } from 'react-native/Libraries/NewAppScreen';
    // #endregion libraries


    // #region external
    import {
        ViewFile,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    text: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
        minHeight: 22,
    },
});


export interface RenderFileProperties {
    element: ViewFile;
}

const RenderFile: React.FC<RenderFileProperties> = (
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
        element,
    } = properties;

    if (
        !element
        || !element.source
        || !element.title
    ) {
        return (
            <View />
        );
    }

    const {
        source,
        title,
    } = element;
    // #endregion properties


    // #region render
    return (
        <View
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
            }}
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

            <Button
                title="Save"
                onPress={() => {
                    const filepath = RNFS.DocumentDirectoryPath + '/' + title;

                    RNFS.writeFile(filepath, source, 'base64')
                        .then(() => {
                            Share.share({
                                url: filepath,
                                title,
                            });
                        })
                        .catch((error: any) => {
                            console.log('RNFS error', error);
                        });
                }}
            />
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderFile;
// #endregion exports
