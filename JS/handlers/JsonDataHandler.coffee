Promise = require 'bluebird'
# url = require 'url'
# queryString = require 'query-string'

# PrepareQueryParams = require '../PrepareQueryParams.coffee'
# readFile = Promise.promisify fs.readFile
# ApplicationRoot = require '../../ApplicationRoot.coffee'
# Logger = require '../Logger.coffee'


Visualization1Configuration = require '../VisualizationConfigurations/visualization1Configuration.coffee'
Visualization2Configuration = require '../VisualizationConfigurations/visualization2Configuration.coffee'
Visualization3Configuration = require '../VisualizationConfigurations/visualization3Configuration.coffee'
Visualization4Configuration = require '../VisualizationConfigurations/visualization4Configuration.coffee'



ServerData = require '../server/ServerData.coffee'

module.exports = (req, res) ->

  Promise.join ServerData.oilPromise, ServerData.gasPromise, ServerData.energyPromise, ServerData.electricityPromise, ->



  # unpack params
  # init a config and server? or just config?
  # get data from provider
  # serialize
  # respond
  # profit






# requestCounter = 0
#     time = Date.now()
#     query = url.parse(req.url).search
#     requestCounter++
#     counter = requestCounter
#     Logger.info "html_image (request H#{counter}): #{query}"

#           params = PrepareQueryParams queryString.parse(query)

#           # Parse the parameters with a configuration object, and then hand them off to a
#           # visualization object. The visualizations render the graphs in their constructors.
#           switch req.query.page
#             when 'viz1'
#               config = new Visualization1Configuration(serverApp, params)

#             when 'viz2'
#               config = new Visualization2Configuration(serverApp, params)

#             when 'viz3'
#               config = new Visualization3Configuration(serverApp, params)

#             when 'viz4'
#               config = new Visualization4Configuration(serverApp, params)

#             else 
#               errorHandler req, res, new Error("Visualization 'page' parameter not specified or not recognized."), 400, counter
#               return


#     catch error
#       errorHandler req, res, error, 500, counter


# errorHandler = (req, res, error, code, counter) ->

#   Logger.error "html_image (request H#{counter}) error: #{error.message}"
#   Logger.error error.stack

#   res.writeHead code
#   res.end "HTTP #{code} #{error.message}"


# module.exports = HtmlImageHandler

