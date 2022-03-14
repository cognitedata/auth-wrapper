import * as express from 'express';

import { errorHandling } from '../../helper';
import { IRequestResponse, IServer } from '../../interfaces/common';

/**
 * openServerAtPort: Open a new express server at http://localhost:59999.
 * @returns Promise<IServer | ErrorHandler>
 */
const openServerAtPort = async (): Promise<IServer> => {
    try {
        return new Promise<IServer>((resolve) => {
            const app = express();

            const server = app.listen(59999, '0.0.0.0', () => {
                resolve({ app, server });
            });
        });
    } catch (err: unknown) {
        errorHandling(err);
    }
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
    // try {
    return new Promise<IRequestResponse>((resolve, reject) => {
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
    // } catch (err) {
    //     errorHandling(err);
    // }
};

export { openServerAtPort, listenForAuthCode };
