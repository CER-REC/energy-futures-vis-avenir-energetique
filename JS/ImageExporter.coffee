ParamsToUrlString = require './ParamsToUrlString.coffee'
Tr = require './TranslationTable.coffee'


class ImageExporter

  # coffeelint: disable=no_empty_functions
  constructor: (@app) ->
  # coffeelint: enable=no_empty_functions

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


    imageUrl = "png_image/#{config.pngFileName()}#{ParamsToUrlString params}"




    button = @app.window.document.getElementById 'modalImageDownloadButton'
    button.setAttribute 'href', imageUrl

    container = @app.window.document.getElementById 'renderedImageContainer'
    # Remove the previous image, if any.
    container.innerHTML = ''

    spinner = @app.window.document.getElementById 'imageDownloadSpinner'
    spinner.setAttribute 'class', '' # Display the spinner, if it was hidden

    image = new Image()
    image.onload = ->
      spinner.setAttribute 'class', 'hidden'
      # It's important to remove the image prior to appending it again, in case the user
      # has clicked the download image navbar link several times.
      container.innerHTML = ''
      container.appendChild image
      
    image.setAttribute 'alt', Tr.allPages.imageDownloadHeader[@app.language]
    image.setAttribute 'src', imageUrl

    @app.popoverManager.showPopover @app.imageDownloadPopover,
      elementToFocusOnClose: @app.window.document.getElementById('imageDownloadLink')







module.exports = ImageExporter