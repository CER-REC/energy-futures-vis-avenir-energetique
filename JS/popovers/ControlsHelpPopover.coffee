d3 = require 'd3'
Mustache = require 'mustache'
_ = require 'lodash'

Platform = require '../Platform.coffee'
Tr = require '../TranslationTable.coffee'


if Platform.name == 'browser'
  ControlsHelpPopoverTemplate = require '../templates/ControlsHelpPopover.mustache'



class ControlsHelpPopover

  constructor: (@app, options) ->
    @options = _.extend {setupEvents: true}, options

    # Options, all should be provided
    #   popoverButtonId: id of the button element to open the popover
    #   outerClasses: wrapper classes on the popover modal
    #   innerClasses: inner wrapper classes on the popover modal
    #   title: main heading text, a string
    #   content: body content of the popover, a string containing HTML
    #   attachmentSelector: element where the popover should be attached to, in the DOM
    #   analyticsEvent: string describing the popover opening to be passed to analytics

    # TODO: check that all required options are passed?

    @document = @app.window.document
    @d3document = d3.select @document

    @setupOpenPopoverEvents() if @options.setupEvents



  setupOpenPopoverEvents: ->
    @d3document.select "##{@options.popoverButtonId}"
      .on 'click', =>
        d3.event.stopPropagation()
        d3.event.preventDefault()
        @showPopoverCallback()
      .on 'keydown', =>
        if d3.event.key == 'Enter' or d3.event.key == ' '
          d3.event.preventDefault()
          @showPopoverCallback()


  # The first part of opening a popover, the callback from user interaction
  showPopoverCallback: =>
    if @app.popoverManager.currentPopover == @
      @app.popoverManager.closePopover()
    else
      @app.popoverManager.showPopover @,
        elementToFocusOnClose: @document.getElementById @options.popoverButtonId
      @app.analyticsReporter.reportEvent 'Controls help', @options.analyticsEvent


  # The second part of opening a popover, called by the popover manager
  show: ->

    # Build the popover
    newEl = document.createElement 'div'
    newEl.className = @options.outerClasses
    newEl.innerHTML = Mustache.render ControlsHelpPopoverTemplate,
      classes: @options.innerClasses
      title: @options.title
      content: @options.content()
      closeButtonAltText: Tr.altText.closeButton[@app.language]
    
    # Attach to correct element
    d3.select(@options.attachmentSelector).node().appendChild newEl

    @closeButton = d3.select '.controlsHelpPopover .closeButton'

    @closeButton.on 'click', =>
      d3.event.stopPropagation()
      @app.popoverManager.closePopover()

    @closeButton.on 'keydown', =>
      if d3.event.key == 'Enter' or d3.event.key == ' '
        d3.event.preventDefault()
        d3.event.stopPropagation()
        @app.popoverManager.closePopover()

    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('.controlsHelpPopover').on 'click', ->
      d3.event.stopPropagation()


  close: ->
    @closeButton.on 'click', null
    @closeButton.on 'keydown', null

    d3.selectAll('.controlsHelpPopover').remove()

  focus: ->
    @app.window.document.getElementById('controlsHelpPopoverHeading').focus()

  container: ->
    @app.window.document.getElementById 'controlsHelpPopover'





module.exports = ControlsHelpPopover