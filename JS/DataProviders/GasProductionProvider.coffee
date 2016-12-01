d3 = require 'd3'

Constants = require '../Constants.coffee'
UnitTransformation = require '../unit-transformation.coffee'

QueryString = require 'query-string'
PrepareQueryParams = require '../PrepareQueryParams.coffee'

class GasProductionProvider

  constructor: ->
    @data = []

  #   d3.csv Constants.dataFiles['2016']["NaturalGasProduction"], @mapping, (data) ->
  #     datasets['2016'] = data

  #   d3.csv Constants.dataFiles['2016 Update']["NaturalGasProduction"], @mapping, (data) ->
  #     datasets['2016 Update'] = data

  # loadViaAjax: (loadedCallback) ->
  #   params = PrepareQueryParams QueryString.parse(window.parent.document.location.search)

  #   if(Constants.datasets.includes params.dataset)
  #     @loadForYear(params.dataset)
  #   else
  #     @loadForYear(Constants.datasets[0])

  #   @loadedCallback = loadedCallback

  # loadForYear: (dataset) ->
  #   if Constants.datasets.includes dataset
  #     @dataset = dataset
  #     if datasets.length > 0
  #       @parseData null, datasets[dataset] 
  #     else
  #       d3.csv Constants.dataFiles[dataset]["NaturalGasProduction"], @mapping, @parseData

  # loadFromString: (data) ->
  #   @parseData null, d3.csv.parse(data, @mapping)

  loadFromString: (dataString) ->
    @data = d3.csv.parse dataString, @mapping
    @parseData @data

  # Add an array of data objects to the data store
  addData: (data) ->
    @data = @data.concat data
    @parseData @data

  mapping: (d) ->
    province: d.province
    type: d.type
    scenario: d.scenario
    year: parseInt(d.year)
    value: parseFloat(d.value)
    unit: d.unit

  parseData: (error, data) =>
    console.warn error if error?
    @data = data
    
    @dataByProvince = 
      BC: []
      AB: []
      SK: []
      MB: []
      ON: []
      QC: []
      NB: []
      NS: []
      NL: []
      PE: []
      YT: []
      NT: []
      NU: []
      all: []


    @dataByScenario = 
      reference: []
      high: []
      low: []
      highLng: []
      noLng: []
      constrained: []

    for item in @data
      @dataByScenario[item.scenario].push item
      @dataByProvince[item.province].push item
    
    @loadedCallback() if @loadedCallback


  # accessors note: GasProductionProvider is never needed for viz 2 or 3!!


  # Returns a set of data corresponding to the given config object, except that 
  # it has not been filtered by scenario. In order to show a y-axis which does not change
  # when the user switches the scenario, we need to take the maximum of all of the data 
  # across scenarios for a given configuration.
  dataForAllViz1Scenarios: (viz1config) ->
    filteredProvinceData = {}    

    if viz1config.dataset != @dataset
      @loadForYear(viz1config.dataset)

    # Exclude data from provinces that aren't in the set
    for provinceName in Object.keys @dataByProvince
      if viz1config.provinces.includes provinceName
        filteredProvinceData[provinceName] = @dataByProvince[provinceName]

    # We aren't interested in breakdowns by source, only the totals
    for provinceName in Object.keys filteredProvinceData
      filteredProvinceData[provinceName] = filteredProvinceData[provinceName].filter (item) ->
        item.type == 'Total'
    
    # Finally, convert units
    return filteredProvinceData if viz1config.unit == 'millionCubicMetres'

    if viz1config.unit == 'cubicFeet' 
      unitConvertedProvinceData = {}
      for province in Object.keys filteredProvinceData
        unitConvertedProvinceData[province] = []
        for item in filteredProvinceData[province]
          unitConvertedProvinceData[province].push 
            # TODO: This approach is pretty nasty, is there a better way?
            province: item.province
            sector: item.sector
            source: item.source
            scenario: item.scenario
            year: item.year
            value: item.value * UnitTransformation.transformUnits('millionCubicMetres', 'cubicFeet')
      return unitConvertedProvinceData


  # Returns an object keyed by province short code (like "AB")
  # Each entry has an array of objects in ascending order by year, like:
  #   province: 'AB'
  #   scenario: 'reference'
  #   type: 'Total', or absent
  #   sector: 'total', undefined, or absent
  #   source: 'total', undefined, or absent
  #   value: 234.929
  #   year: 2005
  # The attributes available vary from dataset to dataset, which is why some of them may 
  # or may not be present. 
  dataForViz1: (viz1config) ->
    unfilteredData = @dataForAllViz1Scenarios viz1config
    filteredData = {}

    for sourceName in Object.keys unfilteredData
      filteredData[sourceName] = unfilteredData[sourceName].filter (item) ->
        item.scenario == viz1config.scenario

    filteredData



  # Returns a set of data corresponding to the given config object, except that 
  # it has not been filtered by scenario. In order to show a y-axis which does not change
  # when the user switches the scenario, we need to take the maximum of all of the data 
  # across scenarios for a given configuration.
  dataForAllViz4Scenarios: (viz4config) ->
    filteredScenarioData = {}    

    if viz4config.dataset != @dataset
      @loadForYear(viz4config.dataset)

    # Group data by scenario
    for scenarioName in Object.keys @dataByScenario
      filteredScenarioData[scenarioName] = @dataByScenario[scenarioName]

    # We aren't interested in breakdowns by type, only the totals
    # TODO: Since this will always be the case for viz4, cache the data with this filter applied?
    for scenarioName in Object.keys filteredScenarioData
      filteredScenarioData[scenarioName] = filteredScenarioData[scenarioName].filter (item) ->
        item.type == 'Total'

    # Include only data for the current province
    for scenarioName in Object.keys filteredScenarioData
      filteredScenarioData[scenarioName] = filteredScenarioData[scenarioName].filter (item) ->
        item.province == viz4config.province
    
    # Finally, convert units
    return filteredScenarioData if viz4config.unit == 'millionCubicMetres'

    if viz4config.unit == 'cubicFeet' 
      unitConvertedScenarioData = {}
      for scenario in Object.keys filteredScenarioData
        unitConvertedScenarioData[scenario] = []
        for item in filteredScenarioData[scenario]
          unitConvertedScenarioData[scenario].push 
            # TODO: This approach is pretty nasty, is there a better way?
            province: item.province
            sector: item.sector
            source: item.source
            scenario: item.scenario
            year: item.year
            value: item.value * UnitTransformation.transformUnits('millionCubicMetres', 'cubicFeet')
      return unitConvertedScenarioData

    # TODO: if we get to here something has gone horribly wrong, and we should do something else
    console.warn 'something has gone wrong'



  # Returns an object keyed by scenario name (e.g. 'reference')
  # Each entry has an array of objects in ascending order by year, like:
  #   province: 'all'
  #   scenario: 'constrained'
  #   sector: 'total' or undefined
  #   source: 'total' or undefined, or the attribute may be absent
  #   value: 2161.98
  #   year: 2005
  # The attributes available vary from dataset to dataset, which is why some of them may 
  # or may not be present. 
  dataForViz4: (viz4config) ->
    unfilteredData = @dataForAllViz4Scenarios viz4config
    filteredData = {}

    # Exclude data from scenarios that aren't in the set
    for scenarioName in Object.keys unfilteredData
      if viz4config.scenarios.includes scenarioName
        filteredData[scenarioName] = unfilteredData[scenarioName]

    filteredData





module.exports = GasProductionProvider