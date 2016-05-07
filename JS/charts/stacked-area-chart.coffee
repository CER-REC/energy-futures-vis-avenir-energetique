stackedBarChart = require './stacked-bar-chart.coffee'

class stackedAreaChart extends stackedBarChart
  stackedAreaDefaults:
    strokeWidth: 1

  constructor:(parent, x, y, options = {}) ->
    @options = _.extend {}, @stackedAreaDefaults, options
    @_strokeWidth = @options.strokeWidth
    super(parent, x, y, @options)
    @redraw()

  # When dragging we want a shorter duration
  dragStart: ->
    @_duration = 500

  dragEnd: ->
    @_duration = @options.duration

  redraw: ->
    if (@_y != undefined) and (@_x != undefined)
      grads = @_parent.select("defs").selectAll(".vizPresentLinearGradient")
          .data(@_mapping, (d) -> d.key)
      gradsFuture = @_parent.select("defs").selectAll(".vizFutureLinearGradient")
          .data(@_mapping, (d) -> d.key)
      enterPresentGrads = grads.enter().append("linearGradient")
          .attr
            class: 'vizPresentLinearGradient'
            gradientUnits: "objectBoundingBox"
            cx: 0
            cy: 0
            r: "100%"
            id: (d) -> "viz2gradPresent" + d.key

      enterPresentGrads.append("stop")
          .attr
            offset: "0"
          .style
            "stop-color": (d) -> d.colour
            "stop-opacity": "0.6"

      enterPresentGrads.append('stop')
          .attr
            offset: (d) => "#{@_x(2011) / @_x(2014)}"
          .style
            "stop-color": (d) -> d.colour
            "stop-opacity": 0.6 * 0.9

      enterPresentGrads.append("stop")
          .attr
            offset: "100%"
          .style
            "stop-color": (d) -> d.colour
            "stop-opacity": 0.6 * 0.7

      enterFutureGrads = gradsFuture.enter().append("linearGradient")
          .attr
            class: 'vizFutureLinearGradient'
            gradientUnits: "objectBoundingBox"
            cx: 0
            cy: 0
            r: "100%"
            id: (d) -> "viz2gradFuture" + d.key

      enterFutureGrads.append("stop")
          .attr
            offset: "0%"
          .style
            "stop-color": (d) -> d.colour
            "stop-opacity": 0.6 * 0.7

      enterFutureGrads.append("stop")
          .attr
            offset: "100%"
          .style
            "stop-color": (d) -> d.colour
            "stop-opacity": 0.6 * 0.2

      grads.exit().remove()
      area = d3.svg.area()
        .x((d)  => @_x(d.x) )
        .y0((d) => @_y(d.y0))
        .y1((d) => @_y(d.y0 + d.y) )
        .defined((d) -> d.x <= 2014)

      areaFuture = d3.svg.area()
        .x((d)  => @_x(d.x) )
        .y0((d) => @_y(d.y0))
        .y1((d) => @_y(d.y0 + d.y) )
        .defined((d) -> d.x >= 2014)

      line = d3.svg.line()
        .x((d)  => @_x(d.x) )
        .y((d) => @_y(d.y0 + d.y) )
        .defined((d) -> d.x <= 2014)

      futureLineFunction = d3.svg.line()
        .x((d)  => @_x(d.x) )
        .y((d) => @_y(d.y0 + d.y) )
        .defined((d) -> d.x >= 2014)

      presentArea = @_group.selectAll(".presentArea")
          .data(@_mapping, (d) -> d.key)
      presentArea.enter().append("path")
        .attr
          class: 'presentArea'
          d: (d) =>
            area(@_stackDictionary[d.key].values.map((data) -> {x: data.x, y:0, y0:0}))
        .style  
          fill: (d) -> colour = d3.rgb(d.colour); "url(#viz2gradPresent#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.6)"
      presentArea.exit().remove()

      futureArea = @_group.selectAll(".futureArea")
          .data(@_mapping, (d) -> d.key)
      futureArea.enter().append("path")
        .attr
          class: 'futureArea'
          d: (d) =>
            areaFuture(@_stackDictionary[d.key].values.map((data) -> {x: data.x, y:0, y0:0}))
        .style  
          fill: (d) -> colour = d3.rgb(d.colour); "url(#viz2gradFuture#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.4)"
      futureArea.exit().remove()

      presentLine = @_group.selectAll(".presentLine")
          .data(@_mapping, (d) -> d.key)
      presentLine.enter().append("path")
        .attr(
          class: 'presentLine'
          d: (d, i, j) =>
            line(@_stackDictionary[d.key].values.map((data) -> {x: data.x, y:0, y0:0}))
          )
        .style(
          stroke: (d, i) =>
            if @_mapping then d.colour else "#333333"
          'stroke-width': @_strokeWidth
          fill: 'none'
        )
      
      futureLine = @_group.selectAll(".futureLine")
          .data(@_mapping, (d) -> d.key)
      futureLine.enter().append("path")
        .attr(
          class: 'futureLine'
          d: (d, i, j) =>
            futureLineFunction(@_stackDictionary[d.key].values.map((data) -> {x: data.x, y:0, y0:0}))
          )
        .style(
          stroke: (d, i) =>
            if @_mapping then d.colour else "#333333"
          'stroke-width': @_strokeWidth
          'stroke-opacity': 0.4
          fill: 'none'
        )
      presentArea.transition()
        .duration( =>
          if @_duration then @_duration else 0)
        .attr(
          d: (d, i) =>
            area(@_stackDictionary[d.key].values.map((d) -> {x: d.x, y:d.y, y0:d.y0}))
          )
      futureArea.transition()
        .duration( =>
          if @_duration then @_duration else 0)
        .attr(
          d: (d, i) =>
            areaFuture(@_stackDictionary[d.key].values.map((d) -> {x: d.x, y:d.y, y0:d.y0}))
          )

      presentLine.transition()
        .duration( =>
          if @_duration then @_duration else 0)
        .attr(
          d: (d, i) =>
            line(@_stackDictionary[d.key].values.map((d) -> {x: d.x, y:d.y, y0:d.y0}))
          )
      futureLine.transition()
        .duration( =>
          if @_duration then @_duration else 0)
        .attr(
          d: (d, i) =>
            futureLineFunction(@_stackDictionary[d.key].values.map((d) -> {x: d.x, y:d.y, y0:d.y0}))
          )
    this

module.exports = stackedAreaChart