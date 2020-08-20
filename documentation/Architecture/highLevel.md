# High Level Architecture

## Components and Views

We use the terms `Components` and `Views`, despite both implementing the
React component pattern, so that we can differentiate between reusable elements
and visualization layout elements. Both of these implement a similar pattern,
with the primary difference being reuse.

## Documentation

High-level documentation (like this architecture documentation) belongs in
`./documentation/`.

## Redux

Implementing a global state store with Redux can be broken down into four segments:

* Types: Identifier for what action is being done
* Action Creators: Functions that generate an Action object with the Action Type and the data required to execute the change
* Reducers: Functions that take a current state and an action, and return a new state
* Middleware: Functions that can respond to and prevent actions based on other state

Since Types, Actions, and Reducers are closely related, we group these together
in a single file in the `app/actions/` folder. There should be one file for each
set of related state.

```js
// app/actions/findWords.js
export const Types = {
  UPDATE_SEARCH: 'findWords.updateSearch',
  UPDATE_RESULTS: 'findWords.updateResults',
  RESET_SEARCH: 'findWords.resetSearch',
};

export const updateSearchQuery = (newSearch = {}) => ({
  type: Types.UPDATE_SEARCH,
  payload: { query: newSearch },
});

export const updateSearchResults = (searchResults = []) => ({
  type: Types.UPDATE_RESULTS,
  payload: { results: searchResults },
});

export const resetSearch = () => ({
  type: Types.RESET_SEARCH,
});

export const reducer = (initialState = {}, action) => {
  switch (action.type) {
    case Types.UPDATE_SEARCH:
      return { ...initialState, query: action.payload.query };

    case Types.UPDATE_RESULTS:
      return { ...initialState, results: action.payload.results };

    case Types.RESET_SEARCH:
      return { ...initialState, query: {}, results: [] };
  }
};
```

## Testing

Every component should have a set of tests to ensure that it renders as designed
and covers all of the interaction, analytics, and accessibility requirements.

## Retrieving data

Data for the visualization will be served by a GraphQL server running in the IIS
visualization service. Queries can be executed with `@apollo/react-hooks`, which will
provide automatic caching and query execution when props change.
