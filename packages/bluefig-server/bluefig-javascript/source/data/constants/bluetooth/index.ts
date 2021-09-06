// #region module
export const BLUETOOTH: {
    STATE_CHANGE: 'stateChange';
    ADVERTISING_START: 'advertisingStart';
    POWERED_ON: 'poweredOn';
} = {
    STATE_CHANGE: 'stateChange',
    ADVERTISING_START: 'advertisingStart',
    POWERED_ON: 'poweredOn',
};

export const BLUEFIG_BLUETOOTH_MTU = parseInt(process.env.BLUEFIG_BLUETOOTH_MTU || '') || 256;
// #endregion module
