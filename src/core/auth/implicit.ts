import * as open from 'open';

import { errorHandling, nonce, state } from '../../helper';
import { AuthResponse } from '../../interfaces/auth';
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
     * Return an instance of ImplicitAuth class.
     * @param settings ISettings
     * @returns new ImplicitAuth
     */
    static load(settings: ISettings) {
        return new this(settings);
    }

    /**
     * Login by Implicit method and return access_token.
     * @returns Promise<AuthResponse>
     */
    async login(): Promise<AuthResponse> {
        try {
            const { app, server } = await openServerAtPort();

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

            server.close();

            return access_token;
        } catch (err: unknown) {
            return errorHandling(err);
        }
    }
}

export default ImplicitAuth;
