d3 = require 'd3'
Mustache = require 'mustache'

visualization = require './visualization.coffee'
BubbleChart = require '../charts/bubble-chart.coffee'
Constants = require '../Constants.coffee'
SquareMenu = require '../charts/SquareMenu.coffee'
Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

ParamsToUrlString = require '../ParamsToUrlString.coffee'

if Platform.name == 'browser'
  Visualization3Template = require '../templates/Visualization3.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'


ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'

ProvinceAriaText = require '../ProvinceAriaText.coffee'
SourceAriaText = require '../SourceAriaText.coffee'


class Visualization3 extends visualization
  height = 700

  renderBrowserTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
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


    @datasetHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'datasetSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover datasetSelectorHelp'
      innerClasses: 'viz3HelpTitle'
      title: Tr.datasetSelector.datasetSelectorHelpTitle[@app.language]
      content: => Tr.datasetSelector.datasetSelectorHelp[@app.language]
      attachmentSelector: '.datasetSelectorGroup'
      analyticsEvent: 'Viz3 dataset help'

    @viewByHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'viewBySelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover viewBySelectorHelp'
      innerClasses: 'viz3HelpTitle'
      title: Tr.viewBySelector.viewBySelectorHelpTitle[@app.language]
      content: => Tr.viewBySelector.viewBySelectorHelp[@app.language]
      attachmentSelector: '.viewBySelectorGroup'
      analyticsEvent: 'Viz3 view by help'

    @unitsHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'unitSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover unitSelectorHelp'
      innerClasses: 'viz3HelpTitle'
      title: Tr.unitSelector.unitSelectorHelpTitle[@app.language]
      content: => Tr.unitSelector.unitSelectorHelp[@app.language]
      attachmentSelector: '.unitsSelectorGroup'
      analyticsEvent: 'Viz3 unit help'

    @scenariosHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'scenarioSelectorHelpButton'
      outerClasses: 'vizModal controlsHelpPopover scenarioSelectorHelp'
      innerClasses: 'viz3HelpTitle'
      title: Tr.scenarioSelector.scenarioSelectorHelpTitle[@app.language]
      content: => Tr.scenarioSelector.scenarioSelectorHelp[@app.language]
      attachmentSelector: '.scenarioSelectorGroup'
      analyticsEvent: 'Viz3 scenario help'

    @sourcesHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'sourceHelpButton'
      outerClasses: 'vizModal controlsHelpPopover popOverLg sourceSelectorHelp'
      title: Tr.sourceSelector.selectSourceLabel[@app.language]
      content: =>
        if @config.viewBy == 'province'
          images = @sourceColorIcons()
        else
          images = @sourceBlackIcons()
        contentString = ''
        for source in Constants.viz3Sources
          contentString = """
            <div class="#{if @config.viewBy == "source" then 'sourceLabel' else 'sourceLabel sourceLabel' + source}">
              <img class="sourceIcon" src="#{images[source].img}" alt="#{Tr.altText.sources[source][@app.language]}">
              <h2> #{Tr.sourceSelector.sources[source][@app.language]} </h2>
              <div class="clearfix"> </div>
              <p> #{Tr.sourceSelector.sourceSelectorHelp[source][@app.language]} </p>
            </div>
            """ + contentString
        contentString = Tr.sourceSelector.sourceSelectorHelp.generalHelp[@app.language] + contentString
        contentString
      attachmentSelector: '#powerSourceSelector'
      analyticsEvent: 'Viz3 source help'
      setupEvents: false

    @provincesHelpPopover = new ControlsHelpPopover @app,
      popoverButtonId: 'provinceHelpButton'
      outerClasses: 'vizModal controlsHelpPopover popOverSm provinceHelp'
      title: Tr.regionSelector.selectRegionLabel[@app.language]
      content: =>
        # Grab the provinces in order for the string
        contentString = ''
        for province in Constants.provinces
          contentString = """<div class="#{if @config.viewBy == 'province' then 'provinceLabel' else 'provinceLabel provinceLabel' + province}"> <h2> #{Tr.regionSelector.names[province][@app.language]} </h2> </div>""" + contentString
        contentString
      attachmentSelector: '#provincesSelector'
      analyticsEvent: 'Viz3 region help'
      setupEvents: false




  renderServerTemplate: ->
    if @config.viewBy == 'province'
      legendContent = @sourceLegendData()
    else if @config.viewBy == 'source'
      legendContent = @provinceLegendData()

    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render @options.template,
      svgStylesheet: @options.svgTemplate
      title: Tr.visualization3Title[@app.language]
      description: @config.imageExportDescription()
      energyFuturesSource: Tr.allPages.imageDownloadSource[@app.language]
      bitlyLink: @app.bitlyLink
      legendContent: legendContent



  constructor: (@app, config, @options) ->
    @config = config
    @_chart = null
    @_provinceMenu = null
    @document = @app.window.document
    @d3document = d3.select @document


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
    @svgResize()
    @addDatasetToggle()
    @buildProvinceVsSourceToggle()
    @addUnitToggle()
    @addScenarios()
    @render()

  tearDown: ->
    if @yearTimeout then window.clearTimeout @yearTimeout
    # TODO: Consider garbage collection and event listeners
    @document.getElementById('visualizationContent').innerHTML = ''

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
      w: @d3document.select('#provinceMenuSVG').node().getBoundingClientRect().width
      h: @leftHandMenuHeight()
    @provinceMenu.update()

    @sourceMenu.size
      w: @d3document.select('#powerSourceMenuSVG').node().getBoundingClientRect().width
      h: @leftHandMenuHeight()
    @sourceMenu.update()



  svgResize: ->
    @d3document.select '#graphSVG'
      .attr
        width: @getSvgWidth()
        height: height
    @d3document.select '#provinceMenuSVG'
      .attr
        width: @d3document.select('#provincePanel').node().getBoundingClientRect().width
        height: height - @_margin.top
    @d3document.select '#powerSourceMenuSVG'
      .attr
        width: @d3document.select('#powerSourcePanel').node().getBoundingClientRect().width
        height: height - @_margin.top - @_margin.bottom


  getDataAndRender: ->
    @getData()
    @render()

  getData: ->
    @seriesData = @addLabelsToData @app.providers[@config.dataset].electricityProductionProvider.dataForViz3 @config

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
    @d3document.select '#dataDownloadLink'
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
    @provinceMenu.update()
    @sourceMenu.data @dataForSourceMenu()
    @sourceMenu.update()

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
      viewBySelectors = @d3document.select('#viewBySelector')
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

      viewBySelectors.html (d) -> """
        <button class='#{d.class}'
                type='button'
                title='#{d.title}'
                aria-label='#{d.ariaLabel}'>
          #{d.label}
        </button>
      """
      viewBySelectors.exit().remove()
  

  buildYearAxis: ->
    axis = @d3document.select '#timelineAxis'
      .attr
        fill: '#333'
        transform: "translate( 0, #{@height() + @_margin.top + Constants.sliderLabelHeight})"
      .call @yearAxis()
      
    # We need a wider target for the click so we use a separate group
    @d3document.select '#timeLineTouch'
      .attr
        class: 'pointerCursor'
        'pointer-events': 'visible'
        transform:
          "translate(0, #{@height() + @_margin.top + Constants.sliderLabelHeight - (axis.node().getBoundingClientRect().height / 2)})"
        height: axis.node().getBoundingClientRect().height
        width: axis.node().getBoundingClientRect().width
      .style
        fill: 'none'
      .on 'click', =>
        element = @d3document.select('#timelineAxis').node()
        newX = d3.mouse(element)[0]
        if newX < Constants.timelineMargin then newX = Constants.timelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        year = Math.round @yearScale().invert(newX)

        return if year == @config.year
        @updateSlider year
      
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
    @d3document.select('.sliderLabel').remove()
    year = @config.year

    #Drag Behaviour
    drag = d3.behavior.drag()

    drag.on 'dragstart', =>
      year = @config.year

    drag.on 'drag', =>
      newX = d3.event.x
      @d3document.select('#sliderLabel').attr 'transform', =>
        if newX < Constants.timelineMargin then newX = Constants.timelineMargin
        if newX > @timelineRightEnd() then newX = @timelineRightEnd()
        "translate(#{newX}, #{@height() + @_margin.top - 5})"

      year = Math.round @yearScale().invert newX
      if year != @config.year
        @config.setYear year
        @app.router.navigate @config.routerParams()
        @d3document.select('#labelBox').text =>
          @config.year
        @d3document.select '#sliderLabel'
          .attr
            'aria-valuenow': @config.year

        @getDataAndRender()

    drag.on 'dragend', =>
      if year != @config.year
        newX = @yearScale()(year)
        @d3document.select('#sliderLabel').attr
          transform: "translate(#{newX}, #{@height() + @_margin.top - 5})"

        @d3document.select('#labelBox').selectAll('text').text =>
          @config.year
        @d3document.select '#sliderLabel'
          .attr
            'aria-valuenow': @config.year
        @config.setYear year
        @app.router.navigate @config.routerParams()
        @getDataAndRender()

    sliderWidth = 70

    sliderLabel = @d3document.select('#graphSVG')
      .append 'g'
      .attr
        id: 'sliderLabel'
        class: 'sliderLabel pointerCursor'
        # Re the 5. It is because the ticks are moved
        transform: "translate(#{@yearScale()(@config.year)},#{@height() + @_margin.top - 5})"
        tabindex: '0'
        role: 'slider'
        'aria-label': Tr.altText.yearsSlider[@app.language]
        'aria-orientation': 'horizontal'
        'aria-valuemin': Constants.minYear
        'aria-valuemax': Constants.minYear
        'aria-valuenow': @config.year
      .on 'keydown', @handleSliderKeydown
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


  sliderPlayButtonCallback: =>
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
      return unless @_chart?

      if @config.year < Constants.maxYear

        newConfig = new @config.constructor @app
        newConfig.copy @config
        newConfig.setYear @config.year + 1

        update = =>
          @config.setYear @config.year + 1
          @yearTimeout = window.setTimeout timeoutComplete, @_chart._duration
          @getDataAndRender()
          @d3document.select '#sliderLabel'
            .transition()
              .attr
                transform: "translate(#{@yearScale()(@config.year)}, #{@height() + @_margin.top  - 5})"
            .duration @_chart._duration
            .ease 'linear'
          @d3document.select '#labelBox'
            .text @config.year
          @d3document.select '#sliderLabel'
            .attr
              'aria-valuenow': @config.year
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

    @yearTimeout = window.setTimeout timeoutComplete, 0
    @app.analyticsReporter.reportEvent 'Electricity Play/Pause', 'Play'



  sliderPauseButtonCallback: =>
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


  # I'm adding them to the left hand side for simplicity, we can move them later
  buildSliderButtons: ->
    @d3document.select('#powerSourcePanel .mediaButtons').remove()
    div = @d3document.select '#powerSourcePanel'
      .append 'div'
        .attr
          class: 'mediaButtons'
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
      




  buildTimeline: ->
    @buildYearAxis()
    @buildSliderLabel()
    @buildSliderButtons()





  buildProvinceMenu: ->
    options =
      parentId: 'provinceMenuSVG'
      canDrag: false
      boxSize: 37.5
      groupId: 'provinceMenuGroup'
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
      showHelpHandler: @provincesHelpPopover.showPopoverCallback
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
      getAllLabel: =>
        switch @config.viewBy
          when 'province'
            if @config.province == 'all'
              Tr.altText.allButton.allCanadaSelected[@app.language]
            else
              Tr.altText.allButton.allCanadaUnselected[@app.language]

          when 'source'
            if @config.provinces.length == Constants.provinces.length
              Tr.altText.allButton.allRegionsSelected[@app.language]
            else if @config.provinces.length > 0
              Tr.altText.allButton.someRegionsSelected[@app.language]
            else if @config.provinces.length == 0
              Tr.altText.allButton.noRegionsSelected[@app.language]
      helpButtonLabel: Tr.altText.regionsHelp[@app.language]
      helpButtonId: 'provinceHelpButton'

    state =
      iconSpacing: 'auto'
      size:
        w: @d3document.select('#provinceMenuSVG').node().getBoundingClientRect().width
        h: @leftHandMenuHeight()
      data: @dataForProvinceMenu()

    @provinceMenu = new SquareMenu @app, options, state

  buildSourceMenu: ->
    options =
      parentId: 'powerSourceMenuSVG'
      canDrag: false
      boxSize: 37.5
      groupId: 'sourceMenuGroup'
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
      showHelpHandler: @sourcesHelpPopover.showPopoverCallback
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
      getAllLabel: =>
        switch @config.viewBy
          when 'source'
            if @config.province == 'all'
              Tr.altText.allButton.allSourcesSelected[@app.language]
            else
              Tr.altText.allButton.noSourcesSelected[@app.language]

          when 'province'
            if @config.sources.length == Constants.viz3Sources.length
              Tr.altText.allButton.allSourcesSelected[@app.language]
            else if @config.sources.length > 0
              Tr.altText.allButton.someSourcesSelected[@app.language]
            else if @config.sources.length == 0
              Tr.altText.allButton.noSourcesSelected[@app.language]

      helpButtonLabel: Tr.altText.sourcesHelp[@app.language]
      helpButtonId: 'sourceHelpButton'


    state =
      iconSpacing: @provinceMenu.getIconSpacing()
      size:
        w: @d3document.select('#powerSourceMenuSVG').node().getBoundingClientRect().width
        h: @leftHandMenuHeight()
      data: @dataForSourceMenu()

    @sourceMenu = new SquareMenu @app, options, state









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


  handleSliderKeydown: =>
    switch d3.event.key
      when 'ArrowRight', 'ArrowUp'
        @updateSlider @config.year + 1
      when 'ArrowLeft', 'ArrowDown'
        @updateSlider @config.year - 1
      when 'End'
        @updateSlider Constants.maxYear
      when 'Home'
        @updateSlider Constants.minYear

  updateSlider: (value) ->
    # Prevent arrow keys and home/end from scrolling the page while using the slider
    d3.event.preventDefault()

    newConfig = new @config.constructor @app
    newConfig.copy @config
    newConfig.setYear value

    update = =>
      @config.setYear value
      @d3document.select('#sliderLabel').attr
        transform: "translate(#{@yearScale()(@config.year)}, #{@height() + @_margin.top - 5})"
      
      @d3document.select '#labelBox'
        .text @config.year
      @d3document.select '#sliderLabel'
        .attr
          'aria-valuenow': @config.year

      @getDataAndRender()
      @app.router.navigate @config.routerParams()

    @app.datasetRequester.updateAndRequestIfRequired newConfig, update







  ### Helper functions ###

  # the graph's height
  height: ->
    height - @_margin.top - @_margin.bottom

  # We want this menu to line up with the bottom of the x axis TICKS so those must be
  # built before we can set this.
  leftHandMenuHeight: ->
    @height() + @d3document
      .select('#timelineAxis')
      .node()
      .getBoundingClientRect()
      .height

  # the graph's width
  width: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      @d3document
        .select('#graphPanel')
        .node()
        .getBoundingClientRect()
        .width - @_margin.left - @_margin.right
    else if Platform.name == 'server'
      Constants.serverSideGraphWidth - @_margin.left - @_margin.right


  timelineRightEnd: ->
    @getSvgWidth() - Constants.timelineMargin

  getSvgWidth: ->
    # getBoundingClientRect is not implemented in JSDOM, use fixed width on server
    if Platform.name == 'browser'
      svgWidth = @d3document
        .select('#graphPanel')
        .node()
        .getBoundingClientRect()
        .width
    else if Platform.name == 'server'
      svgWidth = Constants.serverSideGraphWidth

    svgWidth


  # The 'correct' scale used by the graph
  yearScale: ->
    d3.scale.linear()
      .domain [Constants.minYear, Constants.maxYear]
      .range [
        Constants.timelineMargin
        @timelineRightEnd()
      ]

  yearAxis: ->
    d3.svg.axis()
      .scale(@yearScale())
      .tickSize(10,2)
      .ticks(7)
      .tickFormat (d) ->
        if d == Constants.minYear or d == Constants.maxYear then d else ''
      .orient 'bottom'





  ### Data dictionaries for D3 data join driven components ###

  # Used for chart bubble colours
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
        ariaLabel:
          if @config.viewBy == 'province'
            Tr.altText.viewBy.regionSelected[@app.language]
          else
            Tr.altText.viewBy.regionUnselected[@app.language]
      }
      {
        title: Tr.selectorTooltip.viewBySelector.viewBySourceButton[@app.language]
        label: Tr.viewBySelector.viewBySourceButton[@app.language]
        viewByName: 'source'
        class: if @config.viewBy == 'source' then 'vizButton selected' else 'vizButton'
        ariaLabel:
          if @config.viewBy == 'source'
            Tr.altText.viewBy.sourceSelected[@app.language]
          else
            Tr.altText.viewBy.sourceUnselected[@app.language]
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
      tooltip: SourceAriaText @app, @config.sources.includes('hydro'), 'hydro'
      img:
        if @zeroedOut 'hydro'
          'IMG/sources/unavailable/hydro_unavailable.svg'
        else if @config.sources.includes 'hydro'
          'IMG/sources/hydro_selected.svg'
        else
          'IMG/sources/hydro_unselected.svg'
      present: @config.sources.includes 'hydro'
      colour: '#4167b1'
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
    nuclear:
      key: 'nuclear'
      tooltip: SourceAriaText @app, @config.sources.includes('nuclear'), 'nuclear'
      img:
        if @zeroedOut 'nuclear'
          'IMG/sources/unavailable/nuclear_unavailable.svg'
        else if @config.sources.includes 'nuclear'
          'IMG/sources/nuclear_selected.svg'
        else
          'IMG/sources/nuclear_unselected.svg'
      present: @config.sources.includes 'nuclear'
      colour: '#cccb31'
      

      


  sourceBlackMenuDictionary: ->
    hydro:
      key: 'hydro'
      tooltip: SourceAriaText @app, @config.source == 'hydro', 'hydro'
      img:
        if @config.source == 'hydro'
          'IMG/sources/hydro_selectedR.svg'
        else
          'IMG/sources/hydro_unselectedR.svg'
      colour: '#4167b1'
    solarWindGeothermal:
      key: 'solarWindGeothermal'
      tooltip: SourceAriaText @app, @config.source == 'solarWindGeothermal', 'solarWindGeothermal'
      img:
        if @config.source == 'solarWindGeothermal'
          'IMG/sources/solarWindGeo_selectedR.svg'
        else
          'IMG/sources/solarWindGeo_unselectedR.svg'
      colour: '#339947'
    coal:
      key: 'coal'
      tooltip: SourceAriaText @app, @config.source == 'coal', 'coal'
      img:
        if @config.source == 'coal'
          'IMG/sources/coal_selectedR.svg'
        else
          'IMG/sources/coal_unselectedR.svg'
      colour: '#996733'
    naturalGas:
      key: 'naturalGas'
      tooltip: SourceAriaText @app, @config.source == 'naturalGas', 'naturalGas'
      img:
        if @config.source == 'naturalGas'
          'IMG/sources/naturalGas_selectedR.svg'
        else
          'IMG/sources/naturalGas_unselectedR.svg'
      colour: '#f16739'
    bio:
      key: 'bio'
      tooltip: SourceAriaText @app, @config.source == 'bio', 'bio'
      img:
        if @config.source == 'bio'
          'IMG/sources/biomass_selectedR.svg'
        else
          'IMG/sources/biomass_unselectedR.svg'
      colour: '#8d68ac'
    nuclear:
      key: 'nuclear'
      tooltip: SourceAriaText @app, @config.source == 'nuclear', 'nuclear'
      img:
        if @config.source == 'nuclear'
          'IMG/sources/nuclear_selectedR.svg'
        else
          'IMG/sources/nuclear_unselectedR.svg'
      colour: '#cccb31'
    oilProducts:
      key: 'oilProducts'
      tooltip: SourceAriaText @app, @config.source == 'oilProducts', 'oilProducts'
      img:
        if @config.source == 'oilProducts'
          'IMG/sources/oil_products_selectedR.svg'
        else
          'IMG/sources/oil_products_unselectedR.svg'
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
      tooltip: ProvinceAriaText @app, @config.province == 'AB', 'AB'
      colour: if @config.province == 'AB' then '#333' else '#fff'
      img:
        if @config.province == 'AB'
          'IMG/provinces/radio/AB_SelectedR.svg'
        else
          'IMG/provinces/radio/AB_UnselectedR.svg'
    BC:
      key: 'BC'
      tooltip: ProvinceAriaText @app, @config.province == 'BC', 'BC'
      colour: if @config.province == 'BC' then '#333' else '#fff'
      img:
        if @config.province == 'BC'
          'IMG/provinces/radio/BC_SelectedR.svg'
        else
          'IMG/provinces/radio/BC_UnselectedR.svg'
    MB:
      key: 'MB'
      tooltip: ProvinceAriaText @app, @config.province == 'MB', 'MB'
      colour: if @config.province == 'MB' then '#333' else '#fff'
      img:
        if @config.province == 'MB'
          'IMG/provinces/radio/MB_SelectedR.svg'
        else
          'IMG/provinces/radio/MB_UnselectedR.svg'
    NB:
      key: 'NB'
      tooltip: ProvinceAriaText @app, @config.province == 'NB', 'NB'
      colour: if @config.province == 'NB' then '#333' else '#fff'
      img:
        if @config.province == 'NB'
          'IMG/provinces/radio/NB_SelectedR.svg'
        else
          'IMG/provinces/radio/NB_UnselectedR.svg'
    NL:
      key : 'NL'
      tooltip: ProvinceAriaText @app, @config.province == 'NL', 'NL'
      colour: if @config.province == 'NL' then '#333' else '#fff'
      img:
        if @config.province == 'NL'
          'IMG/provinces/radio/NL_SelectedR.svg'
        else
          'IMG/provinces/radio/NL_UnselectedR.svg'
    NS:
      key: 'NS'
      tooltip: ProvinceAriaText @app, @config.province == 'NS', 'NS'
      colour: if @config.province == 'NS' then '#333' else '#fff'
      img:
        if @config.province == 'NS'
          'IMG/provinces/radio/NS_SelectedR.svg'
        else
          'IMG/provinces/radio/NS_UnselectedR.svg'
    NT:
      key: 'NT'
      tooltip: ProvinceAriaText @app, @config.province == 'NT', 'NT'
      colour: if @config.province == 'NT' then '#333' else '#fff'
      img:
        if @config.province == 'NT'
          'IMG/provinces/radio/NT_SelectedR.svg'
        else
          'IMG/provinces/radio/NT_UnselectedR.svg'
    NU:
      key: 'NU'
      tooltip: ProvinceAriaText @app, @config.province == 'NU', 'NU'
      colour: if @config.province == 'NU' then '#333' else '#fff'
      img:
        if @config.province == 'NU'
          'IMG/provinces/radio/NU_SelectedR.svg'
        else
          'IMG/provinces/radio/NU_UnselectedR.svg'
    ON:
      key: 'ON'
      tooltip: ProvinceAriaText @app, @config.province == 'ON', 'ON'
      colour: if @config.province == 'ON' then '#333' else '#fff'
      img:
        if @config.province == 'ON'
          'IMG/provinces/radio/ON_SelectedR.svg'
        else
          'IMG/provinces/radio/ON_UnselectedR.svg'
    PE:
      key: 'PE'
      tooltip: ProvinceAriaText @app, @config.province == 'PE', 'PE'
      colour: if @config.province == 'PE' then '#333' else '#fff'
      img:
        if @config.province == 'PE'
          'IMG/provinces/radio/PEI_SelectedR.svg'
        else
          'IMG/provinces/radio/PEI_UnselectedR.svg'
    QC:
      key: 'QC'
      tooltip: ProvinceAriaText @app, @config.province == 'QC', 'QC'
      colour: if @config.province == 'QC' then '#333' else '#fff'
      img:
        if @config.province == 'QC'
          'IMG/provinces/radio/QC_SelectedR.svg'
        else
          'IMG/provinces/radio/QC_UnselectedR.svg'
    SK:
      key: 'SK'
      tooltip: ProvinceAriaText @app, @config.province == 'SK', 'SK'
      colour: if @config.province == 'SK' then '#333' else '#fff'
      img:
        if @config.province == 'SK'
          'IMG/provinces/radio/Sask_SelectedR.svg'
        else
          'IMG/provinces/radio/Sask_UnselectedR.svg'
    YT:
      key: 'YT'
      tooltip: ProvinceAriaText @app, @config.province == 'YT', 'YT'
      colour: if @config.province == 'YT' then '#333' else '#fff'
      img:
        if @config.province == 'YT'
          'IMG/provinces/radio/Yukon_SelectedR.svg'
        else
          'IMG/provinces/radio/Yukon_UnselectedR.svg'



  provinceColorMenuDictionary: ->
    BC:
      key: 'BC'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('BC'), 'BC'
      present: @config.provinces.includes 'BC'
      colour: '#AEC7E8'
      img:
        if @zeroedOut 'BC'
          'IMG/provinces/DataUnavailable/BC_Unavailable.svg'
        else if @config.provinces.includes 'BC'
          'IMG/provinces/colour/BC_Selected.svg'
        else
          'IMG/provinces/colour/BC_Unselected.svg'
    AB:
      key: 'AB'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('AB'), 'AB'
      present: @config.provinces.includes 'AB'
      colour: '#2278b5'
      img:
        if @zeroedOut 'AB'
          'IMG/provinces/DataUnavailable/AB_Unavailable.svg'
        else if @config.provinces.includes 'AB'
          'IMG/provinces/colour/AB_Selected.svg'
        else
          'IMG/provinces/colour/AB_Unselected.svg'
    SK:
      key: 'SK'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('SK'), 'SK'
      present: @config.provinces.includes 'SK'
      colour: '#d77ab1'
      img:
        if @zeroedOut 'SK'
          'IMG/provinces/DataUnavailable/SK_Unavailable.svg'
        else if @config.provinces.includes 'SK'
          'IMG/provinces/colour/Sask_Selected.svg'
        else
          'IMG/provinces/colour/Sask_Unselected.svg'
    MB:
      key: 'MB'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('MB'), 'MB'
      present: @config.provinces.includes 'MB'
      colour: '#FCBB78'
      img:
        if @zeroedOut 'MB'
          'IMG/provinces/DataUnavailable/MB_Unavailable.svg'
        else if @config.provinces.includes 'MB'
          'IMG/provinces/colour/MB_Selected.svg'
        else
          'IMG/provinces/colour/MB_Unselected.svg'
    ON:
      key: 'ON'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('ON'), 'ON'
      present: @config.provinces.includes 'ON'
      colour: '#C5B1D6'
      img:
        if @zeroedOut 'ON'
          'IMG/provinces/DataUnavailable/ON_Unavailable.svg'
        else if @config.provinces.includes 'ON'
          'IMG/provinces/colour/ON_Selected.svg'
        else
          'IMG/provinces/colour/ON_Unselected.svg'
    QC:
      key: 'QC'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('QC'), 'QC'
      present: @config.provinces.includes 'QC'
      colour: '#c49c94'
      img:
        if @zeroedOut 'QC'
          'IMG/provinces/DataUnavailable/QC_Unavailable.svg'
        else if @config.provinces.includes 'QC'
          'IMG/provinces/colour/QC_Selected.svg'
        else
          'IMG/provinces/colour/QC_Unselected.svg'
    NB:
      key: 'NB'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('NB'), 'NB'
      present: @config.provinces.includes 'NB'
      colour: '#2FA148'
      img:
        if @zeroedOut 'NB'
          'IMG/provinces/DataUnavailable/NB_Unavailable.svg'
        else if @config.provinces.includes 'NB'
          'IMG/provinces/colour/NB_Selected.svg'
        else
          'IMG/provinces/colour/NB_Unselected.svg'
    NS:
      key: 'NS'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('NS'), 'NS'
      present: @config.provinces.includes 'NS'
      colour: '#F69797'
      img:
        if @zeroedOut 'NS'
          'IMG/provinces/DataUnavailable/NS_Unavailable.svg'
        else if @config.provinces.includes 'NS'
          'IMG/provinces/colour/NS_Selected.svg'
        else
          'IMG/provinces/colour/NS_Unselected.svg'
    NL:
      key: 'NL'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('NL'), 'NL'
      present: @config.provinces.includes 'NL'
      colour: '#9ED089'
      img:
        if @zeroedOut 'NL'
          'IMG/provinces/DataUnavailable/NL_Unavailable.svg'
        else if @config.provinces.includes 'NL'
          'IMG/provinces/colour/NL_Selected.svg'
        else
          'IMG/provinces/colour/NL_Unselected.svg'
    PE:
      key: 'PE'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('PE'), 'PE'
      present: @config.provinces.includes 'PE'
      colour: '#8D574C'
      img:
        if @zeroedOut 'PE'
          'IMG/provinces/DataUnavailable/PEI_Unavailable.svg'
        else if @config.provinces.includes 'PE'
          'IMG/provinces/colour/PEI_Selected.svg'
        else
          'IMG/provinces/colour/PEI_Unselected.svg'
    YT:
      key: 'YT'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('YT'), 'YT'
      present: @config.provinces.includes 'YT'
      colour: '#F5B6D1'
      img:
        if @zeroedOut 'YT'
          'IMG/provinces/DataUnavailable/Yukon_Unavailable.svg'
        else if @config.provinces.includes 'YT'
          'IMG/provinces/colour/Yukon_Selected.svg'
        else
          'IMG/provinces/colour/Yukon_Unselected.svg'
    NT:
      key: 'NT'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('NT'), 'NT'
      present: @config.provinces.includes 'NT'
      colour: '#D62A28'
      img:
        if @zeroedOut 'NT'
          'IMG/provinces/DataUnavailable/NT_Unavailable.svg'
        else if @config.provinces.includes 'NT'
          'IMG/provinces/colour/NT_Selected.svg'
        else
          'IMG/provinces/colour/NT_Unselected.svg'
    NU:
      key: 'NU'
      tooltip: ProvinceAriaText @app, @config.provinces.includes('NU'), 'NU'
      present: @config.provinces.includes 'NU'
      colour: '#9268ac'
      img:
        if @zeroedOut 'NU'
          'IMG/provinces/DataUnavailable/NU_Unavailable.svg'
        else if @config.provinces.includes 'NU'
          'IMG/provinces/colour/NU_Selected.svg'
        else
          'IMG/provinces/colour/NU_Unselected.svg'


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