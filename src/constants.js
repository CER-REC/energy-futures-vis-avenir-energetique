import {
  IconDemand, IconTransportation, IconCommercial, IconResidential, IconIndustrial,
  IconElectricity, IconOil, IconGas, IconBiomass, IconBiofuel,
  IconCoal, IconHydro, IconNuclear, IconRenewable,
} from './icons';

export const applicationPath = {
  en: 'energy-future',
  fr: 'avenir-energetique',
};

export const lang = (typeof document !== 'undefined'
    && document.location
    && document.location.href
    && document.location.href.includes(applicationPath.fr))
  || (process.env.NODE_ENV === 'development'
    && typeof window !== 'undefined'
    && window.localStorage
    && window.localStorage.getItem('dev-lang') === 'fr')
  ? 'fr' : 'en';

export const API_HOST = process.env.API_HOST || '';

export const PAGES = [
  {
    label: 'Landing',
    id: 'landing',
    bg: '#EEE',
  },
  {
    label: 'By Region',
    id: 'by-region',
    bg: '#6799CC',
  },
  {
    label: 'By Sector',
    id: 'by-sector',
    bg: '#349999',
    sourceTypes: {
      energyDemand: 'energy',
    },
  },
  {
    label: 'Electricity',
    id: 'electricity',
    bg: '#363796',
    sourceTypes: {
      electricityGeneration: 'electricity',
    },
    views: ['region', 'source'],
  },
  {
    label: 'Scenarios',
    id: 'scenarios',
    bg: '#CA9830',
  },
  {
    label: 'Oil-and-Gas',
    id: 'oil-and-gas',
    bg: '#CC6666',
    sourceTypes: {
      oilProduction: 'oil',
      gasProduction: 'gas',
    },
    views: ['region', 'source'],
  },
  // {
  //   label: 'Demand',
  //   id: 'demand',
  //   bg: '#CC6666',
  // },
];

export const CONFIG_LAYOUT = {
  energyDemand: {
    name: 'Total Demand',
    icon: IconDemand,
    unit: ['petajoules', 'kilobarrelEquivalents'],
    pages: ['by-region', 'by-sector', 'scenarios'],
  },
  electricityGeneration: {
    name: 'Electricity Generation',
    icon: IconElectricity,
    unit: ['gigawattHours', 'petajoules', 'kilobarrelEquivalents'],
    pages: ['by-region', 'electricity', 'scenarios'],
  },
  oilProduction: {
    name: 'Oil Production',
    icon: IconOil,
    unit: ['kilobarrels', 'thousandCubicMetres'],
    pages: ['by-region', 'scenarios', 'oil-and-gas'],
  },
  gasProduction: {
    name: 'Gas Production',
    icon: IconGas,
    unit: ['cubicFeet', 'millionCubicMetres'],
    pages: ['by-region', 'scenarios', 'oil-and-gas'],
  },
};

export const SECTOR_ORDER = ['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'TRANSPORTATION'];

/**
 * TODO: replace it with real colors from UI designers.
 */
export const SCENARIO_COLOR = {
  Evolving: '#6D60E8',
  Reference: '#AAA',
  Technology: '#3692FA',
  'Higher Carbon Price': '#0B3CB4',
  'High Price': '#6C5AEB',
  'Low Price': '#082346',
  Constrained: '#4EEB8D',
  'High LNG': '#06A458',
  'No LNG': '#56D3EE',
};

export const REGION_COLORS = {
  YT: '#4B5E5B',
  SK: '#1C7F24',
  QC: '#AB5614',
  PE: '#FAA0AD',
  ON: '#FF821E',
  NU: '#753B95',
  NT: '#FC4169',
  NS: '#7A73B3',
  NL: '#5DCA4F',
  NB: '#CC37B0',
  MB: '#FFCC47',
  BC: '#5FBEE6',
  AB: '#054169',
};

export const SOURCE_COLORS = {
  electricity: {
    BIO: '#1C7F24',
    COAL: '#4B5E5B',
    HYDRO: '#5FBEE6',
    GAS: '#890038',
    OIL: '#FF821E',
    RENEWABLE: '#FFCC47',
    NUCLEAR: '#753B95',
  },
  energy: {
    BIO: '#1C7F24',
    COAL: '#4B5E5B',
    ELECTRICITY: '#7ACBCB',
    GAS: '#890038',
    OIL: '#FF821E',
  },
  gas: {
    CBM: '#9A65BA',
    SHALE: '#9B938A',
    SOLUTION: '#FA86AC',
    TIGHT: '#8C0038',
    NA: '#FFCC47',
  },
  oil: {
    C5: '#96B6CF',
    CONDENSATE: '#9B938A',
    HEAVY: '#FFCC47',
    ISB: '#FF821E',
    LIGHT: '#9A65BA',
    MB: '#4D4C45',
  },
  transportation: {
    AVIATION: '#FF821E',
    GASOLINE: '#FF821E',
    DIESEL: '#FF821E',
    OIL: '#FF821E',
  },
};

export const SOURCE_ICONS = {
  electricity: {
    BIO: IconBiomass,
    COAL: IconCoal,
    HYDRO: IconHydro,
    GAS: IconGas,
    OIL: IconOil,
    RENEWABLE: IconRenewable,
    NUCLEAR: IconNuclear,
  },
  energy: {
    BIO: IconBiofuel,
    COAL: IconCoal,
    ELECTRICITY: IconElectricity,
    GAS: IconGas,
    OIL: IconOil,
  },
  gas: {},
  oil: {},
  transportation: {},
};

export const SECTOR_ICONS = {
  RESIDENTIAL: IconResidential,
  COMMERCIAL: IconCommercial,
  INDUSTRIAL: IconIndustrial,
  TRANSPORTATION: IconTransportation,
};

export const CHART_PROPS = {
  margin: { top: 50, bottom: 50, left: 20, right: 50 },
  axisTop: null,
  axisLeft: null,
  enableLabel: false,
  animate: true,
  motionStiffness: 90,
  motionDamping: 15,
};
export const CHART_AXIS_PROPS = {
  tickSize: 5,
  tickPadding: 5,
  tickRotation: 0,
};
export const CHART_PATTERNS = [
  {
    id: 'dots',
    type: 'patternDots',
    size: 4,
    padding: 4,
    stagger: true,
  },
  {
    id: 'squares',
    type: 'patternSquares',
    size: 4,
    padding: 6,
    stagger: false,
  },
  {
    id: 'lines-diagonal',
    type: 'patternLines',
    spacing: 6,
    rotation: 45,
    lineWidth: 3,
  },
  {
    id: 'lines-vertical',
    type: 'patternLines',
    spacing: 6,
    rotation: 90,
    lineWidth: 3,
  },
].map(pattern => ({ ...pattern, background: '#FFF', color: '#000' }));

export const OIL_SUBGROUP = ['AVIATION', 'GASOLINE', 'DIESEL', 'OIL'];

export const SOURCE_PATTERNS = {
  AVIATION: 'dots',
  GASOLINE: 'lines-diagonal',
  DIESEL: 'squares',
  OIL: 'lines-vertical',
};
