import * as open from 'open';

import { nonce, state } from '../../helper';
import { ISettings } from '../../interfaces/common';
import { CALLBACK_URL } from '../../utils/utils.json';
import { listenForAuthCode, openServerAtPort } from '../http/server';
import Client from '../openid/client';
import Auth from './auth';

class ImplicitAuth extends Auth {
    protected settings: ISettings;

    /**
     * @param settings ISettings
     */
    constructor(settings: ISettings) {
        super(settings);
    }

    /**
     * load: Return an instance of ImplicitAuth class.
     * @param settings ISettings
     * @returns new ImplicitAuth
     */
    static load(settings: ISettings) {
        return new this(settings);
    }

    /**
     * login: Login by Implicit method and return access_token.
     * @returns Promise<string | undefined>
     */
    async login(): Promise<string | undefined> {
        const { app, server } = await openServerAtPort();

        try {
            const client = new Client(this.settings);

            const authUrl = await client.authorizationUrl({
                client_id: this.settings.client_id,
                scope: this.settings.scope,
                response_type: 'code',
                redirect_uri: CALLBACK_URL,
                state,
                nonce,
            });

            await open(authUrl);

            const { code } = await listenForAuthCode('get', app);

            const { access_token } = await client.grant({
                grant_type: this.settings.grant_type,
                ...(this.settings.client_secret
                    ? { client_secret: this.settings.client_secret }
                    : {}),
                code,
            });

            return access_token;
        } finally {
            server.close();
        }
    }
}

export default ImplicitAuth;
