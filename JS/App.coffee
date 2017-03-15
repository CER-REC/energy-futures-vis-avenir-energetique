d3 = require 'd3'
Domready = require 'domready'
Mustache = require 'mustache'
_ = require 'lodash'
BrowserCookies = require 'browser-cookies'
QueryString = require 'query-string'


require './ArrayIncludes.coffee'
Router = require './Router.coffee'
Tr = require './TranslationTable.coffee'

BottomNavBarTemplate = require './templates/BottomNavBar.mustache'

Visualization1Configuration = require './VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require './VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require './VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require './VisualizationConfigurations/Visualization4Configuration.coffee'

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
SocialMedia = require './SocialMedia.coffee'
AnalyticsReporter = require './AnalyticsReporter.coffee'


class App

  setup: ->

    # The app loads within an iframe, but it needs to interact with some features of the
    # containing window

    @containingWindow = window.parent

    # We need to specify the window where the visualization classes should do their work.
    # On the client, this is just the browser window object. On the server, this becomes
    # a jsdom window object.
    @window = window

    @animationDuration = Constants.animationDuration

    @loadFonts()

    @currentView = null
    @router = null
    # NB: This now refers to the iframe width
    @screenWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)

    # Global URL params, these are initialized by the router
    # Page, one of landingPage, viz1, viz2, viz3, viz4
    @page = null
    # Language one of en, fr
    @language = null

    @detectLanguage()

    @popoverManager = new PopoverManager()
    @aboutThisProjectPopover = new AboutThisProjectPopover @
    @imageDownloadPopover = new ImageDownloadPopover @

    @imageExporter = new ImageExporter @


    # TODO: Navbar and modal setup is getting weighty, might want to break it out into a
    # separate class

    @window.document.getElementById('bottomNavBar').innerHTML = Mustache.render BottomNavBarTemplate,
        aboutLink: Tr.allPages.aboutLink[@language]
        methodologyLinkText: Tr.allPages.methodologyLinkText[@language]
        methodologyLinkUrl: Tr.allPages.methodologyLinkUrl[@language]
        shareLabel: Tr.allPages.shareLabel[@language]
        dataDownloadLink: Tr.allPages.dataDownloadLink[@language]
        imageDownloadLink: Tr.allPages.imageDownloadLink[@language]
        twitterAltText: Tr.altText.twitter[@language]
        linkedinAltText: Tr.altText.linkedin[@language]
        emailAltText: Tr.altText.email[@language]



    d3.select('#aboutLink').on 'click', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @popoverManager.showPopover @aboutThisProjectPopover
      @analyticsReporter.reportEvent 'Information', 'About modal'

    d3.select('#aboutModal .closeButton').on 'click', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @popoverManager.closePopover()

    d3.select('#imageDownloadLink').on 'click', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @imageExporter.createImage()
      @analyticsReporter.reportEvent 'Downloads', 'Open image download modal'

    d3.select('#imageDownloadModal .closeButton').on 'click', =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @popoverManager.closePopover()


    d3.select('#methodologyLinkAnchor').on 'click', =>
      @analyticsReporter.reportEvent 'Downloads', 'Methodology PDF download'

    d3.select('#dataDownloadLinkAnchor').on 'click', =>
      @analyticsReporter.reportEvent 'Downloads', 'Data CSV download'


    d3.select('body').on 'click', =>
      if @popoverManager.currentPopover?
        @popoverManager.closePopover()

    d3.select(@containingWindow).on 'click', =>
      if @popoverManager.currentPopover?
        @popoverManager.closePopover()


    # TODO: rendering meta tags on server would make more sense
    metaTag = if d3.selectAll('meta[name="description"]').empty()
      d3.select 'head'
        .append 'meta'
    else
      d3.select 'meta[name="description"]'

    metaTag
      .attr
        name: 'description'
        content: Tr.allPages.metaDescription[@language]

    keyWordsTag = if d3.selectAll('meta[name="keywords"]').empty()
      d3.select 'head'
        .append 'meta'
    else
      d3.select 'meta[name="keywords"]'

    keyWordsTag
      .attr
        name: 'keywords'
        content: ''


    # Debounce, to redraw just once after the user has resized the display
    # At small screen sizes the visualization would be resized/redrawn repeatedly,
    # otherwise
    @debouncedResizeHandler = _.debounce =>
      newWidth = d3.select('#canadasEnergyFutureVisualization').node().getBoundingClientRect().width
      if newWidth != @screenWidth
        @screenWidth = newWidth
        @currentView.redraw() if @currentView?
    , 100 # delay, in ms

    d3.select(@containingWindow).on 'resize', @debouncedResizeHandler

    #humans.txt
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
    query = QueryString.parse @containingWindow.location.search
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
  # window.parent.app = app
  app.setup()
  SocialMedia app
  

  











