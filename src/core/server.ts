import * as express from 'express';
import { Server } from 'http';

export const openServerAtPort = async () => {
    return new Promise<{ app: express.Express; server: Server }>((resolve) => {
        const app = express();

        const server = app.listen(59999, 'localhost', () => {
            resolve({ app, server });
        });
    });
};

export const listenForAuthCode = async (app: express.Express) => {
    return new Promise<{ code: string; state: string }>((resolve, reject) => {
        // eslint-disable-next-line consistent-return
        app.get('/callback', (req, res) => {
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
            return resolve(<{ code: string; state: string }>req.query);
        });
    });
};
