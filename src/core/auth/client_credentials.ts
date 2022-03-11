import { ISettings } from '../../interfaces/common';
import Client from '../openid/client';
import Auth from './auth';

class ClientCredentialsAuth extends Auth {
    protected settings: ISettings;

    /**
     * @param settings ISettings
     */
    constructor(settings: ISettings) {
        super(settings);
    }

    /**
     * load: Return an instance of ClientCredentials class.
     * @param settings ISettings
     * @returns new ClientCredentialsAuth
     */
    static load(settings: ISettings) {
        return new this(settings);
    }

    /**
     * login: Login by Client Credentials method and return access_token.
     * @returns Promise<strin | undefined>g>
     */
    async login(): Promise<string | undefined> {
        const client = new Client(this.settings);

        const { access_token } = await client.grant({
            grant_type: 'client_credentials',
        });

        return access_token;
    }
}

export default ClientCredentialsAuth;
