import gql from 'graphql-tag';

export default gql`
  query {
    allConfigurationData {
      displayOrder {
        filing
        phase
        status
        type
        theme
        instrument
        instrumentOther
      }
      instrumentYearRange {
        max
        min
      }
      lastUpdated
      keywordCategories
    }
  }
`;
