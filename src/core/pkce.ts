import { generators } from 'openid-client';

import { handleOpenIdClient, handleServer } from '../helper';
import { ISettings } from '../interfaces/common';
import Auth from './auth';

class PkceAuth extends Auth {
    protected settings: ISettings;

    /**
     * @param settings ISettings
     */
    constructor(settings: ISettings) {
        super(settings);
        this.settings = settings;
    }

    /**
     * login: Login by PKCE method and return access_token.
     * @returns Promise<string>
     */
    async login(): Promise<string> {
        const client = await handleOpenIdClient(this.settings);

        const codeVerifier = generators.codeVerifier();
        const codeChallenge = generators.codeChallenge(codeVerifier);
        const nonce = generators.nonce();

        const authCodeUrl = client.authorizationUrl({
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            nonce,
        });

        const request = await handleServer(authCodeUrl, 'code');

        const callback = await client.callback(
            client.metadata.redirect_uris[0],
            {
                ...(request.code
                    ? { code: request.code, state: request.state }
                    : {}),
                ...(request.id_token
                    ? {
                          access_token: request.id_token,
                          session_state: request.session_state,
                      }
                    : {}),
            },
            {
                ...(codeVerifier ? { code_verifier: codeVerifier } : {}),
                nonce,
            }
        );

        return callback.access_token;
    }
}

export default PkceAuth;
