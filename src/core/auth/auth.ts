import { AuthResponse, IAuth } from '../../interfaces/auth';
import { ISettings } from '../../interfaces/common';

abstract class Auth implements IAuth {
    /**
     * @param settings ISettings
     */
    constructor(protected settings: ISettings) {}

    /**
     * login: Login by selected method.
     * @returns Promise<AuthResponse>
     */
    abstract login(): Promise<AuthResponse>;
}

export default Auth;
