Promise = require 'bluebird'
url = require 'url'
queryString = require 'query-string'


Logger = require '../Logger.coffee'
ServerDataChunksPromises = require '../server/ServerDataChunksPromises.coffee'
Constants = require '../Constants.coffee'



requestCounter = 0

module.exports = (req, res) ->

  requestCounter += 1
  time = Date.now()
  query = url.parse(req.url).search
  params = queryString.parse(query)

  new Promise (resolve, reject) ->
    if Constants.datasets.includes params.dataset
      resolve ServerDataChunksPromises[params.dataset]
    else
      reject new Error "Unrecognized dataset parameter."

  .then (serverDataChunks) ->
    return new Promise (resolve, reject) ->
      response = {}
      switch params.page
        when 'viz1', 'viz4'
          if Constants.mainSelections.includes params.mainSelection
            response.data = serverDataChunks.viz1And4Chunks[params.mainSelection]
            resolve response
          else
            reject new Error "Unrecognized mainSelection parameter."

        when 'viz2'
          if Constants.sectors.includes(params.sector) and Constants.provinceRadioSelectionOptions.includes(params.province)
            response.data = serverDataChunks.viz2Chunks[params.sector][params.province]
            resolve response
          else
            reject new Error "Unrecognized sector or province parameter."

        when 'viz3'
          if Constants.datasetDefinitions[params.dataset].scenarios.includes params.scenario
            response.data = serverDataChunks.viz3Chunks[params.scenario]
            resolve response
          else
            reject new Error "Unrecognized scenario parameter."
        else
          reject new Error "Unrecognized page parameter." 


  .then (response) ->
    res.setHeader "content-type", "application/json"
    res.setHeader 'cache-control', "max-age=#{Constants.cacheDuration}" 
    res.write JSON.stringify(response)
    res.end()

    Logger.info "json_data (request J#{requestCounter}): #{query} Time: #{Date.now() - time}"

  .catch (error) ->
    Logger.error "json_data (request J#{requestCounter}) error: #{error.message}"
    Logger.error error.stack

    # TODO: Handle 500 errors
    res.writeHead 400
    res.end "HTTP 400: #{error.message}"
