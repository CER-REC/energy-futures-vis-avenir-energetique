Tr = require './TranslationTable.coffee'

SourceAriaText = (app, selected, key) ->

  selectedText = if selected
    Tr.altText.selected[app.language]
  else
    Tr.altText.unselected[app.language]

  "#{selectedText} - #{Tr.sourceSelector.sources[key][app.language]}"

module.exports = SourceAriaText
