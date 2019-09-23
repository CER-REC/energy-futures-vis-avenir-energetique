QueryString = require 'query-string'
_ = require 'lodash'

Navbar = require './views/Navbar.coffee'
LandingPage = require './views/LandingPage.coffee'
Visualization1 = require './views/visualization1.coffee'
Visualization2 = require './views/visualization2.coffee'
Visualization3 = require './views/visualization3.coffee'
Visualization4 = require './views/visualization4.coffee'
Visualization5 = require './views/visualization5.coffee'

Visualization1Configuration = require './VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require './VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require './VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require './VisualizationConfigurations/visualization4Configuration.coffee'
Visualization5Configuration = require './VisualizationConfigurations/visualization5Configuration.coffee'

Constants = require './Constants.coffee'
d3 = require 'd3'
Tr = require './TranslationTable.coffee'

PrepareQueryParams = require './PrepareQueryParams.coffee'
ParamsToUrlString = require './ParamsToUrlString.coffee'

class Router

  constructor: (app) ->
    @app = app
    @navbar = new Navbar @app
    @app.window.onpopstate = @onHistoryPopState
    @accessibleStatusElement = @app.window.document.getElementById 'accessibleStatus'

    params = Router.parseQueryParams()

    @setInitialParamConfiguration params

    @navigate params

  onHistoryPopState: (event) =>
    # On mobile Safari, an onpopstate event is fired on page load with null for its state.
    # We will assume that if we see a null event, that it is this page load, and avoid
    # navigating
    return unless event.state?
    @navigate event.state, {shouldUpdateHistory: false}

  setInitialParamConfiguration: (params) ->
    # Initialize the application based on the queryparams
    switch params.page
      when 'viz1'
        @app.visualization1Configuration = new Visualization1Configuration @app, params
      when 'viz2'
        @app.visualization2Configuration = new Visualization2Configuration @app, params
      when 'viz3'
        @app.visualization3Configuration = new Visualization3Configuration @app, params
      when 'viz4'
        @app.visualization4Configuration = new Visualization4Configuration @app, params
      when 'viz5'
        @app.visualization5Configuration = new Visualization5Configuration @app, params

  navigate: (params, options = {}) ->
    options = _.merge {shouldUpdateHistory: true}, options
    params.page = 'landingPage' unless Constants.pages.includes params.page
    return unless params? and params.page?
    switch params.page
      when 'viz1'
        @app.datasetRequester.updateAndRequestIfRequired @app.visualization1Configuration, =>
          @fulfillNavigation params, options
      when 'viz2'
        @app.datasetRequester.updateAndRequestIfRequired @app.visualization2Configuration, =>
          @fulfillNavigation params, options
        @app.visualization2Configuration
      when 'viz3'
        @app.datasetRequester.updateAndRequestIfRequired @app.visualization3Configuration, =>
          @fulfillNavigation params, options
        @app.visualization3Configuration
      when 'viz4'
        @app.datasetRequester.updateAndRequestIfRequired @app.visualization4Configuration, =>
          @fulfillNavigation params, options
      when 'viz5'
        @app.datasetRequester.updateAndRequestIfRequired @app.visualization5Configuration, =>
          @fulfillNavigation params, options
      when 'landingPage'
        @fulfillNavigation params, options






  fulfillNavigation: (params, options) ->
    @app.page = params.page
    @navbar.setNavBarState params.page, options
    @updateBottomNavBar options

    switch params.page
      when 'landingPage' then @landingPageHandler options
      when 'viz1' then @viz1Handler params, options
      when 'viz2' then @viz2Handler params, options
      when 'viz3' then @viz3Handler params, options
      when 'viz4' then @viz4Handler params, options
      when 'viz5' then @viz5Handler params, options

  # Navigation handlers

  updateBottomNavBar: ->
    if @app.page == 'landingPage'
      d3.select('#dataDownloadLink').classed 'hidden', true
    else
      d3.select('#dataDownloadLink').classed 'hidden', false


  # We replace page history for every interaction with visualization controls. Browsers
  # may cut off history API access if it is used too many times per second, which can
  # happen if the user drags slider controls around rapidly.
  # To avoid having the history API shut off, we throttle these updates to it.
  # coffeelint: disable=missing_fat_arrows
  replaceState: (_.throttle (params, options) ->
    return unless options.shouldUpdateHistory
    @app.window.history.replaceState params, '', ParamsToUrlString(params)
  , 250)
  # coffeelint: enable=missing_fat_arrows

  landingPageHandler: (options) ->
    params =
      page: 'landingPage'
      language: @app.language
    if not @app.currentView?
      @app.currentView = new LandingPage @app
      @replaceState params, options
    else if not (@app.currentView instanceof LandingPage)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new LandingPage @app
      @app.window.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
      @updateStatusElement params.page


  viz1Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization1 @app, @app.visualization1Configuration
      @replaceState params, options
    else if not (@app.currentView instanceof Visualization1)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization1 @app, @app.visualization1Configuration
      params = @app.visualization1Configuration.routerParams()
      @app.window.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
      @updateStatusElement params.page
    else
      @replaceState params, options

    @app.analyticsReporter.reportPage @app.visualization1Configuration.routerParams()

  viz2Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization2 @app, @app.visualization2Configuration
      @replaceState params, options
    else if not (@app.currentView instanceof Visualization2)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization2 @app, @app.visualization2Configuration
      params = @app.visualization2Configuration.routerParams()
      @app.window.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
      @updateStatusElement params.page
    else
      @replaceState params, options

    @app.analyticsReporter.reportPage @app.visualization2Configuration.routerParams()

  viz3Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization3 @app, @app.visualization3Configuration
      @replaceState params, options
    else if not (@app.currentView instanceof Visualization3)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization3 @app, @app.visualization3Configuration
      params = @app.visualization3Configuration.routerParams()
      @app.window.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
      @updateStatusElement params.page
    else
      @replaceState params, options

    @app.analyticsReporter.reportPage @app.visualization3Configuration.routerParams()

  viz4Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization4 @app, @app.visualization4Configuration
      @replaceState params, options
    else if not (@app.currentView instanceof Visualization4)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization4 @app, @app.visualization4Configuration
      params = @app.visualization4Configuration.routerParams()
      @app.window.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
      @updateStatusElement params.page
    else
      @replaceState params, options

    @app.analyticsReporter.reportPage @app.visualization4Configuration.routerParams()


  viz5Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization5 @app, @app.visualization5Configuration
      @replaceState params, options
    else if not (@app.currentView instanceof Visualization5)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization5 @app, @app.visualization5Configuration
      params = @app.visualization5Configuration.routerParams()
      @app.window.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
      @updateStatusElement params.page
    else
      @replaceState params, options

    @app.analyticsReporter.reportPage @app.visualization5Configuration.routerParams()




  updateStatusElement: (page) ->
    @accessibleStatusElement.innerHTML = Tr.navigation[page][@app.language]


Router.parseQueryParams = ->
  PrepareQueryParams QueryString.parse(document.location.search)

Router.currentViewClass = ->
  Router.viewClassForPage Router.parseQueryParams().page

Router.viewClassForPage = (page) ->
  switch page
    when 'landingPage' then LandingPage
    when 'viz1' then Visualization1
    when 'viz2' then Visualization2
    when 'viz3' then Visualization3
    when 'viz4' then Visualization4
    when 'viz5' then Visualization5

module.exports = Router
