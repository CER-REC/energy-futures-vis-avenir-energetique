path = require 'path'

ApplicationRoot = require '../../ApplicationRoot.coffee'
require '../ArrayIncludes.coffee'

IngestEnergyConsumption = require './IngestEnergyConsumption.coffee'
IngestOilProduction = require './IngestOilProduction.coffee'
IngestGasProduction = require './IngestGasProduction.coffee'
IngestElectricityProduction = require './IngestElectricityProduction.coffee'





october2016Files = -> 
  # TODO: even more portable than passing filenames in would be to pass stream objects
  # in, this would let us use the ingestor offline and also seamlessly as part of a server.

  [
    {
      type: 'oil'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-10-18_CrudeOilProduction.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-18_CrudeOilProduction.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-10-18_CrudeOilProduction.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low']
      dataset: 2016
    }
    {
      type: 'gas'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-10-18_NaturalGasProduction.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-18_NaturalGasProduction.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-10-18_NaturalGasProduction.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low']
      dataset: 2016
    }
    {
      type: 'demand'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-10-18_EnergyDemand.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-18_EnergyDemand.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-10-18_EnergyDemand.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low']
      dataset: 2016
    }
    {  
      type: 'electricity'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-10-27_ElectricityGeneration.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-10-27_ElectricityGeneration.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-10-27_ElectricityGeneration.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low']
      dataset: 2016
    }
  ]


january2016Files = ->

  [
    {
      type: 'oil'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-01_CrudeOilProduction.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-01_CrudeOilProduction.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-01_CrudeOilProduction.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low', 'highLng', 'noLng', 'constrained']
      dataset: 2015

    }
    {
      type: 'gas'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-01_NaturalGasProduction.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-01_NaturalGasProduction.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-01_NaturalGasProduction.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low', 'highLng', 'noLng', 'constrained']
      dataset: 2015
    }
    {
      type: 'demand'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-01_EnergyDemand.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-01_EnergyDemand.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-01_EnergyDemand.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low', 'highLng', 'noLng', 'constrained']
      dataset: 2015
    }
    {  
      type: 'electricity'
      dataFilename: path.join(ApplicationRoot, "devPublic/rawCSV/2016-01_ElectricityGeneration.csv")
      processedFilename: path.join(ApplicationRoot, "public/CSV/2016-01_ElectricityGeneration.csv")
      logFilename: path.join(ApplicationRoot, "devPublic/rawCSV/log/2016-01_ElectricityGeneration.csv_ingestion_errors.log")
      scenarios: ['reference', 'high', 'low', 'highLng', 'noLng', 'constrained']
      dataset: 2015
    }
  ]





ingest = (optionsList) ->

  for options in optionsList

    try
      switch options.type
        when 'oil'
          IngestOilProduction options
        when 'gas'
          IngestGasProduction options
        when 'demand'
          IngestEnergyConsumption options
        when 'electricity'
          IngestElectricityProduction options
        else
          console.warn "Unknown type #{options.type}."
          console.warn options

    catch e
      console.warn "Exception while ingesting data. Options:"
      console.warn options
      console.warn e.error
      console.warn e.stack




ingest january2016Files()
ingest october2016Files()



module.exports = ingest
