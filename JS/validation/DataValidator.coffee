fs = require 'fs'
path = require 'path'
d3 = require 'd3'

ApplicationRoot = require '../../ApplicationRoot.coffee'
Constants = require '../Constants.coffee'
require '../ArrayIncludes.coffee'


EnergyConsumptionProvider = require '../DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require '../DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require '../DataProviders/ElectricityProductionProvider.coffee'

Validations = require './Validations.coffee'







# TODO: How to handle specifying input files? 

october2016Files = -> 
  [
    {
      type: 'oil'
      name: "2016-10-18_CrudeOilProduction.csv"
    }
    {
      type: 'gas'
      name: "2016-10-18_NaturalGasProduction.csv"
    }
    {
      type: 'demand'
      name: "2016-10-18_EnergyDemand.csv"
    }
    {  
      type: 'electricity'
      name: "2016-10-27_ElectricityGeneration.csv"
    }
  ]


validate = (files) ->

  for file in files
    # console.log file

    result = switch file.type
      when 'oil'
        validateOil file
      when 'gas'
        validateGas file
      when 'demand'
        validateDemand file
      when 'electricity'
        validateElectricity file
      else
        console.warn "Couldn't read file: #{file.name}. Unknown type #{file.type}."

    if result.length > 0
      console.log "#{result.length} errors in file #{file.name}:"
      console.log result
    else
      console.log "No errors in #{file.name}"



validateOil = (file) ->

  oilData = fs.readFileSync(path.join(ApplicationRoot, "public/rawCSV", file.name)).toString()
  oilProductionProvider = new OilProductionProvider 
  oilProductionProvider.loadFromString oilData

  unmappedData = d3.csv.parse oilData
  errors = []
    
  if unmappedData.length != oilProductionProvider.data.length
    errors.push
      message: "ERROR: Sanity check failed, unmapped CSV data (length #{unmappedData.length}) and mapped+processed CSV data (length #{oilProductionProvider.data.length}) had different lengths in #{file.name}"
      line: null
      lineNumber: null
    return errors

  data = oilProductionProvider.data

  for i in [0...unmappedData.length]
    
    # Validations.sector data[i], unmappedData[i], i, errors
    # Validations.source data[i], unmappedData[i], i, errors
    Validations.province data[i], unmappedData[i], i, errors
    Validations.scenarios data[i], unmappedData[i], i, errors
    Validations.years data[i], unmappedData[i], i, errors
    Validations.value data[i], unmappedData[i], i, errors
    Validations.unit data[i], unmappedData[i], i, errors, 'Thousand cubic metres'

    # TODO: validate type?
    
    # unless Constants.provinceRadioSelectionOptions.includes data[i].province
    #   errors.push
    #     message: "Invalid province (CSV field name: Area). Parsed value was #{data[i].province}"
    #     line: unmappedData[i]
    #     lineNumber: i


    # unless Constants.scenarios.includes data[i].scenario
    #   errors.push
    #     message: "Invalid scenario (CSV field name: Case). Parsed value was #{data[i].scenario}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # unless Constants.years.includes data[i].year
    #   errors.push
    #     message: "Invalid year (CSV field name: Year). Parsed value was #{data[i].year}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # if typeof data[i].value != 'number' or Number.isNaN(data[i].value) or data[i].value < 0
    #   errors.push
    #     message: "Invalid value (CSV field name: Data). Parsed value was #{data[i].value}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # unless data[i].value != 'Thousand cubic metres'
    #   errors.push
    #     message: "Invalid unit (CSV field name: Unit). Parsed value was #{data[i].unit}"
    #     line: unmappedData[i]
    #     lineNumber: i


  errors


validateGas = (file) ->

  gasData = fs.readFileSync(path.join(ApplicationRoot, "public/rawCSV", file.name)).toString()
  gasProductionProvider = new GasProductionProvider 
  gasProductionProvider.loadFromString gasData

  unmappedData = d3.csv.parse gasData
  errors = []

  if unmappedData.length != gasProductionProvider.data.length
    errors.push
      message: "ERROR: Sanity check failed, unmapped CSV data (length #{unmappedData.length}) and mapped+processed CSV data (length #{gasProductionProvider.data.length}) had different lengths in #{file.name}"
      line: null
      lineNumber: null
    return errors

  data = gasProductionProvider.data

  for i in [0...unmappedData.length]
    
    Validations.province data[i], unmappedData[i], i, errors
    Validations.scenarios data[i], unmappedData[i], i, errors
    Validations.years data[i], unmappedData[i], i, errors
    Validations.value data[i], unmappedData[i], i, errors
    Validations.unit data[i], unmappedData[i], i, errors, 'Million cubic metres Per Day'

    # TODO: validate type?


    # unless Constants.provinceRadioSelectionOptions.includes data[i].province
    #   errors.push
    #     message: "Invalid province (CSV field name: Area). Parsed value was #{data[i].province}"
    #     line: unmappedData[i]
    #     lineNumber: i


    # unless Constants.scenarios.includes data[i].scenario
    #   errors.push
    #     message: "Invalid scenario (CSV field name: Case). Parsed value was #{data[i].scenario}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # unless Constants.years.includes data[i].year
    #   errors.push
    #     message: "Invalid year (CSV field name: Year). Parsed value was #{data[i].year}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # if typeof data[i].value != 'number' or Number.isNaN(data[i].value) or data[i].value < 0
    #   errors.push
    #     message: "Invalid value (CSV field name: Data). Parsed value was #{data[i].value}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # unless data[i].value != 'Million cubic metres Per Day'
    #   errors.push
    #     message: "Invalid unit (CSV field name: Unit). Parsed value was #{data[i].unit}"
    #     line: unmappedData[i]
    #     lineNumber: i


  errors


validateDemand = (file) ->

  energyConsumptionData = fs.readFileSync(path.join(ApplicationRoot, "public/rawCSV", file.name)).toString()
  energyConsumptionProvider = new EnergyConsumptionProvider
  energyConsumptionProvider.loadFromString energyConsumptionData

  unmappedData = d3.csv.parse energyConsumptionData
  errors = []

  if unmappedData.length != energyConsumptionProvider.data.length
    errors.push
      message: "ERROR: Sanity check failed, unmapped CSV data (length #{unmappedData.length}) and mapped+processed CSV data (length #{energyConsumptionProvider.data.length}) had different lengths in #{file.name}"
      line: null
      lineNumber: null
    return errors

  data = energyConsumptionProvider.data

  for i in [0...unmappedData.length]

    Validations.sector data[i], unmappedData[i], i, errors
    Validations.source data[i], unmappedData[i], i, errors
    Validations.province data[i], unmappedData[i], i, errors
    Validations.scenarios data[i], unmappedData[i], i, errors
    Validations.years data[i], unmappedData[i], i, errors
    Validations.value data[i], unmappedData[i], i, errors
    Validations.unit data[i], unmappedData[i], i, errors, 'Petajoules'

    
    # unless Constants.sectors.includes data[i].sector
    #   errors.push
    #     message: "Invalid sector (CSV field name: Sector). Parsed value was #{data[i].sector}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # # TODO: filter extra sources? 
    # unless Constants.sources.includes data[i].source
    #   errors.push
    #     message: "Invalid source (CSV field name: Source). Parsed value was #{data[i].source}"
    #     line: unmappedData[i]
    #     lineNumber: i


    # unless Constants.provinceRadioSelectionOptions.includes data[i].province
    #   errors.push
    #     message: "Invalid province (CSV field name: Area). Parsed value was #{data[i].province}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # unless Constants.scenarios.includes data[i].scenario
    #   errors.push
    #     message: "Invalid scenario (CSV field name: Case). Parsed value was #{data[i].scenario}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # unless Constants.years.includes data[i].year
    #   errors.push
    #     message: "Invalid year (CSV field name: Year). Parsed value was #{data[i].year}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # if typeof data[i].value != 'number' or Number.isNaN(data[i].value) or data[i].value < 0
    #   errors.push
    #     message: "Invalid value (CSV field name: Data). Parsed value was #{data[i].value}"
    #     line: unmappedData[i]
    #     lineNumber: i

    # unless data[i].value != 'Petajoules'
    #   errors.push
    #     message: "Invalid unit (CSV field name: Unit). Parsed value was #{data[i].unit}"
    #     line: unmappedData[i]
    #     lineNumber: i


  errors




validateElectricity = (file) ->

  electricityData = fs.readFileSync(path.join(ApplicationRoot, "public/rawCSV", file.name)).toString()
  electricityProductionProvider = new ElectricityProductionProvider
  electricityProductionProvider.loadFromString electricityData

  unmappedData = d3.csv.parse electricityData
  errors = []


  # The electricity provider filters out some unnecessary data, and also adds some
  # totals entries which are not present in the raw data.
  # Result: the raw CSV total does not match the parsed data length
  # TODO: Pre-process electricity data file instead of doing it on parse?

  # if unmappedData.length != electricityProductionProvider.data.length
  #   errors.push
  #     message: "ERROR: Sanity check failed, unmapped CSV data (length #{unmappedData.length}) and mapped+processed CSV data (length #{electricityProductionProvider.data.length}) had different lengths in #{file.name}"
  #     line: null
  #     lineNumber: null
  #   return errors

  data = electricityProductionProvider.data

  for i in [0...data.length]

    # TODO: swap out data[i] for unmappedData[i], once we are free of the provider parsing
    Validations.source data[i], data[i], i, errors
    Validations.province data[i], data[i], i, errors
    Validations.scenarios data[i], data[i], i, errors
    Validations.years data[i], data[i], i, errors
    Validations.value data[i], data[i], i, errors
    Validations.unit data[i], data[i], i, errors, 'GW.h'

    # TODO: filter extra sources? 
    # unless Constants.sources.includes data[i].source
    #   errors.push
    #     message: "Invalid source (CSV field name: Source). Parsed value was #{data[i].source}"
    #     line: data[i]
    #     lineNumber: i

    # unless Constants.provinceRadioSelectionOptions.includes data[i].province
    #   errors.push
    #     message: "Invalid province (CSV field name: Area). Parsed value was #{data[i].province}"
    #     line: data[i]
    #     lineNumber: i

    # unless Constants.scenarios.includes data[i].scenario
    #   errors.push
    #     message: "Invalid scenario (CSV field name: Case). Parsed value was #{data[i].scenario}"
    #     line: data[i]
    #     lineNumber: i

    # unless Constants.years.includes data[i].year
    #   errors.push
    #     message: "Invalid year (CSV field name: Year). Parsed value was #{data[i].year}"
    #     line: data[i]
    #     lineNumber: i

    # if typeof data[i].value != 'number' or Number.isNaN(data[i].value) or data[i].value < 0
    #   errors.push
    #     message: "Invalid value (CSV field name: Data). Parsed value was #{data[i].value}"
    #     line: data[i]
    #     lineNumber: i

    # unless data[i].value != 'GW.h'
    #   errors.push
    #     message: "Invalid unit (CSV field name: Unit). Parsed value was #{data[i].unit}"
    #     line: data[i]
    #     lineNumber: i


  errors







validate october2016Files()



module.exports = validate
