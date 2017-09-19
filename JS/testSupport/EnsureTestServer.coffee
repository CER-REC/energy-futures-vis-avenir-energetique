TestServer = require '../servers/TestServer/TestServer.coffee'

currentServer = null

# Setup a server, for the purpose of running tests.




# coffeelint: disable=missing_fat_arrows
EnsureTestServer = (done) ->
# coffeelint: enable=missing_fat_arrows

  # The server reads several large files and takes a little while to start up, disable
  # mocha's 2s timeout
  @timeout 0

  if currentServer?
    done()
    return
  
  currentServer = TestServer()
  currentServer.on 'server-online', ->
    done()

module.exports = EnsureTestServer
