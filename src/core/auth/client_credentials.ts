import * as open from 'open';

import { nonce } from '../../helper';
import { ISettings } from '../../interfaces/common';
import { CALLBACK_URL } from '../../utils/utils.json';
import { listenForAuthCode, openServerAtPort } from '../http/server';
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

        if (
            this.settings.grant_type &&
            this.settings.grant_type === 'authorization_code'
        ) {
            const { app, server } = await openServerAtPort();

            try {
                const authUrl = await client.authorizationUrl({
                    client_id: this.settings.client_id,
                    scope: this.settings.scope,
                    response_type: 'code',
                    redirect_uri: CALLBACK_URL,
                    nonce,
                });

                await open(authUrl);

                const { code } = await listenForAuthCode('get', app);

                const { access_token } = await client.grant({
                    grant_type: this.settings.grant_type,
                    code,
                });

                return access_token;
            } finally {
                server.close();
            }
        }

        const { access_token } = await client.grant({
            grant_type: this.settings.grant_type,
        });

        return access_token;
    }
}

export default ClientCredentialsAuth;
