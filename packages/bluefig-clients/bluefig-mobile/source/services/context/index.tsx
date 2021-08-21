// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import {
        ViewRouteClient,
    } from '../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export interface IContext {
    view: ViewRouteClient | null;
    isDarkMode: boolean;
    imagesData: Record<string, string>;

    setValue: (key: string, value: any) => void;
    getValue: (key: string) => any;
    sendAction: (actionName: string) => void;
}

const Context = React.createContext<IContext | null>(null);
// #endregion module



// #region exports
export default Context;
// #endregion exports
