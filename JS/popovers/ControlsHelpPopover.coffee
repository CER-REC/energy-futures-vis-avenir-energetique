d3 = require 'd3'
Mustache = require 'mustache'

Platform = require '../Platform.coffee'
Tr = require '../TranslationTable.coffee'


if Platform.name == 'browser'
  ControlsHelpPopoverTemplate = require '../templates/ControlsHelpPopover.mustache'



class ControlsHelpPopover

  # coffeelint: disable=no_empty_functions
  constructor: (@app) ->
  # coffeelint: enable=no_empty_functions

  show: (options) ->

    # Build the popover
    newEl = document.createElement 'div'
    newEl.className = options.outerClasses
    newEl.innerHTML = Mustache.render ControlsHelpPopoverTemplate,
      classes: options.innerClasses
      title: options.title
      content: options.content
      closeButtonAltText: Tr.altText.closeButton[@app.language]
    
    # Attach to correct element
    d3.select(options.attachmentSelector).node().appendChild newEl

    @closeButton = d3.select '.controlsHelpPopover .closeButton'

    @closeButton.on 'click', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @app.popoverManager.closePopover()

    @closeButton.on 'keyup', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      if d3.event.key == 'Enter'
        @app.popoverManager.closePopover()

    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('.controlsHelpPopover').on 'click', ->
      d3.event.stopPropagation()


  close: ->
    @closeButton.on 'click', null
    @closeButton.on 'keyup', null

    d3.selectAll('.controlsHelpPopover').remove()

  focus: ->
    @app.window.document.getElementById('controlsHelpPopoverHeading').focus()

  container: ->
    @app.window.document.getElementById 'controlsHelpPopover'





module.exports = ControlsHelpPopover