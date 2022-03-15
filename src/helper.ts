import { createHash, randomBytes } from 'crypto';

import ErrorHandler from './core/errors/handler';
import { DISCOVER, INVALID } from './core/openid/endpoints.json';
import { AuthError } from './interfaces/common';

const base64Url = require('./utils/baseUrl64.js');

const random = (bytes = 32) => base64Url.encode(randomBytes(bytes));

/**
 * Code challenge for PKCE.
 * @param codeVerifier string
 * @returns string
 */
const codeChallenge = (codeVerifier: string): string =>
    base64Url.encode(createHash('sha256').update(codeVerifier).digest());

const state = random();
const nonce = random();
const codeVerifier = random();

/**
 * Return an error with Errorhandler.
 * @param message string
 * @param statusCode number
 * @returns ErrorHandler
 */
const abort = (message: string, statusCode?: number): ErrorHandler => {
    throw new ErrorHandler(message, statusCode).getErrors();
};

/**
 * Return an error with Errorhandler when a condition is satisfied.
 * @param condition string
 * @param message string
 * @param statusCode number
 * @returns ErrorHandler
 */
const abortIf = (
    condition: boolean,
    message: string,
    statusCode?: number
): ErrorHandler => {
    if (!condition) return;
    return abort(message, statusCode);
};

/**
 * Handle unknow errors
 * @param errors any
 * @returns AuthError
 */
const errorHandling = (errors: any): AuthError => {
    if (errors.code && errors.code === 'ECONNREFUSED')
        return { error: INVALID.error_response };

    if (
        errors &&
        errors.response &&
        (errors.response.data || errors.response.status)
    ) {
        if (errors.response.status === 404)
            return { error: DISCOVER.error_response };

        const { error, error_description } = errors.response.data;

        return {
            error: {
                type: error,
                value: error_description,
            },
        };
    }

    return abort(errors);
};

/**
 * Return device field depending the issuer.
 * @param issuer string
 * @returns string
 */
const deviceField = (issuer: string): string => {
    if (issuer.includes('microsoft')) return 'code';

    return 'device_code';
};

export {
    deviceField,
    codeChallenge,
    random,
    state,
    nonce,
    codeVerifier,
    abort,
    abortIf,
    errorHandling,
};
