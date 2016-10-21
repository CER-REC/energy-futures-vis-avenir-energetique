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

  onSelected: (selectFunction) ->
    if !arguments.length
      return @_onSelected
    @_onSelected = selectFunction

  selection: (key, index) ->
    if !arguments.length
      return @_selectedKey
    @_selectedKey = key
    @_selectedMenuIndex = index
    if @_onSelected
      @_onSelected(key, index)
    @redraw()

  redraw: ->
    @_group.selectAll('.menuItem').remove()
    @_group.selectAll('.menuCircle').remove()
    @_group.selectAll('.menuItem').data(@_data).enter().append('g').attr
      class: 'menuItem'
      transform: (d, i) =>
        'translate(' +  (@_position.x + (i * @_size.w / @data().length)) + ',' + @_position.y + ')'
    @_group.selectAll('.menuItem').append('circle').attr(
      class: (d, i) =>
        if i == @_selectedMenuIndex then 'menuCircle selected' else 'menuCircle'
      r: 20).on 'click', (d, i) =>
        @selection d.value, i


module.exports = basicMenu