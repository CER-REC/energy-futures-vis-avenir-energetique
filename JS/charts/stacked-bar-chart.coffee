d3 = require 'd3'
_ = require 'lodash'

BarChart = require './bar-chart.coffee'
Constants = require '../Constants.coffee'
Tr = require '../TranslationTable.coffee'

class StackedBarChart extends BarChart
  stackedChartDefaults:
    # coffeelint: disable=no_empty_functions
    barClass: ->
    onAccessibleFocus: ->
    chartElementClick: ->
    # coffeelint: enable=no_empty_functions

  constructor: (@app, parent, x, y, options = {}) ->

    @options = _.extend {}, @stackedChartDefaults, options
    @_stackDictionary = {}

    # Maybe this is required?
    @_mapping = if @options.mapping then @options.mapping else null

    super parent, x, y, @options
    @redraw()

    @tooltip = @app.window.document.getElementById 'tooltip'
    @tooltipParent = @app.window.document.getElementById 'wideVisualizationPanel'


  mapping: (mapping) ->
    if !arguments.length
      return @_mapping
    @_mapping = mapping
    @generateStackData()

  # We use an object for the data in this case
  data: (data) ->
    if !arguments.length
      return @_data
    @_data = data
    @generateStackData()

  forecastFromYear: (year) ->
    @options.forecastFromYear = year

  # When dragging we want a shorter duration
  dragStart: =>
    @_duration = 500

  dragEnd: =>
    @_duration = @options.duration

  generateStackData: ->
    _stackData = []
    @_stackDictionary = {}
    stack = d3.layout.stack()
      .values (d) -> d.values
    if @_mapping? and @_data != {}
      for province in @_mapping
        provinceData =
          name: province.key
          values:
            if @_data[province.key]?
              @_data[province.key].map (d) ->
                x: d.year
                y: if province.present then d.value else 0
            else
              emptyVals = []
              for year in [Constants.minYear..Constants.maxYear]
                emptyVals.push {x: year, y:0}
              emptyVals
        _stackData.push provinceData
    stack _stackData
    for province in _stackData
      @_stackDictionary[province.name] = province
    @redraw()


  tooltipString: (d, unit) ->
    formatter = d3.formatPrefix d.data.y
    value = formatter.scale(d.data.y).toFixed 2
    unitString = Tr.unitSelector["#{unit}Button"][@app.language]

    "#{d.name} (#{d.data.x}): #{value} #{formatter.symbol} #{unitString}"



  redraw: ->
    if @_y != undefined and @_x != undefined
      layer = @_group.selectAll '.layer'
        .data @_mapping, (d) -> d.key
      layer.enter().append 'g'
        .attr 'class', 'layer'
        .style 'fill', (d) =>
          if @_mapping then d.colour else '#333333'
      rect = layer.selectAll '.bar'
        .data (d) =>
          @_stackDictionary[d.key].values.map (yearData) ->
            name: d.key
            data: yearData
        .on 'mouseover', (d) =>
          coords = d3.mouse @tooltipParent # [x, y]
          @tooltip.style.visibility = 'visible'
          @tooltip.style.left = "#{coords[0] + Constants.tooltipXOffset}px"
          @tooltip.style.top = "#{coords[1]}px"
          @tooltip.innerHTML = @tooltipString d, @config.unit, @app

        .on 'mousemove', (d) =>
          coords = d3.mouse @tooltipParent # [x, y]
          @tooltip.style.left = "#{coords[0] + Constants.tooltipXOffset}px"
          @tooltip.style.top = "#{coords[1]}px"
          @tooltip.innerHTML = @tooltipString d, @config.unit, @app
        .on 'mouseout', =>
          @tooltip.style.visibility = 'hidden'

        .on 'accessibleFocus', (d) =>
          # First, find the position in absolute page coordinates where the tooltip should
          # go
          graphElementBounds = d3.event.target.getBoundingClientRect()
          xDest = graphElementBounds.right + window.scrollX + Constants.tooltipXOffset
          yDest = graphElementBounds.top + window.scrollY + graphElementBounds.height / 2

          # Second, calculate the offset for the tooltip element based on its parent
          parentBounds = @tooltipParent.getBoundingClientRect()
          xParentOffset = parentBounds.left + window.scrollX
          yParentOffset = parentBounds.top + window.scrollY

          # Third, place the tooltip
          @tooltip.style.visibility = 'visible'
          @tooltip.style.left = "#{xDest - xParentOffset}px"
          @tooltip.style.top = "#{yDest - yParentOffset}px"
          @tooltip.innerHTML = @tooltipString d, @config.unit, @app

          @options.onAccessibleFocus d

        .on 'click', @options.chartElementClick

      rect.enter().append 'rect'
        .attr
          y: @_size.h
          height: 0
          class: 'bar'
          id: (d) ->
            "barElement-#{d.data.x}-#{d.name}"

      rect.attr
        x: (d) =>
          @_x d.data.x
        width: @_barSize
        class: (d) =>
          "bar pointerCursor #{@options.barClass d}"
        'fill-opacity': (d, i) =>
          if d.data.x >= @options.forecastFromYear
            1 - i / (@_x.domain().length + 5)
          else
            1
      rect.exit().remove()
      rect.transition()
        .duration =>
          if @_duration then @_duration else 0
        .attr
          y: (d) =>
            @_y(d.data.y + d.data.y0)
          height: (d) =>
            @_y(d.data.y0) - @_y(d.data.y0 + d.data.y)

        .ease 'linear'
    this

module.exports = StackedBarChart