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
    @viewBy = req.query.viewBy
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

    @Keys =
      selectionKey: Tr.csvData['mainSelection']['mainSelection'][@language]
      provinceKey: Tr.csvData['province']['province'][@language]
      scenarioKey: Tr.csvData['scenario']['scenario'][@language]
      scetorKey: Tr.csvData['sector']['sector'][@language]
      sourceKey: Tr.csvData['source']['source'][@language]
      yearKey: Tr.csvData['year'][@language]
      valueKey: Tr.csvData['value'][@language]
      unitKey: Tr.csvData['unit']['unit'][@language]
      datasetKey: Tr.csvData['dataset']['dataset'][@language]

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
      res.attachment 'energyFutures.csv'
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
    when "viz1", "viz4"
      for k,v of csvDataObject
        hashArray = hashArray.concat filterViz1andViz4 v
      break
    when "viz2"
      for k,v of csvDataObject
        hashArray = hashArray.concat filterViz2 v
      break
    when "viz3"
      for tempChild in csvDataObject.children
        hashArray = hashArray.concat tempChild.children
      hashArray = filterViz3 hashArray
      break
  
  return hashArray
  
filterViz1andViz4 = (csvDataObject) ->
  filteredData = []
  
  for k,v of csvDataObject
    item = {}

    if v.value == 0 then continue

    item[Keys.selectionKey] = Tr.csvData['mainSelection'][@mainSelection][@language]
    if v.province? then item[Keys.provinceKey] = Tr.csvData['province'][v.province][@language]
    if v.scenario? then item[Keys.scenarioKey] = Tr.csvData['scenario'][v.scenario][@language]
    if v.year? then item[Keys.yearKey] = v.year
    if v.value? then item[Keys.valueKey] = v.value
    item[Keys.unitKey] = Tr.csvData['unit'][@unit][@language]
    item[Keys.datasetKey] = Tr.csvData['dataset'][@dataset][@language]

    filteredData.push item

  return filteredData

filterViz2 = (csvDataObject) ->
  filteredData = []

  for k,v of csvDataObject
    item = {}

    if v.value == 0 then continue

    if v.province? then item[Keys.provinceKey] = Tr.csvData['province'][v.province][@language]
    if v.sector? then item[Keys.scetorKey] = Tr.csvData['sector'][v.sector][@language]
    if v.source? then item[Keys.sourceKey] = Tr.csvData['source'][v.source][@language]
    if v.scenario? then item[Keys.scenarioKey] = Tr.csvData['scenario'][v.scenario][@language]
    if v.year? then item[Keys.yearKey] = v.year
    if v.value? then item[Keys.valueKey] = v.value
    item[Keys.unitKey] = Tr.csvData['unit'][@unit][@language]
    item[Keys.datasetKey] = Tr.csvData['dataset'][@dataset][@language]
  
    filteredData.push item

  return filteredData

filterViz3 = (hashArray) ->
  filteredData = []

  for k,v of hashArray
    item = {}

    if v.size == 1 then continue

    if @viewBy == 'province'
      province = v.name.substring(v.name.length - 2)
      item[Keys.provinceKey] = Tr.csvData['province'][province][@language]
      item[Keys.sourceKey] = Tr.csvData['source'][v.source][@language]
    else
      source = v.id.substring(2)
      item[Keys.provinceKey] = Tr.csvData['province'][v.source][@language]
      item[Keys.sourceKey] = Tr.csvData['source'][source][@language]

    item[Keys.valueKey] = v.size
    item[Keys.unitKey] = Tr.csvData['unit'][@unit][@language]
    item[Keys.datasetKey] = Tr.csvData['dataset'][@dataset][@language]
    
    filteredData.push item

  return filteredData

errorHandler = (req, res, error, code, counter) ->

  Logger.error "csv data request (request C#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead code
  res.end "HTTP #{code} #{error.message}"


module.exports = CSVDataHandler