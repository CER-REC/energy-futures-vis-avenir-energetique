d3 = require 'd3'
Constants = require '../Constants.coffee'
UnitTransformation = require '../unit-transformation.coffee'

class EnergyConsumptionProvider



  constructor: (loadedCallback) ->

    @data = null
    @loadedCallback = loadedCallback

    d3.csv "CSV/energy demand.csv", @csvMapping, @parseData
  




  csvMapping: (d) ->
    province: d.Area
    sector: d.Sector
    source: d.Source
    scenario: d.Case
    year: parseInt(d.Year)
    value: parseFloat(d.Data)

  parseData: (error, data) =>
    console.warn error if error?
    @data = data
    
    # Normalize some of the data in the CSV, to make life easier later
    # TODO: precompute some of these changes?

    for item in @data
      item.scenario = Constants.csvScenarioToScenarioNameMapping[item.scenario]

    for item in @data
      item.source = Constants.csvSourceToSourceNameMapping[item.source]

    for item in @data
      item.sector = Constants.csvSectorToSectorNameMapping[item.sector]

    for item in @data
      item.province = Constants.csvProvinceToProvinceCodeMapping[item.province]

    @data.filter (item) ->
      item.source not in ['crudeOil', 'nuclear', 'hydro']

    @dataByProvince = 
      'BC' : []
      'AB' : []
      'SK' : []
      'MB' : []
      'ON' :  []
      'QC' : []
      'NB' : []
      'NS' : []
      'NL' : []
      'PE' : []
      'YT' :  []
      'NT' :  []
      'NU' :  []
      'all' : []

    @dataByScenario = 
      reference: []
      high: []
      low: []
      highLng: []
      noLng: []
      constrained: []

    @dataBySource =
      hydro: []
      solarWindGeothermal: []
      coal: []
      naturalGas: []
      bio: []
      nuclear: []
      oilProducts: []
      crudeOil: []
      electricity: []
      total: []

    # @dataBySector = 
    #   total: []
    #   residential: []
    #   commercial: []
    #   industrial: []
    #   transportation: []

    for item in @data
      @dataByScenario[item.scenario].push item
      @dataByProvince[item.province].push item
      # @dataBySector[item.sector].push item
      @dataBySource[item.source].push item

    @loadedCallback()
    
    
  # accessors note: EnergyConsumptionProvider is never needed for viz 3!!



  # Returns a set of data corresponding to the given config object, except that 
  # it has not been filtered by scenario. In order to show a y-axis which does not change
  # when the user switches the scenario, we need to take the maximum of all of the data 
  # across scenarios for a given configuration.
  dataForAllViz1Scenarios: (viz1config) ->
    filteredProvinceData = {}    

    # Exclude data from provinces that aren't in the set
    for provinceName in Object.keys @dataByProvince
      if viz1config.provinces.includes provinceName
        filteredProvinceData[provinceName] = @dataByProvince[provinceName]

    # We aren't interested in breakdowns by source, only the totals
    # We aren't interested in breakdowns by sector, only the totals
    for provinceName in Object.keys filteredProvinceData
      filteredProvinceData[provinceName] = filteredProvinceData[provinceName].filter (item) ->
        item.source == 'total' and 
        item.sector == 'total'

    # Finally, convert units
    return filteredProvinceData if viz1config.unit == 'petajoules'

    if viz1config.unit == 'kilobarrelEquivalents' 
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
            value: item.value * UnitTransformation.transformUnits('petajoules', 'kilobarrelEquivalents')
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
  dataForAllViz2Scenarios: (viz2config) ->
    filteredSourceData = {}

    # Exclude data from sources that aren't in the set
    for sourceName in Object.keys @dataBySource
      if viz2config.sources.includes sourceName
        filteredSourceData[sourceName] = @dataBySource[sourceName]

    # Include only data for the province and sector
    for sourceName in Object.keys filteredSourceData
      filteredSourceData[sourceName] = filteredSourceData[sourceName].filter (item) ->
        item.province == viz2config.province and
        item.sector == viz2config.sector

    # Finally, convert units
    return filteredSourceData if viz2config.unit == 'petajoules'

    if viz2config.unit == 'kilobarrelEquivalents' 
      unitConvertedSourceData = {}
      for province in Object.keys filteredSourceData
        unitConvertedSourceData[province] = []
        for item in filteredSourceData[province]
          unitConvertedSourceData[province].push 
            # TODO: This approach is pretty nasty, is there a better way?
            province: item.province
            sector: item.sector
            source: item.source
            scenario: item.scenario
            year: item.year
            value: item.value * UnitTransformation.transformUnits('petajoules', 'kilobarrelEquivalents')
      return unitConvertedSourceData


  # Returns an object keyed by energy source (like 'solarWindGeothermal')
  # Each entry has an array of objects in ascending order by year, like:
  #   province: 'all'
  #   scenario: 'reference'
  #   sector: 'total'
  #   source: 'coal'
  #   value: 244.4053
  #   year: 2005
  dataForViz2: (viz2config) ->
    unfilteredData = @dataForAllViz2Scenarios viz2config
    filteredData = {}

    for sourceName in Object.keys unfilteredData
      filteredData[sourceName] = unfilteredData[sourceName].filter (item) ->
        item.scenario == viz2config.scenario

    filteredData


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
    filteredScenarioData = {}    

    # Exclude data from scenarios that aren't in the set
    for scenarioName in Object.keys @dataByScenario
      if viz4config.scenarios.includes scenarioName
        filteredScenarioData[scenarioName] = @dataByScenario[scenarioName]

    # We aren't interested in breakdowns by source or sector, only the totals
    # TODO: Since this will always be the case for viz4, cache the data with this filter applied?
    for scenarioName in Object.keys filteredScenarioData
      filteredScenarioData[scenarioName] = filteredScenarioData[scenarioName].filter (item) ->
        item.source == 'total' and item.sector == 'total'

    # Include only data for the current province
    for scenarioName in Object.keys filteredScenarioData
      filteredScenarioData[scenarioName] = filteredScenarioData[scenarioName].filter (item) ->
        item.province == viz4config.province


    
    # Finally, convert units
    return filteredScenarioData if viz4config.unit == 'petajoules'

    if viz4config.unit == 'kilobarrelEquivalents'
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
            value: item.value * UnitTransformation.transformUnits('petajoules', 'kilobarrelEquivalents')
      return unitConvertedScenarioData

    # TODO: if we get to here something has gone horribly wrong, and we should do something else
    console.warn 'something has gone wrong'





module.exports = EnergyConsumptionProvider