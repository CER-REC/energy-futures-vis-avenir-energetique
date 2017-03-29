d3 = require 'd3'

class PopoverManager


  constructor: (@app) ->
    @currentPopover = null

    body = d3.select 'body'
    body.on 'click', =>
      if @currentPopover?
        @closePopover()

    d3.select(@app.containingWindow).on 'click', =>
      if @currentPopover?
        @closePopover()


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



