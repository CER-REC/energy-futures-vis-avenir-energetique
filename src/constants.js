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

export const CONFIG_LAYOUT = {
  energyDemand: {
    name: 'Total Demand',
    icon: TotalIcon,
    unit: ['petajoules', 'kilobarrelEquivalents'],
  },
  electricityGeneration: {
    name: 'Electricity',
    icon: ElectricityIcon,
    unit: ['gigawattHours', 'petajoules', 'kilobarrelEquivalents'],
  },
  oilProduction: {
    name: 'Oil Production',
    icon: OilIcon,
    unit: ['kilobarrels', 'thousandCubicMetres'],
  },
  gasProduction: {
    name: 'Gas Production',
    icon: GasIcon,
    unit: ['millionCubicMetres', 'cubicFeet'],
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
