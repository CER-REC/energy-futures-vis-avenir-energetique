d3 = require 'd3'
Constants = require '../Constants.coffee'
UnitTransformation = require '../unit-transformation.coffee'


class GasProductionProvider



  constructor: (loadedCallback) ->

    @data = null
    @loadedCallback = loadedCallback

    d3.csv "CSV/Natural gas production VIZ.csv", @csvMapping, @parseData
  




  csvMapping: (d) ->
    province: d.Area
    type: d.Type
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
      item.province = Constants.csvProvinceToProvinceCodeMapping[item.province]

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

    for item in @data
      @dataByScenario[item.scenario].push item
      @dataByProvince[item.province].push item
    
    @loadedCallback()


  # accessors note: this is never needed for viz 2 or 3!!
  dataForViz1: (viz1config) ->
    filteredProvinceData = {}    

    # Exclude data from provinces that aren't in the set
    for provinceName in Object.keys @dataByProvince
      if viz1config.provinces.includes provinceName
        filteredProvinceData[provinceName] = @dataByProvince[provinceName]

    # We aren't interested in breakdowns by source, only the totals
    for provinceName in Object.keys filteredProvinceData
      filteredProvinceData[provinceName] = filteredProvinceData[provinceName].filter (item) ->
        item.type == 'Total'

    # Include only data for the current scenario
    for provinceName in Object.keys filteredProvinceData
      filteredProvinceData[provinceName] = filteredProvinceData[provinceName].filter (item) ->
        item.scenario == viz1config.scenario
    
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


  dataForViz4: (viz4config) ->
    filteredScenarioData = {}    

    # Exclude data from scenarios that aren't in the set
    for scenarioName in Object.keys @dataByScenario
      if viz4config.scenarios.includes scenarioName
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





module.exports = GasProductionProvider