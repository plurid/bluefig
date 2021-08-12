// #region imports
    // #region libraries
    import os from 'os';
    import path from 'path';
    // #endregion libraries
// #endregion imports



// #region module
export const viewsPath = process.env.BLUEFIG_VIEWS_PATH || path.join(
    os.homedir(),
    '.bluefig/views.js',
);
// #endregion module
