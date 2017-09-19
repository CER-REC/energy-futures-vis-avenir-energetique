Should = require 'should'
Request = require 'request-promise'
QueryString = require 'query-string'

EnsureTestServer = require '../testSupport/EnsureTestServer.coffee'


describe 'JSON Data Endpoints', ->

  before EnsureTestServer


  it 'Serves data for Visualization 1', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz1'
      mainSelection: 'gasProduction'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      response = JSON.parse jsonResponse
      response.data[0].unit.should.equal 'Million cubic metres Per Day'




  it 'Serves data for Visualization 2', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz2'
      province: 'AB'
      sector: 'industrial'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      response = JSON.parse jsonResponse
      response.data[0].province.should.equal 'AB'
      response.data[0].sector.should.equal 'industrial'
  


  it 'Serves data for Visualization 3', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz3'
      scenario: 'noLng'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      response = JSON.parse jsonResponse
      response.data[0].unit.should.equal 'GW.h'
  


  it 'Serves data for Visualization 4', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz4'
      mainSelection: 'electricityGeneration'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      response = JSON.parse jsonResponse
      response.data[0].unit.should.equal 'GW.h'


  it 'Serves data for Visualization 5', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz5'
      sector: 'commercial'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      response = JSON.parse jsonResponse
      response.data.MB[0].unit.should.equal 'Petajoules'
      response.data.MB[0].sector.should.equal 'commercial'



  it 'Serves an error for Visualization 1', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz1'
      mainSelection: 'an invalid parameter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      Should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400


  it 'Serves an error for Visualization 2', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz2'
      province: 'AB'
      sector: 'an invalid parameter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      Should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400
  


  it 'Serves an error for Visualization 3', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz3'
      scenario: 'an invalid parameter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      Should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400


  it 'Serves an error for Visualization 4', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz4'
      mainSelection: 'an invalid parameter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      Should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400


  it 'Serves an error for Visualization 5', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz5'
      sector: 'an invalid sector'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/json_data?#{parameters}"

    .then (jsonResponse) ->
      Should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400



