_ = require 'lodash';
chart = require './chart.coffee'

class barChart extends chart
  barChartDefaults:
    barSize : 10
    barMargin: 2

  constructor: (parent, x, y, options = {})->  
    @options = _.extend {}, @barChartDefaults, options
    super(parent, @options) 
    @_barMargin = @options.barMargin
    @_barSize = @options.barSize - 2 * @options.barMargin
    @_x = x
    @_y = y
    @redraw()
    
  x: (x) ->
    @_x = x

  y: (y) ->
    @_y = y
    @redraw()

  barSize: (width) ->
    if !arguments.length
      return @_barSize
    @_barSize = width - 2 * @_barMargin
    @redraw()

  redraw: ->
    @_group.selectAll('.bar').remove()
    if @_y and @_x
      @_group.selectAll('.bar')
          .data(@_data)
        .enter().append('rect')
          .attr(
            class: 'bar'
            x: (d) =>
              @_x d.year
            y: (d) =>
              @_y d.value
            width: (d) =>
              @_barSize
            height: (d) =>
              @_y d.value
          )
    this

module.exports = barChart