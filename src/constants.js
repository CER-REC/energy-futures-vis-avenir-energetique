import {
  IconTransportation, IconResidential, IconIndustrial,
  IconElectricity, IconOil, IconGas, IconBiomass, IconBiofuel,
  IconCoal, IconHydro, IconNuclear, IconHydrogen, IconWaste,
  IconAgriculture, IconOilGas, IconLand, IconSolar, IconWind, IconAir,
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
    label: 'Scenarios',
    id: 'scenarios',
    sourceTypes: {
      greenhouseGasEmission: 'greenhouseGas',
    },
  },
  {
    label: 'Landing',
    id: 'landing',
  },
  {
    label: 'Emissions',
    id: 'emissions',
    sourceTypes: {
      greenhouseGasEmission: 'greenhouseGas',
    },
  },
  {
    label: 'By Region',
    id: 'by-region',
  },
  {
    label: 'By Sector',
    id: 'by-sector',
    sourceTypes: {
      energyDemand: 'energy',
    },
  },
  {
    label: 'Electricity',
    id: 'electricity',
    sourceTypes: {
      electricityGeneration: 'electricity',
    },
    views: ['region', 'source'],
  },
  {
    label: 'Oil-and-Gas',
    id: 'oil-and-gas',
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
    unit: ['petajoules', 'kilobarrelEquivalents'],
    pages: ['by-region', 'by-sector', 'scenarios'],
  },
  electricityGeneration: {
    name: 'Electricity Generation',
    unit: ['gigawattHours', 'petajoules', 'kilobarrelEquivalents'],
    pages: ['by-region', 'electricity', 'scenarios'],
  },
  oilProduction: {
    name: 'Oil Production',
    unit: ['kilobarrels', 'thousandCubicMetres'],
    pages: ['by-region', 'scenarios', 'oil-and-gas'],
    priceSources: ['WTI', 'WCS', 'BRENT'],
  },
  gasProduction: {
    name: 'Gas Production',
    unit: ['cubicFeet', 'millionCubicMetres'],
    pages: ['by-region', 'scenarios', 'oil-and-gas'],
    priceSources: ['HH', 'NIT'],
  },
  greenhouseGasEmission: {
    name: 'Emissions',
    unit: ['megatonnes'],
    pages: ['scenarios', 'emissions'],
  },
};

export const SECTOR_ORDER = ['ALL', 'RESIDENTIAL', 'COMMERCIAL', 'INDUSTRIAL', 'TRANSPORTATION'];

export const GREENHOUSE_GAS_ORDER = ['WASTE', 'AGRI', 'BUILD', 'HEAVY', 'TRANSPORTATION', 'FOSSIL', 'LAND', 'ELECTRICITY', 'HYDROGEN', 'AIR'];

/**
 * TODO: replace it with real colors from UI designers.
 */
export const SCENARIO_COLOR = {
  'Global Net-zero': '#559B37',
  'Canada Net-zero': '#376787',
  'Current Measures': '#F0852D',
  'Current Policies': '#AAA',
  Evolving: '#6D60E8',
  'Evolving Policies': '#6D60E8',
  Reference: '#AAA',
  Technology: '#3692FA',
  'Higher Carbon Price': '#0B3CB4',
  'High Price': '#6C5AEB',
  'Low Price': '#082346',
  Constrained: '#4EEB8D',
  'High LNG': '#06A458',
  'No LNG': '#56D3EE',
};

export const SCENARIO_LABEL_COLOR = {
  Evolving: '#F4BE62',
  Reference: '#BEC0C2',
  netzero: '#8EC059',
  history: '#CBDEF1',
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
    NUCLEAR: '#753B95',
    SOLAR: '#FFCC47',
    WIND: '#018571',
  },
  energy: {
    BIO: '#1C7F24',
    COAL: '#4B5E5B',
    ELECTRICITY: '#7ACBCB',
    GAS: '#890038',
    OIL: '#FF821E',
    HYDROGEN: '#7A73B3',
  },
  gas: {
    CBM: '#9A65BA',
    SHALE: '#9B938A',
    SOLUTION: '#FA86AC',
    TIGHT: '#8C0038',
    NA: '#FFCC47',
  },
  greenhouseGas: {
    AGRI: '#AB5614',
    AIR: '#5DCA4F',
    BUILD: '#CC37B0',
    ELECTRICITY: '#7ACBCB',
    FOSSIL: '#FF821E',
    HEAVY: '#7A73B3',
    HYDROGEN: '#E58BAB',
    LAND: '#054169',
    TRANSPORTATION: '#F2CB53',
    WASTE: '#4B5E5B',
  },
  price: {},
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
    NUCLEAR: IconNuclear,
    SOLAR: IconSolar,
    WIND: IconWind,
  },
  energy: {
    BIO: IconBiofuel,
    COAL: IconCoal,
    ELECTRICITY: IconElectricity,
    GAS: IconGas,
    OIL: IconOil,
    HYDROGEN: IconHydrogen,
  },
  gas: {},
  greenhouseGas: {
    AGRI: IconAgriculture,
    AIR: IconAir,
    BUILD: IconResidential,
    ELECTRICITY: IconElectricity,
    FOSSIL: IconOilGas,
    HEAVY: IconIndustrial,
    HYDROGEN: IconHydrogen,
    LAND: IconLand,
    TRANSPORTATION: IconTransportation,
    WASTE: IconWaste,
  },
  oil: {},
  price: {},
  transportation: {},
};

export const CHART_PROPS = {
  margin: { top: 50, bottom: 50, left: 20, right: 60 },
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

export const GREENHOUSE_GAS_MARKERS = [{
  axis: 'y',
  value: 0,
  lineStyle: {
    stroke: 'black',
    strokeWidth: 3,
  },
}];

export const EXPIRY_MS = 259200000; // three days in milliseconds
