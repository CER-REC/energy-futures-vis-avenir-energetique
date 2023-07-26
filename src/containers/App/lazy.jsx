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
import Emissions from '../../pages/Emissions';
import Disclaimer from '../../components/Disclaimer';

const Content = () => {
  const { config } = useConfig();
  const isGreenhouseGasEmission = config.mainSelection === 'greenhouseGasEmission';

  if (config.page === 'landing') {
    return <Landing />;
  }

  return (
    <PageLayout
      showRegion={!isGreenhouseGasEmission}
      disableDraggableRegion={['by-sector', 'electricity', 'scenarios', 'oil-and-gas', 'demand'].includes(config.page)}
      singleSelectRegion={['by-sector', 'scenarios', 'demand'].includes(config.page) || (config.view === 'region')}
      showSource={['by-sector', 'electricity', 'emissions', 'oil-and-gas'].includes(config.page) || isGreenhouseGasEmission}
      disableDraggableSource={['electricity', 'emissions', 'oil-and-gas'].includes(config.page) || isGreenhouseGasEmission}
      singleSelectSource={config.view === 'source'}
    >
      {config.page === 'emissions' && <Emissions />}
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
      <Disclaimer />
      <Content />
    </ConfigProvider>
  </ThemeProvider>
);
