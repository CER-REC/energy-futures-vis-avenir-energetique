path = require 'path'

ApplicationRoot = require '../ApplicationRoot.coffee'

csvDir = 'public/CSV'

DatasetFiles =

  jan2016:
    energyDemand: path.join ApplicationRoot, csvDir, '2016-01_EnergyDemand.csv'
    oilProduction: path.join ApplicationRoot, csvDir, '2016-01_CrudeOilProduction.csv'
    electricityGeneration: path.join ApplicationRoot, csvDir, '2016-01_ElectricityGeneration.csv'
    gasProduction: path.join ApplicationRoot, csvDir, '2016-01_NaturalGasProduction.csv'

  # 2016 update dataset removed as part of 2018 update
  # oct2016:
  #   energyDemand: path.join ApplicationRoot, csvDir, '2016-10-18_EnergyDemand.csv'
  #   oilProduction: path.join ApplicationRoot, csvDir, '2016-10-18_CrudeOilProduction.csv'
  #   electricityGeneration: path.join ApplicationRoot, csvDir, '2016-10-27_ElectricityGeneration.csv'
  #   gasProduction: path.join ApplicationRoot, csvDir, '2016-10-18_NaturalGasProduction.csv'

  oct2017:
    energyDemand: path.join ApplicationRoot, csvDir, '2017-09_EnergyDemand_Updated.csv'
    oilProduction: path.join ApplicationRoot, csvDir, '2017-09_CrudeOilProduction_Updated.csv'
    electricityGeneration: path.join ApplicationRoot, csvDir, '2017-09_ElectricityGeneration_Updated.csv'
    gasProduction: path.join ApplicationRoot, csvDir, '2017-09_NaturalGasProduction.csv'

  oct2018:
    energyDemand: path.join ApplicationRoot, csvDir, '2018-10-26_EnergyDemand.csv'
    oilProduction: path.join ApplicationRoot, csvDir, '2018-10-31_CrudeOilProduction.csv'
    electricityGeneration: path.join ApplicationRoot, csvDir, '2018_ElectricityGeneration_2019_10_28.csv'
    gasProduction: path.join ApplicationRoot, csvDir, '2018-10-16_NaturalGasProduction.csv'



module.exports = DatasetFiles