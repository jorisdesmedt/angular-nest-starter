module.exports = {
  preset: 'jest-preset-angular',
  roots: ['client/src'],
  setupTestFrameworkScriptFile: '<rootDir>/client/src/setup-jest.ts',
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/client/src/app/$1',
    '@assets/(.*)': '<rootDir>/client/src/assets/$1',
    '@core/(.*)': '<rootDir>/client/src/app/core/$1',
    '@env': '<rootDir>/client/src/environments/environment',
    '@src/(.*)': '<rootDir>/client/src/$1',
    '@state/(.*)': '<rootDir>/client/src/app/state/$1'
  },
  globals: {
    'ts-jest': {
      tsConfigFile: 'client/src/tsconfig.spec.json'
    },
    __TRANSFORM_HTML__: true
  },
  coverageDirectory: './coverage/client'
};
