const fs = require('fs');
const path = require('path');

const commitTypes = {
  feat: 'Features',
  fix: 'Bug Fixes',
  docs: 'Documentation',
  style: 'Code Formatting',
  refactor: 'Code Refactoring',
  perf: 'Performance Improvements',
  test: 'Tests',
  chore: 'Project Maintenance',
  revert: 'Reverts',
};

const commitTypeOrder = ['Features', 'Bug Fixes', 'Tests'];

const parserOpts = {
  headerPattern: /^(\w*)(?:\((.*)\))?: (.*)$/,
  headerCorrespondence: [
    'type',
    'scope',
    'subject',
  ],
  revertPattern: /^revert:\s([\s\S]*?)\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash'],
  noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
  referenceActions: null, // ['issues affected'],
  issuePrefixes: ['NEBV-'],
};

const writerOpts = {
  groupBy: 'scope',
  mainTemplate: fs.readFileSync(path.resolve(__dirname, 'template.hbs'), 'utf8'),
  headerPartial: fs.readFileSync(path.resolve(__dirname, 'header.hbs'), 'utf8'),
  commitPartial: fs.readFileSync(path.resolve(__dirname, 'commit.hbs'), 'utf8'),
  footerPartial: fs.readFileSync(path.resolve(__dirname, 'footer.hbs'), 'utf8'),
  // Required due to upstream bug preventing all types being displayed.
  // Bug: https://github.com/conventional-changelog/conventional-changelog/issues/317
  // Fix: https://github.com/conventional-changelog/conventional-changelog/pull/410
  transform: (commit) => {
    /* eslint-disable no-param-reassign */
    commit.notes.forEach((note) => { note.title = 'BREAKING CHANGES'; });

    commit.type = commitTypes[commit.type];
    if (!commit.type) { return undefined; }

    if (commit.scope === '*') {
      commit.scope = '';
    } else if (commit.scope === 'deps') {
      commit.scope = 'Dependencies';
    }

    if (typeof commit.hash === 'string') {
      commit.hash = commit.hash.substring(0, 7);
    }

    return commit;
    /* eslint-enable no-param-reassign */
  },
  commitGroupsSort: 'title',
  commitsSort: (a, b) => {
    if (commitTypeOrder.includes(a.type) || commitTypeOrder.includes(b.type)) {
      if (!commitTypeOrder.includes(a.type)) { return 1; }
      if (!commitTypeOrder.includes(b.type)) { return -1; }
      return commitTypeOrder.indexOf(a.type) - commitTypeOrder.indexOf(b.type);
    }

    // Sort by type and then title
    return a.type.localeCompare(b.type)
      || a.subject.localeCompare(b.subject);
  },
  noteGroupsSort: 'title',
};

module.exports = { parserOpts, writerOpts };
