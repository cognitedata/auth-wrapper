import { ICogniteAuthWrapper, ISettings } from 'interfaces/common';

class CogniteAuthWrapper implements ICogniteAuthWrapper {
    readonly settings: ISettings;
    readonly checkAuthentication: boolean;

    constructor(settings: ISettings, checkAuthentication: boolean) {
        this.settings = settings;
        this.checkAuthentication = checkAuthentication;
    }
}

export default CogniteAuthWrapper;
