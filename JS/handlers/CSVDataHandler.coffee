Promise = require 'bluebird'
url = require 'url'
queryString = require 'query-string'
d3 = require 'd3'

Tr = require '../TranslationTable.coffee'
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
    @language = req.query.language
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
        v = filterViz1andViz4 v
        hashArray = hashArray.concat v
      break
    when "viz2"
      for k,v of csvDataObject
        v = filterViz2 v
        hashArray = hashArray.concat v
      break
    when "viz3"
      for tempChild in csvDataObject.children
        hashArray = hashArray.concat tempChild.children
      hashArray = filterViz3 hashArray
      break
  
  return hashArray
  
filterViz1andViz4 = (csvDataObject) ->
  for k,v of csvDataObject
    delete v.sector
    delete v.source
    delete v.unit
  return csvDataObject

filterViz2 = (csvDataObject) ->
  for k,v of csvDataObject
    delete v.unit
  return csvDataObject

filterViz3 = (hashArray) ->
  for k,v of hashArray
    v.province = v.name.substring(v.name.length - 2)
    delete v.name
    delete v.id
  return hashArray

translateResults = (lines) ->
  i = 0
  comma = ','
  
  # Get the indices of each of the columns.
  valueIndex = lines[0].split(comma).indexOf('value')
  sizeIndex = lines[0].split(comma).indexOf('size')
  yearIndex = lines[0].split(comma).indexOf('year')
  provinceIndex = lines[0].split(comma).indexOf('province')
  sectorIndex = lines[0].split(comma).indexOf('sector')
  sourceIndex = lines[0].split(comma).indexOf('source')
  scenarioIndex = lines[0].split(comma).indexOf('scenario')
  
  # Translate numerical columns.
  fields = lines[0].split comma
  if valueIndex > -1 then fields[valueIndex] = Tr.csvData['value'][@language]
  if sizeIndex > -1 then fields[sizeIndex] = Tr.csvData['value'][@language]
  if yearIndex > -1 then fields[yearIndex] = Tr.csvData['year'][@language]
  lines[0] = fields.join()

  # translate data.
  while i < lines.length
    fields = lines[i].split comma
    
    if provinceIndex > -1 then fields[provinceIndex] = Tr.csvData['province'][fields[provinceIndex]][@language]
    if sectorIndex > -1 then fields[sectorIndex] = Tr.csvData['sector'][fields[sectorIndex]][@language]
    if sourceIndex > -1 then fields[sourceIndex] = Tr.csvData['source'][fields[sourceIndex]][@language]
    if scenarioIndex > -1 then fields[scenarioIndex] = Tr.csvData['scenario'][fields[scenarioIndex]][@language]
    
    lines[i] = fields.join()
    
    i++

  lines

refineResults = (csvData) ->
  filteredData = ''

  newLine = '\n'
  comma = ','

  if @mainSelection? then mainSelectionField = Tr.csvData['mainSelection'][@mainSelection][@language] + ','
  unitField = ',' + Tr.csvData['unit'][@unit][@language]
  datasetField = ',' + Tr.csvData['dataset'][@dataset][@language]

  lines = csvData.split newLine
  lines = translateResults lines

  if lines.length <= 0 then return ''

  # Setup data labels.
  switch @page
    when 'viz1', 'viz4'
      filteredData += Tr.csvData['mainSelection']['mainSelection'][@language] + ',' + lines[0] + ',' + Tr.csvData['unit']['unit'][@language] + ',' + Tr.csvData['dataset']['dataset'][@language]+ newLine
      break
    when 'viz2'
      filteredData += lines[0] + ',' + Tr.csvData['unit']['unit'][@language] + ',' + Tr.csvData['dataset']['dataset'][@language]+ newLine
      break
    when 'viz3'
      filteredData += lines[0] + ',' + Tr.csvData['unit']['unit'][@language] + ',' + Tr.csvData['dataset']['dataset'][@language]+ newLine

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
          filteredData += lines[i] + unitField + datasetField + newLine
        when 'viz3'
          filteredData += lines[i] + unitField + datasetField + newLine
    i++

  filteredData

errorHandler = (req, res, error, code, counter) ->

  Logger.error "csv data request (request C#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead code
  res.end "HTTP #{code} #{error.message}"


module.exports = CSVDataHandler