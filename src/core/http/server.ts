import * as express from 'express';

import { IRequestResponse, IServer } from '../../interfaces/common';

/**
 * openServerAtPort: Open a new express server at http://localhost:59999.
 * @returns Promise<IServer>
 */
const openServerAtPort = async (): Promise<IServer> => {
    return new Promise<IServer>((resolve) => {
        const app = express();

        const server = app.listen(59999, '0.0.0.0', () => {
            resolve({ app, server });
        });
    });
};

/**
 * listenForAuthCode: Listen at /callback for idP callbacks.
 * @param app express.Express
 * @param field code | id_token
 * @returns Promise<IRequestResponse>
 */
const listenForAuthCode = async (
    method: 'get' | 'post',
    app: express.Express
): Promise<IRequestResponse> => {
    return new Promise<IRequestResponse>((resolve, reject) => {
        // eslint-disable-next-line consistent-return
        app[method]('/callback', (req, res) => {
            if (req.query.error) {
                res.end(
                    `Something went wrong: ${req.query.error}, description: ${req.query.error_description}`
                );
                return reject(req.query.error);
            }

            const authCode = req.query.code;
            if (!authCode) {
                res.end(
                    `Well thats embarrassing, neither we got an auth code or any error ${JSON.stringify(
                        req.query
                    )}`
                );
                return reject();
            }

            res.end(
                'You have authenticated successfully! Feel free to close this window.'
            );
            return resolve(<any>req.query);
        });
    });
};

export { openServerAtPort, listenForAuthCode };
