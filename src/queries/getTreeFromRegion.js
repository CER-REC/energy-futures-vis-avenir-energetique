import gql from 'graphql-tag';

export default gql`
  query getTreeFromRegion($id: Int!) {
    getRegionById(id: $id){
      id
      instruments {
        id
        project {
          id
          companyIds
        }
        conditions {
          id
        }
      }
    }
  }
`;
