Constants = require './Constants.coffee'

# Google analytics reporting integration, tailored for the NEB.
class AnalyticsReporter

  constructor: (@app) ->
    if @app.containingWindow.ga?
      @ga = @app.containingWindow.ga
    else
      console.warn "Google analytics object not found."


  reportPage: (params) ->
    return unless @ga?
    
    ### The following custom dimensions need to be set up for this app in Google Analytics
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
    # But, GA will only consider the pageview to be 'new' if the reported URL has changed!
    # location = @app.containingWindow.document.location
    # @ga 'set', 'page', "#{location.protocol}//#{location.host}#{location.pathname}"

    @ga 'send', 'pageview', gaMessage


  reportEvent: (category, action) ->
    return unless @ga?

    @ga 'send',
      hitType: 'event'
      eventCategory: category
      eventAction: action

    # unused, available attributes:
      # eventLabel:
      # eventValue:






module.exports = AnalyticsReporter