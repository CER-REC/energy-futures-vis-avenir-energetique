jsdom = require 'jsdom'
fs = require 'fs'
Promise = require 'bluebird'
url = require 'url'
queryString = require 'query-string'

PrepareQueryParams = require '../PrepareQueryParams.coffee'
readFile = Promise.promisify fs.readFile
ApplicationRoot = require '../../ApplicationRoot.coffee'
Logger = require '../Logger.coffee'

# Visualization classes

ServerApp = require './ServerApp.coffee'
Visualization1 = require '../views/visualization1.coffee'
Visualization2 = require '../views/visualization2.coffee'
Visualization3 = require '../views/visualization3.coffee'
Visualization4 = require '../views/visualization4.coffee'

Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'

ServerData = require '../server/ServerData.coffee'

htmlFilePromise = readFile "#{ApplicationRoot}/JS/handlers/image.html" 
htmlPromise = htmlFilePromise.then (data) ->
  data.toString()




requestCounter = 0


HtmlImageHandler = (req, res) ->

  # TODO: For now, hard coding to use the most recent data set. Needs parameterization.
  Promise.join htmlPromise, ServerData['oct2016'].oilPromise, ServerData['oct2016'].gasPromise, ServerData['oct2016'].energyPromise, ServerData['oct2016'].electricityPromise, (html) ->

    time = Date.now()

    query = url.parse(req.url).search
    requestCounter++
    counter = requestCounter
    Logger.info "html_image (request H#{counter}): #{query}"

    try
      jsdom.env html, [], (error, window) -> 

        if error?
          errorHandler req, res, error, 500
          return

        params = PrepareQueryParams queryString.parse(query)

        serverApp = new ServerApp window,
          energyConsumptionProvider: ServerData['oct2016'].energyConsumptionProvider
          oilProductionProvider: ServerData['oct2016'].oilProductionProvider
          gasProductionProvider: ServerData['oct2016'].gasProductionProvider
          electricityProductionProvider: ServerData['oct2016'].electricityProductionProvider
        serverApp.setLanguage req.query.language

        # Parse the parameters with a configuration object, and then hand them off to a
        # visualization object. The visualizations render the graphs in their constructors.
        switch req.query.page
          when 'viz1'
            config = new Visualization1Configuration(serverApp, params)
            viz = new Visualization1(serverApp, config)

          when 'viz2'
            config = new Visualization2Configuration(serverApp, params)
            viz = new Visualization2(serverApp, config)

          when 'viz3'
            config = new Visualization3Configuration(serverApp, params)
            viz = new Visualization3(serverApp, config)

          when 'viz4'
            config = new Visualization4Configuration(serverApp, params)
            viz = new Visualization4(serverApp, config)

          else 
            errorHandler req, res, new Error("Visualization 'page' parameter not specified or not recognized."), 400, counter
            return

        body = window.document.querySelector('body')
          

        # we need to wait a tick for the zero duration animations to be scheduled and run
        setTimeout ->

          source = window.document.querySelector('html').outerHTML
          res.write source
          res.end()
          Logger.debug "html_image (request H#{counter}) Time: #{Date.now() - time}"

    catch error
      errorHandler req, res, error, 500, counter


errorHandler = (req, res, error, code, counter) ->

  Logger.error "html_image (request H#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead code
  res.end "HTTP #{code} #{error.message}"


module.exports = HtmlImageHandler

