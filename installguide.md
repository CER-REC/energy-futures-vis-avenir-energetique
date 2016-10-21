La version Française suit.

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
│   ├── 2016-01_CanadasEnergyFutureVisualizationData.zip
│   ├── 2016-01_ElectricityGeneration.csv
│   ├── 2016-01_NaturalGasProduction.csv
│   ├── 2016-01_CrudeOilProduction.csv
│   ├── 2016-01_EnergyDemand.csv
│   ├── 2016-10-18_CanadasEnergyFutureVisualizationData.zip
│   ├── 2016-10-19_ElectricityGeneration.csv
│   ├── 2016-10-18_NaturalGasProduction.csv
│   ├── 2016-10-18_CrudeOilProduction.csv
│   └── 2016-10-18_EnergyDemand.csv
├── IMG
│   └── ...
├── PDF
│   └── ...
├── Font
│   └── ...
├── bundle.js
├── app_fragment.html
└── app_iframe.html
```

`app_fragment.html` is a fragment of an HTML document, containing exactly the tags necessary to host the application. The fragment is a minimal shell that links to `app_iframe.html`, a separate document which contains the application itself. (This iframe approach is necessary to work around a display issue with gradients in certain browsers.) In development, we included this fragment in content templates for both WET 3.1.12 and WET 4.0.20 to ensure that it rendered well in both. We haven't included the the WET templates we used in development with the files we've distributed. 

`bundle.js` includes all of the Javascript necessary to run the app, and the other CSS, CSV, image, and font files are just the app's assets. All of the contents of `public` need to be deployed. 

## Trying the app without deploying
You can view the app without an enclosing template by serving from the `public/` directory. For example, if you have Python 2 installed, visit `public/`, run `python -m SimpleHTTPServer 8080`, and visit [`http://localhost:8080/public/app_fragment.html`](http://localhost:8080/public/app_fragment.html). The app fragment isn't a complete HTML document, and isn't really intended to be viewed this way, so glitches could result. Most browsers are tolerant enough of malformed HTML that they can render the app successfully. 

## Dependencies
* CSS - The app is designed to exist within a WET 3 or WET 4 content page, but should render acceptably outside of one. 
* HTML Content - The application script depends on the HTML elements in `app_fragment.html` and `app_iframe.html`. 

## Installation 
1. Place the contents of `app_fragment.html` into your site template. Ensure that `app_iframe.html` is available from the server as well. 
2. Serve the other files in `public/` with the same relative path as the HTML. E.g., if you are serving the application's HTML from `www.neb-one.gc.ca/visualization/app`, then the CSS should be available from `www.neb-one.gc.ca/visualization/app/CSS/canadasEnergyFutureVisualization.css`, etc. 


Guide d’installation de l’outil de visualisation de l’Office
====================================


## Bibliothèques et technologies
* d3 @ 3.4.13 - Outils de représentation graphique et de visualisation pour Javascript
* Browserify @ 10.2.6 – Outil de génération de paquet Javascript
* Lodash @ 2.4.2 - Outils polyvalents pour Javascript
* WET GCWU Theme @ 4.0.20 and @ 3.1.12 - Thème de facilité d’emploi Web du gouvernement du Canada

## Fichiers
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

`app_fragment.html` est un fragment d’un document HTML qui renferme uniquement les idenfificateurs nécessaires à l’hébergement de l’application. Au cours du développement, nous avons introduit ce fragment dans les modèles de contenu pour WET 3.1.12 et WET 4.0.20, afin d’assurer un bon rendu dans les deux cas. Les fichiers distribués ne contiennent pas les modèles WET qui ont servi au développement. 

`bundle.js` renferme tous les éléments de Javascript qui sont requis pour exécuter l’application; les autres fichiers CSS, CSV et image ainsi que les fichiers de polices de caractères ne sont que des actifs de l’application. Tout le contenu du dossier `public` doit être déployé. 

## Essai de l’application sans déploiement
Vous pouvez afficher l’application sans recourir a un modèle intégré, à partir du répertoire `public/`. Par exemple, si Python 2 est installé sur votre ordinateur, passez à `public/`, exécutez `python -m SimpleHTTPServer 8080` et allez à [`http://localhost:8080/public/app_fragment.html`](http://localhost:8080/public/app_fragment.html). Le fragment de l’application n’est pas un document HTML complet, et il n’est pas conçu pour être visionné de la sorte. Des erreurs techniques sont possibles. La majorité des navigateurs tolèrent les codes HTML incorrects et permettent le rendu de l’application. 

## Dépendances
* CSS - L’application est conçue pour fonctionner à l’intérieur d’une page de contenu WET 3 ou WET 4, mais devrait être rendue de façon acceptable en son absence. 
* Contenu HTML – Le script de l’application est tributaire des éléments HTML contenus dans le fichier `app_fragment.html`.

## Installation 
1. Placez le contenu du fichier `app_fragment.html` dans le modèle de votre site. 
2. Pour les autres fichiers qui se trouvent dans le répertoire `public/`, donnez le même chemin relatif du serveur que celui du fichier HTML. Exemple : Si, pour le fichier HTML de l’application, vous désignez le serveur `www.neb-one.gc.ca/visualization/app`, le fichier CSS doit comprendre l’adresse `www.neb-one.gc.ca/visualization/app/CSS/canadasEnergyFutureVisualization.css`, etc. 


