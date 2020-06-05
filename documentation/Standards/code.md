# Code

## Linting

All code should be linted with ESLint and the AirBnB React configuration, so that
we have a consist style across components. This can be linted locally by an
integration with your IDE, or by running `npm run lint`. It will also be
automatically linted when a pull request is created.

## Naming Convention

* Components should be PascalCase (`MyComponentName`, also known as upper camel
case or title case)
* Component folders/filenames (other than index.jsx) should match the name of
the exported component
* Functions should be camelCase (`myFunctionName`)
* No-operation functions should be referred to as noop (`const noop = () => {};`)
* Variables should be camelCase (`myVariableName`)
* Variables should not start with an underscore. Variables and class properties
should be viewed as private, with the only public scope being React props or
exports
