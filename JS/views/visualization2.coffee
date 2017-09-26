d3 = require 'd3'
Mustache = require 'mustache'


visualization = require './visualization.coffee'
stackedAreaChart = require '../charts/stacked-area-chart.coffee'
SquareMenu = require '../charts/SquareMenu.coffee'
Constants = require '../Constants.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'

if Platform.name == 'browser'
  Visualization2Template = require '../templates/Visualization2.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'

ProvinceAriaText = require '../ProvinceAriaText.coffee'
SourceAriaText = require '../SourceAriaText.coffee'

Viz2AccessConfig = require '../VisualizationConfigurations/Vis2AccessConfig.coffee'


class Visualization2 extends visualization
  height = 700

  renderBrowserTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render Visualization2Template,
      selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
      selectSectorLabel: Tr.sectorSelector.selectSectorLabel[@app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[@app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      selectSourceLabel: Tr.sourceSelector.selectSourceLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate
      graphDescription: Tr.altText.viz2GraphAccessibleInstructions[@app.language]

      altText:
        sectorsHelp: Tr.altText.sectorsHelp[@app.language]
        unitsHelp: Tr.altText.unitsHelp[@app.language]
        datasetsHelp: Tr.altText.datasetsHelp[@app.language]
        scenariosHelp: Tr.altText.scenariosHelp[@app.language]

    @datasetHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'datasetSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover datasetSelectorHelp'
      innerClasses: 'viz2HelpTitle'
      title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
      content: => Tr.datasetSelector.datasetSelectorHelp[@app.language]
      attachmentSelector: '.datasetSelectorGroup'
      analyticsEvent: 'Viz2 dataset help'

    @sectorsSelectorHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'sectorSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover sectorHelp'
      innerClasses: 'viz2HelpTitle'
      title: Tr.sectorSelector.sectorSelectorHelpTitle[@app.language]
      content: => Tr.sectorSelector.sectorSelectorHelp[@app.language]
      attachmentSelector: '.sectorSelectorGroup'
      analyticsEvent: 'Viz2 sector help'

    @unitsHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'unitSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover unitSelectorHelp'
      innerClasses: 'viz2HelpTitle'
      title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
      content: => Tr.unitSelector.unitSelectorHelp[@app.language]
      attachmentSelector: '.unitsSelectorGroup'
      analyticsEvent: 'Viz2 unit help'

    @scenariosHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'scenarioSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover scenarioSelectorHelp'
      innerClasses: 'viz2HelpTitle'
      title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
      content: => Tr.scenarioSelector.scenarioSelectorHelp[@config.dataset][@app.language]
      attachmentSelector: '.scenarioSelectorGroup'
      analyticsEvent: 'Viz2 scenario help'

    @sourcesHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'sourceHelpButton'
      outerClasses: 'vizModal controlsHelpPopover popOverLg sourceSelectorHelp'
      title: Tr.sourceSelector.selectSourceLabel[@app.language]
      content: =>
        contentString = ''
        for source in @sourceMenuData()
          contentString = """
            <div class="sourceLabel sourceLabel#{source.key}">
              <img class="sourceIcon" src="#{@colouredSourceIconsDictionary()[source.key]}" alt='#{Tr.altText.sources[source.key][@app.language]}'>
              <h2> #{Tr.sourceSelector.sources[source.key][@app.language]} </h2>
              <div class="clearfix"> </div>
              <p> #{Tr.sourceSelector.sourceSelectorHelp[source.key][@app.language]} </p>
            </div>
            """ + contentString
        contentString = Tr.sourceSelector.sourceSelectorHelp.generalHelp[@app.language] + contentString
        contentString
      attachmentSelector: '#powerSourceSelector'
      analyticsEvent: 'Viz2 source help'
      setupEvents: false


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
          """ + contentString
        contentString
      attachmentSelector: '#provincesSelector'
      analyticsEvent: 'Viz2 region help'
      setupEvents: false


  renderServerTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render @options.template,
      svgStylesheet: @options.svgTemplate
      title: Tr.visualization2Title[@app.language]
      description: @config.imageExportDescription()
      energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
      bitlyLink: @app.bitlyLink
      legendContent: @sourceLegendData()


  constructor: (@app, config, @options) ->
    @config = config
    @accessConfig = new Viz2AccessConfig @config
    @_chart = null
    @document = @app.window.document
    @d3document = d3.select @document
    @accessibleStatusElement = @document.getElementById 'accessibleStatus'


    @getData()

    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @addDatasetToggle()

    @_margin =
      top: 20
      right: 60
      bottom: 70
      left: 20
    @svgResize()
    @addDatasetToggle()
    @addUnitToggle()
    @addSectors()
    @addScenarios()
    @render()
    @setupGraphEvents()


  tearDown: ->
    # TODO: Consider garbage collection and event listeners
    @document.getElementById('visualizationContent').innerHTML = ''

  redraw: ->
    @svgResize()
    @buildYAxis false
    @buildXAxis false
    @buildForecast()
    if @_chart
      @_chart._duration = 0 #prevent transitioning to the new width
      @_chart.size
        w: @width()
        h: @height()
      @_chart.x @xScale()
      @_chart.y @yScale()
      @_chart._duration = @app.animationDuration
    if @_provinceMenu
      @_provinceMenu.size
        w: @d3document.select('#provincePanel').node().getBoundingClientRect().width
        h: @sourceMenuHeight()
      @_provinceMenu.update()
    if @sourceMenu
      @sourceMenu.size
        w: @d3document.select('#powerSourcePanel').node().getBoundingClientRect().width
        h: @sourceMenuHeight()
      @sourceMenu.update()

   #the graph's height
  height: ->
    height - @_margin.top - @_margin.bottom

  # We want this menu to line up with the bottom of the x axis TICKS so those must be
  # built before we can set this.
  sourceMenuHeight: ->
    @height() -
    @d3document.select('#powerSourcePanel span.titleLabel').node().getBoundingClientRect().height +
    @d3document.select('#xAxis').node().getBoundingClientRect().height +
    (@d3document.select('#xAxisForLabels text').node().getBoundingClientRect().height / 2)

  #the graph's width
  width: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      @d3document.select('#graphPanel').node().getBoundingClientRect().width - @_margin.left - @_margin.right
    else if Platform.name == 'server'
      Constants.serverSideGraphWidth - @_margin.left - @_margin.right


  svgResize: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      svgWidth = @d3document.select('#graphPanel').node().getBoundingClientRect().width
    else if Platform.name == 'server'
      svgWidth = Constants.serverSideGraphWidth

    @d3document.select '#graphSVG'
      .attr
        width: svgWidth
        height: height
    @d3document.select '#provinceMenuSVG'
      .attr
        width: @d3document.select('#provincePanel').node().getBoundingClientRect().width
        height: height - @_margin.top
    @d3document.select '#powerSourceMenuSVG'
      .attr
        width: @d3document.select('#powerSourcePanel').node().getBoundingClientRect().width
        height: height - @_margin.top

  sourceMenuData: ->
    sourcesWithColours =
      solarWindGeothermal:
        key: 'solarWindGeothermal'
        tooltip: SourceAriaText @app, @config.sources.includes('solarWindGeothermal'), 'solarWindGeothermal'
        img:
          if @zeroedOut 'solarWindGeothermal'
            'IMG/sources/unavailable/solarWindGeo_unavailable.svg'
          else if @config.sources.includes 'solarWindGeothermal'
            'IMG/sources/solarWindGeo_selected.svg'
          else
            'IMG/sources/solarWindGeo_unselected.svg'
        present: @config.sources.includes 'solarWindGeothermal'
        colour: '#339947'
      coal:
        key: 'coal'
        tooltip: SourceAriaText @app, @config.sources.includes('coal'), 'coal'
        img:
          if @zeroedOut 'coal'
            'IMG/sources/unavailable/coal_unavailable.svg'
          else if @config.sources.includes 'coal'
            'IMG/sources/coal_selected.svg'
          else
            'IMG/sources/coal_unselected.svg'
        present: @config.sources.includes 'coal'
        colour: '#996733'
      naturalGas:
        key: 'naturalGas'
        tooltip: SourceAriaText @app, @config.sources.includes('naturalGas'), 'naturalGas'
        img:
          if @zeroedOut 'naturalGas'
            'IMG/sources/unavailable/naturalGas_unavailable.svg'
          else if @config.sources.includes 'naturalGas'
            'IMG/sources/naturalGas_selected.svg'
          else
            'IMG/sources/naturalGas_unselected.svg'
        present: @config.sources.includes 'naturalGas'
        colour: '#f16739'
      bio:
        key: 'bio'
        tooltip: SourceAriaText @app, @config.sources.includes('bio'), 'bio'
        img:
          if @zeroedOut 'bio'
            'IMG/sources/unavailable/biomass_unavailable.svg'
          else if @config.sources.includes 'bio'
            'IMG/sources/biomass_selected.svg'
          else
            'IMG/sources/biomass_unselected.svg'
        present: @config.sources.includes 'bio'
        colour: '#8d68ac'
      oilProducts:
        key: 'oilProducts'
        tooltip: SourceAriaText @app, @config.sources.includes('oilProducts'), 'oilProducts'
        img:
          if @zeroedOut 'oilProducts'
            'IMG/sources/unavailable/oil_products_unavailable.svg'
          else if @config.sources.includes 'oilProducts'
            'IMG/sources/oil_products_selected.svg'
          else
            'IMG/sources/oil_products_unselected.svg'
        present: @config.sources.includes 'oilProducts'
        colour: '#cc6699'
      electricity:
        key: 'electricity'
        tooltip: SourceAriaText @app, @config.sources.includes('electricity'), 'electricity'
        img:
          if @zeroedOut 'electricity'
            'IMG/sources/unavailable/electricity_unavailable.svg'
          else if @config.sources.includes 'electricity'
            'IMG/sources/electricity_selected.svg'
          else
            'IMG/sources/electricity_unselected.svg'
        present: @config.sources.includes 'electricity'
        colour: '#33cccc'

    data = []
    for source in @config.sourcesInOrder
      data.push sourcesWithColours[source]
    data



  sourceLegendData: ->
    baseData =
      solarWindGeothermal:
        img: 'IMG/sources/solarWindGeo_selected.svg'
        present: @config.sources.includes('solarWindGeothermal') and not @zeroedOut('solarWindGeothermal')
      coal:
        img: 'IMG/sources/coal_selected.svg'
        present: @config.sources.includes('coal') and not @zeroedOut('coal')
      naturalGas:
        img: 'IMG/sources/naturalGas_selected.svg'
        present: @config.sources.includes('naturalGas') and not @zeroedOut('naturalGas')
      bio:
        img: 'IMG/sources/biomass_selected.svg'
        present: @config.sources.includes('bio') and not @zeroedOut('bio')
      oilProducts:
        img: 'IMG/sources/oil_products_selected.svg'
        present: @config.sources.includes('oilProducts') and not @zeroedOut('oilProducts')
      electricity:
        img: 'IMG/sources/electricity_selected.svg'
        present: @config.sources.includes('electricity') and not @zeroedOut('electricity')

    data = []
    for source in @config.sourcesInOrder
      data.push baseData[source] if baseData[source].present

    # Legend content is reversed because graph elements are built bottom to top,
    # but html elements will be laid out top to bottom.
    data.reverse()
    data



  colouredSourceIconsDictionary: ->
    solarWindGeothermal:
      'IMG/sources/solarWindGeo_selected.svg'
    coal:
      'IMG/sources/coal_selected.svg'
    naturalGas:
      'IMG/sources/naturalGas_selected.svg'
    bio:
      'IMG/sources/biomass_selected.svg'
    oilProducts:
      'IMG/sources/oil_products_selected.svg'
    electricity:
      'IMG/sources/electricity_selected.svg'

  # TODO: Known issue here: when a source is disabled, its data does not appear in
  # @seriesData at all. We can't determine whether the source data is all zeroes or not.
  # Currently, when a source has all zero items, it will show the zeroed out icon when
  # selected and show the de-selected icon when de-selected.
  # The desired behaviour is to show the zeroed out icon at all times, selected or not.
  # Fixing this will mean changing or adding to the data that the energy demand provider
  # returns. See NEBV-405
  zeroedOut: (key) ->
    if !(@seriesData) or !(@seriesData[key]) then return false
    nonZeroVals = @seriesData[key].filter (item) -> item.value != 0
    return nonZeroVals.length == 0

  dataForProvinceMenu: ->
    [
      {
        key: 'AB'
        tooltip: ProvinceAriaText @app, @config.province == 'AB', 'AB'
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
        tooltip: ProvinceAriaText @app, @config.province == 'BC', 'BC'
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
        tooltip: ProvinceAriaText @app, @config.province == 'MB', 'MB'
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
        tooltip: ProvinceAriaText @app, @config.province == 'NB', 'NB'
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
        tooltip: ProvinceAriaText @app, @config.province == 'NL', 'NL'
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
        tooltip: ProvinceAriaText @app, @config.province == 'NS', 'NS'
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
        tooltip: ProvinceAriaText @app, @config.province == 'NT', 'NT'
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
        tooltip: ProvinceAriaText @app, @config.province == 'NU', 'NU'
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
        tooltip: ProvinceAriaText @app, @config.province == 'ON', 'ON'
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
        tooltip: ProvinceAriaText @app, @config.province == 'PE', 'PE'
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
        tooltip: ProvinceAriaText @app, @config.province == 'QC', 'QC'
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
        tooltip: ProvinceAriaText @app, @config.province == 'SK', 'SK'
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
        tooltip: ProvinceAriaText @app, @config.province == 'YT', 'YT'
        present: true
        colour: if @config.province == 'YT' then '#333' else '#fff'
        img:
          if @config.province == 'YT'
            'IMG/provinces/radio/Yukon_SelectedR.svg'
          else
            'IMG/provinces/radio/Yukon_UnselectedR.svg'
      }
    ]

  getDataAndRender: ->
    @getData()
    @render()
    
  getData: ->
    provider = @app.providers[@config.dataset].energyConsumptionProvider
    @seriesData = provider.dataForViz2 @config
    @yAxisData = provider.dataForAllViz2Scenarios @config

  render: ->
    if @_chart?
      @adjustViz()
    else
      @buildViz()

    # update the csv data download link
    @d3document.select('#dataDownloadLink')
      .attr
        href: "csv_data#{ParamsToUrlString(@config.routerParams())}"

  # Gets the total of all the maximums (since we are stacking the data)
  graphDataMaximum: (data) ->
    totalMax = 0
    for key in Object.keys data
      totalMax += d3.max(data[key], (d) -> d.value)
    totalMax

  yScale: ->
    d3.scale.linear()
      .domain [0, @graphDataMaximum(@yAxisData)]
      .range [@height(), 0]
      .nice()

  yAxis: ->
    d3.svg.axis()
      .scale(@yScale())
      .tickSize(6,0)
      .ticks(15)
      .orient('right')
      .tickFormat d3.format('.3s')
      # .tickFormat((d) -> d3.format('s')(d3.round(d, 3)))


  yAxisGridLines: ->
    d3.svg.axis()
      .scale(@yScale())
      .tickFormat('')
      .tickSize(-1 * @width(), 0)
      .ticks(15)
      .orient 'right'

  #Redraws the Y axis
  buildYAxis: (transition = true) ->
    axis = @d3document.select('#yAxis')
      .attr
        transform: "translate(#{@width() + @_margin.left}, #{@_margin.top})"
    
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

    gridLines = @d3document.select('#yAxisGrid')
      .attr
        transform: "translate(#{@width() + @_margin.left}, #{@_margin.top})"
      
    if transition
      gridLines.transition()
          .duration @app.animationDuration
          .ease 'linear'
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

  # The 'correct' scale used by the graph
  xScale: ->
    d3.scale.linear()
      .domain([Constants.years[0], Constants.years[Constants.years.length - 1]])
      .range [0, @width()]

  xAxisForLabels: ->
    d3.svg.axis()
      .scale(@xScale())
      .tickValues(d3.range(2005, 2041, 5))
      .tickSize(0,0)
      .orient 'bottom'
      .tickFormat d3.format('g')

  xAxisForTicks: ->
    d3.svg.axis()
      .scale(@xScale())
      .ticks(36)
      .tickSize(6,0)
      .tickFormat('')
      .orient 'bottom'

  xAxisGridLines: ->
    d3.svg.axis()
      .scale(@xScale())
      .ticks(8)
      .tickFormat('')
      .tickSize(-1 * @height(), 0)
      .orient 'bottom'

  buildXAxis: (transition = true) ->
    # Add axis which use the chart's height
    axis = @d3document.select '#xAxisForTicks'
      .attr
        transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
      .call @xAxisForTicks()

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

    gridLines = @d3document.select '#xAxisGrid'
      .attr
        transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
      
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

    d3.select @document
      .select '#xAxisForLabels'
      .attr
        transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
      .call(@xAxisForLabels())
      .selectAll 'text'
        .style
          'text-anchor': 'middle'
        .attr
          dy: '1.5em'

  buildForecast: ->
    @d3document.selectAll('.forecast').remove()

    textX = @_margin.left + @xScale()(2015)
    textY = height - 16
    @d3document.select('#graphSVG')
      .append 'text'
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{textX},#{textY})"
          fill: '#999'
        .style 'text-anchor', 'start'
        .text Tr.forecastLabel[@app.language]

    arrowX = @_margin.left + @xScale()(2015) + 65
    arrowY = height - 27
    @d3document.select('#graphSVG')
      .append 'image'
        .attr
          class: 'forecast'
          transform: "translate(#{arrowX},#{arrowY})"
          'xlink:xlink:href': 'IMG/forecast_arrow.svg'
          height: 9
          width: 200

    @d3document.select('#graphSVG')
      .append 'line'
        .attr
          class: 'forecast'
          stroke: '#999'
          'stroke-width': 2
          # We want the line in the middle of the years
          x1: @_margin.left + @xScale()(2014)
          y1: @height() + @_margin.top
          # We want the line in the middle of the years
          x2: @_margin.left + @xScale()(2014)
          y2: height - 16

  buildViz:  ->
    @buildYAxis()
    @buildXAxis()
    
    # Build the forecast
    @buildForecast()

    stackedOptions =
      size:
        w: @width()
        h: @height()
      position:
        x: @_margin.left
        y: @_margin.top
      data:
        @seriesData
      mapping:
        @sourceMenuData()
      duration:
        @app.animationDuration
      groupId:
        'graphGroup'
      areaElementClick: (d) =>
        graphPanel = @document.getElementById 'graphPanel'
        coords = d3.mouse graphPanel

        @accessConfig.setYear Math.floor(@xScale().invert(coords[0]))
        @accessConfig.setSource d.key

        @updateAccessibleFocus()



    @_chart = new stackedAreaChart @app, '#graphSVG', @xScale(), @yScale(), stackedOptions

    @_provinceMenu = @buildProvinceMenu()
    @sourceMenu = @buildSourceMenu()

    # Build a dot to serve as the accessible focus
    @buildAccessibleFocusDot()



  adjustViz: ->
    @_chart.mapping @sourceMenuData()
    @_chart.data @seriesData
    @_chart.y @yScale()
    @buildYAxis()

    @sourceMenu.data @sourceMenuData()
    @sourceMenu.update()


  orderChanged: (newOrder) =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setSourcesInOrder newOrder

    update = =>
      @config.setSourcesInOrder newOrder
      @_chart.mapping @sourceMenuData()
      @sourceMenu.data @sourceMenuData()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update





    
  menuSelect: (dataDictionaryItem) =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.flipSource dataDictionaryItem.key

    update = =>
      @config.flipSource dataDictionaryItem.key
      @getDataAndRender()

      @sourceMenu.data @sourceMenuData()
      @sourceMenu.update()

      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  selectAllStacked: =>
    newConfig = new @config.constructor @app
    newConfig.copy @config

    if @config.sources.length == Constants.viz2Sources.length
      # If all sources are present, select none
      newConfig.resetSources false
    else if @config.sources.length > 0
      # If some sources are selected, select all
      newConfig.resetSources true
    else if @config.sources.length == 0
      # If no sources are selected, select all
      newConfig.resetSources true

    update = =>
      if @config.sources.length == Constants.viz2Sources.length
        # If all sources are present, select none
        @config.resetSources false
      else if @config.sources.length > 0
        # If some sources are selected, select all
        @config.resetSources true
      else if @config.sources.length == 0
        # If no sources are selected, select all
        @config.resetSources true

      @getDataAndRender()
      @sourceMenu.data @sourceMenuData()
      @sourceMenu.update()

      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update


  # Black and white non multi select menu.
  buildProvinceMenu: ->
    options =
      displayHelpIcon: true
      parentId: 'provinceMenuSVG'
      groupId: 'provinceMenu'
      onSelected: @provinceSelected
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

    state =
      size:
        w: @d3document.select('#provinceMenuSVG').node().getBoundingClientRect().width
        h: @sourceMenuHeight()
      data: @dataForProvinceMenu()

    new SquareMenu @app, options, state


  buildSourceMenu: ->
    options =
      displayHelpIcon: true
      parentId: 'powerSourceMenuSVG'
      groupId: 'stackMenu'
      onSelected: @menuSelect
      allSquareHandler: @selectAllStacked
      # Popovers are not defined on server, so we use ?.
      showHelpHandler: @sourcesHelpPopover?.showPopoverCallback
      orderChangedHandler: @orderChanged
      canDrag: true
      helpButtonLabel: Tr.altText.sourcesHelp[@app.language]
      helpButtonId: 'sourceHelpButton'
      getAllIcon: =>
        if @config.sources.length == Constants.viz2Sources.length
          Tr.allSelectorButton.all[@app.language]
        else if @config.sources.length > 0
          Tr.allSelectorButton.someSelected[@app.language]
        else if @config.sources.length == 0
          Tr.allSelectorButton.none[@app.language]
      getAllLabel: =>
        if @config.sources.length == Constants.viz2Sources.length
          Tr.altText.allButton.allSourcesSelected[@app.language]
        else if @config.sources.length > 0
          Tr.altText.allButton.someSourcesSelected[@app.language]
        else if @config.sources.length == 0
          Tr.altText.allButton.noSourcesSelected[@app.language]
      onDragStart: @_chart.dragStart
      onDragEnd: @_chart.dragEnd
      boxSize: 37.5

    state =
      size:
        w: @d3document.select('#powerSourcePanel').node().getBoundingClientRect().width
        h: @sourceMenuHeight()
      data: @sourceMenuData()

    new SquareMenu @app, options, state



  selectAllProvince: =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince 'all'

    update = =>
      @config.setProvince 'all'
      @_provinceMenu.data @dataForProvinceMenu()
      @_provinceMenu.update()
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  provinceSelected: (dataDictionaryItem) =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince dataDictionaryItem.key

    update = =>
      @config.setProvince dataDictionaryItem.key
      @_provinceMenu.data @dataForProvinceMenu()
      @_provinceMenu.update()
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  setupGraphEvents: ->
    graphElement = @document.getElementById 'graphPanel'

    graphElement.addEventListener 'keydown', (event) =>

      # Only process the input if there is at least one selected source
      return if @config.sources.length == 0

      switch event.key
        when 'ArrowRight'
          event.preventDefault()
          @accessConfig.setYear @accessConfig.activeYear + 1
          @updateAccessibleFocus()
        when 'ArrowLeft'
          event.preventDefault()
          @accessConfig.setYear @accessConfig.activeYear - 1
          @updateAccessibleFocus()
        when 'ArrowUp'
          event.preventDefault()
          @accessConfig.setSource @config.nextActiveSourceForward(@accessConfig.activeSource)
          @updateAccessibleFocus()
        when 'ArrowDown'
          event.preventDefault()
          @accessConfig.setSource @config.nextActiveSourceReverse(@accessConfig.activeSource)
          @updateAccessibleFocus()

    graphElement.addEventListener 'focus', =>
      # When we return to focusing the graph element, the graph sub element that the user
      # had focused may have been toggled off (by removing the source).
      # Calling validate ensures that the sub-focus element is positioned correctly
      if @config.sources.length > 0
        @accessConfig.validate @config
        @updateAccessibleFocus()
      else
        # If there are no active sources, we handle the special case
        @d3document.select '#graphPanel'
          .attr
            'aria-label': Tr.altText.emptySourceSelection[@app.language]
        @accessibleFocusDot.attr
          transform: 'translate(-1000, -1000)'
        @_chart.tooltip.style.visibility = 'hidden'


  updateAccessibleFocus: ->
    item = @_chart.getStackDictionaryInfoForAccessibility @accessConfig.activeSource, @accessConfig.activeYear
    # The case where there is no active item is handled before the call to
    # updateAccessibleFocus
    return unless item?

    xCoord = @xScale()(item.x)
    yCoord = @yScale()(item.y + item.y0)
    @accessibleFocusDot.attr
      transform: "translate(#{xCoord}, #{yCoord})"

    sourceString = Tr.sourceSelector.sources[@accessConfig.activeSource][@app.language]
    unitString = Tr.altText.unitNames[@config.unit][@app.language]
    description = "#{sourceString} #{@accessConfig.activeYear}, #{item.y.toFixed 2} #{unitString}"
    @d3document.select '#graphPanel'
      .attr
        'aria-label': description
    @accessibleStatusElement.innerHTML = description

    @_chart.displayTooltipKeyboard @accessConfig.activeSource, @accessConfig.activeYear, item.y, @accessibleFocusDotElement



  buildAccessibleFocusDot: ->
    return if Platform.name == 'server'
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


module.exports = Visualization2