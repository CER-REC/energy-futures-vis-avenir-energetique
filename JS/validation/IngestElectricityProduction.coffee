fs = require 'fs'
d3 = require 'd3'

Constants = require '../Constants.coffee'
Validations = require './Validations.coffee'
IngestionMethods = require './IngestionMethods.coffee'

class ElectricityProductionIngestor

  process: (options) ->

    @setupFilenames options
    
    @logMessages = []
    rawData = fs.readFileSync(@dataFilename).toString()
    @mappedData = d3.csv.parse rawData, ElectricityProductionIngestor.csvMapping
    @unmappedData = d3.csv.parse rawData
    @summarizedGroupedData = {}
    @detailedGroupedData = {}
    @extraData = []
    @scenarios = Constants.datasetDefinitions[options.dataset].scenariosForIngestion['electricityGeneration']


    @normalize()
    @validateLineByLine()
    @calculateTotalsForCanada()
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

    for item in @mappedData
      item.source = Constants.csvSourceToSourceNameMapping[item.source]


  validateLineByLine: ->
    if @unmappedData.length != @mappedData.length
      throw new Error "Error: Sanity check failed, unmapped CSV data (length #{@unmappedData.length}) and mapped CSV data (length #{@mappedData.length}) had different lengths for #{@dataFilename}"


    for i in [0...@unmappedData.length]
      Validations.source @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.province @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.scenarios @mappedData[i], @unmappedData[i], i, @logMessages, @scenarios
      Validations.years @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.value @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.unit @mappedData[i], @unmappedData[i], i, @logMessages, 'GW.h'
      # TODO: validate type?


  # We need certain totals for viz1 and viz4 which aren't present in the data.
  # We compute them, and add them to the existing data.
  # NB: We are only calculating these totals for Total Generation, we are not calculating
  # them out for each power source!
  calculateTotalsForCanada: ->
    # We're only interested in total generation, not individual sources
    totalGenerationData = @mappedData.filter (item) ->
      item.source == 'total'

    # Break data out by year and scenario
    totalGenerationByYearAndScenario = {}
    for year in Constants.years
      totalGenerationByYearAndScenario[year] = {}
      for scenario in @scenarios
        totalGenerationByYearAndScenario[year][scenario] = []

    for item in totalGenerationData
      totalGenerationByYearAndScenario[item.year][item.scenario].push item

    # For each set of provincial/territorial data in each year and scenario,
    # find the sum of their production, and add it to the raw data for the provider

    for scenario in @scenarios
      for year in Constants.years
        sum = totalGenerationByYearAndScenario[year][scenario].reduce (sum, item) ->
          sum + item.value
        , 0

        @mappedData.push
          province: 'all'
          source: 'total'
          scenario: scenario
          year: year
          value: sum
          unit: 'GW.h'





  createGroupedDataStructure: ->
    # Visualizations 1, 3, and 4 all use this data.

    # Viz1 and 4 use exactly the same data subset, which is not broken out by source,
    # (scenarios * years * regions) (6 * 36 * 14) items, for 1512 items total.

    # Viz3 uses a completely disjoint and larger subset of data, which does not include
    # any totals (sources * scenarios * years * regions) (7 * 6 * 36 * 13), 19656 items
    # total.

    # Viz 1 and 4
    for scenario in @scenarios
      @summarizedGroupedData[scenario] = {}
      for year in Constants.years
        @summarizedGroupedData[scenario][year] = {}

    # Viz 3
    for source in Constants.viz3Sources
      @detailedGroupedData[source] = {}
      for scenario in @scenarios
        @detailedGroupedData[source][scenario] = {}
        for year in Constants.years
          @detailedGroupedData[source][scenario][year] = {}



  sortData: ->

    for item in @mappedData
      if item.source == 'total'
        @summarizedAddAndDetectDuplicate item
      else if Constants.viz3Sources.includes item.source
        @detailedAddAndDetectDuplicate item
      else
        @extraData.push item


    if @extraData.length > 0
      @logMessages.push
        message: "Note: #{@extraData.length} un-needed items were filtered out."
        line: null
        lineNumber: null
      

  validateRequiredData: ->
    count = 0

    # Viz 1 and 4
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

    # Viz 3
    for source in Constants.viz3Sources
      for scenario in @scenarios
        for year in Constants.years
          for province in Constants.provinces
            if @detailedGroupedData[source][scenario][year][province]?
              count += 1
            else
              @logMessages.push
                message: "Missing data: #{source} #{scenario} #{year} #{province}"
                line: null
                lineNumber: null

    if count + @extraData.length != @mappedData.length
      @logMessages.push
        message: "Error: Sanity check failed, the number of items in required data (#{count}) and extra data (#{@extraData.length}) don't sum up to the number of items in mapped data (#{@mappedData.length})"
        line: null
        lineNumber: null
    

  writeResult: ->
    results = []

    # Viz 1 and 4
    for scenario in @scenarios
      for year in Constants.years
        for province in Constants.provinceRadioSelectionOptions
          results.push @summarizedGroupedData[scenario][year][province]
    
    # Viz 3
    for source in Constants.viz3Sources
      for scenario in @scenarios
        for year in Constants.years
          for province in Constants.provinces
            results.push @detailedGroupedData[source][scenario][year][province]

    results = d3.csv.format results

    fs.writeFileSync @processedFilename, results





  #####

  detailedAddAndDetectDuplicate: (item) ->
    if @detailedGroupedData[item.source][item.scenario][item.year][item.province]?
      @logMessages.push
        message: 'Duplicate item detected'
        line: item
        lineNumber: null
    else
      @detailedGroupedData[item.source][item.scenario][item.year][item.province] = item


ElectricityProductionIngestor.csvMapping = (d) ->
  province: d.Area
  source: d.Source
  scenario: d.Case
  year: parseInt d.Year
  value: parseFloat d.Data.replace(',','')
  unit: d.Unit



Object.assign ElectricityProductionIngestor.prototype, IngestionMethods


module.exports = (options) ->

  ingestor = new ElectricityProductionIngestor
  return ingestor.process options


