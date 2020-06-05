import gql from 'graphql-tag';

// eslint-disable-next-line import/prefer-default-export
export const projectMenuQuery = gql`
  query ProjectMenu ($id: Int!) {
    allProjectsByCompany(companyId: $id) {
      id
      status
      shortName
      name
      aggregatedCount {
        filing { name, count }
        phase { name, count }
        status { name, count }
        theme { name, count }
        type { name, count }
        instrument { name, count }
      }
      numberOfConditions
      numberOfInstruments
    }
  }
`;
