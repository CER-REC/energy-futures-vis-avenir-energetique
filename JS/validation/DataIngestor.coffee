path = require 'path'

ApplicationRoot = require '../../ApplicationRoot.coffee'
require '../ArrayIncludes.coffee'

EnergyConsumptionIngestor = require './EnergyConsumptionIngestor.coffee'
OilProductionIngestor = require './OilProductionIngestor.coffee'
GasProductionIngestor = require './GasProductionIngestor.coffee'
ElectricityProductionIngestor = require './ElectricityProductionIngestor.coffee'





october2016Files = -> 
  # TODO: even more portable than passing filenames in would be to pass stream objects
  # in, this would let us use the ingestor offline and also seamlessly as part of a server.

  [
    {
      type: 'oil'
      dataFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_CrudeOilProduction.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-18_CrudeOilProduction.csv")
      logFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_CrudeOilProduction.csv_ingestion_errors.log")
    }
    {
      type: 'gas'
      dataFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_NaturalGasProduction.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-18_NaturalGasProduction.csv")
      logFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_NaturalGasProduction.csv_ingestion_errors.log")
    }
    {
      type: 'demand'
      dataFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_EnergyDemand.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-18_EnergyDemand.csv")
      logFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-18_EnergyDemand.csv_ingestion_errors.log")
    }
    {  
      type: 'electricity'
      dataFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-27_ElectricityGeneration.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-27_ElectricityGeneration.csv")
      logFilename: path.join(ApplicationRoot, "public/rawCSV/2016-10-27_ElectricityGeneration.csv_ingestion_errors.log")
    }
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
      console.warn "Exception while ingesting data. Options:"
      console.warn options
      console.warn e.error
      console.warn e.stack




validate october2016Files()



module.exports = validate
