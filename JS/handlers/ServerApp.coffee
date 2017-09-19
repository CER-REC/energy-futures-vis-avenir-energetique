

# This is a slimmed down, duck typed stand in of the 'App' class which appears on the
# client.
# Rather than driving the entire client app, on the server all we need this class to do
# is to provide a few pieces of information and compatibility to visualization instances
# while they run on the server.


class ServerApp

  constructor: (@window, @providers) ->

    @language = 'en'

    # Set animation duration to zero, so that we do not waste time animating
    @animationDuration = 0
    @pillAnimationDuration = 0
    @pagePadding = 0

  setLanguage: (language) ->
    @language = language if language == 'en' or language == 'fr'

module.exports = ServerApp


























