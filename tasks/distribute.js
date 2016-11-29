var execSync = require('child_process').execSync;
var pjson = require('../package.json');
var fs = require('fs-extra');
require('coffee-script').register();
var zip = require('./zip-folder.coffee');

// We exclusively use the Node fs API here, to maintain portability with Windows

// Clean up any existing distribution
fs.removeSync('./dist');

fs.mkdirsSync('./dist/public/HTML');

// Make the pretty installguide
execSync("generate-md --layout mixu-radar --input ./installguide.md --output ./dist/installguide");

// Build the javascript bundle for production
execSync("npm run build");

// Copy over all the assets
fs.copySync("public/CSS", "dist/public/CSS");
fs.copySync("public/CSV", "dist/public/CSV");
fs.copySync("public/IMG", "dist/public/IMG");
fs.copySync("public/PDF", "dist/public/PDF");

fs.copySync("views/app_container_body.mustache", "dist/public/HTML/app_container_body.html");
fs.copySync("views/app_container_styles.mustache", "dist/public/HTML/app_container_styles.html");
fs.copySync("views/app_iframe_body.mustache", "dist/public/HTML/app_iframe_body.html");
fs.copySync("views/app_iframe_styles.mustache", "dist/public/HTML/app_iframe_styles.html");

fs.copySync("views/wet3_video_body.mustache", "dist/public/HTML/wet3_video_body.html");
fs.copySync("views/wet3_video_styles.mustache", "dist/public/HTML/wet3_video_styles.html");
fs.copySync("views/wet4_video_body.mustache", "dist/public/HTML/wet4_video_body.html");

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
    console.log("Distribute done!");
  }
});

