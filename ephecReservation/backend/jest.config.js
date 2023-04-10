module.exports = {
              testEnvironment: 'node',
              testMatch: ['**/__tests__/**/*.test.js'],
              coveragePathIgnorePatterns: ['node_modules'],
              coverageReporters: ['text', 'html'],
              collectCoverageFrom: ['src/**/*.js'],
            };
            