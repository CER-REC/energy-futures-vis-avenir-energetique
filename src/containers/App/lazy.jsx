import React, { createContext, useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { fetch } from 'whatwg-fetch';
import { createHashHistory } from 'history'
import queryString from 'query-string';
import { lang } from '../../constants';
import { DEFAULT_CONFIG, REGIONS } from '../../types';

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
const history = createHashHistory();


export const ConfigContext = createContext({
  config: DEFAULT_CONFIG,
  setConfig: {},
});

export default () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const query = queryString.parse(location.search);
    setConfig({
      ...DEFAULT_CONFIG,
      ...query,
      regions: query.provinces ? query.provinces.split(',') : REGIONS,
    });
  }, []);

  useEffect(() => {
    history.push({
      pathname: '/energy-future',
      search: `?mainSelection=${config.mainSelection}&unit=${config.unit}&year=${config.year}&scenario=${config.scenario}&provinces=${config.regions.join(',')}`
    })
  }, [config]);

  return (
    <ApolloProvider client={client}>
      <ConfigContext.Provider value={{ config, setConfig }}>
        <Grid container>
          <Nav tab={tab} onChange={(_, tab) => setTab(tab)} />
          {tab === 0 && <ByRegion />}
          {tab === 1 && <BySector />}
          {tab === 3 && <ByScenario />}
        </Grid>
      </ConfigContext.Provider>
    </ApolloProvider>
  );
};
