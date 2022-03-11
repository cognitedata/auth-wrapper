import { AxiosRequestConfig, AxiosResponse, Method } from 'axios';

interface IAuth {
    login: () => Promise<string | undefined>;
}

interface IAuthRequest {
    request<T = unknown, U = unknown>(
        method: Method,
        endpoint: string,
        config?: AxiosRequestConfig,
        data?: T
    ): Promise<AxiosResponse<U>>;
}

export { IAuth, IAuthRequest };
