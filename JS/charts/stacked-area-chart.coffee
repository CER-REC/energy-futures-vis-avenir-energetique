d3 = require 'd3'
_ = require 'lodash'
stackedBarChart = require './stacked-bar-chart.coffee'
Tr = require '../TranslationTable.coffee'

pixelMap = [{pixelStart:336, pixelEnd:357, year:2005}
            {pixelStart:358, pixelEnd:377, year:2006}
            {pixelStart:378, pixelEnd:398, year:2007}
            {pixelStart:399, pixelEnd:419, year:2008}
            {pixelStart:420, pixelEnd:440, year:2009}
            {pixelStart:441, pixelEnd:460, year:2010}
            {pixelStart:461, pixelEnd:480, year:2011}
            {pixelStart:481, pixelEnd:500, year:2012}
            {pixelStart:501, pixelEnd:523, year:2013}
            {pixelStart:524, pixelEnd:543, year:2014}
            {pixelStart:544, pixelEnd:564, year:2015}
            {pixelStart:565, pixelEnd:584, year:2016}
            {pixelStart:585, pixelEnd:604, year:2017}
            {pixelStart:605, pixelEnd:625, year:2018}
            {pixelStart:626, pixelEnd:647, year:2019}
            {pixelStart:648, pixelEnd:668, year:2020}
            {pixelStart:669, pixelEnd:688, year:2021}
            {pixelStart:689, pixelEnd:708, year:2022}
            {pixelStart:709, pixelEnd:729, year:2023}
            {pixelStart:730, pixelEnd:749, year:2024}
            {pixelStart:750, pixelEnd:771, year:2025}
            {pixelStart:772, pixelEnd:792, year:2026}
            {pixelStart:793, pixelEnd:812, year:2027}
            {pixelStart:813, pixelEnd:833, year:2028}
            {pixelStart:834, pixelEnd:853, year:2029}
            {pixelStart:854, pixelEnd:874, year:2030}
            {pixelStart:875, pixelEnd:895, year:2031}
            {pixelStart:896, pixelEnd:916, year:2032}
            {pixelStart:917, pixelEnd:936, year:2033}
            {pixelStart:937, pixelEnd:957, year:2034}
            {pixelStart:958, pixelEnd:978, year:2035}
            {pixelStart:979, pixelEnd:998, year:2036}
            {pixelStart:999, pixelEnd:1020, year:2037}
            {pixelStart:1021, pixelEnd:1040, year:2038}
            {pixelStart:1041, pixelEnd:1060, year:2039}]

root = exports ? this

class stackedAreaChart extends stackedBarChart
  stackedAreaDefaults:
    strokeWidth: 1

  constructor:(parent, x, y, options = {}) ->

    document.onmousemove = @handleMouseMove

    @options = _.extend {}, @stackedAreaDefaults, options
    @_strokeWidth = @options.strokeWidth
    super(parent, x, y, @options)
    @redraw()

  handleMouseMove: (event) =>
    root.mousePos = {x: event.pageX, y: event.pageY}
    if root.activeSource?
      current = pixelMap.find((entry) -> root.mousePos.x >= entry.pixelStart && root.mousePos.x <entry.pixelEnd)
      if current?
        titletobe = @_stackDictionary[root.activeSource].values.find((value) -> value.x == current.year)
        document.getElementById(root.activeArea).innerHTML = Tr.sourceSelector.sources[root.activeSource][app.language] + " (" + current.year + "): " + titletobe.y.toFixed(2)

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
          .on "mouseover", (d) =>
            root.activeArea = "present"+d.key
            root.activeSource = d.key
          .on "mouseout", (d) =>
            root.activeArea = null
            root.activeSource = null

      presentArea.enter().append("path")
        .attr
          class: 'presentArea'
          d: (d) =>
            area(@_stackDictionary[d.key].values.map((data) -> {x: data.x, y:0, y0:0}))
        .style  
          fill: (d) -> colour = d3.rgb(d.colour); "url(#viz2gradPresent#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.6)"
        # Tooltip
        .append('title')
          .attr(
            id: (d) =>
              # We add a unique id to access the title whenever
              # it is modified. The id takes the format:
              # provinceName + Year (e.g. ON2015)
              "present"+d.key
          )
          .text (d) =>
              ""

      presentArea.exit().remove()

      futureArea = @_group.selectAll(".futureArea")
          .data(@_mapping, (d) -> d.key)
          .on "mouseover", (d) =>
            root.activeArea = "future"+d.key
            root.activeSource = d.key
          .on "mouseout", (d) =>
            root.activeArea = null
            root.activeSource = null

      futureArea.enter().append("path")
        .attr
          class: 'futureArea'
          d: (d) =>
            areaFuture(@_stackDictionary[d.key].values.map((data) -> {x: data.x, y:0, y0:0}))
        .style  
          fill: (d) -> colour = d3.rgb(d.colour); "url(#viz2gradFuture#{d.key}) rgba(#{colour.r}, #{colour.g}, #{colour.b}, 0.4)"
        # Tooltip
        .append('title')
          .attr(
            id: (d) =>
              # We add a unique id to access the title whenever
              # it is modified. The id takes the format:
              # provinceName + Year (e.g. ON2015)
              "future"+d.key
          )
          .text (d) =>
              ""

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