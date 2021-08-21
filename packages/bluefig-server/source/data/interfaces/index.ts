// #region imports
    // #region internal
    import {
        ViewElement,
    } from './common';
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
// #endregion module



// #region exports
export * from './common';
// #endregion exports
