// #region imports
    // #region libraries
    import os from 'os';
    import path from 'path';
    import {
        promises as fs,
    } from 'fs';
    // #endregion libraries


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

        if (element.type === 'image') {
            const data = await readFile(resolvedElement.source);
            resolvedElement.source = data;
        }

        resolvedElements.push(resolvedElement);
    }

    return resolvedElements;
}


export const readFile = async (
    source: string,
) => {
    const absolutePath = path.isAbsolute(source)
        ? source
        : path.join(
            os.homedir(),
            '.bluefig/' + source,
        );

    const file = await fs.readFile(absolutePath);
    const data = file.toString('base64');

    return data;
}
// #endregion module
