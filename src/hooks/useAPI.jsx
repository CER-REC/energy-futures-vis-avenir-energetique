import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

import { REGION_COLORS, SOURCE_COLORS, SOURCE_ICONS } from '../constants';
import getI18NMessages from '../utilities/getI18NMessages';

const defaultColor = '#000000';
const configQuery = gql`
  query {
    iterations {
      id
      year
      scenarios
    }
    translations {
      group
      key
      english
      french
    }
  }
`;

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
    oil: {},
  };
  const sourceTranslationGroupTypes = {
    ELECTRICITY_SOURCE: 'electricity',
    ENERGY_SOURCE: 'energy',
    GAS_SOURCE: 'gas',
    OIL_SOURCE: 'oil',
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
  });

  return sources;
};

export default () => {
  const { loading, error, data } = useQuery(configQuery);
  const yearIdIterations = useMemo(
    () => (data ? getYearIdIterations(data.iterations) : {}),
    [data],
  );
  const regions = useMemo(
    () => (data ? getRegions(data.translations) : { colors: {}, order: [] }),
    [data],
  );
  const sources = useMemo(
    () => (data
      ? getSources(data.translations)
      : { electricity: {}, energy: {}, oil: {}, gas: {} }),
    [data],
  );
  // TODO: Complete when sectors are made into an enum for GraphQL
  const sectors = useMemo(
    () => (data ? {} : {}),
    [data],
  );
  const translations = useMemo(
    () => (data ? getI18NMessages(data.translations) : {}),
    [data],
  );

  return { loading, error, yearIdIterations, regions, sources, sectors, translations };
};
