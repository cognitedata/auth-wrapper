import { ISettings, PkceAuth } from '../src/index';
import { AuthResponse } from '../src/interfaces/auth';

class PkceSample {
    // Your IdP credentials.
    protected settings: ISettings = {
        authority: process.env.COGNITE_AUTHORITY,
        client_id: process.env.COGNITE_CLIENT_ID,
        scope: process.env.COGNITE_SCOPE,
    };

    async load() {
        if (
            !this.settings.authority ||
            !this.settings.client_id ||
            !this.settings.scope
        )
            throw Error(
                'You must set the environment variable COGNITE_AUTHORITY, COGNITE_CLIENT_ID and COGNITE_SCOPE'
            );

        // Retrieving access_token.
        const tokenResponse: AuthResponse = await PkceAuth.load(
            this.settings
        ).login();

        // Retrieving token with previous refresh_token
        const refreshedTokenResponse = await PkceAuth.load(this.settings).login(
            // @ts-ignore
            tokenResponse?.refresh_token
        );

        console.log(refreshedTokenResponse);
    }
}

export default new PkceSample().load();
