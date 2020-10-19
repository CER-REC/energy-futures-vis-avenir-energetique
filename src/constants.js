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

// TODO: Remove and replace using intl in the relevant components for translations
export const UNIT_NAMES = {
  petajoules: 'PETAJOULES',
  kilobarrelEquivalents: 'mBOE/d',
  gigawattHours: 'GW.h',
  kilobarrels: 'kB/d',
  thousandCubicMetres: 'km³/d',
  cubicFeet: 'Bcf/d',
  millionCubicMetres: 'Mm³/d',
};

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
    sourceType: 'energy',
  },
  {
    label: 'Electricity',
    id: 'electricity',
    bg: '#363796',
    sourceType: 'electricity',
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
    unit: ['millionCubicMetres', 'cubicFeet'],
    pages: ['by-region', 'scenarios', 'oil-and-gas'],
  },
};

/**
 * TODO: replace it with real colors from UI designers.
 */
export const SCENARIO_COLOR = {
  Reference: '#AAA',
  Technology: '#3692FA',
  'Higher Carbon Price': '#0B3CB4',
  'High Price': '#6C5AEB',
  'Low Price': '#082346',
  Constrained: '#333333',
  'High LNG': '#2B6762',
  'No LNG': '#3692FA',
};

export const REGION_COLORS = {
  YT: '#4E513F',
  SK: '#4D8255',
  QC: '#985720',
  PE: '#E49FAB',
  ON: '#E4812C',
  NU: '#683A96',
  NT: '#DA4367',
  NS: '#7773AF',
  NL: '#87C859',
  NB: '#B03AAB',
  MB: '#F2CB53',
  BC: '#82BCE4',
  AB: '#274368',
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
    CBM: '#4D8255',
    SHALE: '#7ACBCB',
    SOLUTION: '#F2CB53',
    TIGHT: "won't work since it's missing",
    NA: "won't work since it's missing",
  },
  oil: {},
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
};

export const SECTOR_ICONS = {
  RESIDENTIAL: IconResidential,
  COMMERCIAL: IconCommercial,
  INDUSTRIAL: IconIndustrial,
  TRANSPORTATION: IconTransportation,
};

export const DEFAULT_CONFIG = {
  page: 'landing', // e.g. by-region, by-sector, electricity, senarios, demand
  mainSelection: 'energyDemand', // e.g. electricityGeneration, oilProduction, gasProduction
  unit: 'petajoules', // e.g. kilobarrelEquivalents, gigawattHours, kilobarrels, thousandCubicMetres, cubicFeet, millionCubicMetres
  view: 'region', // e.g. region or source
  sector: 'ALL', // e.g. ALL, RESIDENTIAL, COMMERCIAL, INDUSTRIAL, OR TRANSPORTATION
  scenarios: [],
  provinces: [],
  provinceOrder: [],
  sources: [],
  sourceOrder: [],
};

export const CHART_PROPS = {
  margin: { top: 50, bottom: 50, left: 20, right: 80 },
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
