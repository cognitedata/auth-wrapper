import * as qs from 'qs';

import {
    IClient,
    IAuthorizationParameters,
    IToken,
    IGrantBody,
} from '../../interfaces/client';
import { ISettings } from '../../interfaces/common';
import Request from '../../providers/request';
import { CALLBACK_URL } from '../../utils/utils.json';
import Issuer from './issuer';

class Client implements IClient {
    protected issuer: Issuer;

    constructor(protected settings: ISettings) {
        this.issuer = Issuer.init(this.settings.authority);
    }

    /**
     * grant: Generate and return an authorization Url.
     * @param parameters IAuthorizationParameters
     * @returns Promise<string>
     */
    async authorizationUrl(
        parameters?: IAuthorizationParameters
    ): Promise<string> {
        if (!parameters) return '';

        const issuerResponse = await this.issuer.discover();

        return `${issuerResponse.authorization_endpoint}?${qs.stringify(
            parameters
        )}`;
    }

    /**
     * grant: Grant access and return token.
     * @param body IGrantBody
     * @returns Promise<IToken>
     */
    async grant(body: IGrantBody): Promise<IToken> {
        try {
            const issuerResponse = await this.issuer.discover();

            const { data: tokenResponse } = await Request.init(
                this.settings.authority
            ).request<string, IToken>(
                'POST',
                issuerResponse.token_endpoint,
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                },
                qs.stringify({
                    grant_type: body.grant_type,
                    client_id: this.settings.client_id,
                    scope: this.settings.scope,
                    redirect_uri: CALLBACK_URL,
                    ...(body.code_verifier
                        ? { code_verifier: body.code_verifier }
                        : {}),
                    ...(body.code ? { code: body.code } : {}),
                    ...(this.settings.client_secret
                        ? { client_secret: this.settings.client_secret }
                        : {}),
                })
            );

            return tokenResponse;
        } catch (err) {
            throw err.response.data.error_description;
        }
    }
}

export default Client;
