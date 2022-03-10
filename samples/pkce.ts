import { PkceAuth, IAuth, ISettings } from '../src/index';

const authority = process.env.COGNITE_AUTHORITY;
const client_id = process.env.COGNITE_CLIENT_ID;
const client_secret = process.env.COGNITE_CLIENT_SECRET;
const response_type = process.env.COGNITE_RESPONSE_TYPE;
const scope = process.env.COGNITE_SCOPE;

if (!authority || !client_id || !client_secret || !response_type || !scope)
    throw Error(
        'You must set the environment variable COGNITE_AUTHORITY, COGNITE_CLIENT_ID, COGNITE_CLIENT_SECRET, COGNITE_RESPONSE_TYPE and COGNITE_SCOPE'
    );

// Your IdP credentials.
const settings: ISettings = {
    authority,
    client_id,
    client_secret,
    response_type,
    scope,
};

// Instancing PkceAuth class.
const authWrapper: IAuth = new PkceAuth(settings);

// Retrieving access_token.
authWrapper
    .login()
    .then((result) => {
        console.log(result);
    })
    .catch((err) => console.log(err));
