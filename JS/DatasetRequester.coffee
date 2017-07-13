QueryString = require 'query-string'
d3 = require 'd3'

Constants = require './Constants.coffee'

###
Dataset requester has a few jobs:
  - When a UI request to change the viz comes in, if we have the data, use the callback
  immediately
  - When a UI request to change the viz comes in, if we do not have the data, bottle the
  UI request and make an ajax request of the data
  - Whenever an ajax request for data returns, if we have a bottled request, check if we
  now have the data for the request. Use the bottled request's callback.
###


class DatasetRequester

  constructor: (@app, @providers) ->

    @bottledRequest = null

    @loadedStateViz1_4 = {}
    @loadedStateViz2_5 = {}
    @loadedStateViz3 = {}

    for datasetName, datasetDefinition of Constants.datasetDefinitions

      @loadedStateViz1_4[datasetName] = {}
      @loadedStateViz2_5[datasetName] = {}
      @loadedStateViz3[datasetName] = {}

      for mainSelection in Constants.mainSelections
        @loadedStateViz1_4[datasetName][mainSelection] = false

      for sector in Constants.sectors
        @loadedStateViz2_5[datasetName][sector] = {}
        for province in Constants.provinceRadioSelectionOptions
          @loadedStateViz2_5[datasetName][sector][province] = false

      for scenario in datasetDefinition.scenarios
        @loadedStateViz3[datasetName][scenario] = false



  haveDataForConfig: (configParams) ->
    switch configParams.page
      when 'viz1', 'viz4'
        @loadedStateViz1_4[configParams.dataset][configParams.mainSelection] == true
      when 'viz2'
        @loadedStateViz2_5[configParams.dataset][configParams.sector][configParams.province] == true
      when 'viz3'
        @loadedStateViz3[configParams.dataset][configParams.scenario] == true
      when 'viz5'
        # For a viz5 config: we require all of the data for an entire sector be to present
        for province in Constants.provinces
          if @loadedStateViz2_5[configParams.dataset][configParams.sector][province] == false
            return false

        true




  updateAndRequestIfRequired: (configParams, callback) ->

    # We only want the UI to respond to the most recently requested action.
    # Erase any previous bottled request.
    @bottledRequest = null

    if @haveDataForConfig configParams
      @hideSpinner()
      callback()
    else
      @showSpinner()
      @requestData configParams, callback


  # NB: Unlike most callbacks, this is NOT guaranteed to be called.
  # To avoid multiple updates to the visualization in response to data arriving, we store
  # only the last requested UI update. After each HTTP request that arrives, we check
  # whether we can update the UI with the data now present.
  # The callback (to update the visualization) is only called if it was the last requested
  # UI change.
  requestData: (configParams, callback) ->
    switch configParams.page
      when 'viz1', 'viz4'
        params =
          page: configParams.page
          dataset: configParams.dataset
          mainSelection: configParams.mainSelection
      when 'viz2'
        params =
          page: configParams.page
          dataset: configParams.dataset
          sector: configParams.sector
          province: configParams.province
      when 'viz3'
        params =
          page: configParams.page
          dataset: configParams.dataset
          scenario: configParams.scenario
      when 'viz5'
        params =
          page: configParams.page
          dataset: configParams.dataset
          sector: configParams.sector

        

    paramsString = QueryString.stringify params

    requestUrl = "json_data?#{paramsString}"

    http = new XMLHttpRequest()
    http.open 'GET', requestUrl

    @bottledRequest =
      configParams: configParams
      callback: callback

    http.onreadystatechange = =>
      if http.readyState == XMLHttpRequest.DONE
        if http.status == 200
          @dataReceived configParams, http.responseText
        else
          # TODO: something nicer than this!
          console.error 'Oops, json_data request failed. Request was:'
          console.error requestUrl
          console.error http


    http.send()




  dataReceived: (configParams, response) =>

    @handleDataLoad configParams, response


    # If the available data now satisfies the last requested configuration, switch the
    # visualization to that configuration
    if @bottledRequest? and @haveDataForConfig @bottledRequest.configParams

      # Carry out visual changes to the visualization, and update the viz's own config
      @hideSpinner()
      @bottledRequest.callback()

      @bottledRequest = null


  handleDataLoad: (configParams, response) ->

    # TODO: validate or sanity check the response data in some way
    # TODO: error handling (though it should never happen ... )
    data = JSON.parse response

    # If we have already loaded this chunk, don't load it again.
    # This can happen if the user triggers multiple requests for the same data, which
    # each resolve later.
    switch configParams.page
      when 'viz1', 'viz4'
        return if @loadedStateViz1_4[configParams.dataset][configParams.mainSelection] == true
      when 'viz2'
        return if @loadedStateViz2_5[configParams.dataset][configParams.sector][configParams.province] == true
      when 'viz3'
        return if @loadedStateViz3[configParams.dataset][configParams.scenario] == true


    # Mark data as having arrived, and add the data to the provider it belongs to
    switch configParams.page
      when 'viz1', 'viz4'
        @loadedStateViz1_4[configParams.dataset][configParams.mainSelection] = true
        switch configParams.mainSelection
          when 'energyDemand'
            @app.providers[configParams.dataset].energyConsumptionProvider.addData data.data
          when 'oilProduction'
            @app.providers[configParams.dataset].oilProductionProvider.addData data.data
          when 'electricityGeneration'
            @app.providers[configParams.dataset].electricityProductionProvider.addData data.data
          when 'gasProduction'
            @app.providers[configParams.dataset].gasProductionProvider.addData data.data

      when 'viz2'
        @loadedStateViz2_5[configParams.dataset][configParams.sector][configParams.province] = true
        @app.providers[configParams.dataset].energyConsumptionProvider.addData data.data

      when 'viz3'
        @loadedStateViz3[configParams.dataset][configParams.scenario] = true
        @app.providers[configParams.dataset].electricityProductionProvider.addData data.data

      when 'viz5'
        # For viz5, we return 13 chunks per request, one per province.
        # Each of those chunks may be loaded individually by a request to the viz2 data
        # endpoint. So, we check for the presence of each chunk individually before
        # loading it.
        # We also download and load data for all of Canada ('all'), since the endpoint
        # sends it, even though it is not needed for viz5.
        for province in Constants.provinceRadioSelectionOption
          continue if @loadedStateViz2_5[configParams.dataset][configParams.sector][province] == true

          @loadedStateViz2_5[configParams.dataset][configParams.sector][province] = true
          @app.providers[configParams.dataset].energyConsumptionProvider.addData data.data[province]

        


  showSpinner: ->
    d3.select '#dataLoadContainer'
      .classed 'hidden', false


  hideSpinner: ->
    d3.select '#dataLoadContainer'
      .classed 'hidden', true




# TODO: Load data in the background, when no other requests are ongoing?







module.exports = DatasetRequester









