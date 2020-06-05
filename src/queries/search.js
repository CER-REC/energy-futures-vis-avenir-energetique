import gql from 'graphql-tag';

export default {
  findSearchResults: gql`
    query findSearchResults(
      $includeKeywords: [String]!,
      $excludeKeywords: [String],
      $findAny: Boolean
    ) {
      findSearchResults(includeKeywords: $includeKeywords, excludeKeywords: $excludeKeywords, findAny: $findAny) {
        companyIds
        conditionIds
        projectIds
        regionIds
      }
    }
  `,
  findFilteredProjects: gql`
    query findFilteredProjects(
      $startYear: Int!,
      $endYear: Int!,
      $statuses: [ProjectStatus]!,
    ) {
      findFilteredProjects(startYear: $startYear, endYear: $endYear, statuses: $statuses)
    }
  `,
};
