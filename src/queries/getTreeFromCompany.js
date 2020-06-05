import gql from 'graphql-tag';

export default gql`
  query getTreeFromCompany($id: Int!) {
    getCompanyById(id: $id){
      id
      projects {
        id
        instruments {
          id
          regionIds
          conditions {
            id
          }
        }
      }
    }
  }
`;
