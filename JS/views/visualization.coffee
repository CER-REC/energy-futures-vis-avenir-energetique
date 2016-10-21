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
      title: Tr.selectorTooltip.unitSelector.petajoulesButton[app.language]
      unitName: 'petajoules'
      class: if @config.unit == 'petajoules' then 'vizButton selected' else 'vizButton'
    kilobarrelEquivalents = 
      title: Tr.selectorTooltip.unitSelector.kilobarrelEquivalentsButton[app.language]
      label: Tr.unitSelector.kilobarrelEquivalentsButton[app.language]
      unitName: 'kilobarrelEquivalents'
      class: if @config.unit == 'kilobarrelEquivalents' then 'vizButton selected' else 'vizButton'
    gigawattHours = 
      title: Tr.selectorTooltip.unitSelector.gigawattHourButton[app.language]
      label: Tr.unitSelector.gigawattHourButton[app.language]
      unitName: 'gigawattHours'
      class: if @config.unit == 'gigawattHours' then 'vizButton selected' else 'vizButton'
    thousandCubicMetres = 
      title: Tr.selectorTooltip.unitSelector.thousandCubicMetresButton[app.language]
      label: Tr.unitSelector.thousandCubicMetresButton[app.language]
      unitName: 'thousandCubicMetres'
      class: if @config.unit == 'thousandCubicMetres' then 'vizButton selected' else 'vizButton'
    millionCubicMetres = 
      title: Tr.selectorTooltip.unitSelector.millionCubicMetresButton[app.language]
      label: Tr.unitSelector.millionCubicMetresButton[app.language]
      unitName: 'millionCubicMetres'
      class: if @config.unit == 'millionCubicMetres' then 'vizButton selected' else 'vizButton'
    kilobarrels = 
      title: Tr.selectorTooltip.unitSelector.kilobarrelsButton[app.language]
      label: Tr.unitSelector.kilobarrelsButton[app.language]
      unitName: 'kilobarrels'
      class: if @config.unit == 'kilobarrels' then 'vizButton selected' else 'vizButton'
    cubicFeet  = 
      title: Tr.selectorTooltip.unitSelector.cubicFeetButton[app.language]
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
      title: Tr.selectorTooltip.scenarioSelector.referenceButton[app.language]
      label: Tr.scenarioSelector.referenceButton[app.language]
      scenarioName: 'reference'
      class: if @config.scenario == 'reference' then 'vizButton selected' else 'vizButton'
    # constrained = 
    #   title: Tr.selectorTooltip.scenarioSelector.constrainedButton[app.language]
    #   label: Tr.scenarioSelector.constrainedButton[app.language]
    #   scenarioName: 'constrained'
    #   class: if @config.scenario == 'constrained' then 'vizButton selected' else 'vizButton'
    high = 
      title: Tr.selectorTooltip.scenarioSelector.highPriceButton[app.language]
      label: Tr.scenarioSelector.highPriceButton[app.language]
      scenarioName: 'high'
      class: if @config.scenario == 'high' then 'vizButton selected' else 'vizButton'
    low = 
      title: Tr.selectorTooltip.scenarioSelector.lowPriceButton[app.language]
      label: Tr.scenarioSelector.lowPriceButton[app.language]
      scenarioName: 'low'
      class: if @config.scenario == 'low' then 'vizButton selected' else 'vizButton'
    # highLng = 
    #   title: Tr.selectorTooltip.scenarioSelector.highLngButton[app.language]
    #   label: Tr.scenarioSelector.highLngButton[app.language]
    #   scenarioName: 'highLng'
    #   class: if @config.scenario == 'highLng' then 'vizButton selected' else 'vizButton'
    # noLng = 
    #   title: Tr.selectorTooltip.scenarioSelector.noLngButton[app.language]
    #   label: Tr.scenarioSelector.noLngButton[app.language]
    #   scenarioName: 'noLng'
    #   class: if @config.scenario == 'noLng' then 'vizButton selected' else 'vizButton'



    [reference, high, low]
    # The original data had six scenarios, the revised data currently only has three.
    # We expect this state of affairs to be temporary! 
    # switch @config.mainSelection
    #   when 'energyDemand', 'electricityGeneration'
    #     [reference, constrained, high, low, highLng, noLng]
    #   when 'oilProduction'
    #     [reference, constrained, high, low]
    #   when 'gasProduction'
    #     [reference, high, low, highLng, noLng]

  sectorSelectionData: ->
    [  
      {  
        label: Tr.sectorSelector.totalSectorDemandButton[app.language]
        sectorName: 'total'
        wrapperClass: 'sectorSelectorButton totalSectorButton'
        buttonClass: if @config.sector == 'total' then 'vizButton selected' else 'vizButton'
      }
      {
        title: Tr.selectorTooltip.sectorSelector.residentialSectorButton[app.language]  
        sectorName: 'residential'
        image: if @config.sector ==  'residential' then 'IMG/sector/residential_selected.svg' else 'IMG/sector/residential_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topLeftSector'
      }
      {
        title: Tr.selectorTooltip.sectorSelector.commercialSectorButton[app.language]
        sectorName: 'commercial'
        image: if @config.sector ==  'commercial' then 'IMG/sector/commercial_selected.svg' else 'IMG/sector/commercial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topRightSector'
      }
      {
        title: Tr.selectorTooltip.sectorSelector.industrialSectorButton[app.language]
        sectorName: 'industrial'
        image: if @config.sector == 'industrial' then 'IMG/sector/industrial_selected.svg' else 'IMG/sector/industrial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomLeftSector'
      }
      {
        title: Tr.selectorTooltip.sectorSelector.transportSectorButton[app.language]
        sectorName: 'transportation'
        image: if @config.sector ==  'transportation' then 'IMG/sector/transport_selected.svg' else 'IMG/sector/transport_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomRightSector'
      }
    ]

  mainSelectionData: ->
    [
      {
        title: Tr.selectorTooltip.mainSelector.totalDemandButton[app.language]
        label: Tr.mainSelector.totalDemandButton[app.language]
        image: if @config.mainSelection == 'energyDemand' then 'IMG/main_selection/totalDemand_selected.png' else 'IMG/main_selection/totalDemand_unselected.png'
        selectorName: 'energyDemand'
      }
      {
        title: Tr.selectorTooltip.mainSelector.electricityGenerationButton[app.language]
        label: Tr.mainSelector.electricityGenerationButton[app.language]
        image: if @config.mainSelection == 'electricityGeneration' then 'IMG/main_selection/electricity_selected.png' else 'IMG/main_selection/electricity_unselected.png'
        selectorName: 'electricityGeneration'
      }
      {
        title: Tr.selectorTooltip.mainSelector.oilProductionButton[app.language]
        label: Tr.mainSelector.oilProductionButton[app.language]
        image: if @config.mainSelection == 'oilProduction' then 'IMG/main_selection/oil_selected.png' else 'IMG/main_selection/oil_unselected.png'
        selectorName: 'oilProduction'
      }
      {
        title: Tr.selectorTooltip.mainSelector.gasProductionButton[app.language]
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
        "<button class='#{d.class}' type='button' title='#{d.title}'>#{d.label}</button>"

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
        "<button class='#{d.class}' type='button' title='#{d.title}'>#{d.label}</button>"

      scenariosSelectors.exit().remove()



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
          "<button class='#{d.buttonClass}' type='button' title='#{d.title}'>#{d.label}</button>"
        else
          "<img src=#{d.image} title='#{d.title}'>"

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
      "<img src=#{d.image} class='mainSelectorImage' title='#{d.title}'>
       <span class='mainSelectorLabel' title='#{d.title}'>#{d.label}</span>"

    mainSelectors.exit().remove()


module.exports = visualization