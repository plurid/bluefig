// #region imports
    // #region libraries
    import {
        Buffer,
    } from 'buffer';
    // #endregion libraries
// #endregion imports



// #region module
export const bufferToData = <T>(
    buffer: Buffer,
): T | undefined => {
    try {
        const value = buffer.toString();
        const data: T = JSON.parse(value);

        return data;
    } catch (error) {
        return;
    }
}
// #endregion module
