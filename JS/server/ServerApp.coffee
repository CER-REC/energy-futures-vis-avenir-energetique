

# This is a slimmed down, duck typed stand in of the 'App' class which appears on the client
# Rather than driving the entire client app, on the server all we need this class to do
# is to provide a few pieces of information and compatibility to visualization instances 
# while they run on the server.


class ServerApp

  constructor: (providers) ->

    @energyConsumptionProvider = providers.energyConsumptionProvider
    @oilProductionProvider = providers.oilProductionProvider
    @gasProductionProvider = providers.gasProductionProvider
    @electricityProductionProvider = providers.electricityProductionProvider


    # TODO: Language needs to be sent from client as a url parameter, and parsed by us
    @language = 'en'


    # TODO: Since no click events will be emitted from the visualization in jsdom, this
    # should never be referenced, let alone its members. Stubbing it out of an abundance
    # of caution, probably safe to delete
    @popoverManager = 
      currentPopover: null
      showPopover: ->
      closePopover: ->




























