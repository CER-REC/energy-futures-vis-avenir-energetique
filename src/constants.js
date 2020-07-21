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

export const TABS = [
  {
    label: 'By Region',
    page: 'by-region',
    bg: '#6799CC',
  },
  {
    label: 'By Sector',
    page: 'by-sector',
    bg: '#349999',
  },
  {
    label: 'Electricity',
    page: 'electricity',
    bg: '#363796',
  },
  {
    label: 'Scenarios',
    page: 'scenarios',
    bg: '#CA9830',
  },
  {
    label: 'Demand',
    page: 'demand',
    bg: '#CC6666',
  },
];

export const YEARS = ['2019', '2018', '2017', '2016', '2016 Updated'];

export const CONFIG_LAYOUT = {
  energyDemand: {
    unit: ['petajoules', 'kilobarrelEquivalents'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
  electricityGeneration: {
    unit: ['petajoules', 'gigawattHours', 'kilobarrelEquivalents'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
  oilProduction: {
    unit: ['kilobarrels', 'thousandCubicMetres'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
  gasProduction: {
    unit: ['cubicFeet', 'millionCubicMetres'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
};
