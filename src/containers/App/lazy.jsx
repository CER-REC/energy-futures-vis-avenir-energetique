import React, { useState, useEffect } from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createBrowserHistory } from 'history';
import queryString from 'query-string';

import { DEFAULT_CONFIG, REGION_ORDER, SOURCE_ORDER } from '../../types';
import PageLayout from '../../components/PageLayout';
import Landing from '../../pages/Landing';
import ByRegion from '../../pages/ByRegion';
import BySector from '../../pages/BySector';
import Scenarios from '../../pages/Scenarios';
import Electricity from '../../pages/Electricity';
import Demand from '../../pages/Demand';
import useAPI from '../../hooks/useAPI';
import { ConfigContext } from '../../utilities/configContext';

const parameters = ['page', 'mainSelection', 'year', 'sector', 'unit', 'view'];
const delimitedParameters = ['scenario', 'provinces', 'provinceOrder', 'sources', 'sourceOrder'];
const history = createBrowserHistory();

/**
 * Customize the look-and-feel of UI components here.
 */
const defaultTheme = createMuiTheme({
  palette: {
    primary: { main: '#4A93C7' },
    secondary: {
      main: '#5D5D5D',
      light: '#83868E',
    },
  },
});
const theme = createMuiTheme({
  palette: {
    primary: { main: defaultTheme.palette.primary.main },
    secondary: {
      main: defaultTheme.palette.secondary.main,
      light: defaultTheme.palette.secondary.light,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: { fontSize: '16px !important' }, // reset font-size that has been overwritten by the WET template
      },
    },
    MuiTypography: {
      h5: { fontSize: '22px' },
      h6: {
        fontSize: '20px',
        fontWeight: 700,
        textTransform: 'uppercase',
      },
      body1: { fontSize: '14px' },
    },
    MuiButton: {
      root: {
        height: 23,
        minWidth: 73,
        padding: `${defaultTheme.spacing(0, 0.5)} !important`,
        borderRadius: 0,
      },
      containedPrimary: {
        fontWeight: 700,
        color: defaultTheme.palette.common.white,
        backgroundColor: defaultTheme.palette.primary.main,
        border: `1px solid ${defaultTheme.palette.primary.main}`,
        boxShadow: defaultTheme.shadows[0],
        '&:hover': {
          border: '1px solid #33668b',
        },
      },
      outlinedPrimary: {
        fontWeight: 500,
        color: defaultTheme.palette.secondary.light,
        backgroundColor: defaultTheme.palette.common.white,
        border: `1px solid ${defaultTheme.palette.secondary.light}`,
        boxShadow: defaultTheme.shadows[0],
        '&:hover': {
          color: defaultTheme.palette.secondary.main,
          border: `1px solid ${defaultTheme.palette.secondary.main}`,
          boxShadow: defaultTheme.shadows[2],
        },
      },
    },
  },
});

export default () => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const { data: { yearIdIterations } } = useAPI();

  /**
   * URL parachuting.
   */
  useEffect(() => {
    const query = queryString.parse(history.location.search);
    const yearIds = Object.keys(yearIdIterations).sort();
    const yearId = yearIds.indexOf(query.year) === -1 ? yearIds.reverse()[0] : query.year;
    const { scenarios } = yearIdIterations[yearId];
    let queryScenarios = query.scenario?.split(',').filter(scenarioName => scenarios.indexOf(scenarios) !== -1);

    if (!queryScenarios?.length) {
      queryScenarios = [scenarios[0]];
    }

    setConfig({
      ...DEFAULT_CONFIG,
      ...query,
      provinces: query.provinces ? query.provinces.split(',') : REGION_ORDER,
      provinceOrder: query.provinceOrder ? query.provinceOrder.split(',') : REGION_ORDER,
      sources: query.sources ? query.sources.split(',') : SOURCE_ORDER,
      sourceOrder: query.sourceOrder ? query.sourceOrder.split(',') : SOURCE_ORDER,
      year: yearId,
      scenario: queryScenarios,
    });
  }, [yearIdIterations]);

  /**
   * Update the URL if the control setting is modified.
   */
  useEffect(() => {
    const queryParameters = parameters.map(parameter => `${parameter}=${config[parameter]}`);

    queryParameters.concat(delimitedParameters.map(parameter => `${parameter}=${config[parameter].join(',')}`));

    history.replace({
      pathname: '/energy-future/',
      search: `?${queryParameters.join('&')}`,
    });
  }, [config]);

  return (
    <ThemeProvider theme={theme}>
      <ConfigContext.Provider value={{ config, setConfig }}>
        <CssBaseline />
        {config.page === 'landing' ? <Landing /> : (
          <PageLayout
            showRegion
            multiSelectScenario={config.page === 'scenarios'}
            disableDraggableRegion={['by-sector', 'electricity', 'scenarios', 'demand'].includes(config.page)}
            singleSelectRegion={['by-sector', 'electricity', 'scenarios', 'demand'].includes(config.page)}
            showSource={['by-sector', 'electricity'].includes(config.page)}
            disableDraggableSource={['electricity'].includes(config.page)}
          >
            {config.page === 'by-region' && <ByRegion />}
            {config.page === 'by-sector' && <BySector />}
            {config.page === 'electricity' && <Electricity />}
            {config.page === 'scenarios' && <Scenarios />}
            {config.page === 'demand' && <Demand />}
          </PageLayout>
        )}
      </ConfigContext.Provider>
    </ThemeProvider>
  );
};
