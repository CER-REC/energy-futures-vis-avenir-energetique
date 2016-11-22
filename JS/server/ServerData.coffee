Promise = require 'bluebird'
fs = require 'fs'
readFile = Promise.promisify fs.readFile

ApplicationRoot = require '../../ApplicationRoot.coffee'

EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'

DatasetDefinitions = require '../DatasetDefinitions.coffee'


# Make singleton instances of the app's data files available on the server


ServerData = {}


loadDataset = (datasetName, datasetDefinition) ->

  dataset = {}

  dataset.energyConsumptionProvider = new EnergyConsumptionProvider 
  dataset.oilProductionProvider = new OilProductionProvider 
  dataset.gasProductionProvider = new GasProductionProvider 
  dataset.electricityProductionProvider = new ElectricityProductionProvider

  oilFilePromise = readFile datasetDefinition.dataFiles.oilProduction
  gasFilePromise = readFile datasetDefinition.dataFiles.gasProduction
  energyDemandFilePromise = readFile datasetDefinition.dataFiles.energyDemand
  electricityFilePromise = readFile datasetDefinition.dataFiles.electricityGeneration

  dataset.oilPromise = oilFilePromise.then (data) ->
    dataset.oilProductionProvider.loadFromString data.toString()

  dataset.gasPromise = gasFilePromise.then (data) ->
    dataset.gasProductionProvider.loadFromString data.toString()

  dataset.energyPromise = energyDemandFilePromise.then (data) ->
    dataset.energyConsumptionProvider.loadFromString data.toString()

  dataset.electricityPromise = electricityFilePromise.then (data) ->
    dataset.electricityProductionProvider.loadFromString data.toString()

  ServerData[datasetName] = dataset


for datasetName, datasetDefinition of DatasetDefinitions
  loadDataset datasetName, datasetDefinition

module.exports = ServerData
