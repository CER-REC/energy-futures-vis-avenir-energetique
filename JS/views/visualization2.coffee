_ = require 'lodash'
d3 = require 'd3'
Mustache = require 'mustache'


visualization = require './visualization.coffee'
stackedAreaChart = require '../charts/stacked-area-chart.coffee'
SquareMenu = require '../charts/SquareMenu.coffee'
Constants = require '../Constants.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'
ApplicationRoot = require '../../ApplicationRoot.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'

if Platform.name == "browser"
  Visualization2Template = require '../templates/Visualization2.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'


class Visualization2 extends visualization
  height = 700 

  renderBrowserTemplate: ->
    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render Visualization2Template,
      selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language] 
      selectSectorLabel: Tr.sectorSelector.selectSectorLabel[@app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[@app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      selectSourceLabel: Tr.sourceSelector.selectSourceLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate

      altText: 
        sectorsHelp: Tr.altText.sectorsHelp[@app.language]
        unitsHelp: Tr.altText.unitsHelp[@app.language]
        datasetsHelp: Tr.altText.datasetsHelp[@app.language]
        scenariosHelp: Tr.altText.scenariosHelp[@app.language]

    @datasetHelpPopover = new ControlsHelpPopover(@app)
    @sectorsSelectorHelpPopover = new ControlsHelpPopover(@app)
    @unitsHelpPopover = new ControlsHelpPopover(@app)
    @scenariosHelpPopover = new ControlsHelpPopover(@app)
    @sourcesHelpPopover = new ControlsHelpPopover(@app)
    @provincesHelpPopover = new ControlsHelpPopover(@app)

    d3.select(@app.window.document).select '#datasetSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @datasetHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @datasetHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover datasetSelectorHelp'
            innerClasses: 'viz2HelpTitle'
            title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
            content: Tr.datasetSelector.datasetSelectorHelp[@app.language]
            attachmentSelector: '.datasetSelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz2 dataset help'

    d3.select(@app.window.document).select '#sectorSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @sectorsSelectorHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @sectorsSelectorHelpPopover, 
            outerClasses: 'vizModal controlsHelpPopover sectorHelp'
            innerClasses: 'viz2HelpTitle'
            title: Tr.sectorSelector.sectorSelectorHelpTitle[@app.language]
            content: Tr.sectorSelector.sectorSelectorHelp[@app.language]
            attachmentSelector: '.sectorSelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz2 sector help'

    d3.select(@app.window.document).select '#unitSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @unitsHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @unitsHelpPopover, 
            outerClasses: 'vizModal controlsHelpPopover unitSelectorHelp'
            innerClasses: 'viz2HelpTitle'
            title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
            content: Tr.unitSelector.unitSelectorHelp[@app.language]
            attachmentSelector: '.unitsSelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz2 unit help'

    d3.select(@app.window.document).select '#scenarioSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @scenariosHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @scenariosHelpPopover, 
            outerClasses: 'vizModal controlsHelpPopover scenarioSelectorHelp'
            innerClasses: 'viz2HelpTitle'
            title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
            content: Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
            attachmentSelector: '.scenarioSelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz2 scenario help'


  renderServerTemplate: ->
    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render @options.template, 
        svgStylesheet: @options.svgTemplate
        title: Tr.visualization2Title[@app.language]
        description: @config.imageExportDescription()
        energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
        bitlyLink: @app.bitlyLink
        legendContent: @sourceLegendData()


  constructor: (@app, config, @options) ->
    super(config)

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
    @svgSize()
    @addDatasetToggle()
    @addUnitToggle()
    @addSectors()
    @addScenarios()
    @render()

  redraw: ->
    @svgSize()   
    @buildYAxis(false)
    @buildXAxis(false)    
    @buildForecast()
    if @_chart
      @_chart._duration = 0 #prevent transitioning to the new width
      @_chart.size
        w: @width()
        h: @height()
      @_chart.x(@xScale()) 
      @_chart.y(@yScale())
      @_chart._duration = @app.animationDuration
      @_chart.menu.size
        w: d3.select(@app.window.document).select('#powerSourcePanel').node().getBoundingClientRect().width
        h: @sourceMenuHeight()
    if @_provinceMenu
      @_provinceMenu.size
        w: d3.select(@app.window.document).select('#provincePanel').node().getBoundingClientRect().width
        h: @sourceMenuHeight()

   #the graph's height
  height: ->
    height - @_margin.top - @_margin.bottom

  #arg so we want this menu to line up with the bottom of the x axis TICKS so those must be built before we can set this.
  sourceMenuHeight: ->
    @height() - 
    d3.select(@app.window.document).select('#powerSourcePanel span.titleLabel').node().getBoundingClientRect().height +
    d3.select(@app.window.document).select('#xAxis').node().getBoundingClientRect().height +
    (d3.select(@app.window.document).select('#xAxisForLabels text').node().getBoundingClientRect().height / 2)

  #the graph's width
  width: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      d3.select(@app.window.document).select('#graphPanel').node().getBoundingClientRect().width - @_margin.left - @_margin.right
    else if Platform.name == 'server'
      Constants.serverSideGraphWidth - @_margin.left - @_margin.right


  svgSize: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      svgWidth = d3.select(@app.window.document).select('#graphPanel').node().getBoundingClientRect().width
    else if Platform.name == 'server'
      svgWidth = Constants.serverSideGraphWidth

    d3.select(@app.window.document).select '#graphSVG'
      .attr
        width: svgWidth
        height: height
    d3.select(@app.window.document).select '#provinceMenuSVG'
      .attr
        width: d3.select(@app.window.document).select('#provincePanel').node().getBoundingClientRect().width
        height: height - @_margin.top
    d3.select(@app.window.document).select "#powerSourceMenuSVG" 
     .attr
        width: d3.select(@app.window.document).select('#powerSourcePanel').node().getBoundingClientRect().width
        height: height - @_margin.top

  sourceMenuData: ->
    sourcesWithColours = {  
        solarWindGeothermal:
          key: 'solarWindGeothermal'
          tooltip: Tr.sourceSelector.sourceSelectorHelp.solarWindGeothermal[@app.language]
          img: 
            if @zeroedOut('solarWindGeothermal') 
              'IMG/sources/unavailable/solarWindGeo_unavailable.svg'
            else
              if @config.sources.includes 'solarWindGeothermal' then 'IMG/sources/solarWindGeo_selected.svg' else 'IMG/sources/solarWindGeo_unselected.svg'
          present: if @config.sources.includes 'solarWindGeothermal' then true else false
          colour: '#339947'
        coal:
          key: 'coal'
          tooltip: Tr.sourceSelector.sourceSelectorHelp.coal[@app.language]
          img: 
            if @zeroedOut('coal') 
              'IMG/sources/unavailable/coal_unavailable.svg'
            else
              if @config.sources.includes 'coal' then 'IMG/sources/coal_selected.svg' else 'IMG/sources/coal_unselected.svg'
          present: if @config.sources.includes 'coal' then true else false
          colour: '#996733'
        naturalGas:
          key: 'naturalGas' 
          tooltip: Tr.sourceSelector.sourceSelectorHelp.naturalGas[@app.language]
          img: 
            if @zeroedOut('naturalGas') 
              'IMG/sources/unavailable/naturalGas_unavailable.svg'
            else
              if @config.sources.includes 'naturalGas' then 'IMG/sources/naturalGas_selected.svg' else 'IMG/sources/naturalGas_unselected.svg'
          present: if @config.sources.includes 'naturalGas' then true else false
          colour: '#f16739'
        bio:
          key: 'bio' 
          tooltip: Tr.sourceSelector.sourceSelectorHelp.bio[@app.language]
          img: 
            if @zeroedOut('bio') 
              'IMG/sources/unavailable/biomass_unavailable.svg'
            else
              if @config.sources.includes 'bio' then 'IMG/sources/biomass_selected.svg' else 'IMG/sources/biomass_unselected.svg'
          present: if @config.sources.includes 'bio' then true else false
          colour: '#8d68ac'
        oilProducts:
          key: 'oilProducts'
          tooltip: Tr.sourceSelector.sourceSelectorHelp.oilProducts[@app.language]
          img: 
            if @zeroedOut('oilProducts') 
              'IMG/sources/unavailable/oil_products_unavailable.svg'
            else
              if @config.sources.includes 'oilProducts' then 'IMG/sources/oil_products_selected.svg' else 'IMG/sources/oil_products_unselected.svg'
          present: if @config.sources.includes 'oilProducts' then true else false
          colour: '#cc6699'
        electricity:  
          key: 'electricity' 
          tooltip: Tr.sourceSelector.sourceSelectorHelp.electricity[@app.language]
          img: 
            if @zeroedOut('electricity') 
              'IMG/sources/unavailable/electricity_unavailable.svg'
            else
              if @config.sources.includes 'electricity' then 'IMG/sources/electricity_selected.svg' else 'IMG/sources/electricity_unselected.svg'
          present: if @config.sources.includes 'electricity' then true else false
          colour: '#33cccc'
      }
    data = []
    for source in @config.sourcesInOrder
      data.push(sourcesWithColours[source])
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
    sourcesWithColours = {  
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
      }

  getSelectionState: ->
    if @config.sourcesInOrder.length != @config.sources.length
      allSelected = false
      if @config.sources.length > 0
        someSelected =  true
      else
        someSelected = false
    else
      allSelected = true
      someSelected = false
    {
      allSelected: allSelected
      someSelected: someSelected
    }

  zeroedOut: (key) ->
    if !(@seriesData) or !(@seriesData[key]) then return false
    nonZeroVals = @seriesData[key].filter (item) -> item.value != 0
    return nonZeroVals.length == 0

  dataForProvinceMenu: ->
    [  
      {
        key: 'AB'
        tooltip: Tr.regionSelector.names.AB[@app.language]
        present: true
        colour: if @config.province == 'AB' then '#333' else '#fff'
        img: if @config.province == 'AB' then 'IMG/provinces/radio/AB_SelectedR.svg' else 'IMG/provinces/radio/AB_UnselectedR.svg'
      }
      {
        key: 'BC'
        tooltip: Tr.regionSelector.names.BC[@app.language]
        present: true
        colour: if @config.province == 'BC' then '#333' else '#fff'
        img: if @config.province == 'BC' then 'IMG/provinces/radio/BC_SelectedR.svg' else 'IMG/provinces/radio/BC_UnselectedR.svg'
      }
      {
        key: 'MB'
        tooltip: Tr.regionSelector.names.MB[@app.language]
        present: true
        colour: if @config.province == 'MB' then '#333' else '#fff'
        img: if @config.province == 'MB' then 'IMG/provinces/radio/MB_SelectedR.svg' else 'IMG/provinces/radio/MB_UnselectedR.svg'
      }     
      {
        key: 'NB'
        tooltip: Tr.regionSelector.names.NB[@app.language]
        present: true
        colour: if @config.province == 'NB' then '#333' else '#fff'
        img: if @config.province == 'NB' then 'IMG/provinces/radio/NB_SelectedR.svg' else 'IMG/provinces/radio/NB_UnselectedR.svg'
      }
      {
        key : 'NL'
        tooltip: Tr.regionSelector.names.NL[@app.language]
        present: true
        colour: if @config.province == 'NL' then '#333' else '#fff'
        img: if @config.province == 'NL' then 'IMG/provinces/radio/NL_SelectedR.svg' else 'IMG/provinces/radio/NL_UnselectedR.svg'
      }
      {
        key: 'NS'
        tooltip: Tr.regionSelector.names.NS[@app.language]
        present: true
        colour: if @config.province == 'NS' then '#333' else '#fff'
        img: if @config.province == 'NS' then 'IMG/provinces/radio/NS_SelectedR.svg' else 'IMG/provinces/radio/NS_UnselectedR.svg'
      }
      {
        key: 'NT'
        tooltip: Tr.regionSelector.names.NT[@app.language]
        present: true
        colour: if @config.province == 'NT' then '#333' else '#fff'
        img: if @config.province == 'NT' then 'IMG/provinces/radio/NT_SelectedR.svg' else 'IMG/provinces/radio/NT_UnselectedR.svg'
      }
      { 
        key: 'NU'
        tooltip: Tr.regionSelector.names.NU[@app.language]
        present: true
        colour: if @config.province == 'NU' then '#333' else '#fff'
        img: if @config.province == 'NU' then 'IMG/provinces/radio/NU_SelectedR.svg' else 'IMG/provinces/radio/NU_UnselectedR.svg'
      }
      { 
        key: 'ON'
        tooltip: Tr.regionSelector.names.ON[@app.language]
        present: true
        colour: if @config.province == 'ON' then '#333' else '#fff'
        img: if @config.province == 'ON' then 'IMG/provinces/radio/ON_SelectedR.svg' else 'IMG/provinces/radio/ON_UnselectedR.svg'
      }
      {
        key: 'PE'
        tooltip: Tr.regionSelector.names.PE[@app.language]
        present: true
        colour: if @config.province == 'PE' then '#333' else '#fff'
        img: if @config.province == 'PE' then 'IMG/provinces/radio/PEI_SelectedR.svg' else 'IMG/provinces/radio/PEI_UnselectedR.svg'
      }
      { 
        key: 'QC'
        tooltip: Tr.regionSelector.names.QC[@app.language]
        present: true
        colour: if @config.province == 'QC' then '#333' else '#fff'
        img: if @config.province == 'QC' then 'IMG/provinces/radio/QC_SelectedR.svg' else 'IMG/provinces/radio/QC_UnselectedR.svg'
      }
      {
        key: 'SK'
        tooltip: Tr.regionSelector.names.SK[@app.language]
        present: true
        colour: if @config.province == 'SK' then '#333' else '#fff'
        img: if @config.province == 'SK' then 'IMG/provinces/radio/Sask_SelectedR.svg' else 'IMG/provinces/radio/Sask_UnselectedR.svg'
      }
      {
        key: 'YT'
        tooltip: Tr.regionSelector.names.YT[@app.language]
        present: true
        colour: if @config.province == 'YT' then '#333' else '#fff'
        img: if @config.province == 'YT' then 'IMG/provinces/radio/Yukon_SelectedR.svg' else 'IMG/provinces/radio/Yukon_UnselectedR.svg'
      }
    ]

  getDataAndRender: ->
    @getData()
    @render()
    
  getData: ->
    @seriesData = @app.providers[@config.dataset].energyConsumptionProvider.dataForViz2 @config
    @yAxisData = @app.providers[@config.dataset].energyConsumptionProvider.dataForAllViz2Scenarios @config

  render: ->
    if @_chart?
      @adjustViz()
    else
      @buildViz()

    # update the csv data download link
    d3.select(@app.window.document).select("#dataDownloadLink")
      .attr
        href: "csv_data#{ParamsToUrlString(@config.routerParams())}"

  #Gets the total of all the maximums (since we are stacking the data)
  graphDataMaximum: (data) ->
    totalMax = 0
    for key in Object.keys data
      totalMax+= d3.max(data[key], (d) -> d.value)
    totalMax

  yScale: ->
    d3.scale.linear()
      .domain([
        0 
        @graphDataMaximum(@yAxisData)
      ])
      .range [@height(), 0]
      .nice()

  yAxis: ->
    d3.svg.axis()
      .scale(@yScale())
      .tickSize(6,0)
      .ticks(15)
      .orient("right")
      .tickFormat(d3.format('.3s'))
      # .tickFormat((d) -> d3.format('s')(d3.round(d, 3)))


  yAxisGridLines: ->
    d3.svg.axis()
      .scale(@yScale())
      .tickFormat("")
      .tickSize(-1 * @width(), 0)
      .ticks(15)
      .orient("right")

  #Redraws the Y axis
  buildYAxis: (transition = true) ->
    axis = d3.select(@app.window.document).select("#yAxis")
      .attr
        transform: "translate(#{@width() + @_margin.left}, #{@_margin.top})"
    
    axis.transition()
        .duration @app.animationDuration
        .ease "linear" 
        .call(@yAxis())
    
    axis.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    axis.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    gridLines = d3.select(@app.window.document).select("#yAxisGrid")
      .attr
        transform: "translate(#{@width() + @_margin.left}, #{@_margin.top})"
      
    if transition  
      gridLines.transition()
          .duration @app.animationDuration
          .ease "linear" 
          .call(@yAxisGridLines())
    else
      gridLines.call @yAxisGridLines()

    gridLines.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    gridLines.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#E6E6E6'
        'stroke-width': "1"
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
      .orient("bottom")
      .tickFormat(d3.format('g'))

  xAxisForTicks: ->
    d3.svg.axis()
      .scale(@xScale())
      .ticks(36)
      .tickSize(6,0)
      .tickFormat("")
      .orient("bottom")

  xAxisGridLines: ->
    d3.svg.axis()
      .scale(@xScale())
      .ticks(8)
      .tickFormat("")
      .tickSize(-1 * @height(), 0)
      .orient("bottom")

  buildXAxis: (transition= true) ->
    # Add axis which use the chart's height
    axis = d3.select(@app.window.document).select("#xAxisForTicks")
      .attr
        transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
      .call(@xAxisForTicks())   

    axis.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    axis.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    gridLines = d3.select(@app.window.document).select '#xAxisGrid'
      .attr
        transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
      
    if transition  
      gridLines.transition()
        .ease "linear"
        .duration @app.animationDuration
          .call @xAxisGridLines()  
    else
      gridLines.call @xAxisGridLines()

    gridLines.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    gridLines.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#E6E6E6'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    axisForLabels = d3.select(@app.window.document).select("#xAxisForLabels")
        .attr
          transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
        .call(@xAxisForLabels())
        .selectAll("text") 
          .style 
            "text-anchor": "middle"
          .attr
            dy: "1.5em"

  buildForecast: ->
    d3.select(@app.window.document).selectAll('.forecast').remove()

    textX = @_margin.left + @xScale()(2015)
    textY = height - 16    
    d3.select(@app.window.document).select('#graphSVG')
      .append("text")
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{textX},#{textY})" 
          fill: '#999'
        .style("text-anchor", "start")
        .text(Tr.forecastLabel[@app.language])

    arrowX = @_margin.left + @xScale()(2015) + 65
    arrowY = height - 27
    d3.select(@app.window.document).select('#graphSVG')
      .append("image")
        .attr
          class: 'forecast'
          transform: "translate(#{arrowX},#{arrowY})" 
          "xlink:xlink:href": 'IMG/forecast_arrow.svg'
          height: 9
          width: 200

    d3.select(@app.window.document).select('#graphSVG')
      .append("line")
        .attr
          class: 'forecast'
          stroke: '#999'
          'stroke-width': 2
          x1: @_margin.left + @xScale()(2014) #We want the line in the middle of the years
          y1: @height() + @_margin.top 
          x2: @_margin.left + @xScale()(2014)  #We want the line in the middle of the years
          y2: height - 16

  buildViz:  ->
    @buildYAxis()
    @buildXAxis()    
    
    #Build the forecast 
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
      menuOptions: 
        selector: '#powerSourceMenuSVG'
        boxSize: 37.5
        size: 
          w: d3.select(@app.window.document).select('#powerSourcePanel').node().getBoundingClientRect().width
          h: @sourceMenuHeight()
        onSelected:
          @menuSelect
        orderChangedHandler:
          @orderChanged
        showHelpHandler:
          @showSourceNames
        allSelected:
          @getSelectionState().allSelected
        someSelected:
          @getSelectionState().someSelected
        allSquareHandler:
          @selectAllStacked
        groupId:
          'stackMenu'
    @_chart = new stackedAreaChart(@app, "#graphSVG", @xScale(), @yScale(), stackedOptions)   
    @_provinceMenu = @buildProvinceMenu()

  adjustViz: (data, key, sumBy) ->
    @_chart.menu.allSelected @getSelectionState().allSelected
    @_chart.menu.someSelected @getSelectionState().someSelected

    @_chart.mapping(@sourceMenuData())
    @_chart.data(@seriesData)
    @_chart.y(@yScale())    
    @buildYAxis()

  orderChanged: (newLocation, currentLocation) =>
    if currentLocation > newLocation
      temp_data = _.concat(@config.sourcesInOrder[0...newLocation], @config.sourcesInOrder[currentLocation],@config.sourcesInOrder[newLocation...currentLocation], @config.sourcesInOrder[(currentLocation+1)..])
    if currentLocation < newLocation 
      temp_data = _.concat(@config.sourcesInOrder[0...currentLocation], @config.sourcesInOrder[(currentLocation+1)..newLocation], @config.sourcesInOrder[currentLocation], @config.sourcesInOrder[(newLocation+1)..])
    return unless temp_data?  

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setSourcesInOrder temp_data

    update = =>
      @config.setSourcesInOrder temp_data
      @_chart.mapping(@sourceMenuData())
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update





    
  menuSelect: (key) =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.flipSource(key)

    update = =>
      @config.flipSource(key)
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  selectAllStacked: (selecting) =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.resetSources selecting 

    update = =>
      @config.resetSources selecting 
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  showSourceNames: =>
    d3.event.stopPropagation()
    d3.event.preventDefault()
    if @app.popoverManager.currentPopover == @sourcesHelpPopover
      @app.popoverManager.closePopover()
    else
      #Grab the provinces in order for the string
      contentString = ""
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

      @app.popoverManager.showPopover @sourcesHelpPopover, 
        outerClasses: 'vizModal controlsHelpPopover popOverLg sourceSelectorHelp'
        title: Tr.sourceSelector.selectSourceLabel[@app.language]
        content: contentString
        attachmentSelector: '#powerSourceSelector'
      @app.analyticsReporter.reportEvent 'Controls help', 'Viz2 source help'


  # Black and white non multi select menu.
  buildProvinceMenu: ->
    provinceOptions=
      size: 
          w: d3.select(@app.window.document).select('#provinceMenuSVG').node().getBoundingClientRect().width
          h: @sourceMenuHeight()
      canDrag: false
      hasChart: false
      parentClass: 'provinceMenu'
      data: @dataForProvinceMenu()
      onSelected:
        @provinceSelected
      allSelected: (@config.province == 'all')
      addAllSquare: true
      allSquareHandler:
        @selectAllProvince
      showHelpHandler:
        @showProvinceNames
      groupId:
        'provinceMenu'
    new SquareMenu(@app, '#provinceMenuSVG', provinceOptions) 

  selectAllProvince: (selecting) =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince 'all'

    update = =>
      @config.setProvince 'all'
      @_provinceMenu.allSelected(true)
      @_provinceMenu.data(@dataForProvinceMenu())
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  provinceSelected: (key) =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince key

    update = =>
      @_provinceMenu.allSelected(false)
      @config.setProvince key
      @_provinceMenu.data(@dataForProvinceMenu())
      @_provinceMenu.redraw()
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update





  showProvinceNames: =>
    d3.event.stopPropagation()
    d3.event.preventDefault()
    if @app.popoverManager.currentPopover == @provincesHelpPopover
      @app.popoverManager.closePopover()
    else
      #Grab the provinces in order for the string
      contentString = ""
      for province in @dataForProvinceMenu()
        contentString = """<div class="provinceLabel"> <h2> #{Tr.regionSelector.names[province.key][@app.language]} </h2> </div>""" + contentString

      @app.popoverManager.showPopover @provincesHelpPopover, 
        outerClasses: 'vizModal controlsHelpPopover popOverSm provinceHelp'
        title: Tr.regionSelector.selectRegionLabel[@app.language]
        content: contentString
        attachmentSelector: '#provincesSelector'
      @app.analyticsReporter.reportEvent 'Controls help', 'Viz2 region help'

module.exports = Visualization2