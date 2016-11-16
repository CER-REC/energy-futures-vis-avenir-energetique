Promise = require 'bluebird'
fs = require 'fs'
readFile = Promise.promisify fs.readFile

ApplicationRoot = require '../../ApplicationRoot.coffee'

EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'

# Make singleton instances of the app's data files available on the server
# TODO: Upgrade this to work with multiple datasets at once.

ServerData = {}

ServerData.energyConsumptionProvider = new EnergyConsumptionProvider 
ServerData.oilProductionProvider = new OilProductionProvider 
ServerData.gasProductionProvider = new GasProductionProvider 
ServerData.electricityProductionProvider = new ElectricityProductionProvider

oilFilePromise = readFile "#{ApplicationRoot}/public/CSV/2016-10-18_CrudeOilProduction.csv"
ServerData.oilPromise = oilFilePromise.then (data) ->
  ServerData.oilProductionProvider.loadFromString data.toString()

gasFilePromise = readFile "#{ApplicationRoot}/public/CSV/2016-10-18_NaturalGasProduction.csv"
ServerData.gasPromise = gasFilePromise.then (data) ->
  ServerData.gasProductionProvider.loadFromString data.toString()

energyDemandFilePromise = readFile "#{ApplicationRoot}/public/CSV/2016-10-18_EnergyDemand.csv"
ServerData.energyPromise = energyDemandFilePromise.then (data) ->
  ServerData.energyConsumptionProvider.loadFromString data.toString()

electricityFilePromise = readFile "#{ApplicationRoot}/public/CSV/2016-10-27_ElectricityGeneration.csv"
ServerData.electricityPromise = electricityFilePromise.then (data) ->
  ServerData.electricityProductionProvider.loadFromString data.toString()

module.exports = ServerData
