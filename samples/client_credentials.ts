import { ISettings, ClientCredentialsAuth } from '../src/index';

class ClientCredentialsSample {
    // Your IdP credentials.
    protected settings: ISettings = {
        authority: `${process.env.COGNITE_AUTHORITY}/1`,
        client_id: process.env.COGNITE_CLIENT_ID,
        grant_type: process.env.COGNITE_GRANT_TYPE || '',
        client_secret: process.env.COGNITE_CLIENT_SECRET || '',
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
        const result = await ClientCredentialsAuth.load(this.settings).login();
        console.log(result);
    }
}

export default new ClientCredentialsSample().load();
