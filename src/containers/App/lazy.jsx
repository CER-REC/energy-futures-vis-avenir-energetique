import React from 'react';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';

import PageLayout from '../../components/PageLayout';
import Landing from '../../pages/Landing';
import ByRegion from '../../pages/ByRegion';
import BySector from '../../pages/BySector';
import Scenarios from '../../pages/Scenarios';
import Electricity from '../../pages/Electricity';
import Demand from '../../pages/Demand';
import OilAndGas from '../../pages/OilAndGas';
import useConfig, { ConfigProvider } from '../../hooks/useConfig';

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
  typography: {
    fontFamily: '"FiraSansCondensed", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        html: { // reset font-size that has been overwritten by the WET template
          fontSize: '16px !important',
          lineHeight: 'normal !important',
        },
      },
    },
    MuiTypography: {
      h5: { fontSize: '22px' },
      h6: {
        fontSize: '20px',
        fontWeight: 700,
      },
      body1: { fontSize: '14px' },
      caption: {
        lineHeight: 1.3,
        '& > p': { margin: 0 },
      },
    },
    MuiButton: {
      root: {
        height: 23,
        minWidth: 60,
        borderRadius: 0,
      },
      label: { margin: 'auto' },
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
      containedSecondary: {
        minWidth: 0,
        color: defaultTheme.palette.secondary.light,
        backgroundColor: '#F3EFEF',
        boxShadow: defaultTheme.shadows[0],
        '&:hover': {
          backgroundColor: '#F3EFEF',
          boxShadow: defaultTheme.shadows[2],
        },
      },
      containedSizeSmall: {
        padding: defaultTheme.spacing(0, 0.25),
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
      outlinedSizeSmall: {
        padding: defaultTheme.spacing(0, 0.25),
      },
    },
    MuiTooltip: {
      tooltip: {
        backgroundColor: defaultTheme.palette.common.white,
        color: defaultTheme.palette.secondary.main,
        maxWidth: 220,
        fontSize: defaultTheme.typography.pxToRem(12),
        border: `1px solid ${defaultTheme.palette.secondary.main}`,
        borderRadius: 0,
      },
    },
  },
});

const Content = () => {
  const { config } = useConfig();

  if (config.page === 'landing') {
    return <Landing />;
  }

  return (
    <PageLayout
      showRegion
      multiSelectScenario={config.page === 'scenarios'}
      disableDraggableRegion={['by-sector', 'electricity', 'scenarios', 'oil-and-gas', 'demand'].includes(config.page)}
      singleSelectRegion={['by-sector', 'scenarios', 'demand'].includes(config.page) || (config.view === 'region')}
      showSource={['by-sector', 'electricity', 'oil-and-gas'].includes(config.page)}
      disableDraggableSource={['electricity', 'oil-and-gas'].includes(config.page)}
      singleSelectSource={config.view === 'source'}
    >
      {config.page === 'by-region' && <ByRegion />}
      {config.page === 'by-sector' && <BySector />}
      {config.page === 'electricity' && <Electricity />}
      {config.page === 'scenarios' && <Scenarios />}
      {config.page === 'demand' && <Demand />}
      {config.page === 'oil-and-gas' && <OilAndGas />}
    </PageLayout>
  );
};

export default () => (
  <ThemeProvider theme={theme}>
    <ConfigProvider>
      <CssBaseline />
      <Content />
    </ConfigProvider>
  </ThemeProvider>
);
