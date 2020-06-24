d3 = require 'd3'
Mustache = require 'mustache'

NavbarHelpPopoverTemplate = require '../templates/NavbarHelpPopover.mustache'
Tr = require '../TranslationTable.coffee'

class NavbarHelpPopover

  # coffeelint: disable=no_empty_functions
  constructor: (@app) ->
  # coffeelint: enable=no_empty_functions

  show: (options) ->
    # Prevent clicks on the popover from propagating up to the body element, which would
    # cause the popover to be closed.
    d3.select('.navbarHelpSection').on 'click', ->
      d3.event.stopPropagation()

    # Set the content of the pop up
    d3.select('.navbarHelpSection').html => Mustache.render NavbarHelpPopoverTemplate,
      imageAUrl: options.imageAUrl
      imageBUrl: options.imageBUrl
      nextImageAltText: Tr.altText.nextImage[@app.language]
      previousImageAltText: Tr.altText.previousImage[@app.language]
      imageAltText: Tr.altText.howToImage[@app.language]
      closeButtonAltText: Tr.altText.closeButton[@app.language]
      helpPopoverHeader: Tr.allPages.helpPopoverHeader[@app.language]
      helpPopoverHeaderClass: options.helpPopoverHeaderClass

    # Set up event handlers to swap between the two help images
    d3.select('.howToBackButton').on 'click', =>
      d3.select('.imageAContainer').classed 'hidden', false
      d3.select('.imageBContainer').classed 'hidden', true
      
      d3.select('.howToBackButton').attr 'disabled', 'disabled'
      d3.select('.howToBackButton').html """
        <img src="IMG/howto/light-left-arrow.png" alt='#{Tr.altText.previousImage[@app.language]}'>
      """
      d3.select('.howToForwardButton').attr 'disabled', null
      d3.select('.howToForwardButton').html """
        <img src="IMG/howto/dark-right-arrow.png" alt='#{Tr.altText.nextImage[@app.language]}'>
      """

    d3.select('.howToForwardButton').on 'click', =>
      d3.select('.imageAContainer').classed 'hidden', true
      d3.select('.imageBContainer').classed 'hidden', false

      d3.select('.howToBackButton').attr 'disabled', null
      d3.select('.howToBackButton').html """
        <img src="IMG/howto/dark-left-arrow.png" alt='#{Tr.altText.previousImage[@app.language]}'>
      """
      d3.select('.howToForwardButton').attr 'disabled', 'disabled'
      d3.select('.howToForwardButton').html """
        <img src="IMG/howto/light-right-arrow.png" alt='#{Tr.altText.nextImage[@app.language]}'>
      """


    @closeButton = d3.select '.navbarHelpSection .closeButton'

    @closeButtonClickHandler = =>
      d3.event.preventDefault()
      d3.event.stopPropagation()
      @app.popoverManager.closePopover()

    @closeButtonEnterHandler = =>
      if d3.event.key == 'Enter' or d3.event.key == ' '
        d3.event.preventDefault()
        d3.event.stopPropagation()
        @app.popoverManager.closePopover()

    @closeButton.on 'click', @closeButtonClickHandler
    @closeButton.on 'keydown', @closeButtonEnterHandler



    # Set up the help icon
    d3.select('.navbarHelpIcon').html "<img src='#{options.navbarHelpImageSelected}' alt='#{Tr.altText.questionMark_ColourBG[@app.language]}'>"
    # Class 'selected' sets the white background colour
    d3.select('.navbarHelpIcon').classed 'selected', true
  

    d3.select('.navbarHelpSection').classed('hidden', false)


  close: ->

    @closeButton.on 'click', null
    @closeButton.on 'keydown', null

    d3.select('.navbarHelpIcon').classed 'selected', false
    d3.select('.navbarHelpIcon').html "<img src='IMG/navbar_icons/questionMark_ColourBG.svg' alt='#{Tr.altText.questionMark_ColourBG[@app.language]}'>"
    d3.select('.navbarHelpSection').classed 'hidden', true


  focus: ->
    @app.window.document.getElementById('navbarHelpPopoverHeading').focus()

  container: ->
    @app.window.document.querySelector '.navbarHelpSection'



module.exports = NavbarHelpPopover