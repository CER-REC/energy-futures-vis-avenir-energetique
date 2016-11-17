Promise = require 'bluebird'
url = require 'url'
queryString = require 'query-string'

PrepareQueryParams = require '../PrepareQueryParams.coffee'
Logger = require '../Logger.coffee'
ServerData = require '../server/ServerData.coffee'

Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'

requestCounter = 0

module.exports = (req, res) ->

  Promise.join ServerData.oilPromise, ServerData.gasPromise, ServerData.energyPromise, ServerData.electricityPromise, ->

      requestCounter += 1
      Logger.info "json_data (request J#{requestCounter}): #{query}"

      query = url.parse(req.url).search
      params = PrepareQueryParams queryString.parse(query)

      respondWithJson req, res,
        data: getResponseData()
        yAxisMaximum: getYAxisMaximum()




getResponseData = ->

  serverApp = new ServerApp null,
    energyConsumptionProvider: ServerData.energyConsumptionProvider
    oilProductionProvider: ServerData.oilProductionProvider
    gasProductionProvider: ServerData.gasProductionProvider
    electricityProductionProvider: ServerData.electricityProductionProvider

  # Parse the parameters with a configuration object
  switch req.query.page
    when 'viz1'
      config = new Visualization1Configuration(serverApp, params)

      # TODO: Should the configuration know how to get its data?
      switch
        when config.mainSelection == 'energyDemand'
          responseData = ServerData.energyConsumptionProvider.dataForViz1(config)
        when config.mainSelection == 'oilProduction'
          responseData = ServerData.oilProductionProvider.dataForViz1(config)
        when config.mainSelection == 'electricityGeneration'
          responseData = ServerData.electricityProductionProvider.dataForViz1(config)
        when config.mainSelection == 'gasProduction'
          responseData = ServerData.gasProductionProvider.dataForViz1(config)

    when 'viz2'
      config = new Visualization2Configuration(serverApp, params)
      responseData = ServerData.energyConsumptionProvider.dataForViz2(config)

    when 'viz3'
      config = new Visualization3Configuration(serverApp, params)
      # TODO: We need to respond with data for all years, for the given configuration
      responseData = ServerData.electricityProductionProvider.dataForViz3(config)

    when 'viz4'
      config = new Visualization4Configuration(serverApp, params)
  
      # TODO: Should the configuration know how to get its data?
      switch
        when config.mainSelection == 'energyDemand'
          responseData = ServerData.energyConsumptionProvider.dataForViz4(config)
        when config.mainSelection == 'oilProduction'
          responseData = ServerData.oilProductionProvider.dataForViz4(config)
        when config.mainSelection == 'electricityGeneration'
          responseData = ServerData.electricityProductionProvider.dataForViz4(config)
        when config.mainSelection == 'gasProduction'
          responseData = ServerData.gasProductionProvider.dataForViz4(config)

    responseData

  # unpack params
  # init a config and serverapp

  # get data from provider
  # get totals from provider
  # serialize
  # respond
  # profit


getYAxisMaximum = ->








respondWithJson = (req, res, responseData) ->
  res.setHeader "content-type", "image/png"

  # TODO: Cache it?
  # @res.setHeader 'cache-control', "max-age=600" 

  res.write JSON.stringify(responseData)
  res.end()

#             else 
#               errorHandler req, res, new Error("Visualization 'page' parameter not specified or not recognized."), 400, counter
#               return


#     catch error
#       errorHandler req, res, error, 500, counter


# errorHandler = (req, res, error, code, counter) ->

#   Logger.error "html_image (request H#{counter}) error: #{error.message}"
#   Logger.error error.stack

#   res.writeHead code
#   res.end "HTTP #{code} #{error.message}"


# module.exports = HtmlImageHandler

