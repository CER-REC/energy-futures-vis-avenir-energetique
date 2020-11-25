module.exports = {
  parser: 'babel-eslint',
  extends: '@vizworx/eslint-config-react',
  overrides: [
    {
      files: [
        '.storybook/**',
        'documentation/**',
        '**/stories.jsx',
        '**/spec.js',
        '**/spec.jsx',
        'src/tests/**',
        'serveLazyDevServer.js',
      ],
      rules: {
        'import/no-extraneous-dependencies': [
          'error',
          { devDependencies: true },
        ],
      },
    },
    {
      files: [
        'src/tests/**',
        '.storybook/spec.js',
      ],
      env: {
        jest: true,
      },
    },
    {
      files: ['**/stories.jsx'],
      rules: {
        'no-alert': 0,
      },
    },
  ],
};
