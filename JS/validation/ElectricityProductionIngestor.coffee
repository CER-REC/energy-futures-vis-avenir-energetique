



class ElectricityProductionIngestor


  
  # electricityData = fs.readFileSync(path.join(ApplicationRoot, "public/rawCSV", file.name)).toString()
  # electricityProductionProvider = new ElectricityProductionProvider
  # electricityProductionProvider.loadFromString electricityData

  # unmappedData = d3.csv.parse electricityData
  # errors = []


  # # The electricity provider filters out some unnecessary data, and also adds some
  # # totals entries which are not present in the raw data.
  # # Result: the raw CSV total does not match the parsed data length
  # # TODO: Pre-process electricity data file instead of doing it on parse?

  # # if unmappedData.length != electricityProductionProvider.data.length
  # #   errors.push
  # #     message: "ERROR: Sanity check failed, unmapped CSV data (length #{unmappedData.length}) and mapped+processed CSV data (length #{electricityProductionProvider.data.length}) had different lengths in #{file.name}"
  # #     line: null
  # #     lineNumber: null
  # #   return errors

  # data = electricityProductionProvider.data

  # for i in [0...data.length]

  #   # TODO: swap out data[i] for unmappedData[i], once we are free of the provider parsing
  #   # TODO: filter extra sources? 
  #   Validations.source data[i], data[i], i, errors
  #   Validations.province data[i], data[i], i, errors
  #   Validations.scenarios data[i], data[i], i, errors
  #   Validations.years data[i], data[i], i, errors
  #   Validations.value data[i], data[i], i, errors
  #   Validations.unit data[i], data[i], i, errors, 'GW.h'



  # errors


ElectricityProductionIngestor.csvMapping = (d) ->
  province: d.Area
  source: d.Source
  scenario: d.Case
  year: parseInt(d.Year)
  value: parseFloat(d.Data.replace(',',''))
  unit: d.Unit


module.exports = ElectricityProductionIngestor
