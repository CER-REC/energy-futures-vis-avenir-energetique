d3 = require 'd3'
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







  roseData: ->




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
          value: 5
          color: '#8d68ac'
          startAngle: Math.PI * (0 / 3 + 1 / 6)
          endAngle: Math.PI * (1 / 3 + 1 / 6)
          thornAngle: Math.PI * -1 / 6
        }
        {
          value: 10
          color: '#996733'
          startAngle: Math.PI * (1 / 3 + 1 / 6)
          endAngle: Math.PI * (2 / 3 + 1 / 6)
          thornAngle: Math.PI * 1 / 6
        }
        {
          value: 15
          color: '#33cccc'
          startAngle: Math.PI * (2 / 3 + 1 / 6)
          endAngle: Math.PI * (3 / 3 + 1 / 6)
          thornAngle: Math.PI * 3 / 6
        }
        {
          value: -5
          color: '#f16739'
          startAngle: Math.PI * (3 / 3 + 1 / 6)
          endAngle: Math.PI * (4 / 3 + 1 / 6)
          thornAngle: Math.PI * -7 / 6
        }
        {
          value: -10
          color: '#cc6699'
          startAngle: Math.PI * (4 / 3 + 1 / 6)
          endAngle: Math.PI * (5 / 3 + 1 / 6)
          thornAngle: Math.PI * -5 / 6
        }
        {
          value: -15
          color: '#339947'
          startAngle: Math.PI * (5 / 3 + 1 / 6)
          endAngle: Math.PI * (6 / 3 + 1 / 6)
          thornAngle: Math.PI * -3 / 6
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


    # petals
    arcGenerator = d3.svg.arc()
    rose.each (d) ->
      rose.selectAll '.petal'
        .data d.petals
        .enter()
        .append 'path'
        .attr
          transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"
          d: (d) ->
            valueRadius = d.value + Constants.roseBaselineCircleRadius


            arcGenerator.innerRadius Math.min(valueRadius, Constants.roseBaselineCircleRadius)
            arcGenerator.outerRadius Math.max(valueRadius, Constants.roseBaselineCircleRadius)
            arcGenerator.startAngle d.startAngle
            arcGenerator.endAngle d.endAngle

            arcGenerator()
          fill: (d) ->
            d.color
          # stroke: (d) ->
          #   d.color
          class: 'petal'


    # thorns

    lineFunction = d3.svg.line()
      .x (d) -> d.x # are these necessary?
      .y (d) -> d.y
      .interpolate 'linear' # this necessary either?

    rose.each (d) ->
      rose.selectAll '.thorn'
        .data d.petals
        .enter()
        .append 'path'
        .attr
          transform: "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"
          d: (d) ->

            petalDistance = Constants.roseBaselineCircleRadius + d.value
            if petalDistance < Constants.roseBaselineCircleRadius
              # pointed inward
              thornDistance = petalDistance - Constants.roseThornLength
            else
              # pointed outward
              thornDistance = petalDistance + Constants.roseThornLength

            # NB: These thorns are specified with reference to the angle and distance to
            # the centre of the rose. This means that the thorn shape will change with
            # the size of the petal, long petals pointed toward the centre will have
            # narrow thorns, long petals pointed outward will have broader flatter thorns.
            
            # This could be corrected with a different approach to drawing the thorns:
            # take a point at a distance of Constants.roseThornLength from the petal, and
            # find the intersection of two lines from that point to the arc of the petal.
            # The math for this is more complex, and the visual difference will be
            # minimal, but we could run this past the design team.
            foo = [
              # on the arc
              {
                x: petalDistance * Math.cos(d.thornAngle + Math.PI * 2/64)
                y: petalDistance * Math.sin(d.thornAngle + Math.PI * 2/64)
              }
              # point of the thorn
              {
                x: thornDistance * Math.cos(d.thornAngle)
                y: thornDistance * Math.sin(d.thornAngle)
              }
              # on the arc
              {
                x: petalDistance * Math.cos(d.thornAngle + Math.PI * -2/64)
                y: petalDistance * Math.sin(d.thornAngle + Math.PI * -2/64)
              }
            ]
            console.log foo
            lineFunction foo

          fill: (d) ->
            d.color
          # stroke: (d) ->
          #   d.color
          class: 'thorn'



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


  renderGraph: ->













module.exports = Visualization5
