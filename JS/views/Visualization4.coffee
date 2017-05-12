d3 = require 'd3'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
SquareMenu = require '../charts/SquareMenu.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'
CommonControls = require './CommonControls.coffee'

if Platform.name == 'browser'
  Visualization4Template = require '../templates/Visualization4.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'


class Visualization4

  renderBrowserTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render Visualization4Template,
      selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
      selectOneLabel: Tr.mainSelector.selectOneLabel[@app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[@app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate

      altText:
        mainSelectionHelp: Tr.altText.mainSelectionHelp[@app.language]
        unitsHelp: Tr.altText.unitsHelp[@app.language]
        datasetsHelp: Tr.altText.datasetsHelp[@app.language]
        scenariosHelp: Tr.altText.scenariosHelp[@app.language]

    @datasetHelpPopover = new ControlsHelpPopover @app
    @mainSelectorHelpPopover = new ControlsHelpPopover @app
    @unitsHelpPopover = new ControlsHelpPopover @app
    @scenariosHelpPopover = new ControlsHelpPopover @app
    @provincesHelpPopover = new ControlsHelpPopover @app

    @d3document.select '#datasetSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @datasetHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @datasetHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover datasetSelectorHelp'
            innerClasses: 'viz4HelpTitle'
            title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
            content: Tr.datasetSelector.datasetSelectorHelp[@app.language]
            attachmentSelector: '.datasetSelectorGroup'
            elementToFocusOnClose: @document.getElementById('datasetSelectorHelpButton')
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz4 dataset help'

    @d3document.select '#mainSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @mainSelectorHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @mainSelectorHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover mainSelectorHelp'
            innerClasses: 'viz4HelpTitle'
            title: Tr.mainSelector.selectOneLabel[@app.language]
            content: Tr.mainSelector.mainSelectorHelp[@app.language]
            attachmentSelector: '.mainSelectorSection'
            elementToFocusOnClose: @document.getElementById('mainSelectorHelpButton')
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz4 main selection help'
    
    @d3document.select '#unitSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @unitsHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @unitsHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover unitSelectorHelp'
            innerClasses: 'viz4HelpTitle'
            title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
            content: Tr.unitSelector.unitSelectorHelp[@app.language]
            attachmentSelector: '.unitsSelectorGroup'
            elementToFocusOnClose: @document.getElementById('unitSelectorHelpButton')
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz4 unit help'

    @d3document.select '#scenarioSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @scenariosHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @scenariosHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover scenarioSelectorHelp'
            innerClasses: 'viz4HelpTitle'
            title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
            content: Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
            attachmentSelector: '.scenarioSelectorGroup'
            elementToFocusOnClose: @document.getElementById('scenarioSelectorHelpButton')
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz4 scenario help'


  renderServerTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render @options.template,
      svgStylesheet: @options.svgTemplate
      title: Tr.visualization4Titles[@config.mainSelection][@app.language]
      description: @config.imageExportDescription()
      energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
      bitlyLink: @app.bitlyLink
      legendContent: @scenarioLegendData()




  constructor: (@app, config, @options) ->
    @config = config
    @outerHeight = 700
    @margin =
      top: 20
      right: 70
      bottom: 50
      left: 10
    @document = @app.window.document
    @d3document = d3.select @document


    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @tooltip = @document.getElementById 'tooltip'
    @tooltipParent = @document.getElementById 'wideVisualizationPanel'
    @graphPanel = @document.getElementById 'graphPanel'

    @render()
    @redraw()


  redraw: ->
    @d3document.select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    @renderXAxis false
    @renderYAxis false
    @renderGraph() # This call used to pass in 0 for duration. Why?
    @provinceMenu.size
      w: @d3document.select('#provincesSelector').node().getBoundingClientRect().width
      h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height + @d3document.select('#xAxis').node().getBoundingClientRect().height




  # Province menu stuff
  dataForProvinceMenu: ->
    [
      {
        key: 'AB'
        tooltip: Tr.regionSelector.names.AB[@app.language]
        present: true
        colour: if @config.province == 'AB' then '#333' else '#fff'
        img:
          if @config.province == 'AB'
            'IMG/provinces/radio/AB_SelectedR.svg'
          else
            'IMG/provinces/radio/AB_UnselectedR.svg'
      }
      {
        key: 'BC'
        tooltip: Tr.regionSelector.names.BC[@app.language]
        present: true
        colour: if @config.province == 'BC' then '#333' else '#fff'
        img:
          if @config.province == 'BC'
            'IMG/provinces/radio/BC_SelectedR.svg'
          else
            'IMG/provinces/radio/BC_UnselectedR.svg'
      }
      {
        key: 'MB'
        tooltip: Tr.regionSelector.names.MB[@app.language]
        present: true
        colour: if @config.province == 'MB' then '#333' else '#fff'
        img:
          if @config.province == 'MB'
            'IMG/provinces/radio/MB_SelectedR.svg'
          else
            'IMG/provinces/radio/MB_UnselectedR.svg'
      }
      {
        key: 'NB'
        tooltip: Tr.regionSelector.names.NB[@app.language]
        present: true
        colour: if @config.province == 'NB' then '#333' else '#fff'
        img:
          if @config.province == 'NB'
            'IMG/provinces/radio/NB_SelectedR.svg'
          else
            'IMG/provinces/radio/NB_UnselectedR.svg'
      }
      {
        key : 'NL'
        tooltip: Tr.regionSelector.names.NL[@app.language]
        present: true
        colour: if @config.province == 'NL' then '#333' else '#fff'
        img:
          if @config.province == 'NL'
            'IMG/provinces/radio/NL_SelectedR.svg'
          else
            'IMG/provinces/radio/NL_UnselectedR.svg'
      }
      {
        key: 'NS'
        tooltip: Tr.regionSelector.names.NS[@app.language]
        present: true
        colour: if @config.province == 'NS' then '#333' else '#fff'
        img:
          if @config.province == 'NS'
            'IMG/provinces/radio/NS_SelectedR.svg'
          else
            'IMG/provinces/radio/NS_UnselectedR.svg'
      }
      {
        key: 'NT'
        tooltip: Tr.regionSelector.names.NT[@app.language]
        present: true
        colour: if @config.province == 'NT' then '#333' else '#fff'
        img:
          if @config.province == 'NT'
            'IMG/provinces/radio/NT_SelectedR.svg'
          else
            'IMG/provinces/radio/NT_UnselectedR.svg'
      }
      {
        key: 'NU'
        tooltip: Tr.regionSelector.names.NU[@app.language]
        present: true
        colour: if @config.province == 'NU' then '#333' else '#fff'
        img:
          if @config.province == 'NU'
            'IMG/provinces/radio/NU_SelectedR.svg'
          else
            'IMG/provinces/radio/NU_UnselectedR.svg'
      }
      {
        key: 'ON'
        tooltip: Tr.regionSelector.names.ON[@app.language]
        present: true
        colour: if @config.province == 'ON' then '#333' else '#fff'
        img:
          if @config.province == 'ON'
            'IMG/provinces/radio/ON_SelectedR.svg'
          else
            'IMG/provinces/radio/ON_UnselectedR.svg'
      }
      {
        key: 'PE'
        tooltip: Tr.regionSelector.names.PE[@app.language]
        present: true
        colour: if @config.province == 'PE' then '#333' else '#fff'
        img:
          if @config.province == 'PE'
            'IMG/provinces/radio/PEI_SelectedR.svg'
          else
            'IMG/provinces/radio/PEI_UnselectedR.svg'
      }
      {
        key: 'QC'
        tooltip: Tr.regionSelector.names.QC[@app.language]
        present: true
        colour: if @config.province == 'QC' then '#333' else '#fff'
        img:
          if @config.province == 'QC'
            'IMG/provinces/radio/QC_SelectedR.svg'
          else
            'IMG/provinces/radio/QC_UnselectedR.svg'
      }
      {
        key: 'SK'
        tooltip: Tr.regionSelector.names.SK[@app.language]
        present: true
        colour: if @config.province == 'SK' then '#333' else '#fff'
        img:
          if @config.province == 'SK'
            'IMG/provinces/radio/Sask_SelectedR.svg'
          else
            'IMG/provinces/radio/Sask_UnselectedR.svg'
      }
      {
        key: 'YT'
        tooltip: Tr.regionSelector.names.YT[@app.language]
        present: true
        colour: if @config.province == 'YT' then '#333' else '#fff'
        img:
          if @config.province == 'YT'
            'IMG/provinces/radio/Yukon_SelectedR.svg'
          else
            'IMG/provinces/radio/Yukon_UnselectedR.svg'
      }
    ]


  # Black and white non multi select menu.
  buildProvinceMenu: ->
    @d3document.select '#provinceMenuSVG'
      .attr
        width: @d3document.select('#provincesSelector').node().getBoundingClientRect().width
        height: @outerHeight

    options =
      canDrag: false
      onSelected: @provinceSelected
      groupId: 'provinceMenu'
      allSquareHandler: @selectAllProvince
      showHelpHandler: @showProvinceNames
      helpButtonLabel: Tr.altText.regionsHelp[@app.language]
      helpButtonId: 'provinceHelpButton'
      getAllIcon: =>
        if @config.province == 'all'
          Tr.allSelectorButton.all[@app.language]
        else
          Tr.allSelectorButton.none[@app.language]
      parentId: '#provinceMenuSVG'

    state =
      size:
        w: @d3document.select('#provincesSelector').node().getBoundingClientRect().width
        h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height + @d3document.select('#xAxis').node().getBoundingClientRect().height
      data: @dataForProvinceMenu()

    new SquareMenu @app, options, state

  selectAllProvince: =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince 'all'

    update = =>
      @config.setProvince 'all'
      @provinceMenu.data @dataForProvinceMenu()
      @provinceMenu.update()
      @renderYAxis()
      @renderGraph()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update


  provinceSelected: (dataDictionaryItem) =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince dataDictionaryItem.key

    update = =>
      @config.setProvince dataDictionaryItem.key
      @provinceMenu.data @dataForProvinceMenu()
      @provinceMenu.update()
      @renderYAxis()
      @renderGraph()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  showProvinceNames: =>
    d3.event.stopPropagation()
    d3.event.preventDefault()
    if @app.popoverManager.currentPopover == @provincesHelpPopover
      @app.popoverManager.closePopover()
    else
      #Grab the provinces in order for the string
      contentString = ''
      for province in @dataForProvinceMenu()
        contentString = """
          <div class="provinceLabel">
            <h2> #{Tr.regionSelector.names[province.key][@app.language]} </h2>
          </div>
          #{contentString}
        """

      @app.popoverManager.showPopover @provincesHelpPopover,
        outerClasses: 'vizModal controlsHelpPopover popOverSm provinceHelp'
        title: Tr.regionSelector.selectRegionLabel[@app.language]
        content: contentString
        attachmentSelector: '#provincesSelector'
        elementToFocusOnClose: @document.getElementById('provinceHelpButton')
      @app.analyticsReporter.reportEvent 'Controls help', 'Viz4 region help'



  # Data here
  # TODO: merge graphdata and graphscenario data, its dumb =/

  scenarioLegendData: ->
    baseData =
      reference:
        label: Tr.scenarioSelector.referenceButton[@app.language]
        class: 'reference'
      high:
        label: Tr.scenarioSelector.highPriceButton[@app.language]
        class: 'high'
      highLng:
        label: Tr.scenarioSelector.highLngButton[@app.language]
        class: 'highLng'
      constrained:
        label: Tr.scenarioSelector.constrainedButton[@app.language]
        class: 'constrained'
      low:
        label: Tr.scenarioSelector.lowPriceButton[@app.language]
        class: 'low'
      noLng:
        label: Tr.scenarioSelector.noLngButton[@app.language]
        class: 'noLng'


    availableScenarios = switch @config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        ['reference', 'high', 'highLng', 'constrained', 'low', 'noLng']
      when 'oilProduction'
        ['reference', 'high', 'constrained', 'low']
      when 'gasProduction'
        ['reference', 'high', 'highLng', 'low', 'noLng']

    data = []

    for scenarioName in availableScenarios
      data.push baseData[scenarioName] if @config.scenarios.includes scenarioName
    data





  graphData: ->
    switch @config.mainSelection
      when 'energyDemand'
        @app.providers[@config.dataset]
          .energyConsumptionProvider
          .dataForViz4 @config
      when 'electricityGeneration'
        @app.providers[@config.dataset]
          .electricityProductionProvider
          .dataForViz4 @config
      when 'oilProduction'
        @app.providers[@config.dataset]
          .oilProductionProvider
          .dataForViz4 @config
      when 'gasProduction'
        @app.providers[@config.dataset]
          .gasProductionProvider
          .dataForViz4 @config

  yAxisData: ->
    switch @config.mainSelection
      when 'energyDemand'
        @app.providers[@config.dataset]
          .energyConsumptionProvider
          .dataForAllViz4Scenarios @config
      when 'electricityGeneration'
        @app.providers[@config.dataset]
          .electricityProductionProvider
          .dataForAllViz4Scenarios @config
      when 'oilProduction'
        @app.providers[@config.dataset]
          .oilProductionProvider
          .dataForAllViz4Scenarios @config
      when 'gasProduction'
        @app.providers[@config.dataset]
          .gasProductionProvider
          .dataForAllViz4Scenarios @config

  gradientData: ->
    [
      {
        key: 'reference'
        colour: '#999999'
      }
      {
        key: 'high'
        colour: '#0C2C84'
      }
      {
        key: 'highLng'
        colour: '#225EA8'
      }
      {
        key: 'constrained'
        colour: '#41B6C4'
      }
      {
        key: 'low'
        colour: '#7FCDBB'
      }
      {
        key: 'noLng'
        colour: '#C7E9B4'
      }
    ]
    

  graphScenarioData: ->
    reference =
      tooltip: Tr.selectorTooltip.scenarioSelector.referenceButton[@app.language]
      key: 'reference'
      colour: '#999999'
    high =
      tooltip: Tr.selectorTooltip.scenarioSelector.highPriceButton[@app.language]
      key: 'high'
      colour: '#0C2C84'
    highLng =
      tooltip: Tr.selectorTooltip.scenarioSelector.highLngButton[@app.language]
      key: 'highLng'
      colour: '#225EA8'
    constrained =
      tooltip: Tr.selectorTooltip.scenarioSelector.constrainedButton[@app.language]
      key: 'constrained'
      colour: '#41B6C4'
    low =
      tooltip: Tr.selectorTooltip.scenarioSelector.lowPriceButton[@app.language]
      key: 'low'
      colour: '#7FCDBB'
    noLng =
      tooltip: Tr.selectorTooltip.scenarioSelector.noLngButton[@app.language]
      key: 'noLng'
      colour: '#C7E9B4'


    switch @config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        scenariosInOrder = [reference, high, highLng, constrained, low, noLng]
      when 'oilProduction'
        scenariosInOrder = [reference, high, constrained, low]
      when 'gasProduction'
        scenariosInOrder = [reference, high, highLng, low, noLng]

    graphData = @graphData()
    currentGraphScenarioData = []
    for scenario in scenariosInOrder
      if @config.scenarios.includes scenario.key
        scenario.data = graphData[scenario.key]
        currentGraphScenarioData.push scenario
    currentGraphScenarioData
    

  # We have one series of data for each scenario to graph simultaneously, so we need
  # to know what the maximum among all of them is for the y axis
  graphDataMaximum: ->
    data = @yAxisData()
    maximums = []
    for key in Object.keys data
      maximums.push d3.max(data[key], (d) -> d.value)

    if maximums.length > 0
      d3.max maximums
    else
      0



  outerWidth: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      @d3document
        .select('#graphPanel')
        .node()
        .getBoundingClientRect()
        .width
    else if Platform.name == 'server'
      Constants.viz4ServerSideGraphWidth

  width: ->
    @outerWidth() - @margin.left - @margin.right

  height: ->
    @outerHeight - @margin.top - @margin.bottom

  xAxisScale: ->
    #TODO should the domain come from the data?
    d3.scale.linear()
      .domain [Constants.minYear, Constants.maxYear]
      .range [0, @width()]

  yAxisScale: ->
    d3.scale.linear()
      .domain [0, @graphDataMaximum()]
      .range [@height(), 0]
      .nice()

  xAxis: ->
    d3.svg.axis()
      .scale @xAxisScale()
      .tickValues [2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040]
      .tickFormat(d3.format('g'))
      .tickSize(10, 0)
      .orient 'bottom'

  xAxisGridLines: ->
    d3.svg.axis()
      .scale @xAxisScale()
      .tickValues [2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040]
      .tickFormat ''
      .tickSize -1 * @height(), 0
      .orient 'bottom'
  
  yAxis: ->
    d3.svg.axis()
      .scale @yAxisScale()
      .ticks 15
      .tickFormat(d3.format('.3s'))
      .tickSize(10, 0)
      .orient 'right'

  yAxisGridLines: ->
    d3.svg.axis()
      .scale @yAxisScale()
      .ticks 15
      .tickFormat ''
      .tickSize -1 * @width(), 0
      .orient 'right'

  # Render helpers here

  render: ->
    @d3document.select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    @d3document.select '#graphGroup'
      .attr 'transform', "translate(#{@margin.top},#{@margin.left})"
        
    @renderMainSelector()
    @renderDatasetSelector()
    @renderUnitsSelector()
    @renderScenariosSelector()
    @renderXAxis()
    @renderYAxis()
    if !@provinceMenu
      # We only need to build once, but we need to build after the axis are built
      # for alignment
      @provinceMenu = @buildProvinceMenu()
    @renderGraph()

  renderDatasetSelector: ->
    if @config.dataset?
      datasetSelectors = @d3document
        .select('#datasetSelector')
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

          update = =>
            @config.setDataset d.dataset
            @renderScenariosSelector()
            @renderDatasetSelector()
            @renderYAxis()
            @renderGraph()
            @app.router.navigate @config.routerParams()

          @app.datasetRequester.updateAndRequestIfRequired newConfig, update

      datasetSelectors.html (d) -> """
        <button class='#{d.class}'
                type='button'
                title='#{d.title}'
                aria-label='#{d.ariaLabel}'>
          #{d.label}
        </button>
      """

      datasetSelectors.exit().remove()

  renderMainSelector: ->
    mainSelectorCallback = (d) =>
      newConfig = new @config.constructor @app
      newConfig.copy @config
      newConfig.setMainSelection d.selectorName

      update = =>
        @config.setMainSelection d.selectorName
        # TODO: For efficiency, only rerender what's necessary.
        # We could just call render() ... but that would potentially rebuild a bunch
        # of menus...
        @renderMainSelector()
        @renderDatasetSelector()
        @renderUnitsSelector()
        @renderScenariosSelector()
        @renderYAxis()
        @renderGraph()
        @app.router.navigate @config.routerParams()

      @app.datasetRequester.updateAndRequestIfRequired newConfig, update

    mainSelectors = @d3document
      .select('#mainSelector')
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

    mainSelectors.html (d) -> """
      <img src=#{d.image}
           class='mainSelectorImage'
           title='#{d.title}'
           alt='#{d.altText}'>
      <span class='mainSelectorLabel' title='#{d.title}'>#{d.label}</span>
    """



    mainSelectors.exit()
      .on 'click', null
      .remove()


  renderUnitsSelector: ->
    unitsSelectors = @d3document
      .select('#unitsSelector')
      .selectAll('.unitSelectorButton')
      .data CommonControls.unitSelectionData(@config, @app)
    
    unitsSelectors.enter()
      .append('div')
      .attr
        class: 'unitSelectorButton'
      .on 'click', (d) =>

        newConfig = new @config.constructor @app
        newConfig.copy @config
        newConfig.setUnit d.unitName

        update = =>
          @config.setUnit d.unitName
          # TODO: For efficiency, only rerender what's necessary.
          @renderUnitsSelector()
          @renderYAxis()
          @renderGraph()
          @app.router.navigate @config.routerParams()

        @app.datasetRequester.updateAndRequestIfRequired newConfig, update



    unitsSelectors.html (d) -> """
      <button class='#{d.class}'
              type='button'
              title='#{d.title}'
              aria-label='#{d.ariaLabel}'>
        #{d.label}
      </button>
    """

    unitsSelectors.exit()
      .on 'click', null
      .remove()


  renderScenariosSelector: ->
    scenariosSelectors = @d3document
      .select('#scenariosSelector')
      .selectAll('.scenarioSelectorButton')
      .data CommonControls.scenariosSelectionData(@config, @app)
    
    scenariosSelectors.enter()
      .append('div')
      .attr
        class: 'scenarioSelectorButton'
      .on 'click', (d) =>
        selected = @config.scenarios.includes d.scenarioName

        newConfig = new @config.constructor @app
        newConfig.copy @config
        if selected
          newConfig.removeScenario d.scenarioName
        else
          newConfig.addScenario d.scenarioName

        update = =>
          if selected
            @config.removeScenario d.scenarioName
          else
            @config.addScenario d.scenarioName

          # TODO: For efficiency, only rerender what's necessary.
          @renderScenariosSelector()
          @renderYAxis()
          @renderGraph()
          @renderScenariosSelector()
          @renderGraph()
          @app.router.navigate @config.routerParams()

        @app.datasetRequester.updateAndRequestIfRequired newConfig, update



    scenariosSelectors.html (d) -> """
      <button class='#{d.multipleSelectClass}' type='button' title='#{d.title}'>
        <span aria-label='#{d.ariaLabel}'>#{d.label}</span>
      </button>
    """

    scenariosSelectors.exit()
      .on 'click', null
      .remove()

  renderXAxis: (transition = true) ->
    @d3document.selectAll('.forecast').remove()

    #Render the axis with the labels
    axis = @d3document.select '#xAxis'
      .attr
        transform: "translate(#{0},#{@height()})"
      .call @xAxis()

    axis.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'

    axis.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'

    #render the gridLines
    gridLines = @d3document.select '#xAxisGrid'
      .attr
        transform: "translate(#{0},#{@height()})"
      
    if transition
      gridLines.transition()
        .ease 'linear'
        .duration @app.animationDuration
          .call @xAxisGridLines()
    else
      gridLines.call @xAxisGridLines()

    gridLines.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'

    gridLines.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#E6E6E6'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'

    #render the future line



    textX = @margin.left + @xAxisScale()(2015)
    textY = @outerHeight - 16
    @d3document.select '#graphGroup'
      .append 'text'
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{textX},#{textY})"
          fill: '#999'
        .style 'text-anchor', 'start'
        .text Tr.forecastLabel[@app.language]

    arrowX = @margin.left + @xAxisScale()(2015) + 65
    arrowY = @outerHeight - 27
    @d3document.select '#graphGroup'
      .append 'image'
        .attr
          class: 'forecast'
          transform: "translate(#{arrowX},#{arrowY})"
          'xlink:xlink:href': 'IMG/forecast_arrow.svg'
          height: 9
          width: 200

    @d3document.select '#graphGroup'
      .append 'line'
        .attr
          class: 'forecast'
          stroke: '#999'
          'stroke-width': 2
          x1: @xAxisScale()(2014)
          y1: @height()
          x2: @xAxisScale()(2014)
          y2: @outerHeight - 16
  
  renderYAxis: (transition = true) ->
    # Render the axis
    axis = @d3document.select '#yAxis'
      .attr
        transform: "translate(#{@width()},0)"
    
    axis.transition()
      .duration @app.animationDuration
      .ease 'linear'
      .call @yAxis()

    axis.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'

    axis.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'

    #render the gridLines
    gridLines = @d3document.select '#yAxisGrid'
      .attr
        transform: "translate(#{@width()},0)"

    if transition
      gridLines.transition()
        .ease 'linear'
        .duration @app.animationDuration
        .call @yAxisGridLines()
    else
      gridLines.call @yAxisGridLines()

    gridLines.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'

    gridLines.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#E6E6E6'
        'stroke-width': '1'
        'shape-rendering': 'crispEdges'


  renderGraph: (duration = @app.animationDuration) ->
    xAxisScale = @xAxisScale()
    yAxisScale = @yAxisScale()

    area = d3.svg.area()
      .x (d) ->
        xAxisScale d.year
      .y0 @height()
      .y1 (d) ->
        yAxisScale d.value
      .defined (d) ->
        d.year <= 2014

    areaFuture = d3.svg.area()
      .x (d) ->
        xAxisScale d.year
      .y0 @height()
      .y1 (d) ->
        yAxisScale d.value
      .defined (d) ->
        d.year >= 2014

    line = d3.svg.line()
      .x (d) ->
        xAxisScale d.year
      .y (d) ->
        yAxisScale d.value

    grads = @d3document
      .select('#graphGroup')
      .select('defs')
      .selectAll('.presentLinearGradient')
      .data @gradientData(), (d) ->
        d.key

    enterGrads = grads.enter().append 'linearGradient'
      .attr
        class: 'presentLinearGradient'
        gradientUnits: 'objectBoundingBox'
        id: (d) -> "viz4gradPresent#{d.key}"

    enterGrads.append 'stop'
      .attr
        offset: '0'
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': '0.4'

    enterGrads.append('stop')
      .attr
        offset: ->
          xAxisScale(2010) / xAxisScale(2014)
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': 0.4 * 0.9

    enterGrads.append('stop')
      .attr
        offset: '100%'
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': 0.4 * 0.7

    enterFutureGrads = grads.enter().append('linearGradient')
      .attr
        class: 'futureLinearGradient'
        gradientUnits: 'objectBoundingBox'
        id: (d) -> "viz4gradFuture#{d.key}"

    enterFutureGrads.append('stop')
      .attr
        offset: 0
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': 0.4 * 0.7

    enterFutureGrads.append('stop')
      .attr
        offset: '100%'
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': 0.4 * 0.2


    graphScenarioData = @graphScenarioData()

    graphAreaGroups = @d3document.select '#areasAndLinesGroup'
      .selectAll '.graphGroup'
      .data graphScenarioData, (d) ->
        d.key

    # Enter Selection
    graphAreaGroups.enter()
      .append 'g'
      .attr
        class: 'graphGroup'

    graphAreaSelectors = graphAreaGroups.selectAll('.graphAreaPresent')
      .data(((d) -> [d]), ((d) -> d.key))
      .on 'mouseover', (d) =>
        coords = d3.mouse @tooltipParent # [x, y]
        @tooltip.style.visibility = 'visible'
        @tooltip.style.left = "#{coords[0] + 30}px"
        @tooltip.style.top = "#{coords[1]}px"
        @displayTooltip d.key
      .on 'mousemove', (d) =>
        coords = d3.mouse @tooltipParent # [x, y]
        @tooltip.style.left = "#{coords[0] + 30}px"
        @tooltip.style.top = "#{coords[1]}px"
        @displayTooltip d.key
      .on 'mouseout', =>
        @tooltip.style.visibility = 'hidden'

    graphAreaSelectors.enter().append 'path'
      .attr
        class: 'graphAreaPresent'
        d: (d) ->
          area d.data.map (val) ->
            year: val.year
            value: 0
      .style
        fill: (d) ->
          colour = d3.rgb d.colour
          "url(#viz4gradPresent#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.5)"

    graphAreaSelectors.transition()
      .duration duration
      .attr
        d: (d) ->
          area d.data

    graphFutureAreaSelectors = graphAreaGroups.selectAll('.graphAreaFuture')
      .data(((d) -> [d]), ((d) -> d.key))
      .on 'mouseover', (d) =>
        coords = d3.mouse @tooltipParent # [x, y]
        @tooltip.style.visibility = 'visible'
        @tooltip.style.left = "#{coords[0] + 30}px"
        @tooltip.style.top = "#{coords[1]}px"
        @displayTooltip d.key
      .on 'mousemove', (d) =>
        coords = d3.mouse @tooltipParent # [x, y]
        @tooltip.style.left = "#{coords[0] + 30}px"
        @tooltip.style.top = "#{coords[1]}px"
        @displayTooltip d.key
      .on 'mouseout', =>
        @tooltip.style.visibility = 'hidden'

    graphFutureAreaSelectors.enter().append 'path'
      .attr
        class: 'graphAreaFuture'
        d: (d) ->
          areaFuture d.data.map (val) ->
            year: val.year
            value: 0
        fill: (d) ->
          colour = d3.rgb d.colour
          "url(#viz4gradFuture#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.2)"

    graphAreaGroups.order() #Keeps the order!!!
   
    graphFutureAreaSelectors.transition()
      .duration duration
      .attr
        d: (d) -> areaFuture d.data

    presentLine = graphAreaGroups.selectAll('.presentLine')
      .data ((d) -> [d]), ((d) -> d.key)
    
    presentLine.enter().append 'path'
      .attr
        class: 'presentLine'
        d: (d) ->
          line d.data.map (val) ->
            year: val.year
            value: 0
      .style
        stroke: (d) -> d.colour
        'stroke-width': 2
        fill: 'none'
      

    presentLine.order()

    presentLine.transition()
      .duration duration
      .attr
        d: (d) ->
          line d.data

    exitSelection = graphAreaGroups.exit()
      
    exitSelection.selectAll('.graphAreaPresent')
      .transition()
        .duration duration
        .attr
          d: (d) ->
            area d.data.map (val) ->
              year: val.year
              value: 0
    exitSelection.selectAll('.graphAreaFuture')
      .transition()
        .duration duration
        .attr
          d: (d) ->
            areaFuture d.data.map (val) ->
              year: val.year
              value: 0
    exitSelection.selectAll('.presentLine')
      .transition()
        .duration duration
        .attr
          d: (d) ->
            line d.data.map (val) ->
              year: val.year
              value: 0
      .remove()

    # update the csv data download link
    @d3document.select('#dataDownloadLink')
      .attr
        href: "csv_data#{ParamsToUrlString(@config.routerParams())}"

    # Stroke the reference line a second time, to ensure it is drawn on top of the others
    # We rely on the fact that the reference case is sorted first in graphScenarioData
    # TODO: Not sure I like this approach, investigate controlling the draw order of the
    # lines.
    if @config.scenarios.includes('reference') && graphScenarioData.length > 0
      refCaseLine = d3.select @document
        .select '#referenceCaseLineGroup'
        .selectAll '#refCaseLine'
        .data [graphScenarioData[0]]

      refCaseLine.enter().append('path')
        .attr
          id: 'refCaseLine'
          d: (d) ->
            line d.data.map (val) ->
              year: val.year
              value: 0
        .style
          stroke: (d) -> d.colour
          'stroke-width': 2
          fill: 'none'

      refCaseLine.transition()
        .duration duration
        .attr
          d: (d) ->
            line d.data
    else
      @d3document.select('#refCaseLine').transition()
        .duration duration
        .attr
          d: (d) ->
            line d.data.map (val) ->
              year: val.year
              value: 0
        .remove()

    
    # Draw 'dots' along the reference line, to add to its prominence
    # We rely on the fact that the reference case is sorted first in graphScenarioData
    if @config.scenarios.includes('reference') && graphScenarioData.length > 0
      refCaseDots = d3.select @document
        .select '#referenceCaseLineGroup'
        .selectAll '.refCaseDot'
        .data graphScenarioData[0].data

      refCaseDots.enter().append 'circle'
        .attr 'class', 'refCaseDot'
        .attr 'r', 3.5
        .attr 'cy', yAxisScale(0)
        .style
          fill: 'white'
          stroke: '#999999'
          'stroke-width': 2

      refCaseDots
        .attr 'cx', (d) ->
          xAxisScale d.year

      refCaseDots.transition()
        .duration duration
        .attr 'cy', (d) ->
          yAxisScale d.value
    else
      d3.select @document
        .selectAll 'circle.refCaseDot'
        .transition()
        .duration duration
        .attr 'cy', yAxisScale(0)
        .remove()

  # Take the mouse coordinates, and invert the scale we used to draw the graph to
  # look up which year they correspond to. Combine with the name of the scenario to
  # populate the contents of the mouseover tooltip. Should work at any resolution!
  # We assume that this method is called during a d3 event handler
  displayTooltip: (scenario) ->
    # Mouse coordinates relative to the graph panel element, should be the same
    # coordinate space that the scale is used to draw in.
    coords = d3.mouse @graphPanel # [x, y]

    # I hope that making a scale isn't too expensive to do on mousemove
    scale = @xAxisScale()
    year = Math.floor scale.invert(coords[0])

    # I hope that fetching data isn't too expensive to do on mousemove either!
    data = @graphData()

    # This can happen during an animation where a scenario has been toggled off
    return unless data[scenario]?

    tooltipDatum = data[scenario].find (item) ->
      item.year == year
    return unless tooltipDatum

    @tooltip.innerHTML = "#{Tr.scenarioSelector.names[scenario][@app.language]} (#{year}) #{tooltipDatum.value.toFixed(2)}"


  tearDown: ->
    # TODO: We might want to render with empty lists for buttons, so that
    # garbage collection of event handled dom nodes goes smoothly
    @document.getElementById('visualizationContent').innerHTML = ''

module.exports = Visualization4