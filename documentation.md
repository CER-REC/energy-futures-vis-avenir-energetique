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

1. Whether the `language` URL query parameter has been set, with values `en` and `fr` setting the application language to English and French.
2. Whether a cookie named `_gc_lang` has been set, with values `E` and `F` setting the application language to English and French.
3. If the above checks do not succeed, by defaulting to English.

See the function `detectLanguage` in `JS/App.coffee` for the language determination code, and also `JS/TranslationTable.coffee` for the full set of English and French text.

### Google Analytics
The application has some customized event recording for Google Analytics for some of the parameters that the user can choose when operating the visualization. If the `ga` object (created by a Google Analytics snippet) is available in the global scope, the app will report these events. See `JS/Router.coffee`

### Private Fonts
The app is designed to use some non free fonts: [Avenir Next Condensed](http://www.fonts.com/font/linotype/avenir-next/condensed) and [Avenir Next Condensed Demi](http://www.fonts.com/font/linotype/avenir-next/condensed-demi). For the NEB, these fonts and a stylesheet to integrate them are included in a separate, private repository. The app tests whether the Avenir stylesheet is available, and appends it to the page if it is, or loads a substitute Google font (PT Sans Narrow). See `JS/App.coffee#loadFonts`.

### Bitly
The image download feature has a mechanism to include a Bitly URL in the image, which points back to the original interactive version of the visualization. This feature is enabled if you set both the `BITLY_USERNAME` and `BITLY_API_KEY` variables (either as environment variables or in the `.env`file for your server.)


# Documentation relative aux visualisations sur l’avenir énergétique

## Structure du référentiel

Le référentiel renferme quelques embranchements et indicateurs dont il faut tenir compte.

* `master` renvoie à la dernière version.
* `develop` renvoie à la dernière version de travail utilisable de l’application.
* `feature/*` sert à développer de nouvelles fonctionnalités, mais peut être instable.
* Les indicateurs comme `1.*.*` dénotent les versions déployées.

Nous nous servons de [git-flow](https://github.com/nvie/gitflow) pour gérer nos embranchements.


## L’application

L’application de visualisation comporte deux parties principales : une application Web et un serveur. L’application Web est exécutée dans le navigateur et est responsable de tout ce que vous voyez à l’écran : la visualisation, les boutons et les instructions pour faire des changements, la page de destination et les barres de navigation. Le serveur est responsable 1) du langage HTML et Javascript de l’application Web, 2) d’autres ressources statiques comme les images et les polices de caractères, 3) des données nécessaires pour les visualisations et 4) de la création de téléchargements d’images et de fichiers CSV pour les visualisations.

### L’application Web
L’application Web comprend ce qui suit : 

* un petit nombre de modèles Mustache dans `/views`;
* Des fichiers codes de `/JS` regroupés en un fichier à l’aide de Browserify, inscrit dans `/public/bundle.js`.

Le point d’entrée pour l’application Web est `/JS/App.coffee`. À partir de là, d’autres fichiers et modules NPM sont compris, et l’ensemble complet de codes inclus est combiné dans `bundle.js`. Lorsque `npm run watch` est exécuté, le système d’élaboration surveille chaque fichier d’`App.coffee` inclus, et actualise le groupe quand un de ces fichiers change.

Certains éléments clés de l’application Web : 

* `/JS/Application.coffee`, point d’entrée de l’application dans le navigateur; 
* `/JS/Router.coffee`, routeur responsable du changement de page;
* les représentations dans `/JS/views`, en particulier celles des visualisations. Chacun de ces fichiers définit une 'page' à l’intérieur de l’application, et les visualisations traitent la création et l’animation des graphiques.
* Les tableaux dans `/JS/charts` sont utilisés par les représentations de visualisation.
* Chacune des configurations dans `/JS/VisualizationConfigurations` définit les états possibles pour les quatre visualisations.
* Les modèles dans `/JS/templates` sont des fragments de page servant de points de départ pour chaque représentation dans la visualisation et pour d’autres affichages modaux.

### Le serveur
Le serveur est une application node.js. Il y a trois configurations différentes pour le serveur : développement, essai et production. 

Voici certains éléments clés du serveur : 

* le serveur lui-même dans `/JS/serves/Server.coffee`;
* les trois versions du serveur sont définies dans `/JS/servers`; chacune est le point d’entrée d’une instruction de serveur et charge un ensemble différent d’intergiciels.
* Chaque serveur comprend un ensemble d’intergiciels de `/JS/middleware`. Les intergiciels sont modulaires et peuvent être ajoutés ou retirés de chaque serveur de façon indépendante. 
* Chaque intergiciel utilise un ou plusieurs pilotes de `/JS/handlers`, qui répondent aux requêtes.

#### Serveurs et configuration
Il y a trois serveurs différents pour l’application sous `/JS/servers`, chacun ayant un but différent. 

* Le serveur de développement (lancé au moyen de `npm run start`) comprend l’application complète, de même que le fichier statique (ou stable) utilisé pour les images, et traite les ressources statiques comme les images et les polices de caractères. C’est le serveur à utiliser pour examiner l’application ou pour l’élargir. 
* Le serveur d’essai (exécuté avec `npm run test`) inclut tous les éléments de l’application qui sont à l’essai.
* Le serveur de production (exécuté avec `npm run start-production`) est censé être utilisé avec un serveur SIA pour les fichiers et pages statiques (ou stables). Ce serveur comprend seulement les extrémités pour l’application Web à utiliser. Comme il ne traite pas les pages HTML de l’application Web, il ne peut pas traiter l’application tout seul.

Chaque dossier du serveur contient un fichier `.env` file, avec les réglages de configuration pour ce serveur.

## Points d’intégration avec le site de l’Office

### Outils de déploiement propres à l’Office
Ce projet contient certains outils qui servent à déployer l’application pour l’Office et ne sont utilisés par aucun autre utilisateur. Ce sont les suivants :

* le serveur de production;
* les fichiers `web.config` à la racine du projet et dans `JS/servers/ProductionServer`;
* les scripts `build`, `distribute`, `ingest`, `visual-studio-install` et `clean-vs` dans le fichier `package.json` et les tâches qui leur sont reliées dans `/tasks`.

### Détection de la langue
L’application est entièrement bilingue (français et anglais). Nous déterminons la langue à utiliser pendant le chargement de l’application en vérifiant dans l’ordre suivant :

1. Si le paramètre de requête URL `language` URL a été installé avec les valeurs `en` et `fr` pour régler l’application de la langue en français et en anglais.
2. Si le témoin `_gc_lang` a été installé avec les valeurs `E` et `F` pour régler l’application de la langue en français et en anglais.
3. Si les vérifications ci-dessus échouent, en revenant par défaut à l’anglais.

Voir la fonction `detectLanguage` dans `JS/App.coffee` pour le code déterminant la langue, et également `JS/TranslationTable.coffee` pour l’ensemble du texte en anglais et en français.

### Google Analytics
L’application comporte quelques consignateurs d’événements personnalisés pour Google Analytics, permettant à l’utilisateur de choisir certains paramètres pour générer la visualisation. Si l’objet `ga` (créé par un extrait de code Google Analytics) est disponible dans la portée générale, l’application relèvera ces événements. Voir `JS/Router.coffee`.

### Polices de caractères privées
L’application est conçue pour l’utilisation de certaines polices non libres : [Avenir Next Condensed](http://www.fonts.com/font/linotype/avenir-next/condensed) et [Avenir Next Condensed Demi](http://www.fonts.com/font/linotype/avenir-next/condensed-demi). Pour l’Office, ces polices de caractères et une feuille de styles permettant de les intégrer sont fournies dans un référentiel distinct et privé. L’application vérifie si la feuille de styles Avenir est disponible et l’annexe à la page si elle l’est. Sinon, elle substitue une police de caractères Google (PT Sans Narrow). Voir `JS/App.coffee#loadFonts`

### Bitly
La fonction de téléchargement des images possède un mécanisme qui permet d’ajouter une adresse URL Bitly à l’image, qui renvoie à la version originale interactive de la visualisation. Cette fonction est activée si vous réglez les variables `BITLY_USERNAME` et `BITLY_API_KEY` (comme variables d’environnement ou dans le fichier `.env` pour votre serveur).


