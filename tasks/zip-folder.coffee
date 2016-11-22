# Sourced from https://github.com/sole/node-zip-folder/blob/master/index.js
# The repo was out of date.
# Made available under the Apache 2 license

fs = require 'fs'
archiver = require 'archiver'

zipFolder = (srcFolder, zipFilePath, callback) ->
  output = fs.createWriteStream zipFilePath
  zipArchive = archiver 'zip'

  output.on 'close', callback

  zipArchive.pipe output

  zipArchive.glob '**/*',
    cwd: srcFolder
  

  zipArchive.finalize (err, bytes) ->
    if err
      callback err
    
  


module.exports = zipFolder