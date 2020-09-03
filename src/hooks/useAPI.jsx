import { useMemo } from 'react';
import { useQuery } from '@apollo/react-hooks';
import gql from 'graphql-tag';

const CONFIG = gql`
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

const getI18NMessages = translations => (
  translations.reduce((i18nMessages, translation) => {
    let key;

    switch (translation.group) {
      case 'REGION':
        key = `regions.${translation.key}`;
        break;
      case 'SCENARIO':
        key = `components.scenarioSelect.${translation.key}.title`;
        break;
      case 'ELECTRICITY_SOURCE':
        key = `common.sources.electricity.${translation.key}`;
        break;
      case 'ENERGY_SOURCE':
        key = `common.sources.energy.${translation.key}`;
        break;
      case 'GAS_SOURCE':
        key = `common.sources.gas.${translation.key}`;
        break;
      case 'OIL_SOURCE':
        key = `common.sources.oil.${translation.key}`;
        break;
      case 'SECTOR':
        key = `components.horizontalControlBar.${translation.key}`;
        break;
      default:
        return i18nMessages;
    }

    // eslint-disable-next-line no-param-reassign
    i18nMessages.en[key] = translation.english;
    // eslint-disable-next-line no-param-reassign
    i18nMessages.fr[key] = translation.french;

    return i18nMessages;
  }, { en: {}, fr: {} })
);

export default () => {
  const { loading, error, data } = useQuery(CONFIG);
  const yearIdIterations = useMemo(
    () => (data ? getYearIdIterations(data.iterations) : {}),
    [data],
  );
  // TODO
  const regions = useMemo(
    () => (data ? {} : {}),
    [data],
  );
  // TODO
  const sources = useMemo(
    () => (data ? {} : {}),
    [data],
  );
  // TODO
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
