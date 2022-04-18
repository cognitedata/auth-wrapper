import * as nock from 'nock';

import clientMock from '../../__mocks__/client.mock';
import issuerMock from '../../__mocks__/issuer.mock';
import PkceAuth from '../../../core/auth/pkce';
import { INVALID, DISCOVER } from '../../../core/openid/endpoints.json';
import { ISettings } from '../../../interfaces/common';

describe('Testing core/auth/pkce.ts', () => {
    const settings: ISettings = {
        authority: `${issuerMock.issuers[0].url}/${issuerMock.issuers[0].tenant_id}`,
        client_id: issuerMock.issuers[0].client_id,
        client_secret: issuerMock.issuers[0].client_secret,
        grant_type: 'authorization_code',
        scope: issuerMock.issuers[0].scope,
    };

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
    });

    afterEach(() => {
        nock.cleanAll();
    });

    test('should return access_token with grant_type = authorization_code', async () => {
        expect.assertions(6);

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
                token_endpoint: '/oauth2/token',
            });

        // Mocking Token URL call
        nock(issuerMock.issuers[0].url)
            .post(`/${issuerMock.issuers[0].tenant_id}/oauth2/token`)
            .reply(200, clientMock.token);

        const grantResponse = await PkceAuth.load({
            ...settings,
            grant_type: 'authorization_code',
        }).login();

        expect(grantResponse).toHaveProperty('token_type');
        expect(grantResponse).toHaveProperty('expires_in');
        expect(grantResponse).toHaveProperty('ext_expires_in');
        expect(grantResponse).toHaveProperty('access_token');
        expect(grantResponse).toHaveProperty('refresh_token');
        expect(grantResponse).toHaveProperty('scope');
    });

    test('should throw error cause invalid uri', async () => {
        expect.assertions(1);

        expect(
            await PkceAuth.load({
                ...settings,
                authority: 'wrong_authority',
                grant_type: 'authorization_code',
            }).login()
        ).toMatchObject({ error: INVALID.error_response });
    });

    test('should throw error cause invalid pattern uri', async () => {
        expect.assertions(1);

        expect(
            await PkceAuth.load({
                ...settings,
                authority: 'https://google.com',
                grant_type: 'authorization_code',
            }).login()
        ).toMatchObject({ error: DISCOVER.error_response });
    });

    test('should throw error cause received error from well know endpoint', async () => {
        expect.assertions(1);

        // Mocking authorize URL call for discover step
        nock(issuerMock.issuers[0].url)
            .get(
                `/${issuerMock.issuers[0].tenant_id}/${issuerMock.issuers[0].paths.config}`
            )
            .reply(400, {
                error: 'testing_error',
                error_description: 'just for testing',
            });

        expect(await PkceAuth.load(settings).login()).toMatchObject({
            error: {
                type: 'testing_error',
                value: 'just for testing',
            },
        });
    });
});
