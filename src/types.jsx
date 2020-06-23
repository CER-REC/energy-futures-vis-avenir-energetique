import TotalIcon from '@material-ui/icons/DataUsage';
import ElectricityIcon from '@material-ui/icons/FlashOn';
import OilIcon from '@material-ui/icons/Opacity';
import GasIcon from '@material-ui/icons/LocalGasStation';

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

export const REGIONS = ['YT', 'SK', 'QC', 'PE', 'ON', 'NU', 'NT', 'NS', 'NL', 'NB', 'MB', 'BC', 'AB'];

export const DEFAULT_CONFIG = {
  mainSelection: 'energyDemand', // e.g. electricityGeneration, oilProduction, gasProduction
  unit: 'petajoules', // e.g. kilobarrelEquivalents, gigawattHours, kilobarrels, thousandCubicMetres, cubicFeet, millionCubicMetres
  year: 2019,
  scenario: 'reference', // e.g. technology, hcp
  regions: REGIONS,
};
