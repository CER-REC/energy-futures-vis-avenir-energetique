



class GasProductionIngestor


  # gasData = fs.readFileSync(path.join(ApplicationRoot, "public/rawCSV", file.name)).toString()
  # gasProductionProvider = new GasProductionProvider 
  # gasProductionProvider.loadFromString gasData

  # unmappedData = d3.csv.parse gasData
  # errors = []

  # if unmappedData.length != gasProductionProvider.data.length
  #   errors.push
  #     message: "ERROR: Sanity check failed, unmapped CSV data (length #{unmappedData.length}) and mapped+processed CSV data (length #{gasProductionProvider.data.length}) had different lengths in #{file.name}"
  #     line: null
  #     lineNumber: null
  #   return errors

  # data = gasProductionProvider.data

  # for i in [0...unmappedData.length]
    
  #   Validations.province data[i], unmappedData[i], i, errors
  #   Validations.scenarios data[i], unmappedData[i], i, errors
  #   Validations.years data[i], unmappedData[i], i, errors
  #   Validations.value data[i], unmappedData[i], i, errors
  #   Validations.unit data[i], unmappedData[i], i, errors, 'Million cubic metres Per Day'

  #   # TODO: validate type?


  # errors  


GasProductionIngestor.csvMapping = (d) ->
  province: d.Area
  type: d.Type
  scenario: d.Case
  year: parseInt(d.Year)
  value: parseFloat(d.Data)
  unit: d.Unit


module.exports = GasProductionIngestor
