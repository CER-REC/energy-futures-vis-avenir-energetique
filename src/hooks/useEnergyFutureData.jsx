import { useMemo, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { PAGES } from '../constants';
import useAPI from './useAPI';
import useConfig from './useConfig';
import { convertUnit } from '../utilities/convertUnit';
import * as queries from './queries';

const priceStartYear = 2023;

const getQuery = (config, interationYear) => {
  if (config.mainSelection === 'greenhouseGasEmission') {
    return queries.GREENHOUSE_GAS_EMISSIONS_SOURCE;
  }

  if (['by-region', 'scenarios'].includes(config.page)) {
    switch (config.mainSelection) {
      case 'oilProduction':
        if (interationYear >= priceStartYear) {
          return queries.OIL_PRODUCTIONS_ALL_WITH_PRICES;
        }

        return queries.OIL_PRODUCTIONS_ALL;
      case 'energyDemand':
        return queries.ENERGY_DEMAND;
      case 'gasProduction':
        if (interationYear >= priceStartYear) {
          return queries.GAS_PRODUCTIONS_ALL_WITH_PRICES;
        }

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

const getPriceYear = iterationYear => (iterationYear === 2018 ? 2016 : iterationYear - 1);

export default () => {
  const { config } = useConfig();
  const interationYear = useMemo(() => parseInt(config.yearId, 10), [config.yearId]);
  const query = getQuery(config, interationYear);
  const unitConversion = convertUnit(getDefaultUnit(config), config.unit);
  const sourceType = useMemo(
    () => PAGES.find(page => page.id === config.page).sourceTypes?.[config.mainSelection],
    [config.page, config.mainSelection],
  );
  const {
    yearIdIterations,
    sources: { [sourceType]: source },
  } = useAPI();

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
      sectors: config.sector,
      sources,
      priceSource: config.priceSource,
    },
    // do nothing if the request is invalid
    skip: !query
      || (sourceType && (!config.sources || config.sources.length === 0))
      || !config.scenarios || config.scenarios.length === 0,
  });

  const years = useMemo(() => data?.resources?.map(entry => entry.year), [data]);

  const forecastStart = useMemo(() => {
    if (config.yearId === '2023') {
      return 2022;
    }

    if (!['gasProduction', 'oilProduction'].includes(config.mainSelection)) {
      return interationYear - 1;
    }

    return interationYear;
  }, [interationYear, config.mainSelection, config.yearId]);

  const filteredData = useMemo(() => {
    let selectedProvinces = config.provinces;
    let selectedSources = config.sources;

    if (config.page === 'by-sector' && config.sector === 'TRANSPORTATION') {
      selectedSources = [...config.sources, ...(config.sources.includes('OIL') ? ['AVIATION', 'DIESEL', 'GASOLINE'] : [])];
    }

    if (config.view === 'region' && config.provinces[0] === 'ALL') selectedProvinces = config.provinceOrder;
    if (config.view === 'source' && config.sources[0] === 'ALL') selectedSources = config.sourceOrder;

    if (config.page === 'electricity') {
      if (config.view === 'region') {
        selectedSources = config.sourceOrder;
      } else if (config.view === 'source') {
        selectedProvinces = config.provinceOrder;
      }
    }

    return data?.resources
      .filter(item => !item.province || selectedProvinces?.includes(item.province))
      .filter(item => !item.source || selectedSources?.includes(item.source));
  }, [data, config]);

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
    prices: data?.prices,
    priceYear: getPriceYear(yearIdIterations[config.yearId].year),
    disabledRegions: unavailability('province'),
    disabledSources: unavailability('source'),
    // into individual chart components
    data: filteredData && filteredData.find(row => row.value !== 0)
      ? filteredData
      : null,
    unitConversion,
    year: years ? {
      min: Math.min(...years),
      forecastStart,
      max: Math.max(...years),
    } : { min: 0, forecastStart: 0, max: 0 },
  };
};
