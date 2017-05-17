_ = require 'lodash'
d3 = require 'd3'

Constants = require '../Constants.coffee'


class SquareMenu

  defaultOptions:
    canDrag: false
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
    onDragStart: ->
    onDragEnd: ->
    getAllLabel: -> # Called to determine what string to use for the all button aria-label
    # coffeelint: enable=no_empty_functions

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
    @getAllLabel = @options.getAllLabel
    @onDragStart = @options.onDragStart
    @onDragEnd = @options.onDragEnd

    
    @parent = d3.select @app.window.document
      .select "##{@options.parentId}"
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

    @_drag = d3.behavior.drag()
    @setupDrag() if @_canDrag

    @redraw()






  setupDrag: ->

    # dragContainer is the element containing the elements which are draggable, for
    # coordinate computation purposes
    @dragContainer = @app.window.document.getElementById @options.parentId

    @_drag.on 'dragstart', (d) =>
      # Only allow one item to be dragged at a time
      return if @draggedIcon?

      @onDragStart()
      d3.event.sourceEvent.stopPropagation()
      d3.event.sourceEvent.preventDefault()

      @draggedIcon = d.key
      @draggedIconBin = @computeBin()
      @draggedIconStartBin = @computeBin()
      @dataBeforeDrag = @_data
      @haveSeenDragEvent = false

    @_drag.on 'drag', (d, i) =>
      # Only allow one item to be dragged at a time
      return unless d.key == @draggedIcon
      @haveSeenDragEvent = true

      @_group.select(".menuRect#{i}").attr 'transform', "translate(#{@getRectX()}, #{d3.event.y - @_boxSize / 2})"

      # Compute which spot the icon should occupy
      bin = @computeBin()

      # Animate each of the other icons, if necessary
      @animateIconsWhileDragging bin
      @draggedIconBin = bin

    @_drag.on 'dragend', (d) =>
      # Only allow one item to be dragged at a time
      return unless d.key == @draggedIcon

      @onDragEnd()

      lastDraggedIconBin = @draggedIconBin
      @draggedIcon = null
      @draggedIconBin = null
      @draggedIconStartBin = null
      @dataBeforeDrag = null

      # At the end of the animation, we rebuild the DOM elements so that. they reflect
      # the new display order. I tried updating the existing elements instead, but this
      # had unacceptable graphical glitches in Firefox.
      # However, clicks will also trigger a dragstart and a dragend event. Redrawing here
      # will destroy the element and its click handler before they can respond to the
      # click event, so we only redraw if we have seen at least one frame of drag.
      @redraw() if @haveSeenDragEvent
      @haveSeenDragEvent = false

      # Since we destroy and rebuild the DOM elements after drag, we should manually place
      # the user's focus.
      @placeFocus lastDraggedIconBin


  computeBin: ->
    coords = d3.mouse @dragContainer
    equalSlice = @usableHeight() / @itemCount() # TODO: make me a function?

    # Conceptually, there is one 'bin' for each of the draggable icons.
    binSize = (@usableHeight() - equalSlice) / @_data.length

    # We normalize the y coordinate in the space where these icons are drawn, by
    # subtracting away the height for the top questionmark and the 'all' icon.
    # Then we divide by the number of bins.
    # Finally we take the floor rather than rounding to the nearest integer, because
    # the icon is considered to be at its top edge, and not at the centre of its bin.
    bin = Math.floor((coords[1] - Constants.questionMarkHeight - equalSlice) / binSize)
    bin = 0 if bin < 0
    bin = @_data.length - 1 if bin > (@_data.length - 1)
    bin


  # If the computed bin for the icon which is being dragged around has changed, we
  # schedule a new animation for each of the other icons.
  animateIconsWhileDragging: (newBin) ->
    # If the dragged icon is not in a new bin, we have nothing to do
    return if newBin == @draggedIconBin

    # First, compute the visual order that the icons should be in now
    newDisplayOrder = []

    if newBin == @draggedIconStartBin
      newDisplayOrder = @dataBeforeDrag.map (item) ->
        item.key
    else
      for item, index in @dataBeforeDrag
        if index == newBin and newBin > @draggedIconStartBin
          # This is the bin where the item has been dragged to.
          # Insert the dragged item here and the current item in the loop
          newDisplayOrder.push item.key
          newDisplayOrder.push @draggedIcon
        else if index == newBin and newBin < @draggedIconStartBin
          newDisplayOrder.push @draggedIcon
          newDisplayOrder.push item.key
        else if item.key == @draggedIcon
          # This is the bin where the dragged item used to be. Nothing to do here
          continue
        else
          newDisplayOrder.push item.key

    # The visual order is the order in which the menu items appear to the user.
    # The DOM order is the order in which the items exist in the DOM.
    # During animation, these two orders will get out of sync, by design. E.g., dragging
    # an item down one bin will change the visual order, but we keep the DOM order
    # unchanged so that we have stable targets to send animation instructions to.

    # Second, we take the visual order above, and create animation instructions in DOM
    # order.

    animationBinHash = {}
    for key, index in newDisplayOrder
      animationBinHash[key] = index

    # @dataBeforeDrag reflects the items' DOM order
    animationInstructions = @dataBeforeDrag.map (item) ->
      animationBinHash[item.key]

    # Third, animate all the things
    @_group.selectAll '.menuItem'
      .data animationInstructions
      .transition()
      .duration Constants.iconDragDuration
      .ease 'linear'
      .attr
        transform: (d) =>
          # If the 'all' icon is present, the others are bumped down one spot
          index = if @_addAllSquare then d + 1 else d
          "translate(#{@getRectX()}, #{@getRectY(index)})"

    # There is one item we do not want to animate: the box which is being dragged by the
    # user. Cancel that animation:
    @_group.select ".menuRect#{@draggedIconStartBin}"
      .transition()

    # The graph is drawn bottom to top, but the menu DOM order is top to bottom.
    # The menu uses the reverse of order seen in the configuration.
    # So, when we notify the rest of the app that the order has changed, we need to
    # reverse the order back to what it used to be.
    newDisplayOrder.reverse()

    # Notify the rest of the app that the order for this menu has changed
    @_orderChangedHandler newDisplayOrder



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
    # The graph is drawn bottom to top, but the menu DOM order is top to bottom.
    # The menu uses the reverse of the order seen in the configuration.
    @_data.reverse()


  # Get the center
  getRectX: =>
    @_position.x + (@_size.w / 2 - @_boxSize / 2)

  # When an explicit icon spacing isn't specified, we calculate spacing automatically
  autoIconSpacing: ->
    # Divide the drawable height into equal portions
    equalSlice = @usableHeight() / @itemCount()
    # Calculate the amount of unused height per icon
    spaceBetween = equalSlice - @_boxSize
    # Compute the total amount of available vertical space, and divide it among the
    # number of gutters between icons (which is one less than the number of icons)
    # This is the amount of vertical space separating neighbouring icons
    (spaceBetween * @itemCount()) / (@itemCount() - 1)

  getRectY: (i) =>
    i * (@getIconSpacing() + @_boxSize) + Constants.questionMarkHeight

  setIconSpacing: (spacing) ->
    @_iconSpacing = spacing
    @redraw()

  getIconSpacing: ->
    if @_iconSpacing == 'auto'
      @autoIconSpacing()
    else
      @_iconSpacing

  usableHeight: ->
    # The 2 is because the stroke width is otherwise cut off
    @_size.h - @bottomSquareHeight() - 2 - Constants.questionMarkHeight

  itemCount: ->
    if @_addAllSquare then (@_data.length + 1) else @_data.length


  # The height of the bottom square decoration, which is only drawn if the controls are
  # draggable
  bottomSquareHeight: ->
    if @_canDrag
      Constants.questionMarkHeight
    else
      0


  redraw: ->

    # When the user is interacting via drag, we suppress ordinary menu updates so that
    # we do not interrupt drag related animations.
    return if @draggedIcon?

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
          y2: "#{@getRectY(@itemCount() - 1) + @_boxSize + @bottomSquareHeight()}px"
      
      @_group.append 'rect'
        .attr
          class: 'menuLineBehind'
          fill: '#333333'
          id: 'bottomRect'
          x: "#{@_position.x + (@_size.w / 2) - 3.5}px"
          y: "#{@getRectY(@itemCount() - 1) + @_boxSize + @bottomSquareHeight() - 7}px"
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
        'aria-label': @options.helpButtonLabel
        role: 'button'
        id: @options.helpButtonId
      .on 'click', =>
        @_showHelpHandler()
      .on 'keydown', =>
        if d3.event.key == 'Enter'
          d3.event.preventDefault()
          d3.event.stopPropagation()
          @_showHelpHandler()


    if @_addAllSquare
      squareGroup = @_group.append 'g'
        .attr
          class: 'selectAllGroup pointerCursor'
          transform: =>
            "translate(#{@getRectX()}, #{@getRectY(0)})"

      squareGroup.append 'image'
        .attr
          class: 'pointerCursor'
          'xlink:href': @getAllIcon
          x: '0px'
          width: @_boxSize
          height: @_boxSize
          tabindex: '0'
          'aria-label': @getAllLabel()
          role: 'button'
        .on 'click', @_allSquareHandler
        .on 'keydown', =>
          @_allSquareHandler() if d3.event.key == 'Enter'





    @_group.selectAll('.menuItem').data(@_data).enter().append('g').attr
      class: (d, i) ->
        "menuItem menuRect#{i}"
      transform: (d, i) =>
        # If the 'all' icon is present, the others are bumped down one spot
        index = if @_addAllSquare then i + 1 else i
        "translate(#{@getRectX()}, #{@getRectY(index)})"
    .call @_drag

    @_group.selectAll '.menuItem'
      .append 'image'
        .attr
          class: 'pointerCursor'
          'xlink:href': (d) -> d.img
          x: '0px'
          width: @_boxSize
          height: @_boxSize
          tabindex: '0'
          'aria-label': (d) -> d.tooltip
          role: 'button'
        .on 'click', (d) =>
          return if d3.event.defaultPrevented
          @_onSelected d
        .on 'keydown', (d, i) =>
          switch d3.event.key
            when 'Enter'
              @_onSelected d
            when 'ArrowUp'
              d3.event.preventDefault()
              newBin = i - 1
              @swapItems i, newBin
            when 'ArrowDown'
              d3.event.preventDefault()
              newBin = i + 1
              @swapItems i, newBin
        .append('title').text (d) ->
          d.tooltip
      
 
  update: ->
    # When the user is interacting via drag, we suppress ordinary menu updates so that
    # we do not interrupt drag related animations.
    return if @draggedIcon?

    menuItems = @_group.selectAll '.menuItem'
      .data @_data
      .attr
        transform: (d, i) =>
          # If the 'all' icon is present, the others are bumped down one spot
          index = if @_addAllSquare then i + 1 else i
          "translate(#{@getRectX()}, #{@getRectY(index)})"

    menuItems.select 'image'
      .attr
        'xlink:href': (d) -> d.img
        'aria-label': (d) -> d.tooltip
      .select('title').text (d) ->
        d.tooltip

    if @_addAllSquare
      @_group.select '.selectAllGroup'
        .select 'image'
        .attr
          'aria-label': @getAllLabel()
          'xlink:href': @getAllIcon()

  placeFocus: (bin) ->
    @app.window.document.querySelector "##{@groupId} .menuRect#{bin} image"
      .focus()

  # Swap two menu items, update the app, and then update the menu display
  swapItems: (currentBin, newBin) ->
    return unless @_canDrag
    return if newBin < 0 or newBin >= @_data.length

    newOrder = @_data.map (item) ->
      item.key

    temp = newOrder[newBin]
    newOrder[newBin] = newOrder[currentBin]
    newOrder[currentBin] = temp

    # The graph is drawn bottom to top, but the menu DOM order is top to bottom.
    # The menu uses the reverse of order seen in the configuration.
    # So, when we notify the rest of the app that the order has changed, we need to
    # reverse the order back to what it used to be.
    newOrder.reverse()

    @_orderChangedHandler newOrder
    @update()
    @placeFocus newBin



module.exports = SquareMenu