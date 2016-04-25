

# Exploring Canada's Energy Future Visualization


## Prerequisites
You need Node.js, NPM and Git installed, and basic familiarity with a command line interface for your OS (CMD or PowerShell on Windows, Terminal on OSX, Konsole or equivalent on GNU/Linux).

On Windows: 

1. Download the latest [stable installer for Node and NPM on Windows](https://nodejs.org/en/download/).
2. Download the latest [Git for Windows installer](https://git-scm.com/download/win).
3. *Optional* [Download Tortoise Git](https://tortoisegit.org/), a GUI for Git with Windows Explorer integration.

On other platforms: look for Node.js, NPM, and Git in your platform's package manager (such as homebrew on OSX, apt-get on GNU/Linux).

## Checking Out the Code
The project is divided into two repositories: 

1. `energy-future-visualization`, which includes the publicly released source code and assets. 
2. `nebv-private`, which includes a small number of non-free font assets.

Users working with the project from within the NEB will want to check out both repositories side by side, so that the font files are included when building the project. Others will not have access to the private repository, but the app works just fine without it: we've included a substitute Google font. 

In one folder, run:
* `git clone https://github.com/EnergyFuturesVisualization/energy-futures-visualization.git`
* `git clone https://bitbucket.org/StartideSolutions/nebv-private.git` 

## Branches
There are a few branches and tags to be aware of in the repository.
* `master` points to the latest release
* `develop` points to the latest deployable working version of the app
* `feature/*`
* Tags like `1.*.*` for releases

We used [git-flow](https://github.com/nvie/gitflow) to manage our branching strategy.

## Developing: Watching for build changes and hosting
In the `energy-future-visualization` folder:
* `npm install` - Fetch all of the javascript dependencies
* `npm run start` - Run the development server
* `npm run watch` - Transpile the app's code and dependencies, and watch for changes
* For the app in the WET 4.0.20 frame, visit `localhost:3000/WET4`
* For the app in the WET 3.1.12 frame, visit `localhost:3000/WET3`


## Building for Deployment
* `npm run distribute`

The distribution task works with the `dist/` folder does several things:
* Builds the Javascript bundle in minified production mode
* Copies over all of the app's static resources
* Builds the installation guide HTML document
* Compresses all of the results to a zip file

## Further Reading on Development Tools
The app is written almost entirely in [Coffeescript](http://coffeescript.org), a language that translates into Javascript while adding syntax improvements and eliminating whole categories of Javascript bugs.

Our build system is driven by [Browserify](http://browserify.org), which is built on the [NPM implementation of CommonJS](https://docs.npmjs.com/how-npm-works/packages). A basic understanding of the NPM package system is necessary to understand how our code is modularized, and how we're working with dependencies installed via NPM. 

## Contact Us
We're the development team with Startide Solutions who put this project together for the NEB. We aren't able to provide extensive support for this project, but you're welcome to reach out with questions and thoughts!

* Stephanie Sachrajda - stephanie.sachrajda@startidesolutions.com
* Patrick King - patrick.king@startidesolutions.com
* Ben Cousins - ben.cousins@startidesolutions.com

## Known Issues
* 'Download Image' functionality on Internet Explorer ~11 doesn't apply the correct font. This appears to be fixed in Edge ~13.
* All versions of Internet Explorer prohibit data URLs from being used in `<a>` elements. This prevents us from offering the exported image for download when the user clicks the link, instead we have a workaround: a modal appears with the exported PNG data url in an `<img>` element. A workaround enabling download on link click would either require flash, or some server side support. 
* Safari ~8 has a bug with rendering SVGs in canvas, if the SVG has appeared elsewhere in the document the drawImage size parameters are ignored. We have worked around this by using only PNGs for image export/download, for now. 
* Firefox and Chrome (and Safari?) Have a problem related to SVG gradients:  gradients are identified within an SVG by a URL. When the URL for the enclosing HTML document changes (such as when we use `history.pushState` to update the URL bar with the current configuration of the visualization) these SVG internal URLs break, and the gradient is no longer available. 
* Opera is unique among browsers we've tested in having severe usability issues with this approach, especially with regard to downloading all of the images needed to populate menus. 
