var execSync = require('child_process').execSync;
var pjson = require('../package.json');
var fs = require('fs-extra');
var path = require('path');


// We exclusively use the Node fs API here, to maintain portability with Windows

// This script assumes that the energy futures visualization directory has other directories at the same level:
// 'energy-futures-iis-server' for the IIS server repository.
// 'energy-futures-private-resources' for the private resources repository.

iisRepositoryDirectory = '../energy-futures-iis-server/DVWeb'
iisPublicDirectory = path.join(iisRepositoryDirectory, 'public');
iisNodeAppDirectory = path.join(iisRepositoryDirectory, 'node_app');


// First, run the distribute script, to prepare the fileserver assets
execSync('node tasks/distribute.js', {stdio: [0,1,2]});


// Remove the existing deployment
fs.removeSync(iisPublicDirectory);
fs.removeSync(iisNodeAppDirectory);

fs.mkdirsSync(iisPublicDirectory);
fs.mkdirsSync(iisNodeAppDirectory);

// Copy over dist/public
fs.copySync('dist/public', iisPublicDirectory);


// Copy over the required portions of the app
fs.copySync('JS', path.join(iisNodeAppDirectory, 'JS'));

// TODO: Currently, the only files in public that are required by the prod server are the CSVs
// We could split them out, and avoid copying this directory.
fs.copySync('public/CSV', path.join(iisNodeAppDirectory, 'public/CSV'));

fs.copySync('views', path.join(iisNodeAppDirectory, 'views'));
fs.copySync('tasks', path.join(iisNodeAppDirectory, 'tasks'));

fs.copySync('ApplicationRoot.coffee', path.join(iisNodeAppDirectory, 'ApplicationRoot.coffee'));
fs.copySync('LICENSE.TXT', path.join(iisNodeAppDirectory, 'LICENSE.TXT'));
fs.copySync('readme.md', path.join(iisNodeAppDirectory, 'readme.md'));
fs.copySync('package.json', path.join(iisNodeAppDirectory, 'package.json'));
fs.copySync('web.config', path.join(iisNodeAppDirectory, 'web.config'));


fs.writeFile(path.join(iisNodeAppDirectory, "VERSION"), pjson.version, function(err) {
  if(err) {
    throw err;
  }
}); 

var git_last_modified_date = execSync('git show -s --format=%cd HEAD --date=short')

fs.writeFile(path.join(iisNodeAppDirectory, "LAST_MODIFIED"), git_last_modified_date, function(err) {
  if(err) {
    throw err;
  }
}); 



console.log("Visual-studio-install done!");
console.log("NB: For Web Deploy to work properly, you MUST add all the contents of the IIS project's 'public' and 'node_app' directories to the project in Visual Studio. Otherwise, the files aren't copied on deploy.");

