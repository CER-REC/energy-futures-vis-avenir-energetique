import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { PAGES } from '../constants';
import useAPI from './useAPI';
import useConfig from './useConfig';
import { convertUnit } from '../utilities/convertUnit';
import { parseData, NOOP } from '../utilities/parseData';
import * as queries from './queries';

const getQuery = (config) => {
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
    return config.view === 'source' ? queries.ELECTRICITY_GENERATIONS_SOURCE : queries.ELECTRICITY_GENERATIONS_REGION;
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
  const {
    yearIdIterations,
    regions: { order: regionOrder },
    sources: { electricity: { order: sourceOrder } },
  } = useAPI();
  const { config } = useConfig();
  const query = getQuery(config);
  const unitConversion = convertUnit(getDefaultUnit(config), config.unit);

  /**
   * FIXME: these are temporary special cases for the Electricity page.
   */
  const regions = useMemo(() => {
    if (config.page === 'electricity' && config.provinces[0] === 'ALL') {
      return regionOrder;
    }
    return config.provinces;
  }, [config.page, config.provinces, regionOrder]);
  const sources = useMemo(() => {
    if (config.page === 'electricity' && config.sources[0] === 'ALL') {
      return sourceOrder;
    }
    return config.sources;
  }, [config.page, config.sources, sourceOrder]);

  const { sourceType } = PAGES.find(page => page.id === config.page);

  // A GraphQL document node is needed even if skipping is specified
  const { loading, error, data } = useQuery(query || queries.NULL_QUERY, {
    variables: {
      scenarios: config.scenarios,
      iteration: yearIdIterations[config.yearId]?.id || '',
      regions,
      sectors: config.sector,
      sources,
    },
    // do nothing if the request is invalid
    skip: !query
      || !regions || regions.length === 0
      || (sourceType && (!config.sources || config.sources.length === 0))
      || !config.scenarios || config.scenarios.length === 0,
  });

  const years = useMemo(() => data?.resources?.map(entry => entry.year), [data]);

  const processedData = useMemo(() => {
    if (!data || !data.resources) {
      return data;
    }
    return (parseData[config.page] || NOOP)(
      data.resources,
      unitConversion,
      regions,
      sources,
      config.view,
    );
  }, [config.page, config.view, data, regions, sources, unitConversion]);
  return {
    loading,
    error,
    data: processedData,
    year: years && {
      min: Math.min(...years),
      max: Math.max(...years),
    },
  };
};
