export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 20000,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**'],
    modulePathIgnorePatterns: [
        'lib',
        'src/index.ts',
        'src/interfaces',
        'src/utils/utils.json',
        'src/core/openid/endpoints.json',
        'src/core/http/server.ts',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageThreshold: {
        global: {
            lines: 90,
        },
    },
};
