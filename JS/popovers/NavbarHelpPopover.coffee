d3 = require 'd3'
Mustache = require 'mustache'

HowToPopoverTemplate = require '../templates/HowToPopover.mustache'


class NavbarInfoPopover

  constructor: ->

  show: (options) ->
    # Set the content of the pop up        
    d3.select('.navbarHelpSection').html (e) => Mustache.render HowToPopoverTemplate, 
      imageAUrl: options.imageAUrl
      imageBUrl: options.imageBUrl

    # Set up event handlers to swap between the two help images
    d3.select('.howToBackButton').on 'click', ->
      d3.select('.imageAContainer').classed 'hidden', false
      d3.select('.imageBContainer').classed 'hidden', true
      
      d3.select('.howToBackButton').attr 'disabled', 'disabled'
      d3.select('.howToBackButton').html """
        <img src="IMG/howto/light-left-arrow.png">
      """
      d3.select('.howToForwardButton').attr 'disabled', null
      d3.select('.howToForwardButton').html """
        <img src="IMG/howto/dark-right-arrow.png">
      """

    d3.select('.howToForwardButton').on 'click', ->
      d3.select('.imageAContainer').classed 'hidden', true
      d3.select('.imageBContainer').classed 'hidden', false

      d3.select('.howToBackButton').attr 'disabled', null
      d3.select('.howToBackButton').html """
        <img src="IMG/howto/dark-left-arrow.png">
      """
      d3.select('.howToForwardButton').attr 'disabled', 'disabled'
      d3.select('.howToForwardButton').html """
        <img src="IMG/howto/light-right-arrow.png">
      """
      
    # Set up the help icon
    d3.select('.navbarHelpIcon').html "<img src='#{options.navbarHelpImageSelected}'>"
    # Class 'selected' sets the white background colour
    d3.select('.navbarHelpIcon').classed('selected', true) 
  

    d3.select('.navbarHelpSection').classed('hidden', false)


  close: ->
    d3.select('.navbarHelpIcon').classed('selected', false) 
    d3.select('.navbarHelpIcon').html "<img src='IMG/navbar_Icons/questionMark_ColourBG.svg'>"
    d3.select('.navbarHelpSection').classed('hidden', true)


  



        





module.exports = NavbarInfoPopover