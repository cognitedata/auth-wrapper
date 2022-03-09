import {
    ICogniteAuthWrapper,
    ISettings,
    LoginMethods,
} from 'interfaces/common';
import * as open from 'open';
import { Client, Issuer, TokenSet, generators } from 'openid-client';

import { listenForAuthCode, openServerAtPort } from './server';

class CogniteAuthWrapper implements ICogniteAuthWrapper {
    protected settings: ISettings;
    protected issuer: Issuer;
    protected client: Client;

    constructor(settings: ISettings) {
        this.settings = settings;
    }

    // eslint-disable-next-line consistent-return
    public async login(
        method: LoginMethods
    ): Promise<TokenSet | null | string> {
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

    private handleClientCredentials(): Promise<TokenSet> {
        return this.client.grant({
            grant_type: 'client_credentials',
        });
    }

    private async handlePkce(): Promise<TokenSet> {
        const codeVerifier = generators.codeVerifier();
        const codeChallenge = generators.codeChallenge(codeVerifier);
        const nonce = generators.nonce();

        const authCodeUrl = this.client.authorizationUrl({
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
            nonce,
            response_mode: 'query',
        });

        const { app, server } = await openServerAtPort();

        await open(authCodeUrl);

        try {
            const request = await listenForAuthCode(app);

            return this.client.callback(
                this.client.metadata.redirect_uris[0],
                { code: request.code, state: request.state },
                { code_verifier: codeVerifier, nonce }
            );
        } finally {
            server.close();
        }
    }
}

export default CogniteAuthWrapper;
