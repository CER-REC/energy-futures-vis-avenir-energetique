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
        panelRightContent: Mustache.render(Wet3VideoTemplate)
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
      event.preventDefault()
      event.stopPropagation()
      if event.key == 'Enter'
        @app.popoverManager.showPopover @app.aboutThisProjectPopover,
          elementToFocusOnClose: @aboutHyperlink
        @app.analyticsReporter.reportEvent 'Information', 'About modal'
    @aboutHyperlink.addEventListener 'click', @aboutHyperlinkClickHandler
    @aboutHyperlink.addEventListener 'keyup', @aboutHyperlinkEnterHandler

    @methodologyLink = @app.window.document.getElementById 'landingPageMethodologyHyperlink'
    @methodologyLinkClickHandler = =>
      @app.analyticsReporter.reportEvent 'Downloads', 'Methodology PDF download'
    @methodologyLinkEnterHandler = (event) =>
      if event.key == 'Enter'
        @app.analyticsReporter.reportEvent 'Downloads', 'Methodology PDF download'
    @methodologyLink.addEventListener 'click', @methodologyLinkClickHandler
    @methodologyLink.addEventListener 'keyup', @methodologyLinkEnterHandler


    @viz1Link = @app.window.document.getElementById 'viz1Anchor'
    @viz1LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz1'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz1LinkEnterHandler = (event) =>
      event.preventDefault()
      if event.key == 'Enter'
        @app.router.navigate
          page: 'viz1'
          language: @app.language

    @viz1Link.addEventListener 'click', @viz1LinkClickHandler
    @viz1Link.addEventListener 'keyup', @viz1LinkEnterHandler


    @viz2Link = @app.window.document.getElementById 'viz2Anchor'
    @viz2LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz2'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz2LinkEnterHandler = (event) =>
      event.preventDefault()
      if event.key == 'Enter'
        @app.router.navigate
          page: 'viz2'
          language: @app.language
    @viz2Link.addEventListener 'keyup', @viz2LinkEnterHandler
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
      event.preventDefault()
      if event.key == 'Enter'
        @app.router.navigate
          page: 'viz3'
          language: @app.language
    @viz3Link.addEventListener 'click', @viz3LinkClickHandler
    @viz3Link.addEventListener 'keyup', @viz3LinkEnterHandler


    @viz4Link = @app.window.document.getElementById 'viz4Anchor'
    @viz4LinkClickHandler = (event) =>
      event.preventDefault()
      @app.router.navigate {
        page: 'viz4'
        language: @app.language
      },
        shouldSelectNavbarItem: false
    @viz4LinkEnterHandler = (event) =>
      event.preventDefault()
      if event.key == 'Enter'
        @app.router.navigate
          page: 'viz4'
          language: @app.language
    @viz4Link.addEventListener 'click', @viz4LinkClickHandler
    @viz4Link.addEventListener 'keyup', @viz4LinkEnterHandler

  removeEventListeners: ->

    @aboutHyperlink.removeEventListener 'click', @aboutHyperlinkClickHandler
    @aboutHyperlink.removeEventListener 'keyup', @aboutHyperlinkEnterHandler
    @methodologyLink.removeEventListener 'click', @methodologyLinkClickHandler
    @methodologyLink.removeEventListener 'keyup', @methodologyLinkEnterHandler

    @viz1Link.removeEventListener 'click', @viz1LinkClickHandler
    @viz1Link.removeEventListener 'keyup', @viz1LinkEnterHandler
    @viz2Link.removeEventListener 'click', @viz2LinkClickHandler
    @viz2Link.removeEventListener 'keyup', @viz2LinkEnterHandler
    @viz3Link.removeEventListener 'click', @viz3LinkClickHandler
    @viz3Link.removeEventListener 'keyup', @viz3LinkEnterHandler
    @viz4Link.removeEventListener 'click', @viz4LinkClickHandler
    @viz4Link.removeEventListener 'keyup', @viz4LinkEnterHandler



  tearDown: ->
    @removeEventListeners()
    @app.window.document.getElementById('visualizationContent').innerHTML = ''

  # for resizing
  # coffeelint: disable=no_empty_functions
  redraw: ->
  # coffeelint: enable=no_empty_functions



module.exports = LandingPage

