d3 = require 'd3'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
squareMenu = require '../charts/square-menu.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'
ApplicationRoot = require '../../ApplicationRoot.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'

if Platform.name == "browser"
  Visualization4Template = require '../templates/Visualization4.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'
else if Platform.name == "server"
  fs = require 'fs'
  Visualization4ServerTemplate = fs.readFileSync("#{ApplicationRoot}/JS/templates/Visualization4Server.mustache").toString()
  SvgStylesheetTemplate = fs.readFileSync("#{ApplicationRoot}/JS/templates/SvgStylesheet.css").toString()

pixelMap = [{pixelStart:260, pixelEnd:280, year:2005}
            {pixelStart:281, pixelEnd:303, year:2006}
            {pixelStart:304, pixelEnd:325, year:2007}
            {pixelStart:326, pixelEnd:349, year:2008}
            {pixelStart:350, pixelEnd:373, year:2009}
            {pixelStart:374, pixelEnd:396, year:2010}
            {pixelStart:397, pixelEnd:420, year:2011}
            {pixelStart:421, pixelEnd:442, year:2012}
            {pixelStart:443, pixelEnd:465, year:2013}
            {pixelStart:466, pixelEnd:487, year:2014}
            {pixelStart:488, pixelEnd:512, year:2015}
            {pixelStart:513, pixelEnd:533, year:2016}
            {pixelStart:534, pixelEnd:526, year:2017}
            {pixelStart:527, pixelEnd:578, year:2018}
            {pixelStart:579, pixelEnd:601, year:2019}
            {pixelStart:602, pixelEnd:624, year:2020}
            {pixelStart:625, pixelEnd:647, year:2021}
            {pixelStart:648, pixelEnd:670, year:2022}
            {pixelStart:671, pixelEnd:692, year:2023}
            {pixelStart:693, pixelEnd:717, year:2024}
            {pixelStart:718, pixelEnd:740, year:2025}
            {pixelStart:741, pixelEnd:762, year:2026}
            {pixelStart:763, pixelEnd:785, year:2027}
            {pixelStart:786, pixelEnd:808, year:2028}
            {pixelStart:809, pixelEnd:832, year:2029}
            {pixelStart:833, pixelEnd:855, year:2030}
            {pixelStart:856, pixelEnd:879, year:2031}
            {pixelStart:880, pixelEnd:901, year:2032}
            {pixelStart:902, pixelEnd:924, year:2033}
            {pixelStart:925, pixelEnd:947, year:2034}
            {pixelStart:948, pixelEnd:968, year:2035}
            {pixelStart:969, pixelEnd:992, year:2036}
            {pixelStart:993, pixelEnd:1014, year:2037}
            {pixelStart:1015, pixelEnd:1035, year:2038}
            {pixelStart:1036, pixelEnd:1060, year:2039}]

root = exports ? this

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'


class Visualization4

  renderBrowserTemplate: ->
    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render Visualization4Template,
      selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
      selectOneLabel: Tr.mainSelector.selectOneLabel[@app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[@app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate

    @datasetHelpPopover = new ControlsHelpPopover(@app)
    @mainSelectorHelpPopover = new ControlsHelpPopover()
    @unitsHelpPopover = new ControlsHelpPopover()
    @scenariosHelpPopover = new ControlsHelpPopover()
    @provincesHelpPopover = new ControlsHelpPopover()

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
            innerClasses: 'viz4HelpTitle'
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
            innerClasses: 'viz4HelpTitle'
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
            innerClasses: 'viz4HelpTitle'
            title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
            content: Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
            attachmentSelector: '.scenarioSelectorGroup'


  renderServerTemplate: ->
    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render Visualization4ServerTemplate, 
        svgStylesheet: SvgStylesheetTemplate
        title: Tr.visualization4Titles[@config.mainSelection][@app.language]
        description: @config.imageExportDescription()
        energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
        bitlyLink: @app.bitlyLink
        legendContent: @scenarioLegendData()




  constructor: (@app, config) ->
    @config = config
    @outerHeight = 700 
    @margin = 
      top: 20
      right: 70
      bottom: 50
      left: 10

    if Platform.name == 'browser'
      @renderBrowserTemplate()
      document.onmousemove = @handleMouseMove
    else if Platform.name == 'server'
      @renderServerTemplate()



    @render()
    @redraw()

  handleMouseMove: (event) =>
    root.mousePos = {x: event.pageX, y: event.pageY}
    if root.activeScenario?
      current = pixelMap.filter((entry) -> root.mousePos.x >= entry.pixelStart && root.mousePos.x <entry.pixelEnd)
      current = current[0]
      if current?
        titletobe = root.data.filter((value) -> value.year == current.year)
        titletobe = titletobe[0]
        document.getElementById("tooltip").innerHTML = Tr.scenarioSelector.names[root.activeScenario][@app.language] + " (" + current.year + "): " + titletobe.value.toFixed(2)


  redraw: ->
    d3.select(@app.window.document).select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    @renderXAxis(false)
    @renderYAxis(false)
    @renderGraph(0)
    @provinceMenu.size
      w: d3.select(@app.window.document).select('#provincesSelector').node().getBoundingClientRect().width
      h: @height() - d3.select(@app.window.document).select('span.titleLabel').node().getBoundingClientRect().height + d3.select(@app.window.document).select('#xAxis').node().getBoundingClientRect().height




  # Province menu stuff
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


  # Black and white non multi select menu.
  buildProvinceMenu: ->
    d3.select(@app.window.document).select '#provinceMenuSVG'
      .attr
        width: d3.select(@app.window.document).select('#provincesSelector').node().getBoundingClientRect().width
        height: @outerHeight        

    provinceOptions =
      size: 
          w: d3.select(@app.window.document).select('#provincesSelector').node().getBoundingClientRect().width
          h: @height() - d3.select(@app.window.document).select('span.titleLabel').node().getBoundingClientRect().height + d3.select(@app.window.document).select('#xAxis').node().getBoundingClientRect().height
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
    new squareMenu(@app, '#provinceMenuSVG', provinceOptions) 

  selectAllProvince: (selecting) =>
    @config.setProvince 'all'
    @provinceMenu.allSelected(true)
    @provinceMenu.data(@dataForProvinceMenu())
    @renderYAxis()
    @renderGraph()


  provinceSelected: (key, regionIndex) =>

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince key

    update = =>
      @provinceMenu.allSelected(false)
      @config.setProvince key
      @provinceMenu.data(@dataForProvinceMenu())
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
      contentString = ""
      for province in @dataForProvinceMenu()
        contentString = """<div class="provinceLabel"> <h6> #{Tr.regionSelector.names[province.key][@app.language]} </h6> </div>""" + contentString

      @app.popoverManager.showPopover @provincesHelpPopover, 
        outerClasses: 'vizModal floatingPopover popOverSm provinceHelp'
        innerClasses: 'localHelpTitle'
        title: Tr.regionSelector.selectRegionLabel[@app.language]
        content: contentString
        attachmentSelector: '#provincesSelector'



  # Data here
  datasetSelectionData: ->
    jan2016 =
      label: Tr.datasetSelector.jan2016Button[@app.language]
      dataset: 'jan2016'
      title: Tr.selectorTooltip.datasetSelector.jan2016[@app.language]
      class: if @config.dataset == 'jan2016' then 'vizButton selected' else 'vizButton'
    oct2016 =
      label: Tr.datasetSelector.oct2016Button[@app.language]
      dataset: 'oct2016'
      title: Tr.selectorTooltip.datasetSelector.oct2016[@app.language]
      class: if @config.dataset == 'oct2016' then 'vizButton selected' else 'vizButton'

    [oct2016, jan2016]

  mainSelectionData: ->
    [
      {
        title: Tr.selectorTooltip.mainSelector.totalDemandButton[@app.language]
        label: Tr.mainSelector.totalDemandButton[@app.language]
        image: if @config.mainSelection == 'energyDemand' then 'IMG/main_selection/totalDemand_selected.png' else 'IMG/main_selection/totalDemand_unselected.png'
        selectorName: 'energyDemand'
      }
      {
        title: Tr.selectorTooltip.mainSelector.electricityGenerationButton[@app.language]
        label: Tr.mainSelector.electricityGenerationButton[@app.language]
        image: if @config.mainSelection == 'electricityGeneration' then 'IMG/main_selection/electricity_selected.png' else 'IMG/main_selection/electricity_unselected.png'
        selectorName: 'electricityGeneration'
      }
      {
        title: Tr.selectorTooltip.mainSelector.oilProductionButton[@app.language]
        label: Tr.mainSelector.oilProductionButton[@app.language]
        image: if @config.mainSelection == 'oilProduction' then 'IMG/main_selection/oil_selected.png' else 'IMG/main_selection/oil_unselected.png'
        selectorName: 'oilProduction'
      }
      {
        title: Tr.selectorTooltip.mainSelector.gasProductionButton[@app.language]
        label: Tr.mainSelector.gasProductionButton[@app.language]
        image: if @config.mainSelection == 'gasProduction' then 'IMG/main_selection/gas_selected.png' else 'IMG/main_selection/gas_unselected.png'
        selectorName: 'gasProduction'
      }
    ]


  unitSelectionData: ->
    petajoules = 
      title: Tr.selectorTooltip.unitSelector.petajoulesButton[@app.language]
      label: Tr.unitSelector.petajoulesButton[@app.language]
      unitName: 'petajoules'
      class: if @config.unit == 'petajoules' then 'vizButton selected' else 'vizButton'
    kilobarrelEquivalents = 
      title: Tr.selectorTooltip.unitSelector.kilobarrelEquivalentsButton[@app.language]
      label: Tr.unitSelector.kilobarrelEquivalentsButton[@app.language]
      unitName: 'kilobarrelEquivalents'
      class: if @config.unit == 'kilobarrelEquivalents' then 'vizButton selected' else 'vizButton'
    gigawattHours = 
      title: Tr.selectorTooltip.unitSelector.gigawattHourButton[@app.language]
      label: Tr.unitSelector.gigawattHourButton[@app.language]
      unitName: 'gigawattHours'
      class: if @config.unit == 'gigawattHours' then 'vizButton selected' else 'vizButton'
    thousandCubicMetres = 
      title: Tr.selectorTooltip.unitSelector.thousandCubicMetresButton[@app.language]
      label: Tr.unitSelector.thousandCubicMetresButton[@app.language]
      unitName: 'thousandCubicMetres'
      class: if @config.unit == 'thousandCubicMetres' then 'vizButton selected' else 'vizButton'
    millionCubicMetres = 
      title: Tr.selectorTooltip.unitSelector.millionCubicMetresButton[@app.language]
      label: Tr.unitSelector.millionCubicMetresButton[@app.language]
      unitName: 'millionCubicMetres'
      class: if @config.unit == 'millionCubicMetres' then 'vizButton selected' else 'vizButton'
    kilobarrels = 
      title: Tr.selectorTooltip.unitSelector.kilobarrelsButton[@app.language]
      label: Tr.unitSelector.kilobarrelsButton[@app.language]
      unitName: 'kilobarrels'
      class: if @config.unit == 'kilobarrels' then 'vizButton selected' else 'vizButton'
    cubicFeet  = 
      title: Tr.selectorTooltip.unitSelector.cubicFeetButton[@app.language]
      label: Tr.unitSelector.cubicFeetButton[@app.language]
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
      title: Tr.selectorTooltip.scenarioSelector.referenceButton[@app.language]
      label: Tr.scenarioSelector.referenceButton[@app.language]
      scenarioName: 'reference'
      class: 
        if @config.scenarios.includes 'reference'
          'vizButton selected reference'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'reference'
          'vizButton reference'
        else 
          'vizButton reference disabled'
      colour: '#999999'
    high =
      title: Tr.selectorTooltip.scenarioSelector.highPriceButton[@app.language]
      label: Tr.scenarioSelector.highPriceButton[@app.language]
      scenarioName: 'high'
      class: 
        if @config.scenarios.includes 'high'
          'vizButton selected high'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'high'
          'vizButton high'
        else 
          'vizButton high disabled'
      colour: '#0C2C84'
    highLng =
      title: Tr.selectorTooltip.scenarioSelector.highLngButton[@app.language]
      label: Tr.scenarioSelector.highLngButton[@app.language]
      scenarioName: 'highLng'
      class: 
        if @config.scenarios.includes 'highLng'
          'vizButton selected highLng' 
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'highLng' 
          'vizButton highLng'
        else
          'vizButton highLng disabled'
      colour: '#225EA8'
    constrained =
      title: Tr.selectorTooltip.scenarioSelector.constrainedButton[@app.language]

      label: Tr.scenarioSelector.constrainedButton[@app.language]
      scenarioName: 'constrained'
      class: 
        if @config.scenarios.includes 'constrained'
          'vizButton selected constrained'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'constrained'
          'vizButton constrained'
        else
          'vizButton constrained disabled'
      colour: '#41B6C4'
    low =
      title: Tr.selectorTooltip.scenarioSelector.lowPriceButton[@app.language]
      label: Tr.scenarioSelector.lowPriceButton[@app.language]
      scenarioName: 'low'
      class: 
        if @config.scenarios.includes 'low'
          'vizButton selected low'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'low'
          'vizButton low'
        else 
          'vizButton low disabled'
      colour: '#7FCDBB'
    noLng =
      title: Tr.selectorTooltip.scenarioSelector.noLngButton[@app.language]
      label: Tr.scenarioSelector.noLngButton[@app.language]
      scenarioName: 'noLng'
      class: 
        if @config.scenarios.includes 'noLng'
          'vizButton selected noLng'
        else if Constants.datasetDefinitions[@config.dataset].scenarios.includes 'noLng'
          'vizButton noLng'
        else 
          'vizButton noLng disabled'
      colour: '#C7E9B4'

    switch @config.mainSelection
      when 'energyDemand', 'electricityGeneration'
        if @config.dataset == 'jan2016'
          [reference, high, highLng, constrained, low, noLng]
        else
          [reference, high, low]
      when 'oilProduction'
        if @config.dataset == 'jan2016'
          [reference, high, constrained, low]
        else
          [reference, high, low]
      when 'gasProduction'
        if @config.dataset == 'jan2016'
          [reference, high, highLng, low, noLng]
        else
          [reference, high, low]
    
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
        @app.providers[@config.dataset].energyConsumptionProvider.dataForViz4 @config
      when 'electricityGeneration'
        @app.providers[@config.dataset].electricityProductionProvider.dataForViz4 @config
      when 'oilProduction'
        @app.providers[@config.dataset].oilProductionProvider.dataForViz4 @config
      when 'gasProduction'
        @app.providers[@config.dataset].gasProductionProvider.dataForViz4 @config

  yAxisData: ->
    switch @config.mainSelection
      when 'energyDemand'
        @app.providers[@config.dataset].energyConsumptionProvider.dataForAllViz4Scenarios @config
      when 'electricityGeneration'
        @app.providers[@config.dataset].electricityProductionProvider.dataForAllViz4Scenarios @config
      when 'oilProduction'
        @app.providers[@config.dataset].oilProductionProvider.dataForAllViz4Scenarios @config
      when 'gasProduction'
        @app.providers[@config.dataset].gasProductionProvider.dataForAllViz4Scenarios @config

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
        currentGraphScenarioData.push(scenario)
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
      d3.select(@app.window.document).select('#graphPanel').node().getBoundingClientRect().width
    else if Platform.name == 'server'
      Constants.viz4ServerSideGraphWidth

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

    d3.select(@app.window.document).select '#graphSVG'
      .attr
        width: @outerWidth()
        height: @outerHeight
    d3.select(@app.window.document).select '#graphGroup'
      .attr 'transform', "translate(#{@margin.top},#{@margin.left})"
        
    @renderMainSelector()
    @renderDatasetSelector()
    @renderUnitsSelector()
    @renderScenariosSelector()
    @renderXAxis()
    @renderYAxis()
    if !@provinceMenu #We only need to build once, but we need to build after the axis are built for alignment
      @provinceMenu = @buildProvinceMenu()
    @renderGraph(@app.animationDuration, width)

  renderDatasetSelector: ->
    if @config.dataset?
      datasetSelectors = d3.select(@app.window.document).select('#datasetSelector')
        .selectAll('.datasetSelectorButton')
        .data(@datasetSelectionData())

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
            @renderDatasetSelector(@datasetSelectionData())
            @renderYAxis()
            @renderGraph()
            @app.router.navigate @config.routerParams()

          @app.datasetRequester.updateAndRequestIfRequired newConfig, update

      datasetSelectors.html (d) ->
        "<button class='#{d.class}' type='button' title='#{d.title}'>#{d.label}</button>"

      datasetSelectors.exit().remove()

  renderMainSelector: ->
    mainSelectors = d3.select(@app.window.document).select('#mainSelector')
      .selectAll('.mainSelectorButton')
      .data(@mainSelectionData())

    mainSelectors.enter()
      .append('div')
      .attr
        class: 'mainSelectorButton'
      .on 'click', (d) =>

        newConfig = new @config.constructor @app
        newConfig.copy @config
        newConfig.setMainSelection d.selectorName

        update = =>
          @config.setMainSelection d.selectorName
          # TODO: For efficiency, only rerender what's necessary.
          # We could just call render() ... but that would potentially rebuild a bunch of menus... 
          @renderMainSelector()
          @renderDatasetSelector()
          @renderUnitsSelector()
          @renderScenariosSelector()
          @renderYAxis()
          @renderGraph()
          @app.router.navigate @config.routerParams()

        @app.datasetRequester.updateAndRequestIfRequired newConfig, update



    mainSelectors.html (d) ->
      "<img src=#{d.image} class='mainSelectorImage' title='#{d.title}'>
       <span class='mainSelectorLabel' title='#{d.title}'>#{d.label}</span>"



    mainSelectors.exit()
      .on 'click', null
      .remove()


  renderUnitsSelector: ->
    unitsSelectors = d3.select(@app.window.document).select('#unitsSelector')
      .selectAll('.unitSelectorButton')
      .data(@unitSelectionData())
    
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



    unitsSelectors.html (d) ->
      "<button class='#{d.class}' type='button' title='#{d.title}'>#{d.label}</button>"

    unitsSelectors.exit()
      .on 'click', null
      .remove()


  renderScenariosSelector: ->
    scenariosSelectors = d3.select(@app.window.document).select('#scenariosSelector')
      .selectAll('.scenarioSelectorButton')
      .data(@scenariosSelectionData())
    
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



    scenariosSelectors.html (d) ->
        indexOfDisabled = d.class.indexOf 'disabled'
        spanClass = 'disabled'
        if indexOfDisabled < 0 then spanClass = ''
        "<button class='#{d.class}' type='button' title='#{d.title}'><span class='#{spanClass}'>#{d.label}</span></button>"

    scenariosSelectors.exit()
      .on 'click', null
      .remove()

  renderXAxis: (transition = true) ->
    d3.select(@app.window.document).selectAll('.forecast').remove()

    #Render the axis with the labels
    axis = d3.select(@app.window.document).select '#xAxis'
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
    gridLines = d3.select(@app.window.document).select '#xAxisGrid'
      .attr 
        transform: "translate(#{0},#{@height()})" 
      
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

    #render the future line



    textX = @margin.left + @xAxisScale()(2015)
    textY = @outerHeight - 16    
    d3.select(@app.window.document).select '#graphGroup' 
      .append("text")
        .attr
          class: 'forecast forecastLabel'
          transform: "translate(#{textX},#{textY})" 
          fill: '#999'
        .style("text-anchor", "start")
        .text(Tr.forecastLabel[@app.language])

    arrowX = @margin.left + @xAxisScale()(2015) + 65
    arrowY = @outerHeight - 27
    d3.select(@app.window.document).select '#graphGroup'
      .append("image")
        .attr
          class: 'forecast'
          transform: "translate(#{arrowX},#{arrowY})" 
          "xlink:xlink:href": 'IMG/forecast_arrow.svg'
          height: 9
          width: 200

    d3.select(@app.window.document).select '#graphGroup'
      .append("line")
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
    axis = d3.select(@app.window.document).select '#yAxis'
      .attr 
        transform: "translate(#{@width()},0)" 
    
    axis.transition()
      .duration @app.animationDuration
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
    gridLines = d3.select(@app.window.document).select '#yAxisGrid'
      .attr 
        transform: "translate(#{@width()},0)"  

    if transition  
      gridLines.transition()
        .ease "linear"
        .duration @app.animationDuration  
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


  renderGraph: (duration = @app.animationDuration, width) ->
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

    grads = d3.select(@app.window.document).select('#graphGroup').select("defs").selectAll(".presentLinearGradient")
        .data(@gradientData(), (d) -> d.key)
    
    futureGrads = d3.select(@app.window.document).select('#graphGroup').select("defs").selectAll(".futureLinearGradient")
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

    graphAreaGroups = d3.select(@app.window.document).select '#areasAndLinesGroup'
      .selectAll '.graphGroup' 
      .data(graphScenarioData, (d) -> d.key)

    # Enter Selection
    graphAreaGroups.enter()
      .append "g"
      .attr
        class: "graphGroup"

    graphAreaSelectors =  graphAreaGroups.selectAll('.graphAreaPresent')
      .data(((d) -> [d]), ((d) -> d.key))
      .on "mouseover", (d) =>
        document.getElementById("tooltip").style.visibility = "visible"
        document.getElementById("tooltip").style.top = (d3.event.pageY-10) + "px"
        document.getElementById("tooltip").style.left = (d3.event.pageX+10) + "px"
        root.activeArea = "present"+d.data[0].scenario
        root.activeScenario = d.data[0].scenario
        root.data = d.data
      .on "mousemove", (d) =>
        document.getElementById("tooltip").style.top = (d3.event.pageY-10) + "px"
        document.getElementById("tooltip").style.left = (d3.event.pageX+10) + "px"
      .on "mouseout", (d) =>
        document.getElementById("tooltip").style.visibility = "hidden"
        root.activeArea = null
        root.activeScenario = null
        root.data = null

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
      .on "mouseover", (d) =>
        document.getElementById("tooltip").style.visibility = "visible"
        document.getElementById("tooltip").style.top = (d3.event.pageY-10) + "px"
        document.getElementById("tooltip").style.left = (d3.event.pageX+10) + "px"
        root.activeArea = "future"+d.data[0].scenario
        root.activeScenario = d.data[0].scenario
        root.data = d.data
      .on "mousemove", (d) =>
        document.getElementById("tooltip").style.top = (d3.event.pageY-10) + "px"
        document.getElementById("tooltip").style.left = (d3.event.pageX+10) + "px"
      .on "mouseout", (d) =>
        document.getElementById("tooltip").style.visibility = "hidden"
        root.activeArea = null
        root.activeScenario = null
        root.data = null

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

    # update the csv data download link
    d3.select(@app.window.document).select("#dataDownloadLink")
      .attr
        href: "csv_data#{ParamsToUrlString(@config.routerParams())}"

    #Add the reference case in front
    #Since these cannot be reordered. Ref case is first if its present.
    if @config.scenarios.includes('reference') && graphScenarioData.length > 0
      refCaseLine = d3.select(@app.window.document).select('#referenceCaseLineGroup').selectAll('#refCaseLine')
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
      d3.select(@app.window.document).select('#refCaseLine').transition()
        .duration duration
        .attr
          d: (d) -> line(d.data.map((val) -> {year: val.year, value: 0}))
        .remove()

  tearDown: ->
    # TODO: We might want to render with empty lists for buttons, so that
    # garbage collection of event handled dom nodes goes smoothly
    @app.window.document.getElementById('visualizationContent').innerHTML = ''

module.exports = Visualization4