import * as open from 'open';

import {
    codeChallenge,
    codeVerifier,
    errorHandling,
    nonce,
} from '../../helper';
import { AuthResponse } from '../../interfaces/auth';
import { ISettings } from '../../interfaces/common';
import { CALLBACK_URL } from '../../utils/utils.json';
import { listenForAuthCode, openServerAtPort } from '../http/server';
import Client from '../openid/client';
import Auth from './auth';

class PkceAuth extends Auth {
    protected settings: ISettings;

    /**
     * @param settings ISettings
     */
    constructor(settings: ISettings) {
        super(settings);
    }

    /**
     * load: Return an instance of PkceAuth class.
     * @param settings ISettings
     * @returns new PkceAuth
     */
    static load(settings: ISettings) {
        return new this(settings);
    }

    /**
     * login: Login by PKCE method and return access_token.
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
                code_challenge: codeChallenge(codeVerifier),
                code_challenge_method: 'S256',
                nonce,
            });

            await open(authUrl);

            const { code } = await listenForAuthCode('get', app);

            const { access_token } = await client.grant({
                grant_type: 'authorization_code',
                code_verifier: codeVerifier,
                code,
            });

            server.close();

            return access_token;
        } catch (err: unknown) {
            return errorHandling(err);
        }
    }
}

export default PkceAuth;
