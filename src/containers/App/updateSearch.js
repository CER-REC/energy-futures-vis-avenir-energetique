import { batch } from 'react-redux';
import searchQuery from '../../queries/search';
import * as processQueryData from './processQueryData';

const nullSearch = { data: { findSearchResults: null } };
const nullFilter = { data: { findFilteredProjects: null } };

const shouldQuery = {
  search: search => search && search.includeKeywords.length > 0,
  filter: filter => filter && (
    filter.endYear - filter.startYear < 9 || filter.statuses.length < 2
  ),
};

export default (
  client,
  setSearchResults,
  setFilteredProjects,
  searchVariables,
  filterVariables,
) => (
  Promise.all([
    (shouldQuery.search(searchVariables))
      ? client.query({
        query: searchQuery.findSearchResults,
        variables: searchVariables,
      })
      : nullSearch,

    (shouldQuery.filter(filterVariables))
      ? client.query({
        query: searchQuery.findFilteredProjects,
        variables: filterVariables,
      })
      : nullFilter,
  ]).then((response) => {
    if (response.error) { console.error(response.error); }

    batch(() => {
      if (response[0] && response[0].data) {
        setSearchResults(
          processQueryData.searchResults(response[0].data.findSearchResults),
        );
      }
      if (response[1] && response[1].data) {
        setFilteredProjects(
          processQueryData.filteredProjects(response[1].data.findFilteredProjects),
        );
      }
    });

    return {
      findSearchResults: (
        (response[0] && response[0].data) ? response[0].data : nullSearch
      ).findSearchResults,
      findFilteredProjects: (
        (response[1] && response[1].data) ? response[1].data : nullFilter
      ).findFilteredProjects,
    };
  })
);
