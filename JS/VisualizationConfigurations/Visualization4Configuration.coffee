_ = require 'lodash'

Constants = require '../Constants.coffee'
Tr = require '../TranslationTable.coffee'

class Visualization4Configuration
  defaultOptions: 
    mainSelection: 'gasProduction'
    unit: 'petajoules'

    scenarios: [
      'reference'
      'constrained'
      'high'
      'low'
      'highLng'
      'noLng'
    ]
    province: 'all'

    dataset: Constants.datasets[0]


  constructor: (@app, options) ->
    @page = 'viz4'

    options = _.extend {}, @defaultOptions, options

    # Initialize scenarios to an empty list, so that the scenarios validation routine
    # in setDataset does not crash.
    @scenarios = []
    @setDataset options.dataset

    # mainSelection, one of energyDemand, oilProduction, electricityGeneration, or gasProduction
    @setMainSelection options.mainSelection

    # unit, one of:
    # petajoules
    # kilobarrelEquivalents - kilobarrels of oil equivalent per day, kBOE/day 
    # gigawattHours - GWh
    # thousandCubicMetres - thousand cubic metres per day, m^3/day (oil)
    # millionCubicMetres - million cubic metres per day, m^3/day (gas)
    # kilobarrels - kilobarrels of oil per day, kB/day
    # cubicFeet - million cubic feet per day, Mcf/day
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

  # Description for PNG export
  imageExportDescription: ->


    mainSelectionText = switch @mainSelection
      when 'energyDemand'
        Tr.mainSelector.totalDemandButton[@app.language]
      when 'electricityGeneration'
        Tr.mainSelector.electricityGenerationButton[@app.language]
      when 'oilProduction'
        Tr.mainSelector.oilProductionButton[@app.language]
      when 'gasProduction'
        Tr.mainSelector.gasProductionButton[@app.language]
    
    unitText = switch @unit
      when 'petajoules'
        Tr.unitSelector.petajoulesButton[@app.language]
      when 'kilobarrelEquivalents'
        Tr.unitSelector.kilobarrelEquivalentsButton[@app.language]
      when 'gigawattHours'
        Tr.unitSelector.gigawattHourButton[@app.language]
      when 'thousandCubicMetres'
        Tr.unitSelector.thousandCubicMetresButton[@app.language]
      when 'millionCubicMetres'
        Tr.unitSelector.millionCubicMetresButton[@app.language]
      when 'kilobarrels'
        Tr.unitSelector.kilobarrelsButton[@app.language]
      when 'cubicFeet'
        Tr.unitSelector.cubicFeetButton[@app.language]

    provinceText = if @province == 'all'
      "CANADA"
    else
      "#{Tr.viewBySelector.viewByProvinceButton[@app.language]}: #{Tr.regionSelector.names[@province][@app.language]}"

    datasetText = switch @dataset
      when 'jan2016'
        "#{Tr.report[@app.language]}#{Tr.datasetSelector.jan2016Button[@app.language]}"
      when 'oct2016'
        "#{Tr.report[@app.language]}#{Tr.datasetSelector.oct2016Button[@app.language]}"

    description = ''
    description += "#{datasetText} - "
    description += "#{mainSelectionText} - "
    description += "#{Tr.imageExportText.unit[@app.language]}: #{unitText} - "
    description += "#{provinceText}"

    description

  pngFileName: ->
    
    scenarios = @scenarios.map (scenario) =>
      Tr.scenarioSelector.names[scenario][@app.language]

    components = [
      Tr.landingPage.mainHeader[@app.language]
      Tr.visualization4Titles[@mainSelection][@app.language]
      scenarios.join(',')
    ]

    filename = components.join(' - ')
    filename += '.png'
    filename


module.exports = Visualization4Configuration