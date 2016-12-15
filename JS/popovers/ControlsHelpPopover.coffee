d3 = require 'd3'
Mustache = require 'mustache'

Platform = require '../Platform.coffee'
ApplicationRoot = require '../../ApplicationRoot.coffee'
Tr = require '../TranslationTable.coffee'


if Platform.name == "browser"
  QuestionmarkPopoverTemplate = require '../templates/QuestionmarkPopover.mustache'
else if Platform.name == "server"
  fs = require 'fs'
  QuestionmarkPopoverTemplate = fs.readFileSync "#{ApplicationRoot}/JS/templates/QuestionmarkPopover.mustache"



class ControlsHelpPopover

  constructor: (@app) ->

  show: (options) ->

    # Build the popover
    newEl = document.createElement 'div'
    newEl.className = options.outerClasses
    newEl.innerHTML = Mustache.render QuestionmarkPopoverTemplate, 
      classes: options.innerClasses
      title: options.title
      content: options.content
      closeButtonAltText: Tr.altText.closeButton[@app.language]
    
    # Attach to correct element
    d3.select(options.attachmentSelector).node().appendChild newEl

    d3.select '.floatingPopover .closeButton'
      .on 'click', => @app.popoverManager.closePopover()

    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('.floatingPopover').on 'click', ->
      d3.event.stopPropagation()


  close: ->
    d3.selectAll('.floatingPopover').remove()





module.exports = ControlsHelpPopover