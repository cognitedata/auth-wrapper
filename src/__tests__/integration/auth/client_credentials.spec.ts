import * as nock from 'nock';

import clientMock from '../../__mocks__/client.mock';
import issuerMock from '../../__mocks__/issuer.mock';
import ClientCredentialsAuth from '../../../core/auth/client_credentials';
import { INVALID, DISCOVER } from '../../../core/openid/endpoints.json';
import { ISettings } from '../../../interfaces/common';

describe('Testing core/auth/client_credentials.ts', () => {
    const settings: ISettings = {
        authority: `${issuerMock.issuers[0].url}/${issuerMock.issuers[0].tenant_id}`,
        client_id: issuerMock.issuers[0].client_id,
        client_secret: issuerMock.issuers[0].client_secret,
        grant_type: 'client_credentials',
        scope: issuerMock.issuers[0].scope,
    };

    test('should return access_token', async () => {
        expect.assertions(1);

        const access_token = await ClientCredentialsAuth.load(settings).login();
        expect(typeof access_token).toBe('string');
    });

    test('should return access_token with grant_type = authorization_code', async () => {
        expect.assertions(1);

        const tenant = `/${issuerMock.issuers[0].url}/${issuerMock.issuers[0].tenant_id}`;

        // Mocking authorize URL call for discover step
        nock(issuerMock.issuers[0].url)
            .get(
                `/${issuerMock.issuers[0].tenant_id}/${issuerMock.issuers[0].paths.config}`
            )
            .reply(200, {
                authorization_endpoint: `${tenant}/oauth2/v2.0/authorize`,
            });

        // Mocking authorize URL call for grant step
        nock(issuerMock.issuers[0].url)
            .get(
                `/${issuerMock.issuers[0].tenant_id}/${issuerMock.issuers[0].paths.config}`
            )
            .reply(200, {
                token_endpoint: `/oauth2/token`,
            });

        // Mocking Token URL call
        nock(issuerMock.issuers[0].url)
            .post(`/${issuerMock.issuers[0].tenant_id}/oauth2/token`)
            .reply(200, clientMock.token);

        const access_token = await ClientCredentialsAuth.load({
            ...settings,
            grant_type: 'authorization_code',
        }).login();
        expect(typeof access_token).toBe('string');
    });

    test('should throw error cause invalid uri', async () => {
        expect.assertions(1);

        expect(
            await ClientCredentialsAuth.load({
                ...settings,
                authority: 'wrong_authority',
            }).login()
        ).toMatchObject({ error: INVALID.error_response });
    });

    test('should throw error cause invalid pattern uri', async () => {
        expect.assertions(1);

        expect(
            await ClientCredentialsAuth.load({
                ...settings,
                authority: 'https://google.com',
            }).login()
        ).toMatchObject({ error: DISCOVER.error_response });
    });
});
