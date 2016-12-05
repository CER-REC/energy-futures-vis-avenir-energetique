_ = require 'lodash'
d3 = require 'd3'
Mustache = require 'mustache'


visualization = require './visualization.coffee'
stackedBarChart = require '../charts/stacked-bar-chart.coffee'
Constants = require '../Constants.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'
ApplicationRoot = require '../../ApplicationRoot.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'

if Platform.name == "browser"
  Visualization1Template = require '../templates/Visualization1.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'
else if Platform.name == "server"
  fs = require 'fs'
  Visualization1ServerTemplate = fs.readFileSync("#{ApplicationRoot}/JS/templates/Visualization1Server.mustache").toString()
  SvgStylesheetTemplate = fs.readFileSync("#{ApplicationRoot}/JS/templates/SvgStylesheet.css").toString()

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'


class Visualization1 extends visualization

  
  height = 700 
  

  renderBrowserTemplate: ->
    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render Visualization1Template, 
        selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
        selectOneLabel: Tr.mainSelector.selectOneLabel[@app.language]
        selectUnitLabel: Tr.unitSelector.selectUnitLabel[@app.language]
        selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
        selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
        svgStylesheet: SvgStylesheetTemplate

    @datasetHelpPopover = new ControlsHelpPopover(@app)
    @mainSelectorHelpPopover = new ControlsHelpPopover(@app)
    @unitsHelpPopover = new ControlsHelpPopover(@app)
    @scenariosHelpPopover = new ControlsHelpPopover(@app)
    @provincesHelpPopover = new ControlsHelpPopover(@app)

    d3.select(@app.window.document).select '.datasetSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @datasetHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @datasetHelpPopover,
            outerClasses: 'vizModal floatingPopover datasetSelectorHelp'
            innerClasses: 'viz1HelpTitle'
            title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
            content: Tr.datasetSelector.datasetSelectorHelp[@app.language]
            attachmentSelector: '.datasetSelectorGroup'

    d3.select(@app.window.document).select '.mainSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @mainSelectorHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @mainSelectorHelpPopover, 
            outerClasses: 'vizModal floatingPopover mainSelectorHelp'
            innerClasses: 'viz1HelpTitle'
            title: Tr.mainSelector.selectOneLabel[@app.language]
            content: Tr.mainSelector.mainSelectorHelp[@app.language]
            attachmentSelector: '.mainSelectorSection'
          
    d3.select(@app.window.document).select '.unitSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @unitsHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @unitsHelpPopover, 
            outerClasses: 'vizModal floatingPopover unitSelectorHelp'
            innerClasses: 'viz1HelpTitle'
            title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
            content: Tr.unitSelector.unitSelectorHelp[@app.language]
            attachmentSelector: '.unitsSelectorGroup'
    
    d3.select(@app.window.document).select '.scenarioSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @scenariosHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @scenariosHelpPopover, 
            outerClasses: 'vizModal floatingPopover scenarioSelectorHelp'
            innerClasses: 'viz1HelpTitle'
            title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
            content: Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
            attachmentSelector: '.scenarioSelectorGroup'


  renderServerTemplate: () ->

    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render Visualization1ServerTemplate, 
        svgStylesheet: SvgStylesheetTemplate
        title: Tr.visualization1Titles[@config.mainSelection][@app.language]
        description: @config.imageExportDescription()
        energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
        bitlyLink: '' # TODO: Integrate with bitly
        legendContent: @provinceLegendData()




  constructor: (@app, config)  ->   
    super(config)

    @getData()

    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @addDatasetToggle()

    @_margin = 
      top: 20
      bottom: 70
      left: 9 #necessary for the labels at the bottom
      right: 60
    @_barMargin = 2
    @svgSize()
    @addDatasetToggle()
    @addMainSelector()
    @addUnitToggle()
    @addScenarios()
    @render()


  redraw: ->
    @svgSize()
    @buildXAxis()
    @buildYAxis()
    @buildForecast()
    if @_chart
      @_chart.size
        w: @width()
        h: @height()
      @_chart.x @xScale()
      @_chart.y @yScale()
      @_chart.barSize @barSize()
      @_chart.menu.size
        w: d3.select(@app.window.document).select('#provincePanel').node().getBoundingClientRect().width
        h: @provinceMenuHeight()


  #the graph's height
  height: ->
    height - @_margin.top - @_margin.bottom

  #arg so we want this menu to line up with the bottom of the x axis TICKS so those must be built before we can set this.
  provinceMenuHeight: ->
    @height() - 
    d3.select(@app.window.document).select('span.titleLabel').node().getBoundingClientRect().height + 
    d3.select(@app.window.document).select('#xAxis').node().getBoundingClientRect().height + 
    (d3.select(@app.window.document).select('#xAxisForLabels text').node().getBoundingClientRect().height /2)

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

  provinceMenuData: ->
    provinceColours = {  
      'BC' :
        tooltip: Tr.regionSelector.names.BC[@app.language]
        present: if @config.provinces.includes 'BC' then true else false
        colour: '#AEC7E8'
        img: 
          if @zeroedOut('BC') 
            'IMG/provinces/DataUnavailable/BC_Unavailable.svg'
          else
            if @config.provinces.includes 'BC' then 'IMG/provinces/colour/BC_Selected.svg' else 'IMG/provinces/colour/BC_Unselected.svg'
      'AB' :
        tooltip: Tr.regionSelector.names.AB[@app.language]
        present: if @config.provinces.includes 'AB' then true else false
        colour: '#2278b5'
        img: 
          if @zeroedOut('AB') 
            'IMG/provinces/DataUnavailable/AB_Unavailable.svg'
          else
            if @config.provinces.includes 'AB' then 'IMG/provinces/colour/AB_Selected.svg' else 'IMG/provinces/colour/AB_Unselected.svg'
      'SK' : 
        tooltip: Tr.regionSelector.names.SK[@app.language]
        present: if @config.provinces.includes 'SK' then true else false
        colour: '#d77ab1'
        img: 
          if @zeroedOut('SK') 
            'IMG/provinces/DataUnavailable/SK_Unavailable.svg'
          else
            if @config.provinces.includes 'SK' then 'IMG/provinces/colour/Sask_Selected.svg' else 'IMG/provinces/colour/Sask_Unselected.svg'
      'MB' : 
        tooltip: Tr.regionSelector.names.MB[@app.language]
        present: if @config.provinces.includes 'MB' then true else false
        colour: '#FCBB78'
        img: 
          if @zeroedOut('MB') 
            'IMG/provinces/DataUnavailable/MB_Unavailable.svg'
          else
            if @config.provinces.includes 'MB' then 'IMG/provinces/colour/MB_Selected.svg' else 'IMG/provinces/colour/MB_Unselected.svg'
      'ON' : 
        tooltip: Tr.regionSelector.names.ON[@app.language]
        present: if @config.provinces.includes 'ON' then true else false
        colour: '#C5B1D6'
        img: 
          if @zeroedOut('ON') 
            'IMG/provinces/DataUnavailable/ON_Unavailable.svg'
          else
            if @config.provinces.includes 'ON' then 'IMG/provinces/colour/ON_Selected.svg' else 'IMG/provinces/colour/ON_Unselected.svg'
      'QC' : 
        tooltip: Tr.regionSelector.names.QC[@app.language]
        present: if @config.provinces.includes 'QC' then true else false
        colour: '#c49c94'
        img: 
          if @zeroedOut('QC') 
            'IMG/provinces/DataUnavailable/QC_Unavailable.svg'
          else
            if @config.provinces.includes 'QC' then 'IMG/provinces/colour/QC_Selected.svg' else 'IMG/provinces/colour/QC_Unselected.svg'
      'NB' :
        tooltip: Tr.regionSelector.names.NB[@app.language]
        present: if @config.provinces.includes 'NB' then true else false
        colour: '#2FA148'
        img: 
          if @zeroedOut('NB') 
            'IMG/provinces/DataUnavailable/NB_Unavailable.svg'
          else
            if @config.provinces.includes 'NB' then 'IMG/provinces/colour/NB_Selected.svg' else 'IMG/provinces/colour/NB_Unselected.svg'
      'NS' :
        tooltip: Tr.regionSelector.names.NS[@app.language]
        present: if @config.provinces.includes 'NS' then true else false
        colour: '#F69797'
        img: 
          if @zeroedOut('NS') 
            'IMG/provinces/DataUnavailable/NS_Unavailable.svg'
          else
            if @config.provinces.includes 'NS' then 'IMG/provinces/colour/NS_Selected.svg' else 'IMG/provinces/colour/NS_Unselected.svg'
      'NL' :
        tooltip: Tr.regionSelector.names.NL[@app.language]
        present: if @config.provinces.includes 'NL' then true else false
        colour: '#9ED089'
        img: 
          if @zeroedOut('NL') 
            'IMG/provinces/DataUnavailable/NL_Unavailable.svg'
          else
            if @config.provinces.includes 'NL' then 'IMG/provinces/colour/NL_Selected.svg' else 'IMG/provinces/colour/NL_Unselected.svg'
      'PE' :
        tooltip: Tr.regionSelector.names.PE[@app.language]
        present: if @config.provinces.includes 'PE' then true else false
        colour: '#8D574C'
        img: 
          if @zeroedOut('PE') 
            'IMG/provinces/DataUnavailable/PEI_Unavailable.svg'
          else
            if @config.provinces.includes 'PE' then 'IMG/provinces/colour/PEI_Selected.svg' else 'IMG/provinces/colour/PEI_Unselected.svg'
      'YT' :
        tooltip: Tr.regionSelector.names.YT[@app.language]
        present: if @config.provinces.includes 'YT' then true else false
        colour: '#F5B6D1'
        img: 
          if @zeroedOut('YT') 
            'IMG/provinces/DataUnavailable/Yukon_Unavailable.svg'
          else
            if @config.provinces.includes 'YT' then 'IMG/provinces/colour/Yukon_Selected.svg' else 'IMG/provinces/colour/Yukon_Unselected.svg'
      'NT' :
        tooltip: Tr.regionSelector.names.NT[@app.language]
        present: if @config.provinces.includes 'NT' then true else false
        colour: '#D62A28'
        img: 
          if @zeroedOut('NT') 
            'IMG/provinces/DataUnavailable/NT_Unavailable.svg'
          else
            if @config.provinces.includes 'NT' then 'IMG/provinces/colour/NT_Selected.svg' else 'IMG/provinces/colour/NT_Unselected.svg'
      'NU' : 
        tooltip: Tr.regionSelector.names.NU[@app.language]
        present: if @config.provinces.includes 'NU' then true else false
        colour: '#9268ac'
        img: 
          if @zeroedOut('NU') 
            'IMG/provinces/DataUnavailable/NU_Unavailable.svg'
          else
            if @config.provinces.includes 'NU' then 'IMG/provinces/colour/NU_Selected.svg' else 'IMG/provinces/colour/NU_Unselected.svg'
    }
    data = []
    for province in @config.provincesInOrder
      provinceColours[province].key = province #this really should be above but its easier to add here for now
      data.push provinceColours[province] 
    data

  provinceLegendData: ->
    baseData = 
      BC:
        present: @config.provinces.includes('BC') and not @zeroedOut('BC')
        img: '/IMG/provinces/colour/BC_Selected.svg' 
      AB:
        present: @config.provinces.includes('AB') and not @zeroedOut('AB')
        img: '/IMG/provinces/colour/AB_Selected.svg' 
      SK: 
        present: @config.provinces.includes('SK') and not @zeroedOut('SK')
        img: '/IMG/provinces/colour/Sask_Selected.svg' 
      MB: 
        present: @config.provinces.includes('MB') and not @zeroedOut('MB')
        img: '/IMG/provinces/colour/MB_Selected.svg' 
      ON: 
        present: @config.provinces.includes('ON') and not @zeroedOut('ON')
        img: '/IMG/provinces/colour/ON_Selected.svg' 
      QC: 
        present: @config.provinces.includes('QC') and not @zeroedOut('QC')
        img: '/IMG/provinces/colour/QC_Selected.svg' 
      NB:
        present: @config.provinces.includes('NB') and not @zeroedOut('NB')
        img: '/IMG/provinces/colour/NB_Selected.svg' 
      NS:
        present: @config.provinces.includes('NS') and not @zeroedOut('NS')
        img: '/IMG/provinces/colour/NS_Selected.svg' 
      NL:
        present: @config.provinces.includes('NL') and not @zeroedOut('NL')
        img: '/IMG/provinces/colour/NL_Selected.svg' 
      PE:
        present: @config.provinces.includes('PE') and not @zeroedOut('PE')
        img: '/IMG/provinces/colour/PEI_Selected.svg' 
      YT:
        present: @config.provinces.includes('YT') and not @zeroedOut('YT')
        img: '/IMG/provinces/colour/Yukon_Selected.svg'
      NT:
        present: @config.provinces.includes('NT') and not @zeroedOut('NT')
        img: '/IMG/provinces/colour/NT_Selected.svg' 
      NU: 
        present: @config.provinces.includes('NU') and not @zeroedOut('NU')
        img: '/IMG/provinces/colour/NU_Selected.svg' 
    
    data = []
    for province in @config.provincesInOrder
      data.push baseData[province] if baseData[province].present

    # Legend content is reversed because graph elements are built bottom to top,
    # but html elements will be laid out top to bottom. 
    data.reverse()
    data



  zeroedOut: (key) ->
    if !(@seriesData) or !(@seriesData[key]) then return false
    nonZeroVals = @seriesData[key].filter (item) -> item.value != 0
    return nonZeroVals.length == 0

  getSelectionState: ->
    if @config.provincesInOrder.length != @config.provinces.length
      allSelected = false
      if @config.provinces.length > 0
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

  getDataAndRender: ->
    @getData()
    @render()

  getData: ->
    switch @config.mainSelection
      when 'gasProduction'  
        @seriesData = @app.providers[@config.dataset].gasProductionProvider.dataForViz1 @config
        @yAxisData = @app.providers[@config.dataset].gasProductionProvider.dataForAllViz1Scenarios @config
      when 'electricityGeneration'
        @seriesData = @app.providers[@config.dataset].electricityProductionProvider.dataForViz1 @config
        @yAxisData = @app.providers[@config.dataset].electricityProductionProvider.dataForAllViz1Scenarios @config
      when 'energyDemand'
        @seriesData = @app.providers[@config.dataset].energyConsumptionProvider.dataForViz1 @config
        @yAxisData = @app.providers[@config.dataset].energyConsumptionProvider.dataForAllViz1Scenarios @config
      when 'oilProduction'
        @seriesData = @app.providers[@config.dataset].oilProductionProvider.dataForViz1 @config
        @yAxisData = @app.providers[@config.dataset].oilProductionProvider.dataForAllViz1Scenarios @config

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

  # The bars width depends on the length of the domain. Width of the graph / # of bars 
  barSize: ->
    (@width())/ (@xScale().domain().length)

  yScale: ->
    d3.scale.linear()
      .domain([
        0 
        @graphDataMaximum(@yAxisData)
      ])
      .range [@height(), 0]

  yAxis: ->
    d3.svg.axis()
      .scale @yScale()
      .tickSize 6,0
      .ticks 15
      .orient "right"
      .tickFormat d3.format('.3s')

  #Redraws the Y axis
  buildYAxis:  ->
    axis = d3.select(@app.window.document).select "#yAxis" 
      .attr
        class: "y axis"
        transform: "translate(#{@width() + @_margin.left}, #{@_margin.top})"
      .transition()
        .duration @app.animationDuration
        .ease "linear"
        .call @yAxis()

    axis.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#999999'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

  # The 'correct' scale used by the graph
  xScale: ->
    d3.scale.ordinal()
      .domain Constants.years 
      .rangeBands [0, @width()]

  xAxisForLabels: ->
    d3.svg.axis()
      .scale @xScale()
      .tickValues d3.range(2005, 2041, 5)
      .tickSize 0,0
      .orient "bottom"

  # We want an extra tick since the tick marks are between the bars, thus we make a dummy domain with an additional year
  # RangeBands: The range is from the left side of the graph to the right side PLUS ONE BAR for the additional tick
  xScaleForTicks: ->
    domainPlusOne = [2005..2041]
    d3.scale.ordinal()
        .domain domainPlusOne 
        .rangeBands([@_margin.left, @width() + @_margin.left + @barSize() + (@_barMargin /2)])

  xAxisForTicks: ->
    d3.svg.axis()
      .scale @xScaleForTicks()
      .ticks d3.range(2005, 2042)
      .tickSize 6,0
      .tickFormat ""
      .orient "bottom"

  buildXAxis: ->
    # Add axis which use the chart's height
    axisWithTicks = d3.select(@app.window.document).select "#xAxisForTicks"
        .attr
          class: 'x axis'
          transform: "translate(#{0 - (@barSize()/ 2) - (@_barMargin )}, #{@height() + @_margin.top})"
      .call @xAxisForTicks()

    axisWithTicks.selectAll '.tick line'
      .attr
        fill: 'none'
        stroke: '#999999'
        'stroke-width': "1"
        'shape-rendering': 'crispEdges'

    d3.select(@app.window.document).select "#xAxisForLabels"
      .attr
        class: 'x axis labels'
        transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
      .call @xAxisForLabels()
      .selectAll "text"
        .style 
          "text-anchor": "middle"
        .attr
          dy: "1.5em"
          x: -(@_barMargin)

  buildForecast: ->
    d3.select(@app.window.document).selectAll('.forecast').remove()


    textX = @_margin.left + @xScale()(2015)
    textY = height - 16    
    d3.select(@app.window.document).select '#graphSVG'
      .append "text"
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{textX},#{textY})" 
          fill: '#999'
        .style
          'text-anchor': "start"
        .text Tr.forecastLabel[@app.language]



    arrowX = @_margin.left + @xScale()(2015) + 65
    arrowY = height - 27
    d3.select(@app.window.document).select '#graphSVG'
      .append "image"
        .attr
          class: 'forecast'
          transform: "translate(#{arrowX},#{arrowY})" 
          # TODO: The extra 'xlink:' is a workaround to an issue with JSDOM. Remove when resolved.
          # https://github.com/tmpvar/jsdom/issues/1624
          "xlink:xlink:href": '/IMG/forecast_arrow.svg'
          height: 9
          width: 200


    d3.select(@app.window.document).select '#graphSVG'
      .append "line"
        .attr
          class: 'forecast'
          stroke: '#999'
          'stroke-width': 2
          x1: @_margin.left + ((@xScale()(2014) + @xScale()(2015)) / 2 - @_barMargin) #We want the line in the middle of the years
          y1: @height() + @_margin.top 
          x2: @_margin.left + ((@xScale()(2014) + @xScale()(2015)) / 2 - @_barMargin) #We want the line in the middle of the years
          y2: height - 16

  #build viz: run the first time only: adds the bottom axis, assigns the chart 
  buildViz: ->  
    @buildYAxis()
    @buildXAxis()    
    
    #Build the forecast 
    @buildForecast()

    #Build the chart and its stack menu
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
        @provinceMenuData()
      barSize:
        @barSize()
      barMargin:
        @_barMargin
      duration:
        @app.animationDuration
      groupId:
        'graphGroup'
      menuOptions: 
        selector: '#provinceMenuSVG'
        size: 
          w: d3.select(@app.window.document).select('#provincePanel').node().getBoundingClientRect().width
          h: @provinceMenuHeight()
        onSelected:
          @menuSelect
        allSelected:
          @getSelectionState().allSelected
        someSelected:
          @getSelectionState().someSelected
        allSquareHandler:
          @selectAllStacked
        orderChangedHandler:
          @orderChanged
        showHelpHandler:
          @showProvinceNames
        groupId:
          'stackMenu'
    @_chart = new stackedBarChart(@app, "#graphSVG", @xScale(), @yScale(), stackedOptions)   

  #called for adjustments: basically to avoid rebuilding the x axis and the chart object
  adjustViz: ->
    @_chart.menu.allSelected @getSelectionState().allSelected
    @_chart.menu.someSelected @getSelectionState().someSelected
    @_chart.mapping @provinceMenuData()
    @_chart.data @seriesData

    @_chart.y @yScale()  
    @buildYAxis()

  selectAllStacked: (selecting) =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.resetProvinces selecting 

    update = =>
      @config.resetProvinces selecting 
      @getDataAndRender()
      @app.router.navigate @config.routerParams()


    @app.datasetRequester.updateAndRequestIfRequired newConfig, update




  orderChanged: (newLocation, currentLocation) =>
    if currentLocation > newLocation
      temp_data = _.concat(@config.provincesInOrder[0...newLocation], @config.provincesInOrder[currentLocation],@config.provincesInOrder[newLocation...currentLocation], @config.provincesInOrder[(currentLocation+1)..])
    if currentLocation < newLocation 
      temp_data = _.concat(@config.provincesInOrder[0...currentLocation], @config.provincesInOrder[(currentLocation+1)..newLocation], @config.provincesInOrder[currentLocation], @config.provincesInOrder[(newLocation+1)..])
    return unless temp_data?  

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvincesInOrder temp_data

    update = =>
      @config.setProvincesInOrder temp_data
      @_chart.mapping @provinceMenuData()
      @app.router.navigate @config.routerParams()
    
    @app.datasetRequester.updateAndRequestIfRequired newConfig, update



  menuSelect: (key, regionIndex) =>
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.flipProvince key

    update = =>
      @config.flipProvince key
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
      for province in @provinceMenuData()
        contentString = """<div class="provinceLabel provinceLabel#{province.key}"> <h6> #{Tr.regionSelector.names[province.key][@app.language]} </h6> </div>""" + contentString

      @app.popoverManager.showPopover @provincesHelpPopover, 
        outerClasses: 'vizModal floatingPopover popOverSm provinceHelp'
        innerClasses: 'localHelpTitle'
        title: Tr.regionSelector.selectRegionLabel[@app.language]
        content: contentString
        attachmentSelector: '#provincesSelector'


module.exports = Visualization1