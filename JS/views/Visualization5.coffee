d3 = require 'd3'
d3Path = require 'd3-path'
Mustache = require 'mustache'

Constants = require '../Constants.coffee'
# SquareMenu = require '../charts/SquareMenu.coffee'
# Tr = require '../TranslationTable.coffee'
Platform = require '../Platform.coffee'

# ParamsToUrlString = require '../ParamsToUrlString.coffee'
# CommonControls = require './CommonControls.coffee'

if Platform.name == 'browser'
  Visualization5Template = require '../templates/Visualization5.mustache'
  SvgStylesheetTemplate = require '../templates/SvgStylesheet.css'

# ControlsHelpPopover = require '../popovers/ControlsHelpPopover.coffee'

# ProvinceAriaText = require '../ProvinceAriaText.coffee'








class Visualization5


  renderBrowserTemplate: ->
    contentElement = @document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render Visualization5Template,
      # selectDatasetLabel: Tr.datasetSelector.selectDatasetLabel[@app.language]
      # selectScenarioLabel: Tr.scenarioSelector.selectScenarioLabel[@app.language]
      # selectRegionLabel: Tr.regionSelector.selectRegionLabel[@app.language]
      svgStylesheet: SvgStylesheetTemplate

      # altText:
      #   datasetsHelp: Tr.altText.datasetsHelp[@app.language]
      #   scenariosHelp: Tr.altText.scenariosHelp[@app.language]



  constructor: (@app, config, @options) ->
    @config = config
    @outerHeight = 700
    @margin =
      top: 20
      right: 70
      bottom: 50
      left: 10
    @document = @app.window.document
    @d3document = d3.select @document


    if Platform.name == 'browser'
      @renderBrowserTemplate()
    else if Platform.name == 'server'
      @renderServerTemplate()

    @tooltip = @document.getElementById 'tooltip'
    @tooltipParent = @document.getElementById 'wideVisualizationPanel'
    @graphPanel = @document.getElementById 'graphPanel'

    @render()

    @redraw()




  redraw: ->
    # @d3document.select '#graphSVG'
    #   .attr
    #     width: @outerWidth()
    #     height: @outerHeight
    @renderGraph()











  # just one rose
  # within the group: normalize to 112px x 112px
  render: ->
  # renderRose: (d) ->


    # preliminary stuff
    container = @d3document.select '#graphSVG'
    container.attr
      height: 1000
      width: 1000



    # TODO: not for long term
    target = @d3document.select '#target'

    target.attr
      transform: 'scale(5, 5)'

    target.append 'rect'
      .attr
        height: Constants.roseSize
        width: Constants.roseSize
        fill: '#eee'




    # enter


    tempData = [{
      scale: 1
      province: 'AB'
      petals: [ # better than this!
        {
          value: 15
          color: '#33cccc' # teal, electricity
          startAngle: Math.PI * (2 / 3)
        }
        {
          value: -5
          color: '#f16739' # orange, nat gas
          startAngle: Math.PI * (3 / 3)
        }
        {
          value: 5
          color: '#8d68ac' # purple, biofuels
          startAngle: Math.PI * (0 / 3)
        }
        {
          value: -15
          color: '#339947' # green, solar/wind/geo
          startAngle: Math.PI * (5 / 3)
        }
        {
          value: 10
          color: '#996733' # brown, coal
          startAngle: Math.PI * (1 / 3)
        }
        {
          value: -10
          color: '#cc6699' # pink, oil products
          startAngle: Math.PI * (4 / 3)
        }

      ]
    }]


    #   add a group to the world
    target.selectAll '.rose'
      .data tempData
      .enter().append 'g'
      .attr
        class: 'rose'
        transform: (d) ->
          "scale(#{d.scale}, #{d.scale})"

    # TODO: the transform on each of the elements can be moved to the .rose group, for
    # simplicity ...

    rose = target.select '.rose'

    # add the static elements

    # TODO: this all needs to be tweaked to operate only on enter...

    # axes
    for angle in Constants.roseAngles
      rose.append 'line'
        .attr
          class: 'roseAxisLine'
          stroke: '#ccc'
          'stroke-width': 1
          transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"
          x1: 0
          y1: 0
          x2: Constants.roseOuterCircleRadius * Math.cos angle
          y2: Constants.roseOuterCircleRadius * Math.sin angle


    # centre
    rose.append 'circle'
      .attr
        class: 'roseCentreCircle'
        r: Constants.roseCentreCircleRadius
        fill: '#333'
        transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"


    # centre label
    rose.append 'text'
      .attr
        class: 'roseCentreLabel'
        fill: 'white'
        transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius + 5})" # TODO: Constant here
        'text-anchor': 'middle'
      # TODO: should this be in a stylesheet?
      .style
        'font-size': '16px'
      .text (d) ->
        d.province


    # outer circle
    rose.append 'circle'
      .attr
        class: 'roseOuterCircle'
        r: Constants.roseOuterCircleRadius
        stroke: '#ccc'
        'stroke-width': 1
        fill: 'none'
        transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"



    # tickmarks
    for angle in Constants.roseAngles
      for distance in Constants.roseTickDistances

        # Compute the midpoint of the tickmark, using a ray from the centre of the rose
        midpointX = (Constants.roseBaselineCircleRadius + distance) * Math.cos angle
        midpointY = (Constants.roseBaselineCircleRadius + distance) * Math.sin angle

        rose.append 'line'
          .attr
            class: 'roseTickMark'
            stroke: '#ccc'
            'stroke-width': 0.5
            transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"
            # To compute the endpoints of the tickmark, we start from the midpoint and
            # use the line orthogonal to the ray from the centre of the rose
            x1: midpointX + Constants.roseTickLength / 2 * Math.cos(angle + Math.PI / 2)
            y1: midpointY + Constants.roseTickLength / 2 * Math.sin(angle + Math.PI / 2)
            x2: midpointX - Constants.roseTickLength / 2 * Math.cos(angle + Math.PI / 2)
            y2: midpointY - Constants.roseTickLength / 2 * Math.sin(angle + Math.PI / 2)

    # petals v2
    rose.each (d) =>
      rose.selectAll '.petal'
        .data d.petals
        .enter()
        .append 'path'
        .attr
          transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"
          d: (d) =>
            @petalPath d.value, d.startAngle
          # stroke: (d) ->
          #   d.color
          fill: (d) ->
            d.color
          class: 'petal'



    # baseline circle
    rose.append 'circle'
      .attr
        class: 'roseBaselineCircle'
        r: Constants.roseBaselineCircleRadius
        stroke: '#333'
        'stroke-width': 1
        fill: 'none'
        transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"





    # update
    #   petal sizes
    #   thorn positions
    #   thorn *directions*

    #   potentially: position, scale


  # Produce a string for use as the definition of a path element, which includes a petal
  # and thorn. The petal is always drawn as a 1/6 section of a circle.
  #   value: a number, positive or negative, the distance from the baseline
  #   startAngle: a number, radians, how far from the x
  # NB: unlike the very similar d3.svg.arc function, rotation is measured
  # counterclockwise from the positive x axis, and not clockwise from the positive y axis.
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

    finalAngle = startAngle + Math.PI * 1 / 3

    thornAngle = startAngle + Math.PI * 1 / 6
    thornBaseStartAngle = thornAngle - Constants.thornAngularWidth
    thornBaseEndAngle = thornAngle + Constants.thornAngularWidth


    # First, we compute all of the points with which we will be drawing lines
    # Strictly speaking, the points passed to arcTo only need to have the right angle to
    # the current point, the distance to the current point is taken from the radius and
    # not measured from the passed in point.
    # But, to maintain sanity, we'll calculate all of the actual points involved in the
    # path.

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

  renderGraph: ->













module.exports = Visualization5
