

NEB Visualization Installation Guide
====================================


## Libraries and Technologies
* d3 @ 3.4.13 - Graphing and visualization toolkit for Javascript
* Browserify @ 10.2.6 - Javascript packaging tool
* Lodash @ 2.4.2 - Javascript swiss-army knife toolkit
* WET GCWU Theme @ 4.0.20 and @ 3.1.12 - Government of Canada Web Usability Theme

## Files
```
installguide
└── installguide.html
public
├── CSS
│   └── canadasEnergyFutureVisualization.css
├── CSV
│   ├── ElectricityGeneration_VIZ.csv
│   ├── Natural gas production VIZ.csv
│   ├── crude oil production VIZ.csv
│   └── energy demand.csv
├── IMG
│   └── ...
├── PDF
│   └── ...
├── Font
│   └── ...
├── bundle.js
└── app_fragment.html
```

`app_fragment.html` is a fragment of an HTML document, containing exactly the tags necessary to host the application. In development, we included this fragment in content templates for both WET 3.1.12 and WET 4.0.20 to ensure that it rendered well in both. We haven't included the the WET templates we used in development with the files we've distributed. 

`bundle.js` includes all of the Javascript necessary to run the app, and the other CSS, CSV, image, and font files are just the app's assets. All of the contents of `public` need to be deployed. 

## Trying the app without deploying
You can view the app without an enclosing template by serving from the `public/` directory. For example, if you have Python 2 installed, visit `public/`, run `python -m SimpleHTTPServer 8080`, and visit [`http://localhost:8080/public/app_fragment.html`](http://localhost:8080/public/app_fragment.html). The app fragment isn't a complete HTML document, and isn't really intended to be viewed this way, so glitches could result. Most browsers are tolerant enough of malformed HTML that they can render the app successfully. 

## Dependencies
* CSS - The app is designed to exist within a WET 3 or WET 4 content page, but should render acceptably outside of one. 
* HTML Content - The application script depends on the HTML elements in `app_fragment.html`.

## Installation 
1. Place the contents of `app_fragment.html` into your site template. 
2. Serve the other files in `public/` with the same relative path as the HTML. E.g., if you are serving the application's HTML from `www.neb-one.gc.ca/visualization/app`, then the CSS should be available from `www.neb-one.gc.ca/visualization/app/CSS/canadasEnergyFutureVisualization.css`, etc. 

