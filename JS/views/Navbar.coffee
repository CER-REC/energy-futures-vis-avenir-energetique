d3 = require 'd3'
Tr = require '../TranslationTable.coffee'

NavbarInfoPopover = require '../popovers/NavbarInfoPopover.coffee'
NavbarHelpPopover = require '../popovers/NavbarHelpPopover.coffee'


class Navbar

  constructor: (@app) ->
    # navbarState can be one of: landingPage, viz1, viz2, viz3, viz4
    @navbarState = null

    @navbarInfoPopover = new NavbarInfoPopover @app
    @navbarHelpPopover = new NavbarHelpPopover @app

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
          unselectedLabel: Tr.allPages.visualization4NavbarLink[@app.language]
          selectedLabel: Tr.visualization4Titles[@app.visualization4Configuration.mainSelection][@app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_ScenarioHighlighted.svg'
          infoPopoverText: Tr.navbarInfoText.viz4[@app.language]
          infoPopoverHeader: Tr.navbarInfoHeadings.viz4[@app.language]
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_ScenarioHighlighted.svg'
          colour: 'rgb(202, 152, 48)'
          page: 'viz4'
          imageAUrl: Tr.howToImages.viz4A[@app.language]
          imageBUrl: Tr.howToImages.viz4B[@app.language]
          helpPopoverHeaderClass: 'viz4HelpTitle'
        }
        {
          unselectedLabel: Tr.allPages.visualization3NavbarLink[@app.language]
          selectedLabel: Tr.visualization3Title[@app.language]
          infoPopoverText: Tr.navbarInfoText.viz3[@app.language]
          infoPopoverHeader: Tr.navbarInfoHeadings.viz3[@app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_ElectricityHighlighted.svg'
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_ElectricityHighlighted.svg'
          colour: 'rgb(54, 55, 150)'
          page: 'viz3'
          imageAUrl: Tr.howToImages.viz3A[@app.language]
          imageBUrl: Tr.howToImages.viz3B[@app.language]
          helpPopoverHeaderClass: 'viz3HelpTitle'
        }
        {
          unselectedLabel: Tr.allPages.visualization2NavbarLink[@app.language]
          selectedLabel: Tr.visualization2Title[@app.language]
          infoPopoverText: Tr.navbarInfoText.viz2[@app.language]
          infoPopoverHeader: Tr.navbarInfoHeadings.viz2[@app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_SectorHighlighted.svg'
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_SectorHighlighted.svg'
          colour: 'rgb(52, 153, 153)'
          page: 'viz2'
          imageAUrl: Tr.howToImages.viz2A[@app.language]
          imageBUrl: Tr.howToImages.viz2B[@app.language]
          helpPopoverHeaderClass: 'viz2HelpTitle'
        }
        {
          unselectedLabel: Tr.allPages.visualization1NavbarLink[@app.language]
          selectedLabel: Tr.visualization1Titles[@app.visualization1Configuration.mainSelection][@app.language]
          infoPopoverText: Tr.navbarInfoText.viz1[@app.language]
          infoPopoverHeader: Tr.navbarInfoHeadings.viz1[@app.language]
          navbarHelpImageSelected: 'IMG/navbar_Icons/questionMark_RegionHighlighted.svg'
          navbarInfoImageSelected: 'IMG/navbar_Icons/explanationIcon_RegionHighlighted.svg'
          colour: 'rgb(103, 153, 204)'
          page: 'viz1'
          imageAUrl: Tr.howToImages.viz1A[@app.language]
          imageBUrl: Tr.howToImages.viz1B[@app.language]
          helpPopoverHeaderClass: 'viz1HelpTitle'
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
      d3.select '#vizNavbar'
        .classed 'hidden', true
      d3.select '#landingPageHeading'
        .classed 'hidden', false
    else
      d3.select '#vizNavbar'
        .classed 'hidden', false
      d3.select '#landingPageHeading'
        .classed 'hidden', true

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
    d3.select '#vizNavbar'
      .selectAll '.vizNavbarItem'
      .data @navbarData()

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
          @app.router.navigate
            page: d.page
            language: @app.language
      .style
        'background-color': (d) -> d.colour
        width: (d) =>
          if d.page == 'landingPage'
            '4.2%'
          else if @navbarState == d.page
            '66.1%'
          else
            '9.9%'

  renderHtml: ->
    vizNavbar = @vizNavbar()

    vizNavbar
      .html (d) =>
        if d.page == 'landingPage'
          "<div class='vizNavbarHomeButton'> </div>"
        else if @navbarState == d.page
          "<div class='navbarSelectedItem'>
            <span>#{d.selectedLabel}</span>

            <div class='float-right'>
              <div class='navbarMenuIcon navbarButton'
                   role='button'
                   aria-label='#{Tr.altText.explanationIcon_ColourBG[@app.language]}'
                   tabindex='0'
              >
                <img src='IMG/navbar_Icons/explanationIcon_ColourBG.svg'
                     alt='#{Tr.altText.explanationIcon_ColourBG[@app.language]}'
                >
              </div>
              <div class='navbarHelpIcon navbarButton'
                   role='button'
                   aria-label='#{Tr.altText.questionMark_ColourBG[@app.language]}'
                   tabindex='0'
              >
                <img src='IMG/navbar_Icons/questionMark_ColourBG.svg'
                     alt='#{Tr.altText.questionMark_ColourBG[@app.language]}'
                >
              </div>
            </div>
            <div class='vizModal navbarHelpSection hidden' role='dialog' aria-labelledby='navbarHelpPopoverHeading'>
            </div>
            <div class='vizModal navbarInfoSection hidden' role='dialog' aria-labelledby='navbarInfoPopoverHeading'>
            </div>
          </div>
          "
        else
          "<div class='navbarUnselectedItem'>
            <span>#{d.unselectedLabel}</span>
          </div>"


    # TODO: would be good to unsubscribe these events on page navigation

    helpButtonClick = (d) =>
      d3.event.stopPropagation()
      if @app.popoverManager.currentPopover == @navbarHelpPopover
        @app.popoverManager.closePopover()
      else
        @app.popoverManager.showPopover @navbarHelpPopover,
          imageAUrl: d.imageAUrl
          imageBUrl: d.imageBUrl
          navbarHelpImageSelected: d.navbarHelpImageSelected
          helpPopoverHeaderClass: d.helpPopoverHeaderClass
        @app.analyticsReporter.reportEvent 'Navbar help', @navbarState
    
    vizNavbar.select('.navbarHelpIcon')
      .on 'click', helpButtonClick
      .on 'keydown', (d) ->
        helpButtonClick(d) if d3.event.key == 'Enter'

    infoButtonClick = (d) =>
      d3.event.stopPropagation()
      if @app.popoverManager.currentPopover == @navbarInfoPopover
        @app.popoverManager.closePopover()
      else
        @app.popoverManager.showPopover @navbarInfoPopover,
          navbarInfoImageSelected: d.navbarInfoImageSelected
          infoPopoverText: d.infoPopoverText
          infoPopoverHeader: d.infoPopoverHeader
          infoPopoverHeaderClass: d.helpPopoverHeaderClass
        @app.analyticsReporter.reportEvent 'Navbar info', @navbarState

    vizNavbar.select('.navbarMenuIcon')
      .on 'click', infoButtonClick
      .on 'keydown', (d) ->
        infoButtonClick(d) if d3.event.key == 'Enter'




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
      .duration @app.animationDuration
      .style
        opacity: 1

    vizNavbar.transition()
      .duration @app.animationDuration
      .styleTween 'width', (d, i, a) ->
        return if d.page == 'landingPage'
        if self.navbarState == d.page
          d3.interpolateString @style.width, '66.1%'
        else
          d3.interpolateString @style.width, '9.9%'

  renderExit: ->
    @vizNavbar().exit().remove()



module.exports = Navbar