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
