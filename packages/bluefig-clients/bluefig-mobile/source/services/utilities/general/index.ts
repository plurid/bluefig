// #region imports
    // #region external
    import {
        ViewRouteClient,
    } from '../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const identifyView = (
    view: ViewRouteClient,
) => {
    if (!view.elements) {
        return view;
    }

    const elements: any[] = [];
    for (const element of view.elements) {
        elements.push({
            id: Math.random() + '',
            ...element,
        });
    }

    return {
        ...view,
        elements,
    };
}
// #endregion module
