fs = require 'fs'
d3 = require 'd3'

Constants = require '../Constants.coffee'
Validations = require './Validations.coffee'
IngestionMethods = require './IngestionMethods.coffee'

class GasProductionIngestor

  process: (options) ->

    @setupFilenames options

    @logMessages = []
    rawData = fs.readFileSync(@dataFilename).toString()
    @mappedData = d3.csv.parse rawData, GasProductionIngestor.csvMapping
    @unmappedData = d3.csv.parse rawData
    @summarizedGroupedData = {}
    @extraData = []
    @scenarios = options.scenarios || Constants.scenarios


    @normalize()
    @validateLineByLine()
    @createGroupedDataStructure()
    @sortData()
    @validateRequiredData()
    @writeResult()
    @writeLog()

    return {
      logMessages: @logMessages
    }



  normalize: ->
    for item in @mappedData
      item.scenario = Constants.csvScenarioToScenarioNameMapping[item.scenario]

    for item in @mappedData
      item.province = Constants.csvProvinceToProvinceCodeMapping[item.province]


  validateLineByLine: ->
    if @unmappedData.length != @mappedData.length
      throw "Error: Sanity check failed, unmapped CSV data (length #{@unmappedData.length}) and mapped CSV data (length #{@mappedData.length}) had different lengths for #{@dataFilename}"


    for i in [0...@unmappedData.length]
      Validations.province @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.scenarios @mappedData[i], @unmappedData[i], i, @logMessages, @scenarios
      Validations.years @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.value @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.unit @mappedData[i], @unmappedData[i], i, @logMessages, 'Million cubic metres Per Day'
      # TODO: validate type?


  createGroupedDataStructure: ->
    # TODO: How are we going to handle data sets which don't all have the same number of
    # scenarios? 
    for scenario in @scenarios
      @summarizedGroupedData[scenario] = {}
      for year in Constants.years
        @summarizedGroupedData[scenario][year] = {}



  sortData: ->
    for item in @mappedData
      if item.type == 'Total'
        @summarizedAddAndDetectDuplicate item
      else
        @extraData.push item

    if @extraData.length > 0
      @logMessages.push
        message: "Note: #{@extraData.length} un-needed items were filtered out."
        line: null
        lineNumber: null
      

  validateRequiredData: ->
    count = 0

    for scenario in @scenarios
      for year in Constants.years
        for province in Constants.provinceRadioSelectionOptions
          if @summarizedGroupedData[scenario][year][province]?
            count += 1
          else
            @logMessages.push
              message: "Missing data: #{scenario} #{year} #{province}"
              line: null
              lineNumber: null

    if count + @extraData.length != @mappedData.length
      @logMessages.push
        message: "Error: Sanity check failed, the number of items in required data (#{count}) and extra data (#{@extraData.length}) don't sum up to the number of items in mapped data (#{@mappedData.length})"
        line: null
        lineNumber: null
    

  writeResult: ->
    results = []

    for scenario in @scenarios
      for year in Constants.years
        for province in Constants.provinceRadioSelectionOptions
          results.push @summarizedGroupedData[scenario][year][province]

    results = d3.csv.format results

    fs.writeFileSync @processedFilename, results



GasProductionIngestor.csvMapping = (d) ->
  province: d.Area
  type: d.Type
  scenario: d.Case
  year: parseInt(d.Year)
  value: parseFloat(d.Data)
  unit: d.Unit


Object.assign GasProductionIngestor.prototype, IngestionMethods


module.exports = (options) ->

  ingestor = new GasProductionIngestor
  return ingestor.process options

