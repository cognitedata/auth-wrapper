import {
    ICogniteAuthWrapper,
    ISettings,
    LoginMethods,
} from 'interfaces/common';
import * as open from 'open';
import { Client, Issuer, TokenSet, generators } from 'openid-client';

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
            redirect_uris: [this.settings.redirect_uri],
            response_types: [this.settings.response_type],
            post_logout_redirect_uris: [this.settings.post_logout_redirect_uri],
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

    private async handlePkce(): Promise<string> {
        const codeVerifier = generators.codeVerifier();
        const codeChallenge = generators.codeChallenge(codeVerifier);

        const authCodeUrl = this.client.authorizationUrl({
            code_challenge: codeChallenge,
            code_challenge_method: 'S256',
        });

        await open(authCodeUrl);

        return authCodeUrl;
    }
}

export default CogniteAuthWrapper;
