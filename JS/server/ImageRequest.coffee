url = require 'url'
queryString = require 'query-string'

PrepareQueryParams = require '../PrepareQueryParams.coffee'

Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'

ServerApp = require './Serverapp.coffee'


class ImageRequest

  constructor: (@options) ->
    @req = @options.req
    @res = @options.res
    @time = @options.time || Date.now()

    # Extract the query parameters, and pass them through to the request we will have 
    # Phantom make of our image page building endpoint.
    @query = url.parse(@req.url).search

    @webdriverUrlRequest = null
    @webdriverScreenshotRequest = null



  # handleRequest starts the sequence of calls to take care of the request
  
  # Only Phantom implements true promises, which is why this is structured as a set of
  # callbacks rather than a promise chain.

  # No matter what, we need to call done() when we are done.

  handleRequest: (browserTools, done) ->
    @browserTools = browserTools
    @done = done

    @awaitPhantom()


  awaitPhantom: ->
    @browserTools.phantomPromise.then @awaitWebdriver

    .catch @errorHandler


  awaitWebdriver: =>
    @browserTools.webdriverSession.then @loadUrl
    
    .catch @errorHandler


  loadUrl: =>

    unless @query?
      @errorHandler new Error("No visualization parameters specified.")
      return

    @webdriverUrlRequest = @browserTools.webdriverSession.url("#{process.env.HOST}:#{process.env.PORT_NUMBER}/html_image/#{@query}")

    @webdriverUrlRequest.then =>

      # We've seen an issue where the font has not loaded in time for the screenshot, and
      # so none of the text is rendered. The 50ms timeout is intended to compensate for this.
      # This is not an ideal solution, but detecting font loading is hard, and this is simple.
      # The issue occurred in maybe 1 request in 20.
      # Other options: include the font as a data URI, try the CSS3 document.fontloader API
      setTimeout @saveScreenshot, 50

    .catch @errorHandler


  saveScreenshot: =>
    @webdriverScreenshotRequest = @webdriverUrlRequest.saveScreenshot()
    @webdriverScreenshotRequest.then @writeResponse
    
    .catch @errorHandler


  writeResponse: (screenshotBuffer) =>
    @res.setHeader "content-type", "image/png"
    # content-disposition=attachment prompts the browser to start a file download rather
    # than navigate to the image.
    @res.setHeader "content-disposition", "attachment; filename=\"#{@pngFileName()}\";"
    @res.setHeader 'cache-control', "max-age=600" 
    @res.write(screenshotBuffer)
    @res.end()

    @done()

    console.log "Time: #{Date.now() - @time}"



  errorHandler: (error) =>
    console.log "That's an error: "
    console.log error.message
    console.log error.stack
    # console.log (new Error()).stack

    @res.writeHead 500
    @res.end "HTTP 500 #{error.message}"

    @done()


  pngFileName: ->
    params = PrepareQueryParams queryString.parse(@query)

    serverApp = new ServerApp()
    serverApp.setLanguage params.language


    # Parse the parameters with a configuration object, and then hand them off to a
    # visualization object. The visualizations render the graphs in their constructors.
    switch @req.query.page
      when 'viz1'
        config = new Visualization1Configuration(serverApp, params)
      when 'viz2'
        config = new Visualization2Configuration(serverApp, params)
      when 'viz3'
        config = new Visualization3Configuration(serverApp, params)
      when 'viz4'
        config = new Visualization4Configuration(serverApp, params)
      # else 
        # TODO: do some error handling here
        # errorHandler req, res, new Error("Visualization 'page' parameter not specified or not recognized."), 500
        # return

    name = config.pngFileName()
    console.log name
    name







module.exports = ImageRequest