fs = require 'fs'
path = require 'path'
d3 = require 'd3'

ApplicationRoot = require '../../ApplicationRoot.coffee'
require '../ArrayIncludes.coffee'


EnergyConsumptionIngestor = require './EnergyConsumptionIngestor.coffee'
OilProductionIngestor = require './OilProductionIngestor.coffee'
GasProductionIngestor = require './GasProductionIngestor.coffee'
ElectricityProductionIngestor = require './ElectricityProductionIngestor.coffee'





october2016Files = -> 
  [
    {
      type: 'oil'
      dataFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_CrudeOilProduction.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-18_CrudeOilProduction.csv")
      logFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_CrudeOilProduction.csv_ingestion_errors.log")
    }
    # {
    #   type: 'gas'
    #   name: "2016-10-18_NaturalGasProduction.csv"
    # }
    # {
    #   type: 'demand'
    #   name: "2016-10-18_EnergyDemand.csv"
    # }
    # {  
    #   type: 'electricity'
    #   name: "2016-10-27_ElectricityGeneration.csv"
    # }
  ]



validate = (optionsList) ->

  for options in optionsList

    try
      switch options.type
        when 'oil'
          OilProductionIngestor options
        when 'gas'
          GasProductionIngestor options
        when 'demand'
          EnergyConsumptionIngestor options
        when 'electricity'
          ElectricityProductionIngestor options
        else
          console.warn "Unknown type #{options.type}."
          console.warn options

    catch e
      console.warn "Exception while ingesting data."
      console.warn options
      console.warn e.error
      console.warn e.stack




validate october2016Files()



module.exports = validate
