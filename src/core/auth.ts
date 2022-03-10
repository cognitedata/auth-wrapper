import { IAuth, ISettings } from '../interfaces/common';

abstract class Auth implements IAuth {
    /**
     * @param settings ISettings
     */
    constructor(protected settings: ISettings) {}

    /**
     * login: Login by selected method.
     * @returns Promise<string>
     */
    abstract login(): Promise<string>;
}

export default Auth;
