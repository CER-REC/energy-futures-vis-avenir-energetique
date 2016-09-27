d3 = require 'd3'
visualization = require './visualization.coffee'
unitUtilities = require '../unit-transformation.coffee'
stackedAreaChart = require '../charts/stacked-area-chart.coffee'
squareMenu = require '../charts/square-menu.coffee'
templates = require '../templates.coffee'
Constants = require '../Constants.coffee'
Mustache = require 'mustache'
Tr = require '../TranslationTable.coffee'

class Visualization2 extends visualization
  height = 700 
  width = 1000

  constructor: (config) ->
    document.getElementById('visualizationContent').innerHTML = Mustache.render templates.visualization2Template, 
      selectSectorLabel: Tr.sectorSelector.selectSectorLabel[app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[app.language]
      selectSourceLabel: Tr.sourceSelector.selectSourceLabel[app.language]
      svgStylesheet: templates.svgStylesheet

    d3.select '.sectorSelectorHelpButton'
      .on 'click', ->
        d3.event.preventDefault()
        if d3.selectAll('.floatingPopover.sectorHelp').empty()
          # Clear any other open popovers
          d3.selectAll('.floatingPopover').remove()
          
          # Build the popover
          newEl = document.createElement 'div'
          newEl.className = 'vizModal floatingPopover sectorHelp'
          newEl.innerHTML = Mustache.render templates.questionMarkPopoverTemplate, 
                visClass: 'viz2HelpTitle'
                popUpTitle: Tr.sectorSelector.sectorSelectorHelpTitle[app.language]
                popUpContent: Tr.sectorSelector.sectorSelectorHelp[app.language]
          
          # attach to correct element
          d3.select('.sectorSelectorGroup').node().appendChild newEl

          d3.select '.floatingPopover .closeButton'
            .on 'click', ->
              d3.selectAll('.floatingPopover').remove()
        else 
          d3.selectAll('.floatingPopover.sectorHelp').remove()


    d3.select '.unitSelectorHelpButton'
      .on 'click', ->
        d3.event.preventDefault()
        if d3.selectAll('.floatingPopover.unitSelectorHelp').empty()        
          # Clear any other open popovers
          d3.selectAll('.floatingPopover').remove()
          
          # Build the popover
          newEl = document.createElement 'div'
          newEl.className = 'vizModal floatingPopover unitSelectorHelp'
          newEl.innerHTML = Mustache.render templates.questionMarkPopoverTemplate, 
                visClass: 'viz2HelpTitle'
                popUpTitle: Tr.unitSelector.unitSelectorHelpTitle[app.language]
                popUpContent: Tr.unitSelector.unitSelectorHelp[app.language]
          
          # attach to correct element
          d3.select('.unitsSelectorGroup').node().appendChild newEl

          d3.select '.floatingPopover .closeButton'
            .on 'click', ->
              d3.selectAll('.floatingPopover').remove()
        else 
          d3.selectAll('.floatingPopover.unitSelectorHelp').remove()
    
    d3.select '.scenarioSelectorHelpButton'
      .on 'click', ->
        
        d3.event.preventDefault()
        if d3.selectAll('.floatingPopover.scenarioSelectorHelp').empty()        
          # Clear any other open popovers
          d3.selectAll('.floatingPopover').remove()
          
          # Build the popover
          newEl = document.createElement 'div'
          newEl.className = 'vizModal floatingPopover scenarioSelectorHelp'
          newEl.innerHTML = Mustache.render templates.questionMarkPopoverTemplate, 
                visClass: 'viz2HelpTitle'
                popUpTitle: Tr.scenarioSelector.scenarioSelectorHelpTitle[app.language]
                popUpContent: Tr.scenarioSelector.scenarioSelectorHelp[app.language]
          
          # attach to correct element
          d3.select('.scenarioSelectorGroup').node().appendChild newEl

          d3.select '.floatingPopover .closeButton'
            .on 'click', ->
              d3.selectAll('.floatingPopover').remove()
        else 
          d3.selectAll('.floatingPopover.scenarioSelectorHelp').remove()

    super(config)
    @_margin = 
      top: 20
      right: 60
      bottom: 70
      left: 20
    @svgSize()
    @addUnitToggle()
    @addSectors()
    @addScenarios()
    @getData()

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
      @_chart._duration = 1000 
      @_chart.menu.size
        w: d3.select('#powerSourcePanel').node().getBoundingClientRect().width
        h: @sourceMenuHeight()
    if @_provinceMenu
      @_provinceMenu.size
        w: d3.select('#provincePanel').node().getBoundingClientRect().width
        h: @sourceMenuHeight()

   #the graph's height
  height: ->
    height - @_margin.top - @_margin.bottom

  #arg so we want this menu to line up with the bottom of the x axis TICKS so those must be built before we can set this.
  sourceMenuHeight: ->
    @height() - 
    d3.select('#powerSourcePanel span.titleLabel').node().getBoundingClientRect().height +
    d3.select('#xAxis').node().getBoundingClientRect().height +
    (d3.select('#xAxisForLabels text').node().getBoundingClientRect().height / 2)

  #the graph's width
  width: ->
    d3.select('#graphPanel').node().getBoundingClientRect().width - @_margin.left - @_margin.right

  svgSize: ->
    d3.select '#graphSVG'
      .attr
        width: d3.select('#graphPanel').node().getBoundingClientRect().width
        height: height
    d3.select '#provinceMenuSVG'
      .attr
        width: d3.select('#provincePanel').node().getBoundingClientRect().width
        height: height - @_margin.top
    d3.select "#powerSourceMenuSVG" 
     .attr
        width: d3.select('#powerSourcePanel').node().getBoundingClientRect().width
        height: height - @_margin.top

  sourceMenuData: ->
    sourcesWithColours = {  
        solarWindGeothermal:
          key: 'solarWindGeothermal'
          img: 
            if @zeroedOut('solarWindGeothermal') 
              'IMG/sources/unavailable/solarWindGeo_unavailable.svg'
            else
              if @config.sources.includes 'solarWindGeothermal' then 'IMG/sources/solarWindGeo_selected.svg' else 'IMG/sources/solarWindGeo_unselected.svg'
          present: if @config.sources.includes 'solarWindGeothermal' then true else false
          colour: '#339947'
        coal:
          key: 'coal' 
          img: 
            if @zeroedOut('coal') 
              'IMG/sources/unavailable/coal_unavailable.svg'
            else
              if @config.sources.includes 'coal' then 'IMG/sources/coal_selected.svg' else 'IMG/sources/coal_unselected.svg'
          present: if @config.sources.includes 'coal' then true else false
          colour: '#996733'
        naturalGas:
          key: 'naturalGas' 
          img: 
            if @zeroedOut('naturalGas') 
              'IMG/sources/unavailable/naturalGas_unavailable.svg'
            else
              if @config.sources.includes 'naturalGas' then 'IMG/sources/naturalGas_selected.svg' else 'IMG/sources/naturalGas_unselected.svg'
          present: if @config.sources.includes 'naturalGas' then true else false
          colour: '#f16739'
        bio:
          key: 'bio' 
          img: 
            if @zeroedOut('bio') 
              'IMG/sources/unavailable/biomass_unavailable.svg'
            else
              if @config.sources.includes 'bio' then 'IMG/sources/biomass_selected.svg' else 'IMG/sources/biomass_unselected.svg'
          present: if @config.sources.includes 'bio' then true else false
          colour: '#8d68ac'
        oilProducts:
          key: 'oilProducts' 
          img: 
            if @zeroedOut('oilProducts') 
              'IMG/sources/unavailable/oil_products_unavailable.svg'
            else
              if @config.sources.includes 'oilProducts' then 'IMG/sources/oil_products_selected.svg' else 'IMG/sources/oil_products_unselected.svg'
          present: if @config.sources.includes 'oilProducts' then true else false
          colour: '#cc6699'
        electricity:  
          key: 'electricity' 
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
        present: true
        colour: if @config.province == 'AB' then '#333' else '#fff'
        img: if @config.province == 'AB' then 'IMG/provinces/radio/AB_SelectedR.svg' else 'IMG/provinces/radio/AB_UnselectedR.svg'
      }
      {
        key: 'BC'
        present: true
        colour: if @config.province == 'BC' then '#333' else '#fff'
        img: if @config.province == 'BC' then 'IMG/provinces/radio/BC_SelectedR.svg' else 'IMG/provinces/radio/BC_UnselectedR.svg'
      }
      {
        key: 'MB'
        present: true
        colour: if @config.province == 'MB' then '#333' else '#fff'
        img: if @config.province == 'MB' then 'IMG/provinces/radio/MB_SelectedR.svg' else 'IMG/provinces/radio/MB_UnselectedR.svg'
      }     
      {
        key: 'NB'
        present: true
        colour: if @config.province == 'NB' then '#333' else '#fff'
        img: if @config.province == 'NB' then 'IMG/provinces/radio/NB_SelectedR.svg' else 'IMG/provinces/radio/NB_UnselectedR.svg'
      }
      {
        key : 'NL'
        present: true
        colour: if @config.province == 'NL' then '#333' else '#fff'
        img: if @config.province == 'NL' then 'IMG/provinces/radio/NL_SelectedR.svg' else 'IMG/provinces/radio/NL_UnselectedR.svg'
      }
      {
        key: 'NS'
        present: true
        colour: if @config.province == 'NS' then '#333' else '#fff'
        img: if @config.province == 'NS' then 'IMG/provinces/radio/NS_SelectedR.svg' else 'IMG/provinces/radio/NS_UnselectedR.svg'
      }
      {
        key: 'NT'
        present: true
        colour: if @config.province == 'NT' then '#333' else '#fff'
        img: if @config.province == 'NT' then 'IMG/provinces/radio/NT_SelectedR.svg' else 'IMG/provinces/radio/NT_UnselectedR.svg'
      }
      { 
        key: 'NU'
        present: true
        colour: if @config.province == 'NU' then '#333' else '#fff'
        img: if @config.province == 'NU' then 'IMG/provinces/radio/NU_SelectedR.svg' else 'IMG/provinces/radio/NU_UnselectedR.svg'
      }
      { 
        key: 'ON'
        present: true
        colour: if @config.province == 'ON' then '#333' else '#fff'
        img: if @config.province == 'ON' then 'IMG/provinces/radio/ON_SelectedR.svg' else 'IMG/provinces/radio/ON_UnselectedR.svg'
      }
      {
        key: 'PE'
        present: true
        colour: if @config.province == 'PE' then '#333' else '#fff'
        img: if @config.province == 'PE' then 'IMG/provinces/radio/PEI_SelectedR.svg' else 'IMG/provinces/radio/PEI_UnselectedR.svg'
      }
      { 
        key: 'QC'
        present: true
        colour: if @config.province == 'QC' then '#333' else '#fff'
        img: if @config.province == 'QC' then 'IMG/provinces/radio/QC_SelectedR.svg' else 'IMG/provinces/radio/QC_UnselectedR.svg'
      }
      {
        key: 'SK'
        present: true
        colour: if @config.province == 'SK' then '#333' else '#fff'
        img: if @config.province == 'SK' then 'IMG/provinces/radio/Sask_SelectedR.svg' else 'IMG/provinces/radio/Sask_UnselectedR.svg'
      }
      {
        key: 'YT'
        present: true
        colour: if @config.province == 'YT' then '#333' else '#fff'
        img: if @config.province == 'YT' then 'IMG/provinces/radio/Yukon_SelectedR.svg' else 'IMG/provinces/radio/Yukon_UnselectedR.svg'
      }
    ]

  #csv parsing within method
  getData: ()->
    @seriesData = app.energyConsumptionProvider.dataForViz2 @config
    if @_chart?
      @adjustViz()
    else
      @buildViz()

  #Gets the total of all the maximums (since we are stacking the data)
  graphDataTotal: (data) ->
    totalMax = 0
    for key in Object.keys data
      totalMax+= d3.max(data[key], (d) -> d.value)
    totalMax

  yScale: ->
    d3.scale.linear()
      .domain([
        0 
        @graphDataTotal(@seriesData)
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
    axis = d3.select("#yAxis")
      .attr
        transform: "translate(#{@width() + @_margin.left}, #{@_margin.top})"
    
    axis.transition()
        .duration 1000
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

    gridLines = d3.select("#yAxisGrid")
      .attr
        transform: "translate(#{@width() + @_margin.left}, #{@_margin.top})"
      
    if transition  
      gridLines.transition()
          .duration 1000
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
    axis = d3.select("#xAxisForTicks")
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

    gridLines = d3.select '#xAxisGrid'
      .attr
        transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
      
    if transition  
      gridLines.transition()
        .ease "linear"
        .duration 1000 
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

    axisForLabels = d3.select("#xAxisForLabels")
        .attr
          transform: "translate(#{@_margin.left}, #{@height() + @_margin.top})"
        .call(@xAxisForLabels())
        .selectAll("text") 
          .style 
            "text-anchor": "middle"
          .attr
            dy: "1.5em"

  buildForecast: ->
    d3.selectAll('.forecast').remove()
    d3.select('#graphSVG')
      .append("text")
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{@_margin.left + @xScale()(2015)},#{@height() + @_margin.top + d3.select('#xAxis').node().getBoundingClientRect().height + d3.select('#xAxisForLabels text').node().getBoundingClientRect().height})"
          fill: '#999'
        .style("text-anchor", "start")
        .text(Tr.forecastLabel[app.language])
    d3.select('#graphSVG')
      .append("image")
        .attr
          class: 'forecast'
          transform: "translate(#{@_margin.left + @xScale()(2015) + d3.select('#graphSVG .forecastLabel').node().getBoundingClientRect().width},#{@height() + @_margin.top + d3.select('#xAxis').node().getBoundingClientRect().height + (d3.select('#xAxisForLabels text').node().getBoundingClientRect().height /2)})" 
          "xlink:href":  'IMG/forecast_arrow.svg'
          height: 9
          width: 200
    d3.select('#graphSVG')
      .append("line")
        .attr
          class: 'forecast'
          stroke: '#999'
          'stroke-width': 2
          x1: @_margin.left + @xScale()(2014) #We want the line in the middle of the years
          y1: @height() + @_margin.top 
          x2: @_margin.left + @xScale()(2014)  #We want the line in the middle of the years
          y2: @height() + @_margin.top + d3.select('#xAxis').node().getBoundingClientRect().height + d3.select('#xAxis text').node().getBoundingClientRect().height

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
        1000
      groupId:
        'graphGroup'
      menuOptions: 
        selector: '#powerSourceMenuSVG'
        boxSize: 37.5
        size: 
          w: d3.select('#powerSourcePanel').node().getBoundingClientRect().width
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
    @_chart = new stackedAreaChart("#graphSVG", @xScale(), @yScale(), stackedOptions)   
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
    if temp_data?  
      @config.sourcesInOrder = temp_data
      @_chart.mapping(@sourceMenuData())
    
  menuSelect: (key, regionIndex) =>
    @config.flipSource(key)
    @getData()

  selectAllStacked: (selecting) =>
    @config.resetSources selecting 
    @getData()

  showSourceNames: =>
    d3.event.preventDefault()    
    if d3.selectAll('.floatingPopover.sourceSelectorHelp').empty()  
      # Clear any other open popovers
      d3.selectAll('.floatingPopover').remove()
      
      #Grab the provinces in order for the string
      contentString = ""
      for source in @sourceMenuData()
        contentString = """
          <div class="sourceLabel sourceLabel#{source.key}"> 
            <img class="sourceIcon" src="#{@colouredSourceIconsDictionary()[source.key]}">
            <h6> #{Tr.sourceSelector.sources[source.key][app.language]} </h6> 
            <div class="clearfix"> </div>
            <p> #{Tr.sourceSelector.sourceSelectorHelp[source.key][app.language]} </p>
          </div>
          """ + contentString
      contentString = Tr.sourceSelector.sourceSelectorHelp.generalHelp[app.language] + contentString

      # Build the popover
      newEl = document.createElement 'div'
      newEl.className = 'vizModal floatingPopover popOverLg sourceSelectorHelp'
      newEl.innerHTML = Mustache.render templates.questionMarkPopoverTemplate, 
            visClass: 'localHelpTitle'
            popUpTitle: Tr.sourceSelector.selectSourceLabel[app.language]
            popUpContent: contentString
      
      # attach to correct element
      d3.select('#powerSourceSelector').node().appendChild newEl

      d3.select '.floatingPopover .closeButton'
        .on 'click', ->
          d3.selectAll('.floatingPopover').remove()
    else 
      d3.selectAll('.floatingPopover.sourceSelectorHelp').remove()  

  # Black and white non multi select menu.
  buildProvinceMenu: ->
    provinceOptions=
      size: 
          w: d3.select('#provinceMenuSVG').node().getBoundingClientRect().width
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
    new squareMenu('#provinceMenuSVG', provinceOptions) 

  selectAllProvince: (selecting) =>
    @config.setProvince 'all'
    @_provinceMenu.allSelected(true)
    @_provinceMenu.data(@dataForProvinceMenu())
    @getData()

  provinceSelected: (key, regionIndex)=>
    @_provinceMenu.allSelected(false)
    @config.setProvince key
    @_provinceMenu.data(@dataForProvinceMenu())
    @_provinceMenu.redraw()
    @getData()

  showProvinceNames: =>
    if d3.selectAll('.floatingPopover.provinceHelp').empty()
      d3.event.preventDefault()
      # Clear any other open popovers
      d3.selectAll('.floatingPopover').remove()
      
      #Grab the provinces in order for the string
      contentString = ""
      for province in @dataForProvinceMenu()
        contentString = """<div class="provinceLabel"> <h6> #{Tr.regionSelector.names[province.key][app.language]} </h6> </div>""" + contentString


      # Build the popover
      newEl = document.createElement 'div'
      newEl.className = 'vizModal floatingPopover popOverSm provinceHelp'
      newEl.innerHTML = Mustache.render templates.questionMarkPopoverTemplate, 
            visClass: 'localHelpTitle'
            popUpTitle: Tr.regionSelector.selectRegionLabel[app.language]
            popUpContent: contentString
      
      # attach to correct element
      d3.select('#provincesSelector').node().appendChild newEl

      d3.select '.floatingPopover .closeButton'
        .on 'click', ->
          d3.selectAll('.floatingPopover').remove()
    else 
      d3.selectAll('.floatingPopover.provinceHelp').remove()


Visualization2.resourcesLoaded = ->
  app.loadedStatus.energyConsumptionProvider


module.exports = Visualization2