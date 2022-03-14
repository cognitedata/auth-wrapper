import { IWellKnow } from '../../interfaces/issuer';
import Request from '../../providers/request';

describe('Testing providers/request.ts', () => {
    test('should return 200 and validate issuer field', async () => {
        expect.assertions(2);
        const { data: wellknowResponse, status } = await Request.init(
            'https://accounts.google.com'
        ).request<unknown, IWellKnow>(
            'GET',
            '.well-known/openid-configuration',
            {
                headers: {
                    'Content-Type': 'application/json',
                },
                params: { testing: true },
            }
        );

        expect(wellknowResponse.issuer).toBeDefined();
        expect(status).toBe(200);
    });
});
