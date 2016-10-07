d3 = require 'd3'
Mustache = require 'mustache'

Tr = require '../TranslationTable.coffee'
ImageDownloadTemplate = require '../templates/ImageDownload.mustache'

class ImageDownloadPopover

  constructor: (@app) ->
    document.getElementById('imageDownloadModal').innerHTML = Mustache.render ImageDownloadTemplate, 
        imageDownloadHeader: Tr.allPages.imageDownloadHeader[@app.language]
        imageDownloadInstructions: Tr.allPages.imageDownloadInstructions[@app.language]

    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('#imageDownloadModal').on 'click', ->
      d3.event.stopPropagation()


  show: ->
    d3.select('#imageDownloadModal').classed 'hidden', false


  close: ->
    d3.select('#imageDownloadModal').classed 'hidden', true





module.exports = ImageDownloadPopover