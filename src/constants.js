import TotalIcon from '@material-ui/icons/DataUsage';
import ElectricityIcon from '@material-ui/icons/FlashOn';
import OilIcon from '@material-ui/icons/Opacity';
import GasIcon from '@material-ui/icons/LocalGasStation';
import ResidentialIcon from '@material-ui/icons/HouseOutlined';
import CommercialIcon from '@material-ui/icons/ApartmentOutlined';
import IndustrialIcon from '@material-ui/icons/BuildOutlined';
import TransportIcon from '@material-ui/icons/LocalShippingOutlined';

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
  },
  {
    label: 'Electricity',
    id: 'electricity',
    bg: '#363796',
  },
  {
    label: 'Scenarios',
    id: 'scenarios',
    bg: '#CA9830',
  },
  {
    label: 'Demand',
    id: 'demand',
    bg: '#CC6666',
  },
];

export const YEARS = ['2019', '2018', '2017', '2016*', '2016'];

export const CONFIG_LAYOUT = {
  energyDemand: {
    name: 'Total Demand',
    icon: TotalIcon,
    unit: ['petajoules', 'kilobarrelEquivalents'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
  electricityGeneration: {
    name: 'Electricity',
    icon: ElectricityIcon,
    unit: ['petajoules', 'gigawattHours', 'kilobarrelEquivalents'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
  oilProduction: {
    name: 'Oil Production',
    icon: OilIcon,
    unit: ['kilobarrels', 'thousandCubicMetres'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
  gasProduction: {
    name: 'Gas Production',
    icon: GasIcon,
    unit: ['cubicFeet', 'millionCubicMetres'],
    year: YEARS,
    scenario: ['reference', 'technology', 'hcp'],
  },
};

export const SECTOR_LAYOUT = {
  total: {
    name: 'Total Demand',
    icon: TotalIcon,
  },
  residential: {
    name: 'Residential',
    icon: ResidentialIcon,
  },
  commercial: {
    name: 'Commercial',
    icon: CommercialIcon,
  },
  industrial: {
    name: 'Industrial',
    icon: IndustrialIcon,
  },
  transportation: {
    name: 'Transportation',
    icon: TransportIcon,
  },
};

export const SCENARIO_LAYOUT = {
  2019: ['reference'],
  2018: ['reference', 'technology', 'highPrice', 'lowPrice'],
  2017: ['reference', 'technology', 'hcp'],
  2016: ['reference', 'highPrice', 'lowPrice', 'constrained', 'highLng', 'noLng'],
  default: ['reference'],
};

export const SCENARIO_TOOPTIP = {
  reference: 'The Reference Case provides a baseline outlook, based on a moderate view of future energy prices and economic growth.',
  technology: 'The Technology Case considers higher carbon prices than the Reference Case and greater adoption of select emerging production and consumption energy technologies.',
  hcp: 'The Higher Carbon Price Case explores the impact of higher carbon pricing than in the Reference Case in the longer term.',
  highPrice: 'A price case with higher oil and natural gas prices captures some of the uncertainty related to future energy prices.',
  lowPrice: 'A price case with lower oil and natural gas prices captures some of the uncertainty related to future energy prices.',
  constrained: 'The EF 2016 report considers a case where no new major oil pipelines are built over the projection period to address uncertainties related to future oil export infrastructure.',
  highLng: 'The uncertainty related to eventual volumes of liquefied natural gas (LNG) exports is explored in two additional cases.',
  noLng: 'The uncertainty related to eventual volumes of liquefied natural gas (LNG) exports is explored in two additional cases.',
};
