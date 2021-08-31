// #region module
const hooks = {
    checkToken: async (
        payload,
        notify,
        event,
    ) => {
        console.log('checkToken hook called', payload, notify, event);
        return true;
    },
    beforeAction: async (
        payload,
        notify,
        event,
    ) => {
        console.log('beforeAction hook called', payload, notify, event);
        return true;
    },
};
// #endregion module



// #region exports
module.exports = hooks;
// #endregion exports
