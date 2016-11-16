fs = require 'fs'
d3 = require 'd3'

Constants = require '../Constants.coffee'
Validations = require './Validations.coffee'





class GasProductionIngestor

  process: (options) ->

    if not options.dataFilename
      console.log "Missing required option dataFilename"
      console.log options
      return
    if not options.processedFilename
      console.log "Missing required option processedFilename"
      console.log options
      return
    if not options.logFilename
      console.log "Missing required option logFilename"
      console.log options
      return

    @dataFilename = options.dataFilename
    @processedFilename = options.processedFilename
    @logFilename = options.logFilename

    @logMessages = []
    gasData = fs.readFileSync(@dataFilename).toString()
    @mappedData = d3.csv.parse gasData, GasProductionIngestor.csvMapping
    @unmappedData = d3.csv.parse gasData
    @groupedData = {}
    @extraData = []


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
      Validations.scenarios @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.years @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.value @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.unit @mappedData[i], @unmappedData[i], i, @logMessages, 'Million cubic metres Per Day'
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
        @addAndDetectDuplicate item
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
      fs.writeSync @logFile, "#{error.message}\n"
      fs.writeSync @logFile, "#{error.line.toString()}\n" if error.line?
      fs.writeSync @logFile, "#{error.lineNumber}\n" if error.lineNumber?
      fs.writeSync @logFile, "\n"

    fs.closeSync @logFile

    if @logMessages.length > 0
      console.log "#{@logMessages.length} logged events for file #{@dataFilename}."
    else
      console.log "No logged events for #{@dataFilename}."


  ##### 

  addAndDetectDuplicate: (item) ->
    if @groupedData[item.scenario][item.year][item.province]?
      @logMessages.push
        message: "Duplicate item detected"
        line: item
        lineNumber: null
    else
      @groupedData[item.scenario][item.year][item.province] = item


GasProductionIngestor.csvMapping = (d) ->
  province: d.Area
  type: d.Type
  scenario: d.Case
  year: parseInt(d.Year)
  value: parseFloat(d.Data)
  unit: d.Unit





module.exports = (options) ->

  ingestor = new GasProductionIngestor
  return ingestor.process options

