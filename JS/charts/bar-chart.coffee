_ = require 'lodash';
chart = require './chart.coffee'

class barChart extends chart
  barChartDefaults:
    barSize : 10
    barMargin: 2

  constructor: (parent, x, y, options = {})->  
    @options = _.extend {}, @barChartDefaults, options

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


module.exports = barChart