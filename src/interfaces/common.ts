interface ISettings {
    authority: string;
    client_id: string;
    client_secret?: string;
    redirect_uri: string;
    post_logout_redirect_uri: string;
    response_type: string;
    scope: string;
}

interface ICogniteAuthWrapper {
    readonly settings: ISettings;
    readonly checkAuthentication: any;
}

export { ISettings, ICogniteAuthWrapper };
