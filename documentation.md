La version française suit.

# Energy Futures Visualizations Documentation

## Repository Structure

There are a few branches and tags to be aware of in the repository.

* `master` points to the latest release
* `develop` points to the latest deployable working version of the app
* `feature/*` are created for work on new features, and may be in an unstable state
* Tags like `1.*.*` indicate deployed releases

We used [git-flow](https://github.com/nvie/gitflow) to manage our branching strategy.


## The Application

The visualization application has two major parts: a web application, and a server. The web app runs in the browser and is responsible for everything you see on the screen: the visualization, the buttons and controls for changing it, the landing page and the navigation bars. The server is responsible for serving the web app's HTML and Javascript, for serving other static resources like images and fonts, for providing data to the visualizations, and for creating image and CSV downloads for a visualization.

### The Web Application
The web application is made up of: 

* A small number of mustache templates in `/views`
* Code files from `/JS` which are combined together into one file using Browserify, written to `/public/bundle.js`.

The entry point for the web app is `/JS/App.coffee`. From there, other files and NPM modules are included, and the full set of included code is combined into `bundle.js`. When you run `npm run watch`, the build system watches each of the files included from `App.coffee` and updates the bundle when any of those files change.

Some key components of the web app: 

* `/JS/Application.coffee`, the entry point for the app in the browser. 
* `/JS/Router.coffee`, the router is responsible for switching from page to page.
* The views in `/JS/views`, in particular the visualization views. Each of these files defines a 'page' within the app, and the visualizations handle the graph creation and animation.
* The charts in `/JS/charts`, which are used by the visualization views.
* The configurations in `/JS/VisualizationConfigurations`, each of these defines the possible states for the four visualizations.
* The templates in `/JS/templates`, these page fragments are the starting points for each view in the visualization and for other modal panels.

### The Server
The server is a node.js app. There are three different setups for the server, for development, test, and production. 

Some key components of the server: 

* The server itself in `/JS/serves/Server.coffee`
* The three versions of the server are defined in `/JS/servers`, each is the entry point for a server command, and loads a different set of middleware.
* Each server is composed of a set of middleware, from `/JS/middleware`. The middleware are modular, and can be added or removed from each server independently. 
* The middleware each use one or more handlers, from `/JS/handlers`, which do the work of responding to requests.

#### Servers and Configuration
There are three different servers for the app under `/JS/servers`, each for a different purpose. 

* The development server (started with `npm run start`) includes the full application, includes static file serving for images, and serves static resources such as images and fonts. This is the server to start with to explore the app or to expand it 
* The test server (runs with `npm run test`) includes all of the components of the app that are under test.
* The production server (run with `npm run start-production`) is intended for use with an IIS server for static files and pages. This server only includes endpoints for the web app to use, and doesn't serve the web app's HTML pages, so it can't be used to serve the app all by itself.

The server folders each contain a `.env` file, with configuration settings for that server.

## Integration Points with the NEB Site

### NEB Specific Deployment Tools
This project contains some tools which are used to deploy the app for the NEB, and which will not be of use to other users. These include:

* The production server
* The `web.config` files at the project root, and in `JS/servers/ProductionServer`
* The `build`, `distribute`, `ingest`, `visual-studio-install` and `clean-vs` scripts in the `package.json` file and their related tasks in `/tasks`

### Language Detection
The application is fully French-English bilingual. We determine the language to use when the application loads by checking in order:

1. Whether a cookie named `_gc_lang` has been set, with values `E` and `F` setting the application language to English and French.
2. Whether the `language` URL query parameter has been set, with values `en` and `fr` setting the application language to English and French.
3. If the above checks do not succeed, by defaulting to English.

See the function `detectLanguage` in `JS/App.coffee` for the language determination code, and also `JS/TranslationTable.coffee` for the full set of English and French text.

### Google Analytics
The application has some customized event recording for Google Analytics for some of the parameters that the user can choose when operating the visualization. If the `ga` object (created by a Google Analytics snippet) is available in the global scope, the app will report these events. See `JS/Router.coffee`

### Private Fonts
The app is designed to use some non free fonts: [Avenir Next Condensed](http://www.fonts.com/font/linotype/avenir-next/condensed) and [Avenir Next Condensed Demi](http://www.fonts.com/font/linotype/avenir-next/condensed-demi). For the NEB, these fonts and a stylesheet to integrate them are included in a separate, private repository. The app tests whether the Avenir stylesheet is available, and appends it to the page if it is, or loads a substitute Google font (PT Sans Narrow). See `JS/App.coffee#loadFonts`.

### Bitly
The image download feature has a mechanism to include a Bitly URL in the image, which points back to the original interactive version of the visualization. This feature is enabled if you set both the `BITLY_USERNAME` and `BITLY_API_KEY` variables (either as environment variables or in the `.env`file for your server.)
