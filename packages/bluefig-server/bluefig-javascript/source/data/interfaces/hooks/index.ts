// #region imports
    // #region internal
    import {
        BluefigNotification,
    } from '../general';

    import {
        ActionPayload,
    } from '../view';
    // #endregion internal
// #endregion imports



// #region module
/**
 * The `hook` can respond with a `boolean`, acknowledging the validity of the operation,
 * or can response with a `string`, redirecting the view to another path.
 *
 */
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
