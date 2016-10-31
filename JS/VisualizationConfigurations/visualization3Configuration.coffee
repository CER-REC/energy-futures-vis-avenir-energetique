_ = require 'lodash'

Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'

# Note: since this has a 'viewBy' option sometimes we can multi select provinces sometimes its sources. We have sep.
# variables for each case.

class Visualization3Configuration
  defaultOptions: 
    viewBy: 'province'
    unit: 'gigawattHours'
    scenario: 'reference'
    year: 2005
    sources:[ 
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
    provincesInOrder: [
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
    sourcesInOrder:[ 
      'hydro'
      'solarWindGeothermal'
      'coal'
      'naturalGas'
      'bio'
      'nuclear'
      'oilProducts'
    ]
    province: 'all'
    source: 'total'

  constructor: (@app, options) ->
    @options = _.extend {}, @defaultOptions, options

    @mainSelection = 'electricityGeneration' # this isn't an option for viz 3

    # viewing method: 'province' or 'source'
    @setViewBy @options.viewBy

    # unit, one of:
    # petajoules
    # gigawattHours
    # kilobarrelEquivalents
    @setUnit @options.unit

    # one of: reference, constrained, high, low, highLng, noLng
    @setScenario @options.scenario

    # year, int between 2005 and 2040 inclusive
    @setYear @options.year

    # sources, array, used when ViewBy == 'province'
    # any of: oilProducts, nuclear, bio, naturalGas, coal, solarWindGeothermal, hydro
    @sources = []
    for source in @options.sources
      @addSource source

    # provinces, array, used when ViewBy == 'source'
    # can include any of: BC AB SK MB ON QC NB NS NL PE YT NT NU
    @provinces = []
    for province in @options.provinces
      @addProvince province

    # source, used when ViewBy == 'source'
    # one of: total, oilProducts, nuclear, bio, naturalGas, coal, solarWindGeothermal, hydro
    @setSource @options.source

    # province, used when ViewBy == 'province'
    # one of the two letter province abbreviations, or 'all'
    # BC AB SK MB ON QC NB NS NL PE YT NT NU all
    @setProvince @options.province

    # Used to manage the order of the provinces in a reorderable menu
    @provincesInOrder = @options.provincesInOrder

    # Used to manage the order of the sources in a reorderable menu
    @sourcesInOrder = @options.sourcesInOrder

    @setLanguage @app.language || 'en'

  # Setters

  setViewBy: (viewBy) ->
    if ['province', 'source'].includes viewBy
      @viewBy = viewBy
    else
      @viewBy = @defaultOptions.viewBy
    @updateRouter()

  setUnit: (unit) ->
    if ['petajoules', 'gigawattHours', 'kilobarrelEquivalents'].includes unit
      @unit = unit
    else
      @unit = @defaultOptions.unit
    @updateRouter()

  setScenario: (scenario) ->
    if Constants.scenarios.includes scenario
      @scenario = scenario
    else
      @scenario = @defaultOptions.scenario
    @updateRouter()

  setYear: (year) ->
    year = parseInt year, 10
    if year >= 2005 and year <= 2040
      @year = year
    else
      @year = @defaultOptions.year
    @updateRouter()

  addProvince: (province) ->
    return unless Constants.provinces.includes province
    if @viewBy == 'source'  
      @provinces.push province unless @provinces.includes province
    @updateRouter()

  removeProvince: (province) ->
    if @viewBy == 'source' 
      @provinces = @provinces.filter (p) -> p != province
    @updateRouter()

  addSource: (source) ->  
    return unless Constants.sources.includes source
    if @viewBy == 'province'  
      @sources.push source unless @sources.includes source
    @updateRouter()

  removeSource: (source) ->
    if @viewBy == 'province' 
      @sources = @sources.filter (s) -> s != source
    @updateRouter()

  setSource: (source) ->
    if Constants.viz3SourceRadioSelectionOptions.includes source
      @source = source
    else
      @source = @defaultOptions.source
    @updateRouter()

  setProvince: (province) ->
    if Constants.provinceRadioSelectionOptions.includes province
      @province = province
    else
      @province = @defaultOptions.province
    @updateRouter()


  flip: (key) ->
    if @viewBy == 'province'
      return unless Constants.sources.includes key
      if @sources.includes key
        @sources = @sources.filter (s) -> s != key
      else 
        @sources.push key
    else 
      return unless Constants.provinces.includes key
      if @provinces.includes key
        @provinces = @provinces.filter (p) -> p != key
      else
        @provinces.push key
    @updateRouter()

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
    @updateRouter()

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
    @updateRouter()

  setLanguage: (language) ->
    @language = language if language == 'en' or language == 'fr'


  # Router integration

  routerParams: ->
    params = 
      page: 'viz3'
      viewBy: @viewBy
      unit: @unit
      scenario: @scenario
      year: @year
    if @viewBy == 'province'
      params.province = @province
      params.sources = @sources
    else if @viewBy = 'source'
      params.source = @source
      params.provinces = @provinces
      
    params

  updateRouter: ->
    return unless @app? and @app.router?
    @app.router.navigate @routerParams()


  # Description for PNG export
  imageExportDescription: ->

    # Given that there are no axes, and no way to inspect the numeric quantities behind
    # each bubble in a PNG, does it make sense to include the units on the graph 
    # description at all? My tilt is no.

    # unitText = switch @unit
    #   when 'petajoules'
    #     Tr.unitSelector.petajoulesButton[@app.language]
    #   when 'kilobarrelEquivalents'
    #     Tr.unitSelector.kilobarrelEquivalentsButton[@app.language]
    #   when 'gigawattHours'
    #     Tr.unitSelector.gigawattHourButton[@app.language]


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

    sourceOrProvinceText = if @viewBy == 'province'
      if @province == 'all'
        "CANADA"
      else
        "#{Tr.viewBySelector.viewByProvinceButton[@app.language]}: #{Tr.regionSelector.names[@province][@app.language]}"
    else if @viewBy == 'source'
      if @source == 'total'
        "#{Tr.imageExportText.all[@app.language]} SOURCES"
      else
        "SOURCE: #{Tr.imageExportText.sources[@source][@app.language]}"

   
    description = ''
    description += "#{Tr.mainSelector.electricityGenerationButton[@app.language]} - "
    # description += "#{Tr.imageExportText.unit[@app.language]}: #{unitText} - "
    description += "#{Tr.imageExportText.scenario[@app.language]}: #{scenarioText} - "
    description += "#{sourceOrProvinceText}"

    description




module.exports = Visualization3Configuration