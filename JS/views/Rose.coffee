_ = require 'lodash'
d3 = require 'd3'
d3Path = require 'd3-path'
Promise = require 'bluebird'
d3Ease = require 'd3-ease'

Constants = require '../Constants.coffee'
RosePill = require './RosePill.coffee'
Platform = require '../Platform.coffee'



defaultOptions =
  position:
    x: 0
    y: 0
  scale: 1
  # clickHandler may be null, for use with roses in comparison mode where pills are
  # always displayed, and there is no click behaviour
  clickHandler: null
  rosePillClickHandler: ->
  showPillsOnFirstRun: false
  showPillsCallback: ->
  isFirstRun: false
  showPopoverOnFirstRun: false
  showPopoverCallback: ->
  pillSize: 'small' # 'small' or 'large'

  removePillsBeforeTransition: false
  showPillsAfterTransition: false
  showAllCanadaAnimationOnFirstRun: false



class Rose

  # Options
  #   container, a d3 wrapped DOM node
  #   data, six element array with source and value for petals
  #   containerPosition, with x, y for container placement in canvas
  #   scale, number, controls container sizing
  #   clickHandler, function
  #   pillClickHandler, function, injected into pills we create
  #   rosePillTemplate, function, only defined on server

  constructor: (@app, options) ->
    @document = @app.window.document
    @d3document = d3.select @document

    @options = _.extend {}, defaultOptions, options
    @container = @options.container

    @rosePills = {}
    @shadowPills = {}

    @pillsDisplayed = false
    @tornDown = false

    # d3 can only animate attributes on DOM elements, and not on plain old javascript
    # objects. But, in order to make certain animations work correctly, we need to record
    # the currently displayed value as it is animated. To do this, we use the slightly
    # hacky workaround of an element with data attributes held by the view instance,
    # as a target for d3.transition later. This seems preferable to storing this state in
    # the DOM.
    @animationState = d3.select @document.createElement 'div'
    for source in Constants.viz5SourcesInOrder
      @animationState.attr "data-view-value-#{source}", 0

  transitionToGridPosition: =>
    # Set the starting position to the grid position.
    @setStartingPosition @options.position

    # Animate the provinces to their grid positions.
    switch Platform.name
      when 'browser'
        @container
          .transition()
            .duration Constants.animationDuration
            .attr
              transform: "translate(#{@options.startingPosition.x}, #{@options.startingPosition.y}) scale(#{@options.scale}, #{@options.scale})"

        # Render the full province rose in order.
        @app.window.setTimeout @renderFullRose, Constants.fullRoseRenderingDelay[@options.data[0].province]
      when 'server'
        @container
          .attr
            transform: "translate(#{@options.startingPosition.x}, #{@options.startingPosition.y}) scale(#{@options.scale}, #{@options.scale})"
        # Render the full province rose
        @renderFullRose()


  # Add all of the static elements, and set up petals for update.
  render: ->

    @container.attr
      transform: "translate(#{@options.startingPosition.x}, #{@options.startingPosition.y}) scale(#{@options.scale}, #{@options.scale})"


    # Add an inner group for internal transforms.
    @innerContainer = @container
      .append 'g'
      .attr
        class: =>
          if @options.clickHandler?
            'rose pointerCursor'
          else
            'rose'
        transform: ->
          "translate(#{Constants.roseOuterCircleRadius}, #{Constants.roseOuterCircleRadius})"
      .on 'click', =>
        return unless @options.clickHandler?
        @options.clickHandler @


    # Outer circle
    # Similar to the axes, make the scale of the outer circle zero, so that it is not
    # visible
    @innerContainer.append 'circle'
      .attr
        class: 'roseOuterCircle'
        r: Constants.roseOuterCircleRadius
        stroke: 'none'
        'stroke-width': 0.5
        # NB: The fill on the outer circle interacts with the click handler, to make
        # the whole rose clickable.
        fill: 'white'
        transform: 'scale(0, 0)'

    # Draw the axes, but set its scale to zero so it is invisible. This is
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
          transform: 'scale(0, 0)'


    # Centre circle
    @innerContainer.append 'circle'
      .attr
        class: 'roseCentreCircle'
        r: Constants.roseCentreCircleRadius
        fill: '#333'
        stroke: '#fff'
        'stroke-width': 1.0

    # Render the maple leaf instead of the text
    # label for the Canada rose
    # This is kind of a hack. For some reason, I can't seem to get an <image> tag
    # to render on the server for the image download, which causes the maple leaf
    # not to show on the image. This works, but is a bit messy.
    if @options.data[0].province == 'Canada'
      @innerContainer.append 'circle'
        .attr
          class: 'pointerCursor'
          id: 'mapleLeafCircle'
          r: Constants.mapleLeafCircleRadius
          'stroke-width': Constants.mapleLeafCircleStroke
          fill: '#fff'
          stroke: '#f00'
      @innerContainer.append 'g'
        .attr
          transform: "translate(-#{Constants.roseCentreCircleRadius - Constants.mapleLeafCenterOffset}, -#{Constants.roseCentreCircleRadius - Constants.mapleLeafCenterOffset}) scale(#{Constants.mapleLeafScale}, #{Constants.mapleLeafScale})"
          class: 'pointerCursor'
          id: 'mapleLeafSVGgroup'
        .append 'path'
          .attr
            class: 'pointerCursor'
            id: 'mapleLeafSVG'
            fill: '#f00'
            d: Constants.mapleLeafPath

      # Centre label
      @innerContainer.append 'text'
        .attr
          class: 'roseCentreLabel hidden'
          fill: 'white'
          transform: 'translate(0, 4.5)'
          'text-anchor': 'middle'
        .style
          'font-size': '13px'
        .text =>
          @options.data[0].province

    else
      # Centre label
      @innerContainer.append 'text'
        .attr
          class: 'roseCentreLabel'
          fill: 'white'
          transform: 'translate(0, 4.5)'
          'text-anchor': 'middle'
        .style
          'font-size': '13px'
        .text =>
          @options.data[0].province

      @innerContainer.append 'circle'
        .attr
          class: 'hidden'
          id: 'mapleLeafCircle'
          r: Constants.mapleLeafCircleRadius
          'stroke-width': Constants.mapleLeafCircleStroke
          fill: '#fff'
          stroke: '#f00'
      @innerContainer.append 'g'
        .attr
          transform: "translate(-#{Constants.roseCentreCircleRadius - 2}, -#{Constants.roseCentreCircleRadius - 2}) scale(#{Constants.mapleLeafScale}, #{Constants.mapleLeafScale})"
        .append 'path'
          .attr
            class: 'pointerCursor hidden'
            id: 'mapleLeafSVG'
            fill: '#f00'
            d: Constants.mapleLeafPath

    if @options.isFirstRun and @options.showAllCanadaAnimationOnFirstRun
      switch Platform.name
        when 'browser'
          @app.window.setTimeout @transitionToGridPosition, Constants.animationDuration
        when 'server'
          @transitionToGridPosition()
    else
      @renderFullRose()


  # There are a few major categories for rose animation
  # - Rose translations, which are handled by the parent view, for moving roses around the
  #   svg canvas.
  # - Rose petal size changes, which are handled in update
  # - Rose element creation, which is animated independently for each rose element by in
  #   animateRoseElementCreation, called from renderFullRose
  # - Rose destruction / disappearance, in teardown

  # This function animates the exact same petal elements which are then animated
  # when the user changes the data on display. If the user manages to change the data
  # during this element creation animation, it is cancelled, and the petals are rendered
  # in an inconsistent state.
  # Also, we call this function a bunch of times, once for each element to be scaled on
  # creation.
  # TODO: restructure the SVG so that we can call this just once on a group containing
  # all the elements, address both of these.
  # element is d3 wrapped
  animateRoseElementCreation: (element) ->
    switch Platform.name
      when 'browser'
        element
          .attr
            transform: 'scale(0, 0)'
          .transition()
            .duration Constants.rosePopUpDuration
            .attr
              transform: "scale(#{Constants.roseSlightlyBiggerScale},#{Constants.roseSlightlyBiggerScale})"
          .transition()
            .duration Constants.rosePopUpDuration
            .attr
              transform: "scale(#{Constants.roseFullScale},#{Constants.roseFullScale})"
      when 'server'
        element
          .attr
            transform: "scale(#{Constants.roseFullScale},#{Constants.roseFullScale})"

  # Renders the remaining part of the rose.
  # NB: in SVG, the order in which elements are added to the DOM is the order in which
  # will be rendered, bottop to top. The order that we create these elements is important
  # so that they are layered correctly on top of each other in the output.
  renderFullRose: =>

    self = @
    @innerContainer.selectAll '.roseAxisLine, .roseOuterCircle'
      # NB: 'this' is set by d3 to be the element in question
      .each ->
        self.animateRoseElementCreation d3.select @

    # Outer circle
    circleElement = @innerContainer.append 'circle'
      .attr
        class: 'roseOuterCircleStroke'
        r: Constants.roseOuterCircleRadius
        stroke: '#ccc'
        'stroke-width': 0.5
        fill: 'none'
    @animateRoseElementCreation circleElement

    # Tickmarks
    for distance in Constants.roseTickDistances
      # Tickmarks are each the same length, but are drawn as tiny arcs.
      # So, the angular width of the arc is different for each set of tickmarks
      tickmarkRadius = Constants.roseBaselineCircleRadius + distance
      tickmarkCircumference = 2 * Math.PI * tickmarkRadius
      angularWidth = Constants.roseTickLength / tickmarkCircumference * 2 * Math.PI

      for angle in Constants.roseAngles
        startAngle = angle - angularWidth / 2
        endAngle = angle + angularWidth / 2
        
        # Compute the start point of the tickmark, using a ray from the centre of the rose
        startX = tickmarkRadius * Math.cos startAngle
        startY = tickmarkRadius * Math.sin startAngle

        path = d3Path.path()
        path.moveTo startX, startY
        path.arc 0, 0, tickmarkRadius, startAngle, endAngle


        pathElement = @innerContainer.append 'path'
          .attr
            class: 'roseTickMark'
            stroke: '#ccc'
            'stroke-width': 0.5
            d: path.toString()
            fill: 'none'
        @animateRoseElementCreation pathElement


    # Petals
    for petalLayer in Constants.petalLayers
      petalElement = @innerContainer.selectAll ".#{petalLayer.class}"
        .data @options.data
        .enter()
        .append 'path'
        .attr
          class: (d) ->
            "petalLayer #{petalLayer.class} #{d.source}"
          fill: (d) ->
            d3.hsl(Constants.viz5RoseData[d.source].colour).darker petalLayer.darken
          d: (d) =>
            @animationState.attr "data-view-value-#{d.source}", d.value
            @petalPath d.value, Constants.viz5RoseData[d.source].startAngle, petalLayer

      @animateRoseElementCreation petalElement


    # Baseline circle
    baselineCircle = @innerContainer.append 'circle'
      .attr
        class: 'roseBaselineCircle'
        r: Constants.roseBaselineCircleRadius
        stroke: '#333'
        'stroke-width': 0.75
        fill: 'none'

    lastAnimation = @animateRoseElementCreation baselineCircle

    switch Platform.name
      when 'browser'
        lastAnimation.each 'end', =>
          if @options.isFirstRun and @options.showPillsOnFirstRun
            @options.showPillsCallback @
          @showPills() if @options.showPillsAfterTransition
      when 'server'
        # We rely on 'first run' behaviour to put pills on the comparison mode in its
        # first run, and the showPillsAfterTransition setting when roses are shown after
        # that, but first run is always set to false for server side
        @showPills() if @options.showPillsOnFirstRun

    # Shadow pills
    # Drawing the pills presents a problem because of the following two constraints:
    # - We need to layer the pill popover dialogs beneath the pills, but above the roses.
    # - The popover dialogs may need to exceed the bounds of the SVG element where we've
    #   drawn the roses.
    # Because of this, we can't render the pills or the dialogs as part of the SVG.
    # Keeping the positions of the pills in sync with the SVG drawings then becomes a
    # challenge, especially with the transforms and animations applied to the roses.
    
    # The approach here: render six invisible 'shadow pills' within the SVG, measure
    # their positions in the HTML document, and use them to absolutely position the real
    # pills (and their popovers).

    for source, data of Constants.viz5RoseData
      # NB: We wrap each shadowPill in a group object to work around an issue in IE/Edge
      # Their implementation of getClientBoundingBox is half broken for SVG: it is
      # capable of measuring the position of groups, but apparently not circles.
      shadowPill = @innerContainer.append 'g'
        .attr
          transform: "translate(#{Constants.roseOuterCircleRadius * Math.cos(data.startAngle + Math.PI / 6)}, #{Constants.roseOuterCircleRadius * Math.sin(data.startAngle + Math.PI / 6)})"
        .append 'circle'
        .attr
          class: 'shadowPill'
          # This needs to be slightly greater than zero to render correctly on Firefox.
          r: 0.0001
          cx: 0
          cy: 0
          fill: 'none'
          stroke: 'none'

      @shadowPills[source] = shadowPill

    if Platform.name == 'server'
      @showPills() if @options.showPillsAfterTransition



  update: ->
    @removePills() if @options.removePillsBeforeTransition

    @innerContainer.attr
      class: =>
        if @options.clickHandler?
          'rose pointerCursor'
        else
          'rose'

    # For reasons unknown, the transition here causes a crash in server side rendering
    # Ordinarily, transitions work fine on server with the duration set to zero, but not
    # this time.
    # TODO: Investigate, and remove this workaround.

    switch Platform.name
      when 'browser'
        container = @container.transition()
          .duration Constants.viz5timelineDuration
      when 'server'
        container = @container

    container.attr
      transform: "translate(#{@options.startingPosition.x}, #{@options.startingPosition.y}) scale(#{@options.scale}, #{@options.scale})"
    .each 'end', =>
      if @pillsDisplayed
        for item in @options.data
          @rosePills[item.source].setData item
          @rosePills[item.source].setShadowPillBounds @shadowPills[item.source][0][0].getBoundingClientRect()
          @rosePills[item.source].update()

      @showPills() if @options.showPillsAfterTransition

    # Render the maple leaf instead of the text
    # label for the Canada rose
    if @options.data[0].province == 'Canada'
      @innerContainer.select '#mapleLeafCircle'
        .attr
          class: 'pointerCursor'
      @innerContainer.select '#mapleLeafSVG'
        .attr
          class: 'pointerCursor'

      @innerContainer.select '.roseCentreLabel'
        .attr
          class: 'roseCentreLabel hidden'

    else
      @innerContainer.select '.roseCentreLabel'
        .attr
          class: 'roseCentreLabel'
        .text =>
          @options.data[0].province

      @innerContainer.select '#mapleLeafCircle'
        .attr
          class: 'hidden'
      @innerContainer.select '#mapleLeafSVG'
        .attr
          class: 'hidden'

    for d in @options.data
      @animatePetalLayers d



    @options.isFirstRun = false




  # Animate the four petal layers for one data item (the data for one energy source)
  animatePetalLayers: (d) ->

    # NB: This function is designed to make the following guarantees:
    # - If the petals are not animating, they will animate correctly and arrive at the
    #   correct final position
    # - If the petals are currently animating, they will arrive at the new correct final
    #   position (but might not animate correctly to get there!)
    # Mainly, because of all the layers moving around and because of the special behaviour
    # needed around a sign change in the value, it's really difficult to figure out a new
    # animation that will behave correctly when an old animation is interrupted. But this
    # should be rare, and once the animations are over the petals will be in a correct
    # position, so this should not be a large issue.

    # Interrupt all existing petal animations
    @innerContainer.selectAll ".petalLayer.#{d.source}"
      .interrupt()
    @animationState.interrupt d.source


    # If we have a sign change between the old value and the new, we schedule an animation
    # to first collapse all the petals to the baseline, and schedule another call to this
    # function (which will then animate petal layers from baseline to final positions)
    dataViewValue = @animationState.attr "data-view-value-#{d.source}"
    if (d.value < 0 and dataViewValue > 0) or (d.value > 0 and dataViewValue < 0)
      @animationState.attr "data-view-value-#{d.source}", 0

      # After this collapse animation, we want to sequence the petal extension animations.
      # The idiomatic way to do this in D3 is with .each(), but because of the per-element
      # logic we perform later to set up petal layer timing, this doesn't work for us.
      # Instead, we use promises to trigger one callback when all of the petal layer
      # animations have completed.

      collapsePromises = Constants.petalLayers.map (petalLayer) =>
        new Promise (resolve) =>
          ###
          TODO: Theoretically, this duration is a problem. All petal transitions need to complete in the span of one timeline tick, given by Constants.viz5timelineDuration. This collapse animation and the petal extension animation should both complete within this span of time. Not sure if this is actually an issue in practice.
          ###
          @innerContainer.select ".petalLayer.#{petalLayer.class}.#{d.source}"
            .transition()
            .ease (t) ->
              # I don't know why, but D3 will call this with t > 1
              # We need to clamp it at 1 to prevent serious graphical glitches
              t = 1 if t > 1
              d3Ease.easePolyOut t, 6
            .duration Constants.viz5CollapseToBaselineDuration
            .attr
              d: @petalPath 0, Constants.viz5RoseData[d.source].startAngle, petalLayer
            .each 'end', resolve


      Promise.all collapsePromises
        .then =>
          @animatePetalLayers d
      return


    # At this point we know: the value we're currently representing, the value we need to
    # animate to, and we know that both of these values have the same sign.
    # We need to find out: the direction of the animation (elongating/adding layers or
    # shrinking/removing layers) and which layers are affected. Then we can schedule
    # the animations.

    # As before, work with absolute values to deduplicate this logic
    absStartValue = Math.abs dataViewValue
    absEndValue = Math.abs d.value

    # Determine the layers affected by this transition
    startLayer = Math.floor absStartValue / Constants.roseRadiusCap
    endLayer = Math.floor absEndValue / Constants.roseRadiusCap

    startLayer = Math.min startLayer, 3
    endLayer = Math.min endLayer, 3

    affectedLayers = []
    for layer in [startLayer..endLayer]
      affectedLayers.push layer
    # affectedLayers now contains the set of affected layers ids, in the order in which
    # they should be animated.


    # Petal animations
    duration = Constants.viz5timelineDuration / affectedLayers.length

    for layer, index in affectedLayers
      petalLayer = Constants.petalLayers[layer]
      @innerContainer.selectAll ".petalLayer.#{petalLayer.class}.#{d.source}"
        .transition()
        .ease (t) ->
          # I don't know why, but D3 will call this with t > 1
          # We need to clamp it at 1 to prevent serious graphical glitches
          t = 1 if t > 1
          d3Ease.easePolyOut t, 6
        .delay index * duration
        .duration duration
        .attr
          d: @petalPath d.value, Constants.viz5RoseData[d.source].startAngle, petalLayer

    # Data value animation
    @animationState.transition d.source
      .duration Constants.viz5timelineDuration
      .attr "data-view-value-#{d.source}", d.value


    # The above animations cover all of the elements which are affected by the change from
    # the old value to the new value. E.g., if the user triggers an animation that results
    # in layer 2 extending to its cap and layer 3 appearing for one source, the above will
    # handle it. But, the user can interrupt animations at any time by choosing new data
    # values. In the example above, we have not animated layers 1 and 4, but we are not
    # guaranteed that they are in the state we would expect them to be in (i.e. layer 1
    # extended to its cap and layer 4 not shown / collapsed at the baseline.)

    # Since we aim to guarantee that all of the elements this function manages are in a
    # correct state by the end of the animation, we also schedule animations for all of
    # the other layers to where they should be, just in case.
    # We do this in a separate section here, because these non-affected layers should
    # not have their animations scheduled in sequence with the 'real' animations above.

    nonAffectedLayers = _.difference [0, 1, 2, 3], affectedLayers

    for layer in nonAffectedLayers
      petalLayer = Constants.petalLayers[layer]
      @innerContainer.select ".petalLayer.#{petalLayer.class}.#{d.source}"
        .transition()
        .duration Constants.viz5timelineDuration
        .attr
          d: @petalPath d.value, Constants.viz5RoseData[d.source].startAngle, petalLayer




  # Produce a string for use as the definition of a path element, which includes a petal
  # and thorn. The petal is always drawn as a 1/6 section of a circle.
  #   rawValue: a number, positive or negative, the percentage change in this attribute
  #   startAngle: a number, in radians, rotation from the x axis clockwise.
  #   petalLayer: one of the objects in Constants.petalLayers
  petalPath: (rawValue, startAngle, petalLayer) ->

    #### First part: compute how large the petal and thorn are

    # Each petal layer is responsible for rendering values in a certain range.
    # There are three cases:
    # 1 The value exceeds the range of this layer: render the petal at maximum size with
    #   no thorn.
    # 2 The value falls within the range this layer is responsible for: render the petal
    #   at part of its full length, with a thorn
    # 3 The value is too small to reach this layer: we render nothing

    # To avoid repeating ourselves, we do all the math as though the value were positive,
    # and flip the sign if needed at the end.
    # NB also: Math.floor with negative numbers behaves in a way some find unexpected
    # e.g. Math.floor(1.5) === 1 but Math.floor(-1.5) === -2

    absValue = Math.abs rawValue

    # This is the petal layer which handles case 2 above
    partialLayer = Math.floor (absValue / Constants.roseRadiusCap)

    # In all cases, we begin with the petal distance set at the baseline, which if used
    # to draw a path would result in a petal with zero size.
    petalDistance = Constants.roseBaselineCircleRadius

    if petalLayer.layer < partialLayer
      # Draw this petal at full size with no thorn
      if rawValue > 0
        petalDistance += Constants.roseRadiusCap
      else
        petalDistance -= Constants.roseRadiusCap
      capped = true
      thorn = false

    else if petalLayer.layer == partialLayer
      # Draw this petal at partial size, with thorn
      value = absValue - petalLayer.layer * Constants.roseRadiusCap
      if rawValue > 0
        petalDistance += value
      else
        petalDistance -= value
      capped = false
      thorn = true

    else if petalLayer.layer > partialLayer
      # Don't draw this petal layer or thorn
      capped = false
      thorn = false


    # Special handling for the first layer thorn: we always want there to be one thorn,
    # but when the data is at zero, no petal layers or thorns would be drawn.
    if petalLayer.layer == 0 and rawValue == 0
      thorn = true

    # Special handling for the first layer: if this layer is at maximum value, we extend
    # the petal just a little bit, so that the base colour of the petal remains visible
    # alongside the darker petal layers.
    if petalLayer.layer == 0 and capped
      if rawValue > 0
        petalDistance += Constants.petalCapOverhang
      else
        petalDistance -= Constants.petalCapOverhang


    if not thorn
      thornDistance = petalDistance
    else if rawValue < 0
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

    # In practice, this means that 'absent' layers are actually rendered as extremely
    # tiny petals, which are hidden by the baseline stroke, as it is layered above them.



    #### Second part: compute points for the petal's path and the path string

    # A petal is composed of an outer arc, which is broken in two by a thorn (a triangular
    # point) in the middle, and an unbroken inner arc. The inner arc always lies along
    # the baseline circle of the rose, the outer arc may be closer to the origin or more
    # distant (i.e. greater or lower radius) from the baseline depending on its data
    # value.

    finalAngle = startAngle + Math.PI * 1 / 3

    thornAngle = startAngle + Math.PI * 1 / 6

    thornAngularWidth = Math.acos (Math.sqrt(petalDistance * petalDistance - Constants.thornWidth / 2 * Constants.thornWidth / 2) / petalDistance)
    thornBaseStartAngle = thornAngle - thornAngularWidth
    thornBaseEndAngle = thornAngle + thornAngularWidth


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

  setClickHandler: (handler) ->
    @options.clickHandler = handler if typeof handler == 'function' or handler == null

  setPillSize: (size) ->
    @options.pillSize = size if size == 'large' or size == 'small'

  setShowPillsAfterTransition: (show) ->
    @options.showPillsAfterTransition = show

  setRemovePillsBeforeTransition: (remove) ->
    @options.removePillsBeforeTransition = remove

  teardown: ->
    @tornDown = true

    # Apply an animation to the rose as it is removed
    containerOffset = Constants.roseSize / 2 * @options.scale
    @container
      .transition()
      .duration Constants.viz5timelineDuration
      .attr
        transform: "translate(#{@options.position.x + containerOffset}, #{@options.position.y + containerOffset}) scale(0, 0)"
      .each 'end', =>
        @container.remove()

    @removePills()


  showPills: ->
    return if @pillsDisplayed
    @pillsDisplayed = true

    # We use the order randomization to mix up the staggered arrival of the pills
    data = _.shuffle @options.data


    for item, i in data
      switch Platform.name
        when 'browser'
          shadowPillBounds = @shadowPills[item.source][0][0].getBoundingClientRect()
        when 'server'
          shadowPillBounds = @generateServerSideShadowPositions item.source

      rosePill = new RosePill @app,
        data: item
        clickHandler: @options.pillClickHandler
        rosePillTemplate: @options.rosePillTemplate
        shadowPillBounds: shadowPillBounds
        size: @options.pillSize
      rosePill.render
        wait: i * @app.pillAnimationDuration
      @rosePills[item.source] = rosePill

    if @options.isFirstRun and @options.showPopoverOnFirstRun

      window.setTimeout =>
        return if @tornDown
        @options.showPopoverCallback @
      , 9 * @app.pillAnimationDuration

    @options.isFirstRun = false


  generateServerSideShadowPositions: (source) ->
    roseCentre = Constants.viz5ServerSideRosePositions["#{@options.rosePosition}Rose"]
    angle = Constants.viz5RoseData[source].startAngle + Math.PI / 6

    return {
      left: roseCentre.left + Constants.viz5ServerSideRoseSize / 2 * Math.cos angle
      top: roseCentre.top + Constants.viz5ServerSideRoseSize / 2 * Math.sin angle
    }




  removePills: ->
    return unless @pillsDisplayed
    @pillsDisplayed = false

    for source in Constants.viz5SourcesInOrder
      @rosePills[source].teardown()
      @rosePills[source] = null


module.exports = Rose