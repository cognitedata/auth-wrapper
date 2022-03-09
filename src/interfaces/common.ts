import { TokenSet } from 'openid-client';

enum LoginMethods {
    CLIENT_CREDENTIALS,
    REDIRECT,
    PKCE,
}

interface ISettings {
    authority: string;
    client_id: string;
    client_secret?: string;
    response_type: string;
    scope: string;
}

interface ICogniteAuthWrapper {
    login: (method: LoginMethods) => Promise<TokenSet | null | string>;
}

export { LoginMethods, ISettings, ICogniteAuthWrapper };
