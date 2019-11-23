_ = require 'lodash'

Constants = require '../Constants.coffee'

class Visualization2Configuration
  defaultOptions:
    sector: 'total'
    unit: 'petajoules'
    scenario: 'reference'
    sources: [
      'solarWindGeothermal'
      'coal'
      'naturalGas'
      'bio'
      'oilProducts'
      'electricity'
    ]
    sourcesInOrder: [
      'solarWindGeothermal'
      'coal'
      'naturalGas'
      'bio'
      'oilProducts'
      'electricity'
    ]
    province: 'all'
    dataset: Constants.datasets[Constants.datasets.length - 1]

  constructor: (@app, options) ->
    @page = 'viz2'

    options = _.extend {}, @defaultOptions, options

    @setDataset options.dataset

    @mainSelection = 'energyDemand' # this isn't an option for viz 2

    # sector, one of: residential, commercial, industrial, transportation, total
    @setSector options.sector

    # unit, one of:
    # petajoules
    # kilobarrelEquivalents
    @setUnit options.unit

    # one of: reference, constrained, high, low, highLng, noLng
    @setScenario options.scenario

    # sources, array
    # can include any of: hydro, oilProducts, bio, naturalGas, coal, solarWindGeothermal
    @sources = []
    for source in options.sources
      @addSource source

    # province
    # one of the two letter province abbreviations, or 'all'
    # BC AB SK MB ON QC NB NS NL PE YT NT NU all
    @setProvince options.province

    @setSourcesInOrder options.sourcesInOrder

    @setLanguage @app.language || 'en'

  # Setters

  setSector: (sector) ->
    if Constants.sectors.includes sector
      @sector = sector
    else
      @sector = @defaultOptions.sector

  setUnit: (unit) ->
    if ['petajoules', 'kilobarrelEquivalents'].includes unit
      @unit = unit
    else
      @unit = @defaultOptions.unit

  setScenario: (scenario) ->
    if Constants.datasetDefinitions[@dataset].scenarios.includes scenario
      @scenario = scenario
    else
      @scenario = @defaultOptions.scenario

  addSource: (source) ->
    return unless Constants.viz2Sources.includes source
    @sources.push source unless @sources.includes source

  setSourcesInOrder: (sourcesInOrder) ->
    if @isValidSourcesInOrder sourcesInOrder
      @sourcesInOrder = sourcesInOrder
    else
      @sourcesInOrder = @defaultOptions.sourcesInOrder


  removeSource: (source) ->
    @sources = @sources.filter (s) -> s != source

  resetSources: (selectAll) ->
    if selectAll
      @sources = [
        'solarWindGeothermal'
        'coal'
        'naturalGas'
        'bio'
        'oilProducts'
        'electricity'
      ]
    else
      @sources = []

  setProvince: (province) ->
    if Constants.provinceRadioSelectionOptions.includes province
      @province = province
    else
      @province = @defaultOptions.province

  flipSource: (source) ->
    return unless Constants.viz2Sources.includes source
    if @sources.includes source
      @sources = @sources.filter (s) -> s != source
    else
      @sources.push source

  setLanguage: (language) ->
    @language = language if language == 'en' or language == 'fr'

  setDataset: (dataset) ->
    if Constants.datasets.includes dataset
      @dataset = dataset
    else
      @dataset = @defaultOptions.dataset

  # Router integration

  routerParams: ->
    page: 'viz2'
    sector: @sector
    unit: @unit
    scenario: @scenario
    sources: @sources
    sourcesInOrder: @sourcesInOrder
    province: @province
    dataset: @dataset
    language: @app.language

  copy: (config) ->
    configParams = _.cloneDeep config.routerParams()

    @sector = configParams.sector
    @unit = configParams.unit
    @scenario = configParams.scenario
    @sources = configParams.sources
    @sourcesInOrder = configParams.sourcesInOrder
    @province = configParams.province
    @dataset = configParams.dataset





  isValidSourcesInOrder: (newOrder) ->
    # Check if the set of provinces is valid
    if(newOrder.length != @defaultOptions.sourcesInOrder.length)
      return false
    for newOrderedSource in newOrder
      if(!(@defaultOptions.sourcesInOrder.includes newOrderedSource))
        return false
    for currentOrderedSource in @defaultOptions.sourcesInOrder
      if(!(newOrder.includes currentOrderedSource))
        return false
    return true


  # Given an active source, find the next source which should become active if this
  # active source were removed from the sources
  nextActiveSource: (activeSource) ->
    source = @nextActiveSourceReverse activeSource
    return source if source?
    
    source = @nextActiveSourceForward activeSource
    return source if source?

    return null


  # Scan forward through the sources in order until we find one which is in the active
  # set
  nextActiveSourceForward: (activeSource) ->
    activeSourceIndex = @sourcesInOrder.indexOf activeSource

    for i in [(activeSourceIndex + 1)...@sourcesInOrder.length]
      if @sources.includes @sourcesInOrder[i]
        return @sourcesInOrder[i]

    return null

  # Scan backward through the sources in order until we find one which is in the active
  # set
  nextActiveSourceReverse: (activeSource) ->
    activeSourceIndex = @sourcesInOrder.indexOf activeSource

    for i in [(activeSourceIndex - 1)..0]
      if @sources.includes @sourcesInOrder[i]
        return @sourcesInOrder[i]

    return null


module.exports = Visualization2Configuration