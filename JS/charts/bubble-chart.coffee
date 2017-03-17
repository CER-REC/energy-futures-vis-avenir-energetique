d3 = require 'd3'
_ = require 'lodash'

chart =  require './chart.coffee'
squareMenu = require './square-menu.coffee'
Platform = require '../Platform.coffee'

class BubbleChart extends chart
  bubbleChartDefaults:
    mapping: []
    menuParent: '#powerSourceMenuSVG'
    menuOptions:
      canDrag: false


  constructor: (@app, parent, options = {}) ->

    @setup_input_events()
    @options = _.extend {}, @bubbleChartDefaults, options
    @_mapping = @options.mapping
    @_year = @options.year

    # super(parent, @options)
    @chart_options = _.extend {}, @chart_defaults, @options
    @_duration = @chart_options.duration
    @parent parent, @chart_options.groupId
    @_size =
      w : @chart_options.size.w
      h : @chart_options.size.h
    @_position =
      x : @chart_options.position.x
      y : @chart_options.position.y
    @_data = @options.data
    @resize()


    @options.menuOptions.chart = this
    @menu = new squareMenu @app, @options.menuParent, @options.menuOptions
    @redraw()

  filteredData: (currentData) ->
    for i in [0...currentData.children.length]
      if currentData.children[i].children?
        if currentData.children[i].children.filter((d) -> d.size != 1).length > 0
          currentData.children[i].children = currentData.children[i].children.filter((d) -> d.size != 1)
    currentData

  year: (d) ->
    if !arguments.length
      return @_year
    @_year = d

  data: (d) ->
    if !arguments.length
      return @_data
    @_data = d
    @redraw()

  mapping: (mapping) ->
    if !arguments.length
      return _.values @_mapping
    @_mapping = mapping
    @menu.redraw()

  bubble: ->
    d3.layout.pack()
      .size [@size().w, @_size.h]
      .padding 1
      .value (d) -> d.size
      .sort null # We need this since default sort is ascending... but null sort is tree


  # Depending on the version of Internet Explorer/Edge, there are three different APIs
  # that we may wish to listen to for input.
  # This is necessary for improved touch handling on Surface/touch devices.
  # It's important to only listen to one of them, otherwise multiple events will be
  # dispatched.
  setup_input_events: ->
    # IE > 11
    if @app.window.PointerEvent
      @mouseover_event_name = 'pointerover'
      @mousemove_event_name = 'pointermove'
      @mouseout_event_name = 'pointerleave'
      @click_event_name = 'pointerup'

    # IE = 10
    else if @app.window.MSPointerEvent
      @mouseover_event_name = 'MSPointerOver'
      @mousemove_event_name = 'MSPointerHover'
      @mouseout_event_name = 'MSPointerOut'
      @click_event_name = 'MSPointerUp'

    # All other browsers
    else
      @mouseover_event_name = 'mouseover'
      @mousemove_event_name = 'mousemove'
      @mouseout_event_name = 'mouseout'
      @click_event_name = 'click'
    


  redraw: ->
    if !(@force?)
      @force = d3.layout.force()
        .gravity 0.0
        .friction 0.4
        .charge (d) -> -1 * d.r
        .size [@size().w, @_size.h]
        .alpha 0.1
    
    @_group.selectAll('title').remove()
    @_group.selectAll('.toolTip').remove()

    node = @_group.selectAll('.node')
      .data @bubble().nodes(@filteredData(@_data)), (d) -> d.name

    enterSelection = node.enter().append('g')
      .attr
        class: 'node'
        transform: (d) ->
          if !(isNaN(d.x) or isNaN(d.y))
            "translate(#{d.x},#{d.y})"
          else
            'translate(0,0)'

    enterSelection.append('circle')
      .attr
        r: 0
      .style
        fill: (d) =>
          if @_mapping[d.source] then @_mapping[d.source].colour else 'none'
        'fill-opacity': 0.8
        stroke: (d) -> if d.depth == 0 then 'none' else '#333333'
        'stroke-width': (d) =>
          if @_mapping[d.source] or d.depth == 0  or (d.depth == 1 and !(d.children)) then 0 else 1
        

    node.filter (d) -> d.depth == 2
      .select 'circle'

      .on @mouseover_event_name, (d) =>
        document.getElementById('tooltip').style.visibility = 'visible'
        document.getElementById('tooltip').style.top = (d3.event.pageY - 10) + 'px'
        document.getElementById('tooltip').style.left = (d3.event.pageX + 10) + 'px'
        document.getElementById('tooltip').innerHTML = "#{d.name} (#{@_year}): #{d.size.toFixed(2)}"

      .on @mousemove_event_name, (d) =>
        document.getElementById('tooltip').style.top = (d3.event.pageY - 10) + 'px'
        document.getElementById('tooltip').style.left = (d3.event.pageX + 10) + 'px'
        document.getElementById('tooltip').innerHTML = "#{d.name} (#{@_year}): #{d.size.toFixed(2)}"

      .on @mouseout_event_name, ->
        document.getElementById('tooltip').style.visibility = 'hidden'

    enterSelection.filter((d) -> d.depth == 1 ).append 'g'
          
    enterSelection.select('g').append 'image'

    handlePopover = (d) ->
      # d3.event.preventDefault()
      # d3.event.stopPropagation()
      if d3.selectAll(".toolTip#{d.id}").empty()
        this.parentNode.parentNode.appendChild this.parentNode #bring to front
        d3.select(this.parentNode).append('text')
          .attr
            class: "toolTip toolTip#{d.id}"
            x: -(d.r / 2) + 2 #padding
            dy: '1em'
            stroke: '#333333'
            'font-size': 14
          .style
            'font-family': 'Avenir Next Condensed, Arial Narrow, Arial, Verdana, sans-serif'
          .text ->
            "#{d.name}: #{d3.format('.3f')(d.size)}"
        
        d3.select(this.parentNode).insert 'rect', 'text'
          .attr
            class: "toolTip toolTip#{d.id}"
            x: -(d.r / 2)
            y: 0
            width: (d) -> d3.select("text.toolTip#{d.id}").node().getBoundingClientRect().width + 4 #padding
            height: (d) -> d3.select("text.toolTip#{d.id}").node().getBoundingClientRect().height
          .style
            fill: '#ffffff'
            'stroke-width': 1
            stroke: '#333333'



      else
        d3.selectAll(".toolTip#{d.id}").remove()

      # Special hack for IE/Edge: the click/pointer events always trigger 'mouseover'
      # even when the event was triggered by touch. We want to hide the hover tooltip,
      # otherwise the click popover and the hover tooltip both appear.
      # Not necessary for iOS/Android, the touch API lets us prevent click/mouseover
      # events entirely.
      document.getElementById('tooltip').style.visibility = 'hidden'

    node.filter((d) -> d.depth == 2 )
      .select('circle')
      .on @click_event_name, (d) ->
        handlePopover.call @, d

      .on 'touchstart', ->
        d3.event.preventDefault()

      .on 'touchmove', ->
        d3.event.preventDefault()

      .on 'touchend', (d) ->
        d3.event.preventDefault()
        handlePopover.call @, d

      .on 'touchcancel', ->
        d3.event.preventDefault()


    node.select('g').select('image')
      .attr
        # TODO: The extra 'xlink:' is a workaround to an issue with JSDOM.
        # Remove when resolved.
        # https://github.com/tmpvar/jsdom/issues/1624
        'xlink:xlink:href': (d) -> if d.img then d.img
        x: 0
        width: 25
        height: 25

    exitSelection = node.exit()

    exitSelection.selectAll('circle')
      .transition()
        .attr
          r: 0
        .duration @_duration
        .ease 'linear'
      .remove()

    exitSelection.remove()

    regionNodes = []
    node.each (d) ->
      if d.depth == 1
        d.px = d.x0 = d.x
        d.py = d.y0 = d.y
        regionNodes.push d
            
    @force.nodes regionNodes
    @force.start()
    @force.on 'tick', (e) =>
      #  The collision relaxation procedure
      collide = (node) ->
        r = node.r + 16
        nx1 = node.x - r
        nx2 = node.x + r
        ny1 = node.y - r
        ny2 = node.y + r
        (quad, x1, y1, x2, y2) ->
          if (quad.point and (quad.point != node))
            x = node.x - quad.point.x
            y = node.y - quad.point.y
            l = Math.sqrt(x * x + y * y)
            r = node.r + quad.point.r + 32
            if (l < r)
              l = (l - r) / l * .5
              x *= l
              y *= l
              node.x -= x
              node.y -= y
              quad.point.x += x
              quad.point.y += y
          x1 > nx2 or x2 < nx1 or y1 > ny2 or y2 < ny1

      # Push nodes away from the borders include the size of the image/rectangle
      k = 6 * e.alpha

      regionNodes.forEach (o) =>
        f = k
        dx = if o.x < o.r then (o.r - o.x) else (if o.x + o.r > @_size.w - 30 then ((@_size.w - 30) - (o.x + o.r)) else 0)
        dy = if o.y < o.r then (o.r - o.y) else (if o.y + o.r > @_size.h then (@_size.h - (o.y + o.r)) else 0)
        o.y += dy * f
        o.x += dx * f

      #Do collision detection
      q = d3.geom.quadtree regionNodes
      i = 0
      n = regionNodes.length

      while i < n
        q.visit collide(regionNodes[i])
        i++




      circle_radius_function = (d) =>
        if (@_mapping[d.source] and !(@_mapping[d.source].present)) then 0 else d.r

      group_transform_function = (d) ->
        dst = d.r * 0.807 + 5
        "translate(#{dst},#{(-dst)})"

      node_transform_function = (d) ->
        if d.depth == 0 then return "translate(#{d.x},#{d.y})"
        if d.children then return "translate(#{d.x},#{d.y})"
        parent = d.parent
        dx = parent.x - parent.x0
        dy = parent.y - parent.y0
        "translate(#{d.x + dx},#{d.y + dy})"

      if Platform.name == 'server'
        # On server, we need to avoid scheduling bubble animations entirely for
        # compatibility with jsdom. D3 uses a part of the SVG spec that is not
        # implemented in jsdom, which results in a crash when we try to run animations
        # of any length on the server.
        
        node.select('circle')
          .attr
            r: circle_radius_function

        node.select('g')
          .attr
            transform: group_transform_function

        node.attr
          transform: node_transform_function
      
      else if Platform.name == 'browser'
        node.select('circle')
          .transition()
            .duration e.alpha * 10000 #this makes the transitions more linear
            .ease 'linear'
            .attr
              r: circle_radius_function

        node.select('g')
          .transition()
            .duration e.alpha * 10000
            .ease 'linear'
            .attr
              transform: group_transform_function

        node.transition()
          .duration e.alpha * 10000
          .ease 'linear'
          .attr
            transform: node_transform_function

    # For server side rendering, we set animation duration to 0. We still need to produce
    # an acceptable bubble graph layout, without actually running the animation.
    # Run 100 'ticks' worth of force iterations, all at once.
    if Platform.name == 'server'
      for i in [0..100]
        @force.tick
          alpha: 0.05
      @force.stop()

    this



module.exports = BubbleChart