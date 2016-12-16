
var execSync = require('child_process').execSync

// Change directories to the node application project root (one level above )

// console.log(process.cwd());
process.chdir(__dirname)
process.chdir('..')
// console.log(process.cwd());

execSync('npm install', {stdio: [0,1,2]})

