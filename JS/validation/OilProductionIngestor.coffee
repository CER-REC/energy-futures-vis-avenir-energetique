fs = require 'fs'
path = require 'path'
d3 = require 'd3'
_ = require 'lodash'

ApplicationRoot = require '../../ApplicationRoot.coffee'
Constants = require '../Constants.coffee'

Validations = require './Validations.coffee'
OilProductionProvider = require '../DataProviders/OilProductionProvider.coffee'





class OilProductionIngestor

  constructor: (options) ->
    # TODO: Reconsider building the file path here. More portable in the future to build it 
    # externally, call this with the full filename.
    @dataFilename = path.join ApplicationRoot, "public/rawCSV", options.name
    # TODO: Generate these externally and pass them in, too.
    @processedFilename = path.join ApplicationRoot, "public/CSV", options.name
    @logFilename = path.join ApplicationRoot, "public/rawCSV", "#{options.name}_ingestion_errors.log"

    @logMessages = []
    oilData = fs.readFileSync(@dataFilename).toString()
    @mappedData = d3.csv.parse oilData, OilProductionProvider.csvMapping
    @unmappedData = d3.csv.parse oilData
    @groupedData = {}
    @extraData = []


    @normalize()
    @validateLineByLine()
    @createGroupedDataStructure()
    @sortData()
    @validateRequiredData()
    @writeResult()
    @writeLog()




  normalize: ->
    for item in @mappedData
      item.scenario = Constants.csvScenarioToScenarioNameMapping[item.scenario]

    for item in @mappedData
      item.province = Constants.csvProvinceToProvinceCodeMapping[item.province]


  validateLineByLine: ->
    if @unmappedData.length != @mappedData.length
      @logMessages.push
        message: "Error: Sanity check failed, unmapped CSV data (length #{@unmappedData.length}) and mapped CSV data (length #{@mappedData.length}) had different lengths."
        line: null
        lineNumber: null
      # TODO: We should actually fail the entire process here... throw? 
      return

    for i in [0...@unmappedData.length]
      Validations.province @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.scenarios @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.years @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.value @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.unit @mappedData[i], @unmappedData[i], i, @logMessages, 'Thousand cubic metres'
      # TODO: validate type?


  createGroupedDataStructure: ->
    # TODO: How are we going to handle data sets which don't all have the same number of
    # scenarios? 
    for scenario in Constants.scenarios
      @groupedData[scenario] = {}
      for year in Constants.years
        @groupedData[scenario][year] = {}



  sortData: ->
    for item in @mappedData
      if item.type == 'Total'
        @groupedData[item.scenario][item.year][item.province] = item
      else
        @extraData.push item

    if @extraData.length > 0
      @logMessages.push
        message: "Note: #{@extraData.length} un-needed items were filtered out."
        line: null
        lineNumber: null
      

  validateRequiredData: ->
    count = 0

    for scenario in Constants.scenarios
      for year in Constants.years
        for province in Constants.provinceRadioSelectionOptions
          if @groupedData[scenario][year][province]?
            count += 1
          else
            @logMessages.push
              message: "Missing data: #{scenario} #{year} #{province}"
              line: null
              lineNumber: null

    console.log "#{count} #{@extraData.length}    #{@mappedData.length}"
    if count + @extraData.length != @mappedData.length
      @logMessages.push
        message: "Error: Sanity check failed, the number of items in required data (#{count}) and extra data (#{@extraData.length}) don't sum up to the number of items in mapped data (#{@mappedData.length})"
        line: null
        lineNumber: null
    

  writeResult: ->
    results = []
    for scenario in Constants.scenarios
      for year in Constants.years
        for province in Constants.provinceRadioSelectionOptions
          results.push @groupedData[scenario][year][province]

    results = d3.csv.format results

    fs.writeFileSync @processedFilename, results



  writeLog: ->
    @logFile = fs.openSync @logFilename, 'w'

    if @logMessages.length == 0
      @logFile.write "No errors"

    for error in @logMessages
      fs.writeSync @logFile, "Error:\n"
      fs.writeSync @logFile, "  #{error.message}\n"
      fs.writeSync @logFile, "  #{error.line.toString()}\n" if error.line?
      fs.writeSync @logFile, "  #{error.lineNumber}\n" if error.lineNumber?

    fs.closeSync @logFile




module.exports = OilProductionIngestor
