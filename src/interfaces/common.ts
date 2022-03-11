import { Express } from 'express';
import { Server } from 'http';

interface ISettings {
    authority: string;
    client_id: string;
    client_secret?: string;
    response_type?: string;
    grant_type?: string;
    scope?: string;
}

interface IRequestResponse {
    code: string;
    state: string;
    id_token?: string;
    session_state?: string;
}

interface IServer {
    app: Express;
    server: Server;
}

export { ISettings, IRequestResponse, IServer };
