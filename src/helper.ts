import { createHash, randomBytes } from 'crypto';

import ErrorHandler from './core/errors/handler';

const base64Url = require('./utils/baseUrl64.js');

const random = (bytes = 32) => base64Url.encode(randomBytes(bytes));

/**
 * codeChallenge: Code challenge for PKCE.
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
    throw new ErrorHandler(message, statusCode);
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
    // eslint-disable-next-line consistent-return
    return abort(message, statusCode);
};

export { codeChallenge, random, state, nonce, codeVerifier, abort, abortIf };
