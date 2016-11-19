# app = require('../app/app');
currentServer = null;

# Setup a server, for the purpose of running tests.

setupTestServer = (done) ->
  if currentServer?
    done()
    return
  
  currentServer = app()
  currentServer.app.on 'app-server-online', function ->
    done();

module.exports = setupTestServer
