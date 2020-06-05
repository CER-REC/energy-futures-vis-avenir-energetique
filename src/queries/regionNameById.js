import gql from 'graphql-tag';

export default gql`
  query regionNameById ($id: Int!) {
    getRegionById (id: $id) {
      id
      name
      province
    }
  }
`;
