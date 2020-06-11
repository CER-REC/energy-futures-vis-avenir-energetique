import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
// import { ApolloClient } from 'apollo-client';
// import { ApolloProvider } from 'react-apollo';
// import { InMemoryCache } from 'apollo-cache-inmemory';

// import { HttpLink } from 'apollo-link-http';

// import { fetch } from 'whatwg-fetch';
// import { lang } from '../../constants';

// import conditionsPerYearQuery from '../../queries/conditionsPerYear';
// import initialConfigurationDataQuery from '../../queries/initialConfigurationData';
// import allKeywordsQuery from '../../queries/allKeywords';
// import { allCompaniesQuery, allRegionsQuery } from '../../queries/wheel';
// import ComposedQuery from '../../components/ComposedQuery';
import Nav from '../../components/Nav';
import ByRegion from '../../pages/ByRegion';
import BySector from '../../pages/BySector';
import ByScenario from '../../pages/ByScenario';

// const cache = new InMemoryCache();
// const link = new HttpLink({
//   uri: `/conditions/graphql?lang=${lang}`,
//   credentials: 'same-origin',
// });
// const client = new ApolloClient({ cache, link, fetch });

// export default props => (
//   <ApolloProvider client={client}>
//     <ComposedQuery
//       config={{ query: initialConfigurationDataQuery }}
//       conditionsPerYear={{ query: conditionsPerYearQuery }}
//       allKeywords={{ query: allKeywordsQuery }}
//       allCompanies={{ query: allCompaniesQuery }}
//       allRegions={{ query: allRegionsQuery }}
//     >
//       {({ data, loading, errors }) => {
//         // TODO: Error handling for these queries
//         if (loading || errors) { return null; }

//         return (
//           <Prototype />
//         );
//       }}
//     </ComposedQuery>
//   </ApolloProvider>
// );

export default () => {
  const [tab, setTab] = useState(0);
  return (
    <Grid container>
      <Nav tab={tab} onChange={(_, tab) => setTab(tab)} />
      {tab === 0 && <ByRegion />}
      {tab === 1 && <BySector />}
      {tab === 3 && <ByScenario />}
    </Grid>
  );
};
