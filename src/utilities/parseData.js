export const parseData = {
  'by-sector': (data, unitConversion) => {
    const sources = data.map(resource => resource.source);
    const base = sources.reduce((all, key) => ({ ...all, [key]: 0 }), {});
    const processed = data.reduce((result, entry) => ({
      ...result,
      [entry.year]: {
        ...(result[entry.year] || base),
        [entry.source]: entry.value * unitConversion,
      },
    }), {});
    return Object.values(processed);
  },

  'by-region': (data, unitConversion) => {
    const byYear = data
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
            value: entry.value * unitConversion,
          },
        },
      }), {});
    });
    return dataGroupedByYear;
  },
};

export const NOOP = () => undefined;
