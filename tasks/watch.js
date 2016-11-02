var execSync = require('child_process').execSync;
var os = require('os');

var node_env;
var command = "watchify JS/App.coffee -t coffeeify --extension='.coffee' -t [ stringify --extensions [.mustache .css .json] ] -t envify -o public/bundle.js --debug --verbose";

if (os.platform() === 'win32') {
// Node returns 'win32' for both 32 and 64 bit windows
  execSync('cmd /V /C "set "NODE_ENV=development" && ' + command + '"');
  // execSync(command);
}
else {
  execSync('NODE_ENV=development ' + command);
}










