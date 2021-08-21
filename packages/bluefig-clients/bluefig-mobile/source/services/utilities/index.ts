// #region imports
    // #region external
    import {
        ViewRouteClient,
    } from '../../data/interfaces';
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


export const dataToBase64 = <T = any>(
    data: T,
) => {
    return Buffer.from(
        JSON.stringify({data}),
    ).toString('base64');
}


export const base64ToData = (
    data: string,
) => {
    try {
        const value = Buffer
            .from(data, 'base64')
            .toString();

        return JSON.parse(value);
    } catch (error) {
        return;
    }
}
// #endregion module
