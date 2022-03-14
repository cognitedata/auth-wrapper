import { DISCOVER } from '../../core/openid/endpoints.json';
import {
    abort,
    abortIf,
    codeChallenge,
    codeVerifier,
    deviceField,
    errorHandling,
    nonce,
    random,
    state,
} from '../../helper';

describe('Testing helper.ts', () => {
    describe('Testing deviceField()', () => {
        test('should return code, cause issuer is micosoft', () => {
            expect.assertions(1);
            expect(deviceField('https://login.microsoftonline.com/')).toBe(
                'code'
            );
        });

        test('should return device_code, cause issuer is !== microsoft', () => {
            expect.assertions(1);
            expect(deviceField('another_issuer')).toBe('device_code');
        });
    });

    describe('Testing errorHandling()', () => {
        const errorDescriptionMock = {
            response: {
                status: 409,
                data: {
                    error: '[test]',
                    error_description: 'Custom error just for test.',
                },
            },
        };

        const errorStatusMock = {
            response: {
                status: 404,
            },
        };

        test('should return issuer_problems error object', () => {
            expect.assertions(1);
            expect(errorHandling(errorStatusMock)).toEqual({
                error: {
                    type: DISCOVER.error_response.type,
                    value: DISCOVER.error_response.value,
                },
            });
        });

        test('should return [test] Custom error just for test error object', () => {
            expect.assertions(1);
            expect(errorHandling(errorDescriptionMock)).toEqual({
                error: {
                    type: '[test]',
                    value: 'Custom error just for test.',
                },
            });
        });
    });

    describe('Testing random and base64 functions', () => {
        test('should return string calling codeChallenge()', () => {
            expect.assertions(1);
            expect(typeof codeChallenge(codeVerifier)).toBe('string');
        });

        test('should return string calling codeVerifier()', () => {
            expect.assertions(1);
            expect(typeof codeVerifier).toBe('string');
        });

        test('should return string calling random()', () => {
            expect.assertions(1);
            expect(typeof random()).toBe('string');
        });

        test('should return string calling nonce()', () => {
            expect.assertions(1);
            expect(typeof nonce).toBe('string');
        });

        test('should return string calling state()', () => {
            expect.assertions(1);
            expect(typeof state).toBe('string');
        });
    });

    describe('Testing Errorhandler calling abort and abortIf', () => {
        test('should be name and message define when call abort()', () => {
            expect.assertions(2);
            expect(() => abort('testing', 409).name).toBeDefined();
            expect(() => abort('testing', 409).message).toBeDefined();
        });

        test('should be name and message define when call abort()', () => {
            expect.assertions(3);
            expect(() => abortIf(true, 'testing', 409).name).toBeDefined();
            expect(() => abortIf(true, 'testing', 409).message).toBeDefined();
            expect(abortIf(false, 'testing', 409)).toBeUndefined();
        });
    });
});
