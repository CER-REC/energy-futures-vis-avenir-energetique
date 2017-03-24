
class PopoverManager


  constructor: ->
    @currentPopover = null


  showPopover: (popover, options) ->
    if @currentPopover?
      @closePopover()

    @currentPopover = popover
    @currentPopover.show options


  closePopover: ->
    if @currentPopover?
      @currentPopover.close()
      @currentPopover = null







module.exports = PopoverManager



