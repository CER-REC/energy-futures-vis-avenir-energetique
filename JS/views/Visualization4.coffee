d3 = require 'd3'
Constants = require '../Constants.coffee'
squareMenu = require '../charts/square-menu.coffee'
Mustache = require 'mustache'
Tr = require '../TranslationTable.coffee'

Visualization4Template = require '../templates/Visualization4.mustache'
SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'


class Visualization4


  constructor: (config) ->

    @config = config
    
    @outerHeight = 700 
    @margin = 
      top: 20
      right: 70
      bottom: 70
      left: 10

    document.getElementById('visualizationContent').innerHTML = Mustache.render Visualization4Template,
      selectOneLabel: Tr.mainSelector.selectOneLabel[app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[app.language]
      svgStylesheet: SvgStylesheetTemplate

    @mainSelectorHelpPopover = new ControlsHelpPopover()
    @unitsHelpPopover = new ControlsHelpPopover()
    @scenariosHelpPopover = new ControlsHelpPopover()
    @provincesHelpPopover = new ControlsHelpPopover()


    d3.select '.mainSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        if app.popoverManager.currentPopover == @mainSelectorHelpPopover
          app.popoverManager.closePopover()
        else
          app.popoverManager.showPopover @mainSelectorHelpPopover, 
            outerClasses: 'vizModal floatingPopover mainSelectorHelp'
            innerClasses: 'viz4HelpTitle'
            title: Tr.mainSelector.selectOneLabel[app.language]
            content: Tr.mainSelector.mainSelectorHelp[app.language]
            attachmentSelector: '.mainSelectorSection'
    
    d3.select '.unitSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        if app.popoverManager.currentPopover == @unitsHelpPopover
          app.popoverManager.closePopover()
        else
          app.popoverManager.showPopover @unitsHelpPopover, 
            outerClasses: 'vizModal floatingPopover unitSelectorHelp'
            innerClasses: 'viz4HelpTitle'
            title: Tr.unitSelector.unitSelectorHelpTitle[app.language]
            content: Tr.unitSelector.unitSelectorHelp[app.language]
            attachmentSelector: '.unitsSelectorGroup'

    d3.select '.scenarioSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        if app.popoverManager.currentPopover == @scenariosHelpPopover
          app.popoverManager.closePopover()
        else
          app.popoverManager.showPopover @scenariosHelpPopover, 
            outerClasses: 'vizModal floatingPopover scenarioSelectorHelp'
            innerClasses: 'viz4HelpTitle'
            title: Tr.scenarioSelector.scenarioSelectorHelpTitle[app.language]
            content: Tr.scenarioSelector.scenarioSelectorHelp[app.language]
            attachmentSelector: '.scenarioSelectorGroup'


    @render()



  redraw: ->
    d3.select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    @renderXAxis(false)
    @renderYAxis(false)
    @renderGraph(0)
    @provinceMenu.size
      w: d3.select('#provincesSelector').node().getBoundingClientRect().width
      h: @height() - d3.select('span.titleLabel').node().getBoundingClientRect().height + d3.select('#xAxis').node().getBoundingClientRect().height




  # Province menu stuff
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


  # Black and white non multi select menu.
  buildProvinceMenu: ->
    d3.select '#provinceMenuSVG'
      .attr
        width: d3.select('#provincesSelector').node().getBoundingClientRect().width
        height: @outerHeight        

    provinceOptions =
      size: 
          w: d3.select('#provincesSelector').node().getBoundingClientRect().width
          h: @height() - d3.select('span.titleLabel').node().getBoundingClientRect().height + d3.select('#xAxis').node().getBoundingClientRect().height
      margin:
        left: 0
        right: 0
        top: 20
        bottom: 20
      canDrag: false
      hasChart: false
      parentClass: 'provinceMenu'
      data: @dataForProvinceMenu()
      onSelected: @provinceSelected
      allSelected: (@config.province == 'all')
      addAllSquare: true
      allSquareHandler: @selectAllProvince
      showHelpHandler: @showProvinceNames
      groupId: 'provinceMenu'
    new squareMenu('#provinceMenuSVG', provinceOptions) 

  selectAllProvince: (selecting) =>
    @config.setProvince 'all'
    @provinceMenu.allSelected(true)
    @provinceMenu.data(@dataForProvinceMenu())
    @renderYAxis()
    @renderGraph()


  provinceSelected: (key, regionIndex) =>
    @provinceMenu.allSelected(false)
    @config.setProvince key
    @provinceMenu.data(@dataForProvinceMenu())
    @renderYAxis()
    @renderGraph()

  showProvinceNames: =>
    d3.event.stopPropagation()
    if app.popoverManager.currentPopover == @provincesHelpPopover
      app.popoverManager.closePopover()
    else
      #Grab the provinces in order for the string
      contentString = ""
      for province in @dataForProvinceMenu()
        contentString = """<div class="provinceLabel"> <h6> #{Tr.regionSelector.names[province.key][app.language]} </h6> </div>""" + contentString

      app.popoverManager.showPopover @provincesHelpPopover, 
        outerClasses: 'vizModal floatingPopover popOverSm provinceHelp'
        innerClasses: 'localHelpTitle'
        title: Tr.regionSelector.selectRegionLabel[app.language]
        content: contentString
        attachmentSelector: '#provincesSelector'



  # Data here

  mainSelectionData: ->
    [
      {
        label: Tr.mainSelector.totalDemandButton[app.language]
        image: if @config.mainSelection == 'energyDemand' then 'IMG/main_selection/totalDemand_selected.png' else 'IMG/main_selection/totalDemand_unselected.png'
        selectorName: 'energyDemand'
      }
      {
        label: Tr.mainSelector.electricityGenerationButton[app.language]
        image: if @config.mainSelection == 'electricityGeneration' then 'IMG/main_selection/electricity_selected.png' else 'IMG/main_selection/electricity_unselected.png'
        selectorName: 'electricityGeneration'
      }
      {
        label: Tr.mainSelector.oilProductionButton[app.language]
        image: if @config.mainSelection == 'oilProduction' then 'IMG/main_selection/oil_selected.png' else 'IMG/main_selection/oil_unselected.png'
        selectorName: 'oilProduction'
      }
      {
        label: Tr.mainSelector.gasProductionButton[app.language]
        image: if @config.mainSelection == 'gasProduction' then 'IMG/main_selection/gas_selected.png' else 'IMG/main_selection/gas_unselected.png'
        selectorName: 'gasProduction'
      }
    ]


  unitSelectionData: ->
    petajoules = 
      label: Tr.unitSelector.petajoulesButton[app.language]
      unitName: 'petajoules'
      class: if @config.unit == 'petajoules' then 'vizButton selected' else 'vizButton'
    kilobarrelEquivalents = 
      label: Tr.unitSelector.kilobarrelEquivalentsButton[app.language]
      unitName: 'kilobarrelEquivalents'
      class: if @config.unit == 'kilobarrelEquivalents' then 'vizButton selected' else 'vizButton'
    gigawattHours = 
      label: Tr.unitSelector.gigawattHourButton[app.language]
      unitName: 'gigawattHours'
      class: if @config.unit == 'gigawattHours' then 'vizButton selected' else 'vizButton'
    thousandCubicMetres = 
      label: Tr.unitSelector.thousandCubicMetresButton[app.language]
      unitName: 'thousandCubicMetres'
      class: if @config.unit == 'thousandCubicMetres' then 'vizButton selected' else 'vizButton'
    millionCubicMetres = 
      label: Tr.unitSelector.millionCubicMetresButton[app.language]
      unitName: 'millionCubicMetres'
      class: if @config.unit == 'millionCubicMetres' then 'vizButton selected' else 'vizButton'
    kilobarrels = 
      label: Tr.unitSelector.kilobarrelsButton[app.language]
      unitName: 'kilobarrels'
      class: if @config.unit == 'kilobarrels' then 'vizButton selected' else 'vizButton'
    cubicFeet  = 
      label: Tr.unitSelector.cubicFeetButton[app.language]
      unitName: 'cubicFeet'
      class: if @config.unit == 'cubicFeet' then 'vizButton selected' else 'vizButton'

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
      label: Tr.scenarioSelector.referenceButton[app.language]
      scenarioName: 'reference'
      class: if @config.scenarios.includes 'reference' then 'vizButton selected reference' else 'vizButton reference'
      colour: '#999999'
    high = 
      label: Tr.scenarioSelector.highPriceButton[app.language]
      scenarioName: 'high'
      class: if @config.scenarios.includes 'high' then 'vizButton selected high' else 'vizButton high'
      colour: '#0C2C84'
    highLng = 
      label: Tr.scenarioSelector.highLngButton[app.language]
      scenarioName: 'highLng'
      class: if @config.scenarios.includes 'highLng' then 'vizButton selected highLng' else 'vizButton highLng'
      colour: '#225EA8'
    constrained = 
      label: Tr.scenarioSelector.constrainedButton[app.language]
      scenarioName: 'constrained'
      class: if @config.scenarios.includes 'constrained' then 'vizButton selected constrained' else 'vizButton constrained'
      colour: '#41B6C4'
    low = 
      label: Tr.scenarioSelector.lowPriceButton[app.language]
      scenarioName: 'low'
      class: if @config.scenarios.includes 'low' then 'vizButton selected low' else 'vizButton low'
      colour: '#7FCDBB'
    noLng = 
      label: Tr.scenarioSelector.noLngButton[app.language]
      scenarioName: 'noLng'
      class: if @config.scenarios.includes 'noLng' then 'vizButton selected noLng' else 'vizButton noLng'
      colour: '#C7E9B4'


    switch @config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        [reference, high, highLng, constrained, low, noLng]
      when 'oilProduction'
        [reference, high, constrained, low]
      when 'gasProduction'
        [reference, high, highLng, low, noLng]


    # TODO: merge graphdata and graphscenario data, its dumb =/

  graphData: ->
    switch @config.mainSelection
      when 'energyDemand'
        app.energyConsumptionProvider.dataForViz4 @config
      when 'electricityGeneration'
        app.electricityProductionProvider.dataForViz4 @config
      when 'oilProduction'
        app.oilProductionProvider.dataForViz4 @config
      when 'gasProduction'
        app.gasProductionProvider.dataForViz4 @config

  yAxisData: ->
    switch @config.mainSelection
      when 'energyDemand'
        app.energyConsumptionProvider.dataForAllViz4Scenarios @config
      when 'electricityGeneration'
        app.electricityProductionProvider.dataForAllViz4Scenarios @config
      when 'oilProduction'
        app.oilProductionProvider.dataForAllViz4Scenarios @config
      when 'gasProduction'
        app.gasProductionProvider.dataForAllViz4Scenarios @config

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
      key: 'reference'
      colour: '#999999'
    high =
      key: 'high'
      colour: '#0C2C84'
    highLng =
      key: 'highLng'
      colour: '#225EA8'
    constrained =
      key: 'constrained'
      colour: '#41B6C4'
    low =
      key: 'low'
      colour: '#7FCDBB'
    noLng =
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
        currentGraphScenarioData.push(scenario)
    currentGraphScenarioData
    

  # We have one series of data for each scenario to graph simultaneously, so we need
  # to know what the maximum among all of them is for the y axis
  graphDataMaximum: ->
    data = @yAxisData()
    maximums = []
    for key in Object.keys data
      maximums.push d3.max(data[key], (d) -> d.value)
    d3.max maximums


  outerWidth: ->
    d3.select('#graphPanel').node().getBoundingClientRect().width

  width: ->
    @outerWidth() - @margin.left - @margin.right

  height: -> 
    @outerHeight - @margin.top - @margin.bottom


  # NB: See 'render' for width discussion, IE specific issue.
  xAxisScale: (width) ->
    #TODO should the domain come from the data? 

    width = width || @width()

    d3.scale.linear()
      .domain [2005, 2040]
      .range [0, width]

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
      .orient "bottom"

  xAxisGridLines: ->
    d3.svg.axis()
      .scale @xAxisScale()
      .tickValues [2005, 2010, 2015, 2020, 2025, 2030, 2035, 2040]
      .tickFormat("")
      .tickSize(-1 * @height(), 0)
      .orient "bottom"
  
  yAxis: ->
    d3.svg.axis()
      .scale @yAxisScale()
      .ticks 15
      .tickFormat(d3.format('.3s'))
      .tickSize(10, 0)
      .orient "right"

  yAxisGridLines: ->
    d3.svg.axis()
      .scale @yAxisScale()
      .ticks 15
      .tickFormat("")
      .tickSize(-1 * @width(), 0)
      .orient "right"

  # Render helpers here

  render: ->

    # NB: This is a workaround to a problem in Internet Explorer.
    # For some reason, during page load, width reports a slightly wider width at the very 
    # end. This results in a graph that overflows onto the y axis. 
    # To work around it, we save the width as measured at the beginning of the render 
    # call and use it later.
    # This problem only occurred after the switch to using an iframe, and seems limited to 
    # IE.
    width = @width()

    d3.select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    d3.select '#graphGroup'
      .attr 'transform', "translate(#{@margin.top},#{@margin.left})"
        
    @renderMainSelector()
    @renderUnitsSelector()
    @renderScenariosSelector()
    @renderXAxis()
    @renderYAxis()
    if !@provinceMenu #We only need to build once, but we need to build after the axis are built for alignment
      @provinceMenu = @buildProvinceMenu()
    @renderGraph(0, width)

  renderMainSelector: ->
    mainSelectors = d3.select('#mainSelector')
      .selectAll('.mainSelectorButton')
      .data(@mainSelectionData())

    mainSelectors.enter()
      .append('div')
      .attr
        class: 'mainSelectorButton'
      .on 'click', (d) =>
        @config.setMainSelection d.selectorName
        # TODO: For efficiency, only rerender what's necessary.
        # We could just call render() ... but that would potentially rebuild a bunch of menus... 
        @renderMainSelector()
        @renderUnitsSelector()
        @renderScenariosSelector()
        @renderYAxis()
        @renderGraph()

    mainSelectors.html (d) ->
      "<img src=#{d.image} class='mainSelectorImage'>
       <span class='mainSelectorLabel'>#{d.label}</span>"



    mainSelectors.exit()
      .on 'click', null
      .remove()


  renderUnitsSelector: ->
    unitsSelectors = d3.select('#unitsSelector')
      .selectAll('.unitSelectorButton')
      .data(@unitSelectionData())
    
    unitsSelectors.enter()
      .append('div')
      .attr
        class: 'unitSelectorButton'
      .on 'click', (d) =>
        @config.setUnit d.unitName
        # TODO: For efficiency, only rerender what's necessary.
        @renderUnitsSelector()
        @renderYAxis()
        @renderGraph()

    unitsSelectors.html (d) ->
      "<button class='#{d.class}' type='button'>#{d.label}</button>"

    unitsSelectors.exit()
      .on 'click', null
      .remove()


  renderScenariosSelector: ->
    scenariosSelectors = d3.select('#scenariosSelector')
      .selectAll('.scenarioSelectorButton')
      .data(@scenariosSelectionData())
    
    scenariosSelectors.enter()
      .append('div')
      .attr
        class: 'scenarioSelectorButton'
      .on 'click', (d) =>
        selected = @config.scenarios.includes d.scenarioName
        if selected
          @config.removeScenario d.scenarioName
        else
          @config.addScenario d.scenarioName

        # TODO: For efficiency, only rerender what's necessary.
        @renderScenariosSelector()
        @renderYAxis()
        @renderGraph()

    scenariosSelectors.html (d) ->
      "<button class='#{d.class}' type='button'>#{d.label}</button>"

    scenariosSelectors.exit()
      .on 'click', null
      .remove()

  renderXAxis: (transition = true) ->
    d3.selectAll('.forecast').remove()

    #Render the axis with the labels
    axis = d3.select '#xAxis'
      .attr 
        transform: "translate(#{0},#{@height()})" 
      .call @xAxis() 

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

    #render the gridLines
    gridLines = d3.select '#xAxisGrid'
      .attr 
        transform: "translate(#{0},#{@height()})" 
      
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

    #render the future line
    d3.select '#graphGroup' 
      .append("text")
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{@xAxisScale()(2015)},#{@height() + d3.select('#xAxis').node().getBoundingClientRect().height + d3.select('#xAxis text').node().getBoundingClientRect().height})" 
          fill: '#999'
        .style("text-anchor", "start")
        .text(Tr.forecastLabel[app.language])
    d3.select '#graphGroup'
      .append("image")
        .attr
          class: 'forecast'
          transform: "translate(#{@xAxisScale()(2015) + d3.select('#graphGroup .forecastLabel').node().getBoundingClientRect().width},#{@height() + d3.select('#xAxis').node().getBoundingClientRect().height + (d3.select('#xAxis text').node().getBoundingClientRect().height / 2)})" 
          "xlink:href":  'IMG/forecast_arrow.svg'
          height: 9
          width: 200
    d3.select '#graphGroup'
      .append("line")
        .attr
          class: 'forecast'
          stroke: '#999'
          'stroke-width': 2
          x1: @xAxisScale()(2014)
          y1: @height()
          x2: @xAxisScale()(2014)
          y2: @height() + d3.select('#xAxis').node().getBoundingClientRect().height + d3.select('#xAxis text').node().getBoundingClientRect().height
  
  renderYAxis: (transition = true) ->
    # Render the axis
    axis = d3.select '#yAxis'
      .attr 
        transform: "translate(#{@width()},0)" 
    
    axis.transition()
      .duration 1000
      .ease "linear"  
      .call @yAxis()

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

    #render the gridLines
    gridLines = d3.select '#yAxisGrid'
      .attr 
        transform: "translate(#{@width()},0)"  

    if transition  
      gridLines.transition()
        .ease "linear"
        .duration 1000  
        .call @yAxisGridLines()   
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


  renderGraph: (duration = 1000, width) ->
    xAxisScale = @xAxisScale(width)
    yAxisScale = @yAxisScale()

    area = d3.svg.area()
      .x (d) => 
        xAxisScale d.year
      .y0 @height()
      .y1 (d) => 
        yAxisScale d.value
      .defined (d) -> 
        d.year <= 2014

    areaFuture = d3.svg.area()
      .x (d) => 
        xAxisScale d.year
      .y0 @height()
      .y1 (d) => 
        yAxisScale d.value
      .defined (d) -> 
        d.year >= 2014

    line = d3.svg.line()
        .x (d) => 
          xAxisScale d.year
        .y (d) => 
          yAxisScale d.value

    grads = d3.select('#graphGroup').select("defs").selectAll(".presentLinearGradient")
        .data(@gradientData(), (d) -> d.key)
    
    futureGrads = d3.select('#graphGroup').select("defs").selectAll(".futureLinearGradient")
        .data(@gradientData(), (d) -> d.key)

    enterGrads = grads.enter().append("linearGradient")
        .attr
          class:'presentLinearGradient'
          gradientUnits: "objectBoundingBox"
          cx: 0
          cy: 0
          r: "100%"
          id: (d) -> "viz4gradPresent" + d.key

    enterGrads.append("stop")
          .attr
            offset: "0"
          .style
            "stop-color": (d) -> d.colour
            "stop-opacity": "0.4"

    enterGrads.append('stop')
          .attr
            offset: (d) => xAxisScale(2010) / xAxisScale(2014)
          .style
            "stop-color": (d) -> d.colour
            "stop-opacity": 0.4 * 0.9

    enterGrads.append("stop")
        .attr
          offset: "100%"
        .style
          "stop-color": (d) -> d.colour
          "stop-opacity":  0.4 * 0.7

    enterFutureGrads = grads.enter().append("linearGradient")
        .attr
          class:'futureLinearGradient'
          gradientUnits: "objectBoundingBox"
          cx: 0
          cy: 0
          r: "100%"
          id: (d) -> "viz4gradFuture" + d.key

    enterFutureGrads.append("stop")
        .attr
          offset:  0
        .style
          "stop-color": (d) -> d.colour
          "stop-opacity": 0.4 * 0.7

    enterFutureGrads.append("stop")
        .attr
          offset: "100%"
        .style
          "stop-color": (d) -> d.colour
          "stop-opacity": 0.4 * 0.2


    graphScenarioData = @graphScenarioData()

    graphAreaGroups = d3.select '#areasAndLinesGroup'
      .selectAll '.graphGroup' 
      .data(graphScenarioData, (d) -> d.key)

    # Enter Selection
    graphAreaGroups.enter()
      .append "g"
      .attr
        class: "graphGroup"

    graphAreaSelectors =  graphAreaGroups.selectAll('.graphAreaPresent')
      .data(((d) -> [d]), ((d) -> d.key))
      
    graphAreaSelectors.enter().append "path"
      .attr
        class: "graphAreaPresent"
        d: (d) -> 
          area(d.data.map((val) -> {year: val.year, value: 0}))
      .style  
        fill: (d) -> colour = d3.rgb(d.colour); "url(#viz4gradPresent#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.5)"
   
    graphAreaSelectors.transition()
      .duration duration
      .attr
        d: (d) -> area(d.data)

    graphFutureAreaSelectors =  graphAreaGroups.selectAll('.graphAreaFuture')
      .data(((d) -> [d]), ((d) -> d.key))
      
    graphFutureAreaSelectors.enter().append "path"
      .attr
        class: "graphAreaFuture"
        d: (d) -> 
          areaFuture(d.data.map((val) -> {year: val.year, value: 0}))
        fill: (d) -> colour = d3.rgb(d.colour); "url(#viz4gradFuture#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.2)"

    graphAreaGroups.order() #Keeps the order!!!
   
    graphFutureAreaSelectors.transition()
      .duration duration
      .attr
        d: (d) -> areaFuture(d.data)

    presentLine = graphAreaGroups.selectAll('.presentLine')
      .data(((d) -> [d]), ((d) -> d.key))
    
    presentLine.enter().append("path")
      .attr(
        class: 'presentLine'
        d: (d) ->
          line(d.data.map((val) -> {year: val.year, value: 0}))
        )
      .style(
        stroke: (d) -> d.colour
        'stroke-width': 2
        fill: 'none'
      )

    presentLine.order()

    presentLine.transition()
      .duration duration
      .attr
        d: (d) -> line(d.data)

    exitSelection = graphAreaGroups.exit()
      
    exitSelection.selectAll('.graphAreaPresent')
      .transition()
        .duration duration
        .attr
          d: (d) -> 
            area(d.data.map((val) -> {year: val.year, value: 0}))
    exitSelection.selectAll('.graphAreaFuture')
      .transition()
        .duration duration
        .attr
          d: (d) -> 
            areaFuture(d.data.map((val) -> {year: val.year, value: 0}))
    exitSelection.selectAll('.presentLine')  
      .transition()
        .duration duration
        .attr
          d: (d) -> 
            line(d.data.map((val) -> {year: val.year, value: 0}))
      .remove()


    #Add the reference case in front
    #Since these cannot be reordered. Ref case is first if its present.
    if @config.scenarios.includes('reference') && graphScenarioData.length > 0
      refCaseLine = d3.select('#referenceCaseLineGroup').selectAll('#refCaseLine')
          .data([graphScenarioData[0]])     
      refCaseLine.enter().append('path')    
          .attr
            id: "refCaseLine"
            d: (d) -> line(d.data.map((val) -> {year: val.year, value: 0}))
          .style
            stroke: (d) -> d.colour
            'stroke-width': 6
            fill: 'none'
      refCaseLine.transition()
        .duration duration
        .attr
          d: (d) -> line(d.data)
    else
      d3.select('#refCaseLine').transition()
        .duration duration
        .attr
          d: (d) -> line(d.data.map((val) -> {year: val.year, value: 0}))
        .remove()

  tearDown: ->
    # TODO: We might want to render with empty lists for buttons, so that
    # garbage collection of event handled dom nodes goes smoothly
    document.getElementById('visualizationContent').innerHTML = ''

Visualization4.resourcesLoaded = ->
  app.loadedStatus.energyConsumptionProvider and
  app.loadedStatus.oilProductionProvider and
  app.loadedStatus.gasProductionProvider and
  app.loadedStatus.electricityProductionProvider


module.exports = Visualization4