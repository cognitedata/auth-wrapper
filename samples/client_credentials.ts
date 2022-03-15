import { ISettings, ClientCredentialsAuth } from '../src/index';

class ClientCredentialsSample {
    // Your IdP credentials.
    protected settings: ISettings = {
        authority: process.env.COGNITE_AUTHORITY,
        client_id: process.env.COGNITE_CLIENT_ID,
        grant_type: process.env.COGNITE_GRANT_TYPE || '',
        client_secret: process.env.COGNITE_CLIENT_SECRET || '',
        scope: process.env.COGNITE_SCOPE,
    };

    async load() {
        // Retrieving access_token.
        const result = await ClientCredentialsAuth.load(this.settings).login();
        console.log(result);
    }
}

export default new ClientCredentialsSample().load();
