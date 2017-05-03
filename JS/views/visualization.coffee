d3 = require 'd3'
Tr = require '../TranslationTable.coffee'
Constants = require '../Constants.coffee'
CommonControls = require './CommonControls.coffee'

class Visualization

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

  addDatasetToggle: ->
    if @config.dataset?
      datasetSelectors = d3.select(@app.window.document).select('#datasetSelector')
        .selectAll('.datasetSelectorButton')
        .data CommonControls.datasetSelectionData(@config, @app)

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
        .data CommonControls.unitSelectionData(@config, @app)
      
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
        .data CommonControls.scenariosSelectionData(@config, @app)
      
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
        "<button class='#{d.singleSelectClass}' type='button' title='#{d.title}'>
          <span aria-label='#{d.ariaLabel}'>#{d.label}</span>
        </button>"

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
      .data CommonControls.mainSelectionData(@config, @app)

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


module.exports = Visualization