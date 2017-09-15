d3 = require 'd3'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
SquareMenu = require '../charts/SquareMenu.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'
Rose = require './Rose.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'
CommonControls = require './CommonControls.coffee'

if Platform.name == 'browser'
  Visualization5Template = require '../templates/Visualization5.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'

ProvinceAriaText = require '../ProvinceAriaText.coffee'
DoublePillPopover = require '../popovers/DoublePillPopover.coffee'

# TODO: Create the Viz5 Access Config.
# Viz5AccessConfig = require '../VisualizationConfigurations/Vis5AccessConfig.coffee'








class Visualization5

  renderBrowserTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render Visualization5Template,
    selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
    selectSectorLabel: Tr.sectorSelector.selectSectorLabel[@app.language]
    selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
    selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
    svgStylesheet: SvgStylesheetTemplate
    graphDescription: Tr.altText.viz5GraphAccessibleInstructions[@app.language]

    altText:
      sectorsHelp: Tr.altText.sectorsHelp[@app.language]
      datasetsHelp: Tr.altText.datasetsHelp[@app.language]
      scenariosHelp: Tr.altText.scenariosHelp[@app.language]

    @datasetHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'datasetSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover datasetSelectorHelp'
      innerClasses: 'viz5HelpTitle'
      title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
      content: => Tr.datasetSelector.datasetSelectorHelp[@app.language]
      attachmentSelector: '.datasetSelectorGroup'
      analyticsElement: 'Viz5 dataset help'

    @sectorsSelectorHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'sectorSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover sectorHelp'
      innerClasses: 'viz5HelpTitle'
      title: Tr.sectorSelector.sectorSelectorHelpTitle[@app.language]
      content: => Tr.sectorSelector.sectorSelectorHelp[@app.language]
      attachmentSelector: '.sectorSelectorGroup'
      analyticsEvent: 'Viz5 sector help'

    @scenariosHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'scenarioSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover scenarioSelectorHelp'
      innerClasses: 'viz5HelpTitle'
      title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
      content: => Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
      attachmentSelector: '.scenarioSelectorGroup'
      analyticsElement: 'Viz5 scenario help'

    @provincesHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'provinceHelpButton'
      outerClasses: 'vizModal controlsHelpPopover popOverSm provinceHelp'
      title: Tr.regionSelector.selectRegionLabel[@app.language]
      content: =>
        #Grab the provinces in order for the string
        contentString = ''
        for province in @dataForProvinceMenu(@config.leftProvince)
          contentString = """
            <div class="provinceLabel">
              <h2> #{Tr.regionSelector.names[province.key][@app.language]} </h2>
            </div>
            #{contentString}
          """
        contentString
      attachmentSelector: '#leftProvincesSelector'
      analyticsElement: 'Viz5 region help'
      setupEvents: false


  constructor: (@app, config, @options={}) ->
    @config = config
    # TODO: Uncomment after creating the Viz5 Access Config.
    # @accessConfig = new Viz5AccessConfig @config

    @margin =
      top: 20
      right: 70
      bottom: 50
      left: 10

    @graphMargin =
      top: 20
      right: 10
      bottom: 50
      left: 10

    @timelineMargin =
      top: 20
      left: 10
      right: 20
      bottom: 70

    @document = @app.window.document
    @d3document = d3.select @document
    @accessibleStatusElement = @document.getElementById 'accessibleStatus'

    # one of 'playing' or 'paused'
    @playPauseStatus = 'paused'

    @allCanadaRoses =
      AB: null
      BC: null
      MB: null
      NB: null
      NL: null
      NS: null
      NT: null
      NU: null
      ON: null
      PE: null
      QC: null
      SK: null
      YT: null

    @leftRose = null
    @rightRose = null

    @roseWithPillsOpen = null

    @doublePillPopover = null

    @renderMode = if @config.leftProvince == 'all' then 'allCanadaRoses' else 'twoRoses'


    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @tooltip = @document.getElementById 'tooltip'
    @tooltipParent = @document.getElementById 'wideVisualizationPanel'
    @graphPanel = @document.getElementById 'graphPanel'

    @container = @d3document.select '#graphSVG'

    switch Platform.name
      when 'browser'
        @isFirstRun = true
      when 'server'
        @isFirstRun = false

    @render()
    @redraw()

    # Rebuild the timeline to fit the new graphPanel width and update the slider
    # positions accordingly.
    @buildTimeline()

    # TODO: Setup graph events.
    # @setupGraphEvents()


  graphData: ->
    @app.providers[@config.dataset].energyConsumptionProvider.dataForViz5 @config


  graphHeight: ->
    @d3document
      .select('#graphPanel')
      .node()
      .getBoundingClientRect()
      .height

  graphWidth: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      @d3document
        .select('#graphPanel')
        .node()
        .getBoundingClientRect()
        .width
    else if Platform.name == 'server'
      Constants.serverSideGraphWidth







  renderServerTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render @options.template,
      svgStylesheet: @options.svgTemplate
      title: Tr.visualization5Title[@app.language]
      description: @config.imageExportDescription()
      energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
      bitlyLink: @app.bitlyLink
      legendContent: Constants.viz5LegendData






  # Province menu stuff
  dataForProvinceMenu: (selectionProvince)->
    [
      {
        key: 'Canada'
        tooltip: ProvinceAriaText @app, selectionProvince == 'Canada', 'Canada'
        colour: if selectionProvince == 'Canada' then '#333' else '#fff'
        img:
          if selectionProvince == 'Canada'
            'IMG/provinces/radio/Canada_SelectedR.svg'
          else
            'IMG/provinces/radio/Canada_UnselectedR.svg'
      }
      {
        key: 'AB'
        tooltip: ProvinceAriaText @app, selectionProvince == 'AB', 'AB'
        colour: if selectionProvince == 'AB' then '#333' else '#fff'
        img:
          if selectionProvince == 'AB'
            'IMG/provinces/radio/AB_SelectedR.svg'
          else
            'IMG/provinces/radio/AB_UnselectedR.svg'
      }
      {
        key: 'BC'
        tooltip: ProvinceAriaText @app, selectionProvince == 'BC', 'BC'
        colour: if selectionProvince == 'BC' then '#333' else '#fff'
        img:
          if selectionProvince == 'BC'
            'IMG/provinces/radio/BC_SelectedR.svg'
          else
            'IMG/provinces/radio/BC_UnselectedR.svg'
      }
      {
        key: 'MB'
        tooltip: ProvinceAriaText @app, selectionProvince == 'MB', 'MB'
        colour: if selectionProvince == 'MB' then '#333' else '#fff'
        img:
          if selectionProvince == 'MB'
            'IMG/provinces/radio/MB_SelectedR.svg'
          else
            'IMG/provinces/radio/MB_UnselectedR.svg'
      }
      {
        key: 'NB'
        tooltip: ProvinceAriaText @app, selectionProvince == 'NB', 'NB'
        colour: if selectionProvince == 'NB' then '#333' else '#fff'
        img:
          if selectionProvince == 'NB'
            'IMG/provinces/radio/NB_SelectedR.svg'
          else
            'IMG/provinces/radio/NB_UnselectedR.svg'
      }
      {
        key : 'NL'
        tooltip: ProvinceAriaText @app, selectionProvince == 'NL', 'NL'
        colour: if selectionProvince == 'NL' then '#333' else '#fff'
        img:
          if selectionProvince == 'NL'
            'IMG/provinces/radio/NL_SelectedR.svg'
          else
            'IMG/provinces/radio/NL_UnselectedR.svg'
      }
      {
        key: 'NS'
        tooltip: ProvinceAriaText @app, selectionProvince == 'NS', 'NS'
        colour: if selectionProvince == 'NS' then '#333' else '#fff'
        img:
          if selectionProvince == 'NS'
            'IMG/provinces/radio/NS_SelectedR.svg'
          else
            'IMG/provinces/radio/NS_UnselectedR.svg'
      }
      {
        key: 'NT'
        tooltip: ProvinceAriaText @app, selectionProvince == 'NT', 'NT'
        colour: if selectionProvince == 'NT' then '#333' else '#fff'
        img:
          if selectionProvince == 'NT'
            'IMG/provinces/radio/NT_SelectedR.svg'
          else
            'IMG/provinces/radio/NT_UnselectedR.svg'
      }
      {
        key: 'NU'
        tooltip: ProvinceAriaText @app, selectionProvince == 'NU', 'NU'
        colour: if selectionProvince == 'NU' then '#333' else '#fff'
        img:
          if selectionProvince == 'NU'
            'IMG/provinces/radio/NU_SelectedR.svg'
          else
            'IMG/provinces/radio/NU_UnselectedR.svg'
      }
      {
        key: 'ON'
        tooltip: ProvinceAriaText @app, selectionProvince == 'ON', 'ON'
        colour: if selectionProvince == 'ON' then '#333' else '#fff'
        img:
          if selectionProvince == 'ON'
            'IMG/provinces/radio/ON_SelectedR.svg'
          else
            'IMG/provinces/radio/ON_UnselectedR.svg'
      }
      {
        key: 'PE'
        tooltip: ProvinceAriaText @app, selectionProvince == 'PE', 'PE'
        colour: if selectionProvince == 'PE' then '#333' else '#fff'
        img:
          if selectionProvince == 'PE'
            'IMG/provinces/radio/PEI_SelectedR.svg'
          else
            'IMG/provinces/radio/PEI_UnselectedR.svg'
      }
      {
        key: 'QC'
        tooltip: ProvinceAriaText @app, selectionProvince == 'QC', 'QC'
        colour: if selectionProvince == 'QC' then '#333' else '#fff'
        img:
          if selectionProvince == 'QC'
            'IMG/provinces/radio/QC_SelectedR.svg'
          else
            'IMG/provinces/radio/QC_UnselectedR.svg'
      }
      {
        key: 'SK'
        tooltip: ProvinceAriaText @app, selectionProvince == 'SK', 'SK'
        colour: if selectionProvince == 'SK' then '#333' else '#fff'
        img:
          if selectionProvince == 'SK'
            'IMG/provinces/radio/Sask_SelectedR.svg'
          else
            'IMG/provinces/radio/Sask_UnselectedR.svg'
      }
      {
        key: 'YT'
        tooltip: ProvinceAriaText @app, selectionProvince == 'YT', 'YT'
        colour: if selectionProvince == 'YT' then '#333' else '#fff'
        img:
          if selectionProvince == 'YT'
            'IMG/provinces/radio/Yukon_SelectedR.svg'
          else
            'IMG/provinces/radio/Yukon_UnselectedR.svg'
      }
    ]

  # Left Province Menu: Black and white non multi select menu.
  buildLeftProvinceMenu: ->
    @d3document.select '#leftProvinceMenuSVG'
      .attr
        width: @d3document.select('#leftProvincesSelector').node().getBoundingClientRect().width
        height: Constants.viz5Height

    options =
      onSelected: @leftProvinceSelected
      groupId: 'leftProvinceMenu'
      allSquareHandler: @selectAllProvince
      # Popovers are not defined on server, so we use ?.
      showHelpHandler: @provincesHelpPopover?.showPopoverCallback
      helpButtonLabel: Tr.altText.regionsHelp[@app.language]
      helpButtonId: 'provinceHelpButton'
      displayHelpIcon: true
      getAllIcon: =>
        if @config.leftProvince == 'all'
          Tr.allSelectorButton.all[@app.language]
        else
          Tr.allSelectorButton.none[@app.language]
      getAllLabel: =>
        if @config.leftProvince == 'all'
          Tr.altText.allButton.allCanadaSelected[@app.language]
        else
          Tr.altText.allButton.allCanadaUnselected[@app.language]
      parentId: 'leftProvinceMenuSVG'

    state =
      size:
        w: @d3document.select('#leftProvincesSelector').node().getBoundingClientRect().width
        h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height
      data: @dataForProvinceMenu(@config.leftProvince)

    new SquareMenu @app, options, state

  selectAllProvince: =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setLeftProvince 'all'

    update = =>
      @config.setLeftProvince 'all'
      @leftProvinceMenu.data @dataForProvinceMenu(@config.leftProvince)
      @leftProvinceMenu.update()
      
      # Hide the right province menu when showing
      # all provinces (Canada view).
      @hideRightProvinceMenu()

      # Calling redraw here to: 1) render the graph, and 2) redraw the timeline to
      # fit with the right province panel.
      @redraw()

      # Rebuild the timeline to fit the new graphPanel width and update the slider
      # positions accordingly.
      @buildTimeline()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update

  leftProvinceSelected: (dataDictionaryItem) =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setLeftProvince dataDictionaryItem.key

    update = =>
      @config.setLeftProvince dataDictionaryItem.key
      @leftProvinceMenu.data @dataForProvinceMenu(@config.leftProvince)
      @leftProvinceMenu.update()

      # Show the right province menu to allow the user
      # to select the second province.
      @showRightProvinceMenu()
      
      # Calling redraw here to: 1) render the graph, and 2) redraw the timeline to
      # fit with the right province panel.
      @redraw()

      # Rebuild the timeline to fit the new graphPanel width and update the slider
      # positions accordingly.
      @buildTimeline()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update

  # Right Province Menu: Black and white non multi select menu.
  buildRightProvinceMenu: ->
    @d3document.select '#rightProvinceMenuSVG'
      .attr
        width: @d3document.select('#rightProvincesSelector').node().getBoundingClientRect().width
        height: Constants.viz5Height

    options =
      onSelected: @rightProvinceSelected
      groupId: 'rightProvinceMenu'
      parentId: 'rightProvinceMenuSVG'
      displayHelpIcon: false
      addAllSquare: false

    state =
      size:
        w: @d3document.select('#rightProvincesSelector').node().getBoundingClientRect().width
        h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height
      data: @dataForProvinceMenu(@config.rightProvince)

    new SquareMenu @app, options, state

  rightProvinceSelected: (dataDictionaryItem) =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setRightProvince dataDictionaryItem.key

    update = =>
      @config.setRightProvince dataDictionaryItem.key
      @rightProvinceMenu.data @dataForProvinceMenu(@config.rightProvince)
      @rightProvinceMenu.update()
      
      @renderGraph()
      
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update

  showRightProvinceMenu: ->
    @d3document.select '#rightProvincesSelector'
      .classed 'hidden', false


  hideRightProvinceMenu: ->
    @d3document.select '#rightProvincesSelector'
      .classed 'hidden', true

  render: ->
    @container.attr
      width: @graphWidth()
      height: Constants.viz5Height

    @svgResize()

    @d3document.select '#graphGroup'
      .attr 'transform', "translate(#{@margin.top},#{@margin.left})"
        
    @addSectors()
    @renderDatasetSelector()
    @renderScenariosSelector()

    if !@leftProvinceMenu
      @leftProvinceMenu = @buildLeftProvinceMenu()

    if !@rightProvinceMenu
      @rightProvinceMenu = @buildRightProvinceMenu()

    # Build the timeline sliders.
    @buildTimeline()

    # NB: Do not render the roses (renderGraph()) as part of render, just let them be
    # created as part of the first redraw() call. Roses need to have some special
    # behaviour on first run, rendering them more than once at first run messes that up.



  outerWidth: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      @d3document
        .select('#graphPanel')
        .node()
        .getBoundingClientRect()
        .width
    else if Platform.name == 'server'
      Constants.serverSideGraphWidth

  width: ->
    @outerWidth() - @margin.left - @margin.right

  height: ->
    Constants.viz5Height - @margin.top - @margin.bottom

  sectorSelectionData: ->
    [
      {
        label: Tr.sectorSelector.totalSectorDemandButton[@app.language]
        title: Tr.selectorTooltip.sectorSelector.totalDemandButton[@app.language]
        sectorName: 'total'
        wrapperClass: 'sectorSelectorButton totalSectorButton'
        buttonClass:
          if @config.sector == 'total'
            'vizButton selected'
          else
            'vizButton'
        ariaLabel:
          if @config.sector == 'total'
            Tr.altText.sectors.totalSelected[@app.language]
          else
            Tr.altText.sectors.totalUnselected[@app.language]
      }
      {
        title: Tr.selectorTooltip.sectorSelector.residentialSectorButton[@app.language]
        sectorName: 'residential'
        image:
          if @config.sector == 'residential'
            'IMG/sector/residential_selected.svg'
          else
            'IMG/sector/residential_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topLeftSector'
        altText:
          if @config.sector == 'residential'
            Tr.altText.sectors.residentialSelected[@app.language]
          else
            Tr.altText.sectors.residentialUnselected[@app.language]
        buttonClass:
          if @config.sector == 'residential'
            'selected'
          else
            ''
      }
      {
        title: Tr.selectorTooltip.sectorSelector.commercialSectorButton[@app.language]
        sectorName: 'commercial'
        image:
          if @config.sector ==  'commercial'
            'IMG/sector/commercial_selected.svg'
          else
            'IMG/sector/commercial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton topRightSector'
        altText:
          if @config.sector == 'commercial'
            Tr.altText.sectors.commercialSelected[@app.language]
          else
            Tr.altText.sectors.commercialUnselected[@app.language]
        buttonClass:
          if @config.sector == 'commercial'
            'selected'
          else
            ''
      }
      {
        title: Tr.selectorTooltip.sectorSelector.industrialSectorButton[@app.language]
        sectorName: 'industrial'
        image:
          if @config.sector == 'industrial'
            'IMG/sector/industrial_selected.svg'
          else
            'IMG/sector/industrial_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomLeftSector'
        altText:
          if @config.sector == 'industrial'
            Tr.altText.sectors.industrialSelected[@app.language]
          else
            Tr.altText.sectors.industrialUnselected[@app.language]
        buttonClass:
          if @config.sector == 'industrial'
            'selected'
          else
            ''
      }
      {
        title: Tr.selectorTooltip.sectorSelector.transportSectorButton[@app.language]
        sectorName: 'transportation'
        image:
          if @config.sector ==  'transportation'
            'IMG/sector/transport_selected.svg'
          else
            'IMG/sector/transport_unselected.svg'
        wrapperClass: 'sectorSelectorButton sectorImageButton bottomRightSector'
        altText:
          if @config.sector == 'transportation'
            Tr.altText.sectors.transportationSelected[@app.language]
          else
            Tr.altText.sectors.transportationUnselected[@app.language]
        buttonClass:
          if @config.sector == 'transportation'
            'selected'
          else
            ''
      }
    ]

  addSectors: ->

    sectorsCallback = (d) =>
      return if @config.sector == d.sectorName

      newConfig = new @config.constructor @app
      newConfig.copy @config
      newConfig.setSector d.sectorName

      update = =>
        @config.setSector d.sectorName
        @addSectors()

        @renderGraph()

        @app.router.navigate @config.routerParams()
        @app.window.document.querySelector('#sectorsSelector .selected').focus()

      @app.datasetRequester.updateAndRequestIfRequired newConfig, update

    if @config.sector?
      sectorsSelectors = @d3document.select '#sectorsSelector'
        .selectAll '.sectorSelectorButton'
        .data @sectorSelectionData()
      
      sectorsSelectors.enter()
        .append 'div'
        .attr
          class: (d) -> d.wrapperClass
        .on 'click', sectorsCallback
        .on 'keydown', (d) ->
          if d3.event.key == 'Enter' or d3.event.key == ' '
            d3.event.preventDefault()
            sectorsCallback d



      sectorsSelectors.html (d) ->
        if d.sectorName == 'total'
          """<button class='#{d.buttonClass}'
                     type='button'
                     title='#{d.title}'
                     aria-label='#{d.ariaLabel}'>
            #{d.label}
          </button>"""
        else
          """<img src=#{d.image}
                  title='#{d.title}'
                  alt='#{d.altText}'
                  tabindex='0'
                  aria-label='#{d.altText}'
                  role='button'
                  class='#{d.buttonClass}'>"""

      sectorsSelectors.exit().remove()

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
        return if @config.scenario == d.scenarioName && Constants.datasetDefinitions[@config.dataset].scenarios.includes d.scenarioName

        newConfig = new @config.constructor @app
        newConfig.copy @config
        newConfig.setScenario d.scenarioName

        update = =>
          @config.setScenario d.scenarioName

          # TODO: For efficiency, only rerender what's necessary.
          @renderScenariosSelector()
          
          @renderGraph()

          @app.router.navigate @config.routerParams()

        @app.datasetRequester.updateAndRequestIfRequired newConfig, update



    scenariosSelectors.html (d) -> """
      <button class='#{d.singleSelectClass}' type='button' title='#{d.title}'>
        <span aria-label='#{d.ariaLabel}'>#{d.label}</span>
      </button>
    """

    scenariosSelectors.exit()
      .on 'click', null
      .remove()

  svgResize: ->
    @d3document.select '#viz5SliderSVG'
      .attr
        width: @outerWidth()
        height: Constants.viz5SliderHeight

    @container
      .attr
        width: @graphWidth()
        height: @height() - Constants.viz5SliderHeight/2

  redraw: ->
    @renderGraph()

    # We're building the yearAxis every time we render to make sure that the
    # timeline year labels (2005 & 2040) are updated everytime the baseYear
    # and/or the comparisonYear changes.
    @buildYearAxis()

    @leftProvinceMenu.size
      w: @d3document.select('#leftProvincesSelector').node().getBoundingClientRect().width
      h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height
    @leftProvinceMenu.update()

    @rightProvinceMenu.size
      w: @d3document.select('#rightProvincesSelector').node().getBoundingClientRect().width
      h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height
    @rightProvinceMenu.update()

    # Hide the right province menu when showing
    # all provinces (Canada view). This is called
    # here for the case when viz5 is first loaded
    # with 'all' selected.
    if @config.leftProvince == 'all'
      @hideRightProvinceMenu()

  buildTimeline: ->
    @buildYearAxis()
    
    # Build the comparison slider label
    @buildComparisonSliderLabel()

    # Build the base slider label
    @buildBaseSliderLabel()

    @buildSliderButtons()

  buildYearAxis: ->
    # Build the highlighted portion of the timeline.
    @buildTimelineHighlightedSection()

    axis = @d3document.select '#timelineAxis'
      .attr
        fill: '#333'
        transform: "translate(0, #{@timelineMargin.top + Constants.sliderLabelHeight})"
      .call @yearAxis()

    # We need a wider target for the click so we use a separate group
    @d3document.select '#viz5timeLineTouch'
      .attr
        class: 'pointerCursor'
        'pointer-events': 'visible'
        height: Constants.viz5SliderHeight
        width: axis.node().getBoundingClientRect().width
        transform: "translate(#{Constants.baseYearTimelineMargin}, 0)"
      .style
        fill: 'none'
      .on 'click', =>
        element = @d3document.select('#timelineAxis').node()
        newX = d3.mouse(element)[0]
        if newX < Constants.viz5timelineMargin then newX = Constants.viz5timelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()

        # Clicking on the timeline will cause the closest slider to move to the 
        # clicked position in the timeline. 
        selectedYear = Math.round @yearScale().invert(newX)

        if selectedYear > @config.comparisonYear || Math.abs(selectedYear - @config.comparisonYear) < Math.abs(selectedYear - @config.baseYear)
          comparisonYear = selectedYear
          return if comparisonYear == @config.comparisonYear
          @updateSlider comparisonYear
        else
          baseYear = selectedYear
          return if baseYear == @config.baseYear
          @updateBaseSlider baseYear


    axis.selectAll('text')
      .style
        'text-anchor': 'middle'
      .attr
        dy: '0.5em'
        'fill': '#333'

    axis.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '2'
        'shape-rendering': 'crispEdges'

    axis.selectAll '.tick line'
      .attr
        transform: 'translate(0, -5)' # Center them around the line
        fill: 'none'
        stroke: '#333333'
        'stroke-width': '2'
        'shape-rendering': 'crispEdges'

  buildTimelineHighlightedSection: ->
    @d3document.select('.timelineHighlightedSection').remove()
    @d3document.select '#timelineAxis'
      .append 'line'
      .attr
        id: 'timelineHighlightedSection'
        class: 'timelineHighlightedSection pointerCursor'
        x1: "#{@yearScale()(@config.baseYear)}"
        y1: "#{@timelineMargin.top - 20}"
        x2: "#{@yearScale()(@config.comparisonYear)}"
        y2: "#{@timelineMargin.top - 20}"

  buildSliderButtons: ->
    @d3document.select('#playPausePanel .viz5MediaButtons').remove()
    div = @d3document.select '#playPausePanel'
      .append 'div'
        .attr
          class: 'viz5MediaButtons'
    div.append 'div'
      .attr
        id: 'vizPlayButton'
        class: 'playPauseButton'
        role: 'button'
        tabindex: '0'
        'aria-label': Tr.altText.playAnimation[@app.language]
      .on 'click', @sliderPlayButtonCallback
      .on 'keydown', =>
        if d3.event.key == 'Enter' or d3.event.key == ' '
          d3.event.preventDefault()
          @sliderPlayButtonCallback()
      .html """
        <img src='IMG/play_pause/playbutton_unselectedR.svg'
             alt='#{Tr.altText.playAnimation[@app.language]}'/>
      """

    div.append 'div'
      .attr
        id: 'vizPauseButton'
        class: 'playPauseButton selected'
        role: 'button'
        tabindex: '0'
        'aria-label': Tr.altText.pauseAnimation[@app.language]
      .on 'click', @sliderPauseButtonCallback
      .on 'keydown', =>
        if d3.event.key == 'Enter' or d3.event.key == ' '
          d3.event.preventDefault()
          @sliderPauseButtonCallback()
      .html """
        <img src='IMG/play_pause/pausebutton_selectedR.svg'
             alt='#{Tr.altText.pauseAnimation[@app.language]}'/>
      """

  sliderPlayButtonCallback: =>
    return if @playPauseStatus == 'playing'
    @playPauseStatus = 'playing'

    # Set the timeline state to replay, and set the comparisonYear
    # to the baseYear.
    if @config.comparisonYear >= Constants.maxYear
      @config.setComparisonYear @config.baseYear
      isReplay = true

    @d3document.select '#vizPlayButton'
      .html """
        <img src='IMG/play_pause/playbutton_selectedR.svg'
             alt='#{Tr.altText.playAnimation[@app.language]}'/>
      """
    @d3document.select '#vizPauseButton'
      .html """
        <img src='IMG/play_pause/pausebutton_unselectedR.svg'
             alt='#{Tr.altText.pauseAnimation[@app.language]}'/>
      """
    if @yearTimeout then window.clearTimeout @yearTimeout
    timeoutComplete = =>
      #return unless @_chart?
      if @config.comparisonYear < Constants.maxYear

        newConfig = new @config.constructor @app
        newConfig.copy @config
        # Do not immediately increment the comparisonYear if in replay mode. This results
        # in a prettier transition from 2040 to the baseYear.
        if isReplay? && isReplay then newConfig.setComparisonYear @config.comparisonYear
        else newConfig.setComparisonYear @config.comparisonYear + 1

        update = =>
          # Reset the replay mode after setting the comparisonYear to baseYear.
          if isReplay? && isReplay
            @config.setComparisonYear @config.comparisonYear
            isReplay = false
          else @config.setComparisonYear @config.comparisonYear + 1
          @yearTimeout = window.setTimeout timeoutComplete, @app.animationDuration
          @redraw()
          @d3document.select '#sliderLabel'
            .transition()
              .attr
                transform: "translate(#{@yearScale()(@config.comparisonYear)},#{@timelineMargin.top  - 5})"
            .duration @app.animationDuration
            .ease 'linear'
          @d3document.select '#labelBox'
            .text @config.comparisonYear
          @d3document.select '#sliderLabel'
            .attr
              'aria-valuenow': @config.comparisonYear
          @app.router.navigate @config.routerParams()

        @app.datasetRequester.updateAndRequestIfRequired newConfig, update

      else
        @d3document.select '#vizPauseButton'
          .html """
            <img src='IMG/play_pause/pausebutton_selectedR.svg'
                 alt='#{Tr.altText.pauseAnimation[@app.language]}'/>
          """
        @d3document.select '#vizPlayButton'
          .html """
            <img src='IMG/play_pause/playbutton_unselectedR.svg'
                 alt='#{Tr.altText.playAnimation[@app.language]}'/>
          """
        # Simulate a pause button click.
        @playPauseStatus = 'paused'

    @yearTimeout = window.setTimeout timeoutComplete, 0
    @app.analyticsReporter.reportEvent 'Electricity Play/Pause', 'Play'



  sliderPauseButtonCallback: =>
    return if @playPauseStatus == 'paused'
    @playPauseStatus = 'paused'

    @d3document.select '#vizPauseButton'
      .html """
        <img src='IMG/play_pause/pausebutton_selectedR.svg'
             alt='#{Tr.altText.pauseAnimation[@app.language]}'/>
      """
    @d3document.select '#vizPlayButton'
      .html """
        <img src='IMG/play_pause/playbutton_unselectedR.svg'
             alt='#{Tr.altText.playAnimation[@app.language]}'/>
       """
    if @yearTimeout then window.clearTimeout @yearTimeout
    @app.analyticsReporter.reportEvent 'Electricity Play/Pause', 'Pause'

###############
  buildBaseSliderLabel: ->
    @d3document.select('.baseSliderLabel').remove()
    baseYear = @config.baseYear

    #Drag Behaviour
    drag = d3.behavior.drag()

    drag.on 'dragstart', =>
      baseYear = @config.baseYear

    drag.on 'drag', =>
      newX = d3.event.x
      if newX < Constants.baseYearTimelineMargin then newX = Constants.baseYearTimelineMargin
      if newX > @timelineRightEnd() then newX = @timelineRightEnd()
      baseYear = Math.round @yearScale().invert newX
      if baseYear > @config.comparisonYear
        return

      @d3document.select('#baseSliderLabel').attr 'transform', =>
        if newX < Constants.baseYearTimelineMargin then newX = Constants.baseYearTimelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        "translate(#{newX - 25}, #{@timelineMargin.bottom - 20})"

      baseYear = Math.round @yearScale().invert newX
      if baseYear != @config.baseYear
        @config.setBaseYear baseYear
        @app.router.navigate @config.routerParams()
        @d3document.select('#baseLabelBox').text =>
          @config.baseYear
        @d3document.select '#baseSliderLabel'
          .attr
            'aria-valuenow': @config.baseYear

        @redraw()

    drag.on 'dragend', =>
      if baseYear != @config.baseYear && @config.comparisonYear > baseYear
        newX = @yearScale()(baseYear)
        @d3document.select('#baseSliderLabel').attr
          transform: "translate(#{newX - 25}, #{@timelineMargin.bottom - 20})"

        @d3document.select('#baseLabelBox').selectAll('text').text =>
          @config.baseYear
        @d3document.select '#baseSliderLabel'
          .attr
            'aria-valuenow': @config.baseYear

        @config.setBaseYear baseYear

        @app.router.navigate @config.routerParams()
        @redraw()

    sliderLabel = @d3document.select('#viz5SliderSVG')
      .append 'g'
      .attr
        id: 'baseSliderLabel'
        class: 'baseSliderLabel pointerCursor'
        transform: "translate(#{@yearScale()(@config.baseYear) - 25}, #{@timelineMargin.bottom - 20})"
        tabindex: '0'
        role: 'slider'
        'aria-label': Tr.altText.yearsSlider[@app.language]
        'aria-orientation': 'horizontal'
        'aria-valuemin': Constants.minYear
        'aria-valuemax': Constants.minYear
        'aria-valuenow': @config.baseYear
      .on 'keydown', @handleBaseSliderKeydown
      .call drag

    sliderLabel.append 'image'
      .attr
        class: 'tLTriangle'
        'xlink:xlink:href': 'IMG/baseyearslider.png'
        x: -(Constants.baseSliderWidth / 2) + 2 #the extra centers it horizontally
        y: 0
        width: Constants.baseSliderWidth
        height: Constants.baseSliderWidth / 2


    sliderLabel.append('text')
      .attr
        class: 'baseSliderLabel'
        id: 'baseLabelBox'
        x: -(Constants.baseSliderWidth / 4) + 5.5 #the extra centers it with due to the font height
        y: (Constants.baseSliderWidth / 2) - 4
        fill: '#fff'
      .text =>
        @config.baseYear

  updateBaseSlider: (value) ->
    # Prevent arrow keys and home/end from scrolling the page while using the slider
    d3.event.preventDefault()

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setBaseYear value

    update = =>
      @config.setBaseYear value
      @d3document.select('#baseSliderLabel').attr
        transform: "translate(#{@yearScale()(@config.baseYear) - 25}, #{@timelineMargin.bottom - 20})"

      @d3document.select '#baseLabelBox'
        .text @config.baseYear
      @d3document.select '#baseSliderLabel'
        .attr
          'aria-valuenow': @config.baseYear

      @redraw()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update

  handleBaseSliderKeydown: =>
    switch d3.event.key
      when 'ArrowRight', 'ArrowUp'
        @updateBaseSlider @config.baseYear + 1
      when 'ArrowLeft', 'ArrowDown'
        @updateBaseSlider @config.baseYear - 1
      when 'End'
        @updateBaseSlider Constants.maxYear
      when 'Home'
        @updateBaseSlider Constants.minYear
###############

  buildComparisonSliderLabel: ->
    @d3document.select('.sliderLabel').remove()
    comparisonYear = @config.comparisonYear

    #Drag Behaviour
    drag = d3.behavior.drag()

    drag.on 'dragstart', =>
      comparisonYear = @config.comparisonYear

    drag.on 'drag', =>
      newX = d3.event.x
      timelineRightEndMax = if @renderMode == 'allCanadaRoses' then @timelineRightEnd() - Constants.allCanadaTimelineMargin else @timelineRightEnd()
      if newX < Constants.baseYearTimelineMargin then newX = Constants.baseYearTimelineMargin
      if newX > timelineRightEndMax then newX = timelineRightEndMax
      comparisonYear = Math.round @yearScale().invert newX
      if comparisonYear < @config.baseYear
        return

      @d3document.select('#sliderLabel').attr 'transform', =>
        if newX < Constants.baseYearTimelineMargin then newX = Constants.baseYearTimelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        "translate(#{newX}, #{@timelineMargin.top - 5})"

      comparisonYear = Math.round @yearScale().invert newX
      if comparisonYear != @config.comparisonYear
        @config.setComparisonYear comparisonYear
        @app.router.navigate @config.routerParams()
        @d3document.select('#labelBox').text =>
          @config.comparisonYear
        @d3document.select '#sliderLabel'
          .attr
            'aria-valuenow': @config.comparisonYear

        @redraw()

    drag.on 'dragend', =>
      if comparisonYear != @config.comparisonYear && comparisonYear >= @config.baseYear
        newX = @yearScale()(comparisonYear)
        @d3document.select('#sliderLabel').attr
          transform: "translate(#{newX}, #{@timelineMargin.top - 5})"

        @d3document.select('#labelBox').selectAll('text').text =>
          @config.comparisonYear
        @d3document.select '#sliderLabel'
          .attr
            'aria-valuenow': @config.comparisonYear
        @config.setComparisonYear comparisonYear
        @app.router.navigate @config.routerParams()
        @redraw()

    sliderLabel = @d3document.select('#viz5SliderSVG')
      .append 'g'
      .attr
        id: 'sliderLabel'
        class: 'sliderLabel pointerCursor'
        transform: "translate(#{@yearScale()(@config.comparisonYear)}, #{@timelineMargin.top - 5})"
        tabindex: '0'
        role: 'slider'
        'aria-label': Tr.altText.yearsSlider[@app.language]
        'aria-orientation': 'horizontal'
        'aria-valuemin': Constants.minYear
        'aria-valuemax': Constants.minYear
        'aria-valuenow': @config.comparisonYear
      .on 'keydown', @handleSliderKeydown
      .call drag

    sliderLabel.append 'image'
      .attr
        class: 'tLTriangle'
        'xlink:xlink:href': 'IMG/yearslider.svg'
        x: -(Constants.comparisonSliderWidth / 2)
        y: 0
        width: Constants.comparisonSliderWidth
        height: Constants.comparisonSliderWidth / 2


    sliderLabel.append('text')
      .attr
        class: 'sliderLabel'
        id: 'labelBox'
        x: -(Constants.comparisonSliderWidth / 4) + 1.5 #the extra centers it with due to the font height
        y: (Constants.comparisonSliderWidth / 4) - 1.5
        fill: '#fff'
      .text =>
        @config.comparisonYear

  yearScale: ->
    d3.scale.linear()
      .domain [Constants.minYear, Constants.maxYear]
      .range [
        Constants.baseYearTimelineMargin
        if @renderMode == 'allCanadaRoses' then @timelineRightEnd() - Constants.allCanadaTimelineMargin else @timelineRightEnd()
      ]

  yearAxis: ->
    d3.svg.axis()
      .scale(@yearScale())
      .tickSize(10,2)
      .ticks(7)
      .tickFormat (d) =>
        if d == Constants.minYear
          if Constants.hideBaseYearLabel.includes @config.baseYear then '' else d
        else if d == Constants.maxYear
           if Constants.maxYear == @config.comparisonYear then '' else d
        else ''
      .orient 'bottom'

  timelineRightEnd: ->
    @outerWidth() - Constants.viz5timelineMargin

  # We want this menu to line up with the bottom of the x axis TICKS so those must be
  # built before we can set this.
  leftHandMenuHeight: ->
    Constants.viz5Height - @timelineMargin.top - @timelineMargin.bottom + @d3document
      .select('#timelineAxis')
      .node()
      .getBoundingClientRect()
      .height

  updateSlider: (value) ->
    # Prevent arrow keys and home/end from scrolling the page while using the slider
    d3.event.preventDefault()

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setComparisonYear value

    update = =>
      @config.setComparisonYear value
      @d3document.select('#sliderLabel').attr
        transform: "translate(#{@yearScale()(@config.comparisonYear)}, #{@timelineMargin.top - 5})"

      @d3document.select '#labelBox'
        .text @config.comparisonYear
      @d3document.select '#sliderLabel'
        .attr
          'aria-valuenow': @config.comparisonYear

      @redraw()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update

  handleSliderKeydown: =>
    switch d3.event.key
      when 'ArrowRight', 'ArrowUp'
        @updateSlider @config.comparisonYear + 1
      when 'ArrowLeft', 'ArrowDown'
        @updateSlider @config.comparisonYear - 1
      when 'End'
        @updateSlider Constants.maxYear
      when 'Home'
        @updateSlider Constants.minYear

  tearDown: ->
    if @yearTimeout then window.clearTimeout @yearTimeout
    # TODO: We might want to render with empty lists for buttons, so that
    # garbage collection of event handled dom nodes goes smoothly
    @document.getElementById('visualizationContent').innerHTML = ''



  renderGraph: ->
    if @config.leftProvince == 'all' and @renderMode == 'allCanadaRoses'
      # Update existing panel of 13 roses
      @renderAllCanadaRoses
        showPillsAfterTransition: false
        removePillsBeforeTransition: false
    else if @config.leftProvince == 'all' and @renderMode == 'twoRoses'
      # Need to switch to 2 roses from all 13
      @renderMode = 'allCanadaRoses'
      @transitionToAllCanadaRoses
        showPillsAfterTransition: false
        removePillsBeforeTransition: true
    else if @config.leftProvince != 'all' and @renderMode == 'twoRoses'
      # Update existing pair of roses
      @renderTwoRoses
        showPillsAfterTransition: false
        removePillsBeforeTransition: false
    else if @config.leftProvince != 'all' and @renderMode == 'allCanadaRoses'
      # Need to switch to all 13 roses from 2
      @renderMode = 'twoRoses'
      @transitionToTwoRoses
        showPillsAfterTransition: true
        removePillsBeforeTransition: true

    @isFirstRun = false

    # update the csv data download link
    @d3document.select('#dataDownloadLink')
      .attr
        href: "csv_data#{ParamsToUrlString(@config.routerParams())}"

  renderAllCanadaRoses: (options) ->
    @d3document.select '#graphPanel'
      .attr
        class: 'allCanadaMode'

    data = @graphData()

    availableWidth = @graphWidth() - @graphMargin.left - @graphMargin.right -
      (Constants.roseColumns - 1) * Constants.allCanadaRoseMargin
    roseSize = availableWidth / Constants.roseColumns
    roseScale = roseSize / Constants.roseSize

    for province, rosePosition of Constants.rosePositions
      xPos = @graphMargin.left + (roseSize + Constants.allCanadaRoseMargin) * rosePosition.column
      yPos = @graphMargin.top + (roseSize + Constants.allCanadaRoseMargin) * rosePosition.row

      if @allCanadaRoses[province]?
        @allCanadaRoses[province].setPosition
          x: xPos
          y: yPos
        @allCanadaRoses[province].setStartingPosition
          x: xPos
          y: yPos
        @allCanadaRoses[province].setScale roseScale
        @allCanadaRoses[province].setData data[province]
        @allCanadaRoses[province].setClickHandler @roseClickHandler
        @allCanadaRoses[province].setPillSize 'small'

        @allCanadaRoses[province].setShowPillsAfterTransition options.showPillsAfterTransition
        @allCanadaRoses[province].setRemovePillsBeforeTransition options.removePillsBeforeTransition

        @allCanadaRoses[province].update()
      else
        roseContainer = @container.append 'g'

        rose = new Rose @app,
          container: roseContainer
          data: data[province]
          scale: roseScale
          startingPosition:
            x: if @isFirstRun then Constants.roseStartingPositionOffsets[province].x else xPos
            y: if @isFirstRun then Constants.roseStartingPositionOffsets[province].y else yPos
          position:
            x: xPos
            y: yPos
          clickHandler: @roseClickHandler
          pillClickHandler: @rosePillClickHandler
          rosePillTemplate: @options.rosePillTemplate # only defined on server
          # To demonstrate that pills will appear if the user clicks on a rose, we show
          # the pills for an arbitrary province on the first run.
          showPillsOnFirstRun: province == 'AB' and Platform.name != 'server'
          showPillsCallback: (rose) =>
            @roseWithPillsOpen.removePills() if @roseWithPillsOpen?
            rose.showPills()
            @roseWithPillsOpen = rose

          isFirstRun: @isFirstRun
          showPopoverOnFirstRun: province == 'AB' and Platform.name != 'server'
          showPopoverCallback: (rose) =>
            rosePill = rose.rosePills.naturalGas
            @app.popoverManager.showPopover rosePill.popover,
              verticalAnchor: @verticalAnchor rosePill.options.data
              horizontalAnchor: @horizontalAnchor rosePill.options.data
          pillSize: 'small'
          showPillsAfterTransition: options.showPillsAfterTransition
          removePillsBeforeTransition: options.removePillsBeforeTransition
          showAllCanadaAnimationOnFirstRun: true
        rose.render()

        @allCanadaRoses[province] = rose

    # Render Canada's map, and fade it out quickly after the transition starts.
    @fadeInCanadaMap()
    @app.window.setTimeout @fadeOutCanadaMap, Constants.animationDuration


  fadeInCanadaMap: ->
    # Only load the map when the app is started in the 'allCanadaRoses' mode.
    return unless @isFirstRun
    
    # Render Canada's map.
    @d3document.select('#canadaMapSVG')
      .attr
        'xlink:xlink:href': 'IMG/CanadaMap.svg'
        width: '100%'
        height: '100%'
        x: @outerWidth() * -0.003
        y: @graphHeight() * 0.045

  fadeOutCanadaMap: =>
    @d3document.select('#canadaMapSVG')
      .attr
        opacity: 0


  renderTwoRoses: (options) ->

    @d3document.select '#graphPanel'
      .attr
        class: 'twoProvincesMode'

    data = @graphData()

    availableWidth = @graphWidth() - @graphMargin.left - @graphMargin.right - Constants.comparisonRoseMargin
    roseSize = availableWidth / 2
    roseScale = roseSize / Constants.roseSize

    leftXPos = @graphMargin.left
    leftYPos = @graphMargin.top
    rightXPos = @graphMargin.left + (roseSize + Constants.comparisonRoseMargin)
    rightYPos = @graphMargin.top


    if @leftRose?
      @leftRose.setPosition
        x: leftXPos
        y: leftYPos
      @leftRose.setStartingPosition
        x: leftXPos
        y: leftYPos
      @leftRose.setScale roseScale
      @leftRose.setData data[@config.leftProvince]
      @leftRose.setClickHandler null
      @leftRose.setPillSize 'large'

      @leftRose.setShowPillsAfterTransition options.showPillsAfterTransition
      @leftRose.setRemovePillsBeforeTransition options.removePillsBeforeTransition

      @leftRose.update()
    else
      roseContainer = @container.append 'g'

      rose = new Rose @app,
        container: roseContainer
        data: data[@config.leftProvince]
        scale: roseScale
        position:
          x: leftXPos
          y: leftYPos
        startingPosition:
          x: leftXPos
          y: leftYPos
        clickHandler: null
        pillClickHandler: @rosePillClickHandler
        rosePillTemplate: @options.rosePillTemplate # only defined on server
        showPillsOnFirstRun: true
        showPillsCallback: (rose) =>
          rose.showPills()
        isFirstRun: @isFirstRun
        showPopoverOnFirstRun: true
        showPopoverCallback: =>
          # On first run, we want to show a popover for one of the power sources, on first
          # run. Wait until the pills have rendered and then put it on display.
          @showDoublePillPopover 'naturalGas'
        rosePosition: 'left' # server side use only
        pillSize: 'large'
        showPillsAfterTransition: options.showPillsAfterTransition
        removePillsBeforeTransition: options.removePillsBeforeTransition
      rose.render()

      @leftRose = rose


    if @rightRose?
      @rightRose.setPosition
        x: rightXPos
        y: rightYPos
      @rightRose.setStartingPosition
        x: rightXPos
        y: rightYPos
      @rightRose.setScale roseScale
      @rightRose.setData data[@config.rightProvince]
      @rightRose.setClickHandler null
      @rightRose.setPillSize 'large'

      @rightRose.setShowPillsAfterTransition options.showPillsAfterTransition
      @rightRose.setRemovePillsBeforeTransition options.removePillsBeforeTransition

      @rightRose.update()
    else
      roseContainer = @container.append 'g'

      rose = new Rose @app,
        container: roseContainer
        data: data[@config.rightProvince]
        scale: roseScale
        position:
          x: rightXPos
          y: rightYPos
        startingPosition:
          x: rightXPos
          y: rightYPos
        clickHandler: null
        pillClickHandler: @rosePillClickHandler
        rosePillTemplate: @options.rosePillTemplate # only defined on server
        showPillsOnFirstRun: true
        showPillsCallback: (rose) =>
          rose.showPills()
        isFirstRun: @isFirstRun
        showPopoverOnFirstRun: false
        rosePosition: 'right' # server side use only
        pillSize: 'large'
        showPillsAfterTransition: options.showPillsAfterTransition
        removePillsBeforeTransition: options.removePillsBeforeTransition
      rose.render()

      @rightRose = rose

    @lastRenderedLeftRose = @config.leftProvince
    @lastRenderedRightRose = @config.rightProvince

  transitionToAllCanadaRoses: (options) ->
    # NB: At this time, @config.leftProvince has already been set to 'all', and can't be
    # used to discover which rose we were rendering in the left slot.

    # Always keep the left rose
    @allCanadaRoses[@lastRenderedLeftRose] = @leftRose

    # If the right rose is different from the left, keep it too
    if @lastRenderedLeftRose != @lastRenderedRightRose
      @allCanadaRoses[@lastRenderedRightRose] = @rightRose
    else
      @rightRose.teardown()

    @leftRose = null
    @rightRose = null

    @renderAllCanadaRoses options
    
  transitionToTwoRoses: (options) ->

    # Always keep the rose which will become the left rose
    @leftRose = @allCanadaRoses[@config.leftProvince]
    @leftRose.removePills()

    @allCanadaRoses[@config.leftProvince] = null

    # If the right rose is different from the left, keep it too
    if @config.leftProvince != @config.rightProvince
      @rightRose = @allCanadaRoses[@config.rightProvince]
      @rightRose.removePills()

      @allCanadaRoses[@config.rightProvince] = null

    # Destroy the other roses =(
    for province, rose of @allCanadaRoses
      continue unless rose?
      rose.teardown()
      @allCanadaRoses[province] = null

    @renderTwoRoses options


  roseClickHandler: (rose) =>
    # Pills are always displayed when we're in comparison mode, we shouldn't handle clicks
    # that come to us in that mode.
    return unless @config.leftProvince == 'all'

    if rose == @roseWithPillsOpen
      @roseWithPillsOpen.removePills()
      @roseWithPillsOpen = null
    else
      @roseWithPillsOpen.removePills() if @roseWithPillsOpen?
      rose.showPills()
      @roseWithPillsOpen = rose


  rosePillClickHandler: (rosePill) =>
    # Prevent the click event from propagating and immediately closing the popover.
    d3.event.preventDefault()
    d3.event.stopPropagation()

    if @config.leftProvince == 'all'
      if @app.popoverManager.currentPopover == rosePill.popover
        @app.popoverManager.closePopover()
        return

      # When in showing roses for all of Canada, show just one popover
      @app.popoverManager.showPopover rosePill.popover,
        verticalAnchor: @verticalAnchor rosePill.options.data
        horizontalAnchor: @horizontalAnchor rosePill.options.data

    else
      source = rosePill.options.data.source
      @showDoublePillPopover source



  showDoublePillPopover: (source) ->
    if @doublePillPopover?
      # If we clicked on a pill for an open pair of popovers, we shouldn't open them
      # anew, so return.
      shouldReturn = source == @doublePillPopover.options.source
      @app.popoverManager.closePopover()
      @doublePillPopover = null
      return if shouldReturn

    # When in showing two roses in comparison mode, show two popovers
    # Fetch both popovers, and initialize a new 'meta popover'
    leftData = @leftRose.rosePills[source].options.data
    rightData = @rightRose.rosePills[source].options.data

    leftPopover = @leftRose.rosePills[source].popover
    rightPopover = @rightRose.rosePills[source].popover

    @doublePillPopover = new DoublePillPopover
      leftPopover: leftPopover
      rightPopover: rightPopover
      closeCallback: =>
        @doublePillPopover = null
      source: source

    @app.popoverManager.showPopover @doublePillPopover,
      left:
        verticalAnchor: @verticalAnchor leftData
        horizontalAnchor: @horizontalAnchor leftData
      right:
        verticalAnchor: @verticalAnchor rightData
        horizontalAnchor: @horizontalAnchor rightData



  verticalAnchor: (dataItem) ->
    switch dataItem.source
      when 'solarWindGeothermal', 'coal', 'oilProducts'
        'top'
      when 'electricity', 'naturalGas', 'bio'
        'bottom'

  horizontalAnchor: (dataItem) ->
    # TODO: add exception cases for rightmost roses in 13 mode
    switch dataItem.source
      when 'solarWindGeothermal', 'bio'
        'left'
      when 'electricity', 'naturalGas', 'coal', 'oilProducts'
        'right'


module.exports = Visualization5