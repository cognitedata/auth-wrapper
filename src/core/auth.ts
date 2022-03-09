import {
    ICogniteAuthWrapper,
    ISettings,
    LoginMethods,
} from 'interfaces/common';
import * as open from 'open';
import { Client, Issuer, generators } from 'openid-client';

import { listenForAuthCode, openServerAtPort } from './server';

class CogniteAuthWrapper implements ICogniteAuthWrapper {
    protected settings: ISettings;
    protected issuer: Issuer;
    protected client: Client;

    constructor(settings: ISettings) {
        this.settings = settings;
    }

    // eslint-disable-next-line consistent-return
    public async login(method: LoginMethods): Promise<string | null | string> {
        if (!Object.values(LoginMethods).includes(method)) return null;

        this.issuer = await Issuer.discover(this.settings.authority);
        this.client = new this.issuer.Client({
            client_id: this.settings.client_id,
            ...(this.settings.client_secret
                ? { client_secret: this.settings.client_secret }
                : {}),
            redirect_uris: ['http://localhost:59999/callback'],
            response_types: [this.settings.response_type],
        });

        if (method === LoginMethods.CLIENT_CREDENTIALS)
            return this.handleClientCredentials();

        if (method === LoginMethods.PKCE) return this.handlePkce();
    }

    private async handleClientCredentials(): Promise<string> {
        const tokenSet = await this.client.grant({
            grant_type: 'client_credentials',
        });

        return tokenSet.access_token;
    }

    private async handlePkce(): Promise<string> {
        const codeVerifier = generators.codeVerifier();
        const codeChallenge = generators.codeChallenge(codeVerifier);
        const nonce = generators.nonce();

        const authCodeUrl = this.client.authorizationUrl({
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            nonce,
        });

        return this.handleServer(authCodeUrl, nonce, 'code', codeVerifier);
    }

    private async handleServer(
        authCodeUrl: string,
        nonce: string,
        field: 'code' | 'id_token',
        codeVerifier?: string
    ) {
        const { app, server } = await openServerAtPort();

        await open(authCodeUrl);

        try {
            const request = await listenForAuthCode(app, field);

            const callback = await this.client.callback(
                this.client.metadata.redirect_uris[0],
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
        } finally {
            server.close();
        }
    }
}

export default CogniteAuthWrapper;
