d3 = require 'd3'

UnitTransformation = require '../unit-transformation.coffee'
Tr = require '../TranslationTable.coffee'

class ElectricityProductionProvider

  constructor: ->
    @data = []

  # Parse all of a CSV's data
  loadFromString: (dataString) ->
    @data = d3.csv.parse dataString, @mapping
    @parseData()

  # Add an array of data objects to the data store
  addData: (data) ->
    @data = @data.concat data
    @parseData()

  mapping: (d) ->
    province: d.province
    source: d.source
    scenario: d.scenario
    year: parseInt d.year
    value: parseFloat d.value
    unit: d.unit

  parseData: =>

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

    @dataByScenario =
      reference: []
      high: []
      low: []
      highLng: []
      noLng: []
      constrained: []
      htc: []
      hcp: []
      technology: []

    for item in @data
      @dataByScenario[item.scenario].push item
      @dataByProvince[item.province].push item
      @dataBySource[item.source].push item

    # @loadedCallback() if @loadedCallback

    



  # accessors note: ElectricityProductionProvider is never needed for viz 2!!



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
    for provinceName in Object.keys filteredProvinceData
      filteredProvinceData[provinceName] = filteredProvinceData[provinceName].filter (item) ->
        item.source == 'total'

    # Finally, convert units
    return filteredProvinceData if viz1config.unit == 'gigawattHours'

    if viz1config.unit == 'kilobarrelEquivalents' or viz1config.unit == 'petajoules'
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
            value: item.value * UnitTransformation.transformUnits('gigawattHours', viz1config.unit)
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




  # Returns an object like
  # name: 'Total'
  # viewBy: 'province'
  # children: []

  # Each of the child objects at depth 1 are like:
  # name: 'BC'
  # children: []

  # each of the child objects at depth 2 are like:
  # id: 'hydroBC'
  # name: "HYDRO BC"
  # size: 63631.55
  # source: "hydro"

  # bubble-chart and the D3 bubble packing system add numerous other properties to these
  # objects after we return them here.
  dataForViz3: (viz3config) ->
    filteredData = {} #this is filtered by the viewBy

    if viz3config.viewBy == 'province'
      dataToUse = @dataByProvince
      # singleSelectFilterName = 'provinces'
      stackedFilterName = 'sources'
      nameField = 'source'
    else
      dataToUse = @dataBySource
      # singleSelectFilterName = 'sources'
      stackedFilterName = 'provinces'
      nameField = 'province'

    # When province/source is all/total, add in all of the provinces/sources
    # Otherwise only add the one province or source selected

    if viz3config[viz3config.viewBy] == 'all' or viz3config[viz3config.viewBy] == 'total'
      for name in Object.keys dataToUse
        # We should not include these since they are merely sums
        if name != 'total' and name != 'all'
          filteredData[name] = dataToUse[name]
    else
      filteredData[viz3config[viz3config.viewBy]] = dataToUse[viz3config[viz3config.viewBy]]

    # Include only the year
    for name in Object.keys filteredData
      filteredData[name] = filteredData[name].filter (item) ->
        item.year == viz3config.year

    # Include only data for the current scenario
    for name in Object.keys filteredData
      filteredData[name] = filteredData[name].filter (item) ->
        item.scenario == viz3config.scenario

    # Include only items with nonzero data
    for name in Object.keys filteredData
      filteredData[name] = filteredData[name].filter (item) ->
        item.value != 0

    #So um units are not really used?
    if viz3config.unit == 'kilobarrelEquivalents' or viz3config.unit == 'petajoules'
      unitConvertedData = {}
      for name in Object.keys filteredData
        unitConvertedData[name] = []
        for item in filteredData[name]
          unitConvertedData[name].push
            # TODO: This approach is pretty nasty, is there a better way?
            province: item.province
            sector: item.sector
            source: item.source
            scenario: item.scenario
            year: item.year
            value: item.value * UnitTransformation.transformUnits('gigawattHours', viz3config.unit)
      filteredData = unitConvertedData

    childrenKeys = {}
    bubbleObj =
      name: 'Total'
      children: []
      viewBy: viz3config.viewBy
    for key, array of filteredData
      for item in array
        if childrenKeys[key] == undefined
          # Save the index for easy access later
          childrenKeys[key] = bubbleObj.children.length
          bubbleObj.children.push
            name: key
            children: []

        bubbleObj.children[childrenKeys[key]].children.push
          name:
            # for titles
            if viz3config.viewBy == 'province'
              "#{Tr.sourceSelector.sources[item[nameField]][viz3config.language]} #{key}"
            else
              "#{item[nameField]} #{Tr.sourceSelector.sources[key][viz3config.language]}"

          # NB: The order of province/source gets flipped around based on viewby
          id: "#{item[nameField]}#{key}"

          leafName: item[nameField]
          size:
            if viz3config[stackedFilterName].includes item[nameField]
              item.value
            else
              1

          source:
            if viz3config.viewBy == 'province'
              item[nameField]
            else
              key
          province:
            if viz3config.viewBy == 'province'
              key
            else
              item[nameField]

    bubbleObj




  # Returns a set of data corresponding to the given config object, except that
  # it has not been filtered by scenario. In order to show a y-axis which does not change
  # when the user switches the scenario, we need to take the maximum of all of the data
  # across scenarios for a given configuration.
  dataForAllViz4Scenarios: (viz4config) ->
    filteredScenarioData = {}

    # Group data by scenario
    for scenarioName in Object.keys @dataByScenario
      filteredScenarioData[scenarioName] = @dataByScenario[scenarioName]

    # We aren't interested in breakdowns by source, only the totals
    # TODO: Since this will always be the case for viz4, cache the data with this filter
    # applied?
    for scenarioName in Object.keys filteredScenarioData
      filteredScenarioData[scenarioName] = filteredScenarioData[scenarioName].filter (item) ->
        item.source == 'total'

    # Include only data for the current province
    for scenarioName in Object.keys filteredScenarioData
      filteredScenarioData[scenarioName] = filteredScenarioData[scenarioName].filter (item) ->
        item.province == viz4config.province


    # Finally, convert units
    return filteredScenarioData if viz4config.unit == 'gigawattHours'

    if viz4config.unit == 'kilobarrelEquivalents' or viz4config.unit == 'petajoules'
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
            value: item.value * UnitTransformation.transformUnits('gigawattHours', viz4config.unit)
      return unitConvertedScenarioData

    # TODO: if we get to here something has gone horribly wrong, and we should do
    # something else
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




module.exports = ElectricityProductionProvider