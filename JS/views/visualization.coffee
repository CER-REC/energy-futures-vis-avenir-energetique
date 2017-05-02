d3 = require 'd3'
Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'

class visualization

  constructor: (config) ->
    @config = config
    @_chart = null
    @_provinceMenu = null

  tearDown: ->
    # TODO: Consider garbage collection and event listeners
    @app.window.document.getElementById('visualizationContent').innerHTML = ''

  datasetSelectionData: ->
    jan2016 =
      label: Tr.datasetSelector.jan2016Button[@app.language]
      dataset: 'jan2016'
      title: Tr.selectorTooltip.datasetSelector.jan2016[@app.language]
      class: if @config.dataset == 'jan2016' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.dataset == 'jan2016' then Tr.altText.dataset.jan2016Selected[@app.language] else Tr.altText.dataset.jan2016Unselected[@app.language]
    oct2016 =
      label: Tr.datasetSelector.oct2016Button[@app.language]
      dataset: 'oct2016'
      title: Tr.selectorTooltip.datasetSelector.oct2016[@app.language]
      class: if @config.dataset == 'oct2016' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.dataset == 'oct2016' then Tr.altText.dataset.oct2016Selected[@app.language] else Tr.altText.dataset.oct2016Unselected[@app.language]

    [oct2016, jan2016]

  unitSelectionData: ->
    petajoules =
      label: Tr.unitSelector.petajoulesButton[@app.language]
      title: Tr.selectorTooltip.unitSelector.petajoulesButton[@app.language]
      unitName: 'petajoules'
      class: if @config.unit == 'petajoules' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.unit == 'petajoules' then Tr.altText.unit.petajoulesSelected[@app.language] else Tr.altText.unit.petajoulesUnselected[@app.language]
    kilobarrelEquivalents =
      title: Tr.selectorTooltip.unitSelector.kilobarrelEquivalentsButton[@app.language]
      label: Tr.unitSelector.kilobarrelEquivalentsButton[@app.language]
      unitName: 'kilobarrelEquivalents'
      class: if @config.unit == 'kilobarrelEquivalents' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.unit == 'kilobarrelEquivalents' then Tr.altText.unit.kilobarrelEquivalentsSelected[@app.language] else Tr.altText.unit.kilobarrelEquivalentsUnselected[@app.language]
    gigawattHours =
      title: Tr.selectorTooltip.unitSelector.gigawattHourButton[@app.language]
      label: Tr.unitSelector.gigawattHourButton[@app.language]
      unitName: 'gigawattHours'
      class: if @config.unit == 'gigawattHours' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.unit == 'gigawattHours' then Tr.altText.unit.gigawattHoursSelected[@app.language] else Tr.altText.unit.gigawattHoursUnselected[@app.language]
    thousandCubicMetres =
      title: Tr.selectorTooltip.unitSelector.thousandCubicMetresButton[@app.language]
      label: Tr.unitSelector.thousandCubicMetresButton[@app.language]
      unitName: 'thousandCubicMetres'
      class: if @config.unit == 'thousandCubicMetres' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.unit == 'thousandCubicMetres' then Tr.altText.unit.thousandCubicMetresSelected[@app.language] else Tr.altText.unit.thousandCubicMetresUnselected[@app.language]
    millionCubicMetres =
      title: Tr.selectorTooltip.unitSelector.millionCubicMetresButton[@app.language]
      label: Tr.unitSelector.millionCubicMetresButton[@app.language]
      unitName: 'millionCubicMetres'
      class: if @config.unit == 'millionCubicMetres' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.unit == 'millionCubicMetres' then Tr.altText.unit.millionCubicMetresSelected[@app.language] else Tr.altText.unit.millionCubicMetresUnselected[@app.language]
    kilobarrels =
      title: Tr.selectorTooltip.unitSelector.kilobarrelsButton[@app.language]
      label: Tr.unitSelector.kilobarrelsButton[@app.language]
      unitName: 'kilobarrels'
      class: if @config.unit == 'kilobarrels' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.unit == 'kilobarrels' then Tr.altText.unit.kilobarrelsSelected[@app.language] else Tr.altText.unit.kilobarrelsUnselected[@app.language]
    cubicFeet =
      title: Tr.selectorTooltip.unitSelector.cubicFeetButton[@app.language]
      label: Tr.unitSelector.cubicFeetButton[@app.language]
      unitName: 'cubicFeet'
      class: if @config.unit == 'cubicFeet' then 'vizButton selected' else 'vizButton'
      ariaLabel: if @config.unit == 'cubicFeet' then Tr.altText.unit.cubicFeetSelected[@app.language] else Tr.altText.unit.cubicFeetUnselected[@app.language]

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
      title: Tr.selectorTooltip.scenarioSelector.referenceButton[@app.language]
      label: Tr.scenarioSelector.referenceButton[@app.language]
      scenarioName: 'reference'
      class:
        if @config.scenario == 'reference'
          'vizButton selected'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'reference'
          'vizButton'
        else
          'vizButton disabled'
      ariaLabel: if @config.scenario == 'reference' then Tr.altText.scenario.referenceSelected[@app.language] else Tr.altText.scenario.referenceUnselected[@app.language]
    constrained =
      title: Tr.selectorTooltip.scenarioSelector.constrainedButton[@app.language]
      label: Tr.scenarioSelector.constrainedButton[@app.language]
      scenarioName: 'constrained'
      class:
        if @config.scenario == 'constrained'
          'vizButton selected'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'constrained'
          'vizButton'
        else
          'vizButton disabled'
      ariaLabel: if @config.scenario == 'constrained' then Tr.altText.scenario.constrainedSelected[@app.language] else Tr.altText.scenario.constrainedUnselected[@app.language]
    high =
      title: Tr.selectorTooltip.scenarioSelector.highPriceButton[@app.language]
      label: Tr.scenarioSelector.highPriceButton[@app.language]
      scenarioName: 'high'
      class:
        if @config.scenario == 'high'
          'vizButton selected'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'high'
          'vizButton'
        else
          'vizButton disabled'
      ariaLabel: if @config.scenario == 'high' then Tr.altText.scenario.highSelected[@app.language] else Tr.altText.scenario.highUnselected[@app.language]
    low =
      title: Tr.selectorTooltip.scenarioSelector.lowPriceButton[@app.language]
      label: Tr.scenarioSelector.lowPriceButton[@app.language]
      scenarioName: 'low'
      class:
        if @config.scenario == 'low'
          'vizButton selected'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'low'
          'vizButton'
        else
          'vizButton disabled'
      ariaLabel: if @config.scenario == 'low' then Tr.altText.scenario.lowSelected[@app.language] else Tr.altText.scenario.lowUnselected[@app.language]
    highLng =
      title: Tr.selectorTooltip.scenarioSelector.highLngButton[@app.language]
      label: Tr.scenarioSelector.highLngButton[@app.language]
      scenarioName: 'highLng'
      class:
        if @config.scenario == 'highLng'
          'vizButton selected'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'highLng'
          'vizButton'
        else
          'vizButton disabled'
      ariaLabel: if @config.scenario == 'highLng' then Tr.altText.scenario.highLngSelected[@app.language] else Tr.altText.scenario.highLngUnselected[@app.language]
    noLng =
      title: Tr.selectorTooltip.scenarioSelector.noLngButton[@app.language]
      label: Tr.scenarioSelector.noLngButton[@app.language]
      scenarioName: 'noLng'
      class:
        if @config.scenario == 'noLng'
          'vizButton selected'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'noLng'
          'vizButton'
        else
          'vizButton disabled'
      ariaLabel: if @config.scenario == 'noLng' then Tr.altText.scenario.noLngSelected[@app.language] else Tr.altText.scenario.noLngUnselected[@app.language]

    switch @config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        if @config.dataset == 'jan2016'
          [reference, constrained, high, low, highLng, noLng]
        else
          [reference, high, low]
      when 'oilProduction'
        if @config.dataset == 'jan2016'
          [reference, constrained, high, low]
        else
          [reference, high, low]
      when 'gasProduction'
        if @config.dataset == 'jan2016'
          [reference, high, low, highLng, noLng]
        else
          [reference, high, low]

  sectorSelectionData: ->
    [
      {
        label: Tr.sectorSelector.totalSectorDemandButton[@app.language]
        title: Tr.selectorTooltip.sectorSelector.totalDemandButton[@app.language]
        sectorName: 'total'
        wrapperClass: 'sectorSelectorButton totalSectorButton'
        buttonClass: if @config.sector == 'total' then 'vizButton selected' else 'vizButton'
        ariaLabel: if @config.sector == 'total' then Tr.altText.sectors.totalSelected[@app.language] else Tr.altText.sectors.totalUnselected[@app.language]
      }
      {
        title: Tr.selectorTooltip.sectorSelector.residentialSectorButton[@app.language]
        sectorName: 'residential'
        image: if @config.sector == 'residential' then 'IMG/sector/residential_selected.svg' else 'IMG/sector/residential_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topLeftSector'
        altText: if @config.sector == 'residential' then Tr.altText.sectors.residentialSelected[@app.language] else Tr.altText.sectors.residentialUnselected[@app.language]
        buttonClass: if @config.sector == 'residential' then 'selected' else ''
      }
      {
        title: Tr.selectorTooltip.sectorSelector.commercialSectorButton[@app.language]
        sectorName: 'commercial'
        image: if @config.sector ==  'commercial' then 'IMG/sector/commercial_selected.svg' else 'IMG/sector/commercial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topRightSector'
        altText: if @config.sector == 'commercial' then Tr.altText.sectors.commercialSelected[@app.language] else Tr.altText.sectors.commercialUnselected[@app.language]
        buttonClass: if @config.sector == 'commercial' then 'selected' else ''
      }
      {
        title: Tr.selectorTooltip.sectorSelector.industrialSectorButton[@app.language]
        sectorName: 'industrial'
        image: if @config.sector == 'industrial' then 'IMG/sector/industrial_selected.svg' else 'IMG/sector/industrial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomLeftSector'
        altText: if @config.sector == 'industrial' then Tr.altText.sectors.industrialSelected[@app.language] else Tr.altText.sectors.industrialUnselected[@app.language]
        buttonClass: if @config.sector == 'industrial' then 'selected' else ''
      }
      {
        title: Tr.selectorTooltip.sectorSelector.transportSectorButton[@app.language]
        sectorName: 'transportation'
        image: if @config.sector ==  'transportation' then 'IMG/sector/transport_selected.svg' else 'IMG/sector/transport_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomRightSector'
        altText: if @config.sector == 'transportation' then Tr.altText.sectors.transportationSelected[@app.language] else Tr.altText.sectors.transportationUnselected[@app.language]
        buttonClass: if @config.sector == 'transportation' then 'selected' else ''
      }
    ]

  mainSelectionData: ->
    [
      {
        title: Tr.selectorTooltip.mainSelector.totalDemandButton[@app.language]
        label: Tr.mainSelector.totalDemandButton[@app.language]
        image: if @config.mainSelection == 'energyDemand' then 'IMG/main_selection/totalDemand_selected.png' else 'IMG/main_selection/totalDemand_unselected.png'
        selectorName: 'energyDemand'
        altText: if @config.mainSelection == 'energyDemand' then Tr.altText.totalDemand_selected[@app.language] else Tr.altText.totalDemand_unselected[@app.language]
      }
      {
        title: Tr.selectorTooltip.mainSelector.electricityGenerationButton[@app.language]
        label: Tr.mainSelector.electricityGenerationButton[@app.language]
        image: if @config.mainSelection == 'electricityGeneration' then 'IMG/main_selection/electricity_selected.png' else 'IMG/main_selection/electricity_unselected.png'
        selectorName: 'electricityGeneration'
        altText: if @config.mainSelection == 'electricityGeneration' then Tr.altText.electricity_selected[@app.language] else Tr.altText.electricity_unselected[@app.language]
      }
      {
        title: Tr.selectorTooltip.mainSelector.oilProductionButton[@app.language]
        label: Tr.mainSelector.oilProductionButton[@app.language]
        image: if @config.mainSelection == 'oilProduction' then 'IMG/main_selection/oil_selected.png' else 'IMG/main_selection/oil_unselected.png'
        selectorName: 'oilProduction'
        altText: if @config.mainSelection == 'oilProduction' then Tr.altText.oil_selected[@app.language] else Tr.altText.oil_unselected[@app.language]
      }
      {
        title: Tr.selectorTooltip.mainSelector.gasProductionButton[@app.language]
        label: Tr.mainSelector.gasProductionButton[@app.language]
        image: if @config.mainSelection == 'gasProduction' then 'IMG/main_selection/gas_selected.png' else 'IMG/main_selection/gas_unselected.png'
        selectorName: 'gasProduction'
        altText: if @config.mainSelection == 'gasProduction' then Tr.altText.gas_selected[@app.language] else Tr.altText.gas_unselected[@app.language]
      }
    ]
    
  addDatasetToggle: ->
    if @config.dataset?
      datasetSelectors = d3.select(@app.window.document).select('#datasetSelector')
        .selectAll('.datasetSelectorButton')
        .data(@datasetSelectionData())

      datasetSelectors.enter()
        .append('div')
        .attr
          class: 'datasetSelectorButton'
        .on 'click', (d) =>
          return if @config.dataset == d.dataset

          newConfig = new @config.constructor @app
          newConfig.copy @config
          newConfig.setDataset d.dataset
          newConfig.setScenario @config.scenario

          update = =>
            @config.setDataset d.dataset

            # Check if the current scenario is valid for the new dataset
            # and update the list of supported scenarios.
            @config.setScenario @config.scenario

            @addScenarios()
            @addDatasetToggle()

            @getDataAndRender()
            if @buildYAxis? then @buildYAxis()
            @app.router.navigate @config.routerParams()

          @app.datasetRequester.updateAndRequestIfRequired newConfig, update




      datasetSelectors.html (d) ->
        "<button class='#{d.class}' type='button' title='#{d.title}' aria-label='#{d.ariaLabel}'>#{d.label}</button>"

      datasetSelectors.exit().remove()

  addUnitToggle: ->
    if @config.unit?
      unitsSelectors = d3.select(@app.window.document).select('#unitsSelector')
        .selectAll('.unitSelectorButton')
        .data(@unitSelectionData())
      
      unitsSelectors.enter()
        .append('div')
        .attr
          class: 'unitSelectorButton'
        .on 'click', (d) =>
          return if @config.unit == d.unitName

          newConfig = new @config.constructor @app
          newConfig.copy @config
          newConfig.setUnit d.unitName

          update = =>
            @config.setUnit d.unitName
            # TODO: For efficiency, only rerender what's necessary.
            @addUnitToggle()
            @getDataAndRender()
            if @buildYAxis? then @buildYAxis()
            @app.router.navigate @config.routerParams()

          @app.datasetRequester.updateAndRequestIfRequired newConfig, update


      unitsSelectors.html (d) ->
        "<button class='#{d.class}' type='button' title='#{d.title}' aria-label='#{d.ariaLabel}'>#{d.label}</button>"

      unitsSelectors.exit().remove()

  addScenarios: ->
    if @config.scenario?
      scenariosSelectors = d3.select(@app.window.document).select('#scenariosSelector')
        .selectAll('.scenarioSelectorButton')
        .data(@scenariosSelectionData())
      
      scenariosSelectors.enter()
        .append('div')
        .attr
          class: 'scenarioSelectorButton'
        .on 'click', (d) =>
          return if @config.scenario == d.scenarioName && Constants.datasetDefinitions[@config.dataset].scenarios.includes d.scenarioName

          newConfig = new @config.constructor @app
          newConfig.copy @config
          newConfig.setScenario d.scenarioName

          update = =>
            @config.setScenario d.scenarioName
            # TODO: For efficiency, only rerender what's necessary.
            @addDatasetToggle()
            @addScenarios()
            @getDataAndRender()
            @app.router.navigate @config.routerParams()

          @app.datasetRequester.updateAndRequestIfRequired newConfig, update



      scenariosSelectors.html (d) ->
        indexOfDisabled = d.class.indexOf 'disabled'
        spanClass = 'disabled'
        if indexOfDisabled < 0 then spanClass = ''
        "<button class='#{d.class}' type='button' title='#{d.title}'><span class='#{spanClass}' aria-label='#{d.ariaLabel}'>#{d.label}</span></button>"

      scenariosSelectors.exit().remove()



  addSectors: ->

    sectorsCallback = (d) =>
      return if @config.sector == d.sectorName

      newConfig = new @config.constructor @app
      newConfig.copy @config
      newConfig.setSector d.sectorName

      update = =>
        @config.setSector d.sectorName
        @addSectors()
        @getDataAndRender()
        @app.router.navigate @config.routerParams()
        @app.window.document.querySelector('#sectorsSelector .selected').focus()

      @app.datasetRequester.updateAndRequestIfRequired newConfig, update

    if @config.sector?
      sectorsSelectors = d3.select(@app.window.document)
        .select '#sectorsSelector'
        .selectAll '.sectorSelectorButton'
        .data @sectorSelectionData()
      
      sectorsSelectors.enter()
        .append 'div'
        .attr
          class: (d) -> d.wrapperClass
        .on 'click', sectorsCallback
        .on 'keyup', (d) ->
          sectorsCallback d if d3.event.key == 'Enter'



      sectorsSelectors.html (d) ->
        if d.sectorName == 'total'
          "<button class='#{d.buttonClass}' type='button' title='#{d.title}' aria-label='#{d.ariaLabel}'>#{d.label}</button>"
        else
          "<img src=#{d.image} title='#{d.title}' alt='#{d.altText}' tabindex='0' aria-label='#{d.altText}' role='button' class='#{d.buttonClass}'>"

      sectorsSelectors.exit().remove()
  
  addMainSelector: ->

    mainSelectorCallback = (d) =>
      return if @config.mainSelection == d.selectorName

      newConfig = new @config.constructor @app
      newConfig.copy @config
      newConfig.setMainSelection d.selectorName

      update = =>
        @config.setMainSelection d.selectorName
        # TODO: For efficiency, only rerender what's necessary.
        @addDatasetToggle()
        @addMainSelector()
        @addUnitToggle()
        @addScenarios()
        @getDataAndRender()
        @app.router.navigate @config.routerParams()

      @app.datasetRequester.updateAndRequestIfRequired newConfig, update

    mainSelectors = d3.select(@app.window.document).select('#mainSelector')
      .selectAll('.mainSelectorButton')
      .data(@mainSelectionData())

    mainSelectors.enter()
      .append('div')
      .attr
        class: 'mainSelectorButton'
        tabindex: '0'
        role: 'button'
      .on 'click', mainSelectorCallback
      .on 'keyup', (d) ->
        mainSelectorCallback d if d3.event.key == 'Enter'

    mainSelectors
      .attr
        'aria-label': (d) -> d.altText

    mainSelectors.html (d) ->
      "<img src=#{d.image} class='mainSelectorImage' title='#{d.title}' alt='#{d.altText}'>
       <span class='mainSelectorLabel' title='#{d.title}'>#{d.label}</span>"

    mainSelectors.exit().remove()


module.exports = visualization