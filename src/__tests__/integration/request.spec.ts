import issuerMock from '../__mocks__/issuer.mock';
import { IWellKnow } from '../../interfaces/issuer';
import Request from '../../providers/request';

describe('Testing providers/request.ts', () => {
    test('should return 200 and validate issuer field', async () => {
        expect.assertions(2);
        const { data: wellknowResponse, status } = await Request.init(
            `${issuerMock.issuers[0].url}/${issuerMock.issuers[0].tenant_id}`
        ).request<unknown, IWellKnow>(
            'GET',
            issuerMock.issuers[0].paths.config,
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
