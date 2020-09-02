import TotalIcon from '@material-ui/icons/DataUsage';
import ElectricityIcon from '@material-ui/icons/FlashOnOutlined';
import OilIcon from '@material-ui/icons/Opacity';
import GasIcon from '@material-ui/icons/LocalGasStation';
import CoalIcon from '@material-ui/icons/OutdoorGrillOutlined';
import WindIcon from '@material-ui/icons/ToysOutlined';
import BioIcon from '@material-ui/icons/EcoOutlined';
// import NuclearIcon from '@material-ui/icons/PanoramaVerticalOutlined';
// import HydroIcon from '@material-ui/icons/Waves';

import {
  red, purple, deepPurple, blue, lightBlue, teal, green,
  lightGreen, lime, yellow, amber, orange, deepOrange,
} from '@material-ui/core/colors';

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
  YT: { color: red, label: 'Yukon' },
  SK: { color: purple, label: 'Saskatchewan' },
  QC: { color: deepPurple, label: 'Quebec' },
  PE: { color: blue, label: 'Prince Edward Island' },
  ON: { color: lightBlue, label: 'Ontario' },
  NU: { color: teal, label: 'Nunavut' },
  NT: { color: green, label: 'Northwest Territories' },
  NS: { color: lightGreen, label: 'Nova Scotia' },
  NL: { color: lime, label: 'Newfoundland and Labrador' },
  NB: { color: yellow, label: 'New Brunswick' },
  MB: { color: amber, label: 'Manitoba' },
  BC: { color: orange, label: 'British Columbia' },
  AB: { color: deepOrange, label: 'Alberta' },
};
export const REGION_ORDER = ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'];

export const SOURCES = {
  oilProducts: { label: 'Oil Products', icon: OilIcon, color: '#B56696' },
  // nuclear: { label: 'Nuclear', icon: NuclearIcon, color: '#CBCA44' },
  bio: { label: 'Bio', icon: BioIcon, color: '#8468A9' },
  naturalGas: { label: 'Natural Gas', icon: GasIcon, color: '#D5673E' },
  coal: { label: 'Coal', icon: CoalIcon, color: '#8C6639' },
  solarWindGeothermal: { label: 'Solar, Wind, Geothermal', icon: WindIcon, color: '#60984D' },
  // hydro: { label: 'Hydro', icon: HydroIcon, color: '#4F67AE' },
  // electricity: { label: 'Electricity', icon: ElectricityIcon, color: '#7ACBCB' },
};

export const SOURCE_ORDER = ['oilProducts', 'bio', 'naturalGas', 'coal', 'solarWindGeothermal'];

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
