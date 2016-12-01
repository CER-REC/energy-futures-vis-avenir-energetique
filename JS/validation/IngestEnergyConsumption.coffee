fs = require 'fs'
d3 = require 'd3'

Constants = require '../Constants.coffee'
Validations = require './Validations.coffee'
IngestionMethods = require './IngestionMethods.coffee'

class EnergyConsumptionIngestor

  process: (options) ->

    @setupFilenames options

    @logMessages = []
    rawData = fs.readFileSync(@dataFilename).toString()
    @mappedData = d3.csv.parse rawData, EnergyConsumptionIngestor.csvMapping
    @unmappedData = d3.csv.parse rawData
    @summarizedGroupedData = {}
    @detailedGroupedData = {}
    @extraData = []
    @scenarios = options.scenarios || Constants.scenarios[options.dataset]


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
      item.source = Constants.csvSourceToSourceNameMapping[item.source]

    for item in @mappedData
      item.sector = Constants.csvSectorToSectorNameMapping[item.sector]

    for item in @mappedData
      item.province = Constants.csvProvinceToProvinceCodeMapping[item.province]



  validateLineByLine: ->
    if @unmappedData.length != @mappedData.length
      throw "Error: Sanity check failed, unmapped CSV data (length #{@unmappedData.length}) and mapped CSV data (length #{@mappedData.length}) had different lengths for #{@dataFilename}"


    for i in [0...@unmappedData.length]
      Validations.sector @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.source @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.province @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.scenarios @mappedData[i], @unmappedData[i], i, @logMessages, @scenarios
      Validations.years @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.value @mappedData[i], @unmappedData[i], i, @logMessages
      Validations.unit @mappedData[i], @unmappedData[i], i, @logMessages, 'Petajoules'
      # TODO: validate type?



  createGroupedDataStructure: ->
    # Visualizations 1, 2, and 4 all draw on this data set.
    
    # Viz1 and 4 use exactly the same data subset, which is not broken out by source, (scenarios * years * regions) (6 * 36 * 14) items, for 1512 items total.

    # Viz2 uses a completely disjoint and much larger subset of data, broken out by sector and by source. (sectors * sources * scenarios * years * regions) (5 * 6 * 6 * 36 * 14), 90720 items total.

    # Viz 1 and 4
    for scenario in @scenarios
      @summarizedGroupedData[scenario] = {}
      for year in Constants.years
        @summarizedGroupedData[scenario][year] = {}

    # Viz 2
    for sector in Constants.sectors
      @detailedGroupedData[sector] = {}
      for source in Constants.viz2Sources
        @detailedGroupedData[sector][source] = {}
        for scenario in @scenarios
          @detailedGroupedData[sector][source][scenario] = {}
          for year in Constants.years
            @detailedGroupedData[sector][source][scenario][year] = {}



  sortData: ->
    for item in @mappedData
      if item.source == 'total' and item.sector == 'total'
        @summarizedAddAndDetectDuplicate item
      else if Constants.viz2Sources.includes item.source
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
              message: "Missing data: sector:total source:total #{scenario} #{year} #{province}"
              line: null
              lineNumber: null

    # Viz 2
    for sector in Constants.sectors
      for source in Constants.viz2Sources
        for scenario in @scenarios
          for year in Constants.years
            for province in Constants.provinceRadioSelectionOptions
              if @detailedGroupedData[sector][source][scenario][year][province]?
                count += 1
              else
                @logMessages.push
                  message: "Missing data: #{sector} #{source} #{scenario} #{year} #{province}"
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
    
    # Viz 2
    for sector in Constants.sectors
      for source in Constants.viz2Sources
        for scenario in @scenarios
          for year in Constants.years
            for province in Constants.provinceRadioSelectionOptions
              results.push @detailedGroupedData[sector][source][scenario][year][province]

    results = d3.csv.format results

    fs.writeFileSync @processedFilename, results




  ##### 

  detailedAddAndDetectDuplicate: (item) ->
    if @detailedGroupedData[item.sector][item.source][item.scenario][item.year][item.province]?
      @logMessages.push
        message: "Duplicate item detected"
        line: item
        lineNumber: null
    else
      @detailedGroupedData[item.sector][item.source][item.scenario][item.year][item.province] = item



EnergyConsumptionIngestor.csvMapping = (d) ->
  province: d.Area
  sector: d.Sector
  source: d.Source
  scenario: d.Case
  year: parseInt(d.Year)
  value: parseFloat(d.Data)
  unit: d.Unit


Object.assign EnergyConsumptionIngestor.prototype, IngestionMethods


module.exports = (options) ->

  ingestor = new EnergyConsumptionIngestor
  return ingestor.process options
