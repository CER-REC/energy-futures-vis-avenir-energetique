_ = require 'lodash'
d3 = require 'd3'

Constants = require '../Constants.coffee'


# Temporary clone of SquareMenu, to allow refactoring its use in viz3 without affecting
# the other visualizations immediately

class SquareMenu2

  defaultOptions:
    canDrag: true
    boxSize: 30
    groupId: 'sChart'
    addAllSquare: true
    duration: Constants.animationDuration
    
    # coffeelint: disable=no_empty_functions
    onSelected: ->
    allSquareHandler: -> # Method that runs on 'All' button clicked
    orderChangedHandler: -> # Method that runs when dragging finished
    showHelpHandler: -> # Method that runs when the questionMark icon is clicked
    getAllIcon: -> # Called to determine what image to use for the 'all' icon
    # coffeelint: enable=no_empty_functions

    # TODO: I definitely don't belong here ...
    boxCount:
      '#powerSourceMenuSVG': 7
      '#provinceMenuSVG': 14

  defaultState:
    iconSpacing: 'auto' # When set to auto, we compute the icon spacings
    size:
      w: 200
      h: 300
    position:
      x: 0
      y: 0
    data: []

  constructor: (@app, options = {}, state = {}) ->
    @options = _.extend {}, @defaultOptions, options
    @state = _.extend {}, @defaultState, state
    
    # defaults
    @_canDrag = @options.canDrag
    @_boxSize = @options.boxSize
    @groupId = @options.groupId
    @_addAllSquare = @options.addAllSquare
    @_duration = @options.duration

    # handlers
    @_onSelected = @options.onSelected
    @_allSquareHandler = @options.allSquareHandler
    @_orderChangedHandler = @options.orderChangedHandler
    @_showHelpHandler = @options.showHelpHandler
    @getAllIcon = @options.getAllIcon

    # @_drag = d3.behavior.drag()
    
    @parent = d3.select @app.window.document
      .select @options.parentId
    @parent.append 'svg:g'
      .attr
        id: @options.groupId
    @_group = d3.select @app.window.document
      .select "##{@groupId}"


    # Initial state setup

    @_iconSpacing = @state.iconSpacing

    @_size =
      w: @state.size.w
      h: @state.size.h
    @_position =
      x: @state.position.x
      y: @state.position.y
    @data @state.data

    # @resize()

    @redraw()




    # TODO: Temporarily commenting drag functionality ...

    # # drag behaviour
    # @yDiff = @getRectY(@itemCount() - 2) - Constants.questionMarkHeight
    # # The space between the squares 0 and 1 plus the boxes since we want it to go PAST
    # # the box
    # if @_canDrag
    #   @_drag.on 'dragstart', =>
    #     @_chart.dragStart()
    #     @currentSpot = -1
    #     @newSpot = -1
    #     d3.event.sourceEvent.stopPropagation()

    #   @_drag.on 'drag', (d,i) =>
    #     # bring to front
    #     @_group.select(".menuRect#{i}").node().parentNode.parentNode.appendChild(@_group.select(".menuRect#{i}").node().parentNode)
    #     @_group.select(".menuRect"+ i).attr 'transform', ->
    #       "translate(0, #{d3.event.y})"

    #     if !(@currentSpot?) or (@currentSpot == -1) then @currentSpot = i
    #     @newSpot = i - Math.round((d3.event.y -  (d3.event.y % @yDiff)) / @yDiff)
    #     if @newSpot < 0 then @newSpot = 0
    #     if @newSpot > (@_chart.mapping().length) - 1 then @newSpot = (@_chart.mapping().length) - 1
    #     if @newSpot != @currentSpot
    #       if @newSpot > @currentSpot then @direction = 1 else @direction = -1

    #       # Computes the index of the button to be dragged, and the movement offset (
    #       # distance).
    #       newpos = @newSpot
    #       n = @defaultOptions.boxCount[@options.selector]
    #       distance = ((@options.size.h - Constants.boxesOffset - (@options.boxSize * n)) / (n - 1) + @options.boxSize) * @direction

    #       # Check whether or not the current drag event is continuing in the same
    #       # direction as before. If it is not,
    #       # check if the drag had passed the original starting position, or reverse the
    #       # direction of movement otherwise.
    #       if @_lastDirection? && @_lastDirection != 0 && @_lastDirection != @direction
    #         if(newpos - @direction != i)
    #           newpos -= @direction
    #           distance = 2 * @direction
    #         else
    #           @_lastDirection = @direction
    #       else
    #         @_lastDirection = @direction

    #       @_group.select(".menuRect#{newpos}").attr 'transform', ->
    #         "translate(0, #{distance})"
          

    #       @_orderChangedHandler @newSpot, @currentSpot
    #       @currentSpot = @newSpot
    #       @_chart.dragEnd()

      
    #   @_drag.on 'dragend', =>
    #     @_lastDirection = 0
    #     @_chart.dragEnd()
    #     # Drag end gets called on click this just prevents it from rerunning the last move
    #     if @newSpot > -1
    #       @_orderChangedHandler @newSpot, @currentSpot
    #       @newSpot = null
    #       @redraw()
    #       @currentSpot = -1
    #       @newSpot = -1
       
    # @redraw()





  # Returns the size withOUT the margins
  size: (s) ->
    if !arguments.length
      return {
        w: @_size.w
        h: @_size.h
      }
    @_size =
      w: s.w
      h: s.h

  # Returns the position withOUT the margins
  position: (pos) ->
    if !arguments.length
      return {
        x: @_position.x
        y: @_position.y
      }
    @_position =
      x: pos.x
      y: pos.y

  data: (d) ->
    if !arguments.length
      return @_data
    @_data = d






  # resize: ->
  #   @_group.attr
  #     transform: "translate(#{@_position.x}, #{@_position.y})"
  #   @

  # Get the center
  getRectX: =>
    @_position.x + (@_size.w / 2 - @_boxSize / 2)

  # Read the comments this is kind of complicated. We space them equally then divide up
  # the top and bottom space in 'auto' mode. Otherwise we use a numerical spacing
  getRectY: (i) =>
    if @_iconSpacing == 'auto'
      # divide into equal portions
      equalSlice = @usableHeight() / @itemCount()
      # calculate the empty space left in between
      spaceBetween = equalSlice - @_boxSize
      # distribute  the space from the top and bottom into the spaced inbetween so the top
      # and bottom land where they should
      distributedSpaceBetween = spaceBetween + (spaceBetween / (@itemCount() - 1))
      # Subtract the square at the bottom
      # using length - (i+1) to build bottom up:
      (@itemCount() - (i + 1)) * (@_boxSize + distributedSpaceBetween) + Constants.questionMarkHeight
    else
      (@itemCount() - (i + 1)) * (@_iconSpacing + @_boxSize) + Constants.questionMarkHeight

  setIconSpacing: (spacing) ->
    @_iconSpacing = spacing
    @redraw()

  getIconSpacing: ->
    if @_iconSpacing != 'auto' then return @_iconSpacing
    @getRectY(@itemCount() - 2) - @_boxSize - Constants.questionMarkHeight

  usableHeight: ->
    # The 2 is because the stroke width is otherwise cut off
    @_size.h - @lineHeight() - 2 - Constants.questionMarkHeight

  itemCount: ->
    if @_addAllSquare then (@_data.length + 1) else @_data.length


  # The line behind draggable menus
  lineHeight: ->
    if @_canDrag
      Constants.questionMarkHeight
    else
      0


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
          x1: "#{@_position.x + (@_size.w / 2)}px"
          x2: "#{@_position.x + (@_size.w / 2)}px"
          y1: '0px'
          y2: "#{@getRectY(0) + @_boxSize + @lineHeight()}px"
      
      @_group.append 'rect'
        .attr
          class: 'menuLineBehind'
          fill: '#333333'
          id: 'bottomRect'
          x: "#{@_position.x + (@_size.w / 2) - 3.5}px"
          y: "#{@getRectY(0) + @_boxSize + @lineHeight() - 7}px"
          width: '7px'
          height: '7px'
        .style
          stroke: '#333333'
          'stroke-width': 1

    @_group.append 'image'
      .attr
        class: 'menuLineBehind pointerCursor squareMenuHelpButton'
        'xlink:href': 'IMG/large_qmark.svg'
        x: "#{@_position.x + (@_size.w / 2)  - 8}px"
        width: '16px'
        height: '16px'
        tabindex: '0'
      .on 'click', =>
        @_showHelpHandler()

    @_group.selectAll('.menuItem').data(@_data).enter().append('g').attr
      class: 'menuItem'
      transform: (d, i) =>
        "translate(#{@getRectX()}, #{@getRectY(i)})"

    @_group.selectAll '.menuItem'
      .append 'image'
        .attr
          class: (d, i) ->
            "pointerCursor menuRect#{i}"
          'xlink:href': (d) -> d.img
          x: '0px'
          width: @_boxSize
          height: @_boxSize
        .on 'click', (d) =>
          return if d3.event.defaultPrevented
          @_onSelected d
        # .call @_drag
        .append('title').text (d) ->
          d.tooltip
      
    if @_addAllSquare
      squareGroup = @_group.append 'g'
        .attr
          class: 'selectAllGroup pointerCursor'
          transform: =>
            "translate(#{@getRectX()}, #{@getRectY(@_data.length)})"

      squareGroup.append 'image'
        .attr
          class: 'pointerCursor'
          'xlink:href': @getAllIcon
          x: '0px'
          width: @_boxSize
          height: @_boxSize
        .on 'click', @_allSquareHandler



  update: ->
    menuItems = @_group.selectAll '.menuItem'
      .data @_data
    
    menuItems.select 'image'
      .attr
        'xlink:href': (d) -> d.img

    if @_addAllSquare
      @_group.select '.selectAllGroup'
        .select 'image'
        .attr
          'xlink:href': @getAllIcon



module.exports = SquareMenu2