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

const getYearNameIterations = iterations => (
  iterations.reduce((yearNameIterations, iteration) => {
    let yearName = iteration.year ? iteration.year.toString() : '';

    // Iterations are returned in ascending order of their year, month date
    while (yearNameIterations[yearName]) {
      yearName += '*';
    }

    // eslint-disable-next-line no-param-reassign
    yearNameIterations[yearName] = iteration;

    return yearNameIterations;
  }, {})
);

export default () => {
  const { loading, error, data } = useQuery(CONFIG);

  const processedData = useMemo(() => {
    if (!data) {
      return data;
    }

    return {
      yearNameIterations: getYearNameIterations(data.iterations),
    };
  }, [data]);

  return { loading, error, data: processedData };
};
