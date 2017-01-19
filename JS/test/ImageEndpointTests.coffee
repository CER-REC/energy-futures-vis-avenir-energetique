Should = require 'should'
Request = require 'request-promise'
QueryString = require 'query-string'

EnsureTestServer = require '../testSupport/EnsureTestServer.coffee'


describe 'Image Generation Endpoints', ->

  before EnsureTestServer

  it 'Serves a PNG of the visualization', ->
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz4'
      mainSelection: 'oilProduction'
      unit: 'kilobarrels'
      scenario: 'high'
      provinces: 'BC,AB,SK'

    Request
      uri: "#{process.env.HOST}:#{process.env.PORT_NUMBER}/png_image/foo.png?#{parameters}"
      resolveWithFullResponse: true

    .then (response) ->
      response.headers['content-type'].should.equal 'image/png'
      response.headers['content-disposition'].should.equal 'attachment'


  it 'Serves an error for incorrect parameters to the PNG endpoint.', ->
    parameters = QueryString.stringify
      page: 'some invalid parameter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/png_image/foo.png?#{parameters}"

    .then ->
      Should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400



  it 'Serves a cropped PNG of the visualization from /social_png', =>
    @timeout 5000
    parameters = QueryString.stringify
      dataset: 'jan2016'
      page: 'viz4'
      mainSelection: 'oilProduction'
      unit: 'kilobarrels'
      scenario: 'high'
      provinces: 'BC,AB,SK'

    Request
      uri: "#{process.env.HOST}:#{process.env.PORT_NUMBER}/social_png?#{parameters}"
      resolveWithFullResponse: true

    .then (response) ->
      response.headers['content-type'].should.equal 'image/png'


  it 'Serves an error for incorrect parameters to the social PNG endpoint.', ->
    parameters = QueryString.stringify
      page: 'some invalid parameter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/social_png?#{parameters}"

    .then ->
      Should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400



