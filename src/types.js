import TotalIcon from '@material-ui/icons/DataUsage';
import ElectricityIcon from '@material-ui/icons/FlashOnOutlined';
import OilIcon from '@material-ui/icons/Opacity';
import GasIcon from '@material-ui/icons/LocalGasStation';
import CoalIcon from '@material-ui/icons/OutdoorGrillOutlined';
import WindIcon from '@material-ui/icons/ToysOutlined';
import BioIcon from '@material-ui/icons/EcoOutlined';
import NuclearIcon from '@material-ui/icons/PanoramaVerticalOutlined';
import HydroIcon from '@material-ui/icons/Waves';
import { SOURCE_COLOR } from './constants';

export const CONFIG_REPRESENTATION = {
  energyDemand: {
    name: 'Total Demand',
    icon: TotalIcon,
  },
  electricityGeneration: {
    name: 'Electricity',
    icon: ElectricityIcon,
  },
  oilProduction: {
    name: 'Oil Production',
    icon: OilIcon,
  },
  gasProduction: {
    name: 'Gas Production',
    icon: GasIcon,
  },

  petajoules: 'PETAJOULES',
  kilobarrelEquivalents: 'kBOE/d',
  gigawattHours: 'GW.h',
  kilobarrels: 'kB/d',
  thousandCubicMetres: 'km³/d',
  cubicFeet: 'Bcf/d',
  millionCubicMetres: 'Mm³/d',
};

export const REGIONS = {
  YT: { color: '#4E513F', label: 'Yukon' },
  SK: { color: '#4D8255', label: 'Saskatchewan' },
  QC: { color: '#985720', label: 'Quebec' },
  PE: { color: '#E49FAB', label: 'Prince Edward Island' },
  ON: { color: '#E4812C', label: 'Ontario' },
  NU: { color: '#683A96', label: 'Nunavut' },
  NT: { color: '#DA4367', label: 'Northwest Territories' },
  NS: { color: '#7773AF', label: 'Nova Scotia' },
  NL: { color: '#87C859', label: 'Newfoundland and Labrador' },
  NB: { color: '#B03AAB', label: 'New Brunswick' },
  MB: { color: '#F2CB53', label: 'Manitoba' },
  BC: { color: '#82BCE4', label: 'British Columbia' },
  AB: { color: '#274368', label: 'Alberta' },
};
export const REGION_ORDER = ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'];

export const SOURCES = {
  oilProducts: { label: 'Oil Products', icon: OilIcon, color: SOURCE_COLOR.OIL },
  nuclear: { label: 'Nuclear', icon: NuclearIcon, color: SOURCE_COLOR.NUCLEAR },
  bio: { label: 'Bio', icon: BioIcon, color: SOURCE_COLOR.BIO },
  naturalGas: { label: 'Natural Gas', icon: GasIcon, color: SOURCE_COLOR.GAS },
  coal: { label: 'Coal', icon: CoalIcon, color: SOURCE_COLOR.COAL },
  solarWindGeothermal: { label: 'Solar, Wind, Geothermal', icon: WindIcon, color: SOURCE_COLOR.RENEWABLE },
  hydro: { label: 'Hydro', icon: HydroIcon, color: SOURCE_COLOR.HYDRO },
  // electricity: { label: 'Electricity', icon: ElectricityIcon, color: '#7ACBCB' },
};
export const SOURCE_ORDER = ['oilProducts', 'bio', 'naturalGas', 'coal'];
export const ELECTRICITY_SOURCE_ORDER = [...SOURCE_ORDER, 'solarWindGeothermal', 'nuclear', 'hydro'];

export const DEFAULT_CONFIG = {
  page: 'landing', // e.g. by-region, by-sector, electricity, senarios, demand
  mainSelection: 'energyDemand', // e.g. electricityGeneration, oilProduction, gasProduction
  unit: 'petajoules', // e.g. kilobarrelEquivalents, gigawattHours, kilobarrels, thousandCubicMetres, cubicFeet, millionCubicMetres
  view: 'region', // e.g. region or source
  sector: 'total', // e.g. residential, commercial, industrial, or industrial
  scenarios: [],
  provinces: REGION_ORDER,
  provinceOrder: REGION_ORDER,
  sources: SOURCE_ORDER,
  sourceOrder: SOURCE_ORDER,
};
