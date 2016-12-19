
var execSync = require('child_process').execSync;
var fs = require('fs-extra');
var path = require('path');

// The remove folder command doesn't seem to complete reliably before returning
// So, we use this separate task to clean the install folders

fs.removeSync('./dist');

iisRepositoryDirectory = '../energy-futures-iis-server/DVWeb'
iisPublicDirectory = path.join(iisRepositoryDirectory, 'public');
iisNodeAppDirectory = path.join(iisRepositoryDirectory, 'node_app');

// Remove the existing deployment
fs.removeSync(iisPublicDirectory);
fs.removeSync(iisNodeAppDirectory);






