import { createHash, randomBytes } from 'crypto';

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

export { codeChallenge, random, state, nonce, codeVerifier };
