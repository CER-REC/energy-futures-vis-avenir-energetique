Promise = require 'bluebird'
url = require 'url'
queryString = require 'query-string'


Logger = require '../Logger.coffee'
ServerDataChunksPromise = require '../server/ServerDataChunksPromise.coffee'
Constants = require '../Constants.coffee'


requestCounter = 0

module.exports = (req, res) ->

  ServerDataChunksPromise.then (serverDataChunks) ->
    requestCounter += 1
    time = Date.now()
    query = url.parse(req.url).search
    params = queryString.parse(query)

    console.log params
    console.log Constants.sectors.includes params.sector 
    console.log Constants.provinceRadioSelectionOptions.includes params.province


    switch params.page
      when 'viz1', 'viz4'
        if Constants.mainSelections.includes params.mainSelection
          response = serverDataChunks.viz1And4Chunks[params.mainSelection]
        else
          errorMessage = "Unrecognized mainSelection parameter."
      when 'viz2'
        if Constants.sectors.includes(params.sector) and Constants.provinceRadioSelectionOptions.includes(params.province)
          response = serverDataChunks.viz2Chunks[params.sector][params.province]
        else
          errorMessage = "Unrecognized sector or province parameter."
      when 'viz3'
        # TODO: needs to handle multiple data sets
        if Constants.scenarios.includes params.scenario
          response = serverDataChunks.viz3Chunks[params.scenario]
        else
          errorMessage = "Unrecognized scenario parameter."
      else
        errorMessage = "Unrecognized page parameter." 



    if response?
      res.write JSON.stringify(response)
      res.end()
    else
      res.writeHead 400
      res.end "HTTP 400: #{errorMessage}"

    Logger.info "json_data (request J#{requestCounter}): #{query} Time: #{Date.now() - time}"



