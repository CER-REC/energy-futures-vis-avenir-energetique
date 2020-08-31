import { SOURCE_COLOR } from '../constants';

export const parseData = {
  'by-sector': (data, unitConversion) => {
    const DEFAULT = Object.keys(SOURCE_COLOR).reduce((all, key) => ({ ...all, [key]: 0 }), {});
    const processed = (data || []).filter(entry => entry.source !== 'ALL').reduce((result, entry) => ({
      ...result,
      [entry.year]: {
        ...(result[entry.year] || DEFAULT),
        [entry.source]: entry.value * unitConversion,
      },
    }), {});
    return Object.values(processed);
  },

  'by-region': (data, unitConversion) => {
    const byYear = data
      .filter(entry => entry.province !== 'ALL')
      .reduce((accu, curr) => {
        const result = { ...accu };
        if (!result[curr.year]) {
          result[curr.year] = {};
        }
        if (!result[curr.year][curr.province]) {
          result[curr.year][curr.province] = 0;
        }
        result[curr.year][curr.province] += (
          curr.value * unitConversion
        );
        return result;
      }, {});
    return Object.keys(byYear).map(year => ({ year, ...byYear[year] }));
  },

  scenarios: (data, unitConversion) => {
    const processed = data.reduce((result, entry) => ({
      ...result,
      [entry.scenario]: [
        ...result[entry.scenario] || [],
        { x: entry.year, y: entry.value * unitConversion },
      ],
    }), {});
    return Object.keys(processed).map(scenario => ({
      id: scenario,
      data: processed[scenario],
    }));
  },

  electricity: (data, unitConversion, regions) => {
    const dataGroupedByYear = (data || [])
      .filter(entry => regions.includes(entry.province) && entry.source !== 'ALL')
      .reduce((result, entry) => ({
        ...result,
        [entry.year]: [...(result[entry.year] || []), entry],
      }), {});
    Object.keys(dataGroupedByYear).forEach((year) => {
      dataGroupedByYear[year] = [...dataGroupedByYear[year]].reduce((result, entry) => ({
        ...result,
        [entry.province]: {
          ...result[entry.province],
          [entry.source]: {
            name: entry.source,
            color: SOURCE_COLOR[entry.source],
            value: entry.value * unitConversion,
          },
        },
      }), {});
    });
    return dataGroupedByYear;
  },
};

export const NOOP = () => undefined;
