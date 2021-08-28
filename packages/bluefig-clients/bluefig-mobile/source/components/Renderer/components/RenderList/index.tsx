// #region imports
    // #region libraries
    import React, {
        useContext,
    } from 'react';

    import {
        View,
    } from 'react-native';
    // #endregion libraries


    // #region external
    import {
        ViewList,
    } from '../../../../data/interfaces';

    import RenderText from '../RenderText';
    import RenderInputText from '../RenderInputText';
    import RenderInputSelect from '../RenderInputSelect';
    import RenderInputSwitch from '../RenderInputSwitch';
    import RenderInputSlider from '../RenderInputSlider';
    import RenderButton from '../RenderButton';
    import RenderImage from '../RenderImage';
    import RenderFile from '../RenderFile';

    import Context from '../../../../services/context';
    // #endregion external
// #endregion imports



// #region module
export const RenderComponents: Record<string, React.FC<any> | undefined> = {
    'text': RenderText,
    'input-text': RenderInputText,
    'input-select': RenderInputSelect,
    'input-switch': RenderInputSwitch,
    'input-slider': RenderInputSlider,
    'button': RenderButton,
    'image': RenderImage,
    'file': RenderFile,
};


export interface RenderListProperties {
    element: ViewList;
}

const RenderList: React.FC<RenderListProperties> = (
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
        || !element.items
        || element.items.length === 0
    ) {
        return (
            <View />
        );
    }

    const {
        items,
    } = element;
    // #endregion properties


    // #region render
    return (
        <View>
            {items.map((item) => {
                if (!item?.type) {
                    return (
                        <View
                            key={Math.random() + ''}
                        />
                    );
                }

                if (item.type === 'list') {
                    return (
                        <RenderList
                            key={(item as any).id || Math.random() + ''}
                            element={item}
                        />
                    );
                }

                const Component = RenderComponents[item.type];
                if (!Component) {
                    return (
                        <View
                            key={Math.random() + ''}
                        />
                    );
                }

                return (
                    <Component
                        key={(item as any).id || Math.random() + ''}
                        element={item}
                    />
                );
            })}
        </View>
    );
    // #endregion render
}
// #endregion module



// #region exports
export default RenderList;
// #endregion exports
