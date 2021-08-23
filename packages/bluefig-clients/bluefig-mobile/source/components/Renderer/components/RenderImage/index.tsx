// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
        Image,
        StyleSheet,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewImage,
    } from '../../../../data/interfaces';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
const styles = StyleSheet.create({
    image: {
        width: 100,
        height: 100,
    },
});


export interface RenderImageProperties {
    element: ViewImage;
}

const RenderImage: React.FC<RenderImageProperties> = (
    properties,
) => {
    // #region context
    const context = useContext(Context);
    if (!context) {
        return (
            <View />
        );
    }
    // #endregion context


    // #region properties
    const {
        element,
    } = properties;

    if (
        !element
        || !element.source
    ) {
        return (
            <View />
        );
    }

    const {
        source,
        contentType,
        width,
        height,
        alignment,
    } = element;

    const imageType = contentType || 'image/png';
    const imageURI = `data:${imageType};base64,${source}`;

    const justifyContent = alignment === 'right'
        ? 'flex-end'
        : alignment === 'center'
            ? 'center'
            : 'flex-start';
    // #endregion properties


    // #region render
    return (
        <View>
            <Image
                style={{
                    justifyContent,
                    alignItems: 'center',
                }}
                source={{
                    uri: imageURI,
                    width: width || 100,
                    height: height || 100,
                }}
            />
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderImage;
// #endregion exports
