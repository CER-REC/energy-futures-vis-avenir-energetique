winston = require 'winston'
winston.transports.DailyRotateFile = require 'winston-daily-rotate-file'
path = require 'path'
fs = require 'fs'

ApplicationRoot = require '../ApplicationRoot'


logDirectory = process.env.LOG_DIRECTORY || path.join ApplicationRoot, 'log'
fs.existsSync(logDirectory) || fs.mkdirSync logDirectory
logfileName =  "#{process.env.LOG_FILENAME}.log"


logger = winston.createLogger
  exitOnError: false
  transports: [
    new winston.transports.DailyRotateFile
      name: 'dailyLog'
      level: process.env.FILE_LOGLEVEL
      filename: path.join logDirectory, logfileName
      handleExceptions: true
      humanReadableUnhandledException: true
      prepend: true
      format: winston.format.json()

    new winston.transports.Console
      name: 'consoleError'
      level: process.env.CONSOLE_LOGLEVEL
      handleExceptions: true
      humanReadableUnhandledException: true
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
  ]

module.exports = logger

