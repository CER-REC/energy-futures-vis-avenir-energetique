Constants = require './Constants.coffee'

# Google analytics reporting integration, tailored for the NEB.
class AnalyticsReporter

  constructor: (@app) ->
    if @app.window.ga?
      @ga = @app.window.ga
      @setupVideoAnalytics()
    else
      console.warn 'Google analytics object not found.'

  setupVideoAnalytics: ->

    # We want to instrument the video player with analytics, but it lives in an iframe.
    # Communication can only be initiated from the iframe to the parent window.
    # So, we add a global function to do the reporting, to be called in the iframe's
    # context. See views/wet_video_reporter.mustache
    @app.window.attachVideoAnalytics = (videoElement) =>

      videoElement.addEventListener 'timeupdate', =>
        @reportEvent 'Video', "Played: #{videoElement.currentTime}s"

      videoElement.addEventListener 'play', =>
        @reportEvent 'Video', 'Play'

      videoElement.addEventListener 'pause', =>
        @reportEvent 'Video', 'Pause'

      videoElement.addEventListener 'ended', =>
        @reportEvent 'Video', 'Ended'


  reportPage: (params) ->
    return unless @ga?
    
    ###
      The following custom dimensions need to be set up for this app in Google Analytics
      See also: Constants.googleAnalyticsCustomDimensions for index assignments

      vis_page
      vis_mainSelection
      vis_unit
      vis_dataset
      vis_sector
      vis_viewBy
      vis_year
      vis_scenario
      vis_scenarios
      vis_source
      vis_sources
      vis_sourcesInOrder
      vis_province
      vis_provinces
      vis_provincesInOrder
    ###

    # We'll rely on Google Analytics' language detection feature instead of our parameter
    delete params.language if params.language?

    gaMessage = {}

    for paramName, param of params
      dimensionName = Constants.googleAnalyticsCustomDimensions[paramName]
      gaMessage[dimensionName] = param

    # We want to track the URL without the long string of URL parameters.
    location = @app.window.document.location
    @ga 'energyFutures.set', 'page', "#{location.protocol}//#{location.host}#{location.pathname}"

    @ga 'energyFutures.send', 'pageview', gaMessage


  reportEvent: (category, action) ->
    return unless @ga?

    @ga 'energyFutures.send',
      hitType: 'event'
      eventCategory: category
      eventAction: action

    # unused, available attributes:
      # eventLabel:
      # eventValue:






module.exports = AnalyticsReporter