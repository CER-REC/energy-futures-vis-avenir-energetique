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
Constants = require '../Constants.coffee'

requestCounter = 0


CSVDataHandler = (req, res) ->

  Promise.all(ServerData.loadPromises).then ->

    time = Date.now()

    query = url.parse(req.url).search
    requestCounter++
    counter = requestCounter
    @mainSelection = req.query.mainSelection
    @unit = req.query.unit
    @page = req.query.page
    @dataset = req.query.dataset
    Logger.info "csv_data (request C#{counter}): #{query}"
    csvData = null
    results = ''
  

    providers = {}
    for dataset in Constants.datasets
      # TODO: the 'dataset' objects on ServerData have a lot more than just
      # providers. This is fine for now, but a little messy.
      providers[dataset] = ServerData[dataset]


    serverApp = new ServerApp null, providers
    serverApp.setLanguage req.query.language

    params = PrepareQueryParams queryString.parse(query)

    # Parse the parameters with a configuration object, and then hand them off to a
    # visualization object. The visualizations render the graphs in their constructors.
    switch req.query.page
      when 'viz1'
        config = new Visualization1Configuration(serverApp, params)
        switch config.mainSelection
          when 'gasProduction'  
            tempData = serverApp.providers[config.dataset].gasProductionProvider.dataForViz1 config
          when 'electricityGeneration'
            tempData = serverApp.providers[config.dataset].electricityProductionProvider.dataForViz1 config
          when 'energyDemand'
            tempData = serverApp.providers[config.dataset].energyConsumptionProvider.dataForViz1 config
          when 'oilProduction'
            tempData = serverApp.providers[config.dataset].oilProductionProvider.dataForViz1 config
          else 
            mainSelectionErrorHandler()
            return
        csvData = generateArrayFromObject(tempData, "viz1")

      when 'viz2'
        config = new Visualization2Configuration(serverApp, params)
        tempData = serverApp.providers[config.dataset].energyConsumptionProvider.dataForViz2 config
        csvData = generateArrayFromObject(tempData, "viz2")

      when 'viz3'
        config = new Visualization3Configuration(serverApp, params)
        tempData = serverApp.providers[config.dataset].electricityProductionProvider.dataForViz3(config)
        csvData = generateArrayFromObject(tempData, "viz3")

      when 'viz4'
        config = new Visualization4Configuration(serverApp, params)
        switch config.mainSelection
          when 'energyDemand'
            tempData = serverApp.providers[config.dataset].energyConsumptionProvider.dataForViz4 config
          when 'electricityGeneration'
            tempData = serverApp.providers[config.dataset].electricityProductionProvider.dataForViz4 config
          when 'oilProduction'
            tempData = serverApp.providers[config.dataset].oilProductionProvider.dataForViz4 config
          when 'gasProduction'
            tempData = serverApp.providers[config.dataset].gasProductionProvider.dataForViz4 config
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
      refinedResults = refineResults results
      res.attachment 'energyFutures.csv'
      res.write refinedResults
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
    when "viz1", "viz4"
      for k,v of csvDataObject
        v = filterSectorSourceUnitOut v
        hashArray = hashArray.concat v
      break
    when "viz2"
      for k,v of csvDataObject
        hashArray = hashArray.concat v
      break
    when "viz3"
      for tempChild in csvDataObject.children
        hashArray = hashArray.concat tempChild.children
      break
  
  return hashArray
  
filterSectorSourceUnitOut = (csvDataObject) ->
  for k,v of csvDataObject
    delete v.sector
    delete v.source
    delete v.unit
  return csvDataObject

refineResults = (csvData) ->
  filteredData = ''

  newLine = '\n'
  comma = ','

  mainSelectionField = @mainSelection + ','
  unitField = ',' + @unit
  datasetField = ',' + @dataset

  lines = csvData.split newLine
  if lines.length <= 0 then return ''

  # Setup data labels.
  switch @page
    when 'viz1', 'viz4'
      filteredData += 'main selection,' + lines[0] + ',unit,dataset' + newLine
      break
    when 'viz2'
      filteredData += lines[0] + ',dataset' + newLine
      break
    when 'viz3'
      filteredData += lines[0] + ',dataset' + newLine

  # Determine the index of the measurement value.
  valueIndex = lines[0].split(comma).indexOf('value')

  i = 1
  while i < lines.length
    fields = lines[i].split comma

    # Remove rows with zeroed (or one) values, and
    # add the missing attributes to each row.
    if fields[valueIndex] != '0' && fields[valueIndex] != '1'
      switch @page
        when 'viz1', 'viz4'
          filteredData += mainSelectionField + lines[i] + unitField + datasetField + newLine
        when 'viz2'
          filteredData += lines[i] + datasetField + newLine
        when 'viz3'
          filteredData += lines[i] + datasetField + newLine
    i++

  filteredData

errorHandler = (req, res, error, code, counter) ->

  Logger.error "csv data request (request C#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead code
  res.end "HTTP #{code} #{error.message}"


module.exports = CSVDataHandler