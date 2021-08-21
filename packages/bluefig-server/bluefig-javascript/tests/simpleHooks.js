// #region module
const hooks = {
    beforeRead: async (
        view,
    ) => {
        console.log('beforeRead hook called', view);
        return true;
    },
    beforeWrite: async (
        view,
    ) => {
        console.log('beforeWrite hook called', view);
        return true;
    },
};
// #endregion module



// #region exports
module.exports = hooks;
// #endregion exports
