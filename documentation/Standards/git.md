# Git

## Branches

We follow the Git Flow branching model
([1](https://nvie.com/posts/a-successful-git-branching-model/), [2](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow))
with a slight variation to release branches. Since the project is developed
almost entirely without any public releases, using a short sprint and update
cycle, we have not found a need to do a release branch. Instead, we cut releases
directly from development, and fix any bugs in that release in the next minor
release from development. All other Git Flow processes can be followed as normal.

### Branch Naming Guidelines
* Start with the primary JIRA ticket number if applicable
* Lowercase
* Dashes in place of space
* Brief description of branch (preferably 5 words or less)

```
feature/1234-example-branch-name
bugfix/5678-storybook-info-scrolls-unexpectedly
```

## Commit Messages

Commit messages serve multiple purposes, but providing a good summary of changes
to other developers should be our highest priority. Some other uses are:

* Providing more context on the reason for the change and the implementation
* Automatic linking of Commits, Branches, and PRs to JIRA tickets
* Automatic change-log generation
* Tracking backwards-incompatible changes
* Skipping CI/CD processes for specific changes

We have chosen to follow [Conventional Commits](https://www.conventionalcommits.org/)
as a specification for our commit messages, and it allows us to collect any
relevant information in an easy-to-read format for both humans and machines.

```
feat(CompanyWheel): Adds PullToSpin to CompanyWheel component's render

This adds the component to the interface, but does not implement the CompanyWheel
logic for spinning.

NEBV-1234
```

```
docs(Standards/Git): Adds Conventional Commits as a commit standard

Committizen has been installed and provides `git cz` alias for guided commit messages

NEBV-114
```

[Committizen](https://commitizen.github.io/cz-cli/) has been installed and will
provide a guided commit message workflow when running `npm run cz`. This can be
aliased to `git cz` by running `npm install -g committizen`. This will simplify
the process of writing a good commit message, but the message may still be written
manually.

```bash
$ git cz
cz-cli@3.0.4, cz-conventional-changelog@2.1.0


Line 1 will be cropped at 100 characters. All other lines will be wrapped after 100 characters.

? Select the type of change that you're committing: docs:     Documentation only changes
? What is the scope of this change (e.g. component or file name)? (press enter to skip)
 Standards/Git
? Write a short, imperative tense description of the change:
 Adds Conventional Commits as a commit standard
? Provide a longer description of the change: (press enter to skip)
 Committizen has been installed and provides `git cz` alias for guided commit messages
? Are there any breaking changes? No
? Does this change affect any open issues? Yes
? Add issue references (e.g. "fix #123", "re #123".):
 NEBV-1147
[feature/1167-commit-messages 5201e41] docs(Standards/Git): Adds Conventional Commits as a commit standard
 3 files changed, 334 insertions(+), 8 deletions(-)
```

## Pull Requests

All pull requests should be reviewed by at least two other developers that were
not involved in writing the code. Reviews should be done on the code, the
Storybook for both components and views, and the full visualization. Please test
any interactions and accessibility that have changed or regularly results in bugs.
