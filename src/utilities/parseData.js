export const parseData = {
  'by-sector': (data, unitConversion) => {
    const sortedData = data.sort((a, b) => a.year - b.year);
    const processed = sortedData
      .reduce((result, entry) => ({
        ...result,
        [entry.source]: [
          ...result[entry.source] || [],
          { x: entry.year, y: entry.value * unitConversion },
        ],
      }), {});
    return Object.keys(processed).map(source => ({
      id: source,
      data: processed[source],
    }));
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
};

export const NOOP = () => undefined;

/**
 * Generate y-axis ticks using the given hightest value.
 */
const STEPS = highest => [1, 10, (highest > 500 ? 50 : 20), (highest > 5000 ? 500 : 200)];
export const getMaxTick = (highest) => {
  if (!highest || Number.isNaN(highest)) {
    return { highest, max: 'auto', step: undefined, ticks: undefined };
  }
  const magnitude = Math.floor(Math.log(highest) / Math.LN10);
  const step = STEPS(highest)[magnitude] || 1000;
  const max = Math.ceil(highest / step) * step;
  const ticks = max > 0 && step && Array(max / step + 1)
    .fill(undefined)
    .map((_, i) => i * step)
    .filter(tick => tick < highest && (highest - tick) > (step / 2));
  return { highest, max, step, ticks: ticks ? [...ticks, parseInt(highest, 10)] : undefined };
};
