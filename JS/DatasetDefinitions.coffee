path = require 'path'

ApplicationRoot = require '../ApplicationRoot.coffee'

csvDir = 'public/CSV'

DatasetDefinitions = 

  jan2016: 
    dataFiles:
      energyDemand: path.join(ApplicationRoot, csvDir, '2016-01_EnergyDemand.csv')
      oilProduction: path.join(ApplicationRoot, csvDir, '2016-01_CrudeOilProduction.csv')
      electricityGeneration: path.join(ApplicationRoot, csvDir, '2016-01_ElectricityGeneration.csv')
      gasProduction: path.join(ApplicationRoot, csvDir, '2016-01_NaturalGasProduction.csv')

    scenarios: [
      'reference'
      'high'
      'low'
      'highLng'
      'noLng'
      'constrained' 
    ]

  oct2016: 
    dataFiles:
      energyDemand: path.join(ApplicationRoot, csvDir, '2016-10-18_EnergyDemand.csv')
      oilProduction: path.join(ApplicationRoot, csvDir, '2016-10-18_CrudeOilProduction.csv')
      electricityGeneration: path.join(ApplicationRoot, csvDir, '2016-10-27_ElectricityGeneration.csv')
      gasProduction: path.join(ApplicationRoot, csvDir, '2016-10-18_NaturalGasProduction.csv')

    scenarios: [
      'reference'
      'high'
      'low'
    ]


module.exports = DatasetDefinitions