ParamsToUrlString = (params) ->
  urlParts = Object.keys(params).map (key) ->
    "#{key}=#{params[key]}"
  '?' + urlParts.join '&'

module.exports = ParamsToUrlString
