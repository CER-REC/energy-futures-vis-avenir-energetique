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

* 2017-01-18 - Address an issue with language detection.
* 2017-01-16 - Fix a hang that would occur on the image generation endpoint, only under IIS.
* 2016-12-22 - Improve the thumbnail used when sharing the site on social media.
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


# Visualisation d’Explorer l’avenir énergétique du Canada

## Le projet

> Pour créer l’outil interactif [Explorer l’avenir énergétique du Canada](http://apps2.neb-one.gc.ca/dvs), l’Office national de l’énergie s’est associé à des experts de la visualisation des données du milieu universitaire et de l’industrie. Fondé sur la publication phare [Avenir énergétique du Canada en 2016 –  Offre et demande énergétiques à l’horizon 2040](http://www.neb-one.gc.ca/nrg/ntgrtd/ftr/index-fra.html), ce projet donnera aux Canadiens un avant-goût du nouveau et fabuleux moyen qu’utilisera désormais l’Office pour diffuser ses données.

> Notre objectif consiste à présenter des données de qualité provenant de notre plus récente perspective énergétique dans un format interactif visuel qui est convivial et qui clarifie une information complexe grâce à des visualisations faciles à comprendre, afin que vous puissiez explorer par vous-même l’avenir énergétique du Canada à partir de votre propre ordinateur. Au cours des mois et des années à venir, l’Office utilisera ce format novateur pour diffuser ses données sur la sécurité des pipelines et sur l’énergie, l’information qu’il possède sur l’infrastructure énergétique et une foule d’autres renseignements spécialisés.

> Si vous désirez utiliser les données pour vos recherches ou pour en faire votre propre analyse, vous pouvez les télécharger et les partager. Les graphiques peuvent aussi être téléchargés. Quant au code source des visualisations, il sera accessible sur le portail du « gouvernement ouvert » à l’adresse [open.canada.ca] (http://open.canada.ca). 

> Nous espérons avoir atteint notre objectif. Votre rétroaction est essentielle. 

> Vous pouvez nous faire parvenir vos commentaires et vos suggestions à l’adresse [conception-energie@neb-one.gc.ca](mailto:conception-energie@neb-one.gc.ca). Nous attendons vos commentaires avec impatience.


> ### Collaborateurs
> 
> #### Source des données :
Abha Bhargava (directrice), Matthew Hansen (analyste de marchés), Bryce van Sluys (analyste de marchés) 
> #### Coordination : 
Annette Hester (conception et coordination); Katherine Murphy (gestionnaire de projet); Stephen Chow (coordination des données); Garth Rowe (responsable du Web); Jim Chisholm (gestion de l’information et technologie)
> #### Visualisation des données : 
> Conception : Lindsay MacDonald, Charles Perin, Jo Vermeulen et Doris Kosminsky
> Aspect technique : Stephanie Sachrajda, Patrick King, Alaa Azazi, Ben Cousins, Gerald McNulty et Claudio Esperança

## Le référentiel
Le référentiel renferme le code nécessaire à l’exécution des visualisations d’Avenir énergétique dans un navigateur basé sur le concept SPA (single page application). L’application comporte quatre visualisations, alimentées par quatre ensembles de données portant sur la production et la consommation d’énergie au Canada. 

Contrairement à la première version de l’application, ce programme ne peut pas être exécuté comme un ensemble de fichiers non hiérarchiques; il requiert un serveur node.js en cours d’exécution pour fournir les données et accomplir d’autres tâches.

## Licence
Toutes les composantes du projet sont visées par la [licence du gouvernement ouvert – Canada] (http://ouvert.canada.ca/fr/licence-du-gouvernement-ouvert-canada).


## Pour commencer

Vous pouvez télécharger et exécuter le code d’application pour voir comment il a été établi, et examiner les données sur votre propre ordinateur. (Si vous voulez simplement examiner les visualisations, vous pouvez [voir l’application](http://apps2.neb-one.gc.ca/dvs) sur le site Web de l’Office.) 

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
L’équipe de développement de VizworX a réalisé ce projet pour le compte de l’Office. Nous ne sommes pas en mesure d’assurer un soutien complet pour ce projet, mais vos questions et vos suggestions sont les bienvenues!

* Patrick King, patrick.king@vizworx.com
* Alaa Azazi, alaa.azazi@vizworx.com
* Ben Cousins, ben.cousins@vizworx.com
* Stephanie Sachrajda

## Problèmes connus

* Cette application n’est *pas* conçue pour des résolutions d’écran inférieures à 1024*768; le résultat ne sera pas très intéressant sur un téléphone intelligent. Nous nous sommes efforcés d’appliquer des principes de conception adaptés partout, mais les appareils mobiles ne faisaient pas partie du mandat. 
* Parmi les navigateurs que nous avons mis à l’essai, Opera est le seul qui a posé de sérieux problèmes d’utilisation avec notre démarche, en particulier pour le téléchargement des images nécessaires pour remplir les menus. 

## Liste de modifications

* 2016-12-16 – Ajout de texte optionnel et résolution d’autres problèmes de validation : la sortie de l’application réussit maintenant la validation W3C HTML.
* 2016-12-14 – Correction d’un problème empêchant la communication de l’application dans les médias sociaux en français
* 2016-11-30 – Ajout du sélecteur d’ensemble de données à l’écran utilitaire du bouton de gauche 
* 2016-11-30 – Les scénarios non reconnus d’un ensemble de données sont cachés. Les scénarios ne montreront que les ensembles de données reconnus. 
* 2016-11-18 – Les boutons indiquant la province et la source d’énergie sur les visualisations 1 et 2 s’escamoteront dorénavant à mesure que l’utilisateur les fera glisser vers le haut ou vers le bas.
* 2016-11-17 – Ajout d’une routine d’ingestion et de validation de données Les données brutes sont placées sous `public/rawCSV`, les données validées sont inscrites sous `public/CSV`, et l’outil peut être utilisé à l’aide de l’instruction `npm run ingest`. Voir `JS/validation/Ingest.coffee`
* 2016-11-17 – Correction d’une perte de mémoire reliée à JSDOM
* 2016-11-07 – Correction d’un problème de bulles chevauchantes dans la visualisation 3 et diminution du remplissage de la bulle interne pour réduire les espaces vides
* 2016-11-07 – Création d’un élément côté serveur pour le rendu d’image pour éliminer toute possibilité d’erreur dans le rendu côté navigateur et corriger plusieurs problèmes connus
* 2016-10-31 – Réglage du curseur temporel (visualisation 3) pour utiliser une image PNG de meilleure qualité qui ne se détériore pas à l’agrandissement.
* 2016-10-20 – Installation d’un ensemble mis à jour de données sur l’Avenir énergétique du Canada en 2016 Il s’agit d’une version anticipée de la nouvelle mise à jour qui n’inclut pas les scénarios sur le GNL et de capacité limitée. L’interface utilisateur pour ces scénarios a été cachée temporairement. Les données de génération précédentes restent disponibles dans le référentiel, mais elles ne sont pas intégrées dans l’application pour le moment.
* 2016-10-05 – L’URL de requête reste la même tandis que les utilisateurs naviguent entre les visualisations, et quand l’ordre des provinces (dans la visualisation 1) et des sources (dans la visualisation 2) change.
* 2016-10-05 – Modification du curseur temporel de manière à utiliser une image SVG au lieu de l’image PNG utilisée précédemment
* 2016-10-05 – Changement de la hauteur et de la taille de la police de caractères dans la barre de titre sur la page de destination pour les faire correspondre à la barre de navigation des pages de visualisation
* 2016-10-05 – Il ne peut y avoir qu’un seul champ éclair à la fois, qui se ferme quand on clique à l’extérieur.
* 2016-10-04 – Ajout de la vidéo préliminaire de l’Office à la page de destination de la visualisation N.B. : À l’heure actuelle, les modèles qui renferment la vidéo dépendent beaucoup des ressources logicielles de la BOEW dans l’environnement de développement. Cela doit changer avant de pouvoir déployer cette version. Voir ce qui suit : `views/Wet3VideoIframe.mustache` et `views/Wet4VideoIframe.mustache`. Il a fallu également utiliser Iframes pour télécharger la vidéo chaque fois que nous consultions la page de destination, car le lecteur initialise correctement au chargement de pages seulement.
* 2016-10-03 – Restructuration de l’application de manière à créer un fichier pour chaque modèle Mustache, au lieu de les classer tous ensemble dans `templates.coffee` 
* 2016-10-03 – Solution de rechange à une erreur dans Firefox, Chrome et Safari causant la disparition de certains gradients de la visualisation pendant l’interaction Ce changement introduit un Iframe pour contenir l’application, ce qui a des conséquences sur la façon dont l’application s’intègre dans la page principale.
* 2016-09-29 – Réglage des axes y de sorte qu’ils ne remettent plus à l’échelle quand l’utilisateur change les scénarios dans la première, la seconde et la quatrième visualisation. Il est ainsi plus facile de comparer les données entre les scénarios.



