QueryString = require 'query-string'
_ = require 'lodash'

Navbar = require './views/Navbar.coffee'
LandingPage = require './views/LandingPage.coffee'
Visualization1 = require './views/visualization1.coffee'
Visualization2 = require './views/visualization2.coffee'
Visualization3 = require './views/visualization3.coffee'
Visualization4 = require './views/Visualization4.coffee'

Visualization1Configuration = require './VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require './VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require './VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require './VisualizationConfigurations/Visualization4Configuration.coffee'

Constants = require './Constants.coffee'
d3 = require 'd3'
Tr = require './TranslationTable.coffee'

PrepareQueryParams = require './PrepareQueryParams.coffee'
ParamsToUrlString = require './ParamsToUrlString.coffee'

class Router

  constructor: (app) ->
    @app = app
    @navbar = new Navbar @app
    @app.containingWindow.onpopstate = @onHistoryPopState
    
    params = Router.parseQueryParams()

    initialConfig = @setInitialParamConfiguration params

    # Request data for the initial config, and navigate to the page
    @app.datasetRequester.requestData initialConfig, =>
      @navigate params

  onHistoryPopState: (event) =>
    state = event.state || {}
    @navigate state, {shouldUpdateHistory: false}

  setInitialParamConfiguration: (params) ->
    # Initialize the application based on the queryparams
    switch params.page
      when 'viz1'
        @app.visualization1Configuration = new Visualization1Configuration @app, params
        @app.visualization1Configuration
      when 'viz2'
        @app.visualization2Configuration = new Visualization2Configuration @app, params
        @app.visualization2Configuration
      when 'viz3'
        @app.visualization3Configuration = new Visualization3Configuration @app, params
        @app.visualization3Configuration
      when 'viz4'
        @app.visualization4Configuration = new Visualization4Configuration @app, params
        @app.visualization4Configuration

  navigate: (params, options = {}) ->
    options = _.merge {shouldUpdateHistory: true}, options
    params.page = 'landingPage' unless Constants.pages.includes params.page

    return unless params? and params.page?

    @app.page = params.page
    @navbar.setNavBarState params.page
    @updateBottomNavBar options

    switch params.page
      when 'landingPage' then @landingPageHandler options
      when 'viz1' then @viz1Handler params, options
      when 'viz2' then @viz2Handler params, options
      when 'viz3' then @viz3Handler params, options
      when 'viz4' then @viz4Handler params, options


    # Google analytics reporting integration, tailored for the NEB.
    if @app.containingWindow.ga?
      @app.containingWindow.ga('set', 'page', document.URL)
      
      @app.containingWindow.ga('send', {
        hitType: 'pageview',      
        page: document.URL,
        title: params.mainSelection,
        location: params.page
      })
        
      @app.containingWindow.ga('send', {
        hitType: 'event',      
        eventCategory: 'Selection'
        eventAction: params.mainSelection,
        eventLabel: params.page
      })
      
      @app.containingWindow.ga('send', {
        hitType: 'event',      
        eventCategory: 'Provinces'
        eventAction: params.provinces,
        eventLabel: params.page
      })
      
      @app.containingWindow.ga('send', {
        hitType: 'event',      
        eventCategory: 'Scenarios'
        eventAction: params.scenario,
        eventLabel: params.page
      })
      
      @app.containingWindow.ga('send', {
        hitType: 'event',      
        eventCategory: 'Year'
        eventAction: params.year,
        eventLabel: params.page
      })
      
      @app.containingWindow.ga('send', {
        hitType: 'event',      
        eventCategory: 'Unit'
        eventAction: params.unit,
        eventLabel: params.page
      })

      @app.containingWindow.ga('send', {
        hitType: 'event',
        eventCategory: 'Dataset'
        eventAction: params.dataset,
        eventLabel: params.page
      })

  # Navigation handlers

  updateBottomNavBar: ->
    if @app.page == 'landingPage'
      d3.select('#dataDownloadLink').classed('hidden', true)
      d3.select('#imageDownloadLink').classed('hidden', true)
    else
      d3.select('#dataDownloadLink').classed('hidden', false)
      d3.select('#imageDownloadLink').classed('hidden', false)

  landingPageHandler: (options) ->
    if not @app.currentView?
      @app.currentView = new LandingPage @app
      @app.containingWindow.history.replaceState {page: 'landingPage'}, '', "?page=landingPage" if options.shouldUpdateHistory
    else if not (@app.currentView instanceof LandingPage)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new LandingPage @app
      @app.containingWindow.history.pushState {page: 'landingPage'}, '', "?page=landingPage" if options.shouldUpdateHistory


  viz1Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization1 @app, @app.visualization1Configuration
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization1)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization1 @app, @app.visualization1Configuration
      params = @setupVis1RouterParams(@app.visualization1Configuration, params)
      @app.containingWindow.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params)


  viz2Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization2 @app, @app.visualization2Configuration
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization2)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization2 @app, @app.visualization2Configuration
      params = @setupVis2RouterParams(@app.visualization2Configuration, params)
      @app.containingWindow.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params)

  viz3Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization3 @app, @app.visualization3Configuration
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization3)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization3 @app, @app.visualization3Configuration
      params = @setupVis3RouterParams(@app.visualization3Configuration, params)
      @app.containingWindow.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params)
  
  viz4Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization4 @app, @app.visualization4Configuration
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization4)
      @app.popoverManager.closePopover()
      @app.currentView.tearDown()
      @app.currentView = new Visualization4 @app, @app.visualization4Configuration
      params = @setupVis4RouterParams(@app.visualization4Configuration, params)
      @app.containingWindow.history.pushState params, '', ParamsToUrlString(params) if options.shouldUpdateHistory
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', ParamsToUrlString(params)

  setupVis1RouterParams: (configuration, params)->
    page: params.page
    mainSelection: configuration.mainSelection
    unit: configuration.unit
    scenario: configuration.scenario
    provinces: configuration.provinces
    provincesInOrder: configuration.provincesInOrder
    dataset: configuration.dataset

  setupVis2RouterParams: (configuration, params)->
    page: params.page
    sector: configuration.sector
    unit: configuration.unit
    scenario: configuration.scenario
    sources: configuration.sources
    province: configuration.province
    sourcesInOrder: configuration.sourcesInOrder
    dataset: configuration.dataset

  setupVis3RouterParams: (configuration, params)->
    page: params.page
    viewBy: configuration.viewBy
    unit: configuration.unit
    scenario: configuration.scenario
    year: configuration.year
    province: configuration.province
    sources: configuration.sources
    dataset: configuration.dataset

  setupVis4RouterParams: (configuration, params)->
    page: params.page
    mainSelection: configuration.mainSelection
    unit: configuration.unit
    scenarios: configuration.scenarios
    province: configuration.province
    dataset: configuration.dataset

   


Router.parseQueryParams = ->
  PrepareQueryParams QueryString.parse(window.parent.document.location.search)

Router.currentViewClass = ->
  Router.viewClassForPage Router.parseQueryParams().page

Router.viewClassForPage = (page) ->
  switch page
    when 'landingPage' then LandingPage
    when 'viz1' then Visualization1
    when 'viz2' then Visualization2
    when 'viz3' then Visualization3
    when 'viz4' then Visualization4

module.exports = Router