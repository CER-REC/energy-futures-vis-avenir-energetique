Tr = require './TranslationTable.coffee'

ProvinceAriaText = (app, selected, key) ->

  selectedText = if selected
    Tr.altText.selected[app.language]
  else
    Tr.altText.unselected[app.language]

  "#{selectedText} - #{Tr.regionSelector.names[key][app.language]}"

module.exports = ProvinceAriaText
