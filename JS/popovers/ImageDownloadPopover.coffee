d3 = require 'd3'
Mustache = require 'mustache'

Tr = require '../TranslationTable.coffee'
ImageDownloadTemplate = require '../templates/ImageDownload.mustache'

class ImageDownloadPopover

  constructor: ->
    document.getElementById('imageDownloadModal').innerHTML = Mustache.render ImageDownloadTemplate, 
        imageDownloadHeader: Tr.allPages.imageDownloadHeader[app.language]
        imageDownloadInstructions: Tr.allPages.imageDownloadInstructions[app.language]

  show: ->
    d3.select('#imageDownloadModal').classed 'hidden', false


  close: ->
    d3.select('#imageDownloadModal').classed 'hidden', true





module.exports = ImageDownloadPopover