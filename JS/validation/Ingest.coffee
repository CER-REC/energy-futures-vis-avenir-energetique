path = require 'path'

ApplicationRoot = require '../../ApplicationRoot.coffee'

IngestEnergyConsumption = require './IngestEnergyConsumption.coffee'
IngestOilProduction = require './IngestOilProduction.coffee'
IngestGasProduction = require './IngestGasProduction.coffee'
IngestElectricityProduction = require './IngestElectricityProduction.coffee'

# coffeelint: disable=max_line_length


november2019Files = ->

  [
    {
      type: 'oil'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2019-11-08 data/oil_produciton_viz.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2019-11-08_CrudeOilProduction.csv'
      dataset: 'nov2019'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2019-11-08_CrudeOilProduction.csv_ingestion_errors.log'
    }
    {
      type: 'gas'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2019-11-08 data/natural_gas_production_viz.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2019-11-08_NaturalGasProduction.csv'
      dataset: 'nov2019'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2019-11-08_NaturalGasProduction.csv_ingestion_errors.log'
    }
    {
      type: 'demand'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2019-11-08 data/Demand_for_viz.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2019-11-08_EnergyDemand.csv'
      dataset: 'nov2019'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2019-11-08_EnergyDemand.csv_ingestion_errors.log'
    }
    {
      type: 'electricity'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/2019-11-08 data/electricity_generation_viz.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2019-11-08_ElectricityGeneration.csv'
      dataset: 'nov2019'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2019-11-08_ElectricityGeneration.csv_ingestion_errors.log'
    }
  ]







october2019_updateOf2018Electricity = ->
  [
    {
      type: 'electricity'
      dataFilename: path.join ApplicationRoot, 'devPublic/rawCSV/ElectricityGeneration_VIZ.EF18.May.21.2019.csv'
      processedFilename: path.join ApplicationRoot, 'public/CSV/2018_ElectricityGeneration_2019_10_28.csv'
      dataset: 'oct2018'
      logFilename: path.join ApplicationRoot, 'devPublic/rawCSV/log/2018_ElectricityGeneration_2019_10_28.csv_ingestion_errors.log'
    }
  ]

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
# ingest october2018Files()
# ingest october2019_updateOf2018Electricity()
ingest november2019Files()



module.exports = ingest
