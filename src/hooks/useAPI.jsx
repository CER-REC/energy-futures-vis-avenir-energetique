import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const CONFIG = gql`
  query {
    iterations {
      id
      year
      scenarios
    }
  }
`;

const getYearIdIterations = iterations => (
  iterations.reduce((yearIdIterations, iteration) => {
    let yearId = iteration.year ? iteration.year.toString() : '';

    // Iterations are returned in ascending order of their year, month date
    while (yearIdIterations[yearId]) {
      yearId += '*';
    }

    // eslint-disable-next-line no-param-reassign
    yearIdIterations[yearId] = iteration;

    return yearIdIterations;
  }, {})
);

export default () => {
  const { loading, error, data } = useQuery(CONFIG);

  const processedData = useMemo(() => {
    if (!data) {
      return data;
    }

    return {
      yearIdIterations: getYearIdIterations(data.iterations),
    };
  }, [data]);

  return { loading, error, data: processedData };
};
