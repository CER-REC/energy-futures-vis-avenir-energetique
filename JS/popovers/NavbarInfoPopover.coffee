d3 = require 'd3'

class NavbarInfoPopover

  constructor: ->

  show: (options) ->
    # Set the content of the pop up
    d3.select('.navbarHelpSection').html (e) => options.navbarInfoText

    # Set up the info icon
    d3.select('.navbarMenuIcon').html "<img src='#{options.navbarInfoImageSelected}'>"

    # 'selected' class controls white background color
    d3.select('.navbarMenuIcon').classed('selected', true)

    d3.select('.navbarHelpSection').classed('hidden', false)

  close: ->

    d3.select('.navbarMenuIcon').classed('selected', false)
    d3.select('.navbarMenuIcon').html "<img src='IMG/navbar_Icons/explanationIcon_ColourBG.svg'>"
    d3.select('.navbarHelpSection').classed('hidden', true)




        





module.exports = NavbarInfoPopover