ShortLinkBitly = (callback) ->

  # url = "http://apps.neb-one.gc.ca/dvs?page=viz3"
  # requestUrl = "https://api-ssl.bitly.com/v3/shorten?login=#{process.env.BITLY_USERNAME}&apiKey=#{process.env.BITLY_API_KEY}&format=json&longUrl=#{ encodeURIComponent(url)}"

  # TODO: Bitly credentials should NOT be sent to the client! 
  requestUrl = "https://api-ssl.bitly.com/v3/shorten?login=#{process.env.BITLY_USERNAME}&apiKey=#{process.env.BITLY_API_KEY}&format=json&longUrl=#{ encodeURIComponent(window.location.href)}"

  http = new XMLHttpRequest()
  http.open 'GET', requestUrl

  http.onreadystatechange = ->
    return unless http.readyState == XMLHttpRequest.DONE
    return unless http.status == 200

    response = JSON.parse http.responseText
    return unless response.status_code == 200

    callback response.data.url

  http.send()


module.exports = ShortLinkBitly