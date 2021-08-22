// #region imports
    // #region libraries
    import {
        Buffer,
    } from 'buffer';
    // #endregion libraries
// #endregion imports



// #region module
export const dataToBase64 = <T = any>(
    data: T,
) => {
    return Buffer.from(
        JSON.stringify({
            ...data,
        }),
    ).toString('base64');
}


export const base64ToData = <T = any>(
    data: string,
) => {
    try {
        const value = Buffer
            .from(data, 'base64')
            .toString();

        return JSON.parse(value) as T;
    } catch (error) {
        return;
    }
}
// #endregion module
