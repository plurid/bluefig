// #region imports
    // #region libraries
    import React from 'react';
    // #endregion libraries


    // #region external
    import {
        ViewRouteClient,
        Notification,
    } from '../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export interface IContext {
    view: ViewRouteClient | null;
    notifications: Notification[];
    isDarkMode: boolean;

    setValue: (key: string, value: any, action?: string) => void;
    getValue: (key: string) => any;
    sendAction: (name: string) => void;
}

const Context = React.createContext<IContext | null>(null);
// #endregion module



// #region exports
export default Context;
// #endregion exports
