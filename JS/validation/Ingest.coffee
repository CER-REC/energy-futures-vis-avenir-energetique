path = require 'path'

ApplicationRoot = require '../../ApplicationRoot.coffee'

IngestEnergyConsumption = require './IngestEnergyConsumption.coffee'
IngestOilProduction = require './IngestOilProduction.coffee'
IngestGasProduction = require './IngestGasProduction.coffee'
IngestElectricityProduction = require './IngestElectricityProduction.coffee'


october2018Files = ->

  [
    {
      type: 'oil'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2018-10-31_crude oil production VIZ.EF18.Oct31.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2018-10-31_CrudeOilProduction.csv'
      dataset: 'oct2018'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2018-10-31_CrudeOilProduction.csv_ingestion_errors.log'
    }
    {
      type: 'gas'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2018-10-16_Natural gas production VIZ.EF18.Oct.16.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2018-10-16_NaturalGasProduction.csv'
      dataset: 'oct2018'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2018-10-16_NaturalGasProduction.csv_ingestion_errors.log'
    }
    {
      type: 'demand'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2018-10-26 data/2018-10-26_Demand For Viz. EF18.Oct26.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2018-10-26_EnergyDemand.csv'
      dataset: 'oct2018'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2018-10-26_EnergyDemand.csv_ingestion_errors.log'
    }
    {
      type: 'electricity'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2018-10-26 data/2018-10-26_ElectricityGeneration_VIZ.EF18.Oct.26.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2018-10-26_ElectricityGeneration.csv'
      dataset: 'oct2018'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2018-10-26_ElectricityGeneration.csv_ingestion_errors.log'
    }
  ]


october2017Files = ->
  # TODO: even more portable than passing filenames in would be to pass stream objects
  # in, this would let us use the ingestor offline and also seamlessly as part of a
  # server.

  [
    {
      type: 'oil'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2017-09_CrudeOilProduction_Updated.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2017-09_CrudeOilProduction_Updated.csv'
      dataset: 'oct2017'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2017-09_CrudeOilProduction_Updated.csv_ingestion_errors.log'
    }
    {
      type: 'gas'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2017-09_NaturalGasProduction.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2017-09_NaturalGasProduction.csv'
      dataset: 'oct2017'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2017-09_NaturalGasProduction.csv_ingestion_errors.log'
    }
    {
      type: 'demand'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2017-09_EnergyDemand_Updated.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2017-09_EnergyDemand_Updated.csv'
      dataset: 'oct2017'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2017-09_EnergyDemand_Updated.csv_ingestion_errors.log'
    }
    {
      type: 'electricity'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2017-09_ElectricityGeneration_Updated.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2017-09_ElectricityGeneration_Updated.csv'
      dataset: 'oct2017'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2017-09_ElectricityGeneration_Updated.csv_ingestion_errors.log'
    }
  ]


# 2016 update dataset removed as part of 2018 update
# october2016Files = ->
#   # TODO: even more portable than passing filenames in would be to pass stream objects
#   # in, this would let us use the ingestor offline and also seamlessly as part of a
#   # server.

#   [
#     {
#       type: 'oil'
#       dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-10-18_CrudeOilProduction.csv'
#       processedFilename: path.join ApplicationRoot, 'public/CSV/2016-10-18_CrudeOilProduction.csv'
#       dataset: 'oct2016'
#       logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-10-18_CrudeOilProduction.csv_ingestion_errors.log'
#     }
#     {
#       type: 'gas'
#       dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-10-18_NaturalGasProduction.csv'
#       processedFilename: path.join ApplicationRoot, 'public/CSV/2016-10-18_NaturalGasProduction.csv'
#       dataset: 'oct2016'
#       logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-10-18_NaturalGasProduction.csv_ingestion_errors.log'
#     }
#     {
#       type: 'demand'
#       dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-10-18_EnergyDemand.csv'
#       processedFilename: path.join ApplicationRoot, 'public/CSV/2016-10-18_EnergyDemand.csv'
#       dataset: 'oct2016'
#       logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-10-18_EnergyDemand.csv_ingestion_errors.log'
#     }
#     {
#       type: 'electricity'
#       dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-10-27_ElectricityGeneration.csv'
#       processedFilename: path.join ApplicationRoot, 'public/CSV/2016-10-27_ElectricityGeneration.csv'
#       dataset: 'oct2016'
#       logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-10-27_ElectricityGeneration.csv_ingestion_errors.log'
#     }
#   ]


january2016Files = ->

  [
    {
      type: 'oil'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-01_CrudeOilProduction.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2016-01_CrudeOilProduction.csv'
      dataset: 'jan2016'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-01_CrudeOilProduction.csv_ingestion_errors.log'
    }
    {
      type: 'gas'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-01_NaturalGasProduction.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2016-01_NaturalGasProduction.csv'
      dataset: 'jan2016'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-01_NaturalGasProduction.csv_ingestion_errors.log'
    }
    {
      type: 'demand'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-01_EnergyDemand.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2016-01_EnergyDemand.csv'
      dataset: 'jan2016'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-01_EnergyDemand.csv_ingestion_errors.log'
    }
    {
      type: 'electricity'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2016-01_ElectricityGeneration.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2016-01_ElectricityGeneration.csv'
      dataset: 'jan2016'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2016-01_ElectricityGeneration.csv_ingestion_errors.log'
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
      console.warn 'Exception while ingesting data. Options:'
      console.warn options
      console.warn e.error
      console.warn e.stack




# ingest january2016Files()
# ingest october2016Files()
# ingest october2017Files()
ingest october2018Files()



module.exports = ingest
