// #region imports
    // #region external
    import {
        ViewElement,
    } from '~data/interfaces';
    // #endregion external
// #endregion imports



// #region module
export const resolveElements = async (
    elements: ViewElement[] | undefined,
) => {
    if (!elements) {
        return [];
    }

    const resolvedElements: any[] = [];

    for (const element of elements) {
        const resolvedElement: any = {};

        for (const [key, value] of Object.entries(element)) {
            if (typeof value === 'function') {
                const resolvedValue = await value();
                resolvedElement[key] = resolvedValue;
                continue;
            }

            resolvedElement[key] = value;
        }

        resolvedElements.push(resolvedElement);
    }

    return resolvedElements;
}
// #endregion module
