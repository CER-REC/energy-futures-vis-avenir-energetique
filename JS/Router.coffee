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


class Router

  constructor: (app) ->
    @app = app
    @navbar = new Navbar()
    @app.containingWindow.onpopstate = @onHistoryPopState
    
    params = Router.parseQueryParams()
    @setInitialParamConfiguration params
    @navigate params






  onHistoryPopState: (event) =>
    state = event.state || {}
    @navigate state, {shouldUpdateHistory: false}

  setInitialParamConfiguration: (params) ->
    # Initialize the application based on the queryparams
    switch params.page
      when 'viz1'
        @app.visualization1Configuration = new Visualization1Configuration params
      when 'viz2'
        @app.visualization2Configuration = new Visualization2Configuration params
      when 'viz3'
        @app.visualization3Configuration = new Visualization3Configuration params
      when 'viz4'
        @app.visualization4Configuration = new Visualization4Configuration params
    

  navigate: (params, options = {}) ->
    options = _.merge {shouldUpdateHistory: true}, options
    params.page = 'landingPage' unless Constants.pages.includes params.page

    return unless params? and params.page?
    # Guard against navigating unless resources for the destination page are loaded up
    return unless Router.viewClassForPage(params.page).resourcesLoaded()

    d3.select('#aboutModal').classed('hidden', true)
    d3.select('#imageDownloadModal').classed('hidden', true)
    @app.page = params.page
    @navbar.setNavBarState params.page
    @updateBottomNavBar()

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
      @app.currentView = new LandingPage()
      @app.containingWindow.history.replaceState {page: 'landingPage'}, '', "?page=landingPage" if options.shouldUpdateHistory
    else if not (@app.currentView instanceof LandingPage)
      @app.currentView.tearDown()
      @app.currentView = new LandingPage()
      @app.containingWindow.history.pushState {page: 'landingPage'}, '', "?page=landingPage" if options.shouldUpdateHistory


  viz1Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization1 @app.visualization1Configuration
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization1)
      @app.currentView.tearDown()
      @app.currentView = new Visualization1 @app.visualization1Configuration
      params = @setupVis1RouterParams(@app.visualization1Configuration, params)
      @app.containingWindow.history.pushState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
      @updateKeyWordsTagViz1()
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params)
      @updateKeyWordsTagViz1()


  viz2Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization2 @app.visualization2Configuration
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization2)
      @app.currentView.tearDown()
      @app.currentView = new Visualization2 @app.visualization2Configuration
      params = @setupVis2RouterParams(@app.visualization2Configuration, params)
      @app.containingWindow.history.pushState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
      @updateKeyWordsTagViz2()
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params)
      @updateKeyWordsTagViz2()

  viz3Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization3 @app.visualization3Configuration
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization3)
      @app.currentView.tearDown()
      @app.currentView = new Visualization3 @app.visualization3Configuration
      @app.containingWindow.history.pushState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
      @updateKeyWordsTagViz3()
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params)
      @updateKeyWordsTagViz3()
  
  viz4Handler: (params, options) ->
    if not @app.currentView?
      @app.currentView = new Visualization4 @app.visualization4Configuration
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
    else if not (@app.currentView instanceof Visualization4)
      @app.currentView.tearDown()
      @app.currentView = new Visualization4 @app.visualization4Configuration
      @app.containingWindow.history.pushState params, '', @paramsToUrlString(params) if options.shouldUpdateHistory
      @updateKeyWordsTagViz4()
    else if options.shouldUpdateHistory
      @app.containingWindow.history.replaceState params, '', @paramsToUrlString(params)
      @updateKeyWordsTagViz4()

  setupVis1RouterParams: (configuration, params)->
    page: params.page
    mainSelection: configuration.mainSelection
    unit: configuration.unit
    scenario: configuration.scenario
    provinces: configuration.provinces
    provincesInOrder: configuration.provincesInOrder

  setupVis2RouterParams: (configuration, params)->
    page: params.page
    sector: configuration.sector
    unit: configuration.unit
    scenario: configuration.scenario
    sources: configuration.sources
    province: configuration.province
    sourcesInOrder: configuration.sourcesInOrder

  paramsToUrlString: (params) ->
    urlParts = Object.keys(params).map (key) ->
      "#{key}=#{params[key]}"
    '?' + urlParts.join '&'
   
  updateKeyWordsTagViz1: ->
    d3.select('meta[name="keywords"]')
      .attr
        content: => 
          provincesFullNames = @app.visualization1Configuration.provinces.map (item) -> Tr.regionSelector.names[item][app.language]
          description = "#{@app.visualization1Configuration.imageExportDescription().split " - "},#{provincesFullNames}"

  updateKeyWordsTagViz2: ->
    d3.select('meta[name="keywords"]')
      .attr
        content: => 
          sourceFullNames = @app.visualization2Configuration.sources.map (item) -> Tr.sourceSelector.sources[item][app.language]
          description = "#{@app.visualization2Configuration.imageExportDescription().split " - "},#{sourceFullNames}"

  updateKeyWordsTagViz3: ->
    d3.select('meta[name="keywords"]')
      .attr
        content: => 
          multiSelect = if @app.visualization3Configuration.viewBy == 'province' then @app.visualization3Configuration.sources.map (item) -> Tr.sourceSelector.sources[item][app.language] else @app.visualization3Configuration.provinces.map (item) -> Tr.regionSelector.names[item][app.language]
          description = "#{@app.visualization3Configuration.imageExportDescription().split " - "},#{multiSelect}"

  updateKeyWordsTagViz4: ->
    d3.select('meta[name="keywords"]')
      .attr
        content: => 
          scenarios = @app.visualization4Configuration.scenarios.map (item) -> Tr.scenarioSelector.names[item][app.language]
          description = "#{@app.visualization4Configuration.imageExportDescription().split " - "},#{scenarios}"

  updateMetaTagViz1: ->
    d3.select('meta[name="description"]')
      .attr
        content: => 
          provincesFullNames = @app.visualization1Configuration.provinces.map (item) -> Tr.regionSelector.names[item][app.language]
          description = "#{Tr.allPages.metaDescription[app.language]} #{@app.visualization1Configuration.imageExportDescription().toLowerCase()}. #{Tr.regionSelector.selectRegionLabel[app.language]}: #{provincesFullNames}"

  updateMetaTagViz2: ->
    d3.select('meta[name="description"]')
      .attr
        content: => 
          sourceFullNames = @app.visualization2Configuration.sources.map (item) -> Tr.sourceSelector.sources[item][app.language]
          description = "#{Tr.allPages.metaDescription[app.language]} #{@app.visualization2Configuration.imageExportDescription()}. #{Tr.sourceSelector.selectSourceLabel[app.language]}: #{sourceFullNames}"

  updateMetaTagViz3: ->
    d3.select('meta[name="description"]')
      .attr
        content: => 
          multiSelect = if @app.visualization3Configuration.viewBy == 'province' then @app.visualization3Configuration.sources.map (item) -> Tr.sourceSelector.sources[item][app.language] else @app.visualization3Configuration.provinces.map (item) -> Tr.regionSelector.names[item][app.language]
          multiSelectLabel = if @app.visualization3Configuration.viewBy == 'province' then Tr.sourceSelector.selectSourceLabel[app.language] else Tr.regionSelector.selectRegionLabel[app.language]
          description = "#{Tr.allPages.metaDescription[app.language]} #{@app.visualization3Configuration.imageExportDescription()}. #{multiSelectLabel}: #{multiSelect}"

  updateMetaTagViz4: ->
    d3.select('meta[name="description"]')
      .attr
        content: => 
          scenarios = @app.visualization4Configuration.scenarios.map (item) -> Tr.scenarioSelector.names[item][app.language]
          description = "#{Tr.allPages.metaDescription[app.language]} #{@app.visualization4Configuration.imageExportDescription()}. #{Tr.scenarioSelector.scenarioSelectorHelpTitle[app.language]}: #{scenarios}"


Router.parseQueryParams = ->
  # TODO: would be nice if I could use @app.containingWindow... but it may not be initialized yet here ... 
  params = QueryString.parse window.parent.document.location.search
  if params.scenarios?
    params.scenarios = params.scenarios.split ','
  if params.provinces?
    params.provinces = params.provinces.split ','
  if params.provincesInOrder?
    params.provincesInOrder = params.provincesInOrder.split ','
  if params.sources?
    params.sources = params.sources.split ','
  if params.sourcesInOrder?
    params.sourcesInOrder = params.sourcesInOrder.split ','
  if params.year?
    params.year = parseInt(params.year)

  # The 'page' parameter is validated in the router
  # The other parameters are validated in the visualization config classes, in setters
  params.page = 'landingPage' unless Constants.pages.includes params.page  
  params = _.extend {page: 'landingPage'}, params

  params


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