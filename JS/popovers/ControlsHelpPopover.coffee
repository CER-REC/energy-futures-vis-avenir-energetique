d3 = require 'd3'
Mustache = require 'mustache'

QuestionmarkPopoverTemplate = require '../templates/QuestionmarkPopover.mustache'


class ControlsHelpPopover

  constructor: ->

  show: (options) ->

    # Build the popover
    newEl = document.createElement 'div'
    newEl.className = options.outerClasses
    newEl.innerHTML = Mustache.render QuestionmarkPopoverTemplate, 
          visClass: options.innerClasses
          title: options.title
          content: options.content
    
    # Attach to correct element
    d3.select(options.attachmentSelector).node().appendChild newEl

    d3.select '.floatingPopover .closeButton'
      .on 'click', -> app.popoverManager.close_popover()

  close: ->
    d3.selectAll('.floatingPopover').remove()





module.exports = ControlsHelpPopover