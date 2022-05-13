// Copyright 2022 Cognite AS
import { ISettings, DeviceAuth } from '../src/index';

class DeviceSample {
    // Your IdP credentials.
    protected settings: ISettings = {
        authority: process.env.COGNITE_AUTHORITY,
        client_id: process.env.COGNITE_CLIENT_ID,
        client_secret: process.env.COGNITE_CLIENT_SECRET,
        scope: process.env.COGNITE_SCOPE,
    };

    async load() {
        if (
            !this.settings.authority ||
            !this.settings.client_id ||
            !this.settings.scope
        )
            throw Error(
                'You must set the environment variable COGNITE_AUTHORITY, COGNITE_CLIENT_ID, COGNITE_CLIENT_SECRET and COGNITE_SCOPE'
            );

        // Retrieving access_token.
        const tokenResponse = await DeviceAuth.load(this.settings).login();

        // Retrieving token with previous refresh_token
        delete this.settings.client_secret;
        const refreshedTokenResponse = await DeviceAuth.load(
            this.settings
        ).login(
            // @ts-ignore
            tokenResponse?.refresh_token
        );

        console.log(refreshedTokenResponse);
    }
}

export default new DeviceSample().load();
