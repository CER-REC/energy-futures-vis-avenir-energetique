

# Platform.name may be one of: "browser" or "server"
# Necessary at a few points, where we simply have to have different behaviour in browser
# vs in server.

module.exports =
  name: 'browser'