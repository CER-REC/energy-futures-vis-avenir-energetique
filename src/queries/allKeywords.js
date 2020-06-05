import gql from 'graphql-tag';

export default gql`
  query allKeywords {
    allKeywords {
      name
      category
      conditionCount
    }
  }
`;
