var execSync = require('child_process').execSync;
var pjson = require('./package.json');
var fs = require('fs-extra');
require('coffee-script').register();
var zip = require('./bin/zip-folder.coffee');

// We exclusively use the Node fs API here, to maintain portability with Windows

// Clean up any existing distribution
fs.removeSync('./dist');

fs.mkdirsSync('./dist/public');

// Make the pretty installguide
execSync("generate-md --layout mixu-radar --input ./installguide.md --output ./dist/installguide");

// Build the javascript bundle for production
execSync("npm run build");

// Copy over all the assets
fs.copySync("public/CSS", "dist/public/CSS");
fs.copySync("public/CSV", "dist/public/CSV");
fs.copySync("public/IMG", "dist/public/IMG");
fs.copySync("public/PDF", "dist/public/PDF");
fs.copySync("views/app_fragment.mustache", "dist/public/app_fragment.html");
fs.copySync("views/app_iframe.mustache", "dist/public/app_iframe.html");

fs.copySync("views/Wet3VideoFragment.mustache", "dist/public/Wet3VideoFragment.html");
fs.copySync("views/Wet4VideoFragment.mustache", "dist/public/Wet4VideoFragment.html");

fs.copySync("views/Wet3VideoIframe.mustache", "dist/public/Wet3VideoIframeExample.mustache");
fs.copySync("views/Wet4VideoIframe.mustache", "dist/public/Wet4VideoIframeExample.mustache");

// The paid-up fonts are optional, the build is fine to continue without them.
try {
  fs.copySync("../energy-futures-private-resources/Fonts", "dist/public/Fonts");
  fs.copySync("../energy-futures-private-resources/CSS/avenirFonts.css", "dist/public/CSS/avenirFonts.css");
}
catch (error) {
  console.warn("Avenir font not included in deployment package.");
}


// zip it up!
filename = "Vizworx_NEB_Visualization_" + pjson.version + ".zip";
fs.removeSync(filename);

zip('dist', filename, function(err) {
  if(err) {
    console.log("There was a problem creating the zip archive.");
  } else {
    console.log("Done!");
  }
});

