fs = require 'fs'
path = require 'path'

# A small set of methods that are completely in common between the ingestors.

IngestionMethods = 

  setupFilenames: (options) ->
    if not options.dataFilename
      console.log "Missing required option dataFilename"
      console.log options
      return
    if not options.processedFilename
      console.log "Missing required option processedFilename"
      console.log options
      return
    if not options.logFilename
      console.log "Missing required option logFilename"
      console.log options
      return

    @dataFilename = options.dataFilename
    @processedFilename = options.processedFilename
    @logFilename = options.logFilename



  summarizedAddAndDetectDuplicate: (item) ->
    if @summarizedGroupedData[item.scenario][item.year][item.province]?
      @logMessages.push
        message: "Duplicate item detected"
        line: item
        lineNumber: null
    else
      @summarizedGroupedData[item.scenario][item.year][item.province] = item


  writeLog: ->

    logDirectory = path.dirname @logFilename
    unless fs.existsSync logDirectory
      fs.mkdirSync logDirectory

    @logFile = fs.openSync @logFilename, 'w+'

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