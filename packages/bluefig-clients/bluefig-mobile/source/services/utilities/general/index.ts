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
        if (element.type === 'list') {
            const items: any[] = [];

            for (const item of element.items) {
                items.push({
                    id: Math.random() + '',
                    ...item,
                });
            }

            elements.push({
                id: Math.random() + '',
                ...element,
                items,
            });
            continue;
        }

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
