Should = require 'should'
Request = require 'request-promise'
QueryString = require 'query-string'

EnsureTestServer = require '../testSupport/EnsureTestServer.coffee'


describe 'CSV Data Endpoints', ->

  before EnsureTestServer


  it 'Serves data for Visualization 1', ->
    parameters = QueryString.stringify
      dataset: 'oct2016'
      page: 'viz1'
      mainSelection: 'energyDemand'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/csv_data?#{parameters}"

    .then (csvResponse) ->
      pattern = /^(?:(?:"((?:""|[^"])+)"|([^,]*))(?:$|,))+$/
      output = pattern.exec csvResponse
      output.should.be.ok

  it 'Serves data for Visualization 2', ->
    parameters = QueryString.stringify
      dataset: 'oct2016'
      page: 'viz2'
      mainSelection: 'energyDemand'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/csv_data?#{parameters}"

    .then (csvResponse) ->
      pattern = /^(?:(?:"((?:""|[^"])+)"|([^,]*))(?:$|,))+$/
      output = pattern.exec csvResponse
      output.should.be.ok
  
  it 'Serves data for Visualization 3', ->
    parameters = QueryString.stringify
      dataset: 'oct2016'
      page: 'viz3'
      mainSelection: 'electricityGeneration'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/csv_data?#{parameters}"

    .then (csvResponse) ->
      pattern = /^(?:(?:"((?:""|[^"])+)"|([^,]*))(?:$|,))+$/
      output = pattern.exec csvResponse
      output.should.be.ok
  
  it 'Serves data for Visualization 4', ->
    parameters = QueryString.stringify
      dataset: 'oct2016'
      page: 'viz4'
      mainSelection: 'energyDemand'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/csv_data?#{parameters}"

    .then (csvResponse) ->
      pattern = /^(?:(?:"((?:""|[^"])+)"|([^,]*))(?:$|,))+$/
      output = pattern.exec csvResponse
      output.should.be.ok