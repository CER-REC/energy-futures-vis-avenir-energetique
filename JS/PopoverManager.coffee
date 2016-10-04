
class PopoverManager


  constructor: ->
    @current_popover = null


  show_popover: (popover, options) ->
    if @current_popover?
      @close_popover @current_popover

    @current_popover = popover
    @current_popover.show(options)


  close_popover: ->
    if @current_popover?
      @current_popover.close() 
      @current_popover = null







module.exports = PopoverManager



