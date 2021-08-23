// #region imports
    // #region external
    import {
        ViewRouteClient,
        ViewElement,
    } from '../../../data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const identifyElements = (
    elements: ViewElement[],
) => {
    const identifieElements: any[] = [];

    for (const element of elements) {
        if (element.type === 'list') {
            const listItems = identifyElements(element.items);

            identifieElements.push({
                id: Math.random() + '',
                ...element,
                items: listItems,
            });
            continue;
        }

        identifieElements.push({
            id: Math.random() + '',
            ...element,
        });
    }

    return identifieElements;
}


export const identifyView = (
    view: ViewRouteClient,
) => {
    if (!view.elements) {
        return view;
    }

    const elements: any[] = identifyElements(
        view.elements,
    );

    return {
        ...view,
        elements,
    };
}
// #endregion module
