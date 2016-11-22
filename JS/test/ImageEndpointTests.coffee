Should = require 'should'
Request = require 'request-promise'
QueryString = require 'query-string'

EnsureTestServer = require '../testSupport/EnsureTestServer.coffee'


describe "Image Generation Endpoints", ->

  before EnsureTestServer

  it "Serves HTML of the visualization", ->
    parameters = QueryString.stringify
      # dataset: 'jan2016' # TODO: support datasets
      page: 'viz1'
      mainSelection: 'oilProduction'
      unit: 'kilobarrels'
      scenario: 'high'
      provinces: 'BC,AB,SK'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/html_image?#{parameters}"

    .then (response) ->
      (response.match /<html>/).length.should.equal 1
      (response.match /<\/html>/).length.should.equal 1
      (response.match /<svg/).length.should.equal 1
      (response.match /<\/svg>/).length.should.equal 1



  it "Serves a PNG of the visualization", ->
    parameters = QueryString.stringify
      # dataset: 'jan2016' # TODO: support datasets
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


  it "Serves an error for incorrect parameters to the HTML endpoint.", ->
    parameters = QueryString.stringify
      page: 'some invalid paramter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/html_image?#{parameters}"

    .then (response) ->
      should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      response.statusCode.should.equal 400


  it.only "Serves an error for incorrect parameters to the PNG endpoint.", ->
    parameters = QueryString.stringify
      page: 'some invalid paramter'

    Request "#{process.env.HOST}:#{process.env.PORT_NUMBER}/png_image/foo.png?#{parameters}"

    .then (response) ->
      should.fail "Shouldn't respond with 200 for an error condition."

    .catch (response) ->
      console.log response
      response.statusCode.should.equal 400





