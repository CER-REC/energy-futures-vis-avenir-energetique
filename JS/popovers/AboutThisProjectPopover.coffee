d3 = require 'd3'
Mustache = require 'mustache'

Tr = require '../TranslationTable.coffee'
AboutThisProjectTemplate = require '../templates/AboutThisProject.mustache'

class AboutThisProjectPopover

  constructor: ->
    document.getElementById('aboutModal').innerHTML = Mustache.render AboutThisProjectTemplate,
        aboutTitle: Tr.aboutThisProject.aboutTitle[app.language]
        aboutContent: Tr.aboutThisProject.aboutContent[app.language]

  show: ->
    d3.select('#aboutModal').classed('hidden', false)

  close: ->
    d3.select('#aboutModal').classed('hidden', true)




module.exports = AboutThisProjectPopover