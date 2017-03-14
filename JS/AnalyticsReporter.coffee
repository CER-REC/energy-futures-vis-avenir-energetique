

# Google analytics reporting integration, tailored for the NEB.

class AnalyticsReporter



  constructor: (@app) ->

    if @app.containingWindow.ga?
      @ga = @app.containingWindow.ga




  reportPage: (params) ->

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

    for paramName, param of params
      dimensionName = "vis_#{paramName}"
      console.log "doing a GA set with #{dimensionName} #{param}"
      @ga 'set', dimensionName, param

    # We want to track the URL without the long string of URL parameters.
    location = @app.containingWindow.document.location
    @ga 'set', 'page', "#{location.protocol}//#{location.host}#{location.pathname}"

    console.log "finishing with pageview for #{location.protocol}//#{location.host}#{location.pathname}"
    @ga 'send', 'pageview'







  reportEvent: (options) ->

    @ga 'send',
      hitType: 'event'
      eventCategory: 'Dataset'
      eventAction: params.dataset
      eventLabel: params.page




    # ga('send', {
    #   hitType: 'event',
    #   eventCategory: 'Videos',
    #   eventAction: 'play',
    #   eventLabel: 'Fall Campaign'
    # });
























module.exports = AnalyticsReporter