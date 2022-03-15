export default {
    issuers: [
        {
            url: 'https://login.microsoftonline.com',
            tenant_id: 'b7484399-37aa-4c28-9a37-a32f24c0621f',
            client_id: '280a6f54-87bf-4b9a-9774-d1cc2f2674a6',
            client_secret: '7vw7Q~_a_QoXKAaG0HdD4H45NoNfou3dUbJum',
            scope: 'https://greenfield.cognitedata.com/.default',
            grant_type: 'client_credentials',
            paths: {
                config: '.well-known/openid-configuration',
            },
        },
    ],
};
