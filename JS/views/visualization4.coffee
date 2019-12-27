d3 = require 'd3'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
SquareMenu = require '../charts/SquareMenu.coffee'
Tr = require '../TranslationTable.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'
CommonControls = require './CommonControls.coffee'

Visualization4Template = require '../templates/Visualization4.mustache'
SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'

ProvinceAriaText = require '../ProvinceAriaText.coffee'
Viz4AccessConfig = require '../VisualizationConfigurations/Vis4AccessConfig.coffee'


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
      graphDescription: Tr.altText.viz4GraphAccessibleInstructions[@app.language]

      altText:
        mainSelectionHelp: Tr.altText.mainSelectionHelp[@app.language]
        unitsHelp: Tr.altText.unitsHelp[@app.language]
        datasetsHelp: Tr.altText.datasetsHelp[@app.language]
        scenariosHelp: Tr.altText.scenariosHelp[@app.language]

    @datasetHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'datasetSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover datasetSelectorHelp'
      innerClasses: 'viz4HelpTitle'
      title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
      content: => Tr.datasetSelector.datasetSelectorHelp[@app.language]
      attachmentSelector: '.datasetSelectorGroup'
      analyticsLabel: 'energy futures'

    @mainSelectorHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'mainSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover mainSelectorHelp'
      innerClasses: 'viz4HelpTitle'
      title: Tr.mainSelector.selectOneLabel[@app.language]
      content: => Tr.mainSelector.mainSelectorHelp[@app.language]
      attachmentSelector: '.mainSelectorSection'
      analyticsLabel: 'select one'

    @unitsHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'unitSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover unitSelectorHelp'
      innerClasses: 'viz4HelpTitle'
      title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
      content: => Tr.unitSelector.unitSelectorHelp[@app.language]
      attachmentSelector: '.unitsSelectorGroup'
      analyticsLabel: 'unit'

    @scenariosHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'scenarioSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover scenarioSelectorHelp'
      innerClasses: 'viz4HelpTitle'
      title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
      content: => Tr.scenarioSelector.scenarioSelectorHelp[@config.dataset][@app.language]
      attachmentSelector: '.scenarioSelectorGroup'
      analyticsLabel: 'scenario'

    @provincesHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'provinceHelpButton'
      outerClasses: 'vizModal controlsHelpPopover popOverSm provinceHelp'
      title: Tr.regionSelector.selectRegionLabel[@app.language]
      content: =>
        #Grab the provinces in order for the string
        contentString = ''
        for province in @dataForProvinceMenu()
          contentString = """
            <div class="provinceLabel">
              <h2> #{Tr.regionSelector.names[province.key][@app.language]} </h2>
            </div>
            #{contentString}
          """
        contentString
      attachmentSelector: '#provincesSelector'
      analyticsLabel: 'region'
      setupEvents: false




  constructor: (@app, config, @options) ->
    @config = config
    @accessConfig = new Viz4AccessConfig @config
    @outerHeight = 700
    @margin =
      top: 20
      right: 70
      bottom: 50
      left: 10
    @document = @app.window.document
    @d3document = d3.select @document
    @accessibleStatusElement = @document.getElementById 'accessibleStatus'


    @renderBrowserTemplate()

    @tooltip = @document.getElementById 'tooltip'
    @tooltipParent = @document.getElementById 'wideVisualizationPanel'
    @graphPanel = @document.getElementById 'graphPanel'

    @renderGradients()

    @render()
    @redraw()
    @setupGraphEvents()


  redraw: ->
    @d3document.select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    @renderXAxis false
    @renderYAxis false
    @renderGraph() # TODO: This call used to pass in 0 for duration. Why?
    @provinceMenu.size
      w: @d3document.select('#provincesSelector').node().getBoundingClientRect().width
      h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height + @d3document.select('#xAxis').node().getBoundingClientRect().height
    @provinceMenu.update()




  # Province menu stuff
  dataForProvinceMenu: ->
    [
      {
        key: 'AB'
        tooltip: ProvinceAriaText @app, @config.province == 'AB', 'AB'
        colour: if @config.province == 'AB' then '#333' else '#fff'
        img:
          if @config.province == 'AB'
            'IMG/provinces/radio/AB_SelectedR.svg'
          else
            'IMG/provinces/radio/AB_UnselectedR.svg'
      }
      {
        key: 'BC'
        tooltip: ProvinceAriaText @app, @config.province == 'BC', 'BC'
        colour: if @config.province == 'BC' then '#333' else '#fff'
        img:
          if @config.province == 'BC'
            'IMG/provinces/radio/BC_SelectedR.svg'
          else
            'IMG/provinces/radio/BC_UnselectedR.svg'
      }
      {
        key: 'MB'
        tooltip: ProvinceAriaText @app, @config.province == 'MB', 'MB'
        colour: if @config.province == 'MB' then '#333' else '#fff'
        img:
          if @config.province == 'MB'
            'IMG/provinces/radio/MB_SelectedR.svg'
          else
            'IMG/provinces/radio/MB_UnselectedR.svg'
      }
      {
        key: 'NB'
        tooltip: ProvinceAriaText @app, @config.province == 'NB', 'NB'
        colour: if @config.province == 'NB' then '#333' else '#fff'
        img:
          if @config.province == 'NB'
            'IMG/provinces/radio/NB_SelectedR.svg'
          else
            'IMG/provinces/radio/NB_UnselectedR.svg'
      }
      {
        key : 'NL'
        tooltip: ProvinceAriaText @app, @config.province == 'NL', 'NL'
        colour: if @config.province == 'NL' then '#333' else '#fff'
        img:
          if @config.province == 'NL'
            'IMG/provinces/radio/NL_SelectedR.svg'
          else
            'IMG/provinces/radio/NL_UnselectedR.svg'
      }
      {
        key: 'NS'
        tooltip: ProvinceAriaText @app, @config.province == 'NS', 'NS'
        colour: if @config.province == 'NS' then '#333' else '#fff'
        img:
          if @config.province == 'NS'
            'IMG/provinces/radio/NS_SelectedR.svg'
          else
            'IMG/provinces/radio/NS_UnselectedR.svg'
      }
      {
        key: 'NT'
        tooltip: ProvinceAriaText @app, @config.province == 'NT', 'NT'
        colour: if @config.province == 'NT' then '#333' else '#fff'
        img:
          if @config.province == 'NT'
            'IMG/provinces/radio/NT_SelectedR.svg'
          else
            'IMG/provinces/radio/NT_UnselectedR.svg'
      }
      {
        key: 'NU'
        tooltip: ProvinceAriaText @app, @config.province == 'NU', 'NU'
        colour: if @config.province == 'NU' then '#333' else '#fff'
        img:
          if @config.province == 'NU'
            'IMG/provinces/radio/NU_SelectedR.svg'
          else
            'IMG/provinces/radio/NU_UnselectedR.svg'
      }
      {
        key: 'ON'
        tooltip: ProvinceAriaText @app, @config.province == 'ON', 'ON'
        colour: if @config.province == 'ON' then '#333' else '#fff'
        img:
          if @config.province == 'ON'
            'IMG/provinces/radio/ON_SelectedR.svg'
          else
            'IMG/provinces/radio/ON_UnselectedR.svg'
      }
      {
        key: 'PE'
        tooltip: ProvinceAriaText @app, @config.province == 'PE', 'PE'
        colour: if @config.province == 'PE' then '#333' else '#fff'
        img:
          if @config.province == 'PE'
            'IMG/provinces/radio/PEI_SelectedR.svg'
          else
            'IMG/provinces/radio/PEI_UnselectedR.svg'
      }
      {
        key: 'QC'
        tooltip: ProvinceAriaText @app, @config.province == 'QC', 'QC'
        colour: if @config.province == 'QC' then '#333' else '#fff'
        img:
          if @config.province == 'QC'
            'IMG/provinces/radio/QC_SelectedR.svg'
          else
            'IMG/provinces/radio/QC_UnselectedR.svg'
      }
      {
        key: 'SK'
        tooltip: ProvinceAriaText @app, @config.province == 'SK', 'SK'
        colour: if @config.province == 'SK' then '#333' else '#fff'
        img:
          if @config.province == 'SK'
            'IMG/provinces/radio/Sask_SelectedR.svg'
          else
            'IMG/provinces/radio/Sask_UnselectedR.svg'
      }
      {
        key: 'YT'
        tooltip: ProvinceAriaText @app, @config.province == 'YT', 'YT'
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
      displayHelpIcon: true
      onSelected: @provinceSelected
      groupId: 'provinceMenu'
      allSquareHandler: @selectAllProvince
      # Popovers are not defined on server, so we use ?.
      showHelpHandler: @provincesHelpPopover?.showPopoverCallback
      helpButtonLabel: Tr.altText.regionsHelp[@app.language]
      helpButtonId: 'provinceHelpButton'
      getAllIcon: =>
        if @config.province == 'all'
          Tr.allSelectorButton.all[@app.language]
        else
          Tr.allSelectorButton.none[@app.language]
      getAllLabel: =>
        if @config.province == 'all'
          Tr.altText.allButton.allCanadaSelected[@app.language]
        else
          Tr.altText.allButton.allCanadaUnselected[@app.language]
      parentId: 'provinceMenuSVG'

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

    @app.analyticsReporter.reportEvent
      category: 'feature - set region'
      action: d3.event.type
      label: 'all'

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

    @app.analyticsReporter.reportEvent
      category: 'feature - set region'
      action: d3.event.type
      label: dataDictionaryItem.key

    update = =>
      @config.setProvince dataDictionaryItem.key
      @provinceMenu.data @dataForProvinceMenu()
      @provinceMenu.update()
      @renderYAxis()
      @renderGraph()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update


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
      technology:
        label: Tr.scenarioSelector.technologyButton[@app.language]
        class: 'technology'
      hcp:
        label: Tr.scenarioSelector.hcpButton[@app.language]
        class: 'hcp'

    availableScenarios = switch @config.mainSelection
      when 'energyDemand'
        ['reference', 'high', 'highLng', 'constrained', 'low', 'noLng', 'technology', 'hcp']
      when 'electricityGeneration'
        ['reference', 'high', 'highLng', 'constrained', 'low', 'noLng', 'technology', 'hcp']
      when 'oilProduction'
        ['reference', 'high', 'constrained', 'low', 'technology', 'hcp']
      when 'gasProduction'
        ['reference', 'high', 'highLng', 'low', 'noLng', 'hcp', 'technology']

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
    # 1st gen colours:
    # [
    #   {
    #     key: 'reference'
    #     colour: '#999999'
    #   }
    #   {
    #     key: 'high'
    #     colour: '#0C2C84'
    #   }
    #   {
    #     key: 'highLng'
    #     colour: '#225EA8'
    #   }
    #   {
    #     key: 'constrained'
    #     colour: '#41B6C4'
    #   }
    #   {
    #     key: 'low'
    #     colour: '#7FCDBB'
    #   }
    #   {
    #     key: 'noLng'
    #     colour: '#C7E9B4'
    #   }
    #   {
    #     key: 'technology'
    #     colour: '#C7E9B4'
    #   }
    #   {
    #     key: 'hcp'
    #     colour: '#7FCDBB'
    #   }
    #   {
    #     key: 'htc'
    #     colour: '#0C2C84'
    #   }
    # ]
    
    # 2nd gen colours
    baseData = [
      {
        key: 'reference'
        colour: '#999999'
      }
      {
        key: 'high'
        colour: '#6C5AEB'
      }
      {
        key: 'highLng'
        colour: '#2B6762'
      }
      {
        key: 'constrained'
        colour: '#0B3CB4'
      }
      {
        key: 'low'
        colour: '#082346'
      }
      {
        key: 'noLng'
        colour: '#3692fa'
      }
      {
        key: 'technology'
        colour: '#3692fa'
      }
      {
        key: 'hcp'
        colour: '#0B3CB4'
      }
    ]

    fullData = []
    for datasetName, datasetDefinition of Constants.datasetDefinitions
      for item in baseData
        fullData.push
          key: item.key
          colour: item.colour
          dataset: datasetName
          forecastYear: datasetDefinition.forecastFromYear

    fullData



  graphScenarioData: ->
    scenarioData =
      # 1st gen colours
      # reference:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.referenceButton[@app.language]
      #   key: 'reference'
      #   colour: '#999999'
      # high:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.highPriceButton[@app.language]
      #   key: 'high'
      #   colour: '#0C2C84'
      # highLng:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.highLngButton[@app.language]
      #   key: 'highLng'
      #   colour: '#225EA8'
      # constrained:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.constrainedButton[@app.language]
      #   key: 'constrained'
      #   colour: '#41B6C4'
      # low:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.lowPriceButton[@app.language]
      #   key: 'low'
      #   colour: '#7FCDBB'
      # noLng:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.noLngButton[@app.language]
      #   key: 'noLng'
      #   colour: '#C7E9B4'
      # technology:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.technologyButton[@app.language]
      #   key: 'technology'
      #   colour: '#C7E9B4'
      # hcp:
      #   tooltip: Tr.selectorTooltip.scenarioSelector.hcpButton[@app.language]
      #   key: 'hcp'
      #   colour: '#7FCDBB'

      # 2nd gen colours
      reference:
        tooltip: Tr.selectorTooltip.scenarioSelector.referenceButton[@app.language]
        key: 'reference'
        colour: '#999999'
      high:
        tooltip: Tr.selectorTooltip.scenarioSelector.highPriceButton[@app.language]
        key: 'high'
        colour: '#6C5AEB'
      highLng:
        tooltip: Tr.selectorTooltip.scenarioSelector.highLngButton[@app.language]
        key: 'highLng'
        colour: '#2B6762'
      constrained:
        tooltip: Tr.selectorTooltip.scenarioSelector.constrainedButton[@app.language]
        key: 'constrained'
        colour: '#0B3CB4'
      low:
        tooltip: Tr.selectorTooltip.scenarioSelector.lowPriceButton[@app.language]
        key: 'low'
        colour: '#082346'
      noLng:
        tooltip: Tr.selectorTooltip.scenarioSelector.noLngButton[@app.language]
        key: 'noLng'
        colour: '#3692fa'
      technology:
        tooltip: Tr.selectorTooltip.scenarioSelector.technologyButton[@app.language]
        key: 'technology'
        colour: '#3692fa'
      hcp:
        tooltip: Tr.selectorTooltip.scenarioSelector.hcpButton[@app.language]
        key: 'hcp'
        colour: '#0B3CB4'

    scenariosInSelection = Constants.datasetDefinitions[@config.dataset].scenariosPerSelection[@config.mainSelection]


    graphData = @graphData()
    currentGraphScenarioData = []
    for scenarioName in Constants.scenarioDrawingOrder
      if (@config.scenarios.includes scenarioName) and (scenariosInSelection.includes scenarioName)
        scenario = scenarioData[scenarioName]
        scenario.data = graphData[scenarioName]
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
    @d3document
      .select('#graphPanel')
      .node()
      .getBoundingClientRect()
      .width


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

    # Build a dot to serve as the accessible focus
    @buildAccessibleFocusDot()
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

          @app.analyticsReporter.reportEvent
            category: 'feature - dataset'
            action: d3.event.type
            label: d.dataset

          update = =>
            @config.setDataset d.dataset
            @renderScenariosSelector()
            @renderDatasetSelector()
            @renderYAxis()
            @renderXAxis()
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

      @app.analyticsReporter.reportEvent
        category: 'feature - main selection'
        action: d3.event.type
        label: d.selectorName

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
      .on 'keydown', (d) ->
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
      .on 'keydown', null
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

        @app.analyticsReporter.reportEvent
          category: 'feature - unit'
          action: d3.event.type
          label: d.unitName

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
          @app.analyticsReporter.reportEvent
            category: 'feature - remove scenario'
            action: d3.event.type
            label: d.scenarioName
        else
          newConfig.addScenario d.scenarioName
          @app.analyticsReporter.reportEvent
            category: 'feature - add scenario'
            action: d3.event.type
            label: d.scenarioName


        update = =>
          if selected
            @config.removeScenario d.scenarioName
          else
            @config.addScenario d.scenarioName

          # TODO: For efficiency, only rerender what's necessary.
          @renderScenariosSelector()
          @renderYAxis()
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

    forecastYear = Constants.datasetDefinitions[@config.dataset].forecastFromYear - 1

    textX = @margin.left + @xAxisScale()(forecastYear) + 10
    textY = @outerHeight - 16
    @d3document.select '#graphGroup'
      .append 'text'
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{textX},#{textY})"
          fill: '#999'
        .style 'text-anchor', 'start'
        .text Tr.forecastLabel[@app.language]

    arrowX = @margin.left + @xAxisScale()(forecastYear) + 65
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
          x1: @xAxisScale() forecastYear
          y1: @outerHeight - 30
          x2: @xAxisScale() forecastYear
          y2: @outerHeight - 14
  
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


  renderGradients: ->
    xAxisScale = @xAxisScale()

    grads = @d3document
      .select '#graphGroup'
      .select 'defs'
      .selectAll '.presentLinearGradient'
      .data @gradientData()

    enterGrads = grads.enter().append 'linearGradient'
      .attr
        class: 'presentLinearGradient'
        gradientUnits: 'objectBoundingBox'
        id: (d) -> "viz4grad-#{d.key}-#{d.dataset}"

    enterGrads.append 'stop'
      .attr
        offset: '0'
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': '0.4'

    # We phase in the forecast transparency over three years to make the transition less abrupt

    enterGrads.append('stop')
      .attr
        offset: (d) ->
          xAxisScale(d.forecastYear) / xAxisScale(2040)
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': 0.4 * 0.9 # 36%

    enterGrads.append('stop')
      .attr
        offset: (d) ->
          xAxisScale(d.forecastYear + 3) / xAxisScale(2040)
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': 0.4 * 0.7 # 28%

    enterGrads.append 'stop'
      .attr
        offset: '100%'
      .style
        'stop-color': (d) -> d.colour
        'stop-opacity': 0.4 * 0.2 # 8%

    # NB: regarding opacity, we have 3-6 layers which combine together. 8% opacity is pretty low for one visual element, but with 6 layers we're still only just below 50% opacity all together.


  renderGraph: (duration = @app.animationDuration) ->
    xAxisScale = @xAxisScale()
    yAxisScale = @yAxisScale()
    forecastYear = Constants.datasetDefinitions[@config.dataset].forecastFromYear - 1

    area = d3.svg.area()
      .x (d) ->
        xAxisScale d.year
      .y0 @height()
      .y1 (d) ->
        yAxisScale d.value

    line = d3.svg.line()
      .x (d) ->
        xAxisScale d.year
      .y (d) ->
        yAxisScale d.value

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
      .on 'click', (d) =>
        graphPanel = @document.getElementById 'graphPanel'
        coords = d3.mouse graphPanel

        @accessConfig.setYear Math.floor(@xAxisScale().invert(coords[0]))
        @accessConfig.setScenario d.key, @config.dataset

        @updateAccessibleFocus()
        @reportPointOfInterestEvent 'click'

    graphAreaSelectors.enter().append 'path'
      .attr
        class: 'graphAreaPresent pointerCursor'
        d: (d) ->
          area d.data.map (val) ->
            year: val.year
            value: 0

    graphAreaSelectors.style
      fill: (d) =>
        colour = d3.rgb d.colour
        # NB: The extra RGBA statement is a fallback for old IE
        # "url(#viz4grad-#{d.key}-#{@config.dataset})"
        "url(#viz4grad-#{d.key}-#{@config.dataset}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.5)"

    graphAreaSelectors.transition()
      .duration duration
      .attr
        d: (d) ->
          area d.data

    # d3 function, causes DOM element order to match data order
    graphAreaGroups.order()
   
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
        'stroke-width': 2.5
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
    # TODO: Not sure I like this approach, investigate controlling the draw order of the
    # lines.
    referenceData = graphScenarioData.find (item) -> item.key == 'reference'
    if referenceData?
      refCaseLine = d3.select @document
        .select '#referenceCaseLineGroup'
        .selectAll '#refCaseLine'
        .data [referenceData]

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
    if referenceData?
      refCaseDots = d3.select @document
        .select '#referenceCaseLineGroup'
        .selectAll '.refCaseDot'
        .data referenceData.data

      refCaseDots.enter().append 'circle'
        .attr 'class', 'refCaseDot'
        .attr 'r', 3.5
        .attr 'cy', yAxisScale(0)
        .style
          fill: 'white'
          stroke: '#999999'
          'stroke-width': 2

      refCaseDots.transition()
        .duration duration
        .attr
          cx: (d) ->
            xAxisScale d.year
          cy: (d) ->
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

    # @tooltip.innerHTML = "#{Tr.scenarioSelector.names[scenario][@app.language]} (#{year}) #{tooltipDatum.value.toFixed(2)}"

    formatter = d3.formatPrefix tooltipDatum.value
    value = formatter.scale(tooltipDatum.value).toFixed 2
    unitString = Tr.unitSelector["#{@config.unit}Button"][@app.language]

    @tooltip.innerHTML = "#{Tr.scenarioSelector.names[scenario][@app.language]} (#{year}) #{value} #{formatter.symbol} #{unitString}"



  displayTooltipKeyboard: (scenario, year, accessibleFocusDot) ->
    data = @graphData()
    return unless data[scenario]?

    tooltipDatum = data[scenario].find (item) ->
      item.year == year
    return unless tooltipDatum


    # First, find the position in absolute page coordinates where the tooltip should
    # go
    dotBounds = accessibleFocusDot.getBoundingClientRect()
    xDest = dotBounds.right + window.scrollX + Constants.tooltipXOffset
    yDest = dotBounds.top + window.scrollY + dotBounds.height / 2

    # Second, calculate the offset for the tooltip element based on its parent
    parentBounds = @tooltipParent.getBoundingClientRect()
    xParentOffset = parentBounds.left + window.scrollX
    yParentOffset = parentBounds.top + window.scrollY

    # Third, place the tooltip
    @tooltip.style.visibility = 'visible'
    @tooltip.style.left = "#{xDest - xParentOffset}px"
    @tooltip.style.top = "#{yDest - yParentOffset}px"

    # @tooltip.innerHTML = "#{Tr.scenarioSelector.names[scenario][@app.language]} (#{year}) #{tooltipDatum.value.toFixed(2)}"

    formatter = d3.formatPrefix tooltipDatum.value
    value = formatter.scale(tooltipDatum.value).toFixed 2
    unitString = Tr.unitSelector["#{@config.unit}Button"][@app.language]

    @tooltip.innerHTML = "#{Tr.scenarioSelector.names[scenario][@app.language]} (#{year}) #{value} #{formatter.symbol} #{unitString}"
 


  tearDown: ->
    # TODO: We might want to render with empty lists for buttons, so that
    # garbage collection of event handled dom nodes goes smoothly
    @document.getElementById('visualizationContent').innerHTML = ''


  setupGraphEvents: ->
    graphElement = @document.getElementById 'graphPanel'

    graphElement.addEventListener 'keydown', (event) =>

      # Only process the input if there is at least one selected scenario
      return if @config.scenarios.length == 0

      switch event.key
        when 'ArrowRight'
          event.preventDefault()
          @accessConfig.setYear @accessConfig.activeYear + 1
          @updateAccessibleFocus()
          @reportPointOfInterestEvent event.type
        when 'ArrowLeft'
          event.preventDefault()
          @accessConfig.setYear @accessConfig.activeYear - 1
          @updateAccessibleFocus()
          @reportPointOfInterestEvent event.type
        when 'ArrowUp'
          event.preventDefault()
          nextScenario = @config.nextActiveScenarioReverse @accessConfig.activeScenario
          @accessConfig.setScenario nextScenario, @config.dataset
          @updateAccessibleFocus()
          @reportPointOfInterestEvent event.type
        when 'ArrowDown'
          event.preventDefault()
          nextScenario = @config.nextActiveScenarioForward @accessConfig.activeScenario
          @accessConfig.setScenario nextScenario, @config.dataset
          @updateAccessibleFocus()
          @reportPointOfInterestEvent event.type

    graphElement.addEventListener 'focus', =>
      # When we return to focusing the graph element, the graph sub element that the user
      # had focused may have been toggled off (by removing the scenario).
      # Calling validate ensures that the sub-focus element is positioned correctly
      if @config.scenariosVisible()
        @accessConfig.validate @config
        @updateAccessibleFocus()
      else
        # If there are no active scenarios, we handle the special case
        @d3document.select '#graphPanel'
          .attr
            'aria-label': Tr.altText.emptyScenarioSelection[@app.language]
        @accessibleFocusDot.attr
          transform: 'translate(-1000, -1000)'
        @tooltip.style.visibility = 'hidden'


  updateAccessibleFocus: ->
    # The case where there is no active item is handled before the call to
    # updateAccessibleFocus
    data = @graphData()
    scenarioData = data[@accessConfig.activeScenario]
    return unless scenarioData?
    item = scenarioData.find (scenarioDataItem) =>
      scenarioDataItem.year == @accessConfig.activeYear
    return unless item?

    xCoord = @xAxisScale() item.year
    yCoord = @yAxisScale() item.value
    @accessibleFocusDot.attr
      transform: "translate(#{xCoord}, #{yCoord})"

    scenarioString = Tr.scenarioSelector.names[@accessConfig.activeScenario][@app.language]
    unitString = Tr.altText.unitNames[@config.unit][@app.language]
    description = "#{scenarioString} #{@accessConfig.activeYear}, #{item.value.toFixed 2} #{unitString}"
    @d3document.select '#graphPanel'
      .attr
        'aria-label': description
    @accessibleStatusElement.innerHTML = description

    @displayTooltipKeyboard @accessConfig.activeScenario, @accessConfig.activeYear, @accessibleFocusDotElement


  # TODO: Find a way to extract this? duplicated in viz2.
  buildAccessibleFocusDot: ->
    @d3document.select '#graphGroup'
      .append 'g'
      .attr
        id: 'accessibleFocusDot'
        class: 'accessibleFocus'

    @accessibleFocusDot = @d3document.select '#accessibleFocusDot'
    @accessibleFocusDotElement = @document.getElementById 'accessibleFocusDot'
    
    @d3document.select '#graphPanel'
      .attr
        'aria-activedescendant': 'accessibleFocusDot'

    @accessibleFocusDot
      .append 'circle'
        .attr
          r: 10
          fill: 'red'
          'fill-opacity': 0.5
    @accessibleFocusDot
      .append 'circle'
        .attr
          r: 5
          fill: 'red'

  reportPointOfInterestEvent: (action) ->
    @app.analyticsReporter.reportEvent
      category: 'graph poi'
      action: action
      value: @accessibleStatusElement.innerHTML


module.exports = Visualization4