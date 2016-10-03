Tr = require '../TranslationTable.coffee'
Mustache = require 'mustache'

LandingPageTemplate = require '../templates/LandingPage.mustache'


class LandingPage

  constructor: ->
    document.getElementById('landingPageHeading').innerHTML = Tr.landingPage.mainHeader[app.language]

    document.getElementById('visualizationContent').innerHTML = Mustache.render LandingPageTemplate, 
        content: Tr.landingPage.content1[app.language]
        visualization1Link: Tr.landingPage.visualization1Link[app.language]
        visualization2Link: Tr.landingPage.visualization2Link[app.language]
        visualization3Link: Tr.landingPage.visualization3Link[app.language]
        visualization4Link: Tr.landingPage.visualization4Link[app.language]


    document.getElementById("viz1Anchor").addEventListener 'click', (event) -> 
      event.preventDefault()  
      app.router.navigate 
        page: 'viz1'
    document.getElementById("viz2Anchor").addEventListener 'click', (event) -> 
      event.preventDefault()  
      app.router.navigate 
        page: 'viz2'
    document.getElementById("viz3Anchor").addEventListener 'click', (event) -> 
      event.preventDefault()  
      app.router.navigate 
        page: 'viz3'
    document.getElementById("viz4Anchor").addEventListener 'click', (event) -> 
      event.preventDefault()  
      app.router.navigate 
        page: 'viz4'

    
  tearDown: ->
    document.getElementById('visualizationContent').innerHTML = '' 

  # for resizing
  redraw: ->

LandingPage.resourcesLoaded = ->
  # No data dependencies for this one
  true


module.exports = LandingPage

