import gql from 'graphql-tag';

export default gql`
  query getTreeFromProject($id: Int!) {
    getProjectById(id: $id){
      id
      companyIds
      instruments {
        id
        regionIds
        conditions {
          id
        }
      }
    }
  }
`;
