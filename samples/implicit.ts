// Copyright 2022 Cognite AS
import { CogniteAuthWrapper } from '../src/index';

class ImplicitAuthSample {
    async load() {
        // Retrieving access_token.
        const result = await CogniteAuthWrapper.load('implicit', {
            authority: process.env.COGNITE_AUTHORITY,
            client_id: process.env.COGNITE_CLIENT_ID,
            client_secret: process.env.COGNITE_CLIENT_SECRET,
            grant_type: process.env.COGNITE_GRANT_TYPE,
            scope: process.env.COGNITE_SCOPE,
        }).login();

        console.log(result);
    }
}

export default new ImplicitAuthSample().load();
