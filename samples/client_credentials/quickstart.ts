import {
    CogniteAuthWrapper,
    ICogniteAuthWrapper,
    ISettings,
    LoginMethods,
} from '../../src/index';

const settings: ISettings = {
    authority: process.env.COGNITE_AUTHORITY,
    client_id: process.env.COGNITE_CLIENT_ID,
    client_secret: process.env.COGNITE_CLIENT_SECRET,
    redirect_uri: process.env.COGNITE_REDIRECT_URI,
    post_logout_redirect_uri: process.env.COGNITE_POST_LOGOUT_REDIRECT_URI,
    response_type: process.env.COGNITE_RESPONSE_TYPE,
    scope: process.env.COGNITE_SCOPE,
};

const authWrapper: ICogniteAuthWrapper = new CogniteAuthWrapper(settings);

authWrapper
    .login(LoginMethods.CLIENT_CREDENTIALS)
    .then((result) => {
        console.log(result);
    })
    .catch((err) => console.log(err));
