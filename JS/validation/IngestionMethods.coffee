fs = require 'fs'

IngestionMethods = 



  writeLog: ->
    @logFile = fs.openSync @logFilename, 'w'

    if @logMessages.length == 0
      @logFile.write "No errors"

    for error in @logMessages
      fs.writeSync @logFile, "#{error.message}\n"
      fs.writeSync @logFile, "#{error.line.toString()}\n" if error.line?
      fs.writeSync @logFile, "#{error.lineNumber}\n" if error.lineNumber?
      fs.writeSync @logFile, "\n"

    fs.closeSync @logFile

    if @logMessages.length > 0
      console.log "#{@logMessages.length} logged events for file #{@dataFilename}."
    else
      console.log "No logged events for #{@dataFilename}."










module.exports = IngestionMethods