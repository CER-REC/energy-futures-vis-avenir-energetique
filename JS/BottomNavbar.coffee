d3 = require 'd3'
Mustache = require 'mustache'

Tr = require './TranslationTable.coffee'
BottomNavBarTemplate = require './templates/BottomNavBar.mustache'
ShortLinkBitly = require './ShortLinkBitly.coffee'


class BottomNavbar

  constructor: (@app) ->

    bottomNavBarElement = @app.window.document.getElementById 'bottomNavBar'
    bottomNavBarElement.innerHTML = Mustache.render BottomNavBarTemplate,
      aboutLink: Tr.allPages.aboutLink[@app.language]
      methodologyLinkText: Tr.allPages.methodologyLinkText[@app.language]
      methodologyLinkUrl: Tr.allPages.methodologyLinkUrl[@app.language]
      shareLabel: Tr.allPages.shareLabel[@app.language]
      dataDownloadLink: Tr.allPages.dataDownloadLink[@app.language]
      twitterAltText: Tr.altText.twitter[@app.language]
      linkedinAltText: Tr.altText.linkedin[@app.language]
      emailAltText: Tr.altText.email[@app.language]


    # TODO: For now, the bottom navbar is never destroyed after being created, so never
    # removing these event handlers is not a performance problem. Remove them if this
    # changes.

    @aboutLink = d3.select '#aboutLinkAnchor'
    @aboutLink.on 'click', @aboutClickHandler
    @aboutLink.on 'keydown', =>
      if d3.event.key == 'Enter' or d3.event.key == ' '
        d3.event.preventDefault()
        @aboutClickHandler()

    @methodologyLinkAnchor = d3.select '#methodologyLinkAnchor'
    @methodologyLinkAnchor.on 'click', @methodologyClickHandler
    @methodologyLinkAnchor.on 'keydown', =>
      if d3.event.key == 'Enter' # Links are not triggered on space
        # Don't prevent default, we want the default behaviour here
        @methodologyClickHandler()

    @dataDownloadLinkAnchor = d3.select '#dataDownloadLinkAnchor'
    @dataDownloadLinkAnchor.on 'click', @dataDownloadClickHandler
    @dataDownloadLinkAnchor.on 'keydown', =>
      if d3.event.key == 'Enter' # Links are not triggered on space
        # Don't prevent default, we want the default behaviour here
        @dataDownloadClickHandler()

    @twitterLink = d3.select '#twitterLinkAnchor'
    @twitterLink.on 'click', @twitterClickHandler
    @twitterLink.on 'keydown', =>
      if d3.event.key == 'Enter' or d3.event.key == ' '
        d3.event.preventDefault()
        @twitterClickHandler()

    @linkedinLink = d3.select '#linkedInLinkAnchor'
    @linkedinLink.on 'click', @linkedinClickHandler
    @linkedinLink.on 'keydown', =>
      if d3.event.key == 'Enter' or d3.event.key == ' '
        d3.event.preventDefault()
        @linkedinClickHandler()

    @emailLink = d3.select '#emailLinkAnchor'
    @emailLink.on 'click', @emailClickHandler
    @emailLink.on 'keydown', =>
      if d3.event.key == 'Enter' or d3.event.key == ' '
        d3.event.preventDefault()
        @emailClickHandler()




  aboutClickHandler: =>
    d3.event.preventDefault()
    # Prevents the popover from being immediately closed:
    d3.event.stopPropagation()
    @app.popoverManager.showPopover @app.aboutThisProjectPopover,
      elementToFocusOnClose: @app.window.document.getElementById('aboutLinkAnchor')

    @app.analyticsReporter.reportedEvent
      visualizationMode: @app.page
      action: d3.event.type
      category: 'Bottom Navbar'
      label: 'About'

  methodologyClickHandler: =>
    @app.analyticsReporter.reportedEvent
      visualizationMode: @app.page
      action: d3.event.type
      category: 'Bottom Navbar'
      label: 'Download Methodology'

  dataDownloadClickHandler: =>
    @app.analyticsReporter.reportedEvent
      visualizationMode: @app.page
      action: d3.event.type
      category: 'Bottom Navbar'
      label: 'Download Data CSV'

  twitterClickHandler: =>
    d3.event.preventDefault()
    ShortLinkBitly @app, (url) =>
      @app.window.open "https://twitter.com/intent/tweet?url=#{url}", 'targetWindow', 'width=650,height=650'
    @app.analyticsReporter.reportedEvent
      visualizationMode: @app.page
      action: d3.event.type
      category: 'Bottom Navbar'
      label: 'Twitter popup'

  linkedinClickHandler: =>
    d3.event.preventDefault()
    ShortLinkBitly @app, (url) =>
      @app.window.open "https://www.linkedin.com/shareArticle?mini=true&url=#{url}&summary=#{url}", 'targetWindow', 'width=650,height=650'
    @app.analyticsReporter.reportedEvent
      visualizationMode: @app.page
      action: d3.event.type
      category: 'Bottom Navbar'
      label: 'Linkedin Popup'

  emailClickHandler: =>
    d3.event.preventDefault()
    ShortLinkBitly @app, (url) =>
      # Bitly shortened link, two newlines, and the email body
      emailBody = "#{url}%0A%0A#{Tr.contactEmail.body[@app.language]}"

      emailUrl = """
        mailto:?subject=#{Tr.contactEmail.subject[@app.language]}&body=#{emailBody}
      """

      @app.window.location.href = emailUrl

    @app.analyticsReporter.reportedEvent
      visualizationMode: @app.page
      action: d3.event.type
      category: 'Bottom Navbar'
      label: 'Email Link'























module.exports = BottomNavbar
