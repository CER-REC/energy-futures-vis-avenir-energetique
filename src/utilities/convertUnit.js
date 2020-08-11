const conversionTable = {
  petajoules:
    {
      kilobarrelEquivalents: 0.447507,
    },

  gigawattHours: {
    petajoules: 0.0036,
    kilobarrelEquivalents: 0.001611,
  },

  thousandCubicMetres: {
    kilobarrels: (1 / 0.159),
  },
  millionCubicMetres: {
    // This conversion factor takes us from millions of cubic metres (Mm3) to billions of cubic feet (BCF)
    // Mm3 * (35.3147 CF / m3) * (10^6 / M) * (B / 10^9) = BCF
    cubicFeet: 35.3147 / 1000,
    // cubicFeet: 35.3147 * 1000 to MCF (thousands of cubic feet)}
  },
};

export default (prevUnit, newUnit) => {
  if (prevUnit && newUnit) {
    if (prevUnit === newUnit) { return 1; }
    return conversionTable[prevUnit][newUnit];
  }
  return null;
};

