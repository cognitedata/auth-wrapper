# Client Credentials

***Parameters***

| Properties | Definition |
| ---------- | ---------- |
| **settings** (ISettings) | Oauth2 Credentials. |

***Returns***

| Return | Type |
| ------- | ---- |
| Returns a token string |  Promise<[AuthResponse]()> |

***Examples***

Aggregating asset:

```ts
import { ISettings, ClientCredentialsAuth } from '@cognitedata/auth-wrapper';

const settings: ISettings = {
    authority: 'your_authority',
    client_id: 'your_client_id',
    grant_type: 'your_grant_type',
    client_secret: 'your_client_secret',
    scope: 'your_scope'
};

const token = await ClientCredentialsAuth.load(settings).login();
```

# Device Flow

***Parameters***

| Properties | Definition |
| ---------- | ---------- |
| **settings** (ISettings) | Oauth2 Credentials. |

***Returns***

| Return | Type |
| ------- | ---- |
| Returns a token string |  Promise<[AuthResponse]()> |

***Examples***

Aggregating asset:

```ts
import { ISettings, DeviceAuth } from '@cognitedata/auth-wrapper';

const settings: ISettings = {
    authority: 'your_authority',
    client_id: 'your_client_id',
    client_secret: 'your_client_secret',
    scope: 'your_scope'
};

const token = await DeviceAuth.load(settings).login();
```

# Implicit Flow

***Parameters***

| Properties | Definition |
| ---------- | ---------- |
| **settings** (ISettings) | Oauth2 Credentials. |

***Returns***

| Return | Type |
| ------- | ---- |
| Returns a token string |  Promise<[AuthResponse]()> |

***Examples***

Aggregating asset:

```ts
import { ISettings, ImplicitAuth } from '@cognitedata/auth-wrapper';

const settings: ISettings = {
    authority: 'your_authority',
    client_id: 'your_client_id',
    grant_type: 'your_grant_type',
    client_secret: 'your_client_secret',
    scope: 'your_scope'
};

const token = await ImplicitAuth.load(settings).login();
```

# PKCE Flow

***Parameters***

| Properties | Definition |
| ---------- | ---------- |
| **settings** (ISettings) | Oauth2 Credentials. |

***Returns***

| Return | Type |
| ------- | ---- |
| Returns a token string |  Promise<[AuthResponse]()> |

***Examples***

Aggregating asset:

```ts
import { ISettings, PkceAuth } from '@cognitedata/auth-wrapper';

const settings: ISettings = {
    authority: 'your_authority',
    client_id: 'your_client_id',
    client_secret: 'your_client_secret',
    scope: 'your_scope'
};

const token = await PkceAuth.load(settings).login();
```
