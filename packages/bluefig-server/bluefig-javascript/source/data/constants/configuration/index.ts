// #region imports
    // #region libraries
    import os from 'os';
    import path from 'path';
    // #endregion libraries
// #endregion imports



// #region module
export const BLUEFIG_SERVICE_NAME = process.env.BLUEFIG_SERVICE_NAME || 'Bluefig';


export const hooksPath = process.env.BLUEFIG_HOOKS_PATH || path.join(
    os.homedir(),
    '.bluefig/hooks.js',
);


export const viewsPath = process.env.BLUEFIG_VIEWS_PATH || path.join(
    os.homedir(),
    '.bluefig/views.js',
);
// #endregion module
