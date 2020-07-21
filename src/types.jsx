import TotalIcon from '@material-ui/icons/DataUsage';
import ElectricityIcon from '@material-ui/icons/FlashOn';
import OilIcon from '@material-ui/icons/Opacity';
import GasIcon from '@material-ui/icons/LocalGasStation';

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

  reference: 'REFERENCE',
  technology: 'TECHNOLOGY',
  hcp: 'HIGH CO2 PRICE',
};

export const SOURCES = ['oilProducts', 'nuclear', 'bio', 'naturalGas', 'coal', 'solarWindGeothermal', 'hydro'];

export const PROVINCES = ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'];

// export const REGION_COLOR = {
//   'YT': 'rgb(31, 119, 180)',
//   'SK': 'rgb(174, 199, 232)',
//   'QC': 'rgb(255, 127, 14)',
//   'PE': 'rgb(255, 187, 120)',
//   'ON': 'rgb(44, 160, 44)',
//   'NU': 'rgb(152, 223, 138)',
//   'NT': 'rgb(214, 39, 40)',
//   'NS': 'rgb(255, 152, 150)',
//   'NL': 'rgb(148, 103, 189)',
//   'NB': 'rgb(197, 176, 213)',
//   'MB': 'rgb(140, 86, 75)',
//   'BC': 'rgb(196, 156, 148)',
//   'AB': 'rgb(227, 119, 194)',
// };
export const REGION_COLOR = {
  YT: red,
  SK: purple,
  QC: deepPurple,
  PE: blue,
  ON: lightBlue,
  NU: teal,
  NT: green,
  NS: lightGreen,
  NL: lime,
  NB: yellow,
  MB: amber,
  BC: orange,
  AB: deepOrange,
};
export const REGION_LABEL = {
  AB: 'Alberta',
  BC: 'British Columbia',
  MB: 'Manitoba',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  NT: 'Northwest Territories',
  NS: 'Nova Scotia',
  NU: 'Nunavut',
  ON: 'Ontario',
  PE: 'Prince Edward Island',
  QC: 'Quebec',
  SK: 'Saskatchewan',
  YT: 'Yukon',
};

export const DEFAULT_CONFIG = {
  page: 'landing', // e.g. by-region, by-sector, electricity, senarios, demand
  mainSelection: 'energyDemand', // e.g. electricityGeneration, oilProduction, gasProduction
  unit: 'petajoules', // e.g. kilobarrelEquivalents, gigawattHours, kilobarrels, thousandCubicMetres, cubicFeet, millionCubicMetres
  year: '2019',
  scenario: 'reference', // e.g. technology, hcp
  provinces: PROVINCES,
  provinceOrder: PROVINCES,
};
