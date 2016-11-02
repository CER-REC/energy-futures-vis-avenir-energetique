var execSync = require('child_process').execSync;

var node_env;
var command = "node ./www";

if (os.paltform() === 'win32') {
// Node returns 'win32' for both 32 and 64 bit windows
  execSync('set NODE_ENV=development');
  execSync(command);
}
else {
  execSync('NODE_ENV=development ' + command);
}


