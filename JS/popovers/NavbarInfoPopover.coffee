d3 = require 'd3'

Tr = require '../TranslationTable.coffee'

class NavbarInfoPopover

  constructor: (@app) ->

  show: (options) ->
    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('.navbarHelpSection').on 'click', ->
      d3.event.stopPropagation()

    # Set the content of the pop up
    d3.select('.navbarHelpSection').html (e) => options.navbarInfoText

    # Set up the info icon
    d3.select('.navbarMenuIcon').html "<img src='#{options.navbarInfoImageSelected}' alt='#{Tr.altText.explanationIcon_ColourBG[@app.language]}'>"

    # 'selected' class controls white background color
    d3.select('.navbarMenuIcon').classed('selected', true)

    d3.select('.navbarHelpSection').classed('hidden', false)

  close: ->

    d3.select('.navbarMenuIcon').classed('selected', false)
    d3.select('.navbarMenuIcon').html "<img src='IMG/navbar_Icons/explanationIcon_ColourBG.svg' alt='#{Tr.altText.explanationIcon_ColourBG[@app.language]}'>"
    d3.select('.navbarHelpSection').classed('hidden', true)




        





module.exports = NavbarInfoPopover