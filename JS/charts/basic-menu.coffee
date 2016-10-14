_ = require 'lodash'
chart = require './chart.coffee'

class basicMenu extends chart
  menuDefaults:
    onSelected: ->

  constructor: (parent, options = {}) ->
    @options = _.extend {}, @menuDefaults, options
    @_selectedKey = 'Canada'
    @_selectedMenuIndex = -1

    # super(parent, @options)
    @chart_options = _.extend {}, @chart_defaults, @options
    @_duration = @chart_options.duration
    @parent(parent, @chart_options.groupId)
    @_size = 
      w : @chart_options.size.w
      h : @chart_options.size.h
    @_position = 
      x : @chart_options.position.x
      y : @chart_options.position.y
    @data(@chart_options.data)
    @resize()


    @_onSelected = @options.onSelected
    @redraw()

  selection: (key, index) ->
    if !arguments.length
      return @_selectedKey
    @_selectedKey = key
    @_selectedMenuIndex = index
    if @_onSelected
      @_onSelected(key, index)
    @redraw()


module.exports = basicMenu