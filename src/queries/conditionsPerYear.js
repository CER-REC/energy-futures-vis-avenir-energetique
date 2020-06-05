import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export default gql`
  query {
    conditionsPerYear {
      minYear
      maxYear
      years {
        year
        aggregatedCount {
          filing { name, count }
          phase { name, count }
          status { name, count }
          theme { name, count }
          type { name, count }
          instrument { name, count }
        }
      }
    }
  }
`;
