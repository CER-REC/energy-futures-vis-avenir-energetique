d3 = require 'd3'
chart =  require './chart.coffee'
squareMenu = require './square-menu.coffee'
_ = require 'lodash'

root = exports ? this

class bubbleChart extends chart
  bubbleChartDefaults:
    mapping: []
    menuParent: "#powerSourceMenuSVG"
    menuOptions: 
      canDrag: false

  constructor: (parent, options = {}) ->

    root.tooltip = d3.select("body")
      .append("div")
      .attr(
        id: "tooltip"
        class: "chartTooltip"
      )
      .text("")

    @options = _.extend {}, @bubbleChartDefaults, options
    @_mapping = @options.mapping
    @_year = @options.year
    super(parent, @options)
    @options.menuOptions.chart = this
    @menu = new squareMenu(@options.menuParent, @options.menuOptions)
    @redraw()

  year: (d) ->
    if !arguments.length
      return @_year
    @_year = d

  data: (d) ->
    if !arguments.length
      return @_data
    @_data = d
    @redraw()

  # unused
  # mappingAsObject: ->
  #   @_mapping

  mapping: (mapping) ->
    if !arguments.length
      return _.values(@_mapping)
    @_mapping = mapping
    @menu.redraw()

  bubble: (data) ->
    d3.layout.pack()
      .size([@size().w, @_size.h])
      .padding(1)
      .value((d) -> d.size)
      .sort(null) #We need this since default sort is ascending... but null sort is tree


  redraw: -> 
    if !(@force?)
      @force = d3.layout.force()
        .gravity(0.0)
        .friction(0.4)
        .charge((d, i) ->  -1*d.r)
        .size([@size().w, @_size.h])
        .alpha(0.1)
    
    @_group.selectAll("title").remove()
    @_group.selectAll(".toolTip").remove()

    node = @_group.selectAll('.node')
      .data(@bubble().nodes(@_data), (d) -> d.name)
      .on "mouseover", (d) =>
        if(d.depth == 2)
          document.getElementById("tooltip").style.visibility = "visible"
          document.getElementById("tooltip").style.top = (d3.event.pageY-10) + "px"
          document.getElementById("tooltip").style.left = (d3.event.pageX+10) + "px"
          document.getElementById("tooltip").innerHTML = d.name + " (" + @_year + "): "+ d.size.toFixed(2)

      .on "mousemove", (d) =>
        if(d.depth == 2)
          document.getElementById("tooltip").style.top = (d3.event.pageY-10) + "px"
          document.getElementById("tooltip").style.left = (d3.event.pageX+10) + "px"
          document.getElementById("tooltip").innerHTML = d.name + " (" + @_year + "): "+ d.size.toFixed(2)

      .on "mouseout", (d) =>
        document.getElementById("tooltip").style.visibility = "hidden"

    enterSelection = node.enter().append('g')
      .attr
        class: 'node'
        transform: (d, i) =>
          if !(isNaN(d.x) or isNaN(d.y))
            "translate(#{d.x},#{d.y})"
          else
            "translate(0,0)"

    enterSelection.append('circle')
      .attr
        r: (d, i) => 
          0
      .style(
        fill: (d, i) =>
          if @_mapping[d.source] then @_mapping[d.source].colour else 'none'
        'fill-opacity': 0.8
        stroke :  (d) -> if d.depth == 0 then 'none' else '#333333'
        'stroke-width': (d) =>
          if @_mapping[d.source] or d.depth == 0  or (d.depth ==1 and !(d.children)) then 0 else 1
        )


    enterSelection.filter((d) -> d.depth == 1 ).append('g')
          
    enterSelection.select('g').append('image')

    node.filter((d) -> d.depth == 2 ).select('circle').on 'click', (d, i) ->
      if d3.selectAll(".toolTip#{d.id}").empty() 
        this.parentNode.parentNode.appendChild(this.parentNode) #bring to front
        d3.select(this.parentNode).append('text')
          .attr
            class: "toolTip toolTip#{d.id}"
            x: -(d.r/2) + 2 #padding
            dy: "1em"
            stroke: '#333333'
            'font-size': 14
          .style  
            'font-family': 'Avenir Next Condensed, Arial Narrow, Arial, Verdana, sans-serif'
          .text =>
            "#{d.name}: #{d3.format('.3f')(d.size)}"
        
        d3.select(this.parentNode).insert("rect","text")
          .attr
            class: "toolTip toolTip#{d.id}"
            x: -(d.r/2)
            y: 0
            width: (d) ->  d3.select("text.toolTip#{d.id}").node().getBoundingClientRect().width + 4 #padding
            height: (d) -> d3.select("text.toolTip#{d.id}").node().getBoundingClientRect().height
          .style
            fill: "#ffffff"
            'stroke-width': 1
            stroke: '#333333'

      else
        d3.selectAll(".toolTip#{d.id}").remove()


    node.select('g').select('image')  
      .attr(
        "xlink:href": (d) -> if d.img then d.img
        x: 0
        width: 25
        height: 25)

    exitSelection = node.exit()

    exitSelection.selectAll('circle')
      .transition()
        .attr
          r: (d) ->
            0
        .duration @_duration
        .ease "linear"
      .remove()

    exitSelection.remove()

    regionNodes = []
    node.each (d) -> 
        if (d.depth == 1) 
          d.px = d.x0 = d.x
          d.py = d.y0 = d.y
          regionNodes.push(d)
            
    @force.nodes(regionNodes)
    @force.start()
    @force.on "tick", (e) =>
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

        regionNodes.forEach (o, i) =>
          f = k 
          dx = if o.x < o.r then (o.r-o.x) else (if o.x + o.r > @_size.w - 30 then ((@_size.w - 30) - (o.x+o.r)) else 0)
          dy = if o.y < o.r then (o.r-o.y) else (if o.y + o.r > @_size.h then (@_size.h - (o.y+o.r)) else 0)
          o.y += dy*f
          o.x += dx*f

        #Do collision detection
        q = d3.geom.quadtree(regionNodes)
        i = 0
        n = regionNodes.length

        while (i < n) 
          q.visit(collide(regionNodes[i]))
          i++

        node.select('circle')
          .transition()
            .attr
              r: (d) =>
                if (@_mapping[d.source] and !(@_mapping[d.source].present)) then 0 else d.r
            .duration e.alpha * 10000 #this makes the transitions more linear
            .ease "linear"

        node.select('g')
          .transition()  
            .attr
              transform: (d) ->
                dst = d.r * 0.807 + 5;
                "translate(#{dst},#{(-dst)})"
            .duration e.alpha * 10000
            .ease "linear"

        node.transition()
          .duration 10000 * e.alpha
          .attr
            transform: (d) ->
              if d.depth == 0 then return "translate(#{d.x},#{d.y})" 
              if d.children then return "translate(#{d.x},#{d.y})" 
              parent = d.parent
              dx = parent.x - parent.x0
              dy = parent.y - parent.y0
              "translate(#{d.x + dx},#{d.y + dy})"  
          .ease "linear"  

    this



module.exports = bubbleChart