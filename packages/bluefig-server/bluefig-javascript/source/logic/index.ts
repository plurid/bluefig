// #region imports
    // #region libraries
    import path from 'path';
    import {
        promises as fs,
    } from 'fs';

    import mime from 'mime-types';
    // #endregion libraries


    // #region external
    import {
        VIEWS_PATH,
    } from '~data/constants';

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

    const resolvedElements: ViewElement[] = [];

    for (const element of elements) {
        try {
            const resolvedElement: any = {};

            for (const [key, value] of Object.entries(element)) {
                if (typeof value === 'function') {
                    const resolvedValue = await value();
                    resolvedElement[key] = resolvedValue;
                    continue;
                }

                resolvedElement[key] = value;
            }

            if (
                element.type === 'image'
                || element.type === 'file'
            ) {
                const {
                    data,
                    contentType,
                } = await readFile(resolvedElement.source);

                resolvedElement.source = data;

                if (
                    resolvedElement.contentType
                    && resolvedElement.contentType !== contentType
                ) {
                    resolvedElement.contentType = contentType;
                }
            }

            resolvedElements.push(
                resolvedElement as ViewElement,
            );
        } catch (error) {
            console.log('resolveElements error ::', element, error);
            continue;
        }
    }

    return resolvedElements;
}


export const readFile = async (
    source: string,
) => {
    const absolutePath = path.isAbsolute(source)
        ? source
        : path.join(
            path.dirname(VIEWS_PATH),
            source,
        );

    const file = await fs.readFile(absolutePath);
    const data = file.toString('base64');
    const contentType = mime.lookup(absolutePath);

    return {
        data,
        contentType,
    };
}
// #endregion module
