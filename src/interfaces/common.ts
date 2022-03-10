import { AxiosRequestConfig, Method } from 'axios';
import { Express } from 'express';
import { Server } from 'http';

interface ISettings {
    authority: string;
    client_id: string;
    client_secret?: string;
    response_type?: string;
    scope?: string;
}

interface IRequestData {
    method: Method;
    endpoint: string;
    config?: Omit<AxiosRequestConfig, 'data'>;
    data?: Pick<AxiosRequestConfig, 'data'>;
}

interface IRequestResponse {
    code: string;
    state: string;
    id_token?: string;
    session_state?: string;
}

interface IAuth {
    login: () => Promise<string>;
}

interface IServer {
    app: Express;
    server: Server;
}

export { ISettings, IRequestData, IRequestResponse, IAuth, IServer };
