import * as open from 'open';

import { errorHandling, deviceField } from '../../helper';
import { AuthResponse } from '../../interfaces/auth';
import { IToken } from '../../interfaces/client';
import { ISettings } from '../../interfaces/common';
import Client from '../openid/client';
import Auth from './auth';

class DeviceAuth extends Auth {
    protected settings: ISettings;

    /**
     * @param settings ISettings
     */
    constructor(settings: ISettings) {
        super(settings);
    }

    /**
     * load: Return an instance of DeviceAuth class.
     * @param settings ISettings
     * @returns new DeviceAuth
     */
    static load(settings: ISettings) {
        return new this(settings);
    }

    /**
     * login: Login by Device method and return access_token.
     * @returns Promise<AuthResponse>
     */
    async login(): Promise<AuthResponse> {
        try {
            const client = new Client(this.settings);

            const verificationCode = await client.deviceAuthorization({
                client_id: this.settings.client_id,
                scope: this.settings.scope,
            });

            console.log('User Code: ', verificationCode.user_code);
            console.log(
                'Verification URI: ',
                verificationCode.verification_uri
            );
            console.log('--');

            await open(verificationCode.verification_uri);

            const params = {
                grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
                client_id: this.settings.client_id,
                ...(this.settings.client_secret
                    ? { client_secret: this.settings.client_secret }
                    : {}),
            };

            params[deviceField(this.settings.authority)] =
                verificationCode.device_code;

            const { access_token } = await client.poll<Promise<IToken>>(
                async () => client.grant(params),
                1000,
                1000
            );

            return access_token;
        } catch (err: unknown) {
            return errorHandling(err);
        }
    }
}

export default DeviceAuth;
