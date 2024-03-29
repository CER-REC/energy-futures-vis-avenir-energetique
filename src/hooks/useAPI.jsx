import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';

import { GREENHOUSE_GAS_ORDER, REGION_COLORS, SOURCE_COLORS, SOURCE_ICONS } from '../constants';
import getI18NMessages from '../utilities/getI18NMessages';
import { ITERATIONS_TRANSLATIONS } from './queries';

const defaultColor = '#000000';

const getYearIdIterations = iterations => (
  iterations.reduce((yearIdIterations, iteration) => {
    let yearId = iteration.year ? iteration.year.toString() : '';

    // Iterations are returned in ascending order of their year, month date
    while (yearIdIterations[yearId]) {
      yearId += '*';
    }

    // eslint-disable-next-line no-param-reassign
    yearIdIterations[yearId] = iteration;

    return yearIdIterations;
  }, {})
);

const getRegions = (translations) => {
  const colors = {};
  const regionEnums = translations.filter(
    translation => translation.group === 'REGION',
  ).map(
    translation => translation.key,
  );
  const order = regionEnums.filter(region => region !== 'ALL').sort().reverse();

  regionEnums.forEach((region) => {
    colors[region] = REGION_COLORS[region] || defaultColor;
  });

  return { colors, order };
};

const getSources = (translations) => {
  const sources = {
    electricity: {},
    energy: {},
    gas: {},
    greenhouseGas: {},
    oil: {},
    price: {},
    transportation: {},
  };
  const sourceTranslationGroupTypes = {
    ELECTRICITY_SOURCE: 'electricity',
    ENERGY_SOURCE: 'energy',
    GAS_SOURCE: 'gas',
    GREENHOUSE_GAS_SOURCE: 'greenhouseGas',
    OIL_SOURCE: 'oil',
    PRICE_SOURCE: 'price',
    TRANSPORTATION_OIL_ENERGY_SOURCE: 'transportation',
  };

  Object.keys(sourceTranslationGroupTypes).forEach((group) => {
    const colors = {};
    const icons = {};
    const type = sourceTranslationGroupTypes[group];
    const enums = translations.filter(
      translation => translation.group === group,
    ).map(
      translation => translation.key,
    );
    const order = enums.filter(source => source !== 'ALL').sort();

    enums.forEach((source) => {
      colors[source] = SOURCE_COLORS[type][source] || defaultColor;
      icons[source] = SOURCE_ICONS[type][source];
    });

    sources[type].colors = colors;
    sources[type].icons = icons;
    sources[type].order = order;

    if (type === 'greenhouseGas') {
      sources[type].order = GREENHOUSE_GAS_ORDER;
    }
  });

  return sources;
};

const getSectors = (translations) => {
  const sectorEnums = translations.filter(
    translation => translation.group === 'SECTOR',
  ).map(
    translation => translation.key,
  );
  const order = sectorEnums.filter(sector => sector !== 'ALL');

  order.unshift('ALL');

  return order;
};

export default () => {
  const { loading, error, data } = useQuery(ITERATIONS_TRANSLATIONS);

  const yearIdIterations = useMemo(
    () => (data ? getYearIdIterations(data.iterations) : {}),
    [data],
  );
  const regions = useMemo(
    () => (data ? getRegions(data.translations) : { colors: {}, order: [] }),
    [data],
  );
  const sources = useMemo(
    () => (data ? getSources(data.translations) : {
      electricity: {},
      energy: {},
      oil: {},
      gas: {},
      greenhouseGas: {},
      price: {},
      transportation: {},
    }),
    [data],
  );
  const sectors = useMemo(
    () => (data ? getSectors(data.translations) : []),
    [data],
  );
  const translations = useMemo(
    () => (data ? getI18NMessages(data.translations) : {}),
    [data],
  );

  return { loading, error, yearIdIterations, regions, sources, sectors, translations };
};
