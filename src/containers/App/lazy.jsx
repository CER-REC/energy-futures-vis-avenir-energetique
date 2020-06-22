import React, { useState } from 'react';
import { Grid } from '@material-ui/core';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { fetch } from 'whatwg-fetch';
import { lang } from '../../constants';

import Nav from '../../components/Nav';
import ByRegion from '../../pages/ByRegion';
import BySector from '../../pages/BySector';
import ByScenario from '../../pages/ByScenario';

const cache = new InMemoryCache();
const link = new HttpLink({
  uri: `/energy-future/graphql?lang=${lang}`,
  credentials: 'same-origin',
});
const client = new ApolloClient({ cache, link, fetch });

export default () => {
  const [tab, setTab] = useState(0);
  return (
    <ApolloProvider client={client}>
      <Grid container>
        <Nav tab={tab} onChange={(_, tab) => setTab(tab)} />
        {tab === 0 && <ByRegion />}
        {tab === 1 && <BySector />}
        {tab === 3 && <ByScenario />}
      </Grid>
    </ApolloProvider>
  );
};
