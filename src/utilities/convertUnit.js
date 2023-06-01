const conversionTable = {
  petajoules: {
    kilobarrelEquivalents: 0.447,
  },

  gigawattHours: {
    petajoules: 0.0036,
    kilobarrelEquivalents: 0.001611,
  },

  thousandCubicMetres: {
    kilobarrels: 6.2898,
  },

  millionCubicMetres: {
    // This conversion factor takes us from millions of cubic metres (Mm3) to
    // billions of cubic feet (BCF)
    // Mm3 * (35.3147 CF / m3) * (10^6 / M) * (B / 10^9) = BCF
    cubicFeet: 0.035301,
  },
};

export const convertUnit = (prevUnit, newUnit) => {
  if (prevUnit && newUnit) {
    if (prevUnit !== newUnit) { return conversionTable[prevUnit][newUnit]; }
  }
  return 1;
};

export const formatValue = (value, intl, twoDecimals) => Number(value.toFixed(2))
  .toLocaleString(intl.locale, { minimumFractionDigits: twoDecimals ? 2 : 0 });
