import gql from 'graphql-tag';

export default gql`
  query companyNameById ($id: Int!) {
    getCompanyById (id: $id) {
      id
      name
    }
  }
`;
