_ = require 'lodash'

Constants = require '../Constants.coffee'

class Visualization4Configuration
  defaultOptions:
    mainSelection: 'gasProduction'
    unit: 'petajoules'

    scenarios: [
      'reference'
      'technology'
      'hcp'
    ]
    province: 'all'

    dataset: Constants.datasets[Constants.datasets.length - 1]


  constructor: (@app, options) ->
    @page = 'viz4'

    options = _.extend {}, @defaultOptions, options

    # Initialize scenarios to an empty list, so that the scenarios validation routine
    # in setDataset does not crash.
    @scenarios = []
    @setDataset options.dataset

    # mainSelection, one of energyDemand, oilProduction, electricityGeneration, or
    # gasProduction
    @setMainSelection options.mainSelection

    # unit, one of:
    # petajoules
    # kilobarrelEquivalents - kilobarrels of oil equivalent per day, kBOE/day
    # gigawattHours - GWh
    # thousandCubicMetres - thousand cubic metres per day, m^3/day (oil)
    # millionCubicMetres - million cubic metres per day, m^3/day (gas)
    # kilobarrels - kilobarrels of oil per day, kB/day
    # cubicFeet - billion cubic feet per day, Bcf/day
    @setUnit options.unit

    # array, any of: reference, constrained, high, low, highLng, noLng
    @scenarios = []
    for scenario in options.scenarios
      @addScenario scenario

    # province
    # one of the two letter province abbreviations, or 'all'
    # BC AB SK MB ON QC NB NS NL PE YT NT NU all
    @setProvince options.province

    @setLanguage @app.language || 'en'

  # Setters

  setMainSelection: (selection) ->
    if Constants.mainSelections.includes selection
      @mainSelection = selection
    else
      @mainSelection = 'energyDemand'

    # When the selection changes, the set of allowable units changes
    # Calling setUnit validates the choice
    @setDataset @dataset
    @setUnit @unit

  setUnit: (unit) ->
    allowableUnits = []
    switch @mainSelection
      when 'energyDemand'
        allowableUnits = ['petajoules', 'kilobarrelEquivalents']
      when 'electricityGeneration'
        allowableUnits = ['petajoules', 'gigawattHours', 'kilobarrelEquivalents']
      when 'oilProduction'
        allowableUnits = ['kilobarrels', 'thousandCubicMetres']
      when 'gasProduction'
        allowableUnits = ['cubicFeet', 'millionCubicMetres']
    if allowableUnits.includes unit
      @unit = unit
    else
      @unit = allowableUnits[0]

  addScenario: (scenario) ->
    return unless Constants.datasetDefinitions[@dataset].scenarios.includes scenario
    @scenarios.push scenario unless @scenarios.includes scenario

  setProvince: (province) ->
    if Constants.provinceRadioSelectionOptions.includes province
      @province = province
    else
      @province = @defaultOptions.province

  removeScenario: (scenario) ->
    @scenarios = @scenarios.filter (s) -> s != scenario

  validateScenarios: ->
    # Check if the each scenario is valid for the current dataset
    # and update the list of supported scenarios.
    for scenario in @scenarios
      @removeScenario scenario
      @addScenario scenario

  setLanguage: (language) ->
    @language = language if language == 'en' or language == 'fr'

  setDataset: (dataset) ->
    if Constants.datasets.includes dataset
      @dataset = dataset
    else
      @dataset = @defaultOptions.dataset
    @validateScenarios()

  # Router integration

  routerParams: ->
    page: 'viz4'
    mainSelection: @mainSelection
    unit: @unit
    scenarios: @scenarios
    province: @province
    dataset: @dataset
    language: @app.language

  copy: (config) ->
    configParams = _.cloneDeep config.routerParams()

    @mainSelection = configParams.mainSelection
    @unit = configParams.unit
    @scenarios = configParams.scenarios
    @province = configParams.province
    @dataset = configParams.dataset



  # Given an active scenario, find the next scenario which should become active if this
  # active scenario were removed from the scenarios

  # TODO: Currently, we are simply taking the drawing order to determine the next/previous
  # scenario, which works adequately. A potential improvement: take the values for the
  # current scenarios/datset/year, and compute which is actually above/below the current
  # position on the chart.
  # Consider: reference + lowprice, jan2016, total demand. The lines cross...
  nextActiveScenario: (activeScenario) ->
    scenario = @nextActiveScenarioReverse activeScenario
    return scenario if scenario?
    
    scenario = @nextActiveScenarioForward activeScenario
    return scenario if scenario?

    return null


  # Scan forward through the scenarios in order until we find one which is in the active
  # set
  nextActiveScenarioForward: (activeScenario) ->
    scenariosInOrder = Constants.scenarioDrawingOrder
    activeScenarioIndex = scenariosInOrder.indexOf activeScenario
    potentialScenarios = Constants.datasetDefinitions[@dataset].scenariosPerSelection[@mainSelection]

    for i in [(activeScenarioIndex + 1)...scenariosInOrder.length]
      if @scenarios.includes(scenariosInOrder[i]) and potentialScenarios.includes(scenariosInOrder[i])
        return scenariosInOrder[i]

    return null

  # Scan backward through the scenarios in order until we find one which is in the active
  # set
  nextActiveScenarioReverse: (activeScenario) ->
    scenariosInOrder = Constants.scenarioDrawingOrder
    activeScenarioIndex = scenariosInOrder.indexOf activeScenario
    potentialScenarios = Constants.datasetDefinitions[@dataset].scenariosPerSelection[@mainSelection]

    for i in [(activeScenarioIndex - 1)..0]
      if @scenarios.includes(scenariosInOrder[i]) and potentialScenarios.includes(scenariosInOrder[i])
        return scenariosInOrder[i]

    return null


  # Are there any visible scenarios with this configuration?
  scenariosVisible: ->
    # Whether any scenarios are visible or not depends on the scenarios for in the
    # dataset + mainSelection, and whether any of those are in the current set.
    potentialScenarios = Constants.datasetDefinitions[@dataset].scenariosPerSelection[@mainSelection]

    for scenario in potentialScenarios
      return true if @scenarios.includes scenario

    return false




module.exports = Visualization4Configuration