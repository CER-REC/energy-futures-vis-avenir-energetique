import gql from 'graphql-tag';

export default gql`
  query getTreeFromCondition($id: Int!) {
    getConditionById(id: $id){
      id
      instrumentId
      instrument {
        id
        projectId
        project {
          id
          companyIds
        }
        regionIds
      }
    }
  }
`;
