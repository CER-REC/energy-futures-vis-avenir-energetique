Promise = require 'bluebird'
fs = require 'fs'
readFile = Promise.promisify fs.readFile

EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'

DatasetFiles = require '../DatasetFiles.coffee'


# Make singleton instances of the app's data files available on the server


ServerData = {}

ServerData.loadPromises = []


loadDataset = (datasetName, datasetFiles) ->

  dataset = {}

  dataset.energyConsumptionProvider = new EnergyConsumptionProvider
  dataset.oilProductionProvider = new OilProductionProvider
  dataset.gasProductionProvider = new GasProductionProvider
  dataset.electricityProductionProvider = new ElectricityProductionProvider

  oilFilePromise = readFile datasetFiles.oilProduction
  gasFilePromise = readFile datasetFiles.gasProduction
  energyDemandFilePromise = readFile datasetFiles.energyDemand
  electricityFilePromise = readFile datasetFiles.electricityGeneration

  dataset.oilPromise = oilFilePromise.then (data) ->
    dataset.oilProductionProvider.loadFromString data.toString()
  ServerData.loadPromises.push dataset.oilPromise

  dataset.gasPromise = gasFilePromise.then (data) ->
    dataset.gasProductionProvider.loadFromString data.toString()
  ServerData.loadPromises.push dataset.gasPromise

  dataset.energyPromise = energyDemandFilePromise.then (data) ->
    dataset.energyConsumptionProvider.loadFromString data.toString()
  ServerData.loadPromises.push dataset.energyPromise

  dataset.electricityPromise = electricityFilePromise.then (data) ->
    dataset.electricityProductionProvider.loadFromString data.toString()
  ServerData.loadPromises.push dataset.electricityPromise

  ServerData[datasetName] = dataset


for name, files of DatasetFiles
  loadDataset name, files

module.exports = ServerData
