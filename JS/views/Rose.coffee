_ = require 'lodash'
d3 = require 'd3'
d3Path = require 'd3-path'

Constants = require '../Constants.coffee'
Platform = require '../Platform.coffee'

defaultOptions =
  position:
    x: 0
    y: 0
  scale: 1




class Rose

  # Options
  #   container, a d3 wrapped DOM node
  #   data, six element array with source and value for petals
  #   containerPosition, with x, y for container placement in canvas
  #   scale, number, controls container sizing
  constructor: (@app, options) ->
    @document = @app.window.document
    @d3document = d3.select @document

    @options = _.extend {}, defaultOptions, options
    @container = @options.container

  transitionToGridPosition: =>
    # Set the starting position to the grid position.
    @setStartingPosition @options.position

    # Animate the provinces to their grid positions.
    @container
      .transition()
        .duration Constants.animationDuration
        .attr
          transform: "translate(#{@options.startingPosition.x}, #{@options.startingPosition.y}) scale(#{@options.scale}, #{@options.scale})"

    # Render the full province rose in order.
    @app.window.setTimeout @renderFullRose, Constants.fullRoseRenderingDelay[@options.data[0].province]

  # Add all of the static elements, and set up petals for update.
  render: ()->

    # Apply an animation to the rose as it appears
    containerOffset = Constants.roseSize / 2 * @options.scale
    @container
      # The initial scale is set at zero, so that the rose scales from nothing up to full
      # size
      # The initial postion is offset by the radius of the rose, when combined with the
      # scale animation the rose appears to scale up from its origin.
      # Otherwise the rose would scale up from the top left corner
      .attr
        transform: "translate(#{@options.startingPosition.x + containerOffset}, #{@options.startingPosition.y + containerOffset}) scale(0, 0)"
      .transition()
        .duration Constants.animationDuration
        .attr
          transform: "translate(#{@options.startingPosition.x}, #{@options.startingPosition.y}) scale(#{@options.scale}, #{@options.scale})"

    # Add an inner group for internal transforms.
    @innerContainer = @container
      .append 'g'
      .attr
        class: 'rose'
        transform: ->
          "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"

    # Draw the axes, but set its scale to zero so it is invesible. This is
    # done here so that the axes are positioned behind the inner circle.
    for angle in Constants.roseAngles
      @innerContainer.append 'line'
        .attr
          class: 'roseAxisLine'
          stroke: '#ccc'
          'stroke-width': 0.5
          x1: 0
          y1: 0
          x2: Constants.roseOuterCircleRadius * Math.cos angle
          y2: Constants.roseOuterCircleRadius * Math.sin angle
          'stroke-dasharray': '2,2'
          transform: "scale(0, 0)"

    # Centre circle
    @innerContainer.append 'circle'
      .attr
        class: 'roseCentreCircle'
        r: Constants.roseCentreCircleRadius
        fill: '#333'

    # Centre label
    @innerContainer.append 'text'
      .attr
        class: 'roseCentreLabel'
        fill: 'white'
        transform: 'translate(0, 4.5)'
        'text-anchor': 'middle'
      # TODO: should this be in a stylesheet?
      .style
        'font-size': '13px'
      .text =>
        @options.data[0].province

    if @options.firstRun == true
      @options.firstRun = false
      @app.window.setTimeout @transitionToGridPosition, Constants.animationDuration
    else
      @renderFullRose()

  # Renders the remaining part of the rose.
  renderFullRose: =>
    # Show the axes by scaling them back up.
    for angle in Constants.roseAngles
      @innerContainer.selectAll '.roseAxisLine'
        .transition()
          .duration Constants.rosePopUpDuration
          .attr
            transform: "scale(#{Constants.roseSlightlyBiggerScale},#{Constants.roseSlightlyBiggerScale})"
        .transition()
          .duration Constants.rosePopUpDuration
          .attr
            transform: "scale(#{Constants.roseFullScale},#{Constants.roseFullScale})"

    # Outer circle
    @innerContainer.append 'circle'
      .attr
        class: 'roseOuterCircle'
        r: Constants.roseOuterCircleRadius
        stroke: '#ccc'
        'stroke-width': 1
        fill: 'none'
        transform: "scale(0, 0)"
      .transition()
        .duration Constants.rosePopUpDuration
        .attr
          transform: "scale(#{Constants.roseSlightlyBiggerScale},#{Constants.roseSlightlyBiggerScale})"
      .transition()
        .duration Constants.rosePopUpDuration
        .attr
          transform: "scale(#{Constants.roseFullScale},#{Constants.roseFullScale})"
    # Tickmarks
    for distance in Constants.roseTickDistances
      # Tickmarks are each the same length, but are drawn as tiny arcs.
      # So, the angular width of the arc is different for each set of tickmarks
      tickmarkRadius = Constants.roseBaselineCircleRadius + distance
      tickmarkCircumference = 2 * Math.PI * tickmarkRadius

      for angle in Constants.roseAngles
        angularWidth = Constants.roseTickLength / tickmarkCircumference * 2 * Math.PI
        startAngle = angle - angularWidth / 2
        endAngle = angle + angularWidth / 2
        
        # Compute the start point of the tickmark, using a ray from the centre of the rose
        startX = tickmarkRadius * Math.cos startAngle
        startY = tickmarkRadius * Math.sin startAngle

        path = d3Path.path()
        path.moveTo startX, startY
        path.arc 0, 0, tickmarkRadius, startAngle, endAngle


        @innerContainer.append 'path'
          .attr
            class: 'roseTickMark'
            stroke: '#ccc'
            'stroke-width': 1
            d: path.toString()
            fill: 'none'
            transform: "scale(0, 0)"
          .transition()
            .duration Constants.rosePopUpDuration
            .attr
              transform: "scale(#{Constants.roseSlightlyBiggerScale},#{Constants.roseSlightlyBiggerScale})"
          .transition()
            .duration Constants.rosePopUpDuration
            .attr
              transform: "scale(#{Constants.roseFullScale},#{Constants.roseFullScale})"

    # Petals
    @innerContainer.selectAll '.petal'
      .data @options.data
      .enter()
      .append 'path'
      .attr
        class: 'petal'
        fill: (d) ->
          Constants.viz5RoseData[d.source].colour
        d: (d) =>
          @petalPath d.value, Constants.viz5RoseData[d.source].startAngle
        transform: "scale(0, 0)"
      .transition()
        .duration Constants.rosePopUpDuration
        .attr
          transform: "scale(#{Constants.roseSlightlyBiggerScale},#{Constants.roseSlightlyBiggerScale})"
      .transition()
        .duration Constants.rosePopUpDuration
        .attr
          transform: "scale(#{Constants.roseFullScale},#{Constants.roseFullScale})"

    # Baseline circle
    @innerContainer.append 'circle'
      .attr
        class: 'roseBaselineCircle'
        r: Constants.roseBaselineCircleRadius
        stroke: '#333'
        'stroke-width': 1
        fill: 'none'
        transform: "scale(0, 0)"
      .transition()
        .duration Constants.rosePopUpDuration
        .attr
          transform: "scale(#{Constants.roseSlightlyBiggerScale},#{Constants.roseSlightlyBiggerScale})"
      .transition()
        .duration Constants.rosePopUpDuration
        .attr
          transform: "scale(#{Constants.roseFullScale},#{Constants.roseFullScale})"

  update: ->
    # For reasons unknown, the transition here causes a crash in server side rendering
    # Ordinarily, transitions work fine on server with the duration set to zero, but not
    # this time.
    # TODO: Investigate, and remove this workaround.

    switch Platform.name
      when 'browser'
        container = @container.transition()
          .duration @app.animationDuration
      when 'server'
        container = @container

    @container.transition()
      .duration Constants.animationDuration
      .attr
        transform: "translate(#{@options.startingPosition.x}, #{@options.startingPosition.y}) scale(#{@options.scale}, #{@options.scale})"

    @innerContainer.select '.roseCentreLabel'
      .text =>
        @options.data[0].province

    @innerContainer.selectAll '.petal'
      .data @options.data
      .transition()
      .duration @app.animationDuration
      .attr
        d: (d) =>
          @petalPath d.value, Constants.viz5RoseData[d.source].startAngle





  # Produce a string for use as the definition of a path element, which includes a petal
  # and thorn. The petal is always drawn as a 1/6 section of a circle.
  #   value: a number, positive or negative, the distance from the baseline
  #   startAngle: a number, in radians, rotation from the x axis clockwise.
  petalPath: (value, startAngle) ->

    # A petal is composed of an outer arc, which is broken in two by a thorn (a triangular
    # point) in the middle, and an unbroken inner arc. The inner arc always lies along
    # the baseline circle of the rose, the outer arc may be closer to the origin or more
    # distant (i.e. greater or lower radius) from the baseline depending on its data
    # value.

    petalDistance = Constants.roseBaselineCircleRadius + value
    if petalDistance < Constants.roseBaselineCircleRadius
      # pointed inward
      thornDistance = petalDistance - Constants.roseThornLength
    else
      # pointed outward
      thornDistance = petalDistance + Constants.roseThornLength

    # NB: It's important that the petal distance not be zero.
    # If it is zero, the d3-path.arc function won't generate one of the arcs in the path.
    # Then, since the path structure for this petal doesn't match the structure for paths
    # with values higher than zero, the interpolation based path animations don't work
    # correctly. For info about path animations: https://bost.ocks.org/mike/path/
    petalDistance = 0.0000001 if petalDistance <= 0
    
    thornDistance = 0 if thornDistance < 0

    finalAngle = startAngle + Math.PI * 1 / 3

    thornAngle = startAngle + Math.PI * 1 / 6
    thornBaseStartAngle = thornAngle - Constants.thornAngularWidth
    thornBaseEndAngle = thornAngle + Constants.thornAngularWidth


    # First, we compute all of the points with which we will be drawing lines

    # First point in the first outer arc
    outerArc1X1 = petalDistance * Math.cos startAngle
    outerArc1Y1 = petalDistance * Math.sin startAngle

    # Second point in the first outer arc, base of the thorn
    # outerArc1X2 = petalDistance * Math.cos thornBaseStartAngle
    # outerArc1Y2 = petalDistance * Math.sin thornBaseStartAngle

    # Point of the thorn
    thornPointX = thornDistance * Math.cos thornAngle
    thornPointY = thornDistance * Math.sin thornAngle

    # First point in the second outer arc, base of the thorn
    outerArc2X1 = petalDistance * Math.cos thornBaseEndAngle
    outerArc2Y1 = petalDistance * Math.sin thornBaseEndAngle

    # Second point in the second outer arc
    # outerArc2X2 = petalDistance * Math.cos finalAngle
    # outerArc2Y2 = petalDistance * Math.sin finalAngle

    # Points defining the lower arc
    # lowerArcX1 = Constants.roseBaselineCircleRadius * Math.cos startAngle
    # lowerArcY1 = Constants.roseBaselineCircleRadius * Math.sin startAngle

    lowerArcX2 = Constants.roseBaselineCircleRadius * Math.cos finalAngle
    lowerArcY2 = Constants.roseBaselineCircleRadius * Math.sin finalAngle



    path = d3Path.path()

    # First outer arc
    path.moveTo outerArc1X1, outerArc1Y1
    path.arc 0, 0, petalDistance, startAngle, thornBaseStartAngle

    # Thorn leg 1
    path.lineTo thornPointX, thornPointY

    # Thorn leg 2
    path.lineTo outerArc2X1, outerArc2Y1

    # Second outer arc
    path.arc 0, 0, petalDistance, thornBaseEndAngle, finalAngle

    # Line to lower arc
    path.lineTo lowerArcX2, lowerArcY2

    # Lower arc, always lies along the baseline circle
    path.arc 0, 0, Constants.roseBaselineCircleRadius, finalAngle, startAngle, true
    
    # End!
    path.closePath()

    path.toString()


  setData: (data) ->
    @options.data = data if data?

  setPosition: (position) ->
    @options.position = position if position?

  setStartingPosition: (position) ->
    @options.startingPosition = position if position?

  setScale: (scale) ->
    @options.scale = scale if typeof scale == 'number'


  teardown: ->
    # Apply an animation to the rose as it is removed
    containerOffset = Constants.roseSize / 2 * @options.scale
    @container
      .transition()
      .duration @app.animationDuration
      .attr
        transform: "translate(#{@options.position.x + containerOffset}, #{@options.position.y + containerOffset}) scale(0, 0)"
      .each 'end', =>
        @container.remove()






module.exports = Rose