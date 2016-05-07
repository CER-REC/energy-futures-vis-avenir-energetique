

# Exploring Canada's Energy Future Visualization

## About This Project

> The National Energy Board (NEB) worked together with leading data visualization experts in both academia and industry to create the Exploring Canada’s Energy Future interactive online tool. This pilot concept, based on our flagship publication – [Canada’s Energy Future 2016: Energy Supply and Demand Projections to 2040](http://www.neb-one.gc.ca/nrg/ntgrtd/ftr/index-eng.html), will give Canadians a taste of the exciting new way the NEB will share data going forward.

> Our objective is to present quality data from our most recent energy outlook in an interactive graphic format that is user-friendly and clarifies complex information into “visualizations” that are easily understood,  so you can explore Canada’s energy future right from your own computer. In the months and years to come, we will use this innovative format to share our pipeline safety data, energy data series, energy infrastructure information, and a host of other topical data.

> If you want to use the data for research and undertake your own review, all the data is downloadable and sharable. The chart images are also downloadable, and if you are interested in the source code for the visualizations, it will be available on the government’s Open Government portal: [open.canada.ca](http://open.canada.ca). 

> We hope we are hitting the mark. Your feedback is essential. 

> Email us with your comments and ideas: [energyindesign@neb-one.gc.ca](mailto:energyindesign@neb-one.gc.ca). We look forward to hearing from you.


> ### Contributors
> 
> #### Data Source:
> Abha Bhargava (Director), Matthew Hansen (Market Analyst), Bryce van Sluys (Market Analyst) 
> #### Coordination: 
> Annette Hester (Concept and Coordination); Katherine Murphy (Project Manager); Stephen Chow (Data Coordination); Garth Rowe (Web Lead); Jim Chisholm (Information Management and Technology)
> #### Data Visualization: 
> Design: Lindsay MacDonald, Charles Perin, Jo Vermeulen and Doris Kosminsky
> Technical: Stephanie Sachrajda, Patrick King, Ben Cousins, Gerald McNulty and Claudio Esperança

## About this Repository
The repository includes code and  needed to run and deploy the Energy Futures Visualizations, as a single page browser application. The app consists of four visualizations, driven by four sets of data on energy production and consumption in Canada, provided as flat CSV files. For simplicity and speed of development, the app was designed to work without an application server: any flat file server can host the deployed app. 

## License
All of the project materials are licensed under the [Open Government License - Canada](http://open.canada.ca/en/open-government-licence-canada).


## Prerequisites
You need Node.js, NPM and Git installed, and basic familiarity with a command line interface for your operating system (CMD or PowerShell on Windows, Terminal on OSX, Konsole or equivalent on GNU/Linux).

On Windows: 

1. Download the latest [stable installer for Node and NPM on Windows](https://nodejs.org/en/download/).
2. Download the latest [Git for Windows installer](https://git-scm.com/download/win).
3. *Optional* [Download Tortoise Git](https://tortoisegit.org/), a GUI for Git with Windows Explorer integration.

On other platforms: look for Node.js, NPM, and Git in your platform's package manager (such as homebrew on OSX, DPKG with Aptitude / apt-get on GNU/Linux).

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
* `feature/*` are created for work on new features, and may be in an unstable state
* Tags like `1.*.*` indicate deployed releases

We used [git-flow](https://github.com/nvie/gitflow) to manage our branching strategy.

## Developing: Watching for Build Changes and Hosting
In the `energy-future-visualization` folder:

* `npm install` - Fetch all of the Javascript dependencies
* `npm run start` - Run the development server
* `npm run watch` - Transpile the app's code and dependencies, and watch for changes
* For the app in the WET 4.0.20 frame, visit `localhost:3000/WET4`
* For the app in the WET 3.1.12 frame, visit `localhost:3000/WET3`

## Integration Points with the NEB Site

### Language Detection
The application is fully French-English bilingual. We determine the language to use when the application loads by looking for an element with the id `LangID`, and inspecting its `lang` attribute. This element is intended to be the `<a>` element in the WET template for switching language, and the `lang` attribute indicates which language we would switch to. So when `lang` is `'fr'` we display the app in English, and when it is `'en'` we display it in French.

See `JS/App.coffee` for the language determination code, and also `JS/TranslationTable.coffee` for the full set of English and French text.

### Google Analytics
The application has some customized event recording for Google Analytics for some of the parameters that the user can choose when operating the visualization. If the `ga` object (created by a Google Analytics snippet) is available in the global scope, the app will report these events. See `JS/Router.coffee`

### Private Fonts
As described in 'Checking Out the Code', the app is designed to use some non free fonts: [Avenir Next Condensed](http://www.fonts.com/font/linotype/avenir-next/condensed) and [Avenir Next Condensed Demi](http://www.fonts.com/font/linotype/avenir-next/condensed-demi). For the NEB, these fonts and a stylesheet to integrate them are included in a separate, private repository. The app tests whether the Avenir stylesheet is available, and appends it to the page if it is, or loads a substitute Google font (PT Sans Narrow). See `JS/App.coffee#loadFonts`.

### Bitly
The image export feature on the deployed app has a mechanism to include a Bitly URL in the image, which points back to the original interactive version of the graph. To do this (without exposing the NEB's Bitly API key), we make use of the function `ShortLinkBitly` on the global scope. The function takes a callback as one of its parameters, with the sole parameter to the callback being a URL to use as the short link. See `JS/ImageExporter.coffee`.


## Building for Deployment

* `npm run distribute`

The distribution task works with the `dist/` folder does several things:

* Builds the Javascript bundle in minified production mode
* Copies over all of the app's static resources
* Builds the installation guide HTML document
* Compresses all of the results to a zip file

Take a look at `installguide.md` for information on what to do with the distributable archive. 

## Further Reading on Development Tools
The app is written almost entirely in [Coffeescript](http://coffeescript.org), a language that translates into Javascript while adding syntax improvements and eliminating whole categories of Javascript bugs.

Our build system is driven by [Browserify](http://browserify.org), which is built on the [NPM implementation of CommonJS](https://docs.npmjs.com/how-npm-works/packages). A basic understanding of the NPM package system is necessary to understand how our code is modularized, and how we're working with dependencies installed via NPM. 

To create the visualizations we used [D3](http://d3js.org), a Javascript library for manipulating documents based on data. We recommend that you familiarize yourself with [D3 Selections](http://github.com/mbostock/d3/wiki/Selections) and [data joins](http://bost.ocks.org/mike/join/).

## Contact Us
We're the development team with Startide Solutions who put this project together for the NEB. We aren't able to provide extensive support for this project, but you're welcome to reach out with questions and thoughts!

* Stephanie Sachrajda - stephanie.sachrajda@startidesolutions.com
* Patrick King - patrick.king@startidesolutions.com
* Ben Cousins - ben.cousins@startidesolutions.com

## Known Issues

* This application was *not* designed to work resolutions much smaller than 1024*768, it won't look very good on your smartphone. We have attempted to apply responsive design principles throughout, but mobiles were out of scope, the high concept designs just need a minimum screen size to function. 
* 'Download Image' functionality on Internet Explorer ~11 doesn't apply the correct font. This appears to be fixed in Edge ~13.
* All versions of Internet Explorer/Edge prohibit data URLs from being used in `<a>` elements. This prevents us from offering the exported image for download when the user clicks the link, instead we have a workaround: a modal appears with the exported PNG data url in an `<img>` element. A solution for download on link click would either require flash, or some server side support. 
* Safari ~8 has a bug with rendering SVGs in canvas, if the SVG has appeared elsewhere in the document the drawImage size parameters are ignored. We have worked around this by using only PNGs for image export/download, for now. 
* Firefox and Chrome (and Safari?) Have a problem related to SVG gradients:  gradients are identified within an SVG by a URL. When the URL for the enclosing HTML document changes (such as when we use `history.pushState` to update the URL bar with the current configuration of the visualization) these SVG internal URLs break, and the gradient is no longer available. 
* Opera is unique among browsers we've tested in having severe usability issues with this approach, especially with regard to downloading all of the images needed to populate menus. 
