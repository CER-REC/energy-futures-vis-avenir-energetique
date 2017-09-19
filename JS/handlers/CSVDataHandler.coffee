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
Visualization5Configuration = require '../VisualizationConfigurations/visualization5Configuration.coffee'

ServerData = require '../server/ServerData.coffee'
Constants = require '../Constants.coffee'

requestCounter = 0

CSVDataHandler = (req, res) ->

  Promise.all(ServerData.loadPromises).then ->

    time = Date.now()

    query = url.parse(req.url).search
    requestCounter++
    counter = requestCounter
    language = req.query.language
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

    Keys =
      selectionKey: Tr.csvData['mainSelection']['mainSelection'][language]
      provinceKey: Tr.csvData['province']['province'][language]
      scenarioKey: Tr.csvData['scenario']['scenario'][language]
      sectorKey: Tr.csvData['sector']['sector'][language]
      sourceKey: Tr.csvData['source']['source'][language]
      yearKey: Tr.csvData['year'][language]
      valueKey: Tr.csvData['value'][language]
      unitKey: Tr.csvData['unit']['unit'][language]
      datasetKey: Tr.csvData['dataset']['dataset'][language]
      baseYearKey: Tr.csvData['baseYear'][language]
      comparisonYearKey: Tr.csvData['comparisonYear'][language]
      baseValueKey: Tr.csvData['baseValue'][language]
      comparisonValueKey: Tr.csvData['comparisonValue'][language]
      baseTotalKey: Tr.csvData['baseTotal'][language]
      comparisonTotalKey: Tr.csvData['comparisonTotal'][language]
      basePercentageKey: Tr.csvData['basePercentage'][language]
      comparisonPercentageKey: Tr.csvData['comparisonPercentage'][language]

    # Parse the parameters with a configuration object, and then hand them off to a
    # visualization object. The visualizations render the graphs in their constructors.
    switch req.query.page
      when 'viz1'
        config = new Visualization1Configuration serverApp, params
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
        csvData = generateArrayFromObject tempData, 'viz1', config, Keys

      when 'viz2'
        config = new Visualization2Configuration serverApp, params
        tempData = serverApp.providers[config.dataset].energyConsumptionProvider.dataForViz2 config
        csvData = generateArrayFromObject(tempData, 'viz2', config, Keys)

      when 'viz3'
        config = new Visualization3Configuration serverApp, params
        tempData = serverApp.providers[config.dataset].electricityProductionProvider.dataForViz3(config)
        csvData = generateArrayFromObject(tempData, 'viz3', config, Keys)

      when 'viz4'
        config = new Visualization4Configuration serverApp, params
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
        csvData = generateArrayFromObject tempData, 'viz4', config, Keys

      when 'viz5'
        config = new Visualization5Configuration serverApp, params
        tempData = serverApp.providers[config.dataset].energyConsumptionProvider.dataForViz5 config
        csvData = generateArrayFromObject(tempData, 'viz5', config, Keys)

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
      res.writeHead 400
      res.end()
      
mainSelectionErrorHandler = ->
  errorHandler req, res, new Error("Visualization 'mainSelection' parameter not specified or not recognized."), 400, counter


generateArrayFromObject = (csvDataObject, viz, config, Keys) ->
  hashArray = []
  switch viz
    when 'viz1', 'viz4'
      for k,v of csvDataObject
        hashArray = hashArray.concat filterViz1andViz4(v, config, Keys)
      break
    when 'viz2'
      for k,v of csvDataObject
        hashArray = hashArray.concat filterViz2(v, config, Keys)
      break
    when 'viz3'
      for tempChild in csvDataObject.children
        hashArray = hashArray.concat tempChild.children
      hashArray = filterViz3 hashArray, config, Keys
      break
    when 'viz5'
      for k,v of csvDataObject
        hashArray = hashArray.concat filterViz5(v, config, Keys)
      break
  
  return hashArray
  
filterViz1andViz4 = (csvDataObject, config, Keys) ->
  filteredData = []

  for k,v of csvDataObject
    item = {}

    if v.value == 0 then continue

    item[Keys.selectionKey] = Tr.csvData['mainSelection'][config.mainSelection][config.language]
    if v.province? then item[Keys.provinceKey] = Tr.csvData['province'][v.province][config.language]
    if v.scenario? then item[Keys.scenarioKey] = Tr.csvData['scenario'][v.scenario][config.language]
    if v.year? then item[Keys.yearKey] = v.year
    if v.value? then item[Keys.valueKey] = v.value
    item[Keys.unitKey] = Tr.csvData['unit'][config.unit][config.language]
    item[Keys.datasetKey] = Tr.csvData['dataset'][config.dataset][config.language]

    filteredData.push item

  return filteredData

filterViz2 = (csvDataObject, config, Keys) ->
  filteredData = []

  for k,v of csvDataObject
    item = {}

    if v.value == 0 then continue

    if v.province? then item[Keys.provinceKey] = Tr.csvData['province'][v.province][config.language]
    if v.sector? then item[Keys.sectorKey] = Tr.csvData['sector'][v.sector][config.language]
    if v.source? then item[Keys.sourceKey] = Tr.csvData['source'][v.source][config.language]
    if v.scenario? then item[Keys.scenarioKey] = Tr.csvData['scenario'][v.scenario][config.language]
    if v.year? then item[Keys.yearKey] = v.year
    if v.value? then item[Keys.valueKey] = v.value
    item[Keys.unitKey] = Tr.csvData['unit'][config.unit][config.language]
    item[Keys.datasetKey] = Tr.csvData['dataset'][config.dataset][config.language]
  
    filteredData.push item

  return filteredData

filterViz5 = (csvDataObject, config, Keys) ->
  filteredData = []

  for k,v of csvDataObject
    item = {}

    # Process all provinces only if in All Canada mode. Process the left and right provinces only otherwise. 
    if config.leftProvince != 'all' and v.province != config.leftProvince and v.province != config.rightProvince then continue

    if v.province? then item[Keys.provinceKey] = Tr.csvData['province'][v.province][config.language]
    if v.sector? then item[Keys.sectorKey] = Tr.csvData['sector'][v.sector][config.language]
    if v.source? then item[Keys.sourceKey] = Tr.csvData['source'][v.source][config.language]
    if v.scenario? then item[Keys.scenarioKey] = Tr.csvData['scenario'][v.scenario][config.language]
    if v.value? then item[Keys.valueKey] = v.value
    if v.unit? then item[Keys.unitKey] = Tr.csvData['unit'][v.unit][config.language]
    if v.baseValue? then item[Keys.baseValueKey] = v.baseValue
    if v.comparisonValue? then item[Keys.comparisonValueKey] = v.comparisonValue
    if v.baseTotal? then item[Keys.baseTotalKey] = v.baseTotal
    if v.comparisonTotal? then item[Keys.comparisonTotalKey] = v.comparisonTotal
    if v.basePercentage? then item[Keys.basePercentageKey] = v.basePercentage
    if v.comparisonPercentage? then item[Keys.comparisonPercentageKey] = v.comparisonPercentage
    if v.baseYear? then item[Keys.baseYearKey] = v.baseYear
    if v.comparisonYear? then item[Keys.comparisonYearKey] = v.comparisonYear
    item[Keys.datasetKey] = Tr.csvData['dataset'][config.dataset][config.language]

    filteredData.push item

  return filteredData

filterViz3 = (hashArray, config, Keys) ->
  filteredData = []

  for k,v of hashArray
    item = {}

    # Remove entries corresponding to empty bubbles (empty bubbles
    # have a radius of 1).
    if v.size == 1 then continue

    # TODO: Visualization 3 data format
    # T data fields for visualization 3 are formatted differently based on
    # whether it is viewed by province or source.
    # If data is viewed by source, the field 'source' contains the province
    # data, and the name field is in the format 'province source'.
    # If the data is viewed by province, the field 'source' contains the
    # source data, and the name field is in the format 'source province'
    if config.viewBy == 'province'
      province = v.name.substring v.name.length - 2
      item[Keys.provinceKey] = Tr.csvData['province'][province][config.language]
      item[Keys.sourceKey] = Tr.csvData['source'][v.source][config.language]
    else
      source = v.id.substring 2
      item[Keys.provinceKey] = Tr.csvData['province'][v.source][config.language]
      item[Keys.sourceKey] = Tr.csvData['source'][source][config.language]

    item[Keys.valueKey] = v.size
    item[Keys.unitKey] = Tr.csvData['unit'][config.unit][config.language]
    item[Keys.datasetKey] = Tr.csvData['dataset'][config.dataset][config.language]
    
    filteredData.push item

  return filteredData

errorHandler = (req, res, error, code, counter) ->

  Logger.error "csv data request (request C#{counter}) error: #{error.message}"
  Logger.error error.stack

  res.writeHead code
  res.end "HTTP #{code} #{error.message}"


module.exports = CSVDataHandler