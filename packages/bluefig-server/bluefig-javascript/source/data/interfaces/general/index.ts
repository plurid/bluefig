// #region imports
    // #region internal
    import {
        ViewElement,
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


export interface Hooks {
    checkToken?: (
        token: string | undefined,
        type: string,
    ) => Promise<boolean>;
    beforeRead?: (
        view: string,
    ) => Promise<boolean | string | void>;
    beforeWrite?: (
        view: string,
    ) => Promise<boolean | string | void>;
}
// #endregion module
