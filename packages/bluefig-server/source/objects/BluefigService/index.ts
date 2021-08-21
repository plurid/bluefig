// #region imports
    // #region libraries
    import bleno from '@abandonware/bleno';
    // #endregion libraries


    // #region external
    import {
        BLUEFIG_SERVICE_UUID,
    } from '~data/constants';

    import BluefigViewCharacteristic from '~objects/BluefigViewCharacteristic';
    // #endregion external
// #endregion imports



// #region module
class BluefigService extends bleno.PrimaryService {
    constructor() {
        super({
            uuid: BLUEFIG_SERVICE_UUID,
            characteristics: [
                new BluefigViewCharacteristic(),
            ],
        });
    }
}
// #endregion module



// #region exports
export default BluefigService;
// #endregion exports
