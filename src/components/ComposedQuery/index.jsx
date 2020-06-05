import React from 'react';
import { Query } from 'react-apollo';
import handleQueryError from '../../utilities/handleQueryError';

// eslint-disable-next-line react/prop-types
export default React.memo(({ children, ...props }) => {
  const composedQuery = Object.entries(props)
    // Allow the props to be undefined so that queries can be dynamically added
    .filter(([, query]) => !!query)
    .reduce((acc, [name, query]) => prevQueries => (
      <Query {...query} key={name}>
        {(result) => {
          handleQueryError(result);
          const merged = {
            queryInfo: {
              ...prevQueries.data,
              [name]: result,
            },
            data: {
              ...prevQueries.data,
              [name]: result.data ? Object.values(result.data)[0] : null,
            },
            loading: prevQueries.loading || result.loading,
          };
          return acc(merged);
        }}
      </Query>
    ), children);

  return composedQuery({ queryInfo: {}, data: {}, loading: false });
});
