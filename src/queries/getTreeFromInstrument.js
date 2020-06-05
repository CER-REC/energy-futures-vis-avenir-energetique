import gql from 'graphql-tag';

export default gql`
  query getTreeFromInstrument($id: Int!) {
    getInstrumentById(id: $id){
      id
      projectId
      project {
        id
        companyIds
      }
      regionIds
    }
  }
`;
