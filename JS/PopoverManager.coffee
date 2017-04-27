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



    # This event handler implements the 'modal' part of modal popovers for users of
    # assistive technology.
    # Capture all focus events on the page before they can bubble.
    # If we have a popover open, and if the focus event is for an element not in the
    # popover, focus the popover instead.
    
    # TODO: currently, this approach doesn't fully work because of the iframe, focus
    # can move to an element on @app.containingWindow that we aren't listening to.
    # Removing the iframe should fix this.

    # This approach does not handle screen reader cursor, but there doesn't seem to be
    # a best practice around doing so other than marking the new popover as a dialog
    @app.window.document.addEventListener 'focus', (event) =>
      return unless @currentPopover?

      popoverElement = @currentPopover.container()
      unless popoverElement.contains event.target
        event.stopPropagation()
        @currentPopover.focus()

    , true




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
    return unless @currentPopover?

    options = _.assign {returnFocus: true}, options

    @currentPopover.close()
    @currentPopover = null

    if options.returnFocus
      @elementToFocusOnClose.focus()







module.exports = PopoverManager



