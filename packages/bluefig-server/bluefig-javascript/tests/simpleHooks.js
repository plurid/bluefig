// #region module
const hooks = {
    checkToken: async (
        token,
        notify,
    ) => {
        console.log('checkToken hook called', token);
        return true;
    },
    beforeAction: async (
        payload,
        notify,
    ) => {
        console.log('beforeAction hook called', payload);
        return true;
    },
};
// #endregion module



// #region exports
module.exports = hooks;
// #endregion exports
