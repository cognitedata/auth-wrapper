import { handleOpenIdClient } from '../helper';
import { ISettings } from '../interfaces/common';
import Auth from './auth';

class ClientCredentialsAuth extends Auth {
    protected settings: ISettings;

    /**
     * @param settings ISettings
     */
    constructor(settings: ISettings) {
        super(settings);
        this.settings = settings;
    }

    /**
     * login: Login by Client Credentials method and return access_token.
     * @returns Promise<string>
     */
    async login(): Promise<string> {
        const client = await handleOpenIdClient(this.settings);

        const tokenSet = await client.grant({
            grant_type: 'client_credentials',
        });

        return tokenSet.access_token;
    }
}

export default ClientCredentialsAuth;
