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
