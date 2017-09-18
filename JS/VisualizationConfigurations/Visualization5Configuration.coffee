_ = require 'lodash'

Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'


class Visualization5Configuration
  defaultOptions:
    dataset: Constants.datasets[2]
    scenario: 'reference'
    scenarios: [
      'reference'
      'technology'
      'hcp'
    ]
    baseYear: 2010 # bottom spinner
    comparisonYear: 2020 # top spinner
    leftProvince: 'all'
    rightProvince: 'AB'
    sector: 'total'

  constructor: (@app, options) ->
    @page = 'viz5'

    options = _.extend {}, @defaultOptions, options

    # see Constants.datasets
    @setDataset options.dataset

    # one of: reference, constrained, high, low, highLng, noLng
    @setScenario options.scenario

    # array, any of: reference, constrained, high, low, highLng, noLng
    @scenarios = []
    for scenario in options.scenarios
      @addScenario scenario

    # baseYear, int between 2005 and 2040 inclusive
    @setBaseYear options.baseYear

    # comparisonYear, int between 2005 and 2040 inclusive
    @setComparisonYear options.comparisonYear

    # leftProvince, one of the 13 region values, or 'all'
    # 'all' signifies that roses for all 13 provinces are on display, and that the right
    # province is hidden.
    @setLeftProvince options.leftProvince

    # rightProvince one of the 13 region values
    # NB: 'all' is not in the set of valid values here!
    @setRightProvince options.rightProvince

    # sector, one of: residential, commercial, industrial, transportation, total
    @setSector options.sector

    @setLanguage @app.language || 'en'

  # Setters

  setDataset: (dataset) ->
    if Constants.datasets.includes dataset
      @dataset = dataset
    else
      @dataset = @defaultOptions.dataset
    @setScenario @scenario

  setScenario: (scenario) ->
    if Constants.datasetDefinitions[@dataset].scenarios.includes scenario
      @scenario = scenario
    else
      @scenario = @defaultOptions.scenario

  setBaseYear: (year) ->
    year = parseInt year, 10
    if year >= Constants.minYear and year <= Constants.maxYear
      @baseYear = year
    else if year > Constants.maxYear
      @baseYear = Constants.maxYear
    else
      @baseYear = Constants.minYear

    if @baseYear > @comparisonYear
      @baseYear = @comparisonYear

  setComparisonYear: (year) ->
    year = parseInt year, 10
    if year >= Constants.minYear and year <= Constants.maxYear
      @comparisonYear = year
    else if year > Constants.maxYear
      @comparisonYear = Constants.maxYear
    else
      @comparisonYear = @defaultOptions.comparisonYear

    # Comparison year must be at the current base year, or further in the future
    if @comparisonYear < @baseYear
      @comparisonYear = @baseYear

  setLeftProvince: (province) ->
    if Constants.viz5leftProvinceMenuOption.includes province
      @leftProvince = province
    else
      @leftProvince = @defaultOptions.leftProvince

  setRightProvince: (province) ->
    if Constants.viz5rightProvinceMenuOption.includes province
      @rightProvince = province
    else
      @rightProvince = @defaultOptions.rightProvince

  addScenario: (scenario) ->
    return unless Constants.datasetDefinitions[@dataset].scenarios.includes scenario
    @scenarios.push scenario unless @scenarios.includes scenario

  setSector: (sector) ->
    if Constants.sectors.includes sector
      @sector = sector
    else
      @sector = @defaultOptions.sector

  setLanguage: (language) ->
    @language = language if language == 'en' or language == 'fr'
  # Router integration

  routerParams: ->
    page: 'viz5'
    dataset: @dataset
    scenario: @scenario
    baseYear: @baseYear
    comparisonYear: @comparisonYear
    leftProvince: @leftProvince
    rightProvince: @rightProvince
    sector: @sector
    language: @app.language


  copy: (config) ->
    configParams = _.cloneDeep config.routerParams()

    @dataset = configParams.dataset
    @scenario = configParams.scenario
    @baseYear = configParams.baseYear
    @comparisonYear = configParams.comparisonYear
    @leftProvince = configParams.leftProvince
    @rightProvince = configParams.rightProvince
    @sector = configParams.sector


  # Description for PNG export
  imageExportDescription: ->
    datasetText = switch @dataset
      when 'jan2016'
        "#{Tr.report[@app.language]}#{Tr.datasetSelector.jan2016Button[@app.language]}"
      when 'oct2016'
        "#{Tr.report[@app.language]}#{Tr.datasetSelector.oct2016Button[@app.language]}"
      when 'oct2017'
        "#{Tr.report[@app.language]}#{Tr.datasetSelector.oct2017Button[@app.language]}"

    sectorText = Tr.imageExportText.sectors[@sector][@app.language]

    scenarioText = switch @scenario
      when 'reference'
        Tr.scenarioSelector.referenceButton[@app.language]
      when 'constrained'
        Tr.scenarioSelector.constrainedButton[@app.language]
      when 'high'
        Tr.scenarioSelector.highPriceButton[@app.language]
      when 'low'
        Tr.scenarioSelector.lowPriceButton[@app.language]
      when 'highLng'
        Tr.scenarioSelector.highLngButton[@app.language]
      when 'noLng'
        Tr.scenarioSelector.noLngButton[@app.language]
      when 'technology'
        Tr.scenarioSelector.technologyButton[@app.language]
      when 'htc'
        Tr.scenarioSelector.htcButton[@app.language]
      when 'hcp'
        Tr.scenarioSelector.hcpButton[@app.language]

    yearText = "#{Tr.imageExportText.demandIn[@app.language]} #{@comparisonYear} #{Tr.imageExportText.relativeTo[@app.language]} #{@baseYear}"

    # TODO: What to do when both provinces are the same?
    regionText = if @leftProvince == 'all'
      'CANADA'
    else
      "#{Tr.regionSelector.names[@leftProvince][@app.language]} #{Tr.imageExportText.and[@app.language]} #{Tr.regionSelector.names[@rightProvince][@app.language]}"

    description = ''
    description += "#{datasetText} - "
    description += "#{Tr.imageExportText.sector[@app.language]}: #{sectorText} - "
    description += "#{Tr.imageExportText.scenario[@app.language]}: #{scenarioText} - "
    description += "#{yearText} - "
    description += "#{regionText}"

    description



  pngFileName: ->
    region = if @leftProvince == 'all'
      'CANADA'
    else
      "#{@leftProvince} - #{@rightProvince}"

    components = [
      Tr.landingPage.mainHeader[@app.language]
      Tr.visualization5Title[@app.language]
      Tr.imageExportText.sectors[@sector][@app.language]
      Tr.scenarioSelector.names[@scenario][@app.language]
      @comparisonYear
      @baseYear
      region
    ]

    filename = components.join ' - '
    filename += '.png'
    filename



module.exports = Visualization5Configuration