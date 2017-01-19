url = require 'url'
path = require 'path'
fs = require 'fs'
Promise = require 'bluebird'
unlink = Promise.promisify fs.unlink
PngCrop = require 'png-crop'

Logger = require '../Logger.coffee'
Constants = require '../Constants.coffee'
ApplicationRoot = require '../../ApplicationRoot.coffee'
ImageRequestHtmlWriter = require './ImageRequestHtmlWriter.coffee'
FileUrlPath = require './FileUrlPath.coffee'
Constants = require '../Constants.coffee'

class ImageRequest

  constructor: (@options) ->
    @req = @options.req
    @res = @options.res
    @time = @options.time || Date.now()
    @counter = @options.counter
    @crop = @options.crop

    # Extract the query parameters, and pass them through to the request we will have
    # Phantom make of our image page building endpoint.
    @query = url.parse(@req.url).search

    unless @query?
      @errorHandler new Error 'No visualization parameters specified.'
      return

    @imageHtmlFile = path.join ApplicationRoot, process.env.IMAGE_EXPORT_TEMP_DIRECTORY, "exported_image_#{@counter}.html"

    @webdriverUrlRequest = null
    @webdriverScreenshotRequest = null



  # handleRequest starts the sequence of calls to take care of the request
  
  # Only Phantom implements true promises, which is why this is structured as a set of
  # callbacks rather than a promise chain.

  # No matter what, we need to call done() when we are done, so that queued requests
  # continue to be handled.

  handleRequest: (browserTools, done) ->
    @browserTools = browserTools
    @done = done

    @awaitHtmlImage()

  awaitHtmlImage: ->

    htmlWriterPromise = ImageRequestHtmlWriter @query, @imageHtmlFile

    htmlWriterPromise.then =>
      @awaitPhantom()

    .catch @errorHandler


  awaitPhantom: ->
    @browserTools.phantomPromise.then @awaitWebdriver

    .catch @errorHandler


  awaitWebdriver: =>
    @browserTools.webdriverSession.then @loadUrl
    
    .catch @errorHandler


  loadUrl: =>
    @webdriverUrlRequest = @browserTools.webdriverSession.url FileUrlPath(@imageHtmlFile)

    @webdriverUrlRequest.then =>
      # We've seen an issue where the font has not loaded in time for the screenshot, and
      # so none of the text is rendered. The 50ms timeout is intended to compensate for
      # this. This is not an ideal solution, but detecting font loading is hard, and this
      # is simple. The issue occurred in maybe 1 request in 20. Other options: include
      # the font as a data URI, try the CSS3 document.fontloader API
      setTimeout @saveScreenshot, Constants.pngRenderSleepTime

    .catch @errorHandler


  saveScreenshot: =>
    @webdriverScreenshotRequest = @webdriverUrlRequest.saveScreenshot()
    @webdriverScreenshotRequest.then @cropScreenshot
    
    .catch @errorHandler

  cropScreenshot: (screenshotBuffer) =>
    if @crop == true
      PngCrop.cropToStream screenshotBuffer, Constants.socialCropSize, (error, outputStream) =>

        if error
          @errorHandler error
          return
        
        @writeResponseStream outputStream

    else
      @writeResponseBuffer screenshotBuffer



  writeResponseBuffer: (screenshotBuffer) =>
    @setHeaders()
    @res.write screenshotBuffer
    @res.end()
    @finishResponse()

  writeResponseStream: (screenshotStream) =>
    @setHeaders()
    screenshotStream.pipe @res
    @finishResponse()

  setHeaders: =>
    @res.setHeader 'content-type', 'image/png'

    # content-disposition=attachment prompts the browser to start a file download rather
    # than navigate to the image.
    @res.setHeader 'content-disposition', 'attachment'
    # The expected use case for image generation is the user previews the image, and then
    # clicks the download image link. Caching the image in the browser will save us from
    # handling a second request.
    @res.setHeader 'cache-control', "max-age=#{Constants.cacheDuration}"


  finishResponse: ->
    @done()
    Logger.debug "png_image (request P#{@counter}) Time: #{Date.now() - @time}"

    # Erase the HTML file we wrote for this request
    unlink @imageHtmlFile
    .catch (error) =>
      Logger.error "png_image: (request P#{@counter}) erase HTML after completion error: #{error.message}"





  errorHandler: (error) =>
    Logger.error "png_image (request P#{@counter}) error: #{error.message}"
    Logger.error error.stack

    @res.writeHead 500
    @res.end "HTTP 500 #{error.message}"

    @done()








module.exports = ImageRequest