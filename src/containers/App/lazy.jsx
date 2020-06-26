import React, { createContext, useState, useEffect } from 'react';
import { ThemeProvider, createMuiTheme, Grid } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from '@apollo/react-hooks';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { fetch } from 'whatwg-fetch';
import { createBrowserHistory } from 'history';
import queryString from 'query-string';
import { lang } from '../../constants';
import { DEFAULT_CONFIG, PROVINCES } from '../../types';

import Nav from '../../components/Nav';
import ByRegion from '../../pages/ByRegion';
import BySector from '../../pages/BySector';
import ByScenario from '../../pages/ByScenario';

/**
 * GraphQL API related infrastructures.
 */
const cache = new InMemoryCache();
const link = new HttpLink({
  uri: `/energy-future/graphql?lang=${lang}`,
  credentials: 'same-origin',
});
const client = new ApolloClient({ cache, link, fetch });
const history = createBrowserHistory();

/**
 * Customize the look-and-feel of UI components here.
 */
const theme = createMuiTheme({
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: { fontSize: '16px !important' }, // reset font-size that has been overwritten by the WET template
      },
    },
  },
});

/**
 * A global store of the current state of the control setting.
 */
export const ConfigContext = createContext({
  config: DEFAULT_CONFIG,
  setConfig: () => {},
});

export default () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [tab, setTab] = useState(0);

  /**
   * URL parachuting.
   */
  useEffect(() => {
    const query = queryString.parse(history.location.search);
    setConfig({
      ...DEFAULT_CONFIG,
      ...query,
      provinces: query.provinces ? query.provinces.split(',') : PROVINCES,
      provinceOrder: query.provinceOrder ? query.provinceOrder.split(',') : PROVINCES,
    });
  }, []);

  /**
   * Update the URL if the control setting is modified.
   */
  useEffect(() => {
    history.replace({
      pathname: '/energy-future/',
      search: `?\
mainSelection=${config.mainSelection}&\
unit=${config.unit}&\
year=${config.year}&\
scenario=${config.scenario}&\
provinces=${config.provinces.join(',')}&\
provinceOrder=${config.provinceOrder.join(',')}\
      `,
    });
  }, [config]);

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <ConfigContext.Provider value={{ config, setConfig }}>
          <CssBaseline />
          <Grid container>
            <Nav tab={tab} onChange={(_, tab) => setTab(tab)} />
            {tab === 0 && <ByRegion />}
            {tab === 1 && <BySector />}
            {tab === 3 && <ByScenario />}
          </Grid>
        </ConfigContext.Provider>
      </ThemeProvider>
    </ApolloProvider>
  );
};
