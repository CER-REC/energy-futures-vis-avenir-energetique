
EnsureTestServer = require '../testSupport/EnsureTestServer.coffee'


describe "sample", ->

  before EnsureTestServer

  it "tests", ->
    console.log 'wahoo too!'

