import { Issuer, TokenSet } from 'openid-client';

enum LoginMethod {
    pkce = 'PKCE',
    redirect = 'REDIRECT',
}

interface ISettings {
    authority: string;
    client_id: string;
    client_secret?: string;
    redirect_uri: string;
    post_logout_redirect_uri: string;
    response_type: string;
    scope: string;
}

interface ICogniteAuthWrapper {
    settings: ISettings;
    issuer: Issuer;
    checkAuthentication?: boolean;
    login: (method: LoginMethod) => Promise<TokenSet | null>;
}

export { LoginMethod, ISettings, ICogniteAuthWrapper };
