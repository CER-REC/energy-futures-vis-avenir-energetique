d3 = require 'd3'

Tr = require './TranslationTable.coffee'
ShortLinkBitly = require './ShortLinkBitly.coffee'

SocialMedia = (app) ->
  
  d3.select '#canadasEnergyFutureVisualization .twitterItem'
    .on 'click', ->
      ShortLinkBitly app, (url) ->
        app.window.open "https://twitter.com/intent/tweet?url=#{url}", 'targetWindow', 'width=650,height=650'
      
      app.analyticsReporter.reportEvent 'Social', 'Twitter bottom bar button click'


  d3.select '#canadasEnergyFutureVisualization .linkedinItem'
    .on 'click', ->
      ShortLinkBitly app, (url) ->
        app.window.open "https://www.linkedin.com/shareArticle?mini=true&url=#{url}&summary=#{url}", 'targetWindow', 'width=650,height=650'

      app.analyticsReporter.reportEvent 'Social', 'LinkedIn bottom bar button click'

  d3.select '#canadasEnergyFutureVisualization .emailItem'
    .on 'click', ->
      ShortLinkBitly app, (url) ->

        # Bitly shortened link, two newlines, and the email body
        emailBody = "#{url}%0A%0A#{Tr.contactEmail.body[app.language]}"

        emailUrl = """
          mailto:?subject=#{Tr.contactEmail.subject[app.language]}&body=#{emailBody}
        """

        app.window.location.href = emailUrl
        
      app.analyticsReporter.reportEvent 'Social', 'Email bottom bar button click'




  
module.exports = SocialMedia


