path = require 'path'

ApplicationRoot = require '../ApplicationRoot.coffee'

csvDir = 'public/CSV'

DatasetFiles =

  jan2016:
    energyDemand: path.join ApplicationRoot, csvDir, '2016-01_EnergyDemand.csv'
    oilProduction: path.join ApplicationRoot, csvDir, '2016-01_CrudeOilProduction.csv'
    electricityGeneration: path.join ApplicationRoot, csvDir, '2016-01_ElectricityGeneration.csv'
    gasProduction: path.join ApplicationRoot, csvDir, '2016-01_NaturalGasProduction.csv'

  oct2016:
    energyDemand: path.join ApplicationRoot, csvDir, '2016-10-18_EnergyDemand.csv'
    oilProduction: path.join ApplicationRoot, csvDir, '2016-10-18_CrudeOilProduction.csv'
    electricityGeneration: path.join ApplicationRoot, csvDir, '2016-10-27_ElectricityGeneration.csv'
    gasProduction: path.join ApplicationRoot, csvDir, '2016-10-18_NaturalGasProduction.csv'

  oct2017:
    energyDemand: path.join ApplicationRoot, csvDir, 'Demand_EF2017Prelim_VIZ.csv'
    oilProduction: path.join ApplicationRoot, csvDir, 'crude oil production VIZ.EF.17.csv'
    electricityGeneration: path.join ApplicationRoot, csvDir, 'ElectricityGeneration_VIZ.EF17.csv'
    gasProduction: path.join ApplicationRoot, csvDir, 'Natural gas production VIZ.EF.2017.csv'


module.exports = DatasetFiles