# Composed Query

This utility component allows multiple GraphQL queries to be handled at once rather than requiring a nested `<Query>` for each one.

## Usage

```jsx
import { query1, query2, query3 } from 'some/gql/queries';

<ComposedQuery
  query1={query1}
  query2={query2}
  query3={query3}
>
  {({ data, loading }) => {
    if (loading) {
      ...
    } else {
      const results1 = { ...data.query1 };
      const results2 = { ...data.query2 };
      const results3 = { ...data.query3 };
    }
    ...
  }}
</ComposedQuery>
```

### Notes

- `loading` will be true if _any_ of the queries are still outstanding
- If any of the queries return an error, this implementation will `throw` them with the expectation that the app has error handling at a higher level.
