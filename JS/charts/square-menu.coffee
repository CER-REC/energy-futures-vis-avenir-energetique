basicMenu = require './basic-menu.coffee'
_ = require 'lodash'
d3 = require 'd3'
Tr = require '../TranslationTable.coffee'

class squareMenu extends basicMenu
  # Cause coffeescript. Want "local" variables
  questionMarkHeight = 23
  squareMenuDefaults:
    canDrag: true
    hasChart: true
    chart: null
    boxSize: 30
    iconSpacing: 'auto' #This just makes them fit within the height
    addAllSquare: true
    allSelected: true
    someSelected: false
    boxCount:
      "#powerSourceMenuSVG": 7
      "#provinceMenuSVG": 14
    boxesOffset: 46
    allSquareHandler: -> #Method that runs on 'All' button clicked
    orderChangedHandler: -> #Method that runs when draggin finished
    showHelpHandler: -> #Method that runs when the questionMark icon is clicked

  constructor: (@app, parent, options = {}) ->
    @options = _.extend {}, @squareMenuDefaults, options
    
    #defaults
    @_iconSpacing = @options.iconSpacing
    @_allSelected = @options.allSelected
    @_someSelected  = @options.someSelected
    @_hasChart = @options.hasChart
    @_canDrag = @options.canDrag
    if @_canDrag then @lineHeight = questionMarkHeight else @lineHeight = 0 #The line behind draggable menus
    @_boxSize = @options.boxSize

    #handlers
    @_addAllSquare = @options.addAllSquare
    @_allSquareHandler = @options.allSquareHandler
    @_orderChangedHandler = @options.orderChangedHandler
    @_showHelpHandler = @options.showHelpHandler

    if @_hasChart then @_chart = @options.chart
    @_drag = d3.behavior.drag()
    
    super(parent, @options)
    
    #drag behaviour
    @yDiff = @getRectY(@mappingLength() - 2) - questionMarkHeight  #The space between the squares 0 and 1 plus the boxes since we want it to go PAST the box
    if @_canDrag
      @_drag.on('dragstart',() => 
        @_chart.dragStart()
        @currentSpot = -1
        @newSpot = -1
        d3.event.sourceEvent.stopPropagation()
      )
      @_drag.on("drag", (d,i) =>
        # bring to front
        @_group.select("#menuRect"+ i).node().parentNode.parentNode.appendChild(@_group.select("#menuRect"+ i).node().parentNode)
        @_group.select("#menuRect"+ i).attr("transform", (d,i) ->
            "translate(0, #{d3.event.y})"
        )
        if !(@currentSpot?) or (@currentSpot == -1) then @currentSpot = i
        @newSpot = i - Math.round((d3.event.y -  (d3.event.y % @yDiff)) / @yDiff)
        if @newSpot < 0 then @newSpot = 0
        if @newSpot > (@_chart.mapping().length) - 1 then @newSpot = (@_chart.mapping().length) - 1
        if @newSpot != @currentSpot
          if @newSpot > @currentSpot then @direction = 1 else @direction = -1

          # Computes the index of the button to be dragged, and the movement offset (distance).
          newpos = @newSpot
          n = @squareMenuDefaults.boxCount[@options.selector]
          distance = ((@options.size.h - @squareMenuDefaults.boxesOffset - (@options.boxSize*n))/(n - 1) + @options.boxSize) * @direction

          # Check whether or not the current drag event is continuing in the same direction as before. If it is not, 
          # check if the drag had passed the original starting position, or reverse the direction of movement otherwise. 
          if @_lastDirection? && @_lastDirection != 0 && @_lastDirection != @direction
            if(newpos - @direction != i)
              newpos -= @direction
              distance = 2 * @direction
            else
              @_lastDirection = @direction
          else
            @_lastDirection = @direction

          @_group.select("#menuRect"+ newpos).attr("transform", (d,i) ->
              "translate(0, #{distance})"
          )

          @_orderChangedHandler(@newSpot, @currentSpot)
          @currentSpot = @newSpot
          @_chart.dragEnd()

      )
      @_drag.on("dragend", (d, i) =>
        @_lastDirection = 0
        @_chart.dragEnd()
        if @newSpot > -1 #Drag end gets called on click thiw just prevents it from rerunning the last move
          @_orderChangedHandler(@newSpot, @currentSpot)
          @newSpot = null
          @redraw()
          @currentSpot = -1
          @newSpot = -1
      )
    @redraw()

  setHelpHandler: (handler) ->
    @_showHelpHandler = handler

  # Get the center
  getRectX: () =>
    @_position.x + (@_size.w/ 2 - @_boxSize/2)

  # Read the comments this is kind of complicated. We space them equally then divide up the top and bottom space in 
  # 'auto' mode. Otherwise we use a numerical spacing
  getRectY: (i) =>
    if @_iconSpacing == 'auto'
      #divide into equal portions
      equalSlice = @usableHeight() / @mappingLength()
      #calculate the empty space left in between
      spaceBetween = equalSlice - @_boxSize
      #distribute  the space from the top and bottom into the spaced inbetween so the top and bottom land where they should
      distributedSpaceBetween = spaceBetween + (spaceBetween / (@mappingLength() - 1))
      # Subtract the square at the bottom 
      #using length - (i+1) to build bottom up: 
      (@mappingLength() - (i + 1)) * (@_boxSize + distributedSpaceBetween) + questionMarkHeight 
    else
      (@mappingLength() - (i + 1)) * (@_iconSpacing + @_boxSize) + questionMarkHeight

  setIconSpacing: (spacing) ->
    @_iconSpacing = spacing
    @redraw()

  getIconSpacing: ->
    if @_iconSpacing != 'auto' then return @_iconSpacing
    @getRectY(@mappingLength() - 2) - @_boxSize - questionMarkHeight

  usableHeight : ->
    #The 2 is because the stroke width is otherwise cut off
    @_size.h - @lineHeight - 2 - questionMarkHeight 

  mapping: () ->
    if @_hasChart then @_chart.mapping() else @_data

  mappingLength: ->
    if @_addAllSquare then (@mapping().length + 1) else @mapping().length

  allSelected: (allSelected) ->
    @_allSelected = allSelected

  someSelected: (someSelected) ->
    @_someSelected = someSelected

  moveMenu: (newParent) ->
    @_parent.selectAll("##{@options.groupId}").remove()
    @parent(d3.select(newParent), @options.groupId)
    @size({w:newParent.getBoundingClientRect().width, h:@size().h})
    @resize()
    @redraw()

  redraw: ->
    @_group.selectAll('.menuItem').remove()
    @_group.selectAll('.menuSquare').remove()
    @_group.selectAll('.menuLineBehind').remove()
    @_group.selectAll('.selectAllGroup').remove()
    if @_canDrag  
      @_group.append 'line'
        .attr
          class: 'menuLineBehind'
          stroke: '#333333'
          x1: "#{@_position.x + (@_size.w/ 2)}px"        
          x2: "#{@_position.x + (@_size.w/ 2)}px"
          y1: "0px"
          y2: "#{@getRectY(0) + @_boxSize + @lineHeight}px"
      
      @_group.append 'rect'
        .attr
          class: 'menuLineBehind'
          fill: '#333333'
          id: 'bottomRect'
          x: "#{@_position.x + (@_size.w/ 2)  - 3.5}px"    
          y: "#{@getRectY(0) + @_boxSize + @lineHeight - 7}px"
          width: '7px'
          height: '7px' 
        .style
          stroke: '#333333'
          'stroke-width': 1

    @_group.append "image"
      .attr
        class:  'menuLineBehind pointerCursor'
        "xlink:href":   'IMG/large_qmark.svg'
        x: "#{@_position.x + (@_size.w/ 2)  - 8}px"
        width: "16px"
        height: "16px"
      .on "click", =>
        @_showHelpHandler()

    @_group.selectAll('.menuItem').data(@mapping()).enter().append('g').attr
      class: 'menuItem'
      transform: (d, i) =>
        "translate(#{@getRectX()}, #{@getRectY(i)})"

    @_group.selectAll '.menuItem'
      .append "image"
        .attr
          class: 'pointerCursor'
          id: (d, i) ->
            "menuRect" + i
          "xlink:href":   (d) -> d.img
          x: '0px'
          width: @_boxSize
          height: @_boxSize
        .on 'click', (d, i) =>  
          if (d3.event.defaultPrevented) 
            return
          @selection d.key, i
        .call @_drag
        .append('title').text (d, i) ->
          d.tooltip
      
    if @_addAllSquare
      squareGroup = @_group.append 'g'
        .attr
          class: 'selectAllGroup pointerCursor'
          transform: =>
            "translate(#{@getRectX()}, #{@getRectY(@mapping().length)})"

      squareGroup.append "image"
        .attr
          class: 'pointerCursor'
          "xlink:href":  (d) =>
            if @_someSelected
              Tr.allSelectorButton.someSelected[@app.language]
            else 
              if @_allSelected then Tr.allSelectorButton.all[@app.language] else Tr.allSelectorButton.none[@app.language]
          x: '0px'
          width: @_boxSize
          height: @_boxSize
        .on "click", () =>
          @_allSelected = !@_allSelected
          @_allSquareHandler(@_allSelected)
          @redraw()


module.exports = squareMenu