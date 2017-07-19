_ = require 'lodash'
d3 = require 'd3'
d3Path = require 'd3-path'

Constants = require '../Constants.coffee'

defaultOptions = {}




class Rose


  # Viz5 config
  constructor: (@app, options) ->

    @document = @app.window.document
    @d3document = d3.select @document

    @options = _.extend defaultOptions, options
    @container = @options.container








  # Add all of the static elements, and set up petals for update.
  render: ->

    # Add an inner group for internal transforms.
    # The container which is passed to the rose has transforms which are managed by the
    # viz5 instance.
    @innerContainer = @container
      .append 'g'
      .attr
        class: 'rose'
        transform: (d) =>
          "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"

    # Axes
    for angle in Constants.roseAngles
      @innerContainer.append 'line'
        .attr
          class: 'roseAxisLine'
          stroke: '#ccc'
          'stroke-width': 1
          x1: 0
          y1: 0
          x2: Constants.roseOuterCircleRadius * Math.cos angle
          y2: Constants.roseOuterCircleRadius * Math.sin angle

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
        transform: "translate(0, 4.5)" # TODO: Constant here
        'text-anchor': 'middle'
      # TODO: should this be in a stylesheet?
      .style
        'font-size': '13px'
      .text =>
        @options.data[0].province

    # Outer circle
    @innerContainer.append 'circle'
      .attr
        class: 'roseOuterCircle'
        r: Constants.roseOuterCircleRadius
        stroke: '#ccc'
        'stroke-width': 1
        fill: 'none'

    # Tickmarks
    for angle in Constants.roseAngles
      for distance in Constants.roseTickDistances

        # Compute the midpoint of the tickmark, using a ray from the centre of the rose
        midpointX = (Constants.roseBaselineCircleRadius + distance) * Math.cos angle
        midpointY = (Constants.roseBaselineCircleRadius + distance) * Math.sin angle

        @innerContainer.append 'line'
          .attr
            class: 'roseTickMark'
            stroke: '#ccc'
            'stroke-width': 0.5
            # To compute the endpoints of the tickmark, we start from the midpoint and
            # use the line orthogonal to the ray from the centre of the rose
            x1: midpointX + Constants.roseTickLength / 2 * Math.cos(angle + Math.PI / 2)
            y1: midpointY + Constants.roseTickLength / 2 * Math.sin(angle + Math.PI / 2)
            x2: midpointX - Constants.roseTickLength / 2 * Math.cos(angle + Math.PI / 2)
            y2: midpointY - Constants.roseTickLength / 2 * Math.sin(angle + Math.PI / 2)

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

    # Baseline circle
    @innerContainer.append 'circle'
      .attr
        class: 'roseBaselineCircle'
        r: Constants.roseBaselineCircleRadius
        stroke: '#333'
        'stroke-width': 1
        fill: 'none'









  update: ->
    @innerContainer.select '.roseCentreLabel'
      .text =>
        @options.data[0].province

    # TODO: Check that this works
    # TODO: Animate it

    @innerContainer.selectAll '.petal'
      .data @options.data
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
    # distant (i.e. greater or lower radius) from it depending on the data value.

    petalDistance = Constants.roseBaselineCircleRadius + value
    if petalDistance < Constants.roseBaselineCircleRadius
      # pointed inward
      thornDistance = petalDistance - Constants.roseThornLength
    else
      # pointed outward
      thornDistance = petalDistance + Constants.roseThornLength

    if petalDistance < 0
      # console.warn "negative petal radius #{petalDistance} for #{value}"
      petalDistance = 0
    
    if thornDistance < 0
      # console.warn "negative thorn radius #{thornDistance} for #{value}"
      thornDistance = 0

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

    # Lower arc
    path.arc 0, 0, Constants.roseBaselineCircleRadius, finalAngle, startAngle, true
    
    # End!
    path.closePath()

    path.toString()


  setData: (data) ->
    @options.data = data









module.exports = Rose