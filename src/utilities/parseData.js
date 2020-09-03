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

    const keys = Object.keys(processed);
    return {
      data: Object.values(processed),
      year: {
        min: parseInt(keys[0], 10),
        max: parseInt(keys[keys.length - 1], 10),
      },
    };
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

    const keys = Object.keys(byYear);
    return {
      data: Object.keys(byYear).map(year => ({ year, ...byYear[year] })),
      year: {
        min: parseInt(keys[0], 10),
        max: parseInt(keys[keys.length - 1], 10),
      },
    };
  },

  scenarios: (data, unitConversion, regions) => {
    const processed = data
      .filter(entry => entry.province === regions[0]) // Scenarios chart only take single region
      .reduce((result, entry) => ({
        ...result,
        [entry.scenario]: [
          ...result[entry.scenario] || [],
          { x: entry.year, y: entry.value * unitConversion },
        ],
      }), {});

    const returnData = Object.keys(processed).map(scenario => ({
      id: scenario,
      data: processed[scenario],
    }));

    return {
      data: returnData,
      year: {
        min: returnData.length
          ? parseInt(returnData[0].data[0].x, 10)
          : 0,
        max: returnData.length
          ? parseInt(returnData[0].data[returnData[0].data.length - 1].x, 10)
          : 0,
      },
    };
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

    const keys = Object.keys(dataGroupedByYear);
    return {
      data: dataGroupedByYear,
      year: {
        min: parseInt(keys[0], 10),
        max: parseInt(keys[keys.length - 1], 10),
      },
    };
  },
};

export const NOOP = () => undefined;
