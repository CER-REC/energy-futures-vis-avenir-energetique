d3 = require 'd3'
_ = require 'lodash'

class PopoverManager


  constructor: (@app) ->
    @currentPopover = null
    @elementToFocusOnClose = null

    body = d3.select 'body'
    body.on 'click', =>
      if @currentPopover?
        @closePopover()

    d3.select(@app.containingWindow).on 'click', =>
      if @currentPopover?
        @closePopover()

  ###
    We need to handle three cases:
    1) No popover is open, opening a popover: move focus to modal
    2) Popover is open, closing popover: move focus to @elementToFocusOnClose
    3) Popover is open, opening another popover: move focus to new modal without first
       moving focus to old popover's @elementToFocusOnClose
  ###

  showPopover: (popover, options) ->
    options = _.assign {}, options

    if @currentPopover?
      @closePopover
        returnFocus: false

    @elementToFocusOnClose = options.elementToFocusOnClose || @app.window.document.getElementById('canadasEnergyFutureVisualization')

    @currentPopover = popover
    @currentPopover.show options

    @currentPopover.focus()



  closePopover: (options) ->
    options = _.assign {returnFocus: true}, options

    if options.returnFocus
      @elementToFocusOnClose.focus()

    if @currentPopover?
      @currentPopover.close()
      @currentPopover = null







module.exports = PopoverManager



