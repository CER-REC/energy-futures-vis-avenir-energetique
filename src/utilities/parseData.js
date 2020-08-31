import { SOURCE_COLOR } from "../constants";

export const parseData = {
  'by-sector': (data, unitConversion) => {
    const filteredData = {};
    data.forEach((entry) => {
      if (filteredData[entry.year]) {
        filteredData[entry.year][entry.source] = entry.value * unitConversion;
      } else if (entry.source !== 'ALL') {
        filteredData[entry.year] = { [entry.source]: entry.value * unitConversion };
      }
    });
    return Object.keys(filteredData).map(entry => filteredData[entry]);
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
    Object.keys(dataGroupedByYear).map(year => {
      dataGroupedByYear[year] = [...dataGroupedByYear[year]].reduce((result, entry) => ({
        ...result,
        [entry.province]: {
          ...result[entry.province],
          [entry.source]: { name: entry.source, color: SOURCE_COLOR[entry.source], value: entry.value * unitConversion },
        },
      }), {});
    });
    return dataGroupedByYear;
  },
};

export const NOOP = () => undefined;
