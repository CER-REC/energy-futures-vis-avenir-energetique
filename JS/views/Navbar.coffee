d3 = require 'd3'
Tr = require '../TranslationTable.coffee'

HowToPopoverTemplate = require '../templates/HowToPopover.mustache'

NavbarInfoPopover = require '../popovers/NavbarInfoPopover.coffee'

Mustache = require 'mustache'


class Navbar 

  constructor: ->
    # navbarState can be one of: landingPage, viz1, viz2, viz3, viz4
    @navbarState = null

    @navbarInfoPopover = new NavbarInfoPopover()


  # NB: This data is in REVERSE order on purpose
  # We float the resulting divs to the right, which means they appear in the reverse
  # of the order the data is in here
  # We have to float right in order to achieve the desired drop shadowing appearance
  navbarData: ->
    if @navbarState == 'landingPage'
      []
    else
      [
        {
          unselectedLabel: Tr.allPages.visualization4NavbarLink[app.language]
          selectedLabel: Tr.visualization4Titles[app.visualization4Configuration.mainSelection][app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_ScenarioHighlighted.svg'
          navbarInfoText: Tr.visualization4NavbarHelp[app.language]
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_ScenarioHighlighted.svg'
          colour: 'rgb(202, 152, 48)'
          page: 'viz4'
          imageAUrl: Tr.howToImages.viz4A[app.language]
          imageBUrl: Tr.howToImages.viz4B[app.language]
        }
        {
          unselectedLabel: Tr.allPages.visualization3NavbarLink[app.language]
          selectedLabel: Tr.visualization3Title[app.language]
          navbarInfoText: Tr.visualization3NavbarHelp[app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_ElectricityHighlighted.svg'
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_ElectricityHighlighted.svg'
          colour: 'rgb(54, 55, 150)'
          page: 'viz3'
          imageAUrl: Tr.howToImages.viz3A[app.language]
          imageBUrl: Tr.howToImages.viz3B[app.language]
        }
        {
          unselectedLabel: Tr.allPages.visualization2NavbarLink[app.language]
          selectedLabel: Tr.visualization2Title[app.language]
          navbarInfoText: Tr.visualization2NavbarHelp[app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_SectorHighlighted.svg'
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_SectorHighlighted.svg'
          colour: 'rgb(52, 153, 153)'
          page: 'viz2'
          imageAUrl: Tr.howToImages.viz2A[app.language]
          imageBUrl: Tr.howToImages.viz2B[app.language]
        }
        {
          unselectedLabel: Tr.allPages.visualization1NavbarLink[app.language]
          selectedLabel: Tr.visualization1Titles[app.visualization1Configuration.mainSelection][app.language]
          navbarInfoText: Tr.visualization1NavbarHelp[app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_RegionHighlighted.svg'
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_RegionHighlighted.svg'
          colour: 'rgb(103, 153, 204)'
          page: 'viz1'
          imageAUrl: Tr.howToImages.viz1A[app.language]
          imageBUrl: Tr.howToImages.viz1B[app.language]
        }
        {
          img: 'IMG/home.svg'
          unselectedLabel: ''
          selectedLabel: ''
          colour: '#333'
          page: 'landingPage'
        }    
      ]


    
  

  setNavBarState: (newState) ->
    
    oldState = @navbarState
    @navbarState = newState

    if @navbarState == 'landingPage'
      d3.select('#vizNavbar').classed('hidden', true)
      d3.select("#landingPageHeading").classed("hidden", false)
    else
      d3.select('#vizNavbar').classed('hidden', false)
      d3.select("#landingPageHeading").classed("hidden", true)

    # Whether we should animate the navbar depends on how we arrive on the page
    if oldState == newState
      # When updating the current page, replace the title without animation
      @renderWithoutAnimation()
    else if not oldState?
      # Arrival on Visualization page: no animation
      @renderWithoutAnimation()
    else if oldState == 'landingPage' and @navbarState != 'landingPage'
      # Landing page -> Visualization page: no animation
      @renderWithoutAnimation()
    else
      # Visualization page -> Visualization page: animate
      @renderWithAnimation()


  # Internal Methods

  vizNavbar: ->
    d3.select('#vizNavbar')
      .selectAll('.vizNavbarItem')
      .data(@navbarData())

  renderWithoutAnimation: ->
    @renderEnter()
    @renderHtml()
    @renderExit()

  renderWithAnimation: ->
    @renderEnter()
    @renderHtml()
    @renderAnimation()
    @renderExit()



  renderEnter: ->
    vizNavbar = @vizNavbar()

    vizNavbar.enter()
      .append('div')
      .attr
        class: 'vizNavbarItem'
      .on 'click', (d) =>
        d3.event.preventDefault()
        if d.page != @navbarState
          app.router.navigate
            page: d.page
      .style 
        'background-color': (d) -> d.colour
        width: (d) => 
          if d.page == 'landingPage'
            '4.2%'
          else if @navbarState == d.page
            "66.1%"
          else
            "9.9%"

  renderHtml: ->
    vizNavbar = @vizNavbar()

    vizNavbar
      .html (d) =>
        if d.page == 'landingPage'
          "<div class='vizNavbarHomeButton'> </div>"
        else if @navbarState == d.page
          "<div class='navbarSelectedItem'> 
            <span>#{d.selectedLabel}</span>
            <div class='navbarHelpIcon'>
              <img src='IMG/navbar_Icons/questionMark_ColourBG.svg'>
            </div>
            <div class='navbarMenuIcon'>
              <img src='IMG/navbar_Icons/explanationIcon_ColourBG.svg'>
            </div>
            <div class='navbarHelpSection hidden'>
            </div>
          </div>
          "
        else
          "<div class='navbarUnselectedItem'> 
            <span>#{d.unselectedLabel}</span>
          </div>"

    
    vizNavbar.select('.navbarHelpIcon')
      .on 'click', (d) ->
        # Set the content of the pop up        
        d3.select('.navbarHelpSection').html (e) => Mustache.render HowToPopoverTemplate, 
          imageAUrl: d.imageAUrl
          imageBUrl: d.imageBUrl

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

        # Set up the help icon: depending on selection
        d3.select('.navbarHelpIcon').classed('selected', !(d3.select('.navbarHelpIcon').classed('selected')))
        if d3.select('.navbarHelpIcon').classed('selected') 
          d3.select('.navbarHelpIcon').html "<img src='#{d.navbarHelpImageSelected}'>"
        else
          d3.select('.navbarHelpIcon').html "<img src='IMG/navbar_Icons/questionMark_ColourBG.svg'>"
        
        # Either way the explanation icon should be unselected
        d3.select('.navbarMenuIcon').classed('selected', false)
        d3.select('.navbarMenuIcon').html "<img src='IMG/navbar_Icons/explanationIcon_ColourBG.svg'>"
        
        # Determine whether to hide or show the element
        d3.select('.navbarHelpSection').classed('hidden', !(d3.select('.navbarHelpIcon').classed('selected')))


    vizNavbar.select('.navbarMenuIcon')
      .on 'click', (d) =>

        if app.popoverManager.current_popover == @navbarInfoPopover
          app.popoverManager.close_popover()
        else
          app.popoverManager.show_popover @navbarInfoPopover, 
            navbarInfoText: d.navbarInfoText
            navbarInfoImageSelected: d.navbarInfoImageSelected



        # # Set the content of the pop up
        # d3.select('.navbarHelpSection').html (e) => d.navbarInfoText
        
        # # Set up the info icon: depending on selection
        # d3.select('.navbarMenuIcon').classed('selected', !(d3.select('.navbarMenuIcon').classed('selected')))
        # if d3.select('.navbarMenuIcon').classed('selected') 
        #   d3.select('.navbarMenuIcon').html "<img src='#{d.navbarInfoImageSelected}'>"
        # else
        #   d3.select('.navbarMenuIcon').html "<img src='IMG/navbar_Icons/explanationIcon_ColourBG.svg'>"
        
        # # Either way the explanation help should be unselected
        # d3.select('.navbarHelpIcon').classed('selected', false)
        # d3.select('.navbarHelpIcon').html "<img src='IMG/navbar_Icons/questionMark_ColourBG.svg'>"
        
        # # Determine whether to hide or show the element
        # d3.select('.navbarHelpSection').classed('hidden', !(d3.select('.navbarMenuIcon').classed('selected')))




  renderAnimation: ->
    vizNavbar = @vizNavbar()
    
    # NB: Both animation callbacks require access to the 'this' set by d3, so we can't
    # use coffeescript's fat arrow / bound function (=>)
    # Instead, we pass in the Navbar object via closure:
    self = this

    # Set opacity to zero for the text element we want to fade in, before animating
    vizNavbar.each (d) ->
      d3.select(@).selectAll('span')
        .style
          opacity: 
            if self.navbarState == d.page then 0 else 1
    vizNavbar.selectAll('span').transition()
      .duration 1000
      .style
        opacity: 1

    vizNavbar.transition()
      .duration 1000
      .styleTween 'width', (d, i, a) ->
        return if d.page == 'landingPage'
        if self.navbarState == d.page
          d3.interpolateString(@style.width, '66.1%')
        else
          d3.interpolateString(@style.width, '9.9%')

  renderExit: ->
    @vizNavbar().exit().remove()



module.exports = Navbar