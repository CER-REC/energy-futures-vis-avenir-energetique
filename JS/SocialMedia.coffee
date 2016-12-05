d3 = require 'd3'

Tr = require './TranslationTable.coffee'
ShortLinkBitly = require './ShortLinkBitly.coffee'

SocialMedia = (app) ->
  
  d3.select "#canadasEnergyFutureVisualization .twitterItem" 
    .on 'click', ->
      ShortLinkBitly app.window.location.href, (url) ->
        app.window.open "https://twitter.com/intent/tweet?url=#{url}", 'targetWindow', 'width=650,height=650'

  d3.select "#canadasEnergyFutureVisualization .linkedinItem"
    .on 'click', ->
      ShortLinkBitly app.window.location.href, (url) ->
        app.window.open "https://www.linkedin.com/shareArticle?mini=true&url=#{url}&summary=#{url}", 'targetWindow', 'width=650,height=650'


  d3.select "#canadasEnergyFutureVisualization .emailItem"
    .on 'click', ->
      ShortLinkBitly app.window.location.href, (url) ->

        # Bitly shortened link, two newlines, and the email body
        emailBody = "#{url}%0A%0A#{Tr.contactEmail.body[app.language]}"

        emailUrl = "mailto:energyindesign@neb-one.gc.ca?subject=#{Tr.contactEmail.subject[app.language]}&body=#{emailBody}"

        app.window.location.href = emailUrl




  
module.exports = SocialMedia


