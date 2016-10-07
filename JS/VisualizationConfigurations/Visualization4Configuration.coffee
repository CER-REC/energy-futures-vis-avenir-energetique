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


  constructor: (@app, options) ->
    @options = _.extend {}, @defaultOptions, options

    # mainSelection, one of energyDemand, oilProduction, electricityGeneration, or gasProduction
    @setMainSelection @options.mainSelection


    # unit, one of:
    # petajoules
    # kilobarrelEquivalents - kilobarrels of oil equivalent per day, kBOE/day 
    # gigawattHours - GWh
    # thousandCubicMetres - thousand cubic metres per day, m^3/day (oil)
    # millionCubicMetres - million cubic metres per day, m^3/day (gas)
    # kilobarrels - kilobarrels of oil per day, kB/day
    # cubicFeet - million cubic feet per day, Mcf/day
    @setUnit @options.unit

    # array, any of: reference, constrained, high, low, highLng, noLng
    @scenarios = []
    for scenario in @options.scenarios
      @addScenario scenario

    # province
    # one of the two letter province abbreviations, or 'all'
    # BC AB SK MB ON QC NB NS NL PE YT NT NU all
    @setProvince @options.province



  # Setters

  setMainSelection: (selection) ->
    if Constants.mainSelections.includes selection
      @mainSelection = selection
    else
      @mainSelection = 'energyDemand'

    # When the selection changes, the set of allowable units changes
    # Calling setUnit validates the choice
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
    @updateRouter()

  addScenario: (scenario) ->
    return unless Constants.scenarios.includes scenario
    @scenarios.push scenario unless @scenarios.includes scenario
    @updateRouter()

  setProvince: (province) ->
    if Constants.provinceRadioSelectionOptions.includes province
      @province = province
    else
      @province = @defaultOptions.province
    @updateRouter()

  removeScenario: (scenario) ->
    @scenarios = @scenarios.filter (s) -> s != scenario
    @updateRouter()


  # Router integration

  routerParams: ->
    page: 'viz4'
    mainSelection: @mainSelection
    unit: @unit
    scenarios: @scenarios
    province: @province

  updateRouter: ->
    return unless app? and @app.router?
    @app.router.navigate @routerParams()


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


    description = ''
    description += "#{mainSelectionText} - "
    description += "#{Tr.imageExportText.unit[@app.language]}: #{unitText} - "
    description += "#{provinceText}"

    description



module.exports = Visualization4Configuration