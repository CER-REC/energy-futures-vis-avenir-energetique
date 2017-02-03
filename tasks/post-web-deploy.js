
var execSync = require('child_process').execSync

// Change directories to the node application project root (one level above )

// console.log(process.cwd());
process.chdir(__dirname)
process.chdir('..')
// console.log(process.cwd());

// NB: You should install new dependencies in dev with `yarn install --flat`, the flattened file hierarchy is necessary on windows.
execSync('yarn install --production', {stdio: [0,1,2]})

