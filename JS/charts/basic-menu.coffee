_ = require 'lodash'
chart = require './chart.coffee'

class basicMenu extends chart
  menuDefaults:
    onSelected: ->

  constructor: (parent, options = {}) ->
    @options = _.extend {}, @menuDefaults, options
    @_selectedKey = 'Canada'
    @_selectedMenuIndex = -1
    super(parent, @options)
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