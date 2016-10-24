QueryString = require 'query-string'

Tr = require './TranslationTable.coffee'
ParamsToUrlString = require './ParamsToUrlString.coffee'

class ImageExporter

  constructor: (@app) ->

  createImage: ->

    config = null

    switch @app.page
      when 'landingPage'
        return
      when 'viz1'
        config = @app.visualization1Configuration
      when 'viz2'
        config = @app.visualization2Configuration
      when 'viz3'
        config = @app.visualization3Configuration
      when 'viz4'
        config = @app.visualization4Configuration
        
    params = config.routerParams()
    params.page = @app.page
    params.language = @app.language

    # TODO: Parameterize this URL
    imageUrl = "http://localhost:4747/png_image/#{ParamsToUrlString params}"



    button = @app.window.document.getElementById 'modalImageDownloadButton'
    button.setAttribute 'href', imageUrl

    container = @app.window.document.getElementById 'renderedImageContainer'
    container.innerHTML = ""

    spinner = @app.window.document.getElementById 'imageDownloadSpinner'
    spinner.setAttribute 'class', '' # Display the spinner, if it was hidden

    image = new Image()
    image.onload = =>
      spinner.setAttribute 'class', 'hidden'
      container.appendChild image
      
    image.setAttribute 'src', imageUrl

    @app.popoverManager.showPopover @app.imageDownloadPopover







module.exports = ImageExporter