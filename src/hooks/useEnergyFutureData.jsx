import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';

import useAPI from './useAPI';
import useConfig from './useConfig';
import { convertUnit } from '../utilities/convertUnit';
import { REGION_ORDER } from '../types';
import { parseData, NOOP } from '../utilities/parseData';
import * as queries from './queries';

const getQuery = (config) => {
  // TODO: Revisit this config.provinces check
  if (['by-region', 'scenarios'].includes(config.page)) {
    switch (config.mainSelection) {
      case 'oilProduction':
        return queries.OIL_PRODUCTIONS;
      case 'energyDemand':
        return queries.ENERGY_DEMAND;
      case 'gasProduction':
        return queries.GAS_PRODUCTIONS;
      case 'electricityGeneration':
        return queries.ELECTRICITY_GENERATIONS;
      default:
        break;
    }
  } else if (config.page === 'electricity') {
    return queries.ELECTRICITY_GENERATIONS_SOURCE;
  } else if (config.page === 'by-sector') {
    return queries.BY_SECTOR;
  }

  return null;
};

// getDefaultUnit returns the default unit that the API returns.
const getDefaultUnit = (config) => {
  switch (config.mainSelection) {
    case 'gasProduction':
      return 'millionCubicMetres';

    case 'electricityGeneration':
      return 'gigawattHours';

    case 'oilProduction':
      return 'thousandCubicMetres';

    case 'energyDemand':
      return 'petajoules';

    default:
      return '';
  }
};

export default () => {
  const { yearIdIterations } = useAPI();
  const { config } = useConfig();
  let query = getQuery(config);
  const unitConversion = convertUnit(getDefaultUnit(config), config.unit);

  const regions = useMemo(() => {
    if (config.page === 'electricity' && config.provinces[0] === 'ALL') {
      return REGION_ORDER;
    }
    return config.provinces;
  }, [config.page, config.provinces]);

  // #region Enum Correction
  // TODO: fix the config data to match the enums then remove this next part
  // and replace correctedSources with config.sources
  const correctedSources = [...config.sources];

  if ((config.page === 'by-sector') && (config.provinces)) {
    if (correctedSources.find(item => item === 'solarWindGeothermal')) {
      correctedSources[correctedSources.indexOf('solarWindGeothermal')] = 'renewable';
    }
    if (correctedSources.find(item => item === 'oilProducts')) {
      correctedSources[correctedSources.indexOf('oilProducts')] = 'oil';
    }
    if (correctedSources.find(item => item === 'naturalGas')) {
      correctedSources[correctedSources.indexOf('naturalGas')] = 'gas';
    }
    if (!correctedSources.length) {
      query = null;
    }
  }
  // #endregion

  // A GraphQL document node is needed even if skipping is specified
  const { loading, error, data } = useQuery(query || queries.NULL_QUERY, {
    variables: {
      scenarios: config.scenarios,
      iteration: yearIdIterations[config.yearId]?.id || '',
      regions,
      // FIXME: config will store it as "total"
      // it should be "total end-use"
      sectors: config.sector === 'total' ? 'total end-use' : config.sector,
      sources: correctedSources,
    },
    skip: !query || !regions || regions.length === 0, // invalid request; do nothing
  });

  const processedData = useMemo(() => {
    if (!data || !data.resources) {
      return data;
    }
    return (parseData[config.page] || NOOP)(data.resources, unitConversion, regions);
  }, [config.page, data, regions, unitConversion]);

  return { loading, error, data: processedData };
};
