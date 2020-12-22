module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage
  // information should be collected
  collectCoverageFrom: [
    '**/src/**/*.js?(x)',
  ],

  // The directory where Jest should output its coverage files
  coverageDirectory: './coverage/',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/queries/',
    '<rootDir>/src/tests/',
    '/(.*\\.)?spec.jsx?',
    '/(.*\\.)?stories.jsx?',

    // TODO: temporarily disable viz 5 until it is actually desinged and implemented.
    '<rootDir>/src/pages/Demand/',
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text-summary',
    'lcov',
    // 'clover',
  ],

  // A map from regular expressions to module names that allow to stub out
  // resources with a single module
  moduleNameMapper: {
    '\\.(s?css|jpg|png)$': '<rootDir>/src/tests/emptyModule.js',
    '^react-spring/renderprops$': 'react-spring/renderprops.cjs',
  },

  // The path to a module that runs some code to configure or set up the testing
  // framework before each test
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/?(*.)spec.js?(x)',
  ],

  // An array of regexp pattern strings that are matched against all test paths,
  // matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/',
    '/_template/spec.jsx',
  ],

  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.jsx?$': '<rootDir>/src/tests/transform/babel.js',
    '^.+\\.md$': '<rootDir>/src/tests/transform/md.js',
  },

  // An array of regexp pattern strings that are matched against all source file
  // paths, matched files will skip transformation
  transformIgnorePatterns: [
    '/node_modules/',
  ],
};
