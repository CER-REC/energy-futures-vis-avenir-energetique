import { UNIT_NAMES } from '../constants';

const conversionTable = {
  petajoules: {
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
    // This conversion factor takes us from millions of cubic metres (Mm3) to
    // billions of cubic feet (BCF)
    // Mm3 * (35.3147 CF / m3) * (10^6 / M) * (B / 10^9) = BCF
    cubicFeet: 35.3147 / 1000,
  },
};

export const convertUnit = (prevUnit, newUnit) => {
  if (prevUnit && newUnit) {
    if (prevUnit !== newUnit) { return conversionTable[prevUnit][newUnit]; }
  }
  return 1;
};

const ABBREVIATIONS = [
  { magnitude: 1000, unit: 'M' },
  { magnitude: 1, unit: '' },
];
export const formatUnitAbbreviation = (value, unit) => {
  if (unit === UNIT_NAMES.kilobarrelEquivalents || unit === UNIT_NAMES.kilobarrels) {
    const match = ABBREVIATIONS.find(abbr => value / abbr.magnitude >= 1);
    const num = match ? (value / match.magnitude).toFixed(2) : value.toFixed(3);
    return `${Number(num).toLocaleString()} ${match?.unit || ''}${unit || ''}`.trim();
  }
  return `${Number(value.toFixed(2)).toLocaleString()} ${unit || ''}`.trim();
};
