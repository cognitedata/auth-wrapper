import { ICogniteAuthWrapper, ISettings, LoginMethod } from 'interfaces/common';
import { Issuer, TokenSet } from 'openid-client';

class CogniteAuthWrapper implements ICogniteAuthWrapper {
    settings: ISettings;
    checkAuthentication?: boolean;
    issuer: Issuer;

    constructor(settings: ISettings, checkAuthentication?: boolean) {
        this.settings = settings;
        this.checkAuthentication = checkAuthentication;
    }

    // eslint-disable-next-line consistent-return
    async login(method: LoginMethod): Promise<TokenSet | null> {
        if (!Object.values(LoginMethod).includes(method)) return null;

        if (method === LoginMethod.pkce) {
            const issuer = await Issuer.discover(this.settings.authority);
            const client = new issuer.Client({
                client_id: this.settings.client_id,
                ...(this.settings.client_secret
                    ? { client_secret: this.settings.client_secret }
                    : {}),
                redirect_uris: [this.settings.redirect_uri],
                response_types: [this.settings.response_type],
                post_logout_redirect_uris: [
                    this.settings.post_logout_redirect_uri,
                ],
            });

            return client.grant({
                grant_type: 'client_credentials',
                scope: this.settings.scope,
            });
        }
    }
}

export default CogniteAuthWrapper;
