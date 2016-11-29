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
    params.language = @app.language


    throw new Error "process.env.HOST is undefined." if process.env.HOST == ''

    imageUrl = "#{process.env.HOST}:#{process.env.PORT_NUMBER}/png_image/#{config.pngFileName()}#{ParamsToUrlString params}"




    button = @app.window.document.getElementById 'modalImageDownloadButton'
    button.setAttribute 'href', imageUrl

    container = @app.window.document.getElementById 'renderedImageContainer'
    # Remove the previous image, if any.
    container.innerHTML = ""

    spinner = @app.window.document.getElementById 'imageDownloadSpinner'
    spinner.setAttribute 'class', '' # Display the spinner, if it was hidden

    image = new Image()
    image.onload = =>
      spinner.setAttribute 'class', 'hidden'
      # It's important to remove the image prior to appending it again, in case the user 
      # has clicked the download image navbar link several times.
      container.innerHTML = ""
      container.appendChild image
      
    image.setAttribute 'src', imageUrl

    @app.popoverManager.showPopover @app.imageDownloadPopover







module.exports = ImageExporter