conversionTable =
  
  petajoules:
    kilobarrelEquivalents: 0.447507

  gigawattHours:
    petajoules: 0.0036
    kilobarrelEquivalents: 0.001611

  thousandCubicMetres:
    kilobarrels: (1 / 0.159)

  millionCubicMetres:
    # NB: this conversion factor takes us from millions of cubic metres (Mm3) to thousands of cubic feet (MCF)
    # 10^6 m3 * (35.3147 CF / m3) * (1000 10^3 / 10^6) = 10^3 CF
    # Yes, the M in MCF stands for 'thousands' and not 'mega', it's a quirk of the imperial unit system.
    cubicFeet: 35.3147 * 1000


module.exports =
  transformUnits: (prevUnit, newUnit) ->
    if prevUnit? and newUnit?
      if prevUnit == newUnit
        return 1
      conversionTable[prevUnit][newUnit]
  



