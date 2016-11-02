var execSync = require('child_process').execSync;
var exec = require('child_process').exec;
var os = require('os');

var node_env, process;
var command = "node ./tasks/www";

if (os.platform() === 'win32') {
// Node returns 'win32' for both 32 and 64 bit windows
  //process = execSync('cmd /V /C "set "NODE_ENV=development" && ' + command + '"');
  process = exec(command);
}
else {
  process = exec('NODE_ENV=development ' + command);
}

process.stdout.on('data', function(data){
  console.log(data.toString())
})

process.stderr.on('data', function(data){
  console.log(data.toString())
})
