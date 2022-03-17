export default {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testTimeout: 30000,
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ['src/**'],
    modulePathIgnorePatterns: [
        'lib',
        'src/index.ts',
        'src/interfaces',
        'src/utils/utils.json',
        'src/core/openid/endpoints.json',
        'src/__tests__/__mocks__',
    ],
    coverageDirectory: 'coverage',
    coverageProvider: 'v8',
    coverageReporters: ['text-summary', 'text', 'lcov'],
    coverageThreshold: {
        global: {
            lines: 95,
        },
    },
};
