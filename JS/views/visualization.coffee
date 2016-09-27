d3 = require 'd3'
squareMenu = require '../charts/square-menu.coffee'
Tr = require '../TranslationTable.coffee'

class visualization

  constructor: (config) ->
    @config = config
    @_chart = null
    @_provinceMenu = null

  tearDown: ->
    # TODO: Consider garbage collection and event listeners
    document.getElementById('visualizationContent').innerHTML = ''

  unitSelectionData: ->
    petajoules = 
      label: Tr.unitSelector.petajoulesButton[app.language]
      unitName: 'petajoules'
      class: if @config.unit == 'petajoules' then 'vizButton selected' else 'vizButton'
    kilobarrelEquivalents = 
      label: Tr.unitSelector.kilobarrelEquivalentsButton[app.language]
      unitName: 'kilobarrelEquivalents'
      class: if @config.unit == 'kilobarrelEquivalents' then 'vizButton selected' else 'vizButton'
    gigawattHours = 
      label: Tr.unitSelector.gigawattHourButton[app.language]
      unitName: 'gigawattHours'
      class: if @config.unit == 'gigawattHours' then 'vizButton selected' else 'vizButton'
    thousandCubicMetres = 
      label: Tr.unitSelector.thousandCubicMetresButton[app.language]
      unitName: 'thousandCubicMetres'
      class: if @config.unit == 'thousandCubicMetres' then 'vizButton selected' else 'vizButton'
    millionCubicMetres = 
      label: Tr.unitSelector.millionCubicMetresButton[app.language]
      unitName: 'millionCubicMetres'
      class: if @config.unit == 'millionCubicMetres' then 'vizButton selected' else 'vizButton'
    kilobarrels = 
      label: Tr.unitSelector.kilobarrelsButton[app.language]
      unitName: 'kilobarrels'
      class: if @config.unit == 'kilobarrels' then 'vizButton selected' else 'vizButton'
    cubicFeet  = 
      label: Tr.unitSelector.cubicFeetButton[app.language]
      unitName: 'cubicFeet'
      class: if @config.unit == 'cubicFeet' then 'vizButton selected' else 'vizButton'

    switch @config.mainSelection
      when 'energyDemand'
        [petajoules, kilobarrelEquivalents]
      when 'electricityGeneration'
        [petajoules, gigawattHours, kilobarrelEquivalents]
      when 'oilProduction'
        [kilobarrels, thousandCubicMetres]
      when 'gasProduction'
        [cubicFeet, millionCubicMetres]

  scenariosSelectionData: ->
    reference = 
      label: Tr.scenarioSelector.referenceButton[app.language]
      scenarioName: 'reference'
      class: if @config.scenario == 'reference' then 'vizButton selected' else 'vizButton'
    constrained = 
      label: Tr.scenarioSelector.constrainedButton[app.language]
      scenarioName: 'constrained'
      class: if @config.scenario == 'constrained' then 'vizButton selected' else 'vizButton'
    high = 
      label: Tr.scenarioSelector.highPriceButton[app.language]
      scenarioName: 'high'
      class: if @config.scenario == 'high' then 'vizButton selected' else 'vizButton'
    low = 
      label: Tr.scenarioSelector.lowPriceButton[app.language]
      scenarioName: 'low'
      class: if @config.scenario == 'low' then 'vizButton selected' else 'vizButton'
    highLng = 
      label: Tr.scenarioSelector.highLngButton[app.language]
      scenarioName: 'highLng'
      class: if @config.scenario == 'highLng' then 'vizButton selected' else 'vizButton'
    noLng = 
      label: Tr.scenarioSelector.noLngButton[app.language]
      scenarioName: 'noLng'
      class: if @config.scenario == 'noLng' then 'vizButton selected' else 'vizButton'

    switch @config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        [reference, constrained, high, low, highLng, noLng]
      when 'oilProduction'
        [reference, constrained, high, low]
      when 'gasProduction'
        [reference, high, low, highLng, noLng]

  sectorSelectionData: ->
    [  
      {  
        label: Tr.sectorSelector.totalSectorDemandButton[app.language]
        sectorName: 'total'
        wrapperClass: 'sectorSelectorButton totalSectorButton'
        buttonClass: if @config.sector == 'total' then 'vizButton selected' else 'vizButton'
      }
      {  
        sectorName: 'residential'
        image: if @config.sector ==  'residential' then 'IMG/sector/residential_selected.svg' else 'IMG/sector/residential_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topLeftSector'
      }
      {
        sectorName: 'commercial'
        image: if @config.sector ==  'commercial' then 'IMG/sector/commercial_selected.svg' else 'IMG/sector/commercial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topRightSector'
      }
      {
        sectorName: 'industrial'
        image: if @config.sector == 'industrial' then 'IMG/sector/industrial_selected.svg' else 'IMG/sector/industrial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomLeftSector'
      }
      {
        sectorName: 'transportation'
        image: if @config.sector ==  'transportation' then 'IMG/sector/transport_selected.svg' else 'IMG/sector/transport_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomRightSector'
      }
    ]

  mainSelectionData: ->
    [
      {
        label: Tr.mainSelector.totalDemandButton[app.language]
        image: if @config.mainSelection == 'energyDemand' then 'IMG/main_selection/totalDemand_selected.png' else 'IMG/main_selection/totalDemand_unselected.png'
        selectorName: 'energyDemand'
      }
      {
        label: Tr.mainSelector.electricityGenerationButton[app.language]
        image: if @config.mainSelection == 'electricityGeneration' then 'IMG/main_selection/electricity_selected.png' else 'IMG/main_selection/electricity_unselected.png'
        selectorName: 'electricityGeneration'
      }
      {
        label: Tr.mainSelector.oilProductionButton[app.language]
        image: if @config.mainSelection == 'oilProduction' then 'IMG/main_selection/oil_selected.png' else 'IMG/main_selection/oil_unselected.png'
        selectorName: 'oilProduction'
      }
      {
        label: Tr.mainSelector.gasProductionButton[app.language]
        image: if @config.mainSelection == 'gasProduction' then 'IMG/main_selection/gas_selected.png' else 'IMG/main_selection/gas_unselected.png'
        selectorName: 'gasProduction'
      }
    ]

  addUnitToggle: ->
    if @config.unit?  
      unitsSelectors = d3.select('#unitsSelector')
        .selectAll('.unitSelectorButton')
        .data(@unitSelectionData())
      
      unitsSelectors.enter()
        .append('div')
        .attr
          class: 'unitSelectorButton'
        .on 'click', (d) =>
          if @config.unit != d.unitName  
            @config.setUnit d.unitName
            # TODO: For efficiency, only rerender what's necessary.
            @addUnitToggle(@unitSelectionData())
            @getData()
            if @buildYAxis? then @buildYAxis()

      unitsSelectors.html (d) ->
        "<button class='#{d.class}' type='button'>#{d.label}</button>"

      unitsSelectors.exit().remove()

  addScenarios: ->
    if @config.scenario?  
      scenariosSelectors = d3.select('#scenariosSelector')
        .selectAll('.scenarioSelectorButton')
        .data(@scenariosSelectionData())
      
      scenariosSelectors.enter()
        .append('div')
        .attr
          class: 'scenarioSelectorButton'
        .on 'click', (d) =>
          if @config.scenario != d.scenarioName    
            @config.setScenario d.scenarioName

            # TODO: For efficiency, only rerender what's necessary.
            @addScenarios()
            @getData()


      scenariosSelectors.html (d) ->
        "<button class='#{d.class}' type='button'>#{d.label}</button>"

      scenariosSelectors.exit().remove()

  # unused  
  # enableOptions: () ->
  #   d3.selectAll('.sectorButton, .scenarioButton')
  #     .classed("disabled", false)

  addSectors: ->
    if @config.sector?  
      sectorsSelectors = d3.select('#sectorsSelector')
        .selectAll('.sectorSelectorButton')
        .data(@sectorSelectionData())
      
      sectorsSelectors.enter()
        .append('div')
        .attr
          class: (d) -> d.wrapperClass
        .on 'click', (d) =>
          if @config.sector != d.sectorName  
            @config.setSector d.sectorName
            @addSectors()
            @getData()

      sectorsSelectors.html (d) ->
        if d.sectorName == 'total'
          "<button class='#{d.buttonClass}' type='button'>#{d.label}</button>"          
        else
          "<img src=#{d.image}>"

      sectorsSelectors.exit().remove()
  
  addMainSelector: ->
    mainSelectors = d3.select('#mainSelector')
      .selectAll('.mainSelectorButton')
      .data(@mainSelectionData())

    mainSelectors.enter()
      .append('div')
      .attr
        class: 'mainSelectorButton'
      .on 'click', (d) =>
        if @config.mainSelection != d.selectorName  
          @config.setMainSelection d.selectorName
          # TODO: For efficiency, only rerender what's necessary.
          @addMainSelector()
          @addUnitToggle()
          @addScenarios()
          @getData()

    mainSelectors.html (d) ->
      "<img src=#{d.image} class='mainSelectorImage'>
       <span class='mainSelectorLabel'>#{d.label}</span>"

    mainSelectors.exit().remove()


module.exports = visualization