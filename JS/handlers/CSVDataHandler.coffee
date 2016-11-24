Promise = require 'bluebird'
url = require 'url'
queryString = require 'query-string'
d3 = require 'd3'

PrepareQueryParams = require '../PrepareQueryParams.coffee'
Logger = require '../Logger.coffee'

# Visualization classes

ServerApp = require './ServerApp.coffee'

Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'

ServerData = require '../server/ServerData.coffee'

requestCounter = 0


CSVDataHandler = (req, res) ->

  # TODO: For now, hard coding to use the most recent data set. Needs parameterization.
  Promise.join ServerData['oct2016'].oilPromise, ServerData['oct2016'].gasPromise, ServerData['oct2016'].energyPromise, ServerData['oct2016'].electricityPromise, () ->

    time = Date.now()

    query = url.parse(req.url).search
    requestCounter++
    counter = requestCounter
    mainSelection = req.query.mainSelection
    Logger.info "csv_data (request C#{counter}): #{query}"
    csvData = null
  
    serverApp = new ServerApp null,
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
            tempData = serverApp.gasProductionProvider.dataForViz1 config
          when 'electricityGeneration'
            tempData = serverApp.electricityProductionProvider.dataForViz1 config
          when 'energyDemand'
            tempData = serverApp.energyConsumptionProvider.dataForViz1 config
          when 'oilProduction'
            tempData = serverApp.oilProductionProvider.dataForViz1 config
          else 
            mainSelectionErrorHandler()
            return
        csvData = generateArrayFromObject(tempData, "viz1")   

        
      when 'viz2'
        config = new Visualization2Configuration(serverApp, params)
        tempData = serverApp.energyConsumptionProvider.dataForViz2 config
        csvData = generateArrayFromObject(tempData, "viz2")
        #ConsumptionProvider

      when 'viz3'
        config = new Visualization3Configuration(serverApp, params)
        tempData = serverApp.electricityProductionProvider.dataForViz3 config
        csvData = generateArrayFromObject(tempData, "viz3")
        #electricityProductionProvider

      when 'viz4'
        config = new Visualization4Configuration(serverApp, params)
        switch config.mainSelection
          when 'gasProduction'  
            tempData = serverApp.gasProductionProvider.dataForViz4 config
          when 'electricityGeneration'
            tempData = serverApp.electricityProductionProvider.dataForViz4 config
          when 'energyDemand'
            tempData = serverApp.energyConsumptionProvider.dataForViz4 config
          when 'oilProduction'
            tempData = serverApp.oilProductionProvider.dataForViz4 config
          else 
            mainSelectionErrorHandler()
            return
        csvData = generateArrayFromObject(tempData, "viz4")   

      else 
        errorHandler req, res, new Error("Visualization 'page' parameter not specified or not recognized."), 400, counter
        return
      
    #CONVERT DATA TO CSV AND ASSIGN IT TO RESPONSE OBJECT
    if csvData?
      results = d3.csv.format csvData
      res.write results
      res.end()
      Logger.debug "csv data request (request C#{counter}) Time: #{Date.now() - time}"
    
    else
      res.writeHead 204
      res.end()
      
mainSelectionErrorHandler = ->
  errorHandler req, res, new Error("Visualization 'mainSelection' parameter not specified or not recognized."), 400, counter
  return

generateArrayFromObject = (csvDataObject, viz) ->
  hashArray = []
  switch viz
    when "viz1", "viz2", "viz4"
      for k,v of csvDataObject
        hashArray = hashArray.concat v
      break
    when "viz3"
      for tempChild in csvDataObject.children
        hashArray = hashArray.concat tempChild.children
      break
  
  return hashArray
  

errorHandler = (req, res, error, code, counter) ->

  Logger.error "csv data request (request C#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead code
  res.end "HTTP #{code} #{error.message}"


module.exports = CSVDataHandler