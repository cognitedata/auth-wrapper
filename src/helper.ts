import * as open from 'open';
import { BaseClient, Issuer } from 'openid-client';

import { listenForAuthCode, openServerAtPort } from './core/server';
import { IRequestResponse, ISettings } from './interfaces/common';

/**
 * handleServer: Handle a express server to listen for iDp callback.
 * @param authCodeUrl string
 * @param field code | id_token
 * @returns Promise<IRequestResponse>
 */
async function handleServer(
    authCodeUrl: string,
    field: 'code' | 'id_token'
): Promise<IRequestResponse> {
    const { app, server } = await openServerAtPort();

    await open(authCodeUrl);

    try {
        const request = await listenForAuthCode(app, field);

        return request;
    } finally {
        server.close();
    }
}

/**
 * handleOpenIdClient: Returns a new OpenId Client.
 * @param settings ISettings
 * @returns Promise<BaseClient>
 */
async function handleOpenIdClient(settings: ISettings): Promise<BaseClient> {
    const issuer = await Issuer.discover(settings.authority);
    return new issuer.Client({
        client_id: settings.client_id,
        redirect_uris: ['http://localhost:59999/callback'],
        ...(settings.client_secret
            ? { client_secret: settings.client_secret }
            : {}),
        ...(settings.response_type
            ? { response_types: [settings.response_type] }
            : {}),
    });
}

export { handleServer, handleOpenIdClient };
