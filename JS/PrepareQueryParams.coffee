Constants = require './Constants.coffee'

# Params should be a hash, as produced by QueryString.parse
module.exports = (params) ->

  if params.scenarios?
    params.scenarios = params.scenarios.split ','
  if params.provinces?
    params.provinces = params.provinces.split ','
  if params.provincesInOrder?
    params.provincesInOrder = params.provincesInOrder.split ','
  if params.sources?
    params.sources = params.sources.split ','
  if params.sourcesInOrder?
    params.sourcesInOrder = params.sourcesInOrder.split ','
  if params.year?
    params.year = parseInt params.year
  if params.dataset?
    params.dataset = params.dataset

  # The 'page' parameter is validated in the router
  # The other parameters are validated in the visualization config classes, in setters
  params.page = 'landingPage' unless Constants.pages.includes params.page
  # params = _.extend {page: 'landingPage'}, params

  params
