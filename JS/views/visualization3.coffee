d3 = require 'd3'
Mustache = require 'mustache'

visualization = require './visualization.coffee'
unitUtilities = require '../unit-transformation.coffee'
bubbleChart = require '../charts/bubble-chart.coffee'
Constants = require '../Constants.coffee'
squareMenu = require '../charts/square-menu.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

Visualization3Template = require '../templates/Visualization3.mustache'
SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'


class Visualization3 extends visualization
  height = 700 
  width = 1000

  constructor: (@app, config) ->
    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render Visualization3Template,
      selectViewByLabel: Tr.viewBySelector.selectViewByLabel[@app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[@app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      selectSourceLabel: Tr.sourceSelector.selectSourceLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate

    @viewByHelpPopover = new ControlsHelpPopover()
    @unitsHelpPopover = new ControlsHelpPopover()
    @scenariosHelpPopover = new ControlsHelpPopover()
    @sourcesHelpPopover = new ControlsHelpPopover()
    @provincesHelpPopover = new ControlsHelpPopover()

    d3.select(@app.window.document).select '.viewBySelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        if @app.popoverManager.currentPopover == @viewByHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @viewByHelpPopover, 
            outerClasses: 'vizModal floatingPopover viewBySelectorHelp'
            innerClasses: 'viz3HelpTitle'
            title: Tr.viewBySelector.viewBySelectorHelpTitle[@app.language]
            content: Tr.viewBySelector.viewBySelectorHelp[@app.language]
            attachmentSelector: '.viewBySelectorGroup'

    d3.select(@app.window.document).select '.unitSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        if @app.popoverManager.currentPopover == @unitsHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @unitsHelpPopover, 
            outerClasses: 'vizModal floatingPopover unitSelectorHelp'
            innerClasses: 'viz3HelpTitle'
            title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
            content: Tr.unitSelector.unitSelectorHelp[@app.language]
            attachmentSelector: '.unitsSelectorGroup'
    
    d3.select(@app.window.document).select '.scenarioSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        if @app.popoverManager.currentPopover == @scenariosHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @scenariosHelpPopover, 
            outerClasses: 'vizModal floatingPopover scenarioSelectorHelp'
            innerClasses: 'viz3HelpTitle'
            title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
            content: Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
            attachmentSelector: '.scenarioSelectorGroup'

    @_margin = 
      top: 20
      left: 10
      right: 20
      bottom: 70
    @timelineMargin = 25
    @sliderLabelHeight = 28
    @sourceIconSpacing = 10
    super(config)
    @svgSize()
    @buildProvinceVsSourceToggle()
    @addUnitToggle()
    @addScenarios()
    @getData()

  tearDown: ->
    if @yearTimeout then window.clearTimeout(@yearTimeout)
    super()

  redraw: ->
    @svgSize()
    @buildTimeline()    
    if @_chart
      @_chart._duration = 0 #prevent transitioning to the new width
      @_chart.size
        w: @width()
        h: @height()
      @_chart._duration = @app.animationDuration 
      @_chart.menu.size
        w: d3.select(@app.window.document).select('#powerSourcePanel').node().getBoundingClientRect().width
        h: @leftHandMenuHeight()
    if @_singleSelectMenu
      @_singleSelectMenu.size
        w: d3.select(@app.window.document).select('#powerSourcePanel').node().getBoundingClientRect().width
        h: @leftHandMenuHeight()

  #the graph's height
  height: ->
    height - @_margin.top - @_margin.bottom

  #arg so we want this menu to line up with the bottom of the x axis TICKS so those must be built before we can set this.
  leftHandMenuHeight: ->
    @height() + d3.select(@app.window.document).select('#timelineAxis').node().getBoundingClientRect().height

  #the graph's width
  width: ->
    d3.select(@app.window.document).select('#graphPanel').node().getBoundingClientRect().width - @_margin.left - @_margin.right

  timelineRightEnd: ->
    d3.select(@app.window.document).select('#graphSVG').node().getBoundingClientRect().width - @timelineMargin

  svgSize: ->
    d3.select(@app.window.document).select '#graphSVG'
      .attr
        width: d3.select(@app.window.document).select('#graphPanel').node().getBoundingClientRect().width,
        height: height
    d3.select(@app.window.document).select '#provinceMenuSVG'
      .attr
        width: d3.select(@app.window.document).select('#provincePanel').node().getBoundingClientRect().width
        height: height - @_margin.top
    d3.select(@app.window.document).select "#powerSourceMenuSVG" 
     .attr
        width: d3.select(@app.window.document).select('#powerSourcePanel').node().getBoundingClientRect().width
        height: height - @_margin.top - @_margin.bottom

  viewByData: ->
    [
      {
        label: Tr.viewBySelector.viewByProvinceButton[@app.language]
        viewByName: 'province'
        class: if @config.viewBy == 'province' then 'vizButton selected' else 'vizButton'
      }
      {
        label: Tr.viewBySelector.viewBySourceButton[@app.language]
        viewByName: 'source'
        class: if @config.viewBy == 'source' then 'vizButton selected' else 'vizButton'
      }
    ]

  buildProvinceVsSourceToggle: ->
    if @config.viewBy?  
      viewBySelectors = d3.select(@app.window.document).select('#viewBySelector')
        .selectAll('.viewBySelectorButton')
        .data(@viewByData())
      
      viewBySelectors.enter()
        .append('div')
        .attr
          class: 'viewBySelectorButton'
        .on 'click', (d) =>
          if @config.viewBy != d.viewByName
            @config.setViewBy d.viewByName
            @buildProvinceVsSourceToggle()
            @toggleViz()

      viewBySelectors.html (d) ->
        "<button class='#{d.class}' type='button'>#{d.label}</button>"

      viewBySelectors.exit().remove()
  
  sourcesDictionary: ->
    {  
        hydro:  
          key: 'hydro'
          img: 
            if @zeroedOut('hydro') 
              'IMG/sources/unavailable/hydro_unavailable.svg'
            else
              if @config.sources.includes 'hydro' then 'IMG/sources/hydro_selected.svg' else 'IMG/sources/hydro_unselected.svg'
          present: if @config.sources.includes 'hydro' then true else false
          colour: '#4167b1'
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
        nuclear: 
          key: 'nuclear' 
          img: 
            if @zeroedOut('nuclear') 
              'IMG/sources/unavailable/nuclear_unavailable.svg'
            else
              if @config.sources.includes 'nuclear' then 'IMG/sources/nuclear_selected.svg' else 'IMG/sources/nuclear_unselected.svg'
          present: if @config.sources.includes 'nuclear' then true else false
          colour: '#cccb31'
      }

  # We don't need to bother when we have all provinces/sources selected since nothing is zero
  zeroedOut: (key) ->
    if !(@seriesData) or !(@seriesData.children) or (@seriesData.children.length != 1) then return false
    itemKey = @seriesData.children[0].children.filter (item) -> item.source == key
    if itemKey.length == 0 then return true else false

  sourcesBlackAndWhiteDictionary: ->
    {  
        hydro:  
          key: 'hydro'
          img: if @config.source == 'hydro' then 'IMG/sources/hydro_selectedR.svg' else 'IMG/sources/hydro_unselectedR.svg'
          present: true
          colour: '#4167b1'
        solarWindGeothermal:
          key: 'solarWindGeothermal'
          img: if @config.source == 'solarWindGeothermal' then 'IMG/sources/solarWindGeo_selectedR.svg' else 'IMG/sources/solarWindGeo_unselectedR.svg'
          present: true
          colour: '#339947'
        coal:
          key: 'coal' 
          img: if @config.source == 'coal' then 'IMG/sources/coal_selectedR.svg' else 'IMG/sources/coal_unselectedR.svg'
          present: true
          colour: '#996733'
        naturalGas:
          key: 'naturalGas' 
          img: if @config.source == 'naturalGas' then 'IMG/sources/naturalGas_selectedR.svg' else 'IMG/sources/naturalGas_unselectedR.svg'
          present: true
          colour: '#f16739'
        bio:
          key: 'bio' 
          img: if @config.source == 'bio' then 'IMG/sources/biomass_selectedR.svg' else 'IMG/sources/biomass_unselectedR.svg'
          present: true
          colour: '#8d68ac'
        nuclear: 
          key: 'nuclear' 
          img: if @config.source == 'nuclear' then 'IMG/sources/nuclear_selectedR.svg' else 'IMG/sources/nuclear_unselectedR.svg'
          present: true
          colour: '#cccb31'
        oilProducts:
          key: 'oilProducts' 
          img: if @config.source == 'oilProducts' then 'IMG/sources/oil_products_selectedR.svg' else 'IMG/sources/oil_products_unselectedR.svg'
          present: true
          colour: '#cc6699'
      }

  sourcesBlackDictionary: ->
    {  
        hydro:  
          img: 'IMG/sources/hydro_selectedR.png'
        solarWindGeothermal:
          img: 'IMG/sources/solarWindGeo_selectedR.png'
        coal:
          img: 'IMG/sources/coal_selectedR.png'
        naturalGas:
          img: 'IMG/sources/naturalGas_selectedR.png'
        bio:
          img: 'IMG/sources/biomass_selectedR.png'
        nuclear: 
          img: 'IMG/sources/nuclear_selectedR.png'
        oilProducts:
          img: 'IMG/sources/oil_products_selectedR.png'
      }

  colouredSourceIconsDictionary: ->
      { 
        hydro:
          img: 'IMG/sources/hydro_selected.svg' 
        solarWindGeothermal:
          img: 'IMG/sources/solarWindGeo_selected.svg'
        coal:
          img: 'IMG/sources/coal_selected.svg'
        naturalGas:
          img: 'IMG/sources/naturalGas_selected.svg'
        bio:
          img: 'IMG/sources/biomass_selected.svg'
        oilProducts:
          img: 'IMG/sources/oil_products_selected.svg'
        nuclear:  
          img: 'IMG/sources/nuclear_selected.svg'
      }


  sourceMenuData: ->
    data = {}
    for source in @config.sourcesInOrder
      data[source] = (@sourcesDictionary()[source])
    data

  provincesBlackAndWhiteDictionary: ->
    {
      AB: {
        key: 'AB'
        present: true
        colour: if @config.province == 'AB' then '#333' else '#fff'
        img: if @config.province == 'AB' then 'IMG/provinces/radio/AB_SelectedR.svg' else 'IMG/provinces/radio/AB_UnselectedR.svg'
      }
      BC: {
        key: 'BC'
        present: true
        colour: if @config.province == 'BC' then '#333' else '#fff'
        img: if @config.province == 'BC' then 'IMG/provinces/radio/BC_SelectedR.svg' else 'IMG/provinces/radio/BC_UnselectedR.svg'
      }
      MB: {
        key: 'MB'
        present: true
        colour: if @config.province == 'MB' then '#333' else '#fff'
        img: if @config.province == 'MB' then 'IMG/provinces/radio/MB_SelectedR.svg' else 'IMG/provinces/radio/MB_UnselectedR.svg'
      }     
      NB: {
        key: 'NB'
        present: true
        colour: if @config.province == 'NB' then '#333' else '#fff'
        img: if @config.province == 'NB' then 'IMG/provinces/radio/NB_SelectedR.svg' else 'IMG/provinces/radio/NB_UnselectedR.svg'
      }
      NL: {
        key : 'NL'
        present: true
        colour: if @config.province == 'NL' then '#333' else '#fff'
        img: if @config.province == 'NL' then 'IMG/provinces/radio/NL_SelectedR.svg' else 'IMG/provinces/radio/NL_UnselectedR.svg'
      }
      NS: {
        key: 'NS'
        present: true
        colour: if @config.province == 'NS' then '#333' else '#fff'
        img: if @config.province == 'NS' then 'IMG/provinces/radio/NS_SelectedR.svg' else 'IMG/provinces/radio/NS_UnselectedR.svg'
      }
      NT: {
        key: 'NT'
        present: true
        colour: if @config.province == 'NT' then '#333' else '#fff'
        img: if @config.province == 'NT' then 'IMG/provinces/radio/NT_SelectedR.svg' else 'IMG/provinces/radio/NT_UnselectedR.svg'
      }
      NU: { 
        key: 'NU'
        present: true
        colour: if @config.province == 'NU' then '#333' else '#fff'
        img: if @config.province == 'NU' then 'IMG/provinces/radio/NU_SelectedR.svg' else 'IMG/provinces/radio/NU_UnselectedR.svg'
      }
      ON: { 
        key: 'ON'
        present: true
        colour: if @config.province == 'ON' then '#333' else '#fff'
        img: if @config.province == 'ON' then 'IMG/provinces/radio/ON_SelectedR.svg' else 'IMG/provinces/radio/ON_UnselectedR.svg'
      }
      PE: {
        key: 'PE'
        present: true
        colour: if @config.province == 'PE' then '#333' else '#fff'
        img: if @config.province == 'PE' then 'IMG/provinces/radio/PEI_SelectedR.svg' else 'IMG/provinces/radio/PEI_UnselectedR.svg'
      }
      QC: { 
        key: 'QC'
        present: true
        colour: if @config.province == 'QC' then '#333' else '#fff'
        img: if @config.province == 'QC' then 'IMG/provinces/radio/QC_SelectedR.svg' else 'IMG/provinces/radio/QC_UnselectedR.svg'
      }
      SK: {
        key: 'SK'
        present: true
        colour: if @config.province == 'SK' then '#333' else '#fff'
        img: if @config.province == 'SK' then 'IMG/provinces/radio/Sask_SelectedR.svg' else 'IMG/provinces/radio/Sask_UnselectedR.svg'
      }
      YT: {
        key: 'YT'
        present: true
        colour: if @config.province == 'YT' then '#333' else '#fff'
        img: if @config.province == 'YT' then 'IMG/provinces/radio/Yukon_SelectedR.svg' else 'IMG/provinces/radio/Yukon_UnselectedR.svg'
      }
    }

  provincesBlackDictionary: ->
    {
      AB: {
        key: 'AB'
        present: true
        colour: if @config.province == 'AB' then '#333' else '#fff'
        img: 'IMG/provinces/radio/AB_SelectedR.png' 
      }
      BC: {
        key: 'BC'
        present: true
        colour: if @config.province == 'BC' then '#333' else '#fff'
        img: 'IMG/provinces/radio/BC_SelectedR.png' 
      }
      MB: {
        key: 'MB'
        present: true
        colour: if @config.province == 'MB' then '#333' else '#fff'
        img: 'IMG/provinces/radio/MB_SelectedR.png'
      }     
      NB: {
        key: 'NB'
        present: true
        colour: if @config.province == 'NB' then '#333' else '#fff'
        img: 'IMG/provinces/radio/NB_SelectedR.png'
      }
      NL: {
        key : 'NL'
        present: true
        colour: if @config.province == 'NL' then '#333' else '#fff'
        img: 'IMG/provinces/radio/NL_SelectedR.png'
      }
      NS: {
        key: 'NS'
        present: true
        colour: if @config.province == 'NS' then '#333' else '#fff'
        img: 'IMG/provinces/radio/NS_SelectedR.png'
      }
      NT: {
        key: 'NT'
        present: true
        colour: if @config.province == 'NT' then '#333' else '#fff'
        img: 'IMG/provinces/radio/NT_SelectedR.png'
      }
      NU: { 
        key: 'NU'
        present: true
        colour: if @config.province == 'NU' then '#333' else '#fff'
        img: 'IMG/provinces/radio/NU_SelectedR.png'
      }
      ON: { 
        key: 'ON'
        present: true
        colour: if @config.province == 'ON' then '#333' else '#fff'
        img: 'IMG/provinces/radio/ON_SelectedR.png'
      }
      PE: {
        key: 'PE'
        present: true
        colour: if @config.province == 'PE' then '#333' else '#fff'
        img: 'IMG/provinces/radio/PEI_SelectedR.png'
      }
      QC: { 
        key: 'QC'
        present: true
        colour: if @config.province == 'QC' then '#333' else '#fff'
        img:'IMG/provinces/radio/QC_SelectedR.png'
      }
      SK: {
        key: 'SK'
        present: true
        colour: if @config.province == 'SK' then '#333' else '#fff'
        img: 'IMG/provinces/radio/Sask_SelectedR.png'
      }
      YT: {
        key: 'YT'
        present: true
        colour: if @config.province == 'YT' then '#333' else '#fff'
        img: 'IMG/provinces/radio/Yukon_SelectedR.png'
      }
    }
  
  provincesDictionary: ->
    provinceColours= {  
      'BC' :
        key: 'BC'
        present: if @config.provinces.includes 'BC' then true else false
        colour: '#AEC7E8'
        img: 
          if @zeroedOut('BC') 
            'IMG/provinces/DataUnavailable/BC_Unavailable.svg'
          else
            if @config.provinces.includes 'BC' then 'IMG/provinces/colour/BC_Selected.svg' else 'IMG/provinces/colour/BC_Unselected.svg'
      'AB' :
        key: 'AB'
        present: if @config.provinces.includes 'AB' then true else false
        colour: '#2278b5'
        img: 
          if @zeroedOut('AB') 
            'IMG/provinces/DataUnavailable/AB_Unavailable.svg'
          else
            if @config.provinces.includes 'AB' then 'IMG/provinces/colour/AB_Selected.svg' else 'IMG/provinces/colour/AB_Unselected.svg'
      'SK' : 
        key: 'SK'
        present: if @config.provinces.includes 'SK' then true else false
        colour: '#d77ab1'
        img: 
          if @zeroedOut('SK') 
            'IMG/provinces/DataUnavailable/SK_Unavailable.svg'
          else
            if @config.provinces.includes 'SK' then 'IMG/provinces/colour/Sask_Selected.svg' else 'IMG/provinces/colour/Sask_Unselected.svg'
      'MB' : 
        key: 'MB'
        present: if @config.provinces.includes 'MB' then true else false
        colour: '#FCBB78'
        img: 
          if @zeroedOut('MB') 
            'IMG/provinces/DataUnavailable/MB_Unavailable.svg'
          else
            if @config.provinces.includes 'MB' then 'IMG/provinces/colour/MB_Selected.svg' else 'IMG/provinces/colour/MB_Unselected.svg'
      'ON' : 
        key: 'ON'
        present: if @config.provinces.includes 'ON' then true else false
        colour: '#C5B1D6'
        img: 
          if @zeroedOut('ON') 
            'IMG/provinces/DataUnavailable/ON_Unavailable.svg'
          else
            if @config.provinces.includes 'ON' then 'IMG/provinces/colour/ON_Selected.svg' else 'IMG/provinces/colour/ON_Unselected.svg'
      'QC' : 
        key: 'QC'
        present: if @config.provinces.includes 'QC' then true else false
        colour: '#c49c94'
        img: 
          if @zeroedOut('QC') 
            'IMG/provinces/DataUnavailable/QC_Unavailable.svg'
          else
            if @config.provinces.includes 'QC' then 'IMG/provinces/colour/QC_Selected.svg' else 'IMG/provinces/colour/QC_Unselected.svg'
      'NB' :
        key: 'NB'
        present: if @config.provinces.includes 'NB' then true else false
        colour: '#2FA148'
        img: 
          if @zeroedOut('NB') 
            'IMG/provinces/DataUnavailable/NB_Unavailable.svg'
          else
            if @config.provinces.includes 'NB' then 'IMG/provinces/colour/NB_Selected.svg' else 'IMG/provinces/colour/NB_Unselected.svg'
      'NS' :
        key: 'NS'
        present: if @config.provinces.includes 'NS' then true else false
        colour: '#F69797'
        img: 
          if @zeroedOut('NS') 
            'IMG/provinces/DataUnavailable/NS_Unavailable.svg'
          else
            if @config.provinces.includes 'NS' then 'IMG/provinces/colour/NS_Selected.svg' else 'IMG/provinces/colour/NS_Unselected.svg'
      'NL' :
        key: 'NL'
        present: if @config.provinces.includes 'NL' then true else false
        colour: '#9ED089'
        img: 
          if @zeroedOut('NL') 
            'IMG/provinces/DataUnavailable/NL_Unavailable.svg'
          else
            if @config.provinces.includes 'NL' then 'IMG/provinces/colour/NL_Selected.svg' else 'IMG/provinces/colour/NL_Unselected.svg'
      'PE' :
        key: 'PE'
        present: if @config.provinces.includes 'PE' then true else false
        colour: '#8D574C'
        img: 
          if @zeroedOut('PE') 
            'IMG/provinces/DataUnavailable/PEI_Unavailable.svg'
          else
            if @config.provinces.includes 'PE' then 'IMG/provinces/colour/PEI_Selected.svg' else 'IMG/provinces/colour/PEI_Unselected.svg'
      'YT' :
        key: 'YT'
        present: if @config.provinces.includes 'YT' then true else false
        colour: '#F5B6D1'
        img: 
          if @zeroedOut('YT') 
            'IMG/provinces/DataUnavailable/Yukon_Unavailable.svg'
          else
            if @config.provinces.includes 'YT' then 'IMG/provinces/colour/Yukon_Selected.svg' else 'IMG/provinces/colour/Yukon_Unselected.svg'
      'NT' :
        key: 'NT'
        present: if @config.provinces.includes 'NT' then true else false
        colour: '#D62A28'
        img: 
          if @zeroedOut('NT') 
            'IMG/provinces/DataUnavailable/NT_Unavailable.svg'
          else
            if @config.provinces.includes 'NT' then 'IMG/provinces/colour/NT_Selected.svg' else 'IMG/provinces/colour/NT_Unselected.svg'
      'NU' : 
        key: 'NU'
        present: if @config.provinces.includes 'NU' then true else false
        colour: '#9268ac'
        img: 
          if @zeroedOut('NU') 
            'IMG/provinces/DataUnavailable/NU_Unavailable.svg'
          else
            if @config.provinces.includes 'NU' then 'IMG/provinces/colour/NU_Selected.svg' else 'IMG/provinces/colour/NU_Unselected.svg'
    }
    # Ordering based on the constant
    provincesDicInOrder = {}
    for province in Constants.provinces
      provincesDicInOrder[province] = provinceColours[province]
    provincesDicInOrder

  provinceMenuData: ->
    data = {}
    for province in @config.provincesInOrder
      data[province]= @provincesDictionary()[province]
    data

  dataForStackMenu: ->
    if @config.viewBy == 'province'
      @sourceMenuData()
    else
      @provinceMenuData()

  dataForSingleSelectMenu: ->
    mappingForSingleSelectMenu = []
    if @config.viewBy == 'province' then startingData = @provincesBlackAndWhiteDictionary() else startingData = @sourcesBlackAndWhiteDictionary()
    for key, element of startingData
      mappingForSingleSelectMenu.push element
    mappingForSingleSelectMenu

  addLabelsToData: (data) ->
    if @config.viewBy == 'province'
      for singleSelectBubble in data.children
        singleSelectBubble.img = @provincesBlackDictionary()[singleSelectBubble.name].img
    else
      for singleSelectBubble in data.children
        singleSelectBubble.img = @sourcesBlackDictionary()[singleSelectBubble.name].img
    data


  # The 'correct' scale used by the graph
  yearScale: ->
    d3.scale.linear()
        .domain([
          2005 
          2040
        ])
        .range [
          @timelineMargin
          @timelineRightEnd()
        ]

  yearAxis: ->
    d3.svg.axis()
      .scale(@yearScale())
      .tickSize(10,2)
      .ticks(7)
      .tickFormat((d) ->
        if d == 2005 or d == 2040 then d else "")
      .orient("bottom")

  buildYearAxis: ->
    axis = d3.select(@app.window.document).select("#timelineAxis")
      .attr
        fill: '#333'
        transform: "translate( 0, #{@height() + @_margin.top + @sliderLabelHeight})" 
      .call(@yearAxis())
      
    #We need a wider target for the click so we use a separate group
    d3.select(@app.window.document).select('#timeLineTouch')
      .attr
        class: 'pointerCursor'
        'pointer-events': "visible"
        transform:
          "translate( 0, #{@height() + @_margin.top + @sliderLabelHeight - (axis.node().getBoundingClientRect().height / 2)})"
        height: axis.node().getBoundingClientRect().height
        width: axis.node().getBoundingClientRect().width
      .style
        fill: 'none'
      .on "click", =>
        element = d3.select(@app.window.document).select('#timelineAxis').node()
        newX = d3.mouse(element)[0]
        if newX < @timelineMargin then newX = @timelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        year = Math.round(@yearScale().invert(newX))
        if year != @config.year
          @config.setYear year
          d3.select(@app.window.document).select('#sliderLabel').attr(
            transform: "translate(#{newX}, #{@height() + @_margin.top - 5})"
          )
          d3.select(@app.window.document).select('#labelBox').text((d) =>
            @config.year
          )
          @getData()
      
    axis.selectAll("text") 
        .style 
          "text-anchor": "middle"
        .attr
          dy: "0.5em"
          'fill': '#333'

    axis.select 'path.domain'
      .attr
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "2"
        'shape-rendering': 'crispEdges'

    axis.selectAll '.tick line'
      .attr
        transform: "translate( 0, -5)" # Center them around the line
        fill: 'none'
        stroke: '#333333'
        'stroke-width': "2"
        'shape-rendering': 'crispEdges'
  
  buildSliderLabel: ->
    d3.select(@app.window.document).select('.sliderLabel').remove()
    year = @config.year

    #Drag Behaviour
    drag = d3.behavior.drag()
    drag.on("drag", (d,i) =>
      newX = d3.event.x
      d3.select(@app.window.document).select('#sliderLabel').attr("transform", (d,i) =>
        if newX < @timelineMargin then newX = @timelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        "translate(#{newX}, #{@height() + @_margin.top - 5})"
      )
      year = Math.round(@yearScale().invert(newX))
      if year != @config.year
        @config.setYear year
        d3.select(@app.window.document).select('#labelBox').text((d) =>
          @config.year
        )
        @getData()
    )
    drag.on("dragend", (d, i) =>
      if year != @config.year
        newX = @yearScale()(year)
        d3.select(@app.window.document).select('#sliderLabel').attr(
          transform: "translate(#{newX}, #{@height() + @_margin.top - 5})"
        )
        d3.select(@app.window.document).select('#labelBox').selectAll('text').text((d) =>
          @config.year
        )
        @config.setYear year
        @getData()
    )
    sliderWidth= 70

    sliderLabel = d3.select(@app.window.document).select('#graphSVG')
      .append('g')
      .attr
        id: 'sliderLabel'
        class: 'sliderLabel pointerCursor'
        transform: "translate(#{@yearScale()(@config.year)},#{@height() + @_margin.top - 5})" #Re the 5. It is because the ticks are moved
      .call(drag)
        
    sliderLabel.append "image"
      .attr
        class: "tLTriangle"
        "xlink:href": 'IMG/yearslider.svg'
        x: -(sliderWidth / 2)
        y: 0
        width: sliderWidth
        height: sliderWidth / 2

      
    sliderLabel.append('text')
      .attr
        class: 'sliderLabel'
        id: 'labelBox'
        x: -(sliderWidth / 4) + 1.5 #the extra centers it with due to the font height
        y: (sliderWidth / 4) - 1.5
        fill: '#fff'
      .text((d) =>
        @config.year
      )

  # I'm adding them to the left hand side for simplicity, we can move them later
  buildSliderButtons: ->
    d3.select(@app.window.document).select('#powerSourcePanel .mediaButtons').remove()
    div = d3.select(@app.window.document).select("#powerSourcePanel")
      .append("div")
        .attr
          class: 'mediaButtons'
      
    div.append('div')
      .attr
        class: 'playPauseButton selected'
        id: 'vizPauseButton'
      .on 'click', =>
        d3.select(@app.window.document).select('#vizPauseButton').html("<img src='IMG/play_pause/pausebutton_selectedR.svg'/>")
        d3.select(@app.window.document).select('#vizPlayButton').html("<img src='IMG/play_pause/playbutton_unselectedR.svg'/>")
        if @yearTimeout then window.clearTimeout(@yearTimeout)
      .html("<img src='IMG/play_pause/pausebutton_selectedR.svg'/>")
    
    div.append('div')
      .attr
        id: 'vizPlayButton'
        class: 'playPauseButton'
      .on 'click', (d) =>
        d3.select(@app.window.document).select('#vizPlayButton').html("<img src='IMG/play_pause/playbutton_selectedR.svg'/>")
        d3.select(@app.window.document).select('#vizPauseButton').html("<img src='IMG/play_pause/pausebutton_unselectedR.svg'/>")
        if @yearTimeout then window.clearTimeout(@yearTimeout)
        timeoutComplete= => 
          if @_chart
            if @config.year < 2040
              @config.setYear @config.year + 1
              @yearTimeout = window.setTimeout(timeoutComplete, @_chart._duration)
              @getData()
              d3.select(@app.window.document).select('#sliderLabel')
                .transition()
                  .attr(
                    transform: "translate(#{@yearScale()(@config.year)}, #{@height() + @_margin.top  - 5})"
                  )
                .duration(@_chart._duration)
                .ease('linear')
              d3.select(@app.window.document).select('#labelBox').text((d) =>
                @config.year
              )
            else
              d3.select(@app.window.document).select('#vizPauseButton').html("<img src='IMG/play_pause/pausebutton_selectedR.svg'/>")
              d3.select(@app.window.document).select('#vizPlayButton').html("<img src='IMG/play_pause/playbutton_unselectedR.svg'/>")
        @yearTimeout = window.setTimeout(timeoutComplete, 0)
      .html("<img src='IMG/play_pause/playbutton_unselectedR.svg'/>")

  buildTimeline: ->
    @buildYearAxis()
    @buildSliderLabel()
    @buildSliderButtons()

  getSelectionState: ->
    if @config.viewBy == 'province'
      if @config.sourcesInOrder.length != @config.sources.length
        allSelected = false
        if @config.sources.length > 0
          someSelected =  true
        else
          someSelected = false
      else
        allSelected = true
        someSelected = false
    else 
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

  # This is pretty messy. Since we want the spacing of the sources to match the spacing of the provinces
  # but the provinces menu is space out based on its height... we need to set one based on the other
  setIconSpacing: ->
    if @config.viewBy == 'province'
      @_chart.menu.setIconSpacing(@_singleSelectMenu.getIconSpacing())
    else
      @_singleSelectMenu.setIconSpacing(@_chart.menu.getIconSpacing())

  getData: ->
    @seriesData = @addLabelsToData(@app.electricityProductionProvider.dataForViz3(@config))
    if @_chart?
      @adjustViz()
    else
      @buildViz()

  buildViz:  ->
    @buildTimeline()
    @_singleSelectMenu = @buildSingleSelectMenu() # Black and white non multi select menu.
    parent = if @config.viewBy == 'province' then '#powerSourceMenuSVG' else '#provinceMenuSVG'
    bubbleOptions = 
      size:
        w: @width()
        h: @height()
      position:
        x: @_margin.left
        y: @_margin.top
      data:
        @seriesData
      groupId:
        'graphGroup'
      mapping:
        @dataForStackMenu()
      duration:
        @app.animationDuration
      menuParent: 
        parent
      menuOptions:
        size: 
          w: d3.select(parent).node().getBoundingClientRect().width
          h: @leftHandMenuHeight()
        boxSize: 37.5
        onSelected:
          @menuSelect
        allSelected:
          @getSelectionState().allSelected
        someSelected:
          @getSelectionState().someSelected
        allSquareHandler:
          @selectAllBubbles
        showHelpHandler:
          if @config.viewBy == 'province' then @showSourceNames else @showProvinceNames
        canDrag: 
          false
        groupId:
          'stackMenu'
    @_chart = new bubbleChart(@app, "#graphSVG", bubbleOptions)
    @setIconSpacing()


  adjustViz: ->
    @_chart.menu.someSelected(@getSelectionState().someSelected)
    @_chart.menu.allSelected(@getSelectionState().allSelected)
    @_chart.mapping(@dataForStackMenu())
    @_chart.data(@seriesData)

  # When swapping between views (province and type) we need to regenerate the menus
  toggleViz: ->
    @app.popoverManager.closePopover()

    # Filters should not apply between them as the display options change
    @config.setProvince 'all'
    @config.setSource 'total'
    @config.resetSources(true) 
    @config.resetProvinces(true)

    @seriesData = @addLabelsToData(@app.electricityProductionProvider.dataForViz3(@config))
    @_chart.mapping(@dataForStackMenu())
    @_chart.menu.someSelected(@getSelectionState().someSelected)
    @_chart.menu.allSelected(@getSelectionState().allSelected)
    @_chart.data(@seriesData)

    @_singleSelectMenu._allSelected = true
    @_singleSelectMenu.data(@dataForSingleSelectMenu())

    # Swapping spots is easier than hooking the menus up with the appropriate charts :)
    newParentForChartMenu = @_singleSelectMenu.parent()
    @_singleSelectMenu.moveMenu(@_chart.menu.parent())
    @_chart.menu.moveMenu(newParentForChartMenu)
    @setIconSpacing()

    if @config.viewBy == 'province'
      @_singleSelectMenu.setHelpHandler(@showProvinceNames)
      @_chart.menu.setHelpHandler(@showSourceNames)
    else
      @_singleSelectMenu.setHelpHandler(@showSourceNames)
      @_chart.menu.setHelpHandler(@showProvinceNames)

  selectAllBubbles:(selecting)=>
    if @config.viewBy == 'province' then @config.resetSources(selecting) else @config.resetProvinces(selecting)
    @getData()

  # Select one callback for the current multiselect
  menuSelect: (key, index) =>
    @config.flip(key)
    @getData()

  # Black and white non multi select menu.
  buildSingleSelectMenu: ->
    selectAll = if @config.viewBy == 'province' then @config.province == 'all' else @config.source == 'total' 
    parent = if @config.viewBy == 'province' then '#provinceMenuSVG' else '#powerSourceMenuSVG'
    provinceOptions=
      size: 
          w: d3.select(parent).node().getBoundingClientRect().width
          h: @leftHandMenuHeight()
      canDrag: false
      hasChart: false
      parentClass: 'provinceMenu'
      data: @dataForSingleSelectMenu()
      boxSize: 37.5
      onSelected:
        @singleSelectSelected
      addAllSquare: true
      allSelected: selectAll
      allSquareHandler:
        @selectAllSingleSelect
      showHelpHandler: 
        if @config.viewBy == "province" then @showProvinceNames else @showSourceNames
      groupId:
        'singleSelectMenu'
    new squareMenu(@app, parent, provinceOptions) 

  selectAllSingleSelect: (selecting) =>
    if @config.viewBy == 'province' then @config.setProvince 'all' else @config.setSource 'total'
    @_singleSelectMenu._allSelected = true
    @_singleSelectMenu.data(@dataForSingleSelectMenu())
    @getData()

  singleSelectSelected: (key, index)=>
    @_singleSelectMenu._allSelected = false
    item = @_singleSelectMenu.mapping()[index]
    if @config.viewBy == 'province'
      @config.setProvince item.key
    else if @config.viewBy == 'source'
      @config.setSource item.key
    @_singleSelectMenu.data(@dataForSingleSelectMenu())
    @getData()

  showSourceNames: =>
    d3.event.stopPropagation()
    if @app.popoverManager.currentPopover == @sourcesHelpPopover
      @app.popoverManager.closePopover()
    else
      if @config.viewBy == 'province' then images = @colouredSourceIconsDictionary() else images = @sourcesBlackDictionary()
      #Grab the provinces in order for the string
      contentString = ""
      for key, source of @sourceMenuData()
        contentString = """
          <div class="#{if @config.viewBy == "source" then 'sourceLabel'  else 'sourceLabel sourceLabel' + key}"> 
            <img class="sourceIcon" src="#{images[key].img}">
            <h6> #{Tr.sourceSelector.sources[key][@app.language]} </h6> 
            <div class="clearfix"> </div>
            <p> #{Tr.sourceSelector.sourceSelectorHelp[key][@app.language]} </p>
          </div>
          """ + contentString
      contentString = Tr.sourceSelector.sourceSelectorHelp.generalHelp[@app.language] + contentString

      @app.popoverManager.showPopover @sourcesHelpPopover, 
        outerClasses: 'vizModal floatingPopover popOverLg sourceSelectorHelp'
        innerClasses: 'localHelpTitle'
        title: Tr.sourceSelector.selectSourceLabel[@app.language]
        content: contentString
        attachmentSelector: '#powerSourceSelector'

  showProvinceNames: =>
    d3.event.stopPropagation()
    if @app.popoverManager.currentPopover == @provincesHelpPopover
      @app.popoverManager.closePopover()
    else
      #Grab the provinces in order for the string
      contentString = ""
      for province of @provinceMenuData()
        contentString = """<div class="#{if @config.viewBy == 'province' then 'provinceLabel' else 'provinceLabel provinceLabel' + province}"> <h6> #{Tr.regionSelector.names[province][@app.language]} </h6> </div>""" + contentString

      @app.popoverManager.showPopover @provincesHelpPopover, 
        outerClasses: 'vizModal floatingPopover popOverSm provinceHelp'
        innerClasses: 'localHelpTitle'
        title: Tr.regionSelector.selectRegionLabel[@app.language]
        content: contentString
        attachmentSelector: '#provincesSelector'

Visualization3.resourcesLoaded = (app) ->
  app.loadedStatus.electricityProductionProvider


module.exports = Visualization3