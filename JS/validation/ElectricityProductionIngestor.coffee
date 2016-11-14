





module.exports = (filename) ->

  # input: filename? array of strings? string? just use d3?
  # output.... string? file? 

  # begin with full set of data
  # filter out data from full set into required set
  # notify errors (to file?), missing from full set, extra to full set.
  # distinguish between: warnings, errors

  warnings: []
  errors: []

  requiredData: []
  extraData: []