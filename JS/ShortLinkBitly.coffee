ParamsToUrlString = require './ParamsToUrlString.coffee'


ShortLinkBitly = (app, callback) ->

  switch app.page
    when 'landingPage'
      return
    when 'viz1'
      config = app.visualization1Configuration
    when 'viz2'
      config = app.visualization2Configuration
    when 'viz3'
      config = app.visualization3Configuration
    when 'viz4'
      config = app.visualization4Configuration

  params = config.routerParams()
  requestUrl = "bitly_url#{ParamsToUrlString params}"

  http = new XMLHttpRequest()
  http.open 'GET', requestUrl

  http.onreadystatechange = ->
    return unless http.readyState == XMLHttpRequest.DONE
    
    if http.status != 200
      callback "https://apps.neb-one.gc.ca/dvs"
      return

    response = JSON.parse http.responseText

    if response.status_code != 200
      callback "https://apps.neb-one.gc.ca/dvs"
      return

    callback response.data.url


  http.send()


module.exports = ShortLinkBitly