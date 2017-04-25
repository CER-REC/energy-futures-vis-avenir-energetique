d3 = require 'd3'
Mustache = require 'mustache'

Tr = require '../TranslationTable.coffee'
ImageDownloadTemplate = require '../templates/ImageDownloadPopover.mustache'

class ImageDownloadPopover

  constructor: (@app) ->
    modalElement = @app.window.document.getElementById 'imageDownloadModal'
    modalElement.innerHTML = Mustache.render ImageDownloadTemplate,
      imageDownloadHeader: Tr.allPages.imageDownloadHeader[@app.language]
      imageDownloadButton: Tr.allPages.download[@app.language]
      closeButtonAltText: Tr.altText.closeButton[@app.language]

    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('#imageDownloadModal').on 'click', ->
      d3.event.stopPropagation()

    d3.select('#modalImageDownloadButton').on 'click', =>
      @app.analyticsReporter.reportEvent 'Downloads', 'Download image'

    @closeButton = d3.select '#imageDownloadModal .closeButton'

    @closeButton.on 'click', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @app.popoverManager.closePopover()

    @closeButton.on 'keyup', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      if d3.event.key == 'Enter'
        @app.popoverManager.closePopover()


  show: ->
    d3.select('#imageDownloadModal').classed 'hidden', false


  close: ->
    d3.select('#imageDownloadModal').classed 'hidden', true

  focus: ->
    @app.window.document.getElementById('imageDownloadPopoverHeading').focus()

  container: ->
    @app.window.document.getElementById 'imageDownloadModal'







module.exports = ImageDownloadPopover