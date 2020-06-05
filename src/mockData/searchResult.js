/* eslint-disable max-len */
export default {
  searchResults: {
    companyIds: [],
    conditionIds: [],
    projectIds: new Array(101).fill(1).map((e, i) => e + i).concat([600, 500, 700]),
    regionIds: new Array(30).fill(1).map((e, i) => e + i).concat([50, 51, 52, -1]),
  },
  filteredProjectIds: new Array(101).fill(50).map((e, i) => e + i),
};
