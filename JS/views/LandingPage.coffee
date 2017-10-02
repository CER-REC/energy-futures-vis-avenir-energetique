Tr = require '../TranslationTable.coffee'
Mustache = require 'mustache'

LandingPageTemplate = require '../templates/LandingPage.mustache'

# A WET 4 compatible video template was built in anticipation of an eventual upgrade to
# WET 4. The WET 4 video template was built to work in the stock WET 4 distribution
# template, if the production version of WET 4 at the NEB is similar enough to the stock
# version, then swapping out the WET 3 video for the WET 4 video should just work.

Wet3VideoTemplate = require '../templates/Wet3Video.mustache'
# Wet4VideoTemplate = require '../templates/Wet4Video.mustache'


class LandingPage

  constructor: (@app) ->
    headingElement = @app.window.document.getElementById 'landingPageHeading'
    headingElement.innerHTML = Tr.landingPage.mainHeader[@app.language]

    contentElement = @app.window.document.getElementById 'visualizationContent'
    contentElement.innerHTML = Mustache.render LandingPageTemplate,
        content: Tr.landingPage.content1[@app.language]
        panelClass: @app.language
        visualization1Link: Tr.landingPage.visualization1Link[@app.language]
        visualization2Link: Tr.landingPage.visualization2Link[@app.language]
        visualization3Link: Tr.landingPage.visualization3Link[@app.language]
        visualization4Link: Tr.landingPage.visualization4Link[@app.language]
        visualization5Link: Tr.landingPage.visualization5Link[@app.language]
        panelRightContent: Tr.landingPage.landingPageImage[@app.language]
        # panelRightContent: Mustache.render(Wet4VideoTemplate)
    
    @addEventListeners()


  addEventListeners: ->

    @aboutHyperlink = @app.window.document.getElementById 'aboutHyperlink'
    @aboutHyperlinkClickHandler = (event) =>
      event.preventDefault()
      event.stopPropagation()
      @app.popoverManager.showPopover @app.aboutThisProjectPopover,
        elementToFocusOnClose: @aboutHyperlink
      @app.analyticsReporter.reportEvent 'Information', 'About modal'
    @aboutHyperlinkEnterHandler = (event) =>
      if event.key == 'Enter' or event.key == ' '
        event.preventDefault()
        event.stopPropagation()
        @app.popoverManager.showPopover @app.aboutThisProjectPopover,
          elementToFocusOnClose: @aboutHyperlink
        @app.analyticsReporter.reportEvent 'Information', 'About modal'
    @aboutHyperlink.addEventListener 'click', @aboutHyperlinkClickHandler
    @aboutHyperlink.addEventListener 'keydown', @aboutHyperlinkEnterHandler

    @methodologyLink = @app.window.document.getElementById 'landingPageMethodologyHyperlink'
    @methodologyLinkClickHandler = =>
      @app.analyticsReporter.reportEvent 'Downloads', 'Methodology PDF download'
    @methodologyLinkEnterHandler = (event) =>
      if event.key == 'Enter' # Ordinary links are not triggered by space
        @app.analyticsReporter.reportEvent 'Downloads', 'Methodology PDF download'
    @methodologyLink.addEventListener 'click', @methodologyLinkClickHandler
    @methodologyLink.addEventListener 'keydown', @methodologyLinkEnterHandler


    @viz1Link = @app.window.document.getElementById 'viz1Anchor'
    @viz1LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz1'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz1LinkEnterHandler = (event) =>
      if event.key == 'Enter' or event.key == ' '
        event.preventDefault()
        @app.router.navigate
          page: 'viz1'
          language: @app.language

    @viz1Link.addEventListener 'click', @viz1LinkClickHandler
    @viz1Link.addEventListener 'keydown', @viz1LinkEnterHandler


    @viz2Link = @app.window.document.getElementById 'viz2Anchor'
    @viz2LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz2'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz2LinkEnterHandler = (event) =>
      if event.key == 'Enter' or event.key == ' '
        event.preventDefault()
        @app.router.navigate
          page: 'viz2'
          language: @app.language
    @viz2Link.addEventListener 'keydown', @viz2LinkEnterHandler
    @viz2Link.addEventListener 'click', @viz2LinkClickHandler


    @viz3Link = @app.window.document.getElementById 'viz3Anchor'
    @viz3LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz3'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz3LinkEnterHandler = (event) =>
      if event.key == 'Enter' or event.key == ' '
        event.preventDefault()
        @app.router.navigate
          page: 'viz3'
          language: @app.language
    @viz3Link.addEventListener 'click', @viz3LinkClickHandler
    @viz3Link.addEventListener 'keydown', @viz3LinkEnterHandler


    @viz4Link = @app.window.document.getElementById 'viz4Anchor'
    @viz4LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz4'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz4LinkEnterHandler = (event) =>
      if event.key == 'Enter' or event.key == ' '
        event.preventDefault()
        @app.router.navigate
          page: 'viz4'
          language: @app.language
    @viz4Link.addEventListener 'click', @viz4LinkClickHandler
    @viz4Link.addEventListener 'keydown', @viz4LinkEnterHandler



    @viz5Link = @app.window.document.getElementById 'viz5Anchor'
    @viz5LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz5'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz5LinkEnterHandler = (event) =>
      if event.key == 'Enter' or event.key == ' '
        event.preventDefault()
        @app.router.navigate
          page: 'viz5'
          language: @app.language
    @viz5Link.addEventListener 'click', @viz5LinkClickHandler
    @viz5Link.addEventListener 'keydown', @viz5LinkEnterHandler

  removeEventListeners: ->

    @aboutHyperlink.removeEventListener 'click', @aboutHyperlinkClickHandler
    @aboutHyperlink.removeEventListener 'keydown', @aboutHyperlinkEnterHandler
    @methodologyLink.removeEventListener 'click', @methodologyLinkClickHandler
    @methodologyLink.removeEventListener 'keydown', @methodologyLinkEnterHandler

    @viz1Link.removeEventListener 'click', @viz1LinkClickHandler
    @viz1Link.removeEventListener 'keydown', @viz1LinkEnterHandler
    @viz2Link.removeEventListener 'click', @viz2LinkClickHandler
    @viz2Link.removeEventListener 'keydown', @viz2LinkEnterHandler
    @viz3Link.removeEventListener 'click', @viz3LinkClickHandler
    @viz3Link.removeEventListener 'keydown', @viz3LinkEnterHandler
    @viz4Link.removeEventListener 'click', @viz4LinkClickHandler
    @viz4Link.removeEventListener 'keydown', @viz4LinkEnterHandler
    @viz5Link.removeEventListener 'click', @viz5LinkClickHandler
    @viz5Link.removeEventListener 'keydown', @viz5LinkEnterHandler



  tearDown: ->
    @removeEventListeners()
    @app.window.document.getElementById('visualizationContent').innerHTML = ''

  # for resizing
  # coffeelint: disable=no_empty_functions
  redraw: ->
  # coffeelint: enable=no_empty_functions



module.exports = LandingPage

