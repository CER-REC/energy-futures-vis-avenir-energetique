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

ServerApp = require '../imageServer/ServerApp.coffee'

Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'

ServerData = require '../server/ServerData.coffee'

requestCounter = 0


CSVDataHandler = (req, res) ->

  # TODO: For now, hard coding to use the most recent data set. Needs parameterization.
  Promise.join htmlPromise, ServerData['oct2016'].oilPromise, ServerData['oct2016'].gasPromise, ServerData['oct2016'].energyPromise, ServerData['oct2016'].electricityPromise, (html) ->

    time = Date.now()

    query = url.parse(req.url).search
    requestCounter++
    counter = requestCounter
    mainSelection = req.query.mainSelection
    Logger.info "csv_data (request H#{counter}): #{query}"
    csvData = null
  
    serverApp = new ServerApp window,
      energyConsumptionProvider: ServerData['oct2016'].energyConsumptionProvider
      oilProductionProvider: ServerData['oct2016'].oilProductionProvider
      gasProductionProvider: ServerData['oct2016'].gasProductionProvider
      electricityProductionProvider: ServerData['oct2016'].electricityProductionProvider
    serverApp.setLanguage req.query.language

    params = PrepareQueryParams queryString.parse(query)

    # Parse the parameters with a configuration object, and then hand them off to a
    # visualization object. The visualizations render the graphs in their constructors.
    switch req.query.page
      when 'viz1'
        config = new Visualization1Configuration(serverApp, params)
        switch config.mainSelection
          when 'gasProduction'
            csvData = app.gasProductionProvider.dataForViz1 config
          when 'electricityGeneration'
            csvData = app.electricityProductionProvider.dataForViz1 config
          when 'energyDemand'
            csvData = app.energyConsumptionProvider.dataForViz1 config
          when 'oilProduction'
            csvData = app.oilProductionProvider.dataForViz1 config
          else 
            mainSelectionErrorHandler()
            return
   
        
      when 'viz2'
        config = new Visualization2Configuration(serverApp, params)
        switch config.mainSelection
          when 'energyDemand'
            csvData = app.energyConsumptionProvider.dataForViz2 config
          else 
            mainSelectionErrorHandler()
            return
        #ConsumptionProvider

      when 'viz3'
        config = new Visualization3Configuration(serverApp, params)
        switch config.mainSelection
          when 'electricityGeneration'
            csvData = app.electricityProductionProvider.dataForViz3 config
          else 
            mainSelectionErrorHandler()
            return
        #electricityProductionProvider

      when 'viz4'
        config = new Visualization4Configuration(serverApp, params)
        switch config.mainSelection
          when 'gasProduction'  
            csvData = app.gasProductionProvider.dataForViz4 config
          when 'electricityGeneration'
            csvData = app.electricityProductionProvider.dataForViz4 config
          when 'energyDemand'
            csvData = app.energyConsumptionProvider.dataForViz4 config
          when 'oilProduction'
            csvData = app.oilProductionProvider.dataForViz4 config
          else 
            mainSelectionErrorHandler()
            return   

      else 
        errorHandler req, res, new Error("Visualization 'page' parameter not specified or not recognized."), 400, counter
        return
      
    #CONVERT DATA TO CSV AND ASSIGN IT TO RESPONSE OBJECT
    if !csvData?
      res.write csvData
      res.end()
      Logger.debug "csv data request (request H#{counter}) Time: #{Date.now() - time}"
      
mainSelectionErrorHandler = ->
  errorHandler req, res, new Error("Visualization 'mainSelection' parameter not specified or not recognized."), 400, counter
  return


errorHandler = (req, res, error, code, counter) ->

  Logger.error "html_image (request H#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead code
  res.end "HTTP #{code} #{error.message}"


module.exports = CSVDataHandler