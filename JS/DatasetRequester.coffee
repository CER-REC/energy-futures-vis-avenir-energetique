_ = require 'lodash'
QueryString = require 'query-string'

Constants = require '../Constants.coffee'



# Dataset requester has a few jobs:
# - When a UI request to change the viz comes in, if we have the data, pass it through to the provider
# - When a UI request to cahnge the viz comes in, if we do not have the data, bottle the UI request and make an ajax request of the data

# - Whenever an ajax request for data returns, if we have a bottled request, check if we now have the data for the request. unbottle the request and discard it, and do the navigation



class DatasetRequestor


  constructor: (@app, @providers) ->

    @bottledConfigParams = null

    @loadedStateViz1_4 = {}
    @loadedStateViz2 = {}
    @loadedStateViz3 = {}



    for datasetName, datasetDefinition of Constants.datasetDefinitions

      @loadedStateViz1_4[datasetName] = []
      @loadedStateViz2[datasetName] = []
      @loadedStateViz3[datasetName] = []

      for mainSelection in Constants.mainSelections
        @loadedStateViz1_4[datasetName][mainSelection] = false

      for sector in Constants.sectors
        @loadedStateViz2[datasetName][sector] = {}
        for province in Constants.provinceRadioSelectionOptions
          @loadedStateViz2[datasetName][sector][province] = false

      for scenario in Constants.datasetDefinition.scenarios
        @loadedStateViz3[datasetName][scenario] = false



    # check if data loaded
    # if data loaded, pass config to providers
    # if data not loaded, make ajax request and... return null? and start spinner





  dataLoaded: (config) ->
    haveData = haveDataForConfig config
    if not haveData
      @requestData config
    return haveData



  haveDataForConfig: (config) ->
    switch config.page
      when 'viz1, viz4'
        @loadedStateViz1_4[config.dataset][config.mainSelection] == true
      when 'viz2'
        @loadedStateViz2[config.dataset][config.sector][config.province] == true
      when 'viz3'
        @loadedStateViz3[config.dataset][config.sector][config.province] == true


  requestData: (config) ->
    # TODO: Should this be a method on the config objects instead?
    switch config.page
      when 'viz1, viz4'
        params = 
          dataset: config.dataset
          mainSelection: config.mainSelection
      when 'viz2'
        params = 
          dataset: config.dataset
          sector: config.sector
          province: config.province
      when 'viz3'
        params = 
          dataset: config.dataset
          scenario: config.scenario

    paramsString = QueryString.stringify params

    http = new XMLHttpRequest()
    http.open 'GET', "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data/#{paramsString}"

    requestedConfigParams = _.cloneDeep config.routerParams()
    requestedConfigParams.page = config.page
    @bottledConfigParams = requestedConfigParams

    http.onreadystatechange = =>
      if http.readyState == XMLHttpRequest.DONE
        if http.status == 200
          console.log 'we get data'
          console.log http.responseText
          @dataReceived requestedConfig, http.responseText
        else
          # TODO: something nicer than this!
          console.error "Oops, json_data request failed. Request was:"
          console.error "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data/#{params}"
          console.error http


    http.send()




  dataReceived: (configParams, response) =>
    data = JSON.parse response

    # TODO: validate or sanity check the response data in some way

    # Mark data as having arrived
    switch configParams.page
      when 'viz1, viz4'
        @loadedStateViz1_4[configParams.dataset][configParams.mainSelection] = true
      when 'viz2'
        @loadedStateViz2[configParams.dataset][configParams.sector][configParams.province] = true
      when 'viz3'
        @loadedStateViz3[configParams.dataset][configParams.sector][configParams.province] = true

    # Add the data to the provider it belongs to



    # If the available data now satisfies the last requested configuration, switch the
    # visualization to that configuration
    if @bottledConfigParams? and @haveDataForConfig @bottledConfigParams
      @bottledConfigParams = null

      # TODO: find the right config object on app, set it from bottled config, navigate

      @hideSpinner()






  showSpinner: ->


  hideSpinner: ->




# TODO: Figure out how to handle the initial load case. Probably need to stop anything from loading at all until that first request comes through

# TODO: Also figure out: background data loading logic? maybe put that off to later =/

















