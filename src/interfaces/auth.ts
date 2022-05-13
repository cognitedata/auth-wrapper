// Copyright 2022 Cognite AS
import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

import { IToken } from './client';
import { AuthError } from './common';

type AuthResponse = IToken | AuthError | undefined;

interface IAuth {
    login: () => Promise<AuthResponse>;
}

interface IAuthRequest {
    request<T = unknown, U = unknown>(
        method: Method,
        endpoint: string,
        config?: AxiosRequestConfig,
        data?: T
    ): Promise<AxiosResponse<U>>;
}

export { IAuth, IAuthRequest, AuthResponse };
