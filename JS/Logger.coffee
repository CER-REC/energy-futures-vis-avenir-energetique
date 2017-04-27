winston = require 'winston'
winston.transports.DailyRotateFile = require 'winston-daily-rotate-file'
path = require 'path'
fs = require 'fs'

ApplicationRoot = require '../ApplicationRoot'


winston.emitErrs = true
logDirectory = process.env.LOG_DIRECTORY || path.join ApplicationRoot, 'log'
fs.existsSync(logDirectory) || fs.mkdirSync logDirectory
logfileName =  "#{process.env.LOG_FILENAME}.log"


logger = new winston.Logger
  exitOnError: false
  transports: [
    new winston.transports.DailyRotateFile
      name: 'dailyLog'
      level: process.env.FILE_LOGLEVEL
      filename: path.join logDirectory, logfileName
      handleExceptions: true
      json: true
      colorize: true
      humanReadableUnhandledException: true
      prepend: true

    new winston.transports.Console
      name: 'consoleError'
      level: process.env.CONSOLE_LOGLEVEL
      handleExceptions: true
      json: false
      colorize: true
      humanReadableUnhandledException: true
  ]

module.exports = logger

