



class EnergyConsumptionIngestor


  
  # energyConsumptionData = fs.readFileSync(path.join(ApplicationRoot, "public/rawCSV", file.name)).toString()
  # energyConsumptionProvider = new EnergyConsumptionProvider
  # energyConsumptionProvider.loadFromString energyConsumptionData

  # unmappedData = d3.csv.parse energyConsumptionData
  # errors = []

  # if unmappedData.length != energyConsumptionProvider.data.length
  #   errors.push
  #     message: "ERROR: Sanity check failed, unmapped CSV data (length #{unmappedData.length}) and mapped+processed CSV data (length #{energyConsumptionProvider.data.length}) had different lengths in #{file.name}"
  #     line: null
  #     lineNumber: null
  #   return errors

  # data = energyConsumptionProvider.data

  # for i in [0...unmappedData.length]

  #   Validations.sector data[i], unmappedData[i], i, errors
  #   Validations.source data[i], unmappedData[i], i, errors
  #   Validations.province data[i], unmappedData[i], i, errors
  #   Validations.scenarios data[i], unmappedData[i], i, errors
  #   Validations.years data[i], unmappedData[i], i, errors
  #   Validations.value data[i], unmappedData[i], i, errors
  #   Validations.unit data[i], unmappedData[i], i, errors, 'Petajoules'

    

  # errors



EnergyConsumptionIngestor.csvMapping = (d) ->
  province: d.Area
  sector: d.Sector
  source: d.Source
  scenario: d.Case
  year: parseInt(d.Year)
  value: parseFloat(d.Data)
  unit: d.Unit


module.exports = EnergyConsumptionIngestor
