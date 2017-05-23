d3 = require 'd3'
_ = require 'lodash'

BarChart = require './bar-chart.coffee'
Constants = require '../Constants.coffee'

class StackedBarChart extends BarChart
  stackedChartDefaults:
    menuOptions: {}


  constructor: (@app, parent, x, y, options = {}) ->

    @options = _.extend {}, @stackedChartDefaults, options
    @_stackData = []
    @_stackDictionary = {}

    # Maybe this is required?
    @_mapping = if @options.mapping then @options.mapping else null

    super parent, x, y, @options
    @options.menuOptions.chart = this
    @redraw()

    @tooltip = @app.window.document.getElementById 'tooltip'
    @tooltipParent = @app.window.document.getElementById 'wideVisualizationPanel'


  mapping: (mapping) ->
    if !arguments.length
      return @_mapping
    @_mapping = mapping
    @generateStackData()

  # The data after the stack layout is applied: useful for generating new axis
  stackData: ->
    return @_stackData

  # We use an object for the data in this case
  data: (data) ->
    if !arguments.length
      return @_data
    @_data = data
    @generateStackData()

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
    @_stackData = stack _stackData
    for province in _stackData
      @_stackDictionary[province.name] = province
    @redraw()

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
          @tooltip.style.left = "#{coords[0] + 30}px"
          @tooltip.style.top = "#{coords[1]}px"
          @tooltip.innerHTML = "#{d.name} (#{d.data.x}): #{d.data.y.toFixed(2)}"

        .on 'mousemove', (d) =>
          coords = d3.mouse @tooltipParent # [x, y]
          @tooltip.style.left = "#{coords[0] + 30}px"
          @tooltip.style.top = "#{coords[1]}px"
          @tooltip.innerHTML = "#{d.name} (#{d.data.x}): #{d.data.y.toFixed(2)}"
        .on 'mouseout', =>
          @tooltip.style.visibility = 'hidden'

      rect.enter().append 'rect'
        .attr
          y: @_size.h
          height: 0
          class: 'bar'
          'fill-opacity': (d, i) =>
            if d.data.x > 2014
              1 - i / (@_x.domain().length + 5)


      rect.attr
        x: (d) =>
          @_x d.data.x
        width: @_barSize
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