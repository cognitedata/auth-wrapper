import * as nock from 'nock';

import clientMock from '../../__mocks__/client.mock';
import issuerMock from '../../__mocks__/issuer.mock';
import DeviceAuth from '../../../core/auth/device';
import { INVALID, DISCOVER } from '../../../core/openid/endpoints.json';
import { ISettings } from '../../../interfaces/common';

describe('Testing core/auth/device.ts', () => {
    const settings: ISettings = {
        authority: `${issuerMock.issuers[0].url}/${issuerMock.issuers[0].tenant_id}`,
        client_id: issuerMock.issuers[0].client_id,
        client_secret: issuerMock.issuers[0].client_secret,
        grant_type: 'client_credentials',
        scope: issuerMock.issuers[0].scope,
    };

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
    });

    beforeEach(() => {
        nock.cleanAll();
    });

    test('should return access_token', async () => {
        expect.assertions(1);

        // Mocking wellknow URL call for discover deviceAuthorization
        nock(issuerMock.issuers[0].url)
            .get(
                `/${issuerMock.issuers[0].tenant_id}/${issuerMock.issuers[0].paths.config}`
            )
            .reply(200, {
                device_authorization_endpoint: '/oauth2/devicecode',
            });

        // Mocking devicecode URL call for discover deviceAuthorization
        nock(issuerMock.issuers[0].url)
            .post(`/${issuerMock.issuers[0].tenant_id}/oauth2/devicecode`)
            .reply(200, {
                verificationCode: '1234',
                verification_uri: '',
                user_code: '4321',
            });

        // Mocking authorize URL call for discover step
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

        const access_token = await DeviceAuth.load(settings).login();
        expect(typeof access_token).toBe('string');
    });

    test('should return access_token without client_secret', async () => {
        expect.assertions(1);

        // Mocking wellknow URL call for discover deviceAuthorization
        nock(issuerMock.issuers[0].url)
            .get(
                `/${issuerMock.issuers[0].tenant_id}/${issuerMock.issuers[0].paths.config}`
            )
            .reply(200, {
                device_authorization_endpoint: '/oauth2/devicecode',
            });

        // Mocking devicecode URL call for discover deviceAuthorization
        nock(issuerMock.issuers[0].url)
            .post(`/${issuerMock.issuers[0].tenant_id}/oauth2/devicecode`)
            .reply(200, {
                verificationCode: '1234',
                verification_uri: '',
                user_code: '4321',
            });

        // Mocking authorize URL call for discover step
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

        const access_token = await DeviceAuth.load({
            ...settings,
            client_secret: '',
        }).login();
        expect(typeof access_token).toBe('string');
    });

    test('should throw error cause invalid uri', async () => {
        expect.assertions(1);

        expect(
            await DeviceAuth.load({
                ...settings,
                authority: 'wrong_authority',
            }).login()
        ).toMatchObject({ error: INVALID.error_response });
    });

    test('should throw error cause invalid pattern uri', async () => {
        expect.assertions(1);

        expect(
            await DeviceAuth.load({
                ...settings,
                authority: 'https://google.com',
            }).login()
        ).toMatchObject({ error: DISCOVER.error_response });
    });
});
