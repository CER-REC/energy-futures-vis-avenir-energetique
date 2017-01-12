La version française suit.

# Exploring Canada's Energy Future Visualization

## About This Project

> The National Energy Board (NEB) worked together with leading data visualization experts in both academia and industry to create the [Exploring Canada’s Energy Future](http://apps2.neb-one.gc.ca/dvs) interactive online tool. This pilot concept, based on our flagship publication – [Canada’s Energy Future 2016: Energy Supply and Demand Projections to 2040](http://www.neb-one.gc.ca/nrg/ntgrtd/ftr/index-eng.html), will give Canadians a taste of the exciting new way the NEB will share data going forward.

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
> Technical: Stephanie Sachrajda, Patrick King, Alaa Azazi, Ben Cousins, Gerald McNulty and Claudio Esperança

## About this Repository
The repository includes all the code needed to run the Energy Futures Visualizations as a single page browser application. The app consists of four visualizations, driven by four sets of data on energy production and consumption in Canada. 

Unlike the first version of the app, this version cannot be served as a set of flat files, it requires a running node server to supply data and do other work.

## License
All of the project materials are licensed under the [Open Government License - Canada](http://open.canada.ca/en/open-government-licence-canada).


## Getting Started

You can download and run the application code to see how it was built and explore the data on your own computer. (If you only want to explore the visualizations, you may want to [view the app](http://apps2.neb-one.gc.ca/dvs) on the NEB's website.) 

### Prerequisites
You need Node.js, NPM and Git installed, and basic familiarity with a command line interface for your operating system (CMD or PowerShell on Windows, Terminal on OSX, Konsole or equivalent on GNU/Linux).

On Windows: 

1. Download the latest [stable installer for Node and NPM on Windows](https://nodejs.org/en/download/).
2. Download the latest [Git for Windows installer](https://git-scm.com/download/win).
3. *Optional* [Download Tortoise Git](https://tortoisegit.org/), a GUI for Git with Windows Explorer integration.

On other platforms: look for Node.js, NPM, and Git in your platform's package manager (such as homebrew on OSX, DPKG with Aptitude / apt-get on GNU/Linux).

### Checking Out the Code
The [energy futures Github repository](https://github.com/NEBGitHub/energy-futures-vis-avenir-energetique) includes the publicly released source code and assets. 

In one folder, run:
* `git clone https://github.com/NEBGitHub/energy-futures-visualization.git`

### Building and Serving the App
In the `energy-futures-visualization` folder:

* `npm install` - Fetch all of the Javascript dependencies
* `npm run start` - Run the development server
* `npm run watch` - Transpile the app's code and dependencies, and watch for changes

The `start` and `watch` commands both need to run at the same time. You'll need two separate shell windows to do so. With both commands running, visit [http://localhost:3000/dvs](http://localhost:3000/dvs) to see the app in action.

### Testing
You can run the tests with `npm run test`.

### Further Reading on the Energy Future App
For more information about the the app and this repository, see the included file `documentation.md`.

## Further Reading on Development Tools
The app is written almost entirely in [Coffeescript](http://coffeescript.org), a language that translates into Javascript while adding syntax improvements and eliminating whole categories of Javascript bugs.

Our build system is driven by [Browserify](http://browserify.org), which is built on the [NPM implementation of CommonJS](https://docs.npmjs.com/how-npm-works/packages). A basic understanding of the NPM package system is necessary to understand how our code is modularized, and how we're working with dependencies installed via NPM. 

To create the visualizations we used [D3](http://d3js.org), a Javascript library for manipulating documents based on data. We recommend that you familiarize yourself with [D3 Selections](http://github.com/mbostock/d3/wiki/Selections) and [data joins](http://bost.ocks.org/mike/join/).

## Contact Us
We're the development team with VizworX who put this project together for the NEB. We aren't able to provide extensive support for this project, but you're welcome to reach out with questions and thoughts!

* Patrick King - patrick.king@vizworx.com
* Alaa Azazi - alaa.azazi@vizworx.com
* Ben Cousins - ben.cousins@vizworx.com
* Stephanie Sachrajda

## Known Issues

* This application was *not* designed to work resolutions much smaller than 1024*768, it won't look very good on your smartphone. We have attempted to apply responsive design principles throughout, but mobiles were out of scope. 
* Opera is unique among browsers we've tested in having severe usability issues with this approach, especially with regard to downloading all of the images needed to populate menus. 

## Changelog

* 2016-12-16 - Add alternative text, and address other validation issues: the application output now passes W3C HTML validation.
* 2016-12-14 - Correct an issue where the app could not be shared on social media in French.
* 2016-11-30 - Added the dataset selector buttons in the left button panel. 
* 2016-11-30 - Unsupported scenarios for a dataset will be hidden. The scenarios will only show for supported datasets. 
* 2016-11-18 - The province & power source buttons on visualizations 1 & 2 will now animate out of the way as the user drags one of them up or down.
* 2016-11-17 - Added a data ingestion and validation routine. Raw data should be placed under `public/rawCSV`, valiated data is written to `public/CSV`, and the tool can be run with `npm run ingest`. See `JS/validation/Ingest.coffee`.
* 2016-11-17 - Resolved a memory leak related to JSDOM.
* 2016-11-07 - Fixed the overlapping bubbles problem in visualization #3, and decreased the inner bubble padding to reduce empty spaces.
* 2016-11-07 - Created a server side component for image rendering, which eliminates any possibility of browser-side rendering bugs and addresses several known issues.
* 2016-10-31 - Adjusted the time slider (on Visualization 3) to use a better quality PNG image that doesn't degrade in quality when zoomed in.
* 2016-10-20 - Installed an updated set of Canada's Energy Future 2016 data. This is an early release of the new update, which does not include the LNG and Constrained scenarios. The user interface for these scenarios has been temporarily hidden. The previous generation data remains available in the repository, but is not integrated into the app right now.
* 2016-10-05 - The query url is now kept consistent as users navigate back and forth between the different visualizations as well as when the order of the provinces (in visualization 1) and the sources (in visualization 2) change.
* 2016-10-05 - Modified the timeline slider to use an svg image instead of the previously used png image.
* 2016-10-05 - Changed the height and font size of the title bar on the landing page to match the navigation bar for the visualization pages.
* 2016-10-05 - You can only have one popover open at once, and clicking outside of a popover will close it.
* 2016-10-04 - Added the NEB's introductory video to the landing page of the visualization. NB: Currently the templates which include the video depend heavily on the WET assets included in the development environment! That will need to change before we can deploy this version. See: `views/Wet3VideoIframe.mustache` and `views/Wet4VideoIframe.mustache` Also: it was necessary to use iframes to load the video each time we visit the landing page, as the player only initializes properly on page load.
* 2016-10-03 - Refactored the app to break each Mustache template into its own file, rather than storing them all together in `templates.coffee`. 
* 2016-10-03 - Worked around a browser bug in Firefox, Chrome and Safari causing certain gradients to disappear from the visualization with interacting with it. This change introduces an iframe to contain the application, and which has some consequences for how the app integrates into the containing page.
* 2016-09-29 - Adjusted the y-axes so that they no longer re-scale when the user changes the scenario(s) in the first, second, and fourth visualizations. This way, it's easier to compare data across scenarios

