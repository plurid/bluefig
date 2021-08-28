// #region imports
    // #region internal
    import {
        ViewElement,

        ActionPayload,
    } from '../view';
    // #endregion internal
// #endregion imports



// #region module
export type ViewActionExecution = (
    ...payload: any[]
) => Promise<ViewRouteServer | void>;


export type ViewActionServer =
    | {
        arguments: any[];
        execution: ViewActionExecution;
    } | ViewActionExecution;


export interface ViewRouteServer {
    title?: string;
    elements?: ViewElement[];
    actions?: Record<string, ViewActionServer | undefined>;
}


export type ViewsServer = Record<string, ViewRouteServer | undefined>;


export type BluefigNotification = (
    notifcation: string,
) => void;


export type HookResponse = Promise<boolean | string | void>;

export interface Hooks {
    checkToken?: (
        token: string | undefined,
        bluefigNotification: BluefigNotification,
    ) => HookResponse;
    beforeAction?: (
        payload: ActionPayload,
        bluefigNotification: BluefigNotification,
    ) => HookResponse;
}
// #endregion module
