d3 = require 'd3'
Mustache = require 'mustache'

NavbarInfoPopoverTemplate = require '../templates/NavbarInfoPopover.mustache'
Tr = require '../TranslationTable.coffee'

class NavbarInfoPopover

  # coffeelint: disable=no_empty_functions
  constructor: (@app) ->
  # coffeelint: enable=no_empty_functions

  show: (options) ->
    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('.navbarInfoSection').on 'click', ->
      d3.event.stopPropagation()

    # Set the content of the pop up
    d3.select('.navbarInfoSection').html => Mustache.render NavbarInfoPopoverTemplate,
      closeButtonAltText: Tr.altText.closeButton[@app.language]
      infoPopoverText: options.infoPopoverText
      infoPopoverHeader: options.infoPopoverHeader
      infoPopoverHeaderClass: options.infoPopoverHeaderClass


    @closeButton = d3.select '.navbarInfoSection .closeButton'

    @closeButtonClickHandler = =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @app.popoverManager.closePopover()

    @closeButtonEnterHandler = =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      if d3.event.key == 'Enter'
        @app.popoverManager.closePopover()

    @closeButton.on 'click', @closeButtonClickHandler
    @closeButton.on 'keyup', @closeButtonEnterHandler



    # Navbar: set up the info icon
    d3.select('.navbarMenuIcon').html "<img src='#{options.navbarInfoImageSelected}' alt='#{Tr.altText.explanationIcon_ColourBG[@app.language]}'>"

    # Navbar: 'selected' class controls white background color
    d3.select('.navbarMenuIcon').classed 'selected', true

    d3.select('.navbarInfoSection').classed 'hidden', false

  close: ->

    @closeButton.on 'click', null
    @closeButton.on 'keyup', null

    d3.select('.navbarMenuIcon').classed 'selected', false
    d3.select('.navbarMenuIcon').html "<img src='IMG/navbar_Icons/explanationIcon_ColourBG.svg' alt='#{Tr.altText.explanationIcon_ColourBG[@app.language]}'>"
    d3.select('.navbarInfoSection').classed 'hidden', true




        





module.exports = NavbarInfoPopover