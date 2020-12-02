import React from 'react';
import { ThemeProvider } from '@material-ui/core';

import theme from './theme';
import PageLayout from '../../components/PageLayout';
import Landing from '../../pages/Landing';
import ByRegion from '../../pages/ByRegion';
import BySector from '../../pages/BySector';
import Scenarios from '../../pages/Scenarios';
import Electricity from '../../pages/Electricity';
import Demand from '../../pages/Demand';
import OilAndGas from '../../pages/OilAndGas';
import useConfig, { ConfigProvider } from '../../hooks/useConfig';

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
      <Content />
    </ConfigProvider>
  </ThemeProvider>
);
