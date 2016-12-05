Tr = require '../TranslationTable.coffee'
Mustache = require 'mustache'

LandingPageTemplate = require '../templates/LandingPage.mustache'

# A WET 4 compatible video template was built in anticipation of an eventual upgrade to WET 4. 
# The WET 4 video template was built to work in the stock WET 4 distribution template, if 
# the production version of WET 4 at the NEB is similar enough to the stock version, then
# swapping out the WET 3 video for the WET 4 video should just work. 

Wet3VideoTemplate = require '../templates/Wet3Video.mustache'
# Wet4VideoTemplate = require '../templates/Wet4Video.mustache'

PopoverManager = require '../PopoverManager.coffee'
AboutThisProjectPopover = require '../popovers/AboutThisProjectPopover.coffee'

class LandingPage

  constructor: (@app) ->
    @app.window.document.getElementById('landingPageHeading').innerHTML = Tr.landingPage.mainHeader[@app.language]

    @app.window.document.getElementById('visualizationContent').innerHTML = Mustache.render LandingPageTemplate, 
        content: Tr.landingPage.content1[@app.language]
        panelClass: @app.language
        visualization1Link: Tr.landingPage.visualization1Link[@app.language]
        visualization2Link: Tr.landingPage.visualization2Link[@app.language]
        visualization3Link: Tr.landingPage.visualization3Link[@app.language]
        visualization4Link: Tr.landingPage.visualization4Link[@app.language]
        panelRightContent: Mustache.render(Wet3VideoTemplate)
        # panelRightContent: Mustache.render(Wet4VideoTemplate)

    @popoverManager = new PopoverManager()
    @aboutThisProjectPopover = new AboutThisProjectPopover @app

    @app.window.document.getElementById("aboutHyperlink").addEventListener 'click', (event) => 
      event.preventDefault()
      event.stopPropagation()
      @popoverManager.showPopover @aboutThisProjectPopover

    @app.window.document.getElementById("aboutModal").getElementsByClassName("closeButton")[0].addEventListener 'click', (event) =>
      event.preventDefault()
      event.stopPropagation()
      @popoverManager.closePopover()

    @app.window.document.getElementById("viz1Anchor").addEventListener 'click', (event) => 
      event.preventDefault()  
      @app.router.navigate 
        page: 'viz1'
    @app.window.document.getElementById("viz2Anchor").addEventListener 'click', (event) => 
      event.preventDefault()  
      @app.router.navigate 
        page: 'viz2'
    @app.window.document.getElementById("viz3Anchor").addEventListener 'click', (event) => 
      event.preventDefault()  
      @app.router.navigate 
        page: 'viz3'
    @app.window.document.getElementById("viz4Anchor").addEventListener 'click', (event) => 
      event.preventDefault()  
      @app.router.navigate 
        page: 'viz4'

    
  tearDown: ->
    @app.window.document.getElementById('visualizationContent').innerHTML = '' 

  # for resizing
  redraw: ->



module.exports = LandingPage

