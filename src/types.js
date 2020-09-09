import TotalIcon from '@material-ui/icons/DataUsage';
import ElectricityIcon from '@material-ui/icons/FlashOnOutlined';
import OilIcon from '@material-ui/icons/Opacity';
import GasIcon from '@material-ui/icons/LocalGasStation';
import CoalIcon from '@material-ui/icons/OutdoorGrillOutlined';
import WindIcon from '@material-ui/icons/ToysOutlined';
import BioIcon from '@material-ui/icons/EcoOutlined';
import NuclearIcon from '@material-ui/icons/PanoramaVerticalOutlined';
import HydroIcon from '@material-ui/icons/Waves';

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

export const SOURCES = {
  oilProducts: { label: 'Oil Products', icon: OilIcon, color: '#B56696' },
  nuclear: { label: 'Nuclear', icon: NuclearIcon, color: '#CBCA44' },
  bio: { label: 'Bio', icon: BioIcon, color: '#8468A9' },
  naturalGas: { label: 'Natural Gas', icon: GasIcon, color: '#D5673E' },
  coal: { label: 'Coal', icon: CoalIcon, color: '#8C6639' },
  solarWindGeothermal: { label: 'Solar, Wind, Geothermal', icon: WindIcon, color: '#60984D' },
  hydro: { label: 'Hydro', icon: HydroIcon, color: '#4F67AE' },
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
  provinces: [],
  provinceOrder: [],
  sources: SOURCE_ORDER,
  sourceOrder: SOURCE_ORDER,
};
