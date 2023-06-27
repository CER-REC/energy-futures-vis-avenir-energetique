export const formatTotalLineData = (data) => {
  if (!data?.length) {
    return null;
  }

  const sortedData = data.sort((a, b) => a.year - b.year);
  const scenarioTotals = sortedData.reduce((scenarios, resource) => ({
    ...scenarios,
    [resource.scenario]: {
      ...scenarios[resource.scenario],
      [resource.year]: (scenarios[resource.scenario]?.[resource.year] || 0) + resource.value,
    },
  }), {});

  return Object.keys(scenarioTotals).map(scenario => ({
    id: scenario,
    data: Object.keys(scenarioTotals[scenario]).map(
      year => ({ x: parseInt(year, 10), y: scenarioTotals[scenario][year] }),
    ),
  }));
};

export const formatLineData = (data, type, unitConversion = 1) => {
  if (!data) {
    return [];
  }

  const sortedData = data.sort((a, b) => a.year - b.year);
  const formattedData = sortedData.reduce((lineData, resource) => ({
    ...lineData,
    [resource[type]]: [
      ...lineData[resource[type]] || [],
      { x: resource.year, y: resource.value * unitConversion },
    ],
  }), {});

  return Object.keys(formattedData).map(key => ({
    id: key,
    data: formattedData[key],
  }));
};

export const parseData = {
  'by-sector': (data, unitConversion) => formatLineData(data, 'source', unitConversion),

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

  scenarios: (data, unitConversion) => formatLineData(data, 'scenario', unitConversion),

  electricity: (data, unitConversion, regions, sources, view) => {
    const dataByYear = (data || [])
      .filter(entry => (view === 'source'
        ? sources.includes(entry.source) && entry.province !== 'ALL' && entry.source !== 'ALL'
        : regions.includes(entry.province) && entry.province !== 'ALL' && entry.source !== 'ALL'))
      .reduce((result, entry) => ({
        ...result,
        [entry.year]: [...(result[entry.year] || []), entry],
      }), {});
    Object.keys(dataByYear).forEach((year) => {
      dataByYear[year] = [...dataByYear[year]].reduce((result, entry) => (entry.value ? ({
        ...result,
        [view === 'source' ? entry.source : entry.province]: [
          ...(result[view === 'source' ? entry.source : entry.province] || []), {
            name: view === 'source' ? entry.province : entry.source,
            value: entry.value * unitConversion,
          },
        ],
      }) : result), {});
    });
    return dataByYear;
  },

  'oil-and-gas': (data, unitConversion, regions, sources, view) => {
    /*
    The data structure between the two views is very similar.
    To take advantage of this, the structure can be easily re arranged
    by determining the view, and swapping the variables in the logic below.
    The values of inner and outer describe which selections will be on the inner structure,
    and outer structure. Eg. bySource = { source: { name: province } }
    */
    const outer = view === 'source' ? 'source' : 'province';
    const inner = view === 'source' ? 'province' : 'source';

    const baseStructure = data.reduce((acc, val) => {
      if (!acc[val.year]) {
        acc[val.year] = [];
      }
      if (!acc[val.year].find(element => element.name === val[outer])) {
        acc[val.year].push({ name: val[outer], total: 0, children: [] });
      }
      return acc;
    }, {});

    // I am not super happy with the way this logic mutates the baseStructure
    data.reduce((acc, val) => {
      // filter out the ALLs
      if (val.source !== 'ALL' && val.value > 0) {
        const entry = acc[val.year].find(e => e.name === val[outer]);
        entry.children.push({
          name: val[inner],
          value: val.value * unitConversion,
        });
        entry.total += (val.value * unitConversion);
      }
      return acc;
    }, baseStructure);
    return baseStructure;
  },

  emissions: (data) => {
    const byYear = data.reduce((yearEmissions, emission) => {
      const yearSources = { ...yearEmissions };
      const { source, year } = emission;

      yearSources[year] = yearSources[year] || {};
      yearSources[year][source] = yearSources[year][source] || 0;
      yearSources[year][source] += emission.value;

      return yearSources;
    }, {});

    return Object.keys(byYear).map(year => ({ year, ...byYear[year] }));
  },
};

export const NOOP = () => undefined;

/**
 * Generate y-axis ticks using the given hightest value.
 */
export const getTicks = (highest, lowest = 0) => {
  const difference = highest - lowest;

  // e.g. when highest = 37500
  const exponent = Math.floor(Math.log(difference) / Math.LN10); // e.g. 4
  const magnitude = 10 ** exponent; // e.g. 10000
  const coefficient = difference / magnitude; // e.g. 3.75

  // calculate the interval size between adjacent ticks
  let step = magnitude / 10;
  if (coefficient > 2) step = magnitude / 2;
  if (coefficient > 8) step = magnitude;

  const max = Math.ceil(highest / step) * step;
  const min = lowest === 0 ? 0 : Math.floor(lowest / step) * step - step;

  const ticks = [];
  for (let i = min; i <= max;) {
    ticks.push(i);
    i = parseFloat((i + step).toFixed(3));
  }

  return ticks;
};

/**
 * Make sure the year value is always valid.
 */
export const validYear = (year, { min, max } = {}) => {
  if (year && year < (min || 0)) return (min || 0);
  if (year && year > (max || 2050)) return (max || 2050);
  return year || 0;
};
