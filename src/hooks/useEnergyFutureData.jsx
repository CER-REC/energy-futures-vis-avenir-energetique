import { useMemo, useCallback } from 'react';
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
        return queries.OIL_PRODUCTIONS_ALL;
      case 'energyDemand':
        return queries.ENERGY_DEMAND;
      case 'gasProduction':
        return queries.GAS_PRODUCTIONS_ALL;
      case 'electricityGeneration':
        return queries.ELECTRICITY_GENERATIONS;
      default:
        break;
    }
  } else if (config.page === 'electricity') {
    return config.view === 'source' ? queries.ELECTRICITY_GENERATIONS_SOURCE : queries.ELECTRICITY_GENERATIONS_REGION;
  } else if (config.page === 'by-sector') {
    return queries.BY_SECTOR;
  } else if (config.page === 'oil-and-gas') {
    return config.mainSelection === 'gasProduction'
      ? queries.GAS_PRODUCTIONS
      : queries.OIL_PRODUCTIONS;
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
  const { config } = useConfig();
  const query = getQuery(config);
  const unitConversion = convertUnit(getDefaultUnit(config), config.unit);
  const sourceType = useMemo(
    () => PAGES.find(page => page.id === config.page).sourceTypes?.[config.mainSelection],
    [config.page, config.mainSelection],
  );
  const {
    yearIdIterations,
    regions: { order: regionOrder },
    sources: { [sourceType]: source },
  } = useAPI();

  /**
   * FIXME: these are temporary special cases for the Electricity and Oil and Gas pages.
   */
  const regions = useMemo(() => {
    if ((config.view === 'region') && (config.provinces[0] === 'ALL')) {
      return regionOrder;
    }
    return config.provinces;
  }, [config.view, config.provinces, regionOrder]);

  const sources = useMemo(() => {
    if ((config.view === 'source') && (config.sources[0] === 'ALL')) {
      return source.order;
    }

    // adds extra oil sources if sector 'transportation' is selected in the by-sector page.
    if (config.page === 'by-sector' && config.sector === 'TRANSPORTATION') {
      return [...config.sources, ...(config.sources.includes('OIL') ? ['AVIATION', 'DIESEL', 'GASOLINE'] : [])];
    }

    return config.sources;
  }, [config.page, config.view, config.sources, source, config.sector]);

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

  // Where to draw the forecast line.
  // 1 year before the current year for oil-and-gas.
  // 2 years before the current year for all others.
  const forecastStart = useMemo(() => (
    ['gasProduction', 'oilProduction']
      .indexOf(config.mainSelection) > -1
      ? parseInt(config.yearId, 10) - 1
      : parseInt(config.yearId, 10) - 2),
  [config.yearId, config.mainSelection]);

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

  /**
   * Determine all the unavailable / disabled items in the current data-set.
   * This is used to render the button boxes in the draggable list.
   */
  const unavailability = useCallback((key) => {
    const sums = (data?.resources || []).reduce((result, row) => ({
      ...result,
      [row[key]]: (result[row[key]] || 0) + row.value,
    }), {});
    return Object.keys(sums)
      .map(name => (Math.abs(sums[name]) < Number.EPSILON ? name : undefined))
      .filter(Boolean);
  }, [data]);

  return {
    loading,
    error,
    data: processedData,
    disabledRegions: unavailability('province'),
    disabledSources: unavailability('source'),
    // TODO: Remove after refactoring to move processedData chart structure data
    // into individual chart components
    rawData: data?.resources,
    year: years && {
      min: Math.min(...years),
      forecastStart,
      max: Math.max(...years),
    },
  };
};
