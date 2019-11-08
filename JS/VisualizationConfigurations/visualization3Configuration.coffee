_ = require 'lodash'

Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'

# Note: since this has a 'viewBy' option sometimes we can multi select provinces
# sometimes its sources. We have separate variables for each case.

class Visualization3Configuration
  defaultOptions:
    viewBy: 'province'
    unit: 'gigawattHours'
    scenario: 'reference'
    year: Constants.minYear
    sources: [
      'hydro'
      'solarWindGeothermal'
      'coal'
      'naturalGas'
      'bio'
      'nuclear'
      'oilProducts'
    ]
    provinces: [
      'AB'
      'BC'
      'MB'
      'NB'
      'NL'
      'NS'
      'NT'
      'NU'
      'ON'
      'PE'
      'QC'
      'SK'
      'YT'
    ]

    province: 'all'
    source: 'total'
    dataset: Constants.datasets[Constants.datasets.length - 1]

  constructor: (@app, options) ->
    @page = 'viz3'

    options = _.extend {}, @defaultOptions, options

    @setDataset options.dataset

    @mainSelection = 'electricityGeneration' # this isn't an option for viz 3

    # viewing method: 'province' or 'source'
    @setViewBy options.viewBy

    # unit, one of:
    # petajoules
    # gigawattHours
    # kilobarrelEquivalents
    @setUnit options.unit

    # one of: reference, constrained, high, low, highLng, noLng
    @setScenario options.scenario

    # year, int between 2005 and 2040 inclusive
    @setYear options.year

    # sources, array, used when ViewBy == 'province'
    # any of: oilProducts, nuclear, bio, naturalGas, coal, solarWindGeothermal, hydro
    @sources = []
    for source in options.sources
      @addSource source

    # provinces, array, used when ViewBy == 'source'
    # can include any of: BC AB SK MB ON QC NB NS NL PE YT NT NU
    @provinces = []
    for province in options.provinces
      @addProvince province

    # source, used when ViewBy == 'source'
    # one of: total, oilProducts, nuclear, bio, naturalGas, coal, solarWindGeothermal,
    # hydro
    @setSource options.source

    # province, used when ViewBy == 'province'
    # one of the two letter province abbreviations, or 'all'
    # BC AB SK MB ON QC NB NS NL PE YT NT NU all
    @setProvince options.province

    @setLanguage @app.language || 'en'

  # Setters

  setViewBy: (viewBy) ->
    if ['province', 'source'].includes viewBy
      @viewBy = viewBy
    else
      @viewBy = @defaultOptions.viewBy

  setUnit: (unit) ->
    if ['petajoules', 'gigawattHours', 'kilobarrelEquivalents'].includes unit
      @unit = unit
    else
      @unit = @defaultOptions.unit

  setScenario: (scenario) ->
    if Constants.datasetDefinitions[@dataset].scenarios.includes scenario
      @scenario = scenario
    else
      @scenario = @defaultOptions.scenario

  setYear: (year) ->
    year = parseInt year, 10
    if year >= Constants.minYear and year <= Constants.maxYear
      @year = year
    else if year > Constants.maxYear
      @year = Constants.maxYear
    else
      @year = @defaultOptions.year

  addProvince: (province) ->
    return unless Constants.provinces.includes province
    if @viewBy == 'source'
      @provinces.push province unless @provinces.includes province

  removeProvince: (province) ->
    if @viewBy == 'source'
      @provinces = @provinces.filter (p) -> p != province

  addSource: (source) ->
    return unless Constants.sources.includes source
    if @viewBy == 'province'
      @sources.push source unless @sources.includes source

  removeSource: (source) ->
    if @viewBy == 'province'
      @sources = @sources.filter (s) -> s != source

  setSource: (source) ->
    if Constants.viz3SourceRadioSelectionOptions.includes source
      @source = source
    else
      @source = @defaultOptions.source

  setProvince: (province) ->
    if Constants.provinceRadioSelectionOptions.includes province
      @province = province
    else
      @province = @defaultOptions.province

  flipSource: (key) ->
    return unless Constants.viz3Sources.includes key
    if @sources.includes key
      @sources = @sources.filter (s) -> s != key
    else
      @sources.push key

  flipProvince: (key) ->
    return unless Constants.provinces.includes key
    if @provinces.includes key
      @provinces = @provinces.filter (p) -> p != key
    else
      @provinces.push key

  resetSources: (selectAll) ->
    if selectAll
      @sources = [
        'hydro'
        'solarWindGeothermal'
        'coal'
        'naturalGas'
        'bio'
        'nuclear'
        'oilProducts'
      ]
    else
      @sources = []

  resetProvinces: (selectAll) ->
    if selectAll
      @provinces = [
        'BC'
        'AB'
        'SK'
        'MB'
        'ON'
        'QC'
        'NB'
        'NS'
        'NL'
        'PE'
        'YT'
        'NT'
        'NU'
      ]
    else
      @provinces = []

  setLanguage: (language) ->
    @language = language if language == 'en' or language == 'fr'

  setDataset: (dataset) ->
    if Constants.datasets.includes dataset
      @dataset = dataset
    else
      @dataset = @defaultOptions.dataset

  # Router integration

  routerParams: ->
    params =
      page: 'viz3'
      viewBy: @viewBy
      unit: @unit
      scenario: @scenario
      year: @year
      dataset: @dataset
      language: @app.language
    if @viewBy == 'province'
      params.province = @province
      params.sources = @sources
    else if @viewBy = 'source'
      params.source = @source
      params.provinces = @provinces
      
    params


  copy: (config) ->
    configParams = _.cloneDeep config.routerParams()

    @viewBy = configParams.viewBy
    @unit = configParams.unit
    @scenario = configParams.scenario
    @year = configParams.year
    @dataset = configParams.dataset
    @province = configParams.province
    @source = configParams.source
    @provinces = configParams.provinces
    @sources = configParams.sources






module.exports = Visualization3Configuration