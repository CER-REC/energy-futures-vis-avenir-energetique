
TestServer = require '../servers/TestServer/TestServer.coffee'
currentServer = null

# Setup a server, for the purpose of running tests.

EnsureTestServer = (done) ->

  # The server takes a little while to start up, disable mocha's timeout
  @timeout 0

  if currentServer?
    console.log "server exists"
    done()
    return
  
  currentServer = TestServer()
  console.log "booting new server"
  currentServer.on 'server-online', ->
    console.log "new server online"
    done()

module.exports = EnsureTestServer
