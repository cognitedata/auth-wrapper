import issuerMock from '../../__mocks__/issuer.mock';
import Client from '../../../core/openid/client';
import { IDeviceResponse, IToken } from '../../../interfaces/client';

describe('Testing core/openid/client.ts', () => {
    const mockUrl = `${issuerMock.issuers[0].url}/${issuerMock.issuers[0].tenant_id}/oauth2/authorize?response_type=code&client_id=testing_client_id`;
    const client: Client = new Client({
        client_id: issuerMock.issuers[0].client_id,
        client_secret: issuerMock.issuers[0].client_secret,
        grant_type: issuerMock.issuers[0].grant_type,
        authority: `${issuerMock.issuers[0].url}/${issuerMock.issuers[0].tenant_id}`,
        scope: issuerMock.issuers[0].scope,
    });

    it('should return authorization url when call client.authorizationUrl()', async () => {
        expect.assertions(3);

        const authUrl = await client.authorizationUrl({
            response_type: 'code',
            client_id: 'testing_client_id',
        });

        expect(authUrl).toBeDefined();
        expect(typeof authUrl).toBe('string');
        expect(authUrl).toEqual(mockUrl);
    });

    test('should return authorization IToken object when call client.grant()', async () => {
        expect.assertions(3);

        const token = await client.grant({
            grant_type: issuerMock.issuers[0].grant_type,
        });

        expect(token).toBeDefined();
        expect(token.access_token).toBeDefined();
        expect(token).toMatchObject({} as IToken);
    });

    test('should return authorization IToken object when call client.deviceAuthorization()', async () => {
        expect.assertions(7);

        const device = await client.deviceAuthorization();

        expect(device).toBeDefined();
        expect(device.expires_in).toBeDefined();
        expect(device.device_code).toBeDefined();
        expect(device.interval).toBeDefined();
        expect(device.user_code).toBeDefined();
        expect(device.verification_uri).toBeDefined();
        expect(device).toMatchObject({} as IDeviceResponse);
    });

    test('should return authorization testing string when call client.poll()', async () => {
        expect.assertions(3);

        const promise = await client.poll<Promise<string>>(
            async () =>
                new Promise((resolve) => {
                    resolve('testing');
                }),
            1000,
            1000
        );

        expect(promise).toBeDefined();
        expect(promise).toBe('testing');
        expect(typeof promise).toBe('string');
    });
});
