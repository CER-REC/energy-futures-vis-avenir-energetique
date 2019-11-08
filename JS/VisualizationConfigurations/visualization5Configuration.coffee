_ = require 'lodash'

Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'


class Visualization5Configuration
  defaultOptions:
    dataset: Constants.datasets[Constants.datasets.length - 1]
    scenario: 'reference'
    scenarios: [
      'reference'
      'technology'
      'hcp'
    ]
    baseYear: 2015 # bottom spinner
    comparisonYear: 2040 # top spinner
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




module.exports = Visualization5Configuration