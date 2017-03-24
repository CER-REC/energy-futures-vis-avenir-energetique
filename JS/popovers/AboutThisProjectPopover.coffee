d3 = require 'd3'
Mustache = require 'mustache'

Tr = require '../TranslationTable.coffee'
AboutThisProjectTemplate = require '../templates/AboutThisProject.mustache'

class AboutThisProjectPopover

  constructor: (@app) ->
    aboutModalElement = @app.window.document.getElementById 'aboutModal'
    aboutModalElement.innerHTML = Mustache.render AboutThisProjectTemplate,
        aboutTitle: Tr.aboutThisProject.aboutTitle[@app.language]
        aboutContent: Tr.aboutThisProject.aboutContent[@app.language]
        closeButtonAltText: Tr.altText.closeButton[@app.language]

    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('#aboutModal').on 'click', ->
      d3.event.stopPropagation()

  show: ->
    d3.select('#aboutModal').classed 'hidden', false

  close: ->
    d3.select('#aboutModal').classed 'hidden', true




module.exports = AboutThisProjectPopover