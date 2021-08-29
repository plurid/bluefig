// #region imports
    // #region internal
    import {
        ViewElement,
    } from '../view';
    // #endregion internal
// #endregion imports



// #region module
export type ViewActionResult = Promise<ViewRouteServer | void>;

export type ViewActionExecution<P = Record<string, any>> = (
    payload: P | undefined,
    bluefigNotification: BluefigNotification,
) => ViewActionResult;


export type ViewActionServer =
    | {
        arguments: any[];
        execution: ViewActionExecution;
    } | ViewActionExecution;


export interface ViewRouteServer {
    location?: string;
    title?: string;
    elements?: ViewElement[];
    actions?: Record<string, ViewActionServer | undefined>;
}


export type ViewsServer = Record<string, ViewRouteServer | undefined>;


export type BluefigNotification = (
    notification: string,
) => void;
// #endregion module
