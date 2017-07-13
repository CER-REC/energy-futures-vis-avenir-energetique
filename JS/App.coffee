d3 = require 'd3'
Domready = require 'domready'
_ = require 'lodash'
BrowserCookies = require 'browser-cookies'
QueryString = require 'query-string'


require './Polyfills.coffee'
Router = require './Router.coffee'

Visualization1Configuration = require './VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require './VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require './VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require './VisualizationConfigurations/Visualization4Configuration.coffee'
Visualization5Configuration = require './VisualizationConfigurations/Visualization5Configuration.coffee'

EnergyConsumptionProvider = require './DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require './DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require './DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require './DataProviders/ElectricityProductionProvider.coffee'

ImageExporter = require './ImageExporter.coffee'

PopoverManager = require './PopoverManager.coffee'
AboutThisProjectPopover = require './popovers/AboutThisProjectPopover.coffee'
ImageDownloadPopover = require './popovers/ImageDownloadPopover.coffee'

Constants = require './Constants.coffee'

DatasetRequester = require './DatasetRequester.coffee'
AnalyticsReporter = require './AnalyticsReporter.coffee'
BottomNavbar = require './BottomNavbar.coffee'


class App

  setup: ->

    # We need to specify the window where the visualization classes should do their work.
    # On the client, this is just the browser window object. On the server, this becomes
    # a jsdom window object.
    @window = window

    @animationDuration = Constants.animationDuration

    @loadFonts()

    @currentView = null
    @router = null
    @screenWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)

    # Global URL params, these are initialized by the router
    # Page, one of landingPage, viz1, viz2, viz3, viz4, viz5
    @page = null
    # Language one of en, fr
    @language = null

    @detectLanguage()

    @popoverManager = new PopoverManager @
    @aboutThisProjectPopover = new AboutThisProjectPopover @
    @imageDownloadPopover = new ImageDownloadPopover @

    @imageExporter = new ImageExporter @


    @bottomNavbar = new BottomNavbar @


    # Debounce, to redraw just once after the user has resized the display
    # At small screen sizes the visualization would be resized/redrawn repeatedly,
    # otherwise
    @debouncedResizeHandler = _.debounce =>
      containerElement = d3.select '#canadasEnergyFutureVisualization'
      newWidth = containerElement.node().getBoundingClientRect().width
      if newWidth != @screenWidth
        @screenWidth = newWidth
        @currentView.redraw() if @currentView?
    , 100 # delay, in ms

    d3.select(@window).on 'resize', @debouncedResizeHandler

    # humans.txt
    # TODO: we may want to do this without relying on script
    if d3.selectAll('head link[rel="author"][href="humans.txt"]').empty()
      d3.select('head').append('link')
        .attr
          rel: 'author'
          href: 'humans.txt'

    # Configuration Objects
    @visualization1Configuration = new Visualization1Configuration @
    @visualization2Configuration = new Visualization2Configuration @
    @visualization3Configuration = new Visualization3Configuration @
    @visualization4Configuration = new Visualization4Configuration @
    @visualization5Configuration = new Visualization5Configuration @



    # Data Providers

    @providers = {}

    # Initialize one set of providers per dataset
    for dataset in Constants.datasets
      @providers[dataset] = {}

      @providers[dataset].electricityProductionProvider = new ElectricityProductionProvider @
      @providers[dataset].energyConsumptionProvider = new EnergyConsumptionProvider()
      @providers[dataset].oilProductionProvider = new OilProductionProvider()
      @providers[dataset].gasProductionProvider = new GasProductionProvider()

    @datasetRequester = new DatasetRequester @, @providers

    # Analytics and router
    @analyticsReporter = new AnalyticsReporter @

    @router = new Router @



  loadFonts: ->
    http = new XMLHttpRequest()
    http.open 'HEAD', 'CSS/avenirFonts.css'
    http.onreadystatechange = ->
      if http.readyState == XMLHttpRequest.DONE
        if http.status == 200
          # If we're running on the NEB server, we load some privately purchased fonts
          # The Avenir fonts and the stylesheet to load them are not included in the
          # public distribution.
          lnk = document.createElement 'link'
          lnk.type = 'text/css'
          lnk.rel = 'stylesheet'
          lnk.href = 'CSS/avenirFonts.css'
          document.getElementsByTagName('head')[0].appendChild lnk
        else
          # If we're not running on the NEB server, we load up some less pretty google
          # fonts
          lnk = document.createElement 'link'
          lnk.type = 'text/css'
          lnk.rel = 'stylesheet'
          lnk.href = 'https://fonts.googleapis.com/css?family=PT+Sans+Narrow'
          document.getElementsByTagName('head')[0].appendChild lnk

    http.send()


  detectLanguage: ->

    # First, check URL parameter
    query = QueryString.parse @window.location.search
    switch query.language
      when 'en'
        @language = 'en'
        return
      when 'fr'
        @language = 'fr'
        return

    # Second, check the cookie
    gc_lang_cookie = BrowserCookies.get '_gc_lang'

    switch gc_lang_cookie
      when 'E'
        @language = 'en'
        return
      when 'F'
        @language = 'fr'
        return

    # Default to english
    @language = 'en'




Domready ->
  app = new App()
  # window.app = app
  app.setup()
  

  











