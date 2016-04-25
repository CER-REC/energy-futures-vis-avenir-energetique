
require './ArrayIncludes.coffee'
Router = require './Router.coffee'
Domready = require 'domready'
Mustache = require 'mustache'
Templates = require './templates.coffee'
Tr = require './TranslationTable.coffee'

Visualization1Configuration = require './VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require './VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require './VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require './VisualizationConfigurations/Visualization4Configuration.coffee'

EnergyConsumptionProvider = require './DataProviders/EnergyConsumptionProvider.coffee'
OilProductionProvider = require './DataProviders/OilProductionProvider.coffee'
GasProductionProvider = require './DataProviders/GasProductionProvider.coffee'
ElectricityProductionProvider = require './DataProviders/ElectricityProductionProvider.coffee'

ImageExporter = require './ImageExporter.coffee'


class App

  setup: ->

    @loadFonts()

    @currentView = null
    @router = null
    @screenWidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)

    # Global URL params, these are initialized by the router
    # Page, one of landingPage, viz1, viz2, viz3, viz4
    @page = null
    # Language one of en, fr
    @language = null

    # Language detection: we inspect the text in the change language link at the top of
    # the page. NB: the current language of the page is the *opposite* of the lanauge
    # that the link indicates, as the link is used to change the current language! 
    languageLink = document.getElementById 'LangID'
    unless languageLink?
      @language = 'en'
    else if languageLink.getAttribute('lang') == 'fr'
      @language = 'en'
    else if languageLink.getAttribute('lang') == 'en'
      @language = 'fr'
    else
      @language = 'en'


    # TODO: Navbar and modal setup is getting weighty, might want to break it out into a separate class

    document.getElementById('bottomNavBar').innerHTML = Mustache.render Templates.bottomNavBarTemplate,
        aboutLink: Tr.allPages.aboutLink[app.language]
        methodologyLinkText: Tr.allPages.methodologyLinkText[app.language]
        methodologyLinkUrl: Tr.allPages.methodologyLinkUrl[app.language]
        shareLabel: Tr.allPages.shareLabel[app.language]
        dataDownloadLink: Tr.allPages.dataDownloadLink[app.language]
        imageDownloadLink: Tr.allPages.imageDownloadLink[app.language]
        # downloadsLabel: Tr.allPages.downloadsLabel[app.language]

    document.getElementById('aboutModal').innerHTML = Mustache.render Templates.aboutThisProjectTemplate,
        aboutTitle: Tr.aboutThisProject.aboutTitle[app.language]
        aboutContent: Tr.aboutThisProject.aboutContent[app.language]

    d3.select('#aboutLink').on 'click', (d) ->
      d3.event.preventDefault()
      d3.select('#aboutModal').classed('hidden', false)

    d3.select('#aboutModal .closeButton').on 'click', (d) ->
      d3.event.preventDefault()
      d3.select('#aboutModal').classed('hidden', true)


    document.getElementById('imageDownloadModal').innerHTML = Mustache.render Templates.imageDownloadTemplate, 
        imageDownloadHeader: Tr.allPages.imageDownloadHeader[app.language]
        imageDownloadInstructions: Tr.allPages.imageDownloadInstructions[app.language]

    d3.select('#imageDownloadModal .closeButton').on 'click', (d) ->
      d3.select('#imageDownloadModal').classed('hidden', true)

    metaTag = if d3.selectAll('meta[name="description"]').empty() then d3.select('head').append('meta') else d3.select('meta[name="description"]')
    metaTag
      .attr
        name: 'description'
        content: Tr.allPages.metaDescription[app.language]

    keyWordsTag = if d3.selectAll('meta[name="keywords"]').empty() then d3.select('head').append('meta') else d3.select('meta[name="keywords"]')
    keyWordsTag
      .attr
        name: 'keywords'
        content: ''

    d3.select(window).on 'resize', ->
      newWidth = d3.select('#canadasEnergyFutureVisualization').node().getBoundingClientRect().width
      if newWidth != @screenWidth 
        @screenWidth = newWidth
        # don't redraw once we are on phone size to avoid redrawing every pixel
        if @screenWidth >= 720  
          @app.currentView.redraw() if @app.currentView?

    #humans.txt
    d3.select('head').append('link')
      .attr
        rel: "author" 
        href: "humans.txt"

    # Configuration Objects
    @visualization1Configuration = new Visualization1Configuration()
    @visualization2Configuration = new Visualization2Configuration()
    @visualization3Configuration = new Visualization3Configuration()
    @visualization4Configuration = new Visualization4Configuration()

    # Data Providers

    @loadedStatus = {
      energyConsumptionProvider: false
      oilProductionProvider: false
      gasProductionProvider: false
      electricityProductionProvider: false
    }

    # Order of provider initialization is optimized to schedule data requests via 
    # ajax to start app soonest!
    # Only really matters for viz2 and viz3, which each depend on one file. The other 
    # two depend on all four. Also, viz2 depends on the largest file by far, which tends
    # to dominate its startup performance. But viz3 loads up a few seconds faster at least!

    @electricityProductionProvider = new ElectricityProductionProvider =>
      @loadedStatus.electricityProductionProvider = true
      @setupRouter()
    @energyConsumptionProvider = new EnergyConsumptionProvider =>
      @loadedStatus.energyConsumptionProvider = true
      @setupRouter()
    @oilProductionProvider = new OilProductionProvider =>
      @loadedStatus.oilProductionProvider = true
      @setupRouter()
    @gasProductionProvider = new GasProductionProvider =>
      @loadedStatus.gasProductionProvider = true
      @setupRouter()


    @imageExporter = new ImageExporter()

    @setupRouter()


  loadFonts: ->
    http = new XMLHttpRequest()
    http.open 'HEAD', 'CSS/avenirFonts.css'
    http.onreadystatechange = ->
      if http.readyState == XMLHttpRequest.DONE
        if http.status == 200
          # If we're running on the NEB server, we load some privately purchased fonts
          # The Avenir fonts and the stylesheet to load them are not included in the 
          # public distribution.
          lnk = document.createElement('link')
          lnk.type = "text/css"
          lnk.rel = 'stylesheet'
          lnk.href = 'CSS/avenirFonts.css'
          document.getElementsByTagName('head')[0].appendChild(lnk)
        else
          # If we're not running on the NEB server, we load up some less pretty google fonts
          lnk = document.createElement('link')
          lnk.type = "text/css"
          lnk.rel = 'stylesheet'
          lnk.href = "https://fonts.googleapis.com/css?family=PT+Sans+Narrow"
          document.getElementsByTagName('head')[0].appendChild(lnk)

    http.send()


  setupRouter: ->
    return if @router?

    if Router.currentViewClass().resourcesLoaded()
      @router = new Router @ 




Domready ->
  window.app = new App()
  window.app.setup()
  

  











