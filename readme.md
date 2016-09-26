La version française suit.

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
The project is located in the following repository: 

`energy-futures-visualization`, which includes the publicly released source code and assets. 

In one folder, run:
* `git clone https://github.com/NEBGitHub/energy-futures-visualization.git`

## Branches
There are a few branches and tags to be aware of in the repository.

* `master` points to the latest release
* `develop` points to the latest deployable working version of the app
* `feature/*` are created for work on new features, and may be in an unstable state
* Tags like `1.*.*` indicate deployed releases

We used [git-flow](https://github.com/nvie/gitflow) to manage our branching strategy.

## Developing: Watching for Build Changes and Hosting
In the `energy-futures-visualization` folder:

* `npm install` - Fetch all of the Javascript dependencies
* `npm run start` - Run the development server (`localhost:3000`)
* `npm run watch` - Transpile the app's code and dependencies, and watch for changes
* The app is contained in the WET 4.0.20 frame

## Integration Points with the NEB Site

### Language Detection
The application is fully French-English bilingual. We determine the language to use when the application loads by looking for an element with the id `LangID`, and inspecting its `lang` attribute. This element is intended to be the `<a>` element in the WET template for switching language, and the `lang` attribute indicates which language we would switch to. So when `lang` is `'fr'` we display the app in English, and when it is `'en'` we display it in French.

See `JS/App.coffee` for the language determination code, and also `JS/TranslationTable.coffee` for the full set of English and French text.

### Google Analytics
The application has some customized event recording for Google Analytics for some of the parameters that the user can choose when operating the visualization. If the `ga` object (created by a Google Analytics snippet) is available in the global scope, the app will report these events. See `JS/Router.coffee`

### Private Fonts
The app is designed to use some non free fonts: [Avenir Next Condensed](http://www.fonts.com/font/linotype/avenir-next/condensed) and [Avenir Next Condensed Demi](http://www.fonts.com/font/linotype/avenir-next/condensed-demi). For the NEB, these fonts and a stylesheet to integrate them are included in a separate, private repository. The app tests whether the Avenir stylesheet is available, and appends it to the page if it is, or loads a substitute Google font (PT Sans Narrow). See `JS/App.coffee#loadFonts`.

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


# Visualisation d’Explorer l’avenir énergétique du Canada

## Le projet

> Pour créer l’outil interactif Explorer l’avenir énergétique du Canada, l’Office national de l’énergie s’est associé à des experts de la visualisation des données du milieu universitaire et de l’industrie. Fondé sur la publication phare Avenir énergétique du Canada en 2016 –  Offre et demande énergétiques à l’horizon 2040 (http://www.neb-one.gc.ca/nrg/ntgrtd/ftr/index-fra.html), ce projet donnera aux Canadiens un avant-goût du nouveau et fabuleux moyen qu’utilisera désormais l’Office pour diffuser ses données.

> Notre objectif consiste à présenter des données de qualité provenant de notre plus récente perspective énergétique dans un format interactif visuel qui est convivial et qui clarifie une information complexe grâce à des visualisations faciles à comprendre, afin que vous puissiez explorer par vous‑même l’avenir énergétique du Canada à partir de votre propre ordinateur. Au cours des mois et des années à venir, l’Office utilisera ce format innovateur pour diffuser ses données sur la sécurité des pipelines et sur l’énergie, ses renseignements sur l’infrastructure énergétique et une foule d’autres données spécialisées.

> Si vous désirez utiliser les données pour vos recherches ou pour en faire votre propre analyse, vous pouvez les télécharger et les partager. Les graphiques peuvent aussi être téléchargés; quant au code source des visualisations, il sera accessible sur le portail du « gouvernement ouvert » à l’adresse [open.canada.ca] (http://open.canada.ca).

> Nous espérons avoir atteint notre objectif. Votre opinion est essentielle. 

> Vous pouvez nous faire parvenir vos commentaires et vos suggestions à l’adresse [conception-energie@neb-one.gc.ca](mailto:conception-energie@neb-one.gc.ca). Nous attendons vos commentaires avec impatience!


> ### Collaborateurs
 
> #### Source des données :
> Abha Bhargava (directrice), Matthew Hansen (analyste de marchés), Bryce van Sluys (analyste de marchés) 
> #### Coordination : 
>Annette Hester (conception et coordination); Katherine Murphy (gestionnaire de projet); Stephen Chow (coordination des données); Garth Rowe (responsable du Web); Jim Chisholm (gestion de l’information et technologie)
> #### Visualisation des données : 
> Conception : Lindsay MacDonald, Charles Perin, Jo Vermeulen et Doris Kosminsky
> Aspect technique : Stephanie Sachrajda, Patrick King, Ben Cousins, Gerald McNulty et Claudio Esperanca

## Le référentiel
Le référentiel renferme le code et les éléments nécessaires à l’exécution et au déploiement des visualisations d’Avenir énergétique dans un navigateur basé sur le concept SPA (single page application). L’application comporte quatre visualisations, alimentées par quatre ensembles de données portant sur la production et la consommation d’énergie au Canada, contenus dans des fichiers CSV non hiérarchiques. Par souci de simplicité et pour accélérer le développement, l’application a été conçue pour fonctionner sans serveur d’applications; n’importe quel serveur de fichiers non hiérarchiques peut héberger l’application déployée. 

## Licence
Toutes les composantes du projet sont visées par la [licence du gouvernement ouvert – Canada] (http://ouvert.canada.ca/fr/licence-du-gouvernement-ouvert-canada).


## Produits préalables
Node.js, NPM et Git doivent être installés sur votre ordinateur, et vous devez avoir une connaissance élémentaire d’une interface de ligne de commande pour votre système d’exploitation (CMD ou PowerShell dans Windows, Terminal dans OSX, Konsole ou l’équivalent dans GNU/Linux).

Dans Windows : 

1. Téléchargez la plus récente version stable du [programme d’installation pour Node et NPM pour Windows](https://nodejs.org/en/download/).
2. Téléchargez la plus récente version du [programme d’installation Git pour Windows](https://git-scm.com/download/win).
3. *Facultatif* [Téléchargez Tortoise Git](https://tortoisegit.org/), une interface utilisateur graphique (GUI) pour Git permettant l’intégration à l’Explorateur Windows.

Autres plateformes : recherchez Node.js, NPM et Git dans le gestionnaire de progiciel de votre plate‑forme (Homebrew dans OSX, dpkg avec Aptitude, apt-get dans GNU/Linux).

## Vérification du code
Le projet est situé dans le référentiel suivant : 

`energy-futures-visualization` renferme le code source et les actifs qui sont déjà du domaine public. 

Dans un dossier, exécutez :
* `git clone https://github.com/NEBGitHub/energy-futures-visualization.git`

## Embranchements
Le référentiel renferme quelques embranchements et indicateurs dont il faut tenir compte.

* `master` renvoie à la plus récente version.
* `develop` renvoie à la plus récente version de travail utilisable de l’application.
* `feature/*` servent à développer de nouvelles fonctionnalités, mais elles peuvent être instables.
* Les indicateurs comme `1.*.*` dénotent les versions déployées.

Nous nous servons de [git-flow](https://github.com/nvie/gitflow) pour gérer nos embranchements.

## Développement : Vérification des changements apportés aux versions et hébergement
Dans le dossier `energy-futures-visualization` :

* `npm install` – Extraire toutes les dépendances de Javascript.
* `npm run start` – Lancez le serveur de développement.
* `npm run watch` – Transpilez le code de l’application et les dépendances, et vérifiez s’il y a des changements.
* L’application est dans le cadre WET 4.0.20

## Points d’intégration avec le site de l’Office

### Détection de la langue
L’application est entièrement bilingue (français et anglais). Le choix de la langue se fait au moment du chargement de l’application; celle-ci recherche un élément `LangID` et vérifie l’attribut `lang`. Il devrait s’agir de l’élément `<a>` dans le modèle WET pour commuter la langue, et l’attribut `lang` indique la langue vers laquelle commuter. Donc, quand `lang` correspond à `'fr'`, l’affichage de l’application se fait en anglais et lorsqu’il est `'en'`, l’affichage est en français.

Voir `JS/App.coffee` pour le code déterminant la langue, et également `JS/TranslationTable.coffee` pour l’ensemble du texte en anglais et en français.

### Google Analytics
L’application comporte quelques consignateurs d’événements personnalisés pour Google Analytics, permettant à l’utilisateur de choisir certains paramètres pour générer la visualisation. Si l’objet `ga` (créé par un extrait de code Google Analytics) est disponible dans la portée générale, l’application relèvera ces événements. Voir `JS/Router.coffee`

### Polices de caractères privées
L’application est conçue pour utiliser quelques polices de caractères payantes : [Avenir Next Condensed](http://www.fonts.com/font/linotype/avenir-next/condensed) et [Avenir Next Condensed Demi](http://www.fonts.com/font/linotype/avenir-next/condensed-demi). Pour l’Office, ces polices de caractères et une feuille de styles permettant de les intégrer sont fournies dans un référentiel distinct et privé. L’application vérifie si la feuille de styles Avenir est disponible et l’annexe à la page si elle l’est. Sinon, elle substitue une police de caractères Google (PT Sans Narrow). Voir `JS/App.coffee#loadFonts`.

### Bitly
La fonction d’exportation des images de l’application déployée possède un mécanisme qui permet d’ajouter une adresse URL Bitly à l’image, laquelle renvoie à la version originale interactive du graphique. Pour cela (sans dévoiler la clé API Bitly de l’Office), nous utilisons la fonction `ShortLinkBitly` sur la portée générale. La fonction déclenche une procédure de rappel sous forme d’un de ses paramètres, le seul paramètre de rappel étant une adresse URL permettant d’utiliser le lien court. Voir `JS/ImageExporter.coffee`.


## Développement en vue du déploiement

* `npm run distribute`

Les tâches liées à la distribution utilisent le dossier `dist/` pour exécuter plusieurs opérations :

* Créer le lot Javascript en mode de production minimisé;
* Copier toutes les ressources statiques de l’application;
* Créer le document HTML contenant le guide d’installation;
* Comprimer tous les éléments dans un fichier zip.

Pour savoir quoi faire de l’archive distribuable, prenez connaissance du fichier `installguide.md`. 

## Complément d’information sur les outils de développement
L’application a été écrite presque entièrement en [Coffeescript](http://coffeescript.org), un langage qui traduit en Javascript en apportant des améliorations à la syntaxe et en éliminant des catégories entières de bogues de Javascript.

Notre système de génération est piloté par [Browserify](http://browserify.org), qui repose sur [la mise en œuvre de NPM CommonJS](https://docs.npmjs.com/how-npm-works/packages). Il faut avoir une connaissance de base du système intégré NPM pour comprendre la façon dont notre code est modularisé et se servir des dépendances installées par l’entremise de NPM. 

Pour générer les visualisations, nous avons utilisé [D3](http://d3js.org), une bibliothèque Javascript permettant de manipuler des documents à partir de données. Nous vous recommandons de vous familiariser avec [D3 Selections](http://github.com/mbostock/d3/wiki/Selections) et [data joins](http://bost.ocks.org/mike/join/).

## Contactez-nous
L’équipe de développement de Startide Solutions a réalisé ce projet pour le compte de l’Office. Nous ne sommes pas en mesure d’assurer un soutien complet pour ce projet, mais vos questions et vos suggestions sont les bienvenues!

* Stephanie Sachrajda - stephanie.sachrajda@startidesolutions.com
* Patrick King - patrick.king@startidesolutions.com
* Ben Cousins - ben.cousins@startidesolutions.com

## Problèmes connus

* Cette application n’est *pas* conçue pour des résolutions d’écran inférieures à 1024*768; le résultat ne sera pas très intéressant sur un téléphone intelligent. Nous nous sommes efforcés d’appliquer des principes de conception adaptative en tout temps, mais la concrétisation de grands concepts requiert une taille minimale d’écran pour donner des résultats satisfaisants. 
La fonctionnalité * 'Enregistrer l’image sous' d’Internet Explorer ~11 n’applique pas la bonne police de caractères. Elle semble déterminée par Edge ~13.
* Toutes les versions d’Internet Explorer/Edge empêchent l’utilisation des URL de données dans les éléments `<a>`. En raison de cette contrainte, l’utilisateur ne peut pas télécharger l’image exportée en cliquant sur le lien. Nous avons contourné le problème de cette façon : une boîte de dialogue modale s’ouvre, à l’intérieur de laquelle se trouve l’URL des données du fichier PNG exporté dans un élément `<img>`. Pour permettre le téléchargement de l’image à partir du lien, il faudrait, par exemple, avoir recours à Flash ou à un soutien de serveur quelconque. 
* Un bogue dans Safari ~8 fait en sorte que les fichiers SVG sont reproduits dans canvas; si le fichier SVG se trouve ailleurs dans le document, les paramètres de la taille de l’image (drawImage) ne sont pas pris en compte. Pour contourner le problème, nous n’avons utilisé que des fichiers images PNG pour l’exportation et le téléchargement. Pour le moment... 
* Firefox et Chrome (et Safari?) Problème lié aux dégradés des fichiers SVG :  les dégradés sont indiqués par une adresse URL qui se trouve dans le fichier SVG. Quand l’adresse URL du document HTML enclavé change (par exemple, quand nous utilisons `history.pushState` pour actualiser la barre d’adresse en fonction de la configuration de la visualisation du moment), ces adresses URL internes des SVG sont rompues et il n’y a plus de dégradé. 
* Parmi les navigateurs que nous avons mis à l’essai, Opera est le seul ayant posé des problèmes d’utilisation avec notre démarche, en particulier pour le téléchargement des images nécessaires pour remplir les menus.
