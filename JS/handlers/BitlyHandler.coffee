url = require 'url'
Request = require 'request-promise'

Logger = require '../Logger.coffee'
Constants = require '../Constants.coffee'



requestCounter = 0

module.exports = (req, res) ->

  requestCounter += 1
  time = Date.now()
  query = url.parse(req.url).search

  shortenUrl = "https://apps2.neb-one.gc.ca/dvs/#{query}"
  requestUrl = "https://api-ssl.bitly.com/v3/shorten?login=#{process.env.BITLY_USERNAME}&apiKey=#{process.env.BITLY_API_KEY}&format=json&longUrl=#{encodeURIComponent(shortenUrl)}"

  Request requestUrl

  .then (bitlyResponse) ->

    res.setHeader "content-type", "application/json"
    res.write bitlyResponse
    res.end()

    Logger.info "bitly_url (request B#{requestCounter}): #{query} Time: #{Date.now() - time}"


  .catch (error) ->
    Logger.error "bitly_url (request B#{requestCounter}) error: #{error.message}"
    Logger.error error.stack

    # TODO: Handle 500 errors
    res.writeHead 400
    res.end "HTTP 400: #{error.message}"
