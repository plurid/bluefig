// #region imports
    // #region libraries
    import os from 'os';
    import path from 'path';
    // #endregion libraries
// #endregion imports



// #region module
export const hooksPath = process.env.BLUEFIG_HOOKS_PATH || path.join(
    os.homedir(),
    '.bluefig/hooks.js',
);
// #endregion module
