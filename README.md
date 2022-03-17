<a href="https://cognite.com/">
    <img src="./cognite_logo.png" alt="Cognite logo" title="Cognite" align="right" height="80" />
</a>

# @cognitedata/auth-wrapper

[![codecov](https://codecov.io/gh/cognitedata/auth-wrapper/branch/main/graph/badge.svg?token=3dhnnL5sHo)](https://codecov.io/gh/cognitedata/auth-wrapper)

The `@cognitedata/auth-wrapper` is an OpenID Connect/OAuth 2.0 Wrapper library written in js that provides a convenient way to retrieve access token from any IdP that meets the openid pattern. You can use on client-side or server-side with JavaScript applications.

## Getting Started

## Samples

### Contributing

Contributions welcome!
For details about commiting changes, automated versioning and releases, see [Contributing](./CONTRIBUTING.md).

### Testing

This repo contains some integration tests that require some IdP credentials to run.
You can use your own IdP credentials, talk to any of the contributors or leave an issue and it'll get sorted.
Github Actions will run the test and has its own api key.

Run tests:

```bash
npm install
npm test
```

We use `jest` to run tests, see [their documentation](https://github.com/facebook/jest) for more information.

### Versioning

The libraries follow [Semantic Versioning](https://semver.org/).
Package versions are updated automatically and individually based on commit messages.
