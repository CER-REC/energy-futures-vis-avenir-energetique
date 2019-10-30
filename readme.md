La version française suit.

# Exploring Canada's Energy Future Visualization

## About This Project

> This Exploring Canada’s Energy Future interactive online tool is part of the Canada Energy Regulator’s (CER) Data Visualization Initiative (DVI) . The DVI is a three-year initiative to transform how the CER structures and shares data. The objective is to enable evidence-based decision making and remove barriers to understanding Canada’s energy and pipeline systems through the use of user-friendly interactive visualizations. This visualization is based on our flagship publication – [Canada’s Energy Future](http://www.cer-rec.gc.ca/nrg/ntgrtd/ftr/index-eng.html). You can explore Canada’s energy future right from your own computer. In the months and years to come we will use this innovative format to share our pipeline safety data, energy data series, energy infrastructure information, and a host of other topical data.

> If you want to use the data for research and undertake your own review, all the data is downloadable and shareable. The chart images are also downloadable, and if you are interested in the source code for the visualizations, it is available on the government’s Open Government portal: [open.canada.ca](http://open.canada.ca).

> We hope we are hitting the mark. Your feedback is essential.

> Email us with your comments and ideas: [energyindesign@cer-rec.gc.ca](mailto:energyindesign@cer-rec.gc.ca). We look forward to hearing from you.


> ### Contributors
>
> #### Data Source:
> Abha Bhargava (Director), Matthew Hansen (Market Analyst), Bryce van Sluys (Market Analyst), Chris Doleman (Market Analyst), Michael Nadew (Market Analyst)
> #### Coordination:
> Annette Hester (Concept and Coordination); Katherine Murphy (Project Manager); Faiza Hussain (Administrative support); Stephen Chow (Data Coordination); Garth Rowe (Web Lead); Jim Chisholm (Information Management and Technology)
> #### Data Visualization:
> Lead Design Research: Sheelagh Carpendale and Wesley Willett, iLab, University of Calgary.
> Design: Lindsay MacDonald, Charles Perin, Jo Vermeulen, Doris Kosminsky, Søren Knudsen, Lien Quach, Peter Buk, Shreya Chopra, Katrina Tabuli and Claudia Maurer
> Lead Technical: Vizworx
> Technical: Stephanie Sachrajda, Patrick King, Alaa Azazi, Abhishek Sharma, Ben Cousins and Claudio Esperança
> ### THIRD PARTY LICENSES
> [Map showing provinces and territories reporting 2009 swine flu (H1N1) cases in Canada](https://commons.wikimedia.org/wiki/File:H1N1_Canada_map.svg) by [Fonadier](https://commons.wikimedia.org/wiki/User:Fonadier) is licensed under [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) / Re-colored and rotated from original.


## About this Repository
The repository includes all the code needed to run the Energy Futures Visualizations as a single page browser application. The app consists of four visualizations, driven by four sets of data on energy production and consumption in Canada.

Unlike the first version of the app, this version cannot be served as a set of flat files, it requires a running node server to supply data and do other work.

## License
All of the project materials are licensed under the [Open Government License - Canada](http://open.canada.ca/en/open-government-licence-canada).


## Getting Started

You can download and run the application code to see how it was built and explore the data on your own computer. (If you only want to explore the visualizations, you may want to [view the app](http://www.cer-rec.gc.ca/dvs) on the CER's website.)

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
We're the development team with VizworX who put this project together for the CER. We aren't able to provide extensive support for this project, but you're welcome to reach out with questions and thoughts!

* Patrick King - patrick.king@vizworx.com
* Alaa Azazi - alaa.azazi@vizworx.com
* Ben Cousins - ben.cousins@vizworx.com
* Stephanie Sachrajda

## Known Issues

* This application was *not* designed to work resolutions much smaller than 1024*768, it won't look very good on your smartphone. We have attempted to apply responsive design principles throughout, but mobiles were out of scope.



# Visualisation d’Explorer l’avenir énergétique du Canada

## Le projet

> L’outil interactif Explorer l’avenir énergétique du Canada fait partie de l’initiative de visualisation de données de la Régie de l’énergie du Canada. Échelonnée sur trois ans, cette dernière vise à transformer la manière dont la Régie structure et diffuse ses données. L’objectif est de soutenir un processus décisionnel fondé sur la preuve et d’éliminer les obstacles à la compréhension des réseaux énergétiques et pipeliniers canadiens grâce à des visualisations interactives faciles à utiliser. L’outil repose sur la publication phare de la Régie, [Avenir énergétique du Canada](http://www.cer-rec.gc.ca/nrg/ntgrtd/ftr/index-fra.html); il vous permet d’explorer l’avenir énergétique du Canada à partir de votre propre ordinateur. Au cours des mois et des années à venir, la Régie utilisera ce format novateur pour diffuser ses données sur la sécurité des pipelines et sur l’énergie, l’information qu’il possède sur l’infrastructure énergétique et une foule d’autres renseignements spécialisés.

> Si vous souhaitez utiliser les données pour vos recherches ou pour en faire votre propre analyse, vous pouvez les télécharger et les partager. Les graphiques peuvent aussi être téléchargés. Quant au code source des visualisations, il est accessible sur le portail du « gouvernement ouvert » à l’adresse [ouvert.canada.ca](http://ouvert.canada.ca/).

> Nous espérons avoir atteint notre objectif. Votre rétroaction est essentielle.

> Vous pouvez nous la faire parvenir, ainsi que vos suggestions, à l’adresse [conceptionenergie@cer-rec.gc.ca](mailto:conceptionenergie@cer-rec.gc.ca). Votre opinion compte.


> ### Collaborateurs
>
> #### Source des données :
Abha Bhargava (directrice) et Matthew Hansen, Bryce van Sluys, Chris Doleman et Michael Nadew (analystes de marchés)
> #### Coordination :
Annette Hester (conception et coordination); Katherine Murphy (gestionnaire de projet); Faiza Hussain (Soutien administratif); Stephen Chow (coordination des données); Garth Rowe (responsable du Web); Jim Chisholm (gestion de l’information et technologie)
> #### Visualisation des données :
> Recherche conceptuelle sous la direction de Sheelagh Carpendale et Wesley Willett, iLab, Université de Calgary
> Conception : Lindsay MacDonald, Charles Perin, Jo Vermeulen, Doris Kosminsky, Søren Knudsen, Lien Quach, Peter Buk, Shreya Chopra, Katrina Tabuli et Claudia Maurer
> Chef technique à VizworX
> Aspect technique : Stephanie Sachrajda, Patrick King, Alaa Azazi, Abhishek Sharma, Ben Cousins et Claudio Esperança
> ### LICENCES TIERCES
> [La carte montre les provinces et territoires selon les signalements de cas de grippe A (H1N1).](https://commons.wikimedia.org/wiki/File:H1N1_Canada_map.svg) Elle a été créée par [Fonadier](https://commons.wikimedia.org/wiki/User:Fonadier) et porte la licence [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)</a>. L’original a été recoloré et pivoté.

## Le référentiel
Le référentiel renferme le code nécessaire à l’exécution des visualisations d’Avenir énergétique dans un navigateur basé sur le concept SPA (single page application). L’application comporte quatre visualisations, alimentées par quatre ensembles de données portant sur la production et la consommation d’énergie au Canada.

Contrairement à la première version de l’application, ce programme ne peut pas être exécuté comme un ensemble de fichiers non hiérarchiques; il requiert un serveur node.js en cours d’exécution pour fournir les données et accomplir d’autres tâches.

## Licence
Toutes les composantes du projet sont visées par la [licence du gouvernement ouvert – Canada] (http://ouvert.canada.ca/fr/licence-du-gouvernement-ouvert-canada).


## Pour commencer

Vous pouvez télécharger et exécuter le code d’application pour voir comment il a été établi, et examiner les données sur votre propre ordinateur. (Si vous voulez simplement examiner les visualisations, vous pouvez [voir l’application](http://www.cer-rec.gc.ca/dvs) sur le site Web de la Régie.)

### Produits préalables
Node.js, NPM et Git doivent être installés sur votre ordinateur, et vous devez avoir une connaissance élémentaire d’une interface de ligne de commande pour votre système d’exploitation (CMD ou PowerShell dans Windows, Terminal dans OSX, Konsole ou l’équivalent dans GNU/Linux).

Dans Windows :

1. Téléchargez la plus récente version stable du [programme d’installation pour Node et NPM pour Windows](https://nodejs.org/en/download/).
2. Téléchargez la plus récente version du [programme d’installation Git pour Windows](https://git-scm.com/download/win).
3. *Facultatif* [Téléchargez Tortoise Git](https://tortoisegit.org/), une interface utilisateur graphique (GUI) pour Git permettant l’intégration à l’Explorateur Windows.

Autres plateformes : recherchez Node.js, NPM et Git dans le gestionnaire de progiciel de votre plate-forme (Homebrew dans OSX, dpkg avec Aptitude, apt-get dans GNU/Linux).

### Vérification du code
Le [référentiel Github sur l’avenir énergétique](https://github.com/NEBGitHub/energy-futures-vis-avenir-energetique) renferme le code source et les actifs qui sont déjà du domaine public.

Dans un dossier, exécutez :
* `git clone https://github.com/NEBGitHub/energy-futures-visualization.git`

### Élaboration et exécution de l’application
Dans le dossier `visualisation-avenir-energetique` :

* `npm install` – Extraire toutes les dépendances de Javascript
* `npm run start` – Exécuter le serveur de développement
* `npm run watch` – Transpiler le code de l’application et les dépendances, et vérifier s’il y a des changements

Les instructions `start` et `watch` doivent être exécutées en même temps. Pour ce faire, il faut deux fenêtres pour ligne de commande distinctes. Pendant l’exécution des deux instructions, visitez le site [http://localhost:3000/dvs](http://localhost:3000/dvs) pour voir l’application à l’œuvre.

### Tests
Vous pouvez exécuter les tests grâce à l’instruction `npm run test`.

### Complément d’information sur l’application d’avenir énergétique
Pour plus d’information sur l’application et le référentiel, consultez le fichier `documentation.md` ci-inclus.

## Complément d’information sur les outils de développement
L’application a été écrite presque entièrement en [Coffeescript](http://coffeescript.org), un langage qui traduit en Javascript en apportant des améliorations à la syntaxe et en éliminant des catégories entières de bogues de Javascript.

Notre système de génération est piloté par [Browserify](http://browserify.org), qui repose sur [la mise en œuvre de NPM CommonJS](https://docs.npmjs.com/how-npm-works/packages). Il faut avoir une connaissance de base du système intégré NPM pour comprendre la façon dont notre code est modularisé et se servir des dépendances installées par l’entremise de NPM.

Pour générer les visualisations, nous avons utilisé [D3](http://d3js.org), une bibliothèque Javascript permettant de manipuler des documents à partir de données. Nous vous recommandons de vous familiariser avec [D3 Selections](http://github.com/mbostock/d3/wiki/Selections) et [data joins](http://bost.ocks.org/mike/join/).

## Contactez-nous
L’équipe de développement de VizworX a réalisé ce projet pour le compte de la Régie. Nous ne sommes pas en mesure d’assurer un soutien complet pour ce projet, mais vos questions et vos suggestions sont les bienvenues!

* Patrick King, patrick.king@vizworx.com
* Alaa Azazi, alaa.azazi@vizworx.com
* Ben Cousins, ben.cousins@vizworx.com
* Stephanie Sachrajda

## Problèmes connus

* Cette application n’est *pas* conçue pour des résolutions d’écran inférieures à 1024*768; le résultat ne sera pas très intéressant sur un téléphone intelligent. Nous nous sommes efforcés d’appliquer des principes de conception adaptés partout, mais les appareils mobiles ne faisaient pas partie du mandat.
