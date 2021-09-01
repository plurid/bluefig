// #region imports
    // #region internal
    import {
        TypeOrPromiseOf,
        ViewElement,
    } from '../view';
    // #endregion internal
// #endregion imports



// #region module
export type ViewActionResult = TypeOrPromiseOf<ViewRouteServer | void>;

export type UnknownPayload = any;

export type ViewActionExecution<P = UnknownPayload> = (
    payload: P,
    notify: BluefigNotification,
    event: BluefigEvent,
) => ViewActionResult;


export type ViewActionServer<P = UnknownPayload> =
    | ViewActionExecution<undefined>
    | ViewActionExecutionWithArguments<P>;


export type ViewActionExecutionWithArguments<P = UnknownPayload> = {
    arguments: string[];
    execution: ViewActionExecution<P>;
}


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


export type BluefigEvent = (
    type: string,
    payload?: any,
) => void;
// #endregion module
