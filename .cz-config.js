module.exports = {
  types: [
    /* eslint-disable no-multi-spaces */
    { value: 'feat',     name: 'feat:     A new feature' },
    { value: 'fix',      name: 'fix:      A bug fix' },
    { value: 'docs',     name: 'docs:     Documentation only changes' },
    { value: 'style',    name: 'style:    Changes that do not affect the meaning of the code\n            (white-space, formatting, missing semi-colons, etc)' },
    { value: 'refactor', name: 'refactor: A code change that neither fixes a bug nor adds a feature' },
    { value: 'perf',     name: 'perf:     A code change that improves performance' },
    { value: 'test',     name: 'test:     Adding missing tests' },
    { value: 'chore',    name: 'chore:    Changes to the build process or auxiliary tools\n            and libraries such as documentation generation' },
    { value: 'revert',   name: 'revert:   Revert to a commit' },
    /* eslint-enable no-multi-spaces */
  ],

  scopes: [],
  allowCustomScopes: true,

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: 'Select the type of change that you\'re committing:\n',
    scope: 'Denote the scope of this change (Eg. ProjectMenu/ProjectChart or List):\n',
    customScope: 'Denote the scope of this change (Eg. ProjectMenu/ProjectChart or List):\n',
    subject: 'Write a short, imperative tense description of the change (Eg. Adds/Fixes ...):\n',
    body: 'Provide a longer description of the change (optional). Use "|" to break new line:\n',
    breaking: 'List any breaking changes (optional):\n',
    footer: 'List any issues affected by this change (optional). E.g. NEBV-1234, Closes NEBV-1337:\n',
    confirmCommit: 'Are you sure you want to proceed with the commit above?',
  },

  allowBreakingChanges: ['feat', 'fix', 'revert'],

  subjectLimit: 100, // Limit subject length

  footerPrefix: 'Issues Affected:',
};
