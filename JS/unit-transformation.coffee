conversionTable = 
  
  petajoules:
    kilobarrelEquivalents: 0.447507

  gigawattHours:
    petajoules: 0.0036
    kilobarrelEquivalents: 0.001611

  thousandCubicMetres: 
    kilobarrels: (1/0.159)

  cubicFeet: 
    millionCubicMetres: 0.0283


module.exports = 
  transformUnits: (prevUnit, newUnit) ->
    if prevUnit? and newUnit?
      if prevUnit == newUnit
        return 1
      conversionTable[prevUnit][newUnit]
  



