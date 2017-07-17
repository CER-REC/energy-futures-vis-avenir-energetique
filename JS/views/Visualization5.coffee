d3 = require 'd3'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
SquareMenu = require '../charts/SquareMenu.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'
CommonControls = require './CommonControls.coffee'

if Platform.name == 'browser'
  Visualization5Template = require '../templates/Visualization5.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'

ProvinceAriaText = require '../ProvinceAriaText.coffee'
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
        for province in @dataForProvinceMenu()
          contentString = """
            <div class="provinceLabel">
              <h2> #{Tr.regionSelector.names[province.key][@app.language]} </h2>
            </div>
            #{contentString}
          """
        contentString
      attachmentSelector: '#provincesSelector'
      analyticsElement: 'Viz5 region help'
      setupEvents: false

  renderServerTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render @options.template,
      svgStylesheet: @options.svgTemplate
      title: Tr.visualization5Title[@config.mainSelection][@app.language]
      description: @config.imageExportDescription()
      energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
      bitlyLink: @app.bitlyLink
      legendContent: @scenarioLegendData()

  constructor: (@app, config, @options) ->
    @config = config
    
    # TODO: Uncomment after creating the Viz5 Access Config.
    #@accessConfig = new Viz5AccessConfig @config
    
    @outerHeight = 700
    @margin =
      top: 20
      right: 70
      bottom: 50
      left: 10
    @document = @app.window.document
    @d3document = d3.select @document
    @accessibleStatusElement = @document.getElementById 'accessibleStatus'


    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @tooltip = @document.getElementById 'tooltip'
    @tooltipParent = @document.getElementById 'wideVisualizationPanel'
    @graphPanel = @document.getElementById 'graphPanel'

    @render()
    @redraw()

    # TODO: Setup graph events.
    # @setupGraphEvents()

  render: ->
    @d3document.select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    @d3document.select '#graphGroup'
      .attr 'transform', "translate(#{@margin.top},#{@margin.left})"
        
    @addSectors()
    @renderDatasetSelector()
    @renderScenariosSelector()
    
    # TODO
    # @renderXAxis()
    # @renderYAxis()
    # if !@provinceMenu
      # We only need to build once, but we need to build after the axis are built
      # for alignment
      # @provinceMenu = @buildProvinceMenu()

    # Build a dot to serve as the accessible focus
    @buildAccessibleFocusDot()
    
    # TODO: Render the graph
    # @renderGraph()

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
            
            # TODO
            # @renderYAxis()
            # @renderGraph()
            
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
          
          # TODO
          # @renderYAxis()
          # @renderGraph()
          # @renderScenariosSelector()
          
          # TODO: Render the graph
          # @renderGraph()

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

  redraw: ->
    @d3document.select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    
    # TODO
    # @renderXAxis false
    # @renderYAxis false
    # @renderGraph() # TODO: This call used to pass in 0 for duration. Why?
    
    @provinceMenu.size
      w: @d3document.select('#provincesSelector').node().getBoundingClientRect().width
      h: @height() - @d3document.select('span.titleLabel').node().getBoundingClientRect().height + @d3document.select('#xAxis').node().getBoundingClientRect().height
    @provinceMenu.update()

module.exports = Visualization5