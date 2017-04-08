d3 = require 'd3'
Mustache = require 'mustache'

visualization = require './visualization.coffee'
BubbleChart = require '../charts/bubble-chart.coffee'
Constants = require '../Constants.coffee'
SquareMenu2 = require '../charts/SquareMenu2.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'

if Platform.name == 'browser'
  Visualization3Template = require '../templates/Visualization3.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'


ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'


class Visualization3 extends visualization
  height = 700



  renderBrowserTemplate: ->
    contentElement = @app.window.document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render Visualization3Template,
      selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
      selectViewByLabel: Tr.viewBySelector.selectViewByLabel[@app.language]
      selectUnitLabel: Tr.unitSelector.selectUnitLabel[@app.language]
      selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      selectSourceLabel: Tr.sourceSelector.selectSourceLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate

      altText:
        viewByHelp: Tr.altText.viewByHelp[@app.language]
        unitsHelp: Tr.altText.unitsHelp[@app.language]
        datasetsHelp: Tr.altText.datasetsHelp[@app.language]
        scenariosHelp: Tr.altText.scenariosHelp[@app.language]


    @datasetHelpPopover = new ControlsHelpPopover @app
    @viewByHelpPopover = new ControlsHelpPopover @app
    @unitsHelpPopover = new ControlsHelpPopover @app
    @scenariosHelpPopover = new ControlsHelpPopover @app
    @sourcesHelpPopover = new ControlsHelpPopover @app
    @provincesHelpPopover = new ControlsHelpPopover @app

    d3.select(@app.window.document).select '#datasetSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @datasetHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @datasetHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover datasetSelectorHelp'
            innerClasses: 'viz3HelpTitle'
            title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
            content: Tr.datasetSelector.datasetSelectorHelp[@app.language]
            attachmentSelector: '.datasetSelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz3 dataset help'

    d3.select(@app.window.document).select '#viewBySelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @viewByHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @viewByHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover viewBySelectorHelp'
            innerClasses: 'viz3HelpTitle'
            title: Tr.viewBySelector.viewBySelectorHelpTitle[@app.language]
            content: Tr.viewBySelector.viewBySelectorHelp[@app.language]
            attachmentSelector: '.viewBySelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz3 view by help'

    d3.select(@app.window.document).select '#unitSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @unitsHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @unitsHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover unitSelectorHelp'
            innerClasses: 'viz3HelpTitle'
            title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
            content: Tr.unitSelector.unitSelectorHelp[@app.language]
            attachmentSelector: '.unitsSelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz3 unit help'
    
    d3.select(@app.window.document).select '#scenarioSelectorHelpButton'
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        if @app.popoverManager.currentPopover == @scenariosHelpPopover
          @app.popoverManager.closePopover()
        else
          @app.popoverManager.showPopover @scenariosHelpPopover,
            outerClasses: 'vizModal controlsHelpPopover scenarioSelectorHelp'
            innerClasses: 'viz3HelpTitle'
            title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
            content: Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
            attachmentSelector: '.scenarioSelectorGroup'
          @app.analyticsReporter.reportEvent 'Controls help', 'Viz3 scenario help'

  renderServerTemplate: ->
    if @config.viewBy == 'province'
      legendContent = @sourceLegendData()
    else if @config.viewBy == 'source'
      legendContent = @provinceLegendData()

    contentElement = @app.window.document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render @options.template,
        svgStylesheet: @options.svgTemplate
        title: Tr.visualization3Title[@app.language]
        description: @config.imageExportDescription()
        energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
        bitlyLink: @app.bitlyLink
        legendContent: legendContent



  constructor: (@app, config, @options) ->
    super config

    @getData()

    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @_margin =
      top: 20
      left: 10
      right: 20
      bottom: 70
    @addDatasetToggle()
    @timelineMargin = 25
    @sliderLabelHeight = 28
    @svgResize()
    @addDatasetToggle()
    @buildProvinceVsSourceToggle()
    @addUnitToggle()
    @addScenarios()
    @render()

  tearDown: ->
    if @yearTimeout then window.clearTimeout @yearTimeout
    super()

  redraw: ->
    @svgResize()
    @buildTimeline()
    if @_chart
      @_chart._duration = 0 #prevent transitioning to the new width
      @_chart.size
        w: @width()
        h: @height()
      @_chart._duration = @app.animationDuration

    @provinceMenu.size
      w: d3.select(@app.window.document).select('#provinceMenuSVG').node().getBoundingClientRect().width
      h: @leftHandMenuHeight()

    @sourceMenu.size
      w: d3.select(@app.window.document).select('#powerSourceMenuSVG').node().getBoundingClientRect().width
      h: @leftHandMenuHeight()



  svgResize: ->
    d3.select(@app.window.document).select '#graphSVG'
      .attr
        width: @getSvgWidth()
        height: height
    d3.select(@app.window.document).select '#provinceMenuSVG'
      .attr
        width: d3.select(@app.window.document).select('#provincePanel').node().getBoundingClientRect().width
        height: height - @_margin.top
    d3.select(@app.window.document).select '#powerSourceMenuSVG'
      .attr
        width: d3.select(@app.window.document).select('#powerSourcePanel').node().getBoundingClientRect().width
        height: height - @_margin.top - @_margin.bottom


  getDataAndRender: ->
    @getData()
    @render()

  getData: ->
    @seriesData = @addLabelsToData @app.providers[@config.dataset].electricityProductionProvider.dataForViz3(@config)

  addLabelsToData: (data) ->
    if @config.viewBy == 'province'
      for singleSelectBubble in data.children
        singleSelectBubble.img = @provinceBlackIcons()[singleSelectBubble.name].img
    else
      for singleSelectBubble in data.children
        singleSelectBubble.img = @sourceBlackIcons()[singleSelectBubble.name].img
    data

  render: ->
    if @_chart?
      @updateViz()
    else
      @buildViz()

    # update the csv data download link
    d3.select(@app.window.document).select '#dataDownloadLink'
      .attr
        href: "csv_data#{ParamsToUrlString(@config.routerParams())}"

  buildViz:  ->
    @buildTimeline()
    @buildProvinceMenu()
    @buildSourceMenu()

    bubbleChartOptions =
      size:
        w: @width()
        h: @height()
      position:
        x: @_margin.left
        y: @_margin.top
      data: @seriesData
      year: @config.year
      groupId: 'graphGroup'
      mapping: @menuDataForChart()
      duration: @app.animationDuration
    @_chart = new BubbleChart @app, '#graphSVG', bubbleChartOptions



  updateViz: ->
    # NB: There is an order of execution dependency here that I don't fully understand
    # Menus need to be updated before the @_chart.data call
    # Is the chart mutating @seriesData? I think so in BubbleChart.filteredData
    @provinceMenu.data @dataForProvinceMenu()
    @provinceMenu.redraw()
    @sourceMenu.data @dataForSourceMenu()
    @sourceMenu.redraw()

    @_chart.mapping @menuDataForChart()
    @_chart.year @config.year
    @_chart.data @seriesData



  toggleViz: ->
    # Filters should not apply between them as the display options change
    @config.setProvince 'all'
    @config.setSource 'total'
    @config.resetSources true
    @config.resetProvinces true

    @getDataAndRender()








  ### Graph build methods ###

  buildProvinceVsSourceToggle: ->
    if @config.viewBy?
      viewBySelectors = d3.select(@app.window.document).select('#viewBySelector')
        .selectAll '.viewBySelectorButton'
        .data @viewByData()
      
      viewBySelectors.enter()
        .append('div')
        .attr
          class: 'viewBySelectorButton'
        .on 'click', (d) =>
          return if @config.viewBy == d.viewByName

          newConfig = new @config.constructor @app
          newConfig.copy @config
          newConfig.setViewBy d.viewByName

          update = =>
            @config.setViewBy d.viewByName
            @buildProvinceVsSourceToggle()
            @toggleViz()
            @app.router.navigate @config.routerParams()

          @app.datasetRequester.updateAndRequestIfRequired newConfig, update

      viewBySelectors.html (d) ->
        "<button class='#{d.class}' type='button' title='#{d.title}'>#{d.label}</button>"

      viewBySelectors.exit().remove()
  

  buildYearAxis: ->
    axis = d3.select(@app.window.document).select '#timelineAxis'
      .attr
        fill: '#333'
        transform: "translate( 0, #{@height() + @_margin.top + @sliderLabelHeight})"
      .call @yearAxis()
      
    # We need a wider target for the click so we use a separate group
    d3.select(@app.window.document).select('#timeLineTouch')
      .attr
        class: 'pointerCursor'
        'pointer-events': 'visible'
        transform:
          "translate( 0, #{@height() + @_margin.top + @sliderLabelHeight - (axis.node().getBoundingClientRect().height / 2)})"
        height: axis.node().getBoundingClientRect().height
        width: axis.node().getBoundingClientRect().width
      .style
        fill: 'none'
      .on 'click', =>
        element = d3.select(@app.window.document).select('#timelineAxis').node()
        newX = d3.mouse(element)[0]
        if newX < @timelineMargin then newX = @timelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        year = Math.round @yearScale().invert(newX)

        return if year == @config.year

        newConfig = new @config.constructor @app
        newConfig.copy @config
        newConfig.setYear year
    
        update = =>
          @config.setYear year
          d3.select(@app.window.document).select('#sliderLabel').attr
            transform: "translate(#{newX}, #{@height() + @_margin.top - 5})"
          
          d3.select(@app.window.document).select('#labelBox').text =>
            @config.year
          
          @getDataAndRender()
          @app.router.navigate @config.routerParams()

        @app.datasetRequester.updateAndRequestIfRequired newConfig, update


      
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
  
  buildSliderLabel: ->
    d3.select(@app.window.document).select('.sliderLabel').remove()
    year = @config.year

    #Drag Behaviour
    drag = d3.behavior.drag()
    drag.on 'drag', (d,i) =>
      newX = d3.event.x
      d3.select(@app.window.document).select('#sliderLabel').attr 'transform', (d,i) =>
        if newX < @timelineMargin then newX = @timelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        "translate(#{newX}, #{@height() + @_margin.top - 5})"

      year = Math.round @yearScale().invert(newX)
      if year != @config.year
        @config.setYear year
        @app.router.navigate @config.routerParams()
        d3.select(@app.window.document).select('#labelBox').text (d) =>
          @config.year
        
        @getDataAndRender()

    drag.on 'dragend', (d, i) =>
      if year != @config.year
        newX = @yearScale()(year)
        d3.select(@app.window.document).select('#sliderLabel').attr
          transform: "translate(#{newX}, #{@height() + @_margin.top - 5})"

        d3.select(@app.window.document).select('#labelBox').selectAll('text').text (d) =>
          @config.year
        @config.setYear year
        @app.router.navigate @config.routerParams()
        @getDataAndRender()

    sliderWidth = 70

    sliderLabel = d3.select(@app.window.document).select('#graphSVG')
      .append 'g'
      .attr
        id: 'sliderLabel'
        class: 'sliderLabel pointerCursor'
        # Re the 5. It is because the ticks are moved
        transform: "translate(#{@yearScale()(@config.year)},#{@height() + @_margin.top - 5})"
      .call drag
        
    sliderLabel.append 'image'
      .attr
        class: 'tLTriangle'
        'xlink:xlink:href': 'IMG/yearslider.svg'
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
      .text =>
        @config.year

  # I'm adding them to the left hand side for simplicity, we can move them later
  buildSliderButtons: ->
    d3.select(@app.window.document).select('#powerSourcePanel .mediaButtons').remove()
    div = d3.select(@app.window.document).select('#powerSourcePanel')
      .append 'div'
        .attr
          class: 'mediaButtons'
      
    div.append('div')
      .attr
        class: 'playPauseButton selected'
        id: 'vizPauseButton'
      .on 'click', =>
        d3.select(@app.window.document).select('#vizPauseButton').html("<img src='IMG/play_pause/pausebutton_selectedR.svg' alt='#{Tr.altText.pauseAnimation[@app.language]}'/>")
        d3.select(@app.window.document).select('#vizPlayButton').html("<img src='IMG/play_pause/playbutton_unselectedR.svg' alt='#{Tr.altText.playAnimation[@app.language]}'/>")
        if @yearTimeout then window.clearTimeout(@yearTimeout)
        @app.analyticsReporter.reportEvent 'Electricity Play/Pause', 'Pause'
      .html("<img src='IMG/play_pause/pausebutton_selectedR.svg' alt='#{Tr.altText.pauseAnimation[@app.language]}'/>")
    
    div.append('div')
      .attr
        id: 'vizPlayButton'
        class: 'playPauseButton'
      .on 'click', (d) =>
        d3.select(@app.window.document).select('#vizPlayButton').html("<img src='IMG/play_pause/playbutton_selectedR.svg' alt='#{Tr.altText.playAnimation[@app.language]}'/>")
        d3.select(@app.window.document).select('#vizPauseButton').html("<img src='IMG/play_pause/pausebutton_unselectedR.svg' alt='#{Tr.altText.pauseAnimation[@app.language]}'/>")
        if @yearTimeout then window.clearTimeout @yearTimeout
        timeoutComplete = =>
          return unless @_chart?

          if @config.year < 2040

            newConfig = new @config.constructor @app
            newConfig.copy @config
            newConfig.setYear @config.year + 1

            update = =>
              @config.setYear @config.year + 1
              @yearTimeout = window.setTimeout timeoutComplete, @_chart._duration
              @getDataAndRender()
              d3.select(@app.window.document).select('#sliderLabel')
                .transition()
                  .attr
                    transform: "translate(#{@yearScale()(@config.year)}, #{@height() + @_margin.top  - 5})"
                .duration @_chart._duration
                .ease 'linear'
              d3.select(@app.window.document).select('#labelBox').text =>
                @config.year
              @app.router.navigate @config.routerParams()

            @app.datasetRequester.updateAndRequestIfRequired newConfig, update

          else
            d3.select(@app.window.document).select('#vizPauseButton').html("<img src='IMG/play_pause/pausebutton_selectedR.svg' alt='#{Tr.altText.pauseAnimation[@app.language]}'/>")
            d3.select(@app.window.document).select('#vizPlayButton').html("<img src='IMG/play_pause/playbutton_unselectedR.svg' alt='#{Tr.altText.playAnimation[@app.language]}'/>")

        @yearTimeout = window.setTimeout timeoutComplete, 0
        @app.analyticsReporter.reportEvent 'Electricity Play/Pause', 'Play'

      .html "<img src='IMG/play_pause/playbutton_unselectedR.svg' alt='#{Tr.altText.playAnimation[@app.language]}'/>"



  buildTimeline: ->
    @buildYearAxis()
    @buildSliderLabel()
    @buildSliderButtons()





  buildProvinceMenu: ->
    options =
      parentId: '#provinceMenuSVG'
      canDrag: false
      boxSize: 37.5
      groupId: 'provinceMenuGroup'
      addAllSquare: true
      onSelected: (dataDictionaryItem) =>
        switch @config.viewBy
          when 'province'
            @singleButtonSingleProvince dataDictionaryItem
          when 'source'
            @singleButtonMultipleProvince dataDictionaryItem
      allSquareHandler: =>
        switch @config.viewBy
          when 'province'
            @allButtonSingleProvince()
          when 'source'
            @allButtonMultipleProvince()
      showHelpHandler: @showProvinceNames
      getAllIcon: =>
        switch @config.viewBy
          when 'province'
            if @config.province == 'all'
              Tr.allSelectorButton.all[@app.language]
            else
              Tr.allSelectorButton.none[@app.language]
          
          when 'source'
            if @config.provinces.length == Constants.provinces.length
              Tr.allSelectorButton.all[@app.language]
            else if @config.provinces.length > 0
              Tr.allSelectorButton.someSelected[@app.language]
            else if @config.provinces.length == 0
              Tr.allSelectorButton.none[@app.language]

    state =
      iconSpacing: 'auto'
      size:
        w: d3.select(@app.window.document).select('#provinceMenuSVG').node().getBoundingClientRect().width
        h: @leftHandMenuHeight()
      data: @dataForProvinceMenu()

    @provinceMenu = new SquareMenu2 @app, options, state

  buildSourceMenu: ->
    options =
      parentId: '#powerSourceMenuSVG'
      canDrag: false
      boxSize: 37.5
      groupId: 'sourceMenuGroup'
      addAllSquare: true
      onSelected: (dataDictionaryItem) =>
        switch @config.viewBy
          when 'source'
            @singleButtonSingleSource dataDictionaryItem
          when 'province'
            @singleButtonMultipleSource dataDictionaryItem
      allSquareHandler: =>
        switch @config.viewBy
          when 'source'
            @allButtonSingleSource()
          when 'province'
            @allButtonMultipleSource()
      showHelpHandler: @showSourceNames
      getAllIcon: =>
        switch @config.viewBy
          when 'source'
            if @config.source == 'total'
              Tr.allSelectorButton.all[@app.language]
            else
              Tr.allSelectorButton.none[@app.language]
          
          when 'province'
            if @config.sources.length == Constants.viz3Sources.length
              Tr.allSelectorButton.all[@app.language]
            else if @config.sources.length > 0
              Tr.allSelectorButton.someSelected[@app.language]
            else if @config.sources.length == 0
              Tr.allSelectorButton.none[@app.language]


    state =
      iconSpacing: @provinceMenu.getIconSpacing()
      size:
        w: d3.select(@app.window.document).select('#powerSourceMenuSVG').node().getBoundingClientRect().width
        h: @leftHandMenuHeight()
      data: @dataForSourceMenu()

    @sourceMenu = new SquareMenu2 @app, options, state









  ### Callbacks ###
  # The two control menus for regions and power sources can each function in two ways:
  # as single selection 'radio button' menus, or as multiple selection menus
  # In addition, they each have an all button which works differently depending on which
  # mode the menu is in.

  # These handlers each take care of one case, the callbacks themselves decide on the
  # handler to call
  

  allButtonSingleProvince: ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince 'all'

    update = =>
      @config.setProvince 'all'
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update


  allButtonMultipleProvince: ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    if @config.provinces.length == Constants.provinces.length
      # If all provinces are present, select none
      newConfig.resetProvinces false
    else if @config.provinces.length > 0
      # If some provinces are selected, select all
      newConfig.resetProvinces true
    else if @config.provinces.length == 0
      # If no provinces are selected, select all
      newConfig.resetProvinces true

    update = =>
      if @config.provinces.length == Constants.provinces.length
        # If all provinces are present, select none
        @config.resetProvinces false
      else if @config.provinces.length > 0
        # If some provinces are selected, select all
        @config.resetProvinces true
      else if @config.provinces.length == 0
        # If no provinces are selected, select all
        @config.resetProvinces true

      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update
  

  allButtonSingleSource: ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setSource 'total'

    update = =>
      @config.setSource 'total'
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update
  

  allButtonMultipleSource: ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    if @config.sources.length == Constants.viz3Sources.length
      # If all sources are present, select none
      newConfig.resetSources false
    else if @config.sources.length > 0
      # If some sources are selected, select all
      newConfig.resetSources true
    else if @config.sources.length == 0
      # If no sources are selected, select all
      newConfig.resetSources true

    update = =>
      if @config.sources.length == Constants.viz3Sources.length
        # If all sources are present, select none
        @config.resetSources false
      else if @config.sources.length > 0
        # If some sources are selected, select all
        @config.resetSources true
      else if @config.sources.length == 0
        # If no sources are selected, select all
        @config.resetSources true

      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update
  

  singleButtonSingleProvince: (dataDictionaryItem) ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setProvince dataDictionaryItem.key

    update = =>
      @config.setProvince dataDictionaryItem.key
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update

  singleButtonMultipleProvince: (dataDictionaryItem) ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.flipProvince dataDictionaryItem.key

    update = =>
      @config.flipProvince dataDictionaryItem.key
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update
  

  singleButtonSingleSource: (dataDictionaryItem) ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setSource dataDictionaryItem.key

    update = =>
      @config.setSource dataDictionaryItem.key
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update
  

  singleButtonMultipleSource: (dataDictionaryItem) ->
    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.flipSource dataDictionaryItem.key

    update = =>
      @config.flipSource dataDictionaryItem.key
      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update





  showSourceNames: =>
    d3.event.stopPropagation()
    d3.event.preventDefault()
    if @app.popoverManager.currentPopover == @sourcesHelpPopover
      @app.popoverManager.closePopover()
    else
      if @config.viewBy == 'province' then images = @sourceColorIcons() else images = @sourceBlackIcons()
      #Grab the provinces in order for the string
      contentString = ''
      for key of @sourceColorMenuDictionary()
        contentString = """
          <div class="#{if @config.viewBy == "source" then 'sourceLabel'  else 'sourceLabel sourceLabel' + key}">
            <img class="sourceIcon" src="#{images[key].img}" alt="#{Tr.altText.sources[key][@app.language]}">
            <h2> #{Tr.sourceSelector.sources[key][@app.language]} </h2>
            <div class="clearfix"> </div>
            <p> #{Tr.sourceSelector.sourceSelectorHelp[key][@app.language]} </p>
          </div>
          """ + contentString
      contentString = Tr.sourceSelector.sourceSelectorHelp.generalHelp[@app.language] + contentString

      @app.popoverManager.showPopover @sourcesHelpPopover,
        outerClasses: 'vizModal controlsHelpPopover popOverLg sourceSelectorHelp'
        title: Tr.sourceSelector.selectSourceLabel[@app.language]
        content: contentString
        attachmentSelector: '#powerSourceSelector'
      @app.analyticsReporter.reportEvent 'Controls help', 'Viz3 source help'

  showProvinceNames: =>
    d3.event.stopPropagation()
    d3.event.preventDefault()
    if @app.popoverManager.currentPopover == @provincesHelpPopover
      @app.popoverManager.closePopover()
    else
      #Grab the provinces in order for the string
      contentString = ''
      for province of @provinceColorMenuDictionary()
        contentString = """<div class="#{if @config.viewBy == 'province' then 'provinceLabel' else 'provinceLabel provinceLabel' + province}"> <h2> #{Tr.regionSelector.names[province][@app.language]} </h2> </div>""" + contentString

      @app.popoverManager.showPopover @provincesHelpPopover,
        outerClasses: 'vizModal controlsHelpPopover popOverSm provinceHelp'
        title: Tr.regionSelector.selectRegionLabel[@app.language]
        content: contentString
        attachmentSelector: '#provincesSelector'
      @app.analyticsReporter.reportEvent 'Controls help', 'Viz3 region help'













  ### Helper functions ###

  # the graph's height
  height: ->
    height - @_margin.top - @_margin.bottom

  # We want this menu to line up with the bottom of the x axis TICKS so those must be
  # built before we can set this.
  leftHandMenuHeight: ->
    @height() + d3.select(@app.window.document).select('#timelineAxis').node().getBoundingClientRect().height

  # the graph's width
  width: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      d3.select(@app.window.document).select('#graphPanel').node().getBoundingClientRect().width - @_margin.left - @_margin.right
    else if Platform.name == 'server'
      Constants.serverSideGraphWidth - @_margin.left - @_margin.right


  timelineRightEnd: ->
    @getSvgWidth() - @timelineMargin

  getSvgWidth: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      svgWidth = d3.select(@app.window.document).select('#graphPanel').node().getBoundingClientRect().width
    else if Platform.name == 'server'
      svgWidth = Constants.serverSideGraphWidth

    svgWidth


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
      .tickFormat (d) ->
        if d == 2005 or d == 2040 then d else ''
      .orient 'bottom'





  ### Data dictionaries for D3 data join driven components ###

  # Used for chart bubbles colours
  menuDataForChart: ->
    switch @config.viewBy
      when 'province'
        @sourceColorMenuDictionary()
      when 'source'
        @provinceColorMenuDictionary()

  dataForProvinceMenu: ->
    dataHash = switch @config.viewBy
      when 'province'
        @provinceBlackMenuDictionary()
      when 'source'
        @provinceColorMenuDictionary()

    dataArray = []
    for province in Constants.provinces
      dataArray.push dataHash[province]
    dataArray

  dataForSourceMenu: ->
    dataHash = switch @config.viewBy
      when 'province'
        @sourceColorMenuDictionary()
      when 'source'
        @sourceBlackMenuDictionary()

    dataArray = []
    for source in Constants.viz3Sources
      dataArray.push dataHash[source]
    dataArray


  viewByData: ->
    [
      {
        title: Tr.selectorTooltip.viewBySelector.viewByProvinceButton[@app.language]
        label: Tr.viewBySelector.viewByProvinceButton[@app.language]
        viewByName: 'province'
        class: if @config.viewBy == 'province' then 'vizButton selected' else 'vizButton'
      }
      {
        title: Tr.selectorTooltip.viewBySelector.viewBySourceButton[@app.language]
        label: Tr.viewBySelector.viewBySourceButton[@app.language]
        viewByName: 'source'
        class: if @config.viewBy == 'source' then 'vizButton selected' else 'vizButton'
      }
    ]

  # When @seriesData.children.length != 1, we are looking at all regions or all sources
  # on the current single selection menu. Since all of the corresponding multi select
  # options will have some data, we skip the 'zeroedOut' check and do not show any of the
  # icons with a grey slash
  zeroedOut: (key) ->
    if !(@seriesData) or !(@seriesData.children) or (@seriesData.children.length != 1) then return false
    itemKey = @seriesData.children[0].children.filter (item) -> item.source == key
    if itemKey.length == 0 then true else false
    



  sourceColorMenuDictionary: ->
    hydro:
      key: 'hydro'
      tooltip: Tr.sourceSelector.sourceSelectorHelp.hydro[@app.language]
      img:
        if @zeroedOut('hydro')
          'IMG/sources/unavailable/hydro_unavailable.svg'
        else
          if @config.sources.includes 'hydro' then 'IMG/sources/hydro_selected.svg' else 'IMG/sources/hydro_unselected.svg'
      present: if @config.sources.includes 'hydro' then true else false
      colour: '#4167b1'
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
    nuclear:
      key: 'nuclear'
      tooltip: Tr.sourceSelector.sourceSelectorHelp.nuclear[@app.language]
      img:
        if @zeroedOut('nuclear')
          'IMG/sources/unavailable/nuclear_unavailable.svg'
        else
          if @config.sources.includes 'nuclear' then 'IMG/sources/nuclear_selected.svg' else 'IMG/sources/nuclear_unselected.svg'
      present: if @config.sources.includes 'nuclear' then true else false
      colour: '#cccb31'
      


  sourceBlackMenuDictionary: ->
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
    

  sourceBlackIcons: ->
    hydro:
      img: 'IMG/sources/hydro_selectedR.svg'
    solarWindGeothermal:
      img: 'IMG/sources/solarWindGeo_selectedR.svg'
    coal:
      img: 'IMG/sources/coal_selectedR.svg'
    naturalGas:
      img: 'IMG/sources/naturalGas_selectedR.svg'
    bio:
      img: 'IMG/sources/biomass_selectedR.svg'
    nuclear:
      img: 'IMG/sources/nuclear_selectedR.svg'
    oilProducts:
      img: 'IMG/sources/oil_products_selectedR.svg'

  # sourceColorIcons is only used for the sources help popover
  # NB: There is no equivalent provinceColorIcons, because we do not show region icons
  # on the help popover for regions
  sourceColorIcons: ->
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

  sourceLegendData: ->
    baseData =
      hydro:
        img: 'IMG/sources/hydro_selected.svg'
        present: @config.sources.includes('hydro') and not @zeroedOut('hydro')
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
      nuclear:
        img: 'IMG/sources/nuclear_selected.svg'
        present: @config.sources.includes('nuclear') and not @zeroedOut('nuclear')

    data = []
    for source in Constants.viz3Sources
      data.push baseData[source] if baseData[source].present

    # Legend content is reversed because graph elements are built bottom to top,
    # but html elements will be laid out top to bottom.
    data.reverse()
    data


  provinceBlackMenuDictionary: ->
    AB:
      key: 'AB'
      tooltip: Tr.regionSelector.names.AB[@app.language]
      present: true
      colour: if @config.province == 'AB' then '#333' else '#fff'
      img: if @config.province == 'AB' then 'IMG/provinces/radio/AB_SelectedR.svg' else 'IMG/provinces/radio/AB_UnselectedR.svg'
    BC:
      key: 'BC'
      tooltip: Tr.regionSelector.names.BC[@app.language]
      present: true
      colour: if @config.province == 'BC' then '#333' else '#fff'
      img: if @config.province == 'BC' then 'IMG/provinces/radio/BC_SelectedR.svg' else 'IMG/provinces/radio/BC_UnselectedR.svg'
    MB:
      key: 'MB'
      tooltip: Tr.regionSelector.names.MB[@app.language]
      present: true
      colour: if @config.province == 'MB' then '#333' else '#fff'
      img: if @config.province == 'MB' then 'IMG/provinces/radio/MB_SelectedR.svg' else 'IMG/provinces/radio/MB_UnselectedR.svg'
    NB:
      key: 'NB'
      tooltip: Tr.regionSelector.names.NB[@app.language]
      present: true
      colour: if @config.province == 'NB' then '#333' else '#fff'
      img: if @config.province == 'NB' then 'IMG/provinces/radio/NB_SelectedR.svg' else 'IMG/provinces/radio/NB_UnselectedR.svg'
    NL:
      key : 'NL'
      tooltip: Tr.regionSelector.names.NL[@app.language]
      present: true
      colour: if @config.province == 'NL' then '#333' else '#fff'
      img: if @config.province == 'NL' then 'IMG/provinces/radio/NL_SelectedR.svg' else 'IMG/provinces/radio/NL_UnselectedR.svg'
    NS:
      key: 'NS'
      tooltip: Tr.regionSelector.names.NS[@app.language]
      present: true
      colour: if @config.province == 'NS' then '#333' else '#fff'
      img: if @config.province == 'NS' then 'IMG/provinces/radio/NS_SelectedR.svg' else 'IMG/provinces/radio/NS_UnselectedR.svg'
    NT:
      key: 'NT'
      tooltip: Tr.regionSelector.names.NT[@app.language]
      present: true
      colour: if @config.province == 'NT' then '#333' else '#fff'
      img: if @config.province == 'NT' then 'IMG/provinces/radio/NT_SelectedR.svg' else 'IMG/provinces/radio/NT_UnselectedR.svg'
    NU:
      key: 'NU'
      tooltip: Tr.regionSelector.names.NU[@app.language]
      present: true
      colour: if @config.province == 'NU' then '#333' else '#fff'
      img: if @config.province == 'NU' then 'IMG/provinces/radio/NU_SelectedR.svg' else 'IMG/provinces/radio/NU_UnselectedR.svg'
    ON:
      key: 'ON'
      tooltip: Tr.regionSelector.names.ON[@app.language]
      present: true
      colour: if @config.province == 'ON' then '#333' else '#fff'
      img: if @config.province == 'ON' then 'IMG/provinces/radio/ON_SelectedR.svg' else 'IMG/provinces/radio/ON_UnselectedR.svg'
    PE:
      key: 'PE'
      tooltip: Tr.regionSelector.names.PE[@app.language]
      present: true
      colour: if @config.province == 'PE' then '#333' else '#fff'
      img: if @config.province == 'PE' then 'IMG/provinces/radio/PEI_SelectedR.svg' else 'IMG/provinces/radio/PEI_UnselectedR.svg'
    QC:
      key: 'QC'
      tooltip: Tr.regionSelector.names.QC[@app.language]
      present: true
      colour: if @config.province == 'QC' then '#333' else '#fff'
      img: if @config.province == 'QC' then 'IMG/provinces/radio/QC_SelectedR.svg' else 'IMG/provinces/radio/QC_UnselectedR.svg'
    SK:
      key: 'SK'
      tooltip: Tr.regionSelector.names.SK[@app.language]
      present: true
      colour: if @config.province == 'SK' then '#333' else '#fff'
      img: if @config.province == 'SK' then 'IMG/provinces/radio/Sask_SelectedR.svg' else 'IMG/provinces/radio/Sask_UnselectedR.svg'
    YT:
      key: 'YT'
      tooltip: Tr.regionSelector.names.YT[@app.language]
      present: true
      colour: if @config.province == 'YT' then '#333' else '#fff'
      img: if @config.province == 'YT' then 'IMG/provinces/radio/Yukon_SelectedR.svg' else 'IMG/provinces/radio/Yukon_UnselectedR.svg'

  provinceColorMenuDictionary: ->
    BC:
      key: 'BC'
      present: if @config.provinces.includes 'BC' then true else false
      colour: '#AEC7E8'
      img:
        if @zeroedOut 'BC'
          'IMG/provinces/DataUnavailable/BC_Unavailable.svg'
        else
          if @config.provinces.includes 'BC' then 'IMG/provinces/colour/BC_Selected.svg' else 'IMG/provinces/colour/BC_Unselected.svg'
    AB:
      key: 'AB'
      present: if @config.provinces.includes 'AB' then true else false
      colour: '#2278b5'
      img:
        if @zeroedOut 'AB'
          'IMG/provinces/DataUnavailable/AB_Unavailable.svg'
        else
          if @config.provinces.includes 'AB' then 'IMG/provinces/colour/AB_Selected.svg' else 'IMG/provinces/colour/AB_Unselected.svg'
    SK:
      key: 'SK'
      present: if @config.provinces.includes 'SK' then true else false
      colour: '#d77ab1'
      img:
        if @zeroedOut 'SK'
          'IMG/provinces/DataUnavailable/SK_Unavailable.svg'
        else
          if @config.provinces.includes 'SK' then 'IMG/provinces/colour/Sask_Selected.svg' else 'IMG/provinces/colour/Sask_Unselected.svg'
    MB:
      key: 'MB'
      present: if @config.provinces.includes 'MB' then true else false
      colour: '#FCBB78'
      img:
        if @zeroedOut 'MB'
          'IMG/provinces/DataUnavailable/MB_Unavailable.svg'
        else
          if @config.provinces.includes 'MB' then 'IMG/provinces/colour/MB_Selected.svg' else 'IMG/provinces/colour/MB_Unselected.svg'
    ON:
      key: 'ON'
      present: if @config.provinces.includes 'ON' then true else false
      colour: '#C5B1D6'
      img:
        if @zeroedOut 'ON'
          'IMG/provinces/DataUnavailable/ON_Unavailable.svg'
        else
          if @config.provinces.includes 'ON' then 'IMG/provinces/colour/ON_Selected.svg' else 'IMG/provinces/colour/ON_Unselected.svg'
    QC:
      key: 'QC'
      present: if @config.provinces.includes 'QC' then true else false
      colour: '#c49c94'
      img:
        if @zeroedOut 'QC'
          'IMG/provinces/DataUnavailable/QC_Unavailable.svg'
        else
          if @config.provinces.includes 'QC' then 'IMG/provinces/colour/QC_Selected.svg' else 'IMG/provinces/colour/QC_Unselected.svg'
    NB:
      key: 'NB'
      present: if @config.provinces.includes 'NB' then true else false
      colour: '#2FA148'
      img:
        if @zeroedOut 'NB'
          'IMG/provinces/DataUnavailable/NB_Unavailable.svg'
        else
          if @config.provinces.includes 'NB' then 'IMG/provinces/colour/NB_Selected.svg' else 'IMG/provinces/colour/NB_Unselected.svg'
    NS:
      key: 'NS'
      present: if @config.provinces.includes 'NS' then true else false
      colour: '#F69797'
      img:
        if @zeroedOut 'NS'
          'IMG/provinces/DataUnavailable/NS_Unavailable.svg'
        else
          if @config.provinces.includes 'NS' then 'IMG/provinces/colour/NS_Selected.svg' else 'IMG/provinces/colour/NS_Unselected.svg'
    NL:
      key: 'NL'
      present: if @config.provinces.includes 'NL' then true else false
      colour: '#9ED089'
      img:
        if @zeroedOut 'NL'
          'IMG/provinces/DataUnavailable/NL_Unavailable.svg'
        else
          if @config.provinces.includes 'NL' then 'IMG/provinces/colour/NL_Selected.svg' else 'IMG/provinces/colour/NL_Unselected.svg'
    PE:
      key: 'PE'
      present: if @config.provinces.includes 'PE' then true else false
      colour: '#8D574C'
      img:
        if @zeroedOut 'PE'
          'IMG/provinces/DataUnavailable/PEI_Unavailable.svg'
        else
          if @config.provinces.includes 'PE' then 'IMG/provinces/colour/PEI_Selected.svg' else 'IMG/provinces/colour/PEI_Unselected.svg'
    YT:
      key: 'YT'
      present: if @config.provinces.includes 'YT' then true else false
      colour: '#F5B6D1'
      img:
        if @zeroedOut 'YT'
          'IMG/provinces/DataUnavailable/Yukon_Unavailable.svg'
        else
          if @config.provinces.includes 'YT' then 'IMG/provinces/colour/Yukon_Selected.svg' else 'IMG/provinces/colour/Yukon_Unselected.svg'
    NT:
      key: 'NT'
      present: if @config.provinces.includes 'NT' then true else false
      colour: '#D62A28'
      img:
        if @zeroedOut 'NT'
          'IMG/provinces/DataUnavailable/NT_Unavailable.svg'
        else
          if @config.provinces.includes 'NT' then 'IMG/provinces/colour/NT_Selected.svg' else 'IMG/provinces/colour/NT_Unselected.svg'
    NU:
      key: 'NU'
      present: if @config.provinces.includes 'NU' then true else false
      colour: '#9268ac'
      img:
        if @zeroedOut 'NU'
          'IMG/provinces/DataUnavailable/NU_Unavailable.svg'
        else
          if @config.provinces.includes 'NU' then 'IMG/provinces/colour/NU_Selected.svg' else 'IMG/provinces/colour/NU_Unselected.svg'


  provinceBlackIcons: ->
    AB:
      img: 'IMG/provinces/radio/AB_SelectedR.svg'
    BC:
      img: 'IMG/provinces/radio/BC_SelectedR.svg'
    MB:
      img: 'IMG/provinces/radio/MB_SelectedR.svg'
    NB:
      img: 'IMG/provinces/radio/NB_SelectedR.svg'
    NL:
      img: 'IMG/provinces/radio/NL_SelectedR.svg'
    NS:
      img: 'IMG/provinces/radio/NS_SelectedR.svg'
    NT:
      img: 'IMG/provinces/radio/NT_SelectedR.svg'
    NU:
      img: 'IMG/provinces/radio/NU_SelectedR.svg'
    ON:
      img: 'IMG/provinces/radio/ON_SelectedR.svg'
    PE:
      img: 'IMG/provinces/radio/PEI_SelectedR.svg'
    QC:
      img:'IMG/provinces/radio/QC_SelectedR.svg'
    SK:
      img: 'IMG/provinces/radio/Sask_SelectedR.svg'
    YT:
      img: 'IMG/provinces/radio/Yukon_SelectedR.svg'
  


  provinceLegendData: ->
    baseData =
      BC:
        present: @config.provinces.includes('BC') and not @zeroedOut 'BC'
        img: 'IMG/provinces/colour/BC_Selected.svg'
      AB:
        present: @config.provinces.includes('AB') and not @zeroedOut 'AB'
        img: 'IMG/provinces/colour/AB_Selected.svg'
      SK:
        present: @config.provinces.includes('SK') and not @zeroedOut 'SK'
        img: 'IMG/provinces/colour/Sask_Selected.svg'
      MB:
        present: @config.provinces.includes('MB') and not @zeroedOut 'MB'
        img: 'IMG/provinces/colour/MB_Selected.svg'
      ON:
        present: @config.provinces.includes('ON') and not @zeroedOut 'ON'
        img: 'IMG/provinces/colour/ON_Selected.svg'
      QC:
        present: @config.provinces.includes('QC') and not @zeroedOut 'QC'
        img: 'IMG/provinces/colour/QC_Selected.svg'
      NB:
        present: @config.provinces.includes('NB') and not @zeroedOut 'NB'
        img: 'IMG/provinces/colour/NB_Selected.svg'
      NS:
        present: @config.provinces.includes('NS') and not @zeroedOut 'NS'
        img: 'IMG/provinces/colour/NS_Selected.svg'
      NL:
        present: @config.provinces.includes('NL') and not @zeroedOut 'NL'
        img: 'IMG/provinces/colour/NL_Selected.svg'
      PE:
        present: @config.provinces.includes('PE') and not @zeroedOut 'PE'
        img: 'IMG/provinces/colour/PEI_Selected.svg'
      YT:
        present: @config.provinces.includes('YT') and not @zeroedOut 'YT'
        img: 'IMG/provinces/colour/Yukon_Selected.svg'
      NT:
        present: @config.provinces.includes('NT') and not @zeroedOut 'NT'
        img: 'IMG/provinces/colour/NT_Selected.svg'
      NU:
        present: @config.provinces.includes('NU') and not @zeroedOut 'NU'
        img: 'IMG/provinces/colour/NU_Selected.svg'
    
    data = []
    for province in @config.provincesInOrder
      data.push baseData[province] if baseData[province].present

    # Legend content is reversed because graph elements are built bottom to top,
    # but html elements will be laid out top to bottom.
    data.reverse()
    data





module.exports = Visualization3