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


module.exports = barChart