## [1.2.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v1.2.1) (2020-05-25)


### ConditionDetails

* **Bug Fixes:** fixes the missing space before the project name (e594be0)
* **Bug Fixes:** fixes the missing space before the project name (14e0d53)


### MethodologyBox

* **Bug Fixes:** mutes the lint max-len rule of the line instead (2b2d9a4)
* **Bug Fixes:** fixes the missing image title issue introduced by the previous commit (8bd38ab)
* **Bug Fixes:** shortens the line so that lint does not complain (1d81c6f)
* **Bug Fixes:** applies a better approach to handle missing images (deb70b7)
* **Bug Fixes:** fixes the issue that image links are broken (aed3c16)

# [1.2.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v1.2.0) (2019-12-13)


### Analytics

* **Features:** updates analytics event name (3f1437d)


### App

* **Tests:** fixes new linting errors (33ddd6c)


### Bitly

* **Bug Fixes:** fix response endpoint (8528125, NEBV-1842)
* **Bug Fixes:** change bitly response parse check (e9e2cfa, NEBV-1842)


### FeaturesLegend

* **Features:** remove AssociatedComp text in FeaturesLegend (34742a9, NEBV-1823)


### FeatureTitle

* **Bug Fixes:** increase breakpoint to large to avoid Feature cutoff (4d308ad)
* **Bug Fixes:** remove feature title on ipad view (d36a787, NEBV-1821)


### FeatureTypeHeading

* **Bug Fixes:** update snapshots and fix lint issues (900914c, NEBV-1827)
* **Bug Fixes:** fix scroll in instrument feature type description (2c76858, NEBV-1827)


### ProjectHeader

* **Bug Fixes:** pass in props for ConditionDetails (83b4064, NEBV-1824)
* **Bug Fixes:** add conditional check for asterisk (8d99297, NEBV-1824)
* **Tests:** add tests and update companies props (5cfa3ce, NEBV-1824)


### Wheel

* **Tests:** fixes linting error (320d0ce)

# [1.1.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v1.1.0) (2019-12-09)


### App

* **Bug Fixes:** adds missing analytics events (0d0bab3)

# [1.0.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v1.0.0) (2019-11-26)


### Node

* **Project Maintenance:** updates from Node 10.13.3 to 12.13.1 (eadddcd)

# [0.29.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.29.0) (2019-11-21)


### Analytics

* **Features:** revises analytics event data (c521ad0)


### App

* **Features:** updates TotalConditions analytics event + helpers (c7b441b)
* **Features:** remove beta text from title (7ef397d, NEBV-1830)
* **Features:** updates analytics event labels (121b68b)
* **Features:** adds on-load analytics event (1897c8e)
* **Features:** removes analyticsAction constants (3f53c69)
* **Features:** adds value and userId fields to analytics (59a26bd)
* **Features:** updates view analytics events (c3f511d)
* **Bug Fixes:** adds missing props to stories, updates snapshots (9315147)
* **Bug Fixes:** uses full project name in Company popup (5836bea)
* **Bug Fixes:** lifts memoized class methods as per linting changes (0a52de2)
* **Bug Fixes:** places the app in its own stacking context to avoid WET conflicts (80a97b9)


### ConditionDetails

* **Features:** updates analytics events (32006e3)
* **Features:** updates ProjectHeader analytics event (8005854)


### ConditionExplorer

* **Bug Fixes:** supports touch events for selecting keywords (3e76aec, NEBV-1822)


### Dependencies

* **Project Maintenance:** update babel monorepo to v7.7.0 (cbe5a70)
* **Project Maintenance:** update dependency @vizworx/babel-preset to v1.1.0 (4078309)
* **Project Maintenance:** update dependency @vizworx/eslint-config-react to v1.1.1 (4e023b8)
* **Project Maintenance:** update dependency babel-plugin-react-docgen to v3.2.0 (d70d630)
* **Project Maintenance:** update dependency enzyme-adapter-react-16 to v1.15.1 (61277b3)
* **Project Maintenance:** update dependency eslint to v6.6.0 (89cc38c)
* **Project Maintenance:** update dependency jest-junit to v9 (cdbec1f)
* **Project Maintenance:** update dependency node-sass to v4.13.0 (d6ea614)
* **Project Maintenance:** update dependency webpack-cli to v3.3.10 (8b79040)


### FeaturesMenu

* **Features:** updates analytics event (9d744ff)


### List

* **Features:** removes unnecessary property declaration (b59840b)


### MainInfoBar

* **Features:** updates analytics events (1d329c1)


### PopupBtn

* **Features:** allows links to also have click handlers (a626fcf)


### ProjectMenu

* **Features:** updates analytics event (df953a0)


### RegDocsPopup

* **Features:** adds count data to analytics event (d26ac02)
* **Features:** updates RegDecos analytics event (4b09456)


### RegionCompanies

* **Features:** updates analytics event (abc42e6)


### Search

* **Features:** updates analytics events (7892063)
* **Features:** updates filter analytics events (a81dd95)


### ShareIcon

* **Features:** updates analytics events (ff01077)


### SmallMultiplesLegend

* **Features:** updates analytics event (32a797d)


### Storybook

* **Tests:** updates snapshots after recent dependency updates (6825ef3)


### SuggestedKeywordsPopout

* **Features:** updates analytics events (2395ec6)


### View 2

* **Features:** removes unnecessary property, combines duplicate code in a method (627c3bb)


### Wheel

* **Features:** updates analytics events (d13cbb7)

## [0.28.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.28.1) (2019-10-02)


### Analytics

* **Bug Fixes:** fix reporting of analytics events (efdc0b5)

# [0.28.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.28.0) (2019-10-01)


### Analytics

* **Features:** adds checks for Google Tag Manager's .dataLayer (f8f91fc)
* **Bug Fixes:** silences console messages in test environments (bfbc866)


### App

* **Features:** adds an additional name to the list of CER data experts (925593e)


### Dependencies

* **Bug Fixes:** update dependency react-use-gesture to v6 (ae807f0)
* **Project Maintenance:** update babel monorepo to v7.6.2 (f6768ea)
* **Project Maintenance:** update dependency @vizworx/babel-preset to v1.0.1 (73c32b2)
* **Project Maintenance:** update dependency codecov to v3.6.1 (14e1ec9)
* **Project Maintenance:** update dependency cross-env to v6 (ee58cce)
* **Project Maintenance:** update dependency cross-env to v6.0.2 (d3f156c)
* **Project Maintenance:** update dependency eslint to v6.5.1 (c92e59a)
* **Project Maintenance:** update dependency webpack to v4.41.0 (f0008c1)
* **Project Maintenance:** update dependency webpack-cli to v3.3.9 (97fd0c7)
* **Project Maintenance:** update dependency webpack-dev-middleware to v3.7.2 (6eac2c1)
* **Project Maintenance:** update storybook monorepo to v5.2.1 (4195507)


### ShareIcon

* **Features:** adds email content (26ad7b8)
* **Bug Fixes:** Properly encodes text for mailto URLs (3bc9c3e)


### Wheel

* **Bug Fixes:** updates PullToSpin to fix breaking changes to react-use-gesture (2fb1e5e)

# [0.27.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.27.0) (2019-09-25)


### Analytics

* **Features:** replaces local strings with centralized action types (557889c)


### App

* **Features:** memoizes the analytics interaction wrapper (9c80d6a)
* **Features:** updates French and English text (620dbc7)
* **Features:** adds tests and documentation to the analytics reporter (75e57fd)
* **Features:** updates text (5bfe9bd)
* **Features:** updates text as per the CER (555b424)
* **Features:** adds analytics interaction when a keyword is selected (7b98c66)
* **Features:** adds analytics interaction for beginning the tutorial (c04c2ac)
* **Features:** adds initial analytics reporter (a6bfd0a)
* **Features:** adds event and state information to analytics (2fd1942)
* **Features:** adds an analytics wrapper for handleInteraction (87e8c2c)
* **Bug Fixes:** updates React.Fragment syntax to <> as per the updated config (aae55db)
* **Bug Fixes:** passes openCompanyPopup to Region Summary to avoid prop errors (b55f332)
* **Tests:** adds a basic mock store to keep tests with analytics interactions from breaking (e652eae)
* **Tests:** simplifies mock events (38efd3b)
* **Tests:** updates snapshots (1e6466d)
* **Code Refactoring:** continues generalizing the analytics reporter, expands tests (abdfe9e)
* **Code Refactoring:** extracts app-specific logic from analyticsReporting to allow reuse (2eac28b)


### ConditionDetails

* **Features:** adds an analytics interaction when opening the project details popup (fafac5e)
* **Features:** adds an analytics interaction for opening the RegDocs popup (f97fe32)
* **Features:** adds analytics interactions for selecting a condition or instrument (d8376c8)
* **Bug Fixes:** fixes vertical alignment of project header across browsers (a35e6e6)
* **Bug Fixes:** adds ellipses to instrument numbers in the ConditionList as needed (3917db1)


### ConditionExplorer

* **Features:** adds analytics interaction when dragging the Guide (065b71a)
* **Features:** adds analytics interactions when changing GuideDetail pages (bbb19f4)
* **Features:** adds analytics interactions for expanding and closing the Guide (914e9ed)
* **Bug Fixes:** avoids sending both drag and click events when mousing down on the Guide (085ff5b)


### Dependencies

* **Project Maintenance:** update dependency @vizworx/eslint-config-react to v1.1.0 (84e5d3d)


### DownloadPopup

* **Features:** adds an analytics interaction for the dataset download (2db1285)


### Dropdown

* **Features:** exposes the initiating event to Dropdown event handlers (0814003)


### FeaturesMenu

* **Features:** adds analytics interactions for changing the selected feature (8ee09a2)


### GuideTransport

* **Features:** adds analytics interactions for the transport buttons (26ac382)


### HighLightSummary

* **Bug Fixes:** fixes highlight summary (344e7fd, NEBV-1763)


### KeywordExplorerButton

* **Features:** adds an analytics interaction for returning to view 1 (d3870e6)


### List

* **Features:** passes the event as a final argument to the List's event handler (a9e5e3e)


### MainInfoBar

* **Features:** adds analytics interactions for the info bar tabs and methodology download (be70f3a)


### Modal

* **Bug Fixes:** refactors popups to use consistent styles (53dbadc)


### ProjectMenu

* **Features:** adds analytics interactions for selecting a project (8471f36)
* **Features:** only show sedimentation for projects off the screen (6318a35, NEBV-1767)
* **Features:** hides sedimentation if there are no projects in that direction (e80c33e)
* **Bug Fixes:** removes a fallback call to Redux from inside a render method (23f1fee)


### Redux

* **Bug Fixes:** overwrites arrays in the store rather than merge to avoid concatenating them (d3598c1)


### RegionSummary

* **Features:** adds an analytics interaction for selecting a company (335fe18)
* **Features:** adds ellipses to company list items (487fbb9)


### SearchBar

* **Features:** adds analytics interactions to the suggested keywords (676f332)
* **Features:** adds analytics interactions for changing filter statuses and years (9ff87d7)
* **Features:** adds analytics interactions for adding/removing keywords and toggling advanced mode (c2af917)
* **Features:** closes the active tab when the app's mode changes (d7f643c)
* **Features:** hides the filter summary in Location mode or with default filter params (7221bb5)
* **Features:** hides the filter tab in Location mode (ea08f24)
* **Features:** updates text, adds plural and all-categories checks (8df3d95)
* **Bug Fixes:** closes the active tab on any mode change, not just to location mode (6f4ad32)


### ShareIcon

* **Features:** refactors sharing logic and adds analytics interactions (ba92c6b)


### SmallMultiplesLegend

* **Features:** adds analytics interactions for selecting legend items (3127b2d)


### SnapShots

* **Bug Fixes:** updates snapshots (2914190)


### StreamGraph

* **Features:** uses detected locale for toLocaleString calls (4d6e192)


### TotalConditionsLabel

* **Features:** adds an analytics interaction for opening the popup (99ab284)


### TrendButton

* **Features:** adds an analytics interaction for clicking the button (c3776b2)


### UnsupportedWarning

* **Features:** adds French text (181256b)


### Utilities

* **Features:** adds an alternative handleInteraction that doesn't prevent default behaviours (9bdd22c)


### Wheel

* **Features:** adds analytics interactions for the wheel and wheel list (b805270)
* **Features:** adds analytics interactions for the Pull To Spin button (6b12508)
* **Features:** restructures ray wrappers to give letters separate hitboxes (1c41764)
* **Bug Fixes:** split the Location rays and legend markers into separate focusable wrappers (d6e5782)


### WheelList

* **Bug Fixes:** adds border radius to avoid capturing mouse events for the ring (89583e6)

# [0.26.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.26.0) (2019-09-11)


### App

* **Features:** adds "Beta" to title of visualization (ed9028d, NEBV-1750)
* **Features:** updates social media images to replace NEB with CER (dec5576)
* **Features:** Uses new French URL (c1772f6)
* **Features:** fixes French spacing for colons (ac42115)
* **Bug Fixes:** fixes transport controls overlapping the BrowseBy buttons (462bf0c)
* **Bug Fixes:** fixes invalid company selection if the first project has no instruments (ed810d5)


### BrowseBy

* **Features:** adds background to keep French accents from being cut off by the wedges (494c256)


### CompanyPopup

* **Bug Fixes:** fixes crash with bullet points in French (74525be)


### ConditionDetails

* **Features:** adjusts project header typography and wording (42bccd0)


### ConditionDetails/ProjectHeader

* **Bug Fixes:** fixes overlapping bubbles (49118e8, NEBV-1730)


### ConditionExplorer

* **Bug Fixes:** fixes AdvancedFormattedMessage remounting breaking transitions (6e099ff, NEBV-1750)
* **Bug Fixes:** fixes the Guide messages not fading in and out (c2641f1)
* **Bug Fixes:** fixes the Guide remaining blank after interactions (4c34107)


### Dependencies

* **Project Maintenance:** switches from manual Babel config to @vizworx/babel-preset (311972c)
* **Project Maintenance:** switches from manual ESLint config to @vizworx/eslint-config-react (39339b5)
* **Project Maintenance:** update babel monorepo to v7.6.0 (3e2aa5d)
* **Project Maintenance:** update dependency @babel/node to v7.6.1 (a960469)
* **Project Maintenance:** update dependency require-context.macro to v1.2.1 (97763a3)
* **Project Maintenance:** update dependency topojson-server to v3.0.1 (d028ee1)
* **Project Maintenance:** update dependency topojson-simplify to v3.0.3 (1c5f756)
* **Project Maintenance:** update dependency webpack-cli to v3.3.8 (ca6928c)


### Disclaimer

* **Features:** updates styling to match the rest of the vis. (35f75a9)
* **Features:** adds a component to display required legal text (1822fdf)


### FeatureTypesDescription

* **Bug Fixes:** removes redundant occurrence of Other from instrument headings (b956c53)


### GreyPipe

* **Bug Fixes:** fixes break in pipe (c950f71, NEBV-1748)


### LocationWheelMinimap

* **Bug Fixes:** ensures that the map matches both the region and province (9f5d716)


### MainInfoBar

* **Features:** updates methodology links to point at final URLs (0566b55)


### Methodology

* **Features:** adds Regdoc Link (0339305, NEBV-1703)


### RegionSummary

* **Features:** adds missing French translation (7ee0015)


### View 3

* **Features:** updates typography as per the iLab (6e15bac)


### Wheel

* **Bug Fixes:** keeps the list's corners from capturing click events in the wheel (50635a6)

# [0.25.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.25.0) (2019-09-04)


### AdvancedFormattedMessage

* **Features:** adds documentation and tests (30c6b17)
* **Documentation:** adds performance suggestions (918164f)


### App

* **Features:** updates localization with revised text (813d245)
* **Features:** changes NEB-related terminology to the CER (60b43c7)
* **Bug Fixes:** fixes FormattedMessage values being passed to children (47fa9e8)
* **Tests:** updates snapshots (c08dcd6)
* **Documentation:** updates documentation with change from NEB to CER (28d3fc5)


### CompanyPopup

* **Bug Fixes:** fixes the Close button being cut off in French (b7adc47)


### ComposedQuery

* **Features:** adds documentation (4d17525)


### ConditionDetails

* **Bug Fixes:** removes prop type for an unused prop (67504ee)


### Dependencies

* **Bug Fixes:** update dependency victory to v33 (1b85a8c)
* **Tests:** updates snapshots after updating Victory (1d05b9c)
* **Project Maintenance:** update dependency cross-env to v5.2.1 (66931e8)
* **Project Maintenance:** update dependency eslint to v6.3.0 (39b403b)
* **Project Maintenance:** update dependency eslint-config-airbnb to v18.0.1 (62a2cd7)
* **Project Maintenance:** update dependency http-proxy-middleware to v0.20.0 (c2a25fd)
* **Project Maintenance:** update dependency jest-junit to v8 (9bee97c)
* **Project Maintenance:** update dependency webpack-dev-middleware to v3.7.1 (ec8f36c)


### FeatureDescription

* **Features:** adds revised links to feature text (f254732)


### FeatureTypesDescription

* **Bug Fixes:** removes unused code that was breaking the build (2af3539)


### jest-junit

* **Tests:** updates jest-junit config to output for CI (93ea658)


### MainInfoBar

* **Features:** updates Methodology images with the change to CER (7558877)
* **Code Refactoring:** extracts contact email to constants.js (36d09f6)


### ShortcutInfoBar

* **Features:** replaces hardcoded text with localization (26542b0)


### TotalConditionsLabel

* **Bug Fixes:** fixes very large focus outline (2400eea)


### TranslatedParagraphs

* **Features:** adds documentation and tests (b582435)


### Webpack

* **Features:** updates Webpack config to reflect the new Sass-Loader API (de10b30)

# [0.24.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.24.0) (2019-08-26)


### app

* **Bug Fixes:** remove linting error (67b289d)


### App

* **Features:** batches Redux updates to avoid re-renders (792fb59)
* **Features:** extracts unsupported-system logic to a separate component (cc816c0)
* **Features:** adds unsupported browser message (6b00499, NEBV-1692)
* **Features:** adds unsupported resolution message (55e2b67, NEBV-1693)
* **Features:** adds Instrument.documentNumber, removes Instrument.documents (8efc248)
* **Features:** adjusts layout and styling to match the design doc (1127b05)
* **Features:** rewrites ConditionDetails' expansion code and styles to make layout easier (57fe355)
* **Features:** adds Instrument.documentNumber, removes Instrument.documents (8bc32cd)
* **Features:** updates French text, fix small styling issues (80bd0a8)
* **Features:** moves images (44187d8)
* **Features:** updateSelection applies known values immediately rather than waiting for queries (291a0ae)
* **Features:** updates locale text (d7cd18f)
* **Features:** removes Instrument activity field (bb08e23)
* **Features:** scrollbars become visible on MacOS (6d69b6b)
* **Features:** lifts ErrorBoundary up to catch codesplitting errors (9ab920d, NEBV-1692)
* **Features:** adds Instrument.documentNumber, removes Instrument.documents (a048728)
* **Bug Fixes:** adds missing Status text (1ad42db)
* **Bug Fixes:** makes eager loading optional, fixes query missing a field (8edf64f)
* **Bug Fixes:** adds eager loading that was missed in previous commit (a544e99)
* **Bug Fixes:** fixes the bottom of the ConditionList not being clickable (7019b65)
* **Bug Fixes:** fixes BrowseBy spilling off the screen, transition glitches (82d17b7)
* **Bug Fixes:** updates snapshots, fixes styling issues from rebase (103afce)
* **Tests:** updates snapshots (9f25c47)
* **Tests:** updates snapshots, fixes broken test (4470d7f)
* **Tests:** fixes linting errors (6a5ced8)
* **Tests:** updates snapshots, removes useless test (93a4923)
* **Tests:** updates snapshots (2e23931)
* **Code Formatting:** cleanup of duplicate code (d9b6aad)
* **Code Formatting:** removes unused query (f80835b)
* **Code Refactoring:** makes RegionConditions and RegionCompanies private components (bd045d9)
* **Code Refactoring:** relocates FeaturesLegend image to the component folder (acc2732)


### App, View 1, Footer, DownloadPopup

* **Features:** adds download modal and links it to csv download (8dda6b3, NEBV-1704)


### ConditionDetails

* **Features:** increases font size (d02d202)
* **Features:** increases the list's line height to 8px (b891045)
* **Bug Fixes:** keeps ProjectHeader from sitting in front of the Keyword popout (37702cb)
* **Bug Fixes:** moves search matches to a full-width block (2becd1a)
* **Bug Fixes:** removes ellipsing for Details content to avoid issues with Theme arrays (caf4b8d)
* **Bug Fixes:** rewrites auto-scroll logic to fix Firefox scrolling the whole window (92643f1)
* **Code Formatting:** removes commented code (0a42219)
* **Code Formatting:** removes commented code (3a40c63)


### ConditionDetails/Content

* **Bug Fixes:** adds conditional rendering for effective date (fd28584)


### ConditionExplorer

* **Features:** uses a shadow to help the selected keyword stand out more (8a36abf)
* **Features:** adds texts colour change on off click (486c02b)
* **Features:** fades on off click (e2a37e4)
* **Features:** adds fading into the guide (25b6c1e)
* **Features:** changes colour of explorer on keyword selection (6b15e55, NEBV-1699)
* **Features:** unselects the current keyword on a click elsewhere in the explorer (d7a8916)
* **Bug Fixes:** removes duplicate code (ae8f77a)
* **Bug Fixes:** fixes misnamed events causing handlers to fire incorrectly (c3ecd6c)
* **Code Formatting:** moves repeat css (82a5a7c)


### Dependencies

* **Project Maintenance:** update dependency babel-eslint to v10.0.3 (f5860e9)
* **Project Maintenance:** update dependency eslint to v6.2.0 (c77a0a8)
* **Project Maintenance:** update dependency eslint to v6.2.2 (2250808)
* **Project Maintenance:** update dependency eslint-config-airbnb to v18 (baeb423)
* **Project Maintenance:** update dependency eslint-formatter-gitlab to v1.1.0 (dd685d3)
* **Project Maintenance:** update dependency eslint-plugin-react-hooks to v2 (f9f34c5)
* **Project Maintenance:** update dependency sass-loader to v7.2.0 (fa2bab2)
* **Project Maintenance:** update dependency sass-loader to v7.3.1 (bc13da5)
* **Project Maintenance:** update dependency storybook-readme to v5.0.8 (43b63d9)
* **Project Maintenance:** update dependency webpack-cli to v3.3.7 (89b7685)
* **Project Maintenance:** update jest monorepo to v24.9.0 (adb68a4)
* **Project Maintenance:** update node.js (ef476f4)
* **Project Maintenance:** update node.js to v10.16.2 (aea82c1)


### DotLegend

* **Features:** decreases dot size to match typical wheel scale (3b27790)


### DownloadPopup

* **Bug Fixes:** fixes layout (71415f1)
* **Bug Fixes:** design changes (541cbf4)
* **Bug Fixes:** fixes back button (9dce1cd)


### ESLint

* **Tests:** updates linter config to match our existing style (a6d75d4)
* **Code Formatting:** fixes linting errors (e59d632, NEBV-1655)


### FeaturesLegend

* **Features:** adds localized alt/title text to the flag image (d7707e5)
* **Bug Fixes:** replaces >10 flag with a .png to correct scaling/rendering issues (91bffa8)


### FeatureTypesDescription

* **Features:** adds the full name for Instrument types (1f7a386)


### KeywordExplorerButton

* **Features:** updates circle and text alignment (ac7a6c8)
* **Bug Fixes:** centers text vertically, avoids overflow (29d18ad)


### Languages

* **Bug Fixes:** remove descriptions (639879d)


### Lazy

* **Features:** adds conditional check for scrollbar visibility (c4c5634)
* **Code Refactoring:** moves check from render to componentDidMount (26aa5f0)


### LoadingGuide

* **Features:** reduces number of wasted renders from prop reference changes (c964e69, NEBV-1655)
* **Features:** converts all components to React.memo/React.PureComponent (493c49f, NEBV-1655)


### MainInfoBar

* **Features:** adjusts methodology images and sizing to match Trello (a5d469e, NEBV-1667)
* **Features:** adds Pictures in (d317eb1, NEBV-1667)


### Methedology

* **Bug Fixes:** dynamically pull in images (fae6bb8)


### Methodology

* **Features:** make one image external link (89d6825)
* **Features:** adds Keyword Methodology (e9f7b16, NEBV-1667)


### Methodology Box

* **Bug Fixes:** fixes Layout (6a393b7)


### PopupBtn

* **Bug Fixes:** allows buttons to size based on their content (a48c3be)


### RegionCompanies

* **Features:** selects a company and switches modes on click (b04a034)


### RegionSummary

* **Features:** adds description text, updates styles (c70bbf9)
* **Features:** adds focus style for touch devices (e3c102d)
* **Features:** renders the company list as buttons (7fa20ce)
* **Features:** uses the current maximum for the chart's maximum value label (419544e)
* **Features:** updates styling and layout to match the design doc (5178bed)
* **Features:** implements parent component (efa5f59)
* **Bug Fixes:** fixes propType errors (1a3bd36)
* **Tests:** updates tests and snapshots (c3dec85)


### SearchBar

* **Features:** removes some render thrashing from creating new functions (0e27a00, NEBV-1655)
* **Bug Fixes:** sizes the select and input elements dynamically (1c0635e)


### Snapshots

* **Bug Fixes:** updates Snapshots (c90a770)


### src

* **Code Formatting:** moves conditional check and fixes styling (3b1814d)


### src App

* **Bug Fixes:** attempts to add scrollbars (0cef9c6, NEBV-1697)


### Storybook

* **Bug Fixes:** restores correct IP address for GraphQL endpoint (85599e2)


### StreamGraph

* **Features:** adds locale formatting (commas) to values and axis labels (e44515e)


### TotalConditionsLabel

* **Bug Fixes:** removes text clipping (5a71802)


### UnsupportedWarning

* **Features:** updates styles to match the design doc's mobile popup (fb8e179)


### View 2

* **Features:** adds the revised RegionSummary component to the view (75ab443)


### View 3

* **Bug Fixes:** fixes layout issues in the FeaturesMenu and SmallMultiplesLegend on tablet view (82743ca)

# [0.23.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.23.0) (2019-08-06)


### App

* **Features:** provides count data to ConditionDetails (4706113)
* **Features:** adds the updated RegDocs URLs (cb4238c)
* **Features:** links up modal and changes TotalConditions Label (86a332c, NEBV-1705)
* **Features:** implements scrollToMethodology, adds a link to the SuggestedKeywords text (885a407)
* **Features:** adjusts layout and styling of ConditionDetails to maximize space (be28d83)
* **Bug Fixes:** fixes the initial spin being missed when jumping to View 2 via the About button (a4f8e81)
* **Bug Fixes:** fixes ConditionDetails showing while the wheel is spinning (b79ceb1)
* **Bug Fixes:** actually fixes the missing spin when jumping to View 2 via the About button (a86b1bd)
* **Bug Fixes:** shows ConditionDetails during the tutorial even while the wheel is spinning (a815308)
* **Bug Fixes:** the Forward transport button was failing due to an uninitialized variable (62fc950)
* **Tests:** updates snapshots (928914f)
* **Tests:** updates snapshots (be15153)
* **Tests:** updates snapshots (0697742)
* **Tests:** updates tests, stories, and snapshots (59433d9)
* **Code Formatting:** updates snapshots, removes commented code (80cb1f4)
* **Code Formatting:** updates snapshots, removes commented code (4ba131c)
* **Code Refactoring:** moves CountBubble from GreyPipe to its own public component (e3f966d)


### BrowseBy

* **Bug Fixes:** fixes look in Firefox (b68fd72)


### BrowseBy, CompanyPopup, GreyPipe, RegDocs, Styles

* **Code Formatting:** fixes spacing (2c94a34)


### ConditionDetails

* **Features:** updates header's title in Location mode (6a7c3dd)
* **Features:** renders count bubbles, updates styles and layout (b56cf92)
* **Code Refactoring:** makes ProjectHeader a functional component (efd9509)


### CountBubble

* **Features:** updates styling, adds check to pluralize if count = 0 (7adc974)


### Dependencies

* **Project Maintenance:** update node.js to v10.16.1 (700d63e)
* **Project Maintenance:** updates related apollo dependencies (0e7d630)


### FeaturesLegend

* **Bug Fixes:** replaces div with triangular border with SVG (9a958b6)
* **Bug Fixes:** updates title styling to match the design doc (6fee2aa)


### FeatureTypesDescription

* **Bug Fixes:** fixes formatting (08c4f47, NEBV-1690)


### GreyPipe

* **Features:** tweaks placement of count bubbles as per new design (4a20f8f)
* **Tests:** updates snapshots, adds story and tests for count bubbles (48dec01)


### GreyPipe, BrowseBy, RegDocs, CompanyPopup, WheelList

* **Bug Fixes:** fixes Safari CSS (8ef1679, NEBV-1709)


### i18n

* **Features:** converts all FormattedMessage components with function body to AdvancedFormattedMessage (510418c, NEBV-1655)
* **Tests:** fixes tests that broke with AdvancedFormattedMessage (4e2c56e, NEBV-1655)


### LoadingGuide

* **Features:** fixes PR concerns (56b23f8, NEBV-1655)
* **Features:** improves styling and positioning while loading (e9d3e1a, NEBV-1655)
* **Features:** reorganizes styles for grid (652a19a, NEBV-1655)
* **Features:** initial integration with React.lazy and queries (c4fb11e, NEBV-1655)
* **Features:** initial integration of LoadingGuide with webpack (f71f4b4)


### LocationWheelMinimap

* **Features:** delays loading topojson until it is needed (42a1cde, NEBV-1655)
* **Bug Fixes:** fixes the NWT map not being rendered (cc337b8)


### MainInfoBar

* **Features:** updates About text's styling to match the NEB's storyboard (9970f5e)
* **Bug Fixes:** updates About text formatting to match the NEB's text (60f55a7)
* **Tests:** updates snapshots and disables prop errors (bfaecb9)


### PopupBtn

* **Features:** accepts text as children instead of a prop (515184e, NEBV-1655)
* **Bug Fixes:** corrects link styles being overridden by the WET template (387c872)


### RegDocs

* **Bug Fixes:** removes unnecessary key attributes (a73526c)


### RegDocsPopup

* **Features:** relocates url import, updates tests/stories (2617c6a)


### SearchBar

* **Bug Fixes:** updates keyword list styling to match the design doc (95f2d4b)


### Snapshots

* **Bug Fixes:** update snapshots (0b3cdcd)


### Storybook

* **Tests:** updates snapshot that was missed during merges (8b52d65)


### StreamGraph

* **Bug Fixes:** fixes issues with click detection in Safari (7b7e4df)


### Styles

* **Code Refactoring:** uses mixins (487ebc9)


### TotalConditions, View2

* **Bug Fixes:** fixes tests and stories (a5debb7)


### TotalConditionsPopup

* **Features:** adds Safari Specific CSS (109059e)
* **Features:** adds TotalConditions Popup Component (aa5d132, NEBV-1705)


### View 2

* **Bug Fixes:** updates styles in Location mode to keep grey pipe connected properly (43b485b)
* **Bug Fixes:** fixes wheel list not being centered in the wheel (e324a37)
* **Code Formatting:** changed positioning (ae6f7a2)


### BREAKING CHANGES

* **App:** Added Prop to view 2

## [0.22.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.22.1) (2019-07-29)


### App

* **Features:** deselects the current keyword when the Guide is dragged (100c055)
* **Features:** selects a random wheel item when jumping to View 2 if none is selected (cabd062)
* **Bug Fixes:** updates search query when keyword is deselected (f36b98d)
* **Bug Fixes:** avoids glitches when clicking the GuideTransport just after transition has started (d8136b2)
* **Bug Fixes:** fixes Guide transport's Play not responding, BrowseBy being clickable when hidden (fec5a62)
* **Code Refactoring:** moves the initial company and location wheel queries up to the App (14ff3bd)
* **Code Refactoring:** removes redundant method (a5af0aa)


### ConditionDetails

* **Features:** adds Condition Number to details content (698ef02, NEBV-1684)


### Dependencies

* **Project Maintenance:** update dependency conventional-changelog-cli to v2.0.23 (c6aa2ed)


### Wheel

* **Bug Fixes:** fixes company flag collision logic (55a8d18)

# [0.22.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.22.0) (2019-07-29)


### App

* **Features:** updates French structure for About text to match English changes. (c8ddb6d)
* **Features:** updates the selection using search results (ec09cfe)
* **Bug Fixes:** ensures that ConditionDetails' list auto-scrolls when changed (63c5343)
* **Bug Fixes:** uses an object for search result lookups; wrong projects were being filtered (d3dd6f3)
* **Bug Fixes:** updates Snapshots (e61131b)
* **Bug Fixes:** updates search IDs when selecting a keyword (866b06d)
* **Tests:** updates tests and mock data (776bd2f)
* **Code Formatting:** removes query and wrapper that are no longer needed (9cb12ff)
* **Code Refactoring:** extracts randomArrayValue to a utility (63b23a4)


### ConditionDetails

* **Features:** adjusts spacing in ProjectHeader when no project is selected (ab14b71, NEBV-1671)
* **Bug Fixes:** fixes prop type warnings (1e3ac90)
* **Bug Fixes:** fixes ellipses on ProjectHeader (5571974, NEBV-1671)


### ConditionDetails/Content

* **Bug Fixes:** adds no render if null (44eb5cc, NEBV-1675)


### Content

* **Bug Fixes:** changes conditionDetails Format (6519f3a)
* **Code Formatting:** add comma for formatting (6ae6347)
* **Code Formatting:** makes logic simpler and removes warning (a500c0d)


### Dependencies

* **Bug Fixes:** update dependency victory to v32 (549c669)
* **Tests:** updates snapshots for Victory (6833d1f)
* **Project Maintenance:** update dependency mini-css-extract-plugin to v0.8.0 (3051b03)
* **Project Maintenance:** update dependency storybook-readme to v5 (46b5985)
* **Project Maintenance:** update dependency webpack to v4.38.0 (3617ddf)
* **Project Maintenance:** updates docs to use storybook-readme@5 syntax (f0d7eaa)


### ESLint

* **Code Formatting:** fixes linting errors (2d849da)


### FeaturesLegend

* **Bug Fixes:** fixes ellipsis and descenders being clipped (d973107, NEBV-1671)


### i18n

* **Features:** fixes double-colon for the view 1 header's subtitle (40f5079, NEBV-1671)
* **Features:** updates French translations with Adam's comments (79f1925, NEBV-1671)
* **Features:** updates all translations to match latest provided by NEB (32525be, NEBV-1671)
* **Features:** removes unused entries related to old data types from translations, constants, and mock/ (814c63d, NEBV-1671)
* **Features:** updates About box email links to support French (3312373, NEBV-1671)


### List, GuideDetail

* **Bug Fixes:** fixes wet template style overwrites (ca89186, NEBV-1673)


### MainInfoBar

* **Bug Fixes:** fixes duplicate text, updates styling to match design doc (3dcbdcd)


### Modal

* **Bug Fixes:** fixes ability to close modal dialogs (b7ca883, NEBV-1672)


### Search

* **Bug Fixes:** fixes enter in include/exclude causing WET to reload page (d9674a7)
* **Bug Fixes:** reimplements SuggestedKeywordPopout sort order (055a0e7)


### SearchBar

* **Features:** watches for changes to selectedYears from Redux (6fb53bd)
* **Bug Fixes:** fixes glitches when dragging the filter range (430b65b)
* **Tests:** updates snapshots and tests (b2bbb01)
* **Tests:** updates tests to match rewrite of props and behavior (ed82576)


### Snapshots

* **Tests:** updates storybook snapshots (3a0fe91)


### storybook-readme

* **Tests:** fixes mock for storybook-readme to work with v5.0.5 (3b80e4e)


### Utilities

* **Bug Fixes:** removes trailing comma on no region (39cdce5, NEBV-1677)


### View 2

* **Bug Fixes:** uses the dataset's year range for initial filter query (6cd7d60)


### wheel

* **Bug Fixes:** makes ring stay in place (a125c77, NEBV-1669)

## [0.21.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.21.1) (2019-07-17)


### ConditionDetails

* **Bug Fixes:** fix crash when text is null (a4a66ab)
* **Bug Fixes:** fixes overlap with wheel (469893a)


### i18n

* **Bug Fixes:** fixes bug with French not loading strings (0920e51)


### Wheel

* **Bug Fixes:** fixes bug with flags not appearing when toggling modes (017a972)

# [0.21.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.21.0) (2019-07-17)


### app

* **Bug Fixes:** moves concat (30ccc37)
* **Code Formatting:** adds missing comments (d11ea00)


### App

* **Features:** adds a lookup table for regionIds in search results (ad6dab5)
* **Features:** sets the selected condition from View 1, locates it in ConditionDetails (14438ea)
* **Features:** sends a search query when params change, updates the store with results (49ba8f7)
* **Features:** adds search results to Redux (94a6238)
* **Features:** adds error and empty search checking to the search queries (49e00ac)
* **Features:** sends a search query when params change, updates the store with results (0920c5f)
* **Features:** sends a search query when params change, updates the store with results (1f0cd05)
* **Features:** adds search results to Redux (8d0e05b)
* **Features:** adds selected instrument ID to Redux (7f7daef)
* **Features:** removes unused props from views (d70a3d4)
* **Features:** refines updateSelection logic and queries (a16959b, NEBV-1596)
* **Features:** adds function to set the app state from an instrument ID (0179bb7)
* **Features:** updates the selection tree from ConditionDetails, batches updates (5f8cd09)
* **Features:** adds queries and processing for trees by Project and Company, adds region IDs (f18f237)
* **Features:** uses callbacks from App for View 2's setSelected functions (52ea2ba)
* **Features:** adds getSelectionFromRegion, uses browseBy for status checks (f083879)
* **Features:** reduces duplicate code for updateSelection logic (92f2fe7, NEBV-1596)
* **Features:** adds regionIDLookup (cdba020, NEBV-1395)
* **Features:** adds LoadingGuide component (c19d41e)
* **Features:** adds basic error checking to selection logic, keeps selections if possible (82e64e1)
* **Features:** moves allKeywords query up to the App level (a5d3c1e)
* **Features:** adds basic error handling to selection queries (deeaed8)
* **Features:** adds LoadingGuide component (b8bea14)
* **Features:** adds error and empty search checking to the search queries (5d2d076)
* **Features:** adds french text to view 2 (499ee17, NEBV-1649)
* **Features:** sends a search query when params change, updates the store with results (18f8863)
* **Features:** adds search results to Redux (9190bf4)
* **Features:** adds search results to Redux (d90da5b)
* **Features:** sends a search query when params change, updates the store with results (a471963)
* **Features:** sets the selected condition from View 1, locates it in ConditionDetails (b81dd83)
* **Features:** adds basic error handling to selection queries (8ed6fea)
* **Features:** adds basic error checking to selection logic, keeps selections if possible (836310a)
* **Features:** adds selected instrument ID to Redux (64fff54)
* **Features:** removes unused props from views (66d22e8)
* **Features:** adds error and empty search checking to the search queries (eeb5119)
* **Features:** adds getSelectionFromRegion, uses browseBy for status checks (a4239b8)
* **Features:** uses callbacks from App for View 2's setSelected functions (fa4ff7f)
* **Features:** adds queries and processing for trees by Project and Company, adds region IDs (b00086f)
* **Features:** adds function to set the app state from an instrument ID (9f16951)
* **Features:** updates the selection tree from ConditionDetails, batches updates (380097a)
* **Bug Fixes:** keeps ConditionDetails from stealing the wheel's pointer events (6f97f03)
* **Bug Fixes:** applies requested changes (73ef73d)
* **Bug Fixes:** moves trailing :s in locale text to JSX (29797e1)
* **Bug Fixes:** updates snapshots, fixes rebase issues (929420a)
* **Bug Fixes:** updates snapshots (b62ddc2)
* **Bug Fixes:** fixes ConditionDetails glitch when going V3->2 (c443235)
* **Bug Fixes:** hides the DotLegend during the intro and tutorial (5a6d54b)
* **Bug Fixes:** merges develop, fixes conflicts (47a12ca)
* **Bug Fixes:** updates snapshots (6c78a39, NEBV-1660)
* **Bug Fixes:** merges develop, fixes conflicts (f86286e)
* **Bug Fixes:** returns a promise instead of immediate value (eb76920)
* **Bug Fixes:** removes circular dependency (7e0ca85)
* **Bug Fixes:** updates snapshots (aa8ee75)
* **Bug Fixes:** renames "prefix" field to "instrument" to match client data (b72d87a)
* **Bug Fixes:** returns a promise instead of immediate value (d9bae34)
* **Bug Fixes:** removes console statements (29b44f2)
* **Bug Fixes:** fixes minor style issues (c46fa91)
* **Tests:** updates snapshots (23a3f67)
* **Tests:** updates snapshots (111d484)
* **Code Formatting:** adds comments, fixes linting errors (ce739ad)
* **Code Formatting:** adds comments, fixes linting errors (4aaaa23)
* **Code Formatting:** removes commented code (a041b55)
* **Code Refactoring:** adds prop suggestedKeywords to view 2 (3d84336)
* **Code Refactoring:** changes text as requested by NEB (3788c4f)
* **Code Refactoring:** extracts joinJsxArray from the search bar to a separate module (13a8a95)
* **Code Refactoring:** extracts selection logic to a separate module (3e69614)
* **Code Refactoring:** extracts selection logic to a separate module (e50aaf4)
* **Code Refactoring:** finishes extracting selection logic (776897e)
* **Code Refactoring:** finishes extracting selection logic (24abdb7)
* **Code Refactoring:** makes updateSearch a normal class method (49802ed)
* **Code Refactoring:** removes unnecessay assignment (1841be7)


### App, SearchBar, HighlightSummary

* **Bug Fixes:** adds requested changes and merges develop (9799ada)


### App, View2, FilterContent

* **Bug Fixes:** fixes year range bug (f3c1402, NEBV-1536)


### App, View2, SearchBar

* **Code Refactoring:** adds missing categories (69e68d3, NEBV-1562)


### BarContainer

* **Features:** adds a transparent background so the entire chart catches mouse events (5e17143)


### ConditionDetails

* **Features:** highlights the list of matched keywords (b6ede7e)
* **Bug Fixes:** fixes tests and mock data, updates snapshots (d69095a)
* **Bug Fixes:** sets the header's width dynamically to allow for More button (400d1a6)
* **Bug Fixes:** fixes tests and mock data, updates snapshots (c253484)
* **Code Formatting:** removes redundant function call (d6f97a9)
* **Code Formatting:** removes redundant function call (4d1d0aa)


### ConditionDetails/ProjectHeader

* **Code Refactoring:** fixes width for projects (aba4621, NEBV-1651)


### ConditionExplorer

* **Bug Fixes:** fixes bug with physics not pausing in some situations (92de7c6, NEBV-1662)
* **Bug Fixes:** adds check for targetScale when closing the Guide (da2f1ff)
* **Bug Fixes:** fixes "invisible circle" behavior (2fb35a4)
* **Bug Fixes:** prevents GuideDetail's state from getting out of sync (e01a2f0)
* **Code Formatting:** extracts guide opening logic to a new method (ad22b7c)


### ConditionList

* **Bug Fixes:** checks for overflow before attempting to scroll (5eec51e)


### Dependencies

* **Bug Fixes:** update dependency deepmerge to v4 (eede4eb)
* **Project Maintenance:** update babel monorepo to v7.5.0 (8db5c74)
* **Project Maintenance:** update babel monorepo to v7.5.2 (bab71a6)
* **Project Maintenance:** update babel monorepo to v7.5.4 (0515d71)
* **Project Maintenance:** update dependency @babel/plugin-proposal-object-rest-spread to v7.5.1 (7ca514c)
* **Project Maintenance:** update dependency eslint-config-airbnb to v17.1.1 (492d47d)
* **Project Maintenance:** update dependency eslint-plugin-jsx-a11y to v6.2.3 (02fc401)
* **Project Maintenance:** update dependency eslint-plugin-react to v7.14.2 (8532676)
* **Project Maintenance:** update dependency eslint-plugin-react-hooks to v1.6.1 (dc13bce)
* **Project Maintenance:** update dependency postcss-preset-env to v6.7.0 (bb17503)
* **Project Maintenance:** update dependency webpack to v4.35.2 (e82831d)
* **Project Maintenance:** update dependency webpack to v4.35.3 (0117b99)
* **Project Maintenance:** update dependency webpack-cli to v3.3.6 (7124d25)


### ESLint

* **Bug Fixes:** fixes additional PR and lint concerns (f0b30a8)
* **Tests:** fixes linting errors (c721f69)


### FeaturesLegend

* **Features:** adds support for DisplayOrder (6cb5689)
* **Bug Fixes:** fixes positioning of legend items being affected by text length (c31361d)


### FeatureTypesDescription

* **Features:** adds support for DisplayOrder (b853bbf)


### GraphQL

* **Features:** moves 'all' keyword category to server (f530b77, NEBV-1659)
* **Features:** converts view 3 to use aggregatedCount format (047de28)
* **Features:** converts interface to use aggregatedCount format (2e12cec)
* **Features:** initial conversion to new aggregatedCount format (c81625b)
* **Features:** pulls instrument display order from query (e98e7c9)
* **Features:** rename "prefix" to "instrument" (2fd9c04)
* **Bug Fixes:** fixes PR concerns (b40e3df)
* **Code Formatting:** fixes linting errors (a096d43)


### GreyPipe

* **Features:** adds stories for edge cases (d9e46ac)
* **Features:** accounts for single and large counts in count bubbles (e11d4a5)
* **Features:** adds bubbles displaying project, instrument, and condition counts (1b05a67)
* **Code Refactoring:** uses a new query field for instrument count per project (4a693c7)


### handleInteraction

* **Features:** passes the incoming React event as a final arg to its callback (4c8e000)
* **Features:** passes the incoming React event as a final arg to its callback (f761fc5)
* **Features:** passes the incoming React event as a final arg to its callback (860d63c)
* **Features:** passes the incoming React event as a final arg to its callback (bf1b65a)


### HighlightSummary

* **Bug Fixes:** fixes tests and snapshots (dd06b4e)
* **Tests:** changes test (b7292e0)


### KeywordList

* **Bug Fixes:** accidental negative (4feb44d)


### LoadingGuide

* **Features:** adds documentation and a basic spec (b4503c3)
* **Features:** adds documentation and a basic spec (b4399a5)
* **Bug Fixes:** fixes double-set of timeout (ed02ec5)
* **Bug Fixes:** merges remote, fixes conflicts (dc4897d)
* **Bug Fixes:** updates snapshots, adds missing class name (5fa64a4)
* **Bug Fixes:** updates snapshots, adds missing class name (bc69725)
* **Code Refactoring:** sets the timer using appropriate lifecycle methods (11cfba7)


### LocationRay

* **Bug Fixes:** makes highlighting slightly shorter (5b338d4)


### LocationWheelMinimap

* **Features:** adjusts position of minimap with new search width (336a12f)
* **Features:** adds translation support for province names (e1f3c73)
* **Features:** adjusts styling of province name (19ec713)
* **Bug Fixes:** checks for valid region/province data before rendering (bc87bd4)
* **Bug Fixes:** fixes map not appearing on refresh until region changed (9777a05)
* **Bug Fixes:** fixes crash for "No associated region" map (9da1a78)


### MainInfoBar

* **Tests:** fixes failing test due to extra args (99bb08e)


### npm

* **Project Maintenance:** fixes version file generation (b2e9f2c)


### ProjectDot

* **Features:** adds a stroke to increase the hitbox size (bf60cc3)
* **Bug Fixes:** fixes unit error in dot's stroke width (526d4d4)


### ProjectMenu

* **Features:** adds support for DisplayOrder (244ae2f)
* **Bug Fixes:** keeps component from forcing constant rerenders if it has no data (54e88f0)
* **Bug Fixes:** keeps component from forcing constant rerenders if it has no data (328c3e1)
* **Code Formatting:** removes commented code (a197380)
* **Code Formatting:** removes commented code (e97aa78)


### Search Bar

* **Features:** adds keyword categories from query (2e02110, NEBV-1650)
* **Code Refactoring:** fixes the stories (a1c17e1)


### SearchBar

* **Features:** uses localized strings for Inc/Dec/None (a95b2af)
* **Features:** condenses the highlight summary's status listing (6ad6863)
* **Features:** adds highlighting to keywords in the search summary (756d000)
* **Features:** allows pressing Enter in inputs to add keywords (b03bc25)
* **Bug Fixes:** restores tests that were accidentally deleted (a1cfc60)
* **Code Refactoring:** changes shape from array to obj (b20b25f)
* **Code Refactoring:** tweaks where strings are split to allow proper formatting (747d7a1)


### SearchBar/HighlightSummary

* **Features:** adds statuses section to description (d4cd5d0, NEBV-1477)
* **Bug Fixes:** adds commas (772d2ba)


### snapshots

* **Bug Fixes:** updates snapshots (81625ed)


### Snapshots

* **Bug Fixes:** updates snapshots and tests (10614e2)
* **Bug Fixes:** updates snapshots (e0be74a)


### SnapShots

* **Code Refactoring:** updates snapshots (49e349b)


### Storybook

* **Tests:** updates snapshots (706c829)


### StreamGraph

* **Features:** inverts streams to match SmallMultiplesLegend (26d2507)


### SuggestedKeywordsPopout

* **Features:** adds ellipses when selected (86f3dd0)
* **Bug Fixes:** fixes wet styles overriding (ace468b)
* **Code Formatting:** removes comments (1032b11)
* **Code Refactoring:** changes shape of keywords prop (d1d458a)
* **Code Refactoring:** css styling fixes (e59860d)
* **Code Refactoring:** fixes layout for keywords (6a65449)


### view 2

* **Bug Fixes:** adds compatability with connected variant (1079d11)


### View 2

* **Features:** wraps search actions in order to trigger a query (354c366)
* **Features:** sets the selected project when clicking a project dot (bd4d130)
* **Features:** sets the selected project when clicking a project dot (aa0906d)
* **Features:** adds loading state to Grey Pipe's count bubbles (d5186d1)
* **Features:** passes project counts into the Grey Pipe (bf1c30e)
* **Features:** wraps search actions in order to trigger a query (4cf6e45)
* **Features:** wraps search actions in order to trigger a query (d456476)
* **Features:** sets the selected project when clicking a project dot (05f4ad7)
* **Features:** wraps search actions in order to trigger a query (cba7dc7)
* **Features:** adds the dot legend in Company mode (b08ecd7)
* **Features:** sets the selected project when clicking a project dot (175b124)
* **Bug Fixes:** avoids unnecessary renders of the Grey Pipe (7640104)
* **Bug Fixes:** prevents search tabs from wrapping if French + Location (de0872f)
* **Code Formatting:** removes commented code (371edd4)
* **Code Formatting:** removes commented code (abdb636)
* **Code Formatting:** removes commented code (577b7c4)


### View 3

* **Code Formatting:** capitalization (08fd238)


### View2GraphQL

* **Features:** adds a filter state change on initial render (ed9723c)


### ViewOne

* **Features:** fixes PR concerns (0c86c16)


### ViewThree

* **Features:** adds company name to the condition details extension on view 3 (e3499e3)
* **Code Refactoring:** changes minimal fixes in the company name (ab3fb96)
* **Code Refactoring:** fixes lint errors and adds title attribute (f038629)
* **Project Maintenance:** removes unused mock data and proptypes (610a596)


### Wheel

* **Features:** removes commented code (f2fc627)
* **Features:** adds dividing lines between provinces in Location mode (acc9775)
* **Features:** updates the wheel on new search results, extracts code for readability (094fd86)
* **Features:** reduce hitbox of company flag so it doesn't overlap with other companies (4ef36bf)
* **Features:** updates the wheel on new search results, extracts code for readability (b989180)
* **Features:** updates the wheel on new search results, extracts code for readability (4df12aa)
* **Features:** updates the wheel on new search results, extracts code for readability (d7d1b9c)
* **Bug Fixes:** adjusts positioning of Pull To Spin text to avoid clipping with the grey pipe (3d8062a)
* **Bug Fixes:** removes test code (56d68ea)
* **Bug Fixes:** selects the company when clicking an empty area of the flag's hitbox (3157aaa)
* **Bug Fixes:** selects the company when clicking an empty area of the flag's hitbox (d26f9eb)
* **Bug Fixes:** reverses the flag's stem to maintain project order (bd21b62)
* **Bug Fixes:** clips list text to avoid overlapping with the wheel (76c2237)
* **Bug Fixes:** selects the company when clicking an empty area of the flag's hitbox (93e32a9)
* **Bug Fixes:** reverses the flag's stem to maintain project order (9deb9ea)
* **Bug Fixes:** selects the company when clicking an empty area of the flag's hitbox (1111907)
* **Bug Fixes:** reverses the flag's stem to maintain project order (4cc60f8)
* **Code Formatting:** adds comments (eb077d7)
* **Code Formatting:** adds comments (f75ae68)
* **Code Formatting:** adds comments (4cbbc95)
* **Code Formatting:** removes unused prop (1a5b376)


### WheelList

* **Code Refactoring:** pulls up shared styles (2066526)


### WheelRay

* **Features:** connecting mock data to location wheel (a22dea6)
* **Code Formatting:** removes unnecessary comments (44b22ec)


### BREAKING CHANGES

* **App, View2, FilterContent:** Added Prop to View 2
* **App:** additional prop
* **View2GraphQL:** Cycling imports between App and View2GQL

## [0.20.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.20.1) (2019-06-27)


### App

* **Features:** uses RegDocs URL as per NEB + document ID (d98333e)
* **Bug Fixes:** adds missing instrument statuses to locale text (e56a078)
* **Bug Fixes:** adds "THE" (d555574)
* **Code Refactoring:** includes documentId when formatting instruments (c745164)


### GraphQL

* **Features:** adds handleQueryError to all queries (3b02149)
* **Features:** captures more information from errors (6f9f7e7)
* **Features:** catch GraphQL errors in the ErrorBoundary (0e8a3dc)
* **Bug Fixes:** fixes crash when non-apollo error is thrown (ab64298)
* **Bug Fixes:** fixes incorrect variable name for handleQueryError (ad4ccc5)

# [0.20.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.20.0) (2019-06-26)


### App

* **Bug Fixes:** prevents crashing if search props are null, extracts processing logic (c486f95)
* **Bug Fixes:** moves ErrorBoundary inside IntlProvider (164b71c)
* **Bug Fixes:** fixes broken tests and stories, updates snapshots (e31ba15)
* **Bug Fixes:** fixes heading styles that were coming from the WET template (2d339f4)
* **Bug Fixes:** uses new query field for projects' condition counts (1016888)


### App, View 2, Company Ray

* **Features:** adds relevant search highlighting (182eadf, NEBV-1393)


### App, View 2, Wheel, Ray, Company Flag

* **Code Refactoring:** cleaned up and made sure filteredProjects Prop was (2b87b9d)


### App, View2

* **Code Refactoring:** moved data and renamed variables (a3ae926)


### App, View2, Wheel, WheelRay, CompanyFlag

* **Features:** adds filter (3806877)
* **Code Refactoring:** optimized dot efficiency (a337897)


### CompanyFlag

* **Code Refactoring:** fixed tests (1d8c39d, NEBV-1394)


### ConditionDetails

* **Bug Fixes:** works with instrument (de23de4)
* **Code Refactoring:** optimized Loop (66aa305)
* **Code Refactoring:** removed unnecessary dependency (d3ae230)


### ConditionDetails, Content

* **Features:** adds keyword list (aea8216)
* **Features:** adds search highlighting (58a5ef2, NEBV-1401)


### ConditionDetails/Content

* **Bug Fixes:** adds all case highlighting (0d0b3d0)
* **Code Refactoring:** optimized (8b32803)


### Dependencies

* **Project Maintenance:** update dependency eslint to v6.0.1 (fc7e805)
* **Project Maintenance:** update dependency eslint-plugin-import to v2.18.0 (624e82c)
* **Project Maintenance:** update dependency url-loader to v2.0.1 (4eb93f2)
* **Project Maintenance:** update dependency webpack to v4.35.0 (7e66e1b)
* **Project Maintenance:** update storybook monorepo to v5.1.9 (56c2c44)


### Ellipses everywhere

* **Features:** adds title attributes to the elemen (b3be484, NEBV-1591)


### ErrorBoundary

* **Features:** adds a story for the component (0a75ef1)
* **Bug Fixes:** replaces console.error after the story is run (e197195)


### ESLint

* **Bug Fixes:** updates .eslintrc syntax to ESLint 6.x (9fb5d70)


### GraphQL

* **Features:** prepares for DisplayOrder from query (6f76c9c)
* **Features:** ComposedQuery waits on multiple queries before rendering (4ebed19)
* **Features:** optimizing and cleaning up queries (b5774a0)
* **Features:** partial optimization of ConditionDetails (1a2e6a9)


### GreyPipe

* **Bug Fixes:** stops pipe from stealing mouse events (8e19902)


### LocationWheelMinimap/Wheel

* **Features:** adds rough province name to LocationWheelMinimap, fixes display of (1a46d5a)


### mockData

* **Bug Fixes:** removed hard coding (be1d564)


### mockData, App

* **Code Refactoring:** changed case of ID (3d4ffb9)


### Project Dot, Project Chart

* **Code Refactoring:** update css colour rules (adc1e87)


### ProjectChardt

* **Bug Fixes:** fixed tests (1abfcb0)


### ProjectDot

* **Bug Fixes:** fixes tests (ba28e19)
* **Code Refactoring:** updates filtered and relevant colours (bc7a81c)


### ProjectMenu

* **Bug Fixes:** fixes FormattedMessage errors when in loading state (88392d9)
* **Tests:** fixes project mock data missing numberOfConditions (614994e)


### ProjectMenu, ProjectChart

* **Features:** adds Story Functionality (0bbcd80)
* **Features:** adds color changes (5fefb73, NEBV-1397, NEBV-1398)


### Tests

* **Bug Fixes:** updated Snapshots (385bbcc)


### View 2

* **Bug Fixes:** fixes title attributes on FeatureFlags showing intl IDs (e1caddb)


### View2

* **Features:** added Mock data props for story (4761afb)


### View2, ProjectMenu, ProjectChart, Wheel, WheelRay, CompanyFlag

* **Code Refactoring:** renamed relevantProjects a (27f7b67)


### Wheel

* **Bug Fixes:** allows mouse hover to show the title attribute (cd38acf)
* **Bug Fixes:** updates mock data and stories to use new filter/search structure (03032e2)
* **Code Formatting:** adds curly braces for consistency (eddf3ea)
* **Code Formatting:** fixes prop error in story (fd7f1f4)


### Whole App

* **Features:** added component to display error when app crashes (b624217, NEBV-1582)


### BREAKING CHANGES

* **App, View 2, Company Ray:** Added additional Prop to view 2, wheel, wheelRay, CompanyFlag
* **App, View2, Wheel, WheelRay, CompanyFlag:** Added an extra prop to every component down from view 2 (inclusive)
* **LocationWheelMinimap/Wheel:** Changes to the minimap props

## [0.19.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.19.1) (2019-06-24)


### ConditionDetails

* **Bug Fixes:** hides condition list during intro transitions (5294c58)

# [0.19.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.19.0) (2019-06-21)


### App

* **Features:** shows the selected condition in the condition list (54091df)
* **Features:** adds a shadow to the animated keyword (e608901)
* **Features:** resets browsing mode and selected keyword when resetting to view 1 (673b833)
* **Features:** moves "last updated" date up to intro text, uses existing query (afe2347)
* **Features:** hides the physics keyword when animated keyword is shown (b5b98d4)
* **Features:** animated keyword matches the angle of the physics keyword (d7792ab)
* **Features:** syns initial keyword position to the physics keyword (d7b93e9)
* **Features:** renders and animates the keyword (position at either end is still rough) (8fc4bb8)
* **Features:** gives the App a reference to the selected keyword (e8b1edf)
* **Features:** hides "Associated Companies" until the end of the tutorial (1665b57)
* **Features:** shows the company name and grey pipe earlier (e59e66f)
* **Features:** hides the keyword button's circle until the Guide gets there (6b586dc)
* **Bug Fixes:** keeps the Selected Company header from disappearing (7a6ed70)
* **Tests:** updates snapshots (3620f5b)
* **Code Formatting:** tidies refactored code (3201c7d)
* **Code Refactoring:** begins extracting shared functionality from Guide/keyword sync logic (d766697)
* **Code Refactoring:** finishes refactoring Guide and keyword sync logic (2c6acaf)
* **Code Refactoring:** fixes conditional querying based on values (3432f75)


### App/ConditionDetails

* **Code Refactoring:** fixes render conditional on app with no data (initial implementation (d740297)
* **Code Refactoring:** fixes rendering issue with undefined conditions (ab1a512)


### Condition detail

* **Bug Fixes:** fixes `Error: "Failed to execute 'close' on dialog` (d2dea8d, NEBV-1435)
* **Bug Fixes:** fixes Reg Doc URL (2806daf, NEBV-1435)


### Condition Details

* **Features:** added popups to the company and inturment number in the condition detail se (a477448, NEBV-1435)


### ConditionDetails

* **Features:** fixes instruments display and details formatting/tests (7a3c0bb)
* **Features:** adds scroll to condition details (dd69162)
* **Bug Fixes:** fixes name length display overflow (06b1555)
* **Code Refactoring:** adds support for multiple themes on details and other Fixes (c81d235)
* **Code Refactoring:** fixes further PR comments (0b32728)
* **Code Refactoring:** fixes tests and snapshots (ffba8ed)
* **Code Refactoring:** fixes tests to match new data structure (639f974)
* **Code Refactoring:** sets ids instead of indexes on redux for other components to use (6663b1a)


### ConditionExplorer

* **Features:** hides messages while the guide is being dragged (96db20f)
* **Features:** reimplements clamping of keyword velocities (eb89571)
* **Features:** prevents the selected keyword from reverting (5a9afbe)
* **Features:** adds messages and multiline text rendering (ff70ca5)
* **Features:** displays rotating guide messages (56731aa)
* **Features:** adds text to the guide (f1319bd)
* **Features:** makes Guide unclickable if the pink outline isn't ready (ff41639)
* **Features:** adds curved text to the GuideDetail (efd55d8)
* **Features:** updates GuideDetail styling (2007d5b)
* **Features:** adds a timer before redisplaying messages, adjusts expanded Guide styling (5534734)
* **Features:** starts a timer before showing text after a drag (0c9332d)
* **Bug Fixes:** removes/swallows errors from debug messages (52051b2)
* **Bug Fixes:** adds missing key attribute (65adc65)
* **Bug Fixes:** fixes extra blue circle and List button positioning in Guide (aa48e25)
* **Bug Fixes:** uses velocity when manually moving bodies to allow proper collisions (7bb06f5)
* **Bug Fixes:** directly sets the outline position to avoid jittering (7a301a0)
* **Code Formatting:** flattens unnecessary CSS calc (8ca4d3f)
* **Code Formatting:** removes unused code (c1b1349)
* **Code Formatting:** removes unused code (87fe28e)
* **Code Refactoring:** moves Outline-specific logic out of Body (d72a05d)
* **Code Refactoring:** replaces redundant map+filter with reduce (94bd731)


### CondtionExplorer

* **Code Formatting:** reduces size of the curved text's parent svg (8521049)


### Dependencies

* **Project Maintenance:** enables renovate automerge for pinning dependency versions (0883869)
* **Project Maintenance:** pin dependency http-proxy-middleware to 0.19.1 (0898711)
* **Project Maintenance:** update dependency babel-eslint to v10.0.2 (96da766)
* **Project Maintenance:** update dependency webpack to v4.34.0 (509a922)
* **Project Maintenance:** update storybook monorepo to v5.1.8 (9d0f5a3)


### pulltospin

* **Features:** distinguish between drag and click (bb643af)


### PulltoSpin

* **Features:** animations are now as expected (ff1df8b)


### PullToSpin

* **Features:** adds drag and click interaction (c7a26d8, NEBV-1560)
* **Features:** have both animations mostly working now (5188f04)
* **Features:** added spin on drag (a7f52c2, NEBV-1560)
* **Code Formatting:** applied style changes and moved functions (cd922da)
* **Code Formatting:** got rid of comments (e904d22)
* **Code Formatting:** moved noop (595c68e)


### RegDocsPopup

* **Bug Fixes:** fixes crash when using data while query is loading (3873bcc)
* **Bug Fixes:** fixes PR concerns (0989138)


### ShortcutInfoBar

* **Features:** makes text clickable (37217e9)


### Storybook

* **Bug Fixes:** fixes bug with stateToURLMiddleware overwriting storybook ID (1bce307)


### View 1

* **Code Refactoring:** processes date values using string methods for readability (1bd201a)


### View 3

* **Features:** updates and standardizes titles (94bcd21)


### Webpack

* **Project Maintenance:** removes unused declarations from webpack config (5b388c7)


### WET

* **Bug Fixes:** fixes padding of main container in WET storybook (f912c8b)
* **Documentation:** adds WET template to storybook, replacing dev-server (372122d)
* **Project Maintenance:** fixes linting errors caused by WET in storybook (36282a3)
* **Project Maintenance:** removes dev-server specific changes (eda89ea)
* **Project Maintenance:** reorganizes and removes unused files (5f37a37)

# [0.18.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.18.0) (2019-06-13)


### App

* **Features:** syncs the tutorial Guide to the KeywordExplorerButton's circle (0a9ac22)
* **Features:** removes hash table for condition text lengths (93fa249)
* **Features:** sync tutorial Guide's starting position to physics Guide (1cbbadd)
* **Features:** tidies up unused/commented code (d68e448)
* **Features:** adjusts tutorial Guide styling (a7c3889)
* **Features:** updates Guide text and wedges (948970c)
* **Features:** refactors physics->tutorial logic for readability (94f1fe3)
* **Features:** dynamically syncs the tutorial Guide position (7f731a8)
* **Features:** tweaks the synced positioning of the guides (f9e926d)
* **Features:** hides physics Guide and pink outline when appropriate (e11f7d0)
* **Features:** uses fallback behavior for Guide fade out to work with media queries (e4cd298)
* **Bug Fixes:** fixed pointer events (0a5f18b)
* **Bug Fixes:** fixes overflow issues in View 3 (8805bdc)


### Babel

* **Bug Fixes:** fixes crash parsing .babelrc (5a38a04)


### ConditionExplorer

* **Bug Fixes:** closes the expanded guide if a keyword is selected (88babba)
* **Bug Fixes:** physics wasn't being paused (7f355a0)
* **Code Refactoring:** moves pausing logic to componentDidUpdate (b284afc)


### Dependencies

* **Project Maintenance:** pin dependency open-cli to 5.0.0 (ed4dca7)
* **Project Maintenance:** replace @babel/polyfill with core-js@3 (840e39e)
* **Project Maintenance:** replace opn-cli with open-cli (deprecation) (e65621f)
* **Project Maintenance:** update dependency babel-plugin-macros to v2.6.1 (3fb3e71)
* **Project Maintenance:** update dependency css-loader to v3 (7d3948c)
* **Project Maintenance:** update dependency enzyme to v3.10.0 (2154c59)
* **Project Maintenance:** update dependency enzyme-adapter-react-16 to v1.14.0 (7977879)
* **Project Maintenance:** update dependency file-loader to v4 (147306e)
* **Project Maintenance:** update dependency raw-loader to v3 (9f7518b)
* **Project Maintenance:** update dependency webpack-cli to v3.3.4 (45db3fa)
* **Project Maintenance:** update node.js (ba01fc6)
* **Project Maintenance:** update storybook monorepo to v5.1.3 (8fd971e)


### GraphQL

* **Features:** updates components and storybook to match new schema (b3d4035, NEBV-1468)
* **Features:** adds lang code to graphql endpoint (c0be995, NEBV-1468)


### Guide

* **Features:** sources the guide size from constants rather than hard-coding (3df1d5b)


### ProjectMenu, App

* **Bug Fixes:** fixed month and number overflow (ac434f9, NEBV-1578)


### Share Icon

* **Features:** added image to the share icon (06d86b6, NEBV-1557)


### Styles

* **Features:** adjusts fonts and layout with designers input (c4a077b)


### Wheel

* **Bug Fixes:** fixes a crash switching from Location to Company mode (6f20843)

# [0.17.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.17.0) (2019-06-06)


### App

* **Features:** updates proptypes and queries (2960439)
* **Features:** removes BubbleChart and InstrumentsLegend components as prep for redesign (30f3178)
* **Features:** reimplements instrument counts using the StreamGraph (40b2178)
* **Features:** renames variables for clarity (2d44c51)
* **Features:** adds stories to the App that start on View 2 or 3 (7ab197a)
* **Features:** moves conditionsPerYear processing to the app level for perf. and reuse (1f01c36)
* **Features:** scrolls the keep the Guide in view during the tutorial (2ddf184)
* **Features:** adds configuration data query to App (9498b8b)
* **Features:** integrates live instrument data (e03012a)
* **Features:** add data date to bottom (0ea970d, NEBV-1452)
* **Features:** added Date Data Updated (8b18020, NEBV-1452)
* **Features:** adds comment explaining why View 2 is disabled (053684c)
* **Features:** filters out instrument prefixes with no counts (e99267c)
* **Bug Fixes:** revert changes to get back to a working state (42358bb)
* **Bug Fixes:** changed instrument prefix keys (7f4613d)
* **Bug Fixes:** removes harcoded transition states that had been missed (472c456)
* **Bug Fixes:** updates tests and snapshots, removes duplicate code (687744b)
* **Bug Fixes:** colors instrument flags in ProjectMenu, fixes missing messages (b90e006)
* **Bug Fixes:** fixes the keyword explorer being visible on top of WET header (98c8d2b)
* **Bug Fixes:** removes pointer events from ConditionDetails when not visible (e30ae30)
* **Bug Fixes:** fixes crashes switching to instrument mode (dff29c0)
* **Bug Fixes:** updates snapshots (8599106)
* **Bug Fixes:** restores View 2 now that it won't break (9465268)
* **Tests:** updates snapshots (e371b76)
* **Tests:** fixes broken or highly-coupled tests (51fce5a)
* **Tests:** updates snapshots, bypasses linting errors (f19d8a4)
* **Code Formatting:** adds TODO comment for query error-handling (3bfda14)
* **Code Formatting:** renamed variables and added internationalzation (25506d6)


### CompanyPopup

* **Features:** adds processing to split the text content into a list (6ea96f9)


### English.json

* **Bug Fixes:** fixes missing instrument keys preventing snapshot pass (af23a91)


### FeatureTypesDescription

* **Features:** updates tests and stories to reflect instrument changes (e1cc223)
* **Bug Fixes:** updates snapshots (191b5b0)


### GraphQL

* **Code Refactoring:** added links, updated snapshots (c90ede1)


### GreyPipe

* **Bug Fixes:** fixes flag block (c408465)


### GuideDetail

* **Features:** changed guide detail text to approved text (b149d05, NEBV-1566)


### Languages

* **Bug Fixes:** puts removed strings back (1f5f0be)


### LocationWheel/MiniMap

* **Features:** implements data for the locationVariant of view (9afba32)


### MainInfoBar

* **Bug Fixes:** fixes about link (c440c74)


### Mock Data

* **Bug Fixes:** adds missing instrument type (9cff878)


### Project Menu

* **Features:** add wheelspin animation for loading (91d8b46, NEBV-1550)


### ProjectMenu

* **Bug Fixes:** fixes prop type error (bf0185c)
* **Bug Fixes:** fixes binning by limiting to only instruments (161e575)


### ProjectMenuQuery

* **Code Refactoring:** simplifies query (76d99d8)


### Queries

* **Features:** moves queries up to the app level (9cd9835)


### SmallMultiplesLegend

* **Features:** ensures all variations have CSS applied (1615dff)
* **Features:** uses instrument prefixes rather than looking for locale text (02d8557)


### snapshot

* **Bug Fixes:** updated snapshots (914e708)


### Steam Graph

* **Bug Fixes:** fixes test cases for the rect added for clickable ares (7f4ec85)
* **Bug Fixes:** fixes clickable area for the steam graph. Now user can click inside the white spac (f216a94, NEBV-1531)


### SteamGraph

* **Features:** now chart indicator id on by default (51f529c, NEBV-1531)


### StreamGraph

* **Features:** simplifies processing, removes calcs we can get from queries (cc5feb6)
* **Features:** adds TODO comments (ac61bc8)
* **Features:** displays all year ticks, adds padding to avoid clipping curves (2d4c078)
* **Code Formatting:** fixes linting error (835ed8d)
* **Code Formatting:** restores and bypasses some broken tests, to fix later (6a4d30a)


### view 2

* **Bug Fixes:** cleanup from Review (1f81d04)


### View 2

* **Features:** loading animation on wheel spin (7d5f830, NEBV-1550)
* **Bug Fixes:** fixes the search bar being cut off (27f4fb5)
* **Code Refactoring:** replaces Dummy Text in Company Popup (6acaaf3, NEBV-1565)


### view 3

* **Code Refactoring:** added additional instrument prefixes (7f639c5)


### View 3

* **Features:** only processes the count data once rather than per-render (f7baff2)
* **Features:** adds query for conditionCountsPerYear, connects StreamGraphs (c9b2477)
* **Features:** displays instrument prefixes in FeatureTypesDescription as per count order (5629d82)
* **Features:** removes unused props and mock data (26e3a8a)
* **Features:** adds redesigned instrument colors (e99ae4a)
* **Features:** restructures year processing, adds mock display order (e51404e)
* **Features:** displays StreamGraph streams in the same order as SmallMultiplesLegend (f63b398)
* **Features:** adjusts text formatting (a61a117)
* **Tests:** updates tests and snapshots (6b3db3f)
* **Code Formatting:** removes unused props and imports (bd8f926)
* **Code Refactoring:** replaced dummy text with approved text (025d231, NEBV-1564)
* **Code Refactoring:** restructures logic for readability (e38f139)


### ViewThree

* **Code Refactoring:** removes commented code (8358680)


### ViewTwo

* **Features:** adds conditional render of elements on wheelSpin for locationWheel (48aed0a)
* **Features:** connects RegionCompanies to GraphQl (0d6ab04)
* **Code Refactoring:** adds dynamic FeaturesLegend on Unconnected Viewtwo (a01a30b)
* **Code Refactoring:** changes ViewTwo to PureComponent, calculates region name (d13cf1c)
* **Code Refactoring:** fixes formatting, removes lingering comments. (0e30e88)
* **Code Refactoring:** fixes prop missing (6109467)
* **Code Refactoring:** separates viewTwo variants, other major changes (c5db446)


### ViewTwo/companyVariant

* **Bug Fixes:** fixes instrument display name (c36bb74)


### ViewTwo/Location

* **Code Refactoring:** fixes unconnected rendering (631b9f6)


### ViewTwo/Subcomponents

* **Code Refactoring:** minor changes and code cleanup as per PR comments (d43f0bb)


### ViewTwo/Wheel

* **Code Refactoring:** fixes companywheelRay Modifies pullToSpin trigger (593b6a0)


### ViewTwoGQL/location

* **Features:** initial implementation of the instruments on location (becb500)


### ViewTwoGraphQL

* **Features:** adds location wheel initial renderding of instruments (19ab921)
* **Bug Fixes:** fixes no render of lenged randomly (6725873)
* **Bug Fixes:** fixes instruments feature variant crash on companyWheel (55307d3)
* **Code Refactoring:** fixes linting issue (01bca9c)
* **Code Refactoring:** fixes PR comments and requests (3a3b248)
* **Code Refactoring:** fixes PR comments second round (fb29a1a)


### Wheel

* **Bug Fixes:** fixes no spin onPull after scroll on list (8e7184c)
* **Bug Fixes:** fixes spin on entry when first data loaded and no project selected (3f41344)
* **Code Refactoring:** modifies parameters to trigger end of animation faster (1a09ac8)


### WHeel

* **Code Refactoring:** adds missing wheelMotionTriggerprop to story (b7c0126)


### Wheel/FeaturesLegend

* **Code Refactoring:** removes comments, cleans code (0a764af)


### Wheel/WheelList

* **Bug Fixes:** fixes list accuracy bug (b1be55e)
* **Code Refactoring:** fixes focus box for selected project, cleans-up code (11bce2f)


### WheelList

* **Code Refactoring:** removes duplicate code (eb088b8)


### WheelListGQL

* **Bug Fixes:** fixes list re-sorting onChange (02096c2)


### BREAKING CHANGES

* **SteamGraph:** No
* **App:** View 2 is broken
* **LocationWheel/MiniMap:** ViewTwo and related stories for wheel broken need to be fixed in future commits

# [0.15.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.15.0) (2019-05-30)


### App

* **Features:** implements forward/back functionality for transport (a5aba30)
* **Features:** moves App queries to separate files (bdcffdb)
* **Features:** adds a callback for selected keyword queries (a825cdf)
* **Features:** allows interaction on the last tutorial step (955eaae)
* **Features:** sends a dummy query for random project data (e18702f)
* **Features:** adds shrinking transition when tutorial is finished (f450160)
* **Features:** adds View 1's keyword search and a dummy random data call (7bf0a60)
* **Features:** adjusts function signtuare for readability (28133b1)
* **Features:** adjusts GuideTransport positioning for transition steps (b88b1ce)
* **Features:** starts Guide tutorial on first Guide click (4e768b2)
* **Features:** adjusts Guide size and position to avoid viewport clipping (f9e71a0)
* **Features:** updates Guide text (34cc0e9)
* **Features:** removes second transition step as per redesign (549f7b2)
* **Features:** implements timer for the guide tutorial (de48321)
* **Features:** sets selected project/company ids and search keyword in Redux (197a9ca)
* **Features:** lifts ConditionDetails from the views to the App (69ce5ec)
* **Features:** corrects Guide positioning for tutorial, pads indicators (bb3b0bd)
* **Features:** adds progress indicators to Guide (e9f3201)
* **Features:** adds transitions for ConditionDetails' expanded mode (5759189)
* **Features:** adjusts GreyPipe and Selected Company Header to match ConditionDetails (6eb069f)
* **Features:** adjusts styling and transitions to fit Selected Company header and Wheel (9371115)
* **Features:** implements selected keyword state and callback (deda87e)
* **Bug Fixes:** fixes properties that I broke while refactoring, removes dangerous HTML (005c926)
* **Bug Fixes:** made container stretch with footer expansion (0001842, NEBV-1532)
* **Bug Fixes:** fixes GraphQL syntax error (e7e090b)
* **Bug Fixes:** reverts accidental package.json changes (ad642f9)
* **Tests:** updates snapshots (6d68354)
* **Code Formatting:** removed whitespace (e5fc691)
* **Code Formatting:** removes commented code (214ef89)


### App, Footer

* **Code Formatting:** indentation change (7d1b0c8)


### ConditionDetails

* **Bug Fixes:** adjusts header positioning (2cd24c3)
* **Tests:** updates broken tests (91f66c3)


### ConditionExplorer

* **Features:** tweak keyword physics (37474b9)
* **Features:** updates styles, fixes prop errors (5003e1c)
* **Bug Fixes:** correctly displays HTML entities in keyword names (c2d2602)
* **Code Formatting:** removes commented code (2615311)


### Guide

* **Features:** adjusts indicator positioning (2fc722b)
* **Code Refactoring:** extracts calculations from SVG for readability (27f098c)


### GuideTransport

* **Features:** adds SVGs and caption (ec6309c)
* **Features:** adds component skeleton (ef073db)
* **Tests:** adds interaction tests, updates snapshots and broken tests (472083d)


### ProjectMenu

* **Bug Fixes:** remove engineering and landowner from project (889d199)


### Search Bar

* **Bug Fixes:** added spaces (b241008)
* **Bug Fixes:** added spaces around | (c7dcf09, NEBV-1537)


### snapshot

* **Bug Fixes:** updated snapshot (3998889)


### URL-TO-STATE

* **Features:** converts store data to a string and hash it (5f0d5f1, NEBV-1518)


### View 1

* **Features:** implements keyword selection for the fallback Explorer (a790444)
* **Features:** populates ConditionExplorer with keywords from ETL (f56871a)
* **Features:** begins integrating GraphQL (54cb6f4)


### View 3

* **Features:** adds console.log as placeholder to show query data (75fa26a)
* **Features:** queries for the year range used in the dataset (19e29c2)
* **Features:** adds a GraphQL wrapper and dummy query (7e48707)
* **Bug Fixes:** fixes linting errors (4c71d6f)
* **Code Refactoring:** exports queries as an object (allows multiple queries) (70f0c43)
* **Code Refactoring:** moves to a class component to make use of lifecycle (e56ad00)


### BREAKING CHANGES

* **App:** The grid is no longer in the app its in another container down

# [0.14.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.14.0) (2019-05-23)


### conditions list

* **Code Formatting:** added space (25923a7)


### Conditions List

* **Features:** changed indicator to orange circle (0fe1d4a, NEBV-1526)


### ConditionsList, View 3

* **Bug Fixes:** fixed white space (b488c83)


### FeaturesMenu

* **Code Refactoring:** removed Border around selected (d288c52)


### Keyword Explorer Button

* **Code Refactoring:** changed text to: Back to Keywords (ccafc1d, NEBV-1528)


### PopuBtn

* **Code Refactoring:** made button height dynamic (62a19e9, NEBV-1496)


### PopupButon

* **Code Refactoring:** changed button width (a221a6e, NEBV-1496)


### Trend Button, Features Menu

* **Code Refactoring:** updated button and menu to match design doc (89086f2, NEBV-1504)


### View 2, View 3

* **Bug Fixes:** better way to insert space (bc814ae)
* **Bug Fixes:** removed trailing spaces in text (f550d77, NEBV-1521)

# [0.13.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.13.0) (2019-05-17)


### App

* **Features:** adjusts View 1 to the grid, fixes Layout Only stories (2167846)
* **Features:** begins reimplenting grid system (e3fdd23)
* **Features:** continues laying out components to the grid, resizes ProjectMenu (de35333)
* **Features:** repositions BrowseBy components for new layout (e9afa23)
* **Features:** adjusts grid logic, positions Footer and adjusts transitions (c403173)
* **Features:** fits View 3 to the grid, adjusts StreamGraph and transitions (d03ac00)
* **Bug Fixes:** fixes flag alignment and Guide transition bugs (5e12c9d)
* **Bug Fixes:** adds Streamgraph fix that was lost when merging PRs (4277f00)
* **Bug Fixes:** fixes issues raised in PR (ac79e80)
* **Tests:** updates snapshots (aa45bd2)
* **Code Formatting:** removes unused code, tidies and fixes linting issues (aea6704)


### App, ViewTwo, Wheel

* **Code Refactoring:** changes as suggested on PR (84df01b)


### Arrow

* **Features:** adding spec (e6c6cb4)
* **Features:** trying to get ccs working (d31d966)
* **Features:** arrow now rendering (6cac23e)
* **Code Formatting:** arrows look better (461d83b)
* **Code Refactoring:** changed Arrow to match design doc (0366ad9, NEBV-1471)
* **Code Refactoring:** improved arrow (2d4feb4)


### Components/Arrow

* **Features:** created Arrow Component (5c14433, NEBV-1471)


### ConditionDetails

* **Bug Fixes:** removes header padding until we can overhaul this component (954bfa9)


### Dependencies

* **Project Maintenance:** update dependency codecov to v3.4.0 (f1d8fc2)
* **Project Maintenance:** update dependency codecov to v3.5.0 (acfa194)
* **Project Maintenance:** update dependency cz-customizable to v6.2.0 (7b320ff)
* **Project Maintenance:** update dependency webpack to v4.31.0 (7ff35f5)


### DotLegend

* **Features:** implements DotLegend component (3a98acd)
* **Documentation:** adds documentation (f2cadc5)


### English.json

* **Bug Fixes:** changed case of 'Of' (3052b41)


### FeatureFlag

* **Tests:** updates tests and snapshots (5366c20)


### FilterContent

* **Documentation:** updated Readme (476a26e, NEBV-1467)


### Grid

* **Documentation:** expands comment to add clarity (e1051e6)


### List

* **Code Refactoring:** Adds safety checks, adjusts tests (9100417)
* **Code Refactoring:** changed Icon to Arrow (85bb353)


### List/Wheel\

* **Bug Fixes:** fixes scrolling, changes wheel animation params (6844f93)


### ProjectDot

* **Code Refactoring:** adjusts displayed scope of tests and stories (2280d83)


### ProjectMenu

* **Features:** adjusts the skewed pipe to be scalable (ee1b953)
* **Bug Fixes:** fixes default story not rendering (97b8344)
* **Code Refactoring:** fixes broken test during gql implementation (aa69eec)


### Search Bar

* **Code Refactoring:** applied style changes to close button (07e2f5e, NEBV-1509)
* **Code Refactoring:** changed initial state of filters (419413b, NEBV-1467)


### Search Bar, Filter Content, Search Content

* **Bug Fixes:** fixed wet template close button (451f101, NEBV-1509)


### SelectedGroupBar

* **Bug Fixes:** changed colourOptions and Text (45ef874)


### snapshot

* **Tests:** updates snapshot (2e2f05b)


### snapshots

* **Bug Fixes:** updated snapshots (ca70486)


### Snapshots

* **Tests:** updates snapshots (8fbd072)


### Storybook

* **Tests:** updates snapshots (b5c9845)


### TotalConditionLabel

* **Code Refactoring:** refactors positioning concerns (1d5d9e1)


### TotalConditionsLabel

* **Code Refactoring:** removed unnecessary import (cade6ff)


### view 2

* **Code Refactoring:** removing hard coded strings (a7eb627)


### View 2

* **Features:** adjusts scaling for GreyPipe, fits Region display to the layout (efe2f52)
* **Features:** adjust ProjectMenu and FeatureFlags to fit new layout (91e4c94)
* **Features:** adjusts GreyPipe and RegionChart to fit new layout (ed9701e)
* **Features:** added number of conditions label (2c851b6, NEBV-1513)
* **Features:** adjusts ProjectMenu and FeatureMenu to fit the layout (5f0d103)
* **Features:** redesigns the legend to align items with their flags (669546f)
* **Features:** scales the minimap to fit its container (5fd55d8)
* **Features:** continues adjusting layout to the grid (4fb583d)
* **Bug Fixes:** fixes styling issues, removes redundant elements (e7094de)
* **Code Formatting:** changed case of 'f' in for (06e5f01)
* **Code Refactoring:** removed old conditions label (8ef4b55, NEBV-1513)


### View 2, Search Bar

* **Code Refactoring:** changed INPROGRESS to IN_PROGRESS (d2f7910, NEBV-1467)


### View 2, View 3, Stream Graph, PullToSpin

* **Code Refactoring:** replaced Hard coded strings (3cd7e85, NEBV-1490, NEBV-1495, NEBV-1484, NEBV-1480)


### View 3

* **Features:** adds basic grid layout (a4f1e83)


### View 3, Wheel

* **Code Refactoring:** took out hardcoded strings (4f7c55c)


### View2 , View3

* **Features:** added Arrow component (bcaddb6, NEBV-1471)


### ViewTwo

* **Bug Fixes:** fixes stories, Wheel flag positioning (05ca512)
* **Code Formatting:** fixes view two integration legend positioning (b3c8574)
* **Code Refactoring:** changes params of List and wheel animations & interactions (8b99ea0)


### ViewTwo -> subcomponents

* **Bug Fixes:** fixes conditional rendering issues (2d5137f)
* **Code Refactoring:** fixes console errors (9d17a67)


### ViewTwo, subcomponents

* **Features:** adds data connection to ProjectMenu, ProjectLegend (103e827, NEBV-1399)


### ViewTwo/Flag

* **Code Refactoring:** modifies the queries and reverts width calculation (879eb9e)


### ViewTwoGQL,SubfeaturePhase

* **Code Refactoring:** simplifies functions Changes enums to match backend (fa11596)


### Wheel

* **Code Refactoring:** extracts ProjectDot as a public component (5861eb6)


### Wheel/ ProjectMenu

* **Code Refactoring:** further changes as suggested in prs (92f4995)


### Wheel/GQL/PullToSpin

* **Code Refactoring:** adds query, refactors wheel logic, fixes css pulltospin (534b9f6)


### Wheel/location

* **Bug Fixes:** fixes rendering on app due to query (a7ad82f)


### BREAKING CHANGES

* **ViewTwo, subcomponents:** ENGLISH.JSON, PROJECTSDATA.JS, VIEWTWOQUERIES, VIEWTWO AND SUBCOMPONENTS
* **List/Wheel\:** none

# [0.12.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.12.0) (2019-05-09)


### Dependencies

* **Project Maintenance:** update dependency node-sass to v4.12.0 (9ed1169)


### Features Menu

* **Code Refactoring:** swapped filing and order (c94da44, NEBV-1464)


### FilterContent

* **Code Refactoring:** added constant to reference statuses (0a18dd0, NEBV-1451)


### french.json

* **Code Refactoring:** removed CANCELLED, changed OPEN and CLOSED (913c91c, NEBV-1451)


### MainInfoBar

* **Code Refactoring:** changed DownloadsBox to DownloadBox (3cc4c23)


### MainInfoBar, ShortcutInfoBar

* **Code Refactoring:** change downloads and remove image (2cab66c, NEBV-1456)


### SearchBar, FilterContent

* **Bug Fixes:** improved toggle and name change (f8a4279, NEBV-1451)


### SearchBar, FilterContent, View2

* **Bug Fixes:** removed out of scope changes (4a380c4)
* **Code Refactoring:** readding overwritten changes (2dd3e69, NEBV-1451)


### SearchBar/FilterContent

* **Bug Fixes:** toggle, Name Change and Functionality (11e89b9)


### transitions.scss

* **Code Refactoring:** removes out of scope changes (c6fa328)


### View 3

* **Bug Fixes:** guide Button not clickable now (d32655d, NEBV-1448)
* **Bug Fixes:** graph click now shown (d39bbd6, NEBV-1448)


### BREAKING CHANGES

* **SearchBar/FilterContent:** Keys changed for the state of the search bar

# [0.11.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.11.0) (2019-05-01)


### App

* **Features:** removes scroll interaction, adds placeholder View 1 button (4978bfb)
* **Features:** uses existing variables for color styles (57f3a9d)
* **Bug Fixes:** keeps Guide from stealing mouse events, repositions it (8629ba2)
* **Tests:** updates snapshots, fixes prop errors (de23417)


### ConditionDetails

* **Features:** adjusts ConditionList styles as per design review (21be095)
* **Features:** changes header to reflect BrowseBy mode (9ecc2de)


### ConditionExplorer

* **Bug Fixes:** Removes a stray change from debugging (7f735bb)
* **Code Refactoring:** fixes keyword js lint error line 69 (cf07158)


### Dependencies

* **Project Maintenance:** update dependency cz-customizable to v6 (98390dc)
* **Project Maintenance:** update dependency webpack to v4.30.0 (d5b573c)


### GreyPipe

* **Code Formatting:** removes commented code (791f4f4)


### GreyPipe/RegionConditionSummary/Wheellist

* **Code Formatting:** refactors some styles to calculate using the same (ccb578a)


### Guide

* **Features:** updates text to reflect change to click interaction (8f9855e)


### Physics variant keyword

* **Code Formatting:** fixes linting issue for trailing comma (8e8b75e, NEBV-1291)


### Project Menu

* **Features:** adds Loading animation to the project menu loader (6579918, NEBV-1408)
* **Bug Fixes:** fixes styles as requested via Merge request (7315584, NEBV-1408)


### Project Menu and Project Chart

* **Tests:** adds new tests and mock data for loading project menu (bb0042a, NEBV-1408)


### ProjectMenu

* **Features:** reimplements project sedimentation (10fd44c)


### Storybook

* **Tests:** updates snapshots (3f66764)


### View 2

* **Features:** fixes stories, updates snapshots (b89f57a)
* **Features:** uses variables for color styles (27d3e96)
* **Features:** positions Region components as per design doc (020026c)
* **Features:** adjusts ConditionDetails to connect with GreyPipe (4dcbb00)
* **Features:** adds GreyPipe's location mode (b121f33)
* **Features:** updates docs, adds prop for mode toggle (8cae2d8)
* **Features:** reimplements changes to fit GreyPipe into the view (9e3aa84)
* **Features:** migrates to a clean branch to fix merge issues (5f7eb95)
* **Code Formatting:** adds TODO tag to a to-do comment (bdeaec0)
* **Code Formatting:** tidies up in preparation for PR (7ebc7b3)

# [0.10.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.10.0) (2019-04-24)


### App

* **Bug Fixes:** fixes issues raised in PR (e9768c5)


### ConditionExplorer

* **Features:** outline transitions to wherever guide is initiall positioned (0477944)
* **Features:** guide displaces keywords when it is expanded (5bd45ec)
* **Features:** adjusts keyword movement and timing (7e47440)
* **Features:** adds font-size scaling to match design doc (f69fea2)
* **Features:** adds text shimmer when keywords reset to placeholders (5f9ec63)
* **Features:** immediately finish transitions if they don't result in change (1e454bf)
* **Features:** adds CSS and collision performance improvements (b6cb1cf)
* **Features:** clamps keyword velocity and rotation for "icy" movement (e0bf216)
* **Features:** rotate with shortest path (modulus) instead of unwinding (23b8e22)
* **Features:** set guide as static when not being dragged (85c744b)
* **Bug Fixes:** fixes bug with drifting keywords (603fc15)
* **Bug Fixes:** fixes collision/reset timing (79f05a4)


### Storybook

* **Features:** removes the a11y addon from the project (250a147)
* **Performance Improvements:** disables the a11y addon to fix perf and scroll janking issues (84b1128)


### StreamGraph

* **Features:** tweaks animation, updates snapshots (4ac6a02)
* **Features:** adds stream animation for TrendButton display (2c5c02b)
* **Features:** adds transitions when data changes (38b901d)
* **Bug Fixes:** removes unused code (a0a7b9a)
* **Bug Fixes:** fixes rendering issues in component stories (e8b33ee)
* **Bug Fixes:** adjusts curve to keep streams on top of each other (9368e22)
* **Code Refactoring:** continues work on redundant loops (b56f75b)
* **Code Refactoring:** minimizes redundant looping over the data set (7e26675)


### View 2

* **Features:** syncs the Trend Button to current feature (30a921b)

# [0.8.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.8.0) (2019-04-18)


### App

* **Features:** adds Footer transitions (a8a2f67)
* **Features:** adds basic transition stages and a story knob (e1d4cbd)
* **Features:** updates documentation, removes commented code (92e4d38)
* **Features:** adds a rough version of the first transition step (e74176c)
* **Features:** moves transitionState to Redux (60d7340)
* **Features:** fixes positioning and transition issues (f7ce46c)
* **Features:** fixes positioning issues, makes Guide larger (32cda23)
* **Features:** adds jump-to-Footer interaction (b5f8500)
* **Features:** adds component-specific overrides for scrolling (02f4b5c)
* **Features:** adds a rough version of the second transition step (5146ae2)
* **Features:** adds a rough version of the third transition step (cfdaef7)
* **Features:** makes transition targets more granular, fixes prop errors (186a7c1)
* **Features:** adds a rough version of the fourth transition step (e2784f1)
* **Features:** implements scroll interactions (7dfb3d3)
* **Features:** initial graphql apollo integration to app (a016d9a)
* **Features:** adds a rough version of the fifth transition step (f868299)
* **Features:** adds an event handler for the Trend button (10c7f64)
* **Features:** implements a transition state callback for the BrowseBy buttons (6fa9358)
* **Features:** transitions the BrowseBy buttons on mode changes (4a12f5a)
* **Features:** handles Redux wrapper in App component (759a999)
* **Features:** wraps the App with Redux, hooks the BrowseBy buttons up again (f00f85f)
* **Features:** removes preemptive will-change properties (b954b5c)
* **Features:** uses translate for all positioning animations (a6c9867)
* **Features:** uses translate for improved performance when moving the Guide (f1a4a49)
* **Features:** tweaks BrowseBy transitions (c82d9c4)
* **Features:** adjusts View 2/3 transitions (d096acf)
* **Features:** adds a rough version of the sixth transition step (e39fb92)
* **Features:** updates BrowseBy visibility (443ef56)
* **Features:** fades text from one Guide step to the next (df33fae)
* **Features:** removes redundant BrowseBy buttons from Views (43d49b1)
* **Features:** hides Footer to avoid capturing mouse events (8dac4e9)
* **Features:** updates the views to use consistent heights (9736679)
* **Features:** adjust View 3 to use the same heights as the others (4197f99)
* **Features:** continues updating styles for a consistent viewport (f0e9416)
* **Features:** adjusts View 1 styles (261ae12)
* **Features:** adds a rough version of the seventh transition step (69e6d86)
* **Features:** adds SkipIntro to View 1 (9391bb2)
* **Features:** adds localized text for each Guide step (7e44ffe)
* **Features:** adds basic View 2<->3 transition, updates styles (10b76ad)
* **Features:** updates documentation with transition states (69087b8)
* **Features:** moves guide CSS into sass map (e5b5b25)
* **Features:** adjust transition curve for 8 -> 0 (f2d2d75)
* **Features:** render components at all stages, add 8 -> 0 transition (e5d5ae5)
* **Features:** uses pixels for Guide positioning rather than percent (d8ab68e)
* **Bug Fixes:** adjusts CSS to match SearchBar changes (dc57d52)
* **Bug Fixes:** fixes missing key errors, updates snapshots (3855998)
* **Bug Fixes:** corrects issues integrating with the WET template (fe9c392)
* **Bug Fixes:** checks for scrollable elements before transitioning (f81202a)
* **Bug Fixes:** stops App from hijacking wheel events on List (0941a3f)
* **Bug Fixes:** fixes Guide positioning at tutorial steps (54a6a1b)
* **Bug Fixes:** reverts the Guide's x position to percents for scaling (7d93f30)
* **Bug Fixes:** fixes pointer issues with Victory on Firefox (7ad1546)
* **Tests:** updates snapshots (45d1984)
* **Code Formatting:** removes commented code, disables linting for temp. code (a5a2339)
* **Code Formatting:** uses variables for repeated styles (1be2177)
* **Code Refactoring:** moves Guide state logic out of JSX (26dc665)
* **Code Refactoring:** refactors and privatizes the BrowseByBtn component (9fdc5be)


### BrowseBy

* **Features:** adds missing callback prop (e65505b)
* **Bug Fixes:** fixes proptype errors, updates snapshots (4a18f5f)


### BrowseByBtn

* **Bug Fixes:** fixes display issues with duplicate clip path IDs (d0043a7)


### ConditionDetails

* **Bug Fixes:** adjusts component height to match the design doc (684c51a)


### FeaturesLegend

* **Code Refactoring:** renames component class to avoid namespace collision (69dd191)


### GraphQL

* **Features:** wheel-company variant query render on load (24b2937)


### GraphQL/Wheel

* **Features:** add conditional rendering, cleanup (6f78783)


### Guide

* **Features:** adds a margin to keep text inside the circle (425cfdb)


### ProjectMenu

* **Features:** shortens pipe to avoid overlapping ConditionDetails (5e618fe)


### Query

* **Code Refactoring:** modifies (48333e2)


### ShortcutInfoBar

* **Features:** updates styling (still pretty rough) (6a8e044)


### SkipIntro

* **Features:** adds arrow display (91938d9)
* **Features:** adds a component for View 1's BrowseBy buttons (09bc778)


### Snapshots

* **Tests:** updates snapshots (3b3897c)


### View 2

* **Features:** fixes positioning issues (afab629)


### View 3

* **Code Formatting:** removes unused code (f4dca09)


### View2

* **Code Refactoring:** create alternate view and fetch polyfill (b0a1728)


### ViewTwo

* **Code Refactoring:** changes reflecting further PR suggestions (1a8542e)


### ViewTwo, GraphQL, Wheel, GQLdecorator

* **Code Refactoring:** refactor as per PR comments (2c4021a)


### Wheel

* **Features:** graphQL tied with company wheel variant (de20ff2)


### WheelList

* **Code Refactoring:** adds support for html formatted text, fixes text spacing for non selected items (b7307dd)
* **Code Refactoring:** fixes linting issues errors (07ec78b)


### BREAKING CHANGES

* **GraphQL:** change of randomdatasample and removal of object from it to return an array instead
* **Wheel:** Location Wheel, props changed

# [0.7.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.7.0) (2019-04-15)


### ConditionExplorer

* **Features:** adds guide dot interactions and fixes PR comments (5e69568)
* **Features:** keep Guide and Outline positions synchronized (3a075e1)
* **Features:** finish implementing guide text and sizing (eb06e56)
* **Bug Fixes:** fixes bug with double-click still opening guide (11a39d2)
* **Bug Fixes:** fixes bugs with engine and transition timings (9084329)
* **Bug Fixes:** fixes collision when immediately opening and closing guide (6a088d5)
* **Tests:** updates snapshots (26a8248)
* **Code Formatting:** fixes linting errors (8650aac)
* **Code Formatting:** fixes PR comments (d45824a)
* **Code Formatting:** hide guide arrows instead of removing them (df9524d)
* **Code Refactoring:** rename circle/guide/outline and categories (9dfa56d)


### Dependencies

* **Bug Fixes:** update dependency react-redux to v7 (9b85637)
* **Project Maintenance:** update dependency cz-customizable to v5.10.0 (6971751)
* **Project Maintenance:** update dependency enzyme-adapter-react-16 to v1.12.1 (4a2c251)
* **Project Maintenance:** update dependency opn-cli to v4.1.0 (8ba4f96)


### Interactive Guide

* **Features:** add on click overlay (2e09a4c)


### List

* **Features:** adds prop for arrows on outside of list (4aa8722)

# [0.6.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.6.0) (2019-04-09)


### App

* **Features:** continues refactoring modals, adds rough Regdocs content (d0ad724)


### ChartIndicator

* **Features:** adds 'allThemes' prop to display an asterisk (d6875dc)


### CompanyPopup

* **Features:** implements the basic component requirements (e2a85a6)
* **Tests:** updates snapshots (a39c588)
* **Code Formatting:** condenses unnecessary multiline statement (be8f538)


### ConditionExplorer

* **Features:** implements new rendering/visibility logic (1e532a0)
* **Features:** adds smoother transitions for guide position and scale (96edd69)
* **Features:** improves opening/closing logic and collisions (1d88b67)
* **Features:** Rewrite body render object logic (7b67785)
* **Features:** reworks keyword class to handle logic (5e375a2)
* **Features:** initial reorganization of logic into index and body (e183637)
* **Features:** rework move/rotate/scale to use current value instead of velocity (559489a)
* **Features:** use promises for move/rotate/scale to prevent early keyword collisions (063c4c7)
* **Features:** Refactors movement/scaling into Body class (d3bc562)
* **Code Refactoring:** extracts a method to eliminate duplicate code (f838727)
* **Code Refactoring:** reverts update methods from arrow functions (21bc328)


### Dependencies

* **Project Maintenance:** update babel monorepo (8edf2bd)
* **Project Maintenance:** update dependency codecov to v3.3.0 (ad32322)
* **Project Maintenance:** update dependency cz-customizable to v5.8.0 (6216255)
* **Project Maintenance:** update dependency eslint to v5.16.0 (bbf1f7a)
* **Project Maintenance:** update dependency storybook-addon-interaction to v1 (1f60098)
* **Project Maintenance:** update jest monorepo to v24.7.0 (b720d1a)
* **Project Maintenance:** update jest monorepo to v24.7.1 (16ca15a)


### DownloadPopup

* **Documentation:** removes references to Image Download (afd4395)


### Locales

* **Features:** adds RegDocs and Company popup text (8aaa733)


### Modal

* **Features:** opens/closes dialog based on isOpen prop changing (35df826)
* **Features:** updates styles, removes unused code (c0101a0)
* **Features:** splits modal functionality into two separate components (cb0cc4d)
* **Features:** moves custom validator to proptypes.js, refactors prop names (02df6f8)
* **Code Formatting:** fixes formatting and linting issues, adds comments (e6d8289)
* **Code Refactoring:** removes content logic from Modal to enable reuse (c945981)
* **Code Refactoring:** updates styling and logic as per PR comments (12c4ce6)
* **Code Refactoring:** uses PopupBtn component for modals' buttons (fdc6d24)


### Physics variant

* **Features:** adds click to circle (2df354f, NEBV-1289)


### Physics Variant

* **Features:** wIP for freezing body elements (489f4e3, NEBV-1289)
* **Code Refactoring:** refactors some numbers for the physics calculations (64aab9e, NEBV-1289)


### PopupBtn

* **Features:** implements the popups' button as a public component (31e9081)
* **Documentation:** adds prop descriptions (af84ae8)


### PropTypes

* **Bug Fixes:** fixes a validation check (95d11d0)


### RegdocsPopup

* **Features:** adds links, updates styling (a9fa509)
* **Features:** adds localized text to buttons (8ab8dae)
* **Features:** adds + and x icons to buttons (cfec577)


### RegDocsPopup

* **Features:** splits popup content into a separate component (7c7045a)
* **Tests:** updates snapshots (ccb32e1)
* **Tests:** adds basic tests, removes unused file (1f54365)


### Snapshots

* **Tests:** updates snapshots (2ed8e83)


### StreamGraph

* **Features:** adds 'allThemes' prop for showing the indicator asterisk (1d8c9b1)
* **Bug Fixes:** fixes missing `allThemes` prop for `<StreamGraph streamOnly />` (ff6ffa8)
* **Bug Fixes:** removes a stray console statement (669b242)
* **Code Formatting:** adjust style and props as per PR comments (31f5560)


### View 2

* **Bug Fixes:** fixes minimap positioning issues (675c993)


### View 3

* **Features:** scrolls FeatureTypesDescription when Legend changes (db5e3f8)
* **Features:** adds "Conditions may have multiple themes" message (96bc83b)


### Wheel

* **Bug Fixes:** spin on state change regardless of trigger fix (29d7c4b)
* **Bug Fixes:** tweak situations in which the wheel spins (3757a8a)
* **Bug Fixes:** rotation fix on internet explorer (3590331)
* **Code Formatting:** Wheellist fix override wet template (cb71b47)
* **Code Refactoring:** props spin fix (7daad3f)


### WheelList

* **Code Formatting:** adjust for wet template width positioning, centered (bc7264e)
* **Code Formatting:** tweaks implementing suggestions from PRs (9337cc6)

## [0.5.2](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.5.2) (2019-04-02)


### Build

* **Project Maintenance:** don't use hash in css filename (2a13b95)

## [0.5.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.5.1) (2019-04-02)


### Build

* **Project Maintenance:** fix build env variables in Windows (0e56257)

# [0.5.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.5.0) (2019-04-02)


### babelrc

* **Bug Fixes:** testing fix due to broken json fix (92fcac6)


### BarContainer

* **Features:** adds support for percentage width/height (ccd8c26)


### CompanyFlag

* **Features:** adds a fill algorithm (very broken) (699d951)
* **Features:** begins prototyping flag component (fa005ba)
* **Features:** adds Filtered/Relevant coloring (5de2d09)
* **Features:** begins prototyping flag component (34b42a5)
* **Features:** adds Filtered/Relevant coloring (585feae)
* **Features:** adds folding of the triangle's frame (3049f8c)
* **Features:** prevents flags from intersecting (3f4a617)
* **Bug Fixes:** updates spec with changed prop name (d520744)
* **Bug Fixes:** fixes linting errors (b4b9c4e)
* **Bug Fixes:** fixes triangle fill alg., adds algorithm tests (cef6c15)
* **Code Formatting:** adds description to triangleCollidesWithRay (ca0cd02)
* **Code Refactoring:** exports intermediate functions to allow testing (554db30)
* **Code Refactoring:** renames variables to allow nicer formatting (40b7851)
* **Code Refactoring:** tidies code, adds comments (bd6af6b)
* **Documentation:** adds documentation, removes unused file (dcb45f1)


### CompanyFlag, ProjectDot

* **Features:** draws a flag of project dots (82b33a9)
* **Features:** draws a flag of project dots (0d01669)


### Container ViewTwo

* **Features:** add test cases (a45feb7)
* **Features:** redux Projectmenu (8fcf914)
* **Bug Fixes:** projectMenu Redux (7a6baa4)


### Dependencies

* **Project Maintenance:** pin dependency mini-css-extract-plugin to 0.5.0 (7902ab7)
* **Project Maintenance:** update dependency babel-plugin-react-docgen to v3 (98f467b)
* **Project Maintenance:** update dependency enzyme-adapter-react-16 to v1.11.2 (5aca7bc)
* **Project Maintenance:** update jest monorepo to v24.5.0 (7c9f7fd)


### HighlightSummary

* **Code Formatting:** tidies up styles, removes commented code (4503098)


### i18n

* **Features:** use en/fr instead of English/French to match NEB language codes (6e834ed)


### LocationRay

* **Documentation:** add stories/ tests (3d98971)


### LocationWheelMinimap

* **Bug Fixes:** fixes broken color variable (f8a752e)


### MockData

* **Features:** adds a listing of economic regions and provinces (5a08144)


### Polyfill babel

* **Code Refactoring:** changes the location of the import for the polyfill to deploy and storyboo (ed06395)


### ProgressMatrix

* **Code Refactoring:** switches to enum-style definition of progress (85865ef, NEBV-1357)
* **Documentation:** adds docs on status of components and views (5c7daa9, NEBV-1357)


### Project Menu

* **Bug Fixes:** adds new snapshots (732c64e, NEBV-1339)
* **Bug Fixes:** fixes test data for View Two project menu and refactors the reformatted data for (380d265, NEBV-1339)
* **Bug Fixes:** destructure props instead of making variable of prop value (4c5d1ff, NEBV-1339)
* **Bug Fixes:** fixes component to work with null project ID and fixes all test/mockData to work (8cf36fb, NEBV-1339)
* **Code Refactoring:** fixes trailing space linting on project menu comment (2d59705, NEBV-1339)


### Project Menu mockData

* **Bug Fixes:** fixes linting issues (393fabb, NEBV-1339)


### Project Menu stories

* **Bug Fixes:** removes additional mock data (0bf633d, NEBV-1339)


### Project Menu tests

* **Bug Fixes:** fixes test data to use required structure (614b4a4, NEBV-1339)


### Project Menu Tests

* **Code Refactoring:** fixes test case to use a different id to ensure 5 projects are being p (4744b77, NEBV-1339)


### ProjectDot

* **Features:** updates colors to reflect the design doc (4f550c5)


### ProjectMenu

* **Features:** reset to first project if selected project isn't found (8de3c97)
* **Bug Fixes:** added comments to 2 last failing tests (1dc3a2e)
* **Bug Fixes:** test fixes (b5d7ed1)
* **Tests:** refactor test cases and add tests for project positions (c3a6fe5)
* **Code Refactoring:** move spec data into spec and change project IDs (ff30286)
* **Code Refactoring:** removes duplicated tests (09cb0cb)
* **Code Refactoring:** reorganize tests to reuse mockData between tests (c25e7d0)
* **Code Refactoring:** simplifies logic for padding before/after (02baacb)
* **Code Refactoring:** switches tests to using Jest's describe.each (8095398)


### ProjectMenu Change Requests

* **Bug Fixes:** added tests for margins (28668b8)


### ProjectMenu, mock data

* **Bug Fixes:** fixes mispelled variable names (6f57a45)


### PullToSpin

* **Code Formatting:** specify pointer on trigger (d6af2f8)


### Seaarch

* **Code Formatting:** fix jumping reset button, minimal styling changes (4350f12)


### Search

* **Tests:** fixes snapshot (74933dd)
* **Code Formatting:** changes as requested in pr (d918a57)
* **Code Formatting:** fix border of search not completing (8a02d61)
* **Code Formatting:** ie-11 css (7c54467)


### Search/FilterContent

* **Code Formatting:** mini gap on the selection bubbles (7ebff26)


### SearchBar

* **Features:** memoizes the Tabs' event handler (2901c98)
* **Code Formatting:** removes redundant 'false' for JSX attribute (48aea86)
* **Code Refactoring:** eliminates redundant conditionals (25a3650)
* **Code Refactoring:** refactors and removes commented code as per PR comments (6ef15ce)
* **Code Refactoring:** refactors component to play nicely with others in the View (838695b)


### SearchFilter

* **Code Formatting:** remove white lines divider in bubble (8fccf2c)


### Snaphshot

* **Code Refactoring:** update snapshot (90d325b)


### Snapshots

* **Tests:** updates snapshots for previous commit (8f163b1)


### Stories, LocationRay

* **Code Formatting:** css fixes for spacing (6e7ffdc)


### Storybook

* **Project Maintenance:** fixes mini-css extraction in build-storybook (6339d25)


### View 2

* **Features:** adds the LocationWheelMinimap component (13c54c3)
* **Tests:** updates snapshots (4cdd593)


### View Two

* **Bug Fixes:** fixes proptype issues (c8de7fc)
* **Bug Fixes:** changes the project menu to use props projectsData instead of mockData projectsData (66506ed, NEBV-1339)


### Webpack

* **Features:** adds css extract plugin to bundle css into one file for production (92730f6, NEBV-1359)
* **Project Maintenance:** optimize production build to remove sourcemaps (c4bbcb0)


### webpack config

* **Code Refactoring:** add line after require lint fix (9a10498)
* **Code Refactoring:** removes comment (0ec4cc6, NEBV-1359)


### Wheel

* **Features:** flag alg. uses remaining dots to fill triangle (c23859e)
* **Features:** changes data shape, tidies code, removes logging (e6cb4fd)
* **Features:** moves random project data into random company logic (0a7342f)
* **Bug Fixes:** fixes linting and proptype errors (c1dbbc3)
* **Bug Fixes:** adds logic to avoid bugs going from 99<->0 (2ad295f)
* **Bug Fixes:** 0-99 rotation bug (location variant) (d94f291)
* **Bug Fixes:** initial polyfill for animation working, polyfills need cherry picking (1d7e479)
* **Bug Fixes:** 0 to 99 position jump (59bea8d)
* **Tests:** modify test to fit refactored wheel for IE implementation (bcb2f32, NEBV-1358)
* **Code Formatting:** renames variables and clarifies math as per PR (3efffad)
* **Code Refactoring:** fixes PropType errors, removes unused code/comments (fe78d22)
* **Code Refactoring:** initial fix of internet explorer limited to css (no functionality) (c621987)
* **Code Refactoring:** lint errors (edbd547)
* **Code Refactoring:** modifications to the wheel, randomdatasample, LocationRay, WheelRay, Styling and Vi (9552a96)
* **Code Refactoring:** pR comment fixes (4d4668b)
* **Code Refactoring:** tidies code from previous commit (479be52)


### Wheel and WheelList

* **Code Refactoring:** fix rendering and css (1ab16bc)


### Wheel Ray

* **Bug Fixes:** fixes spacing for wheel ray flags (2349b81, NEBV-1216)


### Wheel, CompanyFlag

* **Features:** draws flags in the wheel (39e6033)
* **Features:** draws flags in the wheel (b064761)


### Wheel, WheelRay, LocationRay

* **Code Refactoring:** adds dynamic rendering of wheel on percentages (10a1870)


### WheelList

* **Bug Fixes:** initial implementation with minor bugs (28ea700)


### WheelList integration

* **Code Formatting:** further CSS fixes to adjust dynamically (d0a3160)


### WheelRay

* **Features:** scales flag dots if a flag can't fit the max height (703810e)
* **Bug Fixes:** integrates Wheel changes (7b7cfa8)
* **Code Formatting:** rewrites awkward destructuring assignment (bb56f92)
* **Code Refactoring:** fix unnecessary array creation on story (0b724f7)


### WheelRay and PullToSpin

* **Tests:** fix tests (fe6a05c)


### withStyles

* **Features:** Adds decorator for styled stories (bbb8c66)


### BREAKING CHANGES

* **ProjectMenu Change Requests:** n

# [0.4.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.4.0) (2019-03-13)


### AdditionalDescription

* **Features:** transferred additional text from iLab document (b549424, NEBV-1323)


### Dependencies

* **Project Maintenance:** pin dependencies (9b5edaa)


### ESLint

* **Code Formatting:** fixes linting errors (e5fb173)


### GuideDetail

* **Features:** added text in guide detail, tests, and refactored link logic (1a2f3ef, NEBV-1323)
* **Code Refactoring:** refactored function for redability and reducing unused html tags (0ea8c63, NEBV-1323)


### MainInfoBar

* **Features:** integrates with app and footer for full interaction (5f1d3ed)
* **Features:** derive expanded state from activeDialog prop (2f0b307)
* **Code Refactoring:** renames props to avoid dialog terminology (e4ff5c4)


### WET

* **Bug Fixes:** tweaks styles to support WET template (e4a0a8d)

# [0.3.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.3.0) (2019-03-12)


### Changelog

* **Documentation:** add changelog to storybook (e96f3f1, NEBV-1343)
* **Project Maintenance:** adds automatic changelog generation from commits (90aadf8, NEBV-1343)
* **Project Maintenance:** regenerate when releasing a new version (dbb83cb)
* **Project Maintenance:** sort entries by scope (fe43ea2, NEBV-1343)
* **Project Maintenance:** updates version header to link to storybook on S3 (4fbe8db, NEBV-1343)


### Condition Explorer

* **Features:** changed forceUpdate() Placement (160357d, NEBV-1311)
* **Bug Fixes:** fixed wrong call (c0ffb21, NEBV-1311)


### ConditionDetails

* **Features:** moves condition data prop shape to global proptypes (c64e344)
* **Bug Fixes:** fix expandable conditional for view2 (6308979)
* **Tests:** updated snapshots and fixed some linting issues (ed3d00b)


### ConditionExplorer

* **Features:** adds better transition logic for words being reset (4c18463, NEBV-1311)
* **Features:** Clean up logic related to performance (fdeb0ac, NEBV-1311)
* **Bug Fixes:** resize font to account for more view sizes (6b3b46b)
* **Bug Fixes:** augment size of the font (1e13327)
* **Code Refactoring:** changed delta time calcualtion (ccf75f6)
* **Code Refactoring:** cleans up some of the structure of the PhysicsVariant (9964474, NEBV-1311)


### Dependencies

* **Bug Fixes:** update dependency dialog-polyfill to ^0.5.0 (629f9c8)
* **Project Maintenance:** update dependency css-loader to v2.1.1 (819a0a0)
* **Project Maintenance:** update dependency cz-customizable to v5.4.0 (a29f9ff)
* **Project Maintenance:** update dependency eslint to v5.15.1 (2ba4895)
* **Project Maintenance:** update dependency postcss-preset-env to v6.6.0 (8eafa32)
* **Project Maintenance:** update dependency react-test-renderer to v16.8.4 (cac831b)
* **Project Maintenance:** update dependency webpack to v4.29.6 (6dfa40e)
* **Project Maintenance:** update jest monorepo to v24.4.0 (415acf4)
* **Project Maintenance:** update node.js (5f9a168)
* **Project Maintenance:** update node.js to v10.15.3 (237c6bc)
* **Project Maintenance:** update storybook monorepo to v5 (ecd03f4)
* **Project Maintenance:** update storybook monorepo to v5.0.1 (06165d8)


### ESLint

* **Features:** makes ESLint check the .storybook folder and root level hidden files (2ee39ed)
* **Code Formatting:** amends object-curly-newline rule (5b74df5)
* **Code Formatting:** fixes all linting errors after changing config (e1156ef)
* **Code Formatting:** Fixes lint in the linter config so you can lint while you lint (fdf2156)
* **Project Maintenance:** adds linting for all code instead of just src (3bbb996)


### FeatureFlag

* **Features:** scales in proportion to the width that it is given (8f678a5, NEBV-1320)


### Footer, MainInfoBar

* **Features:** changes as per issues raised in PR (45d7bfd)


### Grid View1/2

* **Bug Fixes:** minor changes to grid and views to fit wet template (2ee5a3a)


### List

* **Features:** adds lodash.debounce to handle List scrolling events (26d298c)
* **Bug Fixes:** rewrite of debounce logic so it's actually being used (7c7de03)
* **Bug Fixes:** adds debug messages for testing (91acce8)
* **Bug Fixes:** throttles scroll input for consistent behavior (1444d2a)


### MainInfoBar

* **Features:** replaces hardcoded text with localization (a23c394)
* **Features:** resolves issues raised in PR (cd214b5)
* **Features:** moves state to Redux, adds collapse animation (5ed3890)
* **Features:** finishes implementing animation, moves collapsed state and cb to props (9fbd0ed)
* **Features:** moves props to global proptypes (b9a4590)
* **Features:** updates styling to match the design doc (b416d82)
* **Tests:** adds interaction tests, removes unusable tests after prev. commit (04265a2)
* **Tests:** adds component and interaction tests, fills out PropTypes (a9bd2f6)
* **Code Refactoring:** adds changes as per PR comments (16d59fa)
* **Code Refactoring:** moved inline SVG styles to CSS (fc2ded0)
* **Code Refactoring:** tweaks code style for consistency (e03fb5d)
* **Code Refactoring:** uses Intl's "values=" for interpolated text (c697a2a)
* **Documentation:** adds missing documentation, relocates Download styles (52922a5)
* **Documentation:** updates README, removes unused files (987d047)


### NPM

* **Project Maintenance:** fixes package-lock.json changing without package.json changes (e2ff3a2, NEBV-1293)


### package.json

* **Bug Fixes:** remove changes that were accidentally checked out (cc911b2)


### PhysicsVariant

* **Code Refactoring:** dOMHighResTimeStamp (7a5f1f0)


### ProjectMenu

* **Features:** Adjusts sizing to match design document (f3c9590, NEBV-1320)
* **Features:** adds vertical scaling (0b3762f, NEBV-1320)
* **Features:** selected bar is aligned properly (e01dec2, NEBV-1320)
* **Features:** scale grey project bars to container size (520e185, NEBV-1320)
* **Bug Fixes:** height fix (f025a6f)
* **Tests:** update snapshots (42a45cc, NEBV-1320)


### SearchBar

* **Features:** added searchContent reset position change, and fixed styles & tests (eab5bef)
* **Features:** lint fix for extra spacing (00dc27b)
* **Features:** implemented feedback (7a7ac63)
* **Tests:** added tests to improve code coverage (a1055fa)
* **Code Refactoring:** code style refactor and added props initialization in reset (2ef2416)


### Snapshots

* **Tests:** updates broken snapshots for stories that were changed (e57403b, NEBV-1293)


### Storybook

* **Bug Fixes:** replace viewport config with SB5 syntax (3285553)
* **Bug Fixes:** switches to SB5's new config format so we can build it (fdf933d)
* **Code Refactoring:** switch options to SB5 syntax, remove now-default values (2d502d3)
* **Documentation:** disables toolbar buttons that aren't needed (8b1c05a)
* **Documentation:** migrates from 4.x checkA11y to 5.x withA11y (275af95)
* **Documentation:** removes @storybook/addon-options (a1caf00)
* **Documentation:** resort introduction and documentation headings (ee1f6a0)
* **Documentation:** updates to new viewport syntax (06c6791)


### Styles

* **Bug Fixes:** resets headers to display: block (dce5d04, NEBV-1343)


### Test utils

* **Bug Fixes:** makes sure components have propTypes defined before testing them (ed58bb2)


### View 2

* **Features:** adds list interaction for ConditionDetails (097ce51)


### View 2/3

* **Features:** provides search keywords to ConditionDetails from props (aeabd2a)
* **Bug Fixes:** fixes misnamed prop (803e0e9)


### View 3

* **Bug Fixes:** fixes broken interactions, adjusts borders (551201c)


### ViewThree

* **Features:** adds border and header without additional DOM elements (d43b82e, NEBV-1316)


### ViewTwo

* **Bug Fixes:** fixes gridding of menu (2161ac9, NEBV-1320)


### wheel list

* **Features:** adds styling (bd21c51, NEBV-1293)
* **Features:** adds untested wheel list first crack (a2a1cb7, NEBV-1293)


### WheelList

* **Features:** adds interaction and wrap-around behavior (2e30e5e)
* **Features:** adds proper layout and cropping to wheel radius (f9fc180)
* **Features:** simplifies styling, fixes issues raised in PR (2ee46bf)
* **Bug Fixes:** corrects margin issue in previous commit (8961e90)
* **Bug Fixes:** fixes prop validation error in tests (a5dac4b)
* **Tests:** adds interaction testing, updates story and snapshots (cf9e6e2)
* **Code Formatting:** removes commented code, tidies up CSS (f0d076f)
* **Code Formatting:** removes references to old props (0d7e1cf)
* **Code Refactoring:** changes to a functional component (99da610)
* **Code Refactoring:** condenses render logic (7e08866)
* **Code Refactoring:** moves click handler into the class body to avoid re-declaring it (43aba83)
* **Documentation:** adds prop documentation (02ea76c)


## [0.2.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.2.1) (2019-03-01)


### App/view2 and 3

* **Bug Fixes:** fix header positioning (c9b8e45)


### app/views

* **Bug Fixes:** fix left margin (2535593)


### SearchBar

* **Code Refactoring:** refactored function (dd2c86a)
* **Documentation:** fixes bugs in storybook interactions (4e03c0c, NEBV-1320)


### View3, ConditionDetails

* **Features:** uses Redux actions for ConditionDetails, relocates mock data (fbd7fc6)


### viewTwo

* **Code Refactoring:** remove row styles (e42708c)
* **Code Refactoring:** remove styles for code consistency (5dce849)
* **Code Refactoring:** removed code for consistency with previous version (4e5a3a6)


### Visualization

* **Code Refactoring:** button styles fixed (2ebb55c)
* **Code Refactoring:** removed background color for buttons (a922861)
* **Code Refactoring:** Reset h tags in visualization (a84d2c9)

# [0.2.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.2.0) (2019-03-01)


### App

* **Features:** begin integration of Redux in App container (570e6cf, NEBV-1316)


### App/View2

* **Bug Fixes:** fix the moon and sun delightful rendering (e81b495)


### App/View3

* **Bug Fixes:** fix bubblechart indicator state on redux (bc0dac0)


### BarContainer

* **Features:** refactors BarContainer with simpler width/height logic (325a5bc, NEBV-1188)
* **Bug Fixes:** fixes undefined props from last commit (893cd12)
* **Tests:** updates snapshots (554741c)
* **Code Refactoring:** removes unused props, adds default values (ddc2da2)


### Browse By Reducer

* **Features:** fixes browseby reducer to work with valid structure (b103d83, NEBV-1320)


### BrowseByData

* **Features:** adds some mock data for the proptype stucture for company and location (4a6f829, NEBV-1320)


### BubbleChart

* **Features:** refactor indicator tracking before redux integration (a492f19, NEBV-1316)
* **Features:** uses design doc colours (944ab93, NEBV-1316)
* **Features:** combines InstrumentBubbles into one to support scaling (3438e44, NEBV-1316)
* **Features:** convert to using mock data (4f4ec6f, NEBV-1316)
* **Features:** use interaction for indicator/setIndicator logic (e269cd7, NEBV-1316)
* **Features:** adds scaling to viewport (a0d55c9, NEBV-1316)
* **Features:** reimplements drag support with event target attributes (d5c09b2, NEBV-1316)
* **Tests:** fixes all tests that were broken during refactors (85a0b1c, NEBV-1316)
* **Code Formatting:** inline logic instead of generating a function inside a map (4b1df2d, NEBV-1316)
* **Code Refactoring:** change as per PR requests (a7900ab)
* **Code Refactoring:** refactoring to simplify InstrumentBubble logic (4178ff0, NEBV-1316)


### BubbleChart and view3

* **Bug Fixes:** adapting to new redux config (3c33a33)


### BubbleChart/index, spec, d3calcs

* **Features:** add functionality to render based on the commodity type (7cf8d1d)


### BubbleChart/InstrumentBubble

* **Bug Fixes:** fix tests by adding limit of 8 decimals to transform, y, and M A (3d63eb1)


### BubbleChart/stories

* **Code Refactoring:** change knobs description (64e602d)


### Build

* **Project Maintenance:** removes local server in favour of storybook (b37988e, NEBV-1317)


### Company Wheel tempory data spoofing

* **Features:** adds temporary randomized data for location wheel (7ccca0c, NEBV-1320)


### CompanyWheel

* **Features:** integrates with ViewTwo stories (67fd46c, NEBV-1327)
* **Code Refactoring:** updated snapshots, and spelling fix (afd2f62, NEBV-1320)


### Component normalization and colours

* **Code Refactoring:** moved a function (f4a25a4)


### ConditionDetails

* **Features:** adds an interaction for toggling the details section (8e4b808)
* **Features:** updates styling to match design docs (06f664e)
* **Features:** updates styling to match the design doc (1bb53b3)
* **Features:** adds stories for Content, fixes merge issues (e059c69)
* **Features:** adds missing prop tests to Details (ba47bca)
* **Features:** adds stories for subcomponents, moves CSS out of the parent component (87779be)
* **Features:** adds more stories for subcomponents, continues refactoring (a473eb8)
* **Features:** updates styling to match the design doc (6f6211a)
* **Features:** adds basic tests for subcomponents (96174dd)
* **Features:** adds text localization (0ea88eb)
* **Features:** adds basic interactions, display of selected list item, and 'expanded' flag (ba52fee)
* **Features:** adds interaction tests (35c3497)
* **Features:** adds the More/Less button (81c6799)
* **Features:** updates styling, documentation, and dummy content (940f97b)
* **Features:** adds more details prop shapes, implements multiple colors for the condition (05b42d1)
* **Features:** fixes View 2 issues (02e9a85)
* **Features:** splits content text into paragraphs (20fbe76)
* **Features:** finishes move away from CSS grid, adds popout animation (78040b3)
* **Bug Fixes:** adds more detailed prop types to fix validation errors (a04fe08)
* **Bug Fixes:** keeps gray bar when the Details component has no content (cd5c037)
* **Bug Fixes:** fixes a TypeError in the dummy instrumentPopup function (f3463da)
* **Tests:** updates snapshots (09354ba)
* **Tests:** updates snapshots (4869212)
* **Tests:** adds tests for ProjectHeader subcomponent (fd7d874)
* **Tests:** adds interaction tests (f623e65)
* **Tests:** updates snapshots (071a5b6)
* **Tests:** updates snapshots (0fa34dc)
* **Tests:** updates snapshots, fixes prop validation errors (af944fd)
* **Tests:** adds testing for single/multiple bar colors (f25fc07)
* **Tests:** adds another test for the toggle button (d4318b0)
* **Code Formatting:** removes commented code (7363c58)
* **Code Refactoring:** adds initial state to stories with interactions (25daea4)
* **Code Refactoring:** extracts several subcomponents (c5262b6)
* **Code Refactoring:** fixes naming and linting issues (95f32f3)
* **Code Refactoring:** moves off of CSS Grid in favor of block positioning (242b130)
* **Code Refactoring:** removes abandoned code in the /app folder (a307b9c)
* **Code Refactoring:** removes state, gets event handler data from props instead (a08ecef)
* **Code Refactoring:** rename vague data field, use CSS to size the list items (f36bd82)
* **Code Refactoring:** replaces invalid use of h4s with tagged spans (73cd6c4)
* **Code Refactoring:** stores data for its callback in state rather than as data attributes on (8e825f4)
* **Code Refactoring:** uses classNames and a default style in place of boolean classes (7a60a3c)
* **Code Refactoring:** uses keyed arrays instead of spreading elements into a Fragment (dbe4198)
* **Documentation:** adds documentation for the subcomponents (1b0a046)
* **Documentation:** adds note about missing animation (57175c1)


### ConditionExplorer

* **Bug Fixes:** fix componentDidMount crash in Firefox (bb3ef69, NEBV-1263)


### Conditions build

* **Features:** adds scripts to run build (88bb1ce, NEBV-1317)


### Container View Two

* **Features:** added Dropdown Component (745b409)


### Data

* **Features:** rename `standard` to `type` to match design doc (8e232a1, NEBV-1316)
* **Features:** rename `timing` to `phase` to match design doc (3176fe3, NEBV-1316)


### Dependencies

* **Project Maintenance:** pin dependencies (278f89b)
* **Project Maintenance:** update babel monorepo to v7.3.3 (99bc48d)
* **Project Maintenance:** update babel monorepo to v7.3.4 (5821fb8)
* **Project Maintenance:** update dependency commitizen to v3.0.6 (372b4a1)
* **Project Maintenance:** update dependency commitizen to v3.0.7 (40f9f63)
* **Project Maintenance:** update dependency cssnano to v4.1.10 (c355d4f)
* **Project Maintenance:** update dependency enzyme-adapter-react-16 to v1.10.0 (960d8ae)
* **Project Maintenance:** update dependency eslint to v5.14.1 (f3f8c86)
* **Project Maintenance:** update dependency jest-junit to v6.3.0 (8c7907b)
* **Project Maintenance:** update dependency postcss-preset-env to v6.6.0 (8eafa32)
* **Project Maintenance:** update dependency react-test-renderer to v16.8.2 (afa6c5f)
* **Project Maintenance:** update dependency react-test-renderer to v16.8.3 (9fd984f)
* **Project Maintenance:** update dependency storybook-addon-interaction to v0.1.4 (7f2cdcd)
* **Project Maintenance:** update dependency storybook-addon-intl to v2.4.0 (235a51a)
* **Project Maintenance:** update dependency webpack to v4.29.5 (1cef8a1)
* **Project Maintenance:** update dependency webpack to v4.29.6 (6dfa40e)
* **Project Maintenance:** update dependency webpack-dev-middleware to v3.6.0 (c4b5506)
* **Project Maintenance:** update storybook monorepo to v4.1.12 (df336e3)
* **Project Maintenance:** update storybook monorepo to v4.1.13 (67a2452)


### Deploy

* **Bug Fixes:** Very dirty hacks to get it working in the WET template (c6805a5)


### Dropdown

* **Features:** added public dropdown component (7a85755, NEBV-1307)
* **Tests:** refactored tests (e39ac44, NEBV-1307)


### ESLint

* **Features:** fixes linting errors from colour and mockdata changes (05d3951, NEBV-1316)


### Feature types description and redux reducer

* **Bug Fixes:** fixes linting error on feature types description a (cb85dff, NEBV-1316)


### FeatureDescription

* **Features:** adds redux integration with translations (74c446d, NEBV-1316)


### FeatureFlag

* **Features:** uses design doc colours (3b1eb11, NEBV-1316)


### FeaturesLegend

* **Features:** uses design doc colours (7f88340, NEBV-1316)


### FeaturesMenu

* **Features:** use constants for features instead of accepting a prop (7b6c43c, NEBV-1316)


### FeatureTypesDescription

* **Features:** adds missing translation entries for features (d76e06f, NEBV-1316)
* **Features:** integrates with ViewThree and constants (1ecf052, NEBV-1316)


### GraphQL

* **Features:** preps StreamGraph for GraphQL data (39e264c, NEBV-1316)


### Instrument Chart

* **Features:** adds mockData to be used by the instrument bubbles (2c07925, NEBV-1316)


### Instrument Legend and Small Multiples interactions on story

* **Features:** adds interactions on storys (ad437e8, NEBV-1316)


### instruments bubble legend

* **Features:** adds offset for min ellipsis radius (ba93ef4, NEBV-1284)
* **Features:** adds min size for ellipsis and takes logic out of render (7310c3e, NEBV-1284)
* **Bug Fixes:** fixes radius logic (73b754a, NEBV-1284)
* **Code Refactoring:** adds transform in group tag (b68eecd, NEBV-1284)
* **Project Maintenance:** adds packages (1113e4e, NEBV-1284)


### Instruments Legend

* **Features:** adds data support for Instruments legend component WITHOUT TESTS (770d0f7, NEBV-1316)
* **Bug Fixes:** fixes bug with list not tracking the selected sub feature (d978b17, NEBV-1316)
* **Tests:** adds updated tests to support new data (156e847, NEBV-1316)


### InstrumentsLegend

* **Features:** uses design doc colours (06e2411, NEBV-1316)


### Jest

* **Project Maintenance:** fixes Jest not detecting storybook snapshots (8f45350)
* **Project Maintenance:** support Jest 24 breaking changes to configuration (2117746)


### Legend item stories

* **Bug Fixes:** fixes interactions on story items (571fa98, NEBV-1316)


### List

* **Features:** implements scrolling (54057d9)
* **Tests:** updates snapshots (171b462)
* **Code Formatting:** adjusts component formatting and extra data-selected prop (9e7afda, NEBV-1318)
* **Code Refactoring:** switches to a class component, removes onWheel from the render method (ffe88f2)


### NPM

* **Project Maintenance:** removes unused dependencies following server cleanup (316ab44, NEBV-1317)
* **Project Maintenance:** reverts package-lock.json changes (0373a92)
* **Project Maintenance:** update React/React-DOM to 16.8.3) (64933d0)


### Package lock conflict

* **Bug Fixes:** fixes the package lock json conflict (34b1f1b)


### Project data

* **Code Refactoring:** adds additional structure to projects proptype data (23f3b96, NEBV-1320)


### Proptypes

* **Features:** adds proptype structure for mocking wheel and project menu data (0434aad, NEBV-1320)


### PullToSpin spec.js.snap

* **Code Refactoring:** update rendering viewbox and update snapshot (d2b18ea)


### redux

* **Code Refactoring:** changes to intial states in search action (f6bd0e6, NEBV-1285)


### Redux

* **Features:** refactors action creators and tests for better clarity (993234b, NEBV-1320)


### redux/selected

* **Features:** fixes state generating incorrect keys and renames creators (e0e419d, NEBV-1316)


### RegionConditionSummary

* **Features:** uses design doc colours (f9d052c, NEBV-1316)


### SCSS

* **Features:** moves Feature colours into JS and imports into SCSS (b80bd14, NEBV-1316)


### SCSS variables

* **Features:** adds a variable for Fira Sans Condensed Bold (df39b76)


### Search

* **Tests:** remove failing test temporarily (7b7d3ef)
* **Code Refactoring:** update snapshot (18c813b)


### SearchBar

* **Features:** added prompt position change based on input focus (0f32ca7, NEBV-1308)
* **Features:** integrated searchBar with filter functionality (728f929, NEBV-1320)
* **Features:** updated snapshots (a98093a, NEBV-1308)
* **Features:** fixed PR comments (40f1502, NEBV-1308)
* **Features:** fixed PR comments (2053662, NEBV-1308)
* **Features:** improved suggestedKeyword arrow design (cd663bb, NEBV-1304)
* **Features:** added display of text on highlight (1f503ba, NEBV-1259)
* **Features:** added sort functionality, refactored proptypes, and added tests (e63684c, NEBV-1279)
* **Features:** added dropdown component for advanced search (ad88485, NEBV-1282)
* **Features:** normalized data and connected with storybook interaction (92620c3, NEBV-1308)
* **Features:** integrating searchbar components (d022654, NEBV-1308)
* **Features:** added searchbar component and trends button without styling (128e9f3, NEBV-1320)
* **Bug Fixes:** prop names fix to avoid prop name conflict during testing (d54adbb, NEBV-1282)
* **Bug Fixes:** reduced function calls, improved styles (69fcf9c, NEBV-1282)
* **Bug Fixes:** fixed bug with search popout (312e9cf, NEBV-1308)
* **Bug Fixes:** fixed rendering issue in storybook filterContent (b64233c, NEBV-1308)
* **Bug Fixes:** storybook props and naming fix (611116d, NEBV-1308)
* **Tests:** fixed test issues with propTypes (7098f58, NEBV-1308)
* **Code Formatting:** changed additional comments in colors styles (ddd3c29, NEBV-1304)
* **Code Formatting:** fixed linting error (f566e8d, NEBV-1279)
* **Code Formatting:** improved css styles (2198406, NEBV-1304)
* **Code Formatting:** removed extra div (3ff8501, NEBV-1304)
* **Code Refactoring:** added tests, and refactored code style from indexOf (7f26515, NEBV-1282)
* **Code Refactoring:** change proptypes to required, and simplify dropdown onchange (01cf6d9, NEBV-1282)
* **Code Refactoring:** change to internal state and data consistency with redux (c2d62cc, NEBV-1282)
* **Code Refactoring:** changed code to improve readability (398c8b9, NEBV-1282)
* **Code Refactoring:** changed stories code and styles (7a80d85, NEBV-1282)
* **Code Refactoring:** changed styles and simplified formattedMessage (1e5490e, NEBV-1304)
* **Code Refactoring:** changed translations,function arguments, classNames (b91b249, NEBV-1279)
* **Code Refactoring:** implemented PR feedback (6624aa6, NEBV-1259)
* **Code Refactoring:** improved actions in stories.jsx (043f96b, NEBV-1259)
* **Code Refactoring:** integrated dropdown component (d321159, NEBV-1282)
* **Code Refactoring:** propTypes change and tests update (0cd4b1d, NEBV-1279)
* **Code Refactoring:** refactored code and implemented feedback (25ae385, NEBV-1304)
* **Code Refactoring:** refactored code for react consistency, and improved test coverage, and reduce u (1b87356, NEBV-1282)
* **Code Refactoring:** refactored data structure for keywords (f02bf35, NEBV-1279)
* **Code Refactoring:** refactored sort and hierarchy to internal state (9b1c881, NEBV-1259)
* **Code Refactoring:** refactored suggestionWindow into a seperate keywords component (bd4ffac, NEBV-1259)
* **Code Refactoring:** refactored translations for french, and dropdown component (d400e4f, NEBV-1282)
* **Code Refactoring:** refactored translations, styles, and text transform styles (181f892, NEBV-1282)
* **Code Refactoring:** renamed components (9eea467, NEBV-1259)
* **Code Refactoring:** simplified keywordsText code and styles (4f7f06f, NEBV-1304)
* **Code Refactoring:** updated props passed in, and simplified code (f5448aa, NEBV-1308)
* **Code Refactoring:** updated unused tests and simplified logic (318fb4c, NEBV-1282)


### ShortcutInfoBar

* **Code Refactoring:** inlines rendering and simplifies logic (21631cd, NEBV-1263)


### Small Mulitples Legend

* **Features:** adds a selected sub feature to the stream graph and filters project da (ed0687a, NEBV-1316)


### Small Multiples Legend

* **Features:** adds selected subFeature tracking (f18b9fa, NEBV-1316)
* **Features:** adds new data and filter for legend items and conditionally renders in (412c4c2, NEBV-1316)


### SmallMultiplesLegend

* **Features:** uses design doc colours and mockData (0648dbd, NEBV-1316)
* **Code Refactoring:** refactors to use a class and always render all (bdfeeca, NEBV-1316)


### Snapshots

* **Bug Fixes:** fixes out of date snapshots (9ec57e8, NEBV-1320)


### Storybook

* **Bug Fixes:** storybook decorator rearrangement for css styles (eae6fa2)
* **Tests:** updated spec snapshot (de4adae)


### storybook-addon-interaction

* **Project Maintenance:** updates to fix bug with storyshots not detecting story changes (9a1e06f, NEBV-1316)


### Stream Graph

* **Features:** adds sub feature filter to the chart method (498ceae, NEBV-1316)
* **Features:** adds feature filter for the project data (80fb803, NEBV-1316)


### streamgraph

* **Code Refactoring:** lint issue cleanup (edb0038)


### StreamGraph

* **Features:** fixes proptypes issues with streamOnly mode (74ad28d, NEBV-1315)
* **Features:** fixes tests and adds proper colours for StreamGraph (e0c073b, NEBV-1316)
* **Code Formatting:** fixes capitalization to always be capital-S, capital-G (6e47825, NEBV-1315)


### TrendButton

* **Features:** added instrument bubble , styles, and removed unused images (2103bcb, NEBV-1315)
* **Features:** small adjustment to StreamGraph sizing in TrendButton (2ea4606, NEBV-1315)
* **Features:** adds more styling to BubbleChart in TrendButton (59aa80d, NEBV-1315)
* **Features:** adds more styling to StreamGraph in TrendButton (738b340, NEBV-1315)
* **Bug Fixes:** fix focus on click for streamgraph (50db880)
* **Bug Fixes:** improved styling to better incorporate streamgraph (9503edb, NEBV-1315)
* **Bug Fixes:** fixed outline issue on focus and simplified css styles (b5db36c, NEBV-1315)
* **Code Formatting:** changed code and tests styling (8a7caf5, NEBV-1315)
* **Code Refactoring:** changed proptypes to better match incoming graphQL data (33fefaa, NEBV-1315)
* **Code Refactoring:** changed styles to use variables instead of hex color codes (d777204, NEBV-1315)
* **Code Refactoring:** refactored code to match improved design doc (67cec9b, NEBV-1315)
* **Code Refactoring:** refactored with mock data (52e492f, NEBV-1315)
* **Documentation:** updated readme and storybook (7eb10be, NEBV-1315)


### View 2, SearchBar

* **Features:** makes SearchBar display over-top of the view (b3cdf7f)


### View 3

* **Features:** updates snapshots (e2139b8)
* **Features:** fixes errors from merge (3754378)
* **Features:** update styling to better match the design doc (4adef84)
* **Features:** update styling to better match the design doc (2860555)
* **Features:** updates styling to better match the design doc (b837eab)
* **Features:** updates styling to better match the design doc (452c81b)
* **Features:** adds basic ConditionDetails to the view (a67b43a)
* **Features:** updates styling to better match design doc (d144d14)


### View 3 Components

* **Bug Fixes:** fixes linting issues (92a9ab0, NEBV-1316)


### View 3 storybook

* **Bug Fixes:** fixes view 3 storybook to use valid mock data (5cb0522, NEBV-1316)


### View 3, Condition Details

* **Features:** updates styling to fit in the View, adds popout interaction (ea5c6de)


### View 3, ConditionDetails

* **Features:** makes ConditionDetails scaleable to fit the container (a86d45f)


### View 3, StreamGraph

* **Features:** updates styling to better match design doc (f9a40a4)


### View Containers

* **Features:** fixes grids in IE11 (8c9326d, NEBV-1263)
* **Features:** adjusts sizing and layout of grids (9404ce3, NEBV-1263)
* **Features:** list views in order of usage in Storybook (c8b560e, NEBV-1263)
* **Features:** refactors ViewThree to control components (e89c733, NEBV-1263)
* **Features:** refactors ViewThree to control components (7ea518a, NEBV-1263)
* **Features:** refactors ViewTwo to control components (243f795, NEBV-1263)
* **Features:** refactors ViewOne to control components (4f92612, NEBV-1263)
* **Documentation:** fix markdown checkboxes and viewport (b422838, NEBV-1263)


### View Two

* **Features:** connects View two to redux store and connects action creators (f565bd1, NEBV-1320)


### View2

* **Bug Fixes:** fix proptypes linting error (02108b7)


### View3

* **Bug Fixes:** fix no indicator on bubble chart (9ce778e)


### View3/BubbleChartIndicator

* **Bug Fixes:** fix indicator on view3 (1324995)


### ViewOne

* **Features:** updates sizing to match design doc (6acc730, NEBV-1263)
* **Features:** adds missing translations (f91e580, NEBV-1263)
* **Code Refactoring:** add back the onclick noop handler for the browsebybtn (8c6b1c4)


### Views

* **Features:** fixes views to use design doc colours and enums (0311f21, NEBV-1316)


### ViewThree

* **Bug Fixes:** fix props for BubbleChart (d04a82b, NEBV-1316)


### ViewTwo

* **Bug Fixes:** fixes PR concerns (96a66cf, NEBV-1320)
* **Code Refactoring:** switch back the selectRay to a function (e3f1f7e)


### WebPack

* **Project Maintenance:** fixes build system importing ES modules into an unsupported environment (42ffc1d)


### Wheel

* **Features:** added company rendering on list and stop wheel animation instantly capabilities (6cdf709)
* **Features:** added stop trigger as per design doc specs (f0e1ff0)
* **Code Refactoring:** refactoring functions cause Josh said so (511197d)


### wheel list

* **Features:** adds styling (bd21c51, NEBV-1293)
* **Features:** adds untested wheel list first crack (a2a1cb7, NEBV-1293)
* **Documentation:** adds readme doc (3f4a64d, NEBV-1293)
* **Project Maintenance:** update package-lock (683dbd6, NEBV-1263)


### Wheel PullToSpin

* **Bug Fixes:** autosize and render of location bars implemented (9f4c6b2)


### Wheel PullToSpin WheeRay

* **Bug Fixes:** fixes PullToSpin resize w container, Wheel sizing and tests (662b261)


### Wheel Ring PullToSpin

* **Code Refactoring:** change css, Adjust readme to match TODO, adjust WheelRay to match c (50c2b6f)


### Wheel/PullToSpin, WheelRay

* **Code Refactoring:** modified according to PR suggestions (e3532ac)


### WheelList

* **Features:** adds proper layout and cropping to wheel radius (f9fc180)
* **Features:** adds interaction and wrap-around behavior (2e30e5e)
* **Tests:** adds interaction testing, updates story and snapshots (cf9e6e2)
* **Code Refactoring:** moves click handler into the class body to avoid re-declaring it (43aba83)
* **Documentation:** adds prop documentation (02ea76c)


* **Code Refactoring:** fixes failing tests following enum changes (3425796, NEBV-1316)


### WheelRay

* **Bug Fixes:** fixes alignment direction and 0 coordinates index to item map (62b17c5)
* **Bug Fixes:** fix rendering index from 360 to 0 (a654f0c)
* **Documentation:** add todo for magic number (1813bac)


### WheelRay update readme

* **Documentation:** update readme, lint errors (661a496)


### BREAKING CHANGES

* **Wheel PullToSpin WheeRay:** deleted WheelRayLegend

# [0.1.0](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.1.0) (2019-02-13)


### 1263 Grid & Scroll plus  View containers

* **Features:** this is the architectural documents for the views (512a5f3)


### 1263 Grid and Scrolling

* **Features:** archtiecture of views (3482d6e)


### about text box

* **Code Refactoring:** jest conversion (3e5bed5, NEBV-1195)


### addon-interaction

* **Documentation:** moves storybook-addon-interaction into separate repository (badd480)


### Addon/interaction

* **Documentation:** adds easier API and loading indicator (43e0795)
* **Documentation:** indicates if interactions aren't used (c203182)
* **Documentation:** remove faulty loading indicator (d10dff6)
* **Documentation:** rename getProps to getInteractionProps (6258742)
* **Documentation:** renames addon-state-reducer to addon-interaction (ab9167b)


### Addon/State

* **Documentation:** adds WIP state/action addon for storybook (36260d8)


### Addon/state-reducer

* **Documentation:** adds babel for addon and sets up package (6c1d476)
* **Documentation:** adds state and action logging (b93519c)
* **Documentation:** removes old code (27e707a)


### Architect Containers

* **Documentation:** fixed change requests (24bbc69)


### Architect Grid and Views

* **Documentation:** change requests done (2fc439a)


### Architect the view containers and the footer container

* **Documentation:** the documents describe the requirement (0f1ade7, NEBV-1263)


### architect the views and the footer.

* **Features:** add the requirements for all of the views and the footer (63e4fde)


### Archtiect App Container

* **Documentation:** add a new component: App Container' (c6fd277)


### BarContainer

* **Tests:** updates tests to use Jest (17dacab)
* **Code Formatting:** renames index.*.jsx to *.jsx (d9f68ca)


### BarContainer component

* **Features:** A container for multiple recangles (5a53462)


### BitBucket Pipelines

* **Project Maintenance:** removes unused bitbucket pipelines config (54e8904)


### BrowseByBtn

* **Features:** adding the BrowseByBtn, architect and prototype (2a388b8, NEBV-1264)
* **Code Refactoring:** matches PR suggestions (1737103)


### BrowseByBtn and english.json

* **Code Refactoring:** implement internationalization and tweak wording as per desi (a3aaf04)


### BrowseByBtn index and stories

* **Bug Fixes:** modifies the story to add a simulation of the parent toggle depe (13bc1fd)


### BrowseByBtn spec.jsx

* **Bug Fixes:** remove unnecessary nesting of browsebybtn on the test description (21b35b6)
* **Code Refactoring:** refactor test to match jest implementation (5b748ea)


### BrowseByBtn/index

* **Code Refactoring:** implement rendering function parsedmessage (fa5c330)


### bubble chart, chart indicator, circle container

* **Code Refactoring:** updated readme docs and added knobs to ci (76988d6, NEBV-1273)


### bubble legend

* **Features:** adds fixes from pr (c9987e8, NEBV-1284)
* **Code Refactoring:** move to src file (5532136)
* **Documentation:** adjusted requirements according to feedback (cb32fb9, NEBV-1284)
* **Documentation:** fix requirements from pr input (97de152, NEBV-1284)


### Bubble Legend

* **Documentation:** readme doc architecting out component requirements (7bd3971, NEBV-1284)


### BubbleChart

* **Features:** added label, fixed drag interaction, styled code (ed990f0, NEBV-1258)
* **Features:** shifted text display, and improved styling (b7a5d03, NEBV-1232)
* **Features:** added initial implementation for onClick interaction (425a489, NEBV-1258)
* **Features:** adds more language support to the bubble chart component (477983f, NEBV-1262)
* **Features:** added keyboard interaction and initial drag interaction (df69360, NEBV-1258)
* **Bug Fixes:** added indicator state for tests (ca05ae6, NEBV-1258)
* **Bug Fixes:** renamed stories file and increased svg size (d1fc5b2, NEBV-1232)
* **Bug Fixes:** updated props, storybook, and jest conversion (280849d, NEBV-1258)
* **Bug Fixes:** fixed storybook display (1dc2513, NEBV-1258)
* **Bug Fixes:** changed from returning null (99269e9, NEBV-1258)
* **Bug Fixes:** fixed existing tests and removed unused props (8a22198, NEBV-1258)
* **Bug Fixes:** fixed storybook rendering issue with chart indicator (3bfd2cd, NEBV-1258)
* **Bug Fixes:** storbook rendering for instrument bubble (467c0dd, NEBV-1258)
* **Bug Fixes:** chartIndicator display fix (436d728, NEBV-1258)
* **Bug Fixes:** changed stories to reflect the appropriate variables (681cf84, NEBV-1258)
* **Tests:** added keypress tests (270fe0a, NEBV-1258)
* **Tests:** Improved testing coverage (c40b7c2, NEBV-1232)
* **Tests:** added additional tests to increase codecoverage (f2647f6, NEBV-1258)
* **Tests:** added test for chartIndicator position (9f4a364, NEBV-1258)
* **Tests:** added test to detect chartIndicator (e3b39a1, NEBV-1258)
* **Code Formatting:** changed code style and rearranged variables (bd706f3, NEBV-1258)
* **Code Formatting:** fixed linting error for comma (7ad4ca7, NEBV-1258)
* **Code Formatting:** fixed styles and removed unused tabIndex (a49bc1d, NEBV-1232)
* **Code Formatting:** Removed console statements (1351afc, NEBV-1232)
* **Code Refactoring:** added props, reduced duplicate code (0e32c4b, NEBV-1258)
* **Code Refactoring:** added scss file and ternary (7479043, NEBV-1232)
* **Code Refactoring:** altered file location for d3Calculation, refactored code (3555852, NEBV-1258)
* **Code Refactoring:** changed from map function to reduce function (0b62bb1, NEBV-1258)
* **Code Refactoring:** changed instrumentBubble and bubbleChart (e2ce267, NEBV-1258)
* **Code Refactoring:** refactored to cleaner code, and added edge cases for keypress (81013eb, NEBV-1258)
* **Code Refactoring:** removed duplicate code, styled sentences, changed type of variable (3527807, NEBV-1258)
* **Documentation:** added prop explanation in Readme (2e2fff3, NEBV-1258)
* **Documentation:** updated readme docs (fc87d39, NEBV-1258)
* **Documentation:** updated readme file (3f2a650, NEBV-1232)


### Changed folder name from 'app' to 'src'

* **Documentation:** changed the base folder name from 'app' to 'src' to d (d688117)


### ChartIndicator

* **Features:** merges ChartIndicator and Control components (7136575, NEBV-1209)
* **Documentation:** tweaks story knobs to provide additional context (2f48bd8)


### Company Wheel and Pull to spin

* **Bug Fixes:** fixes the imports for the spring library (e1ee88a)


### CompanyWheel and WheelRay

* **Features:** rough implementation of company wheel animation (805c211)


### CompanyWheel WheelRayLegend

* **Tests:** adding tests for reservation of the degrees in the wheel (3f604de)


### CompanyWheel, PullToSpin components

* **Bug Fixes:** rename story and tests to new specs (917878b)


### component BarContainer

* **Features:** changed multiple files for change requests (6e07156)
* **Features:** fixed propType errors in tests (6ff0874)
* **Features:** fixed change request issues (5fa2d91)
* **Features:** added new null test, changed render flow (062f229)
* **Features:** removed a not needed prop (a4e2920)
* **Features:** forgot 2nd eslint ignore (b5574aa)
* **Features:** fixed linting issues (31e1bbe)
* **Features:** made change requests (8db812a)
* **Features:** Added the README files for the compoenents and the version status for (c11b1c4)
* **Features:** holds multiple bars (3be36cb)
* **Features:** general container for bar shapes (acdd9dd)


### component ConditionDetails

* **Features:** added the requirements docs, and changed the component structure (7de059f)


### component Grid

* **Features:** added views for the grid (f5778b3)
* **Features:** cSS Grid for view, and autoprefixer (1156f99)


### component Grid and GridItem

* **Features:** this component will be the basic grid layout for the views and co (4bab6e2)


### component template spec

* **Code Refactoring:** change to update to jest (ab685e1)


### ConditionDetails

* **Features:** displays condition information, fixes linting errors (dc69c03)
* **Features:** displays list of condition bars (09fafec)


### ConditionExplorer

* **Features:** adds initial test of Matter.js physics (3bb46ef, NEBV-1271)
* **Features:** adds French characters to text sizing (acdb3ed, NEBV-1271)
* **Features:** adds bars for keywords (8cf43eb, NEBV-1271)
* **Features:** improves collisions and resetting placeholders (3757152, NEBV-1271)
* **Features:** first-pass resetting of placeholder positions (8e46837, NEBV-1271)
* **Features:** adjusts positioning of text and outline (d0fe300, NEBV-1271)
* **Features:** adds basic placeholder and text physics logic (52d854b, NEBV-1271)
* **Features:** adds draggable circle that exposes keywords (3c8f06e, NEBV-1271)
* **Features:** adds keyword hover transitions and fonts (82e98e0, NEBV-1271)
* **Features:** adds random (memoized) keyword placeholder fill (b08c6ed, NEBV-1271)
* **Features:** adds better circle/rect collision detection (5403fff, NEBV-1271)
* **Features:** improves drag handling when moving fast (1a3b1b3, NEBV-1271)
* **Features:** adds initial word-packing logic for condition keywords (7e172d6, NEBV-1271)
* **Bug Fixes:** remove spec.jsx to solve merge and pipe conflict (368e0af)
* **Tests:** updates snapshots and prevents getBBox Jest crash (70df3a1, NEBV-1271)
* **Project Maintenance:** adds additional keywords to fill out story (206ad7d, NEBV-1271)
* **Project Maintenance:** Better proptypes for keywords (75f75a7, NEBV-1271)
* **Project Maintenance:** Split ConditionExplorer into Physics and Fallback components (1d11c58, NEBV-1271)


### ConditionExplorer refactor

* **Code Refactoring:** split into private components (4448c00)


### Conflicts

* **Bug Fixes:** accidentially commit some conflicts (c1d9297, NEBV-1262)


### control

* **Code Refactoring:** changed to a functional component (3df819b, NEBV-1209)
* **Code Refactoring:** remove duplicate component (850a88d, NEBV-1273)


### Controller

* **Features:** added Initial code (ecf7f8c, NEBV-1260)
* **Features:** added circle feature for BubbleChart and text (58d396d, NEBV-1260)
* **Features:** added option to include/exclude circle for compatability (857308e, NEBV-1260)
* **Bug Fixes:** fixes the nested svgs to use g tag for rendering (bf94e19, NEBV-1260)
* **Bug Fixes:** fixed storybook issue with rendering and styles (d0f53a9, NEBV-1260)
* **Bug Fixes:** fixed chartIndicator className test (19c2d32, NEBV-1260)
* **Tests:** added texts to improve coverage (c829125, NEBV-1260)
* **Code Formatting:** changed styling to remove linting errors (f4322f9, NEBV-1260)
* **Code Refactoring:** changed component name, style changes (867c98f, NEBV-1260)
* **Code Refactoring:** changed the name to ChartIndicator and fixed linting error (f0e612a, NEBV-1260)
* **Code Refactoring:** refactored tests and code (4a6620e, NEBV-1260)


### Dependencies

* **Bug Fixes:** update dependency react-spring to v8 (c689b33)
* **Project Maintenance:** pin dependencies (33eb16b)
* **Project Maintenance:** pin dependencies (ccfdfbd)
* **Project Maintenance:** update all dependencies to latest versions (6bf5226)
* **Project Maintenance:** update babel monorepo (ef112ab)
* **Project Maintenance:** update dependency @babel/plugin-proposal-object-rest-spread to v7.3.2 (82b3524)
* **Project Maintenance:** update dependency babel-plugin-macros to v2.5.0 (ad14ef8)
* **Project Maintenance:** update dependency babel-plugin-react-docgen to v2.0.2 (1c32955)
* **Project Maintenance:** update dependency codecov to v3.2.0 (55dbc74)
* **Project Maintenance:** update dependency enzyme-adapter-react-16 to v1.8.0 (6a9fdc7)
* **Project Maintenance:** update dependency enzyme-adapter-react-16 to v1.9.1 (2fa44c3)
* **Project Maintenance:** update dependency eslint to v5.12.1 (767ed14)
* **Project Maintenance:** update dependency eslint to v5.13.0 (617cc1b)
* **Project Maintenance:** update dependency eslint-plugin-import to v2.15.0 (5a7c4a6)
* **Project Maintenance:** update dependency eslint-plugin-import to v2.16.0 (338f90b)
* **Project Maintenance:** update dependency eslint-plugin-jsx-a11y to v6.2.0 (52328fa)
* **Project Maintenance:** update dependency eslint-plugin-jsx-a11y to v6.2.1 (c2a9f31)
* **Project Maintenance:** update dependency eslint-plugin-react to v7.12.4 (a8a0bf1)
* **Project Maintenance:** update dependency jest-junit to v6.1.0 (5dbee82)
* **Project Maintenance:** update dependency jest-junit to v6.2.1 (abb6e04)
* **Project Maintenance:** update dependency react-test-renderer to v16.8.1 (0e909fb)
* **Project Maintenance:** update dependency storybook-addon-interaction to v0.1.0 (7905f7f)
* **Project Maintenance:** update dependency storybook-addon-interaction to v0.1.1 (abb50b6)
* **Project Maintenance:** update dependency storybook-addon-interaction to v0.1.2 (8b23a5e)
* **Project Maintenance:** update dependency storybook-addon-interaction to v0.1.3 (75cf0df)
* **Project Maintenance:** update dependency storybook-readme to v4.0.5 (52b3bce)
* **Project Maintenance:** update dependency webpack to v4.28.4 (d8b407d)
* **Project Maintenance:** update dependency webpack to v4.29.0 (c1daa31)
* **Project Maintenance:** update dependency webpack to v4.29.1 (cc5de37)
* **Project Maintenance:** update dependency webpack to v4.29.3 (8086936)
* **Project Maintenance:** update dependency webpack-dev-middleware to v3.5.1 (eea26f7)
* **Project Maintenance:** update dependency webpack-dev-middleware to v3.5.2 (4a7ce16)
* **Project Maintenance:** update node.js (6ef47fd)
* **Project Maintenance:** update node.js (32d9a11)
* **Project Maintenance:** update storybook monorepo to v4.1.11 (2984945)
* **Project Maintenance:** update storybook monorepo to v4.1.6 (c44e7a4)
* **Project Maintenance:** update storybook monorepo to v4.1.7 (ebc7544)
* **Project Maintenance:** update storybook monorepo to v4.1.9 (72b0d83)


### ESLint

* **Code Formatting:** autofixes linting errors from jest-codemod (50cc3f3)
* **Code Formatting:** fixes linting errors introduced by package updates (7805ccb)
* **Project Maintenance:** uses more specific glob to avoid linting JSON (28eeb08)


### Feature Description

* **Tests:** adds test coverage for the heading (e8eedb1, NEBV-1262)


### Feature Flag

* **Tests:** fixes for feature flag and intl tests (4e03192, NEBV-1262)


### features legend

* **Code Refactoring:** add changes for location wheel legend and added test (72e57fd, NEBV-1266)
* **Code Refactoring:** changed footer to a variable (c178a48, NEBV-1266)
* **Code Refactoring:** rename project legend to features legend (954eb25, NEBV-1266)


### FeaturesMenu

* **Features:** Added translation to the titles (615ccff, NEBV-1262)
* **Tests:** fixup tests for component refactor (c7afb49, NEBV-1262)
* **Documentation:** fixes story for selected prop (ac68422)


### FeaturesMenu tests

* **Code Refactoring:** removes unused import (5260f27)


### FeatureTypeDescription

* **Features:** adds a blank component from _template (168ec81)
* **Features:** adds Jest tests (42b77c2)
* **Features:** adds color coding to the Instrument codes (b7c8471)
* **Features:** show feature-specific content (0e1c743)
* **Features:** adds a blank component from _template (81f4ee8)
* **Features:** adds Jest tests (0b49f6f)
* **Features:** adds color coding to the Instrument codes (8e9879c)
* **Features:** show feature-specific content (03f5ace)
* **Code Refactoring:** refactors the component and fixes linting errors (90022d2)
* **Code Refactoring:** refactors the component and fixes linting errors (617b818)
* **Documentation:** adds README text (9ebea02)
* **Documentation:** adds README text (657280b)


### FeatureTypesDescription

* **Features:** adds scrolling to headings based on a given prop (9216be7)
* **Features:** adds scrolling to headings based on a given prop (bbeba42)
* **Features:** adds French placeholders for type descriptions (dc00c94)
* **Features:** adds French placeholders for type descriptions (6e3ee23)
* **Bug Fixes:** fixes a broken story knob (b3c9aa2)
* **Bug Fixes:** update snapshots, fix React build warnings (18c09cc)
* **Tests:** adds a test for forced scrolling (f5cd3d4)
* **Tests:** adds a test for forced scrolling (376df4d)
* **Code Formatting:** moves component files to /app to match changes in dev branch (9470747)
* **Code Formatting:** moves component to /src to match changes in development branch (106967b)
* **Code Formatting:** removes commented or unused code (d543db0)
* **Code Formatting:** removes unused/unnecessary test code (d368713)
* **Code Refactoring:** condenses methods and JSX, removes unnecessary test code (073ded6)
* **Code Refactoring:** moves the element creation to a separate function (a064d0d)
* **Code Refactoring:** moves the element creation to a separate function (f403956)
* **Code Refactoring:** reduces usage of keys, uses standard .ComponentClassName (69a4b18)
* **Code Refactoring:** reimplements scrolling to avoid excessive createRef()s (5208721)
* **Code Refactoring:** removes hardcoded data (7249692)
* **Code Refactoring:** removes hardcoded data (59db108)
* **Code Refactoring:** renames all related variables to use FeatureType[s]Description fo (6fa39ca)
* **Code Refactoring:** renames all related variables to use FeatureType[s]Description fo (9194a35)
* **Code Refactoring:** replaces a class check with shouldBehaveLikeAComponent (ee6a3d2)
* **Code Refactoring:** replaces hardcoded text with actual locale strings (a5def6a)
* **Code Refactoring:** replaces string refs with the createRef() syntax (d17eb34)
* **Code Refactoring:** replaces string refs with the createRef() syntax (61abae0)
* **Code Refactoring:** uses FormattedMessage components rather than injectIntl (8566efb)
* **Code Refactoring:** uses SASS vars for Instrument code colors rather than hardcoding (297d394)
* **Code Refactoring:** uses SASS vars for Instrument code colors rather than hardcoding (35a5a04)
* **Documentation:** adds missing knob for the Instrument story (e55cebf)
* **Documentation:** adds missing knob for the Instrument story (57dc247)
* **Documentation:** adds more detailed requirements as per Brandon (5dc6b78)
* **Documentation:** adds more detailed requirements as per Brandon (76727b8)


### fixed prop type warning

* **Code Refactoring:** for info bar components (85fda19, NEBV-1195)


### Git

* **Bug Fixes:** fixes *.PNG gitattribute to be a binary filetype (d28d004)
* **Code Formatting:** adds .gitattributes to force line endings to LF (8ba750a)
* **Project Maintenance:** fix gitattributes for shp files (08dc40b)


### Grid and scrolling

* **Features:** added view two demo grid (cb8c48c)


### Grid Layout

* **Documentation:** fixed change requests (55b2b7c)


### i18n

* **Tests:** adds react-intl support for tests (c24eae9, NEBV-1262)


### info bar

* **Features:** pr comments (a6a86f5, NEBV-1195)
* **Features:** renaming to fix linting errors (016744f, NEBV-1195)
* **Features:** add knobs for switching between text boxes (91213b1, NEBV-1195)
* **Tests:** test added after refactor (a9e858e, NEBV-1195)
* **Tests:** add tests (b02c164, NEBV-1195)
* **Code Refactoring:** pr changes + one failing test (f53a896)
* **Code Refactoring:** shortcut info bar test added (f396799, NEBV-1195)


### infobar

* **Features:** refactor components and update tests (48525e4, NEBV-1195)
* **Features:** fix pr comments (204f801, NEBV-1195)


### instrument bubble legend

* **Code Refactoring:** add to docs and adds props to legend for future use when scaling (602a12e, NEBV-1284)


### instruments bubble chart

* **Features:** adds dynamic bubble items (83fcf72, NEBV-1284)


### instruments bubble legend

* **Features:** removes unneccessary test (5906681, NEBV-1284)
* **Features:** adds in new default values given by design team (06d20ff, NEBV-1284)
* **Features:** add stylesheet for fills on text and ellipsis (419427b, NEBV-1284)
* **Features:** add changes to readme (02c2295, NEBV-1284)
* **Features:** implementation (d9b2455, NEBV-1284)
* **Features:** implementation (3b49ddc, NEBV-1284)
* **Code Formatting:** adds newline at end of style file (2c665a3)
* **Documentation:** added feedback from design team (8b43905, NEBV-1284)
* **Documentation:** elaborates on bubble legend cases (ef8bc1b, NEBV-1284)


### InstrumentsLegend

* **Features:** Added translation messages (e0e5c6c, NEBV-1262)
* **Features:** Added rendering of the LegendItem private component (8dda5e3, NEBV-1189)
* **Features:** Added rendering of the component and legend items after processing the data (2326dcf, NEBV-1246)
* **Features:** Updated styles for the component (58b7540, NEBV-1246)
* **Features:** Fixed another unique key array/iterator warning (b3ba994, NEBV-1246)
* **Features:** Fixed unique key array/iterator warning (450fd64, NEBV-1246)
* **Tests:** Updated shouldBehaveLikeAComponent arguments (750d5f8, NEBV-1189)
* **Tests:** Added tests for the rendering of the component (554cd30, NEBV-1246)
* **Code Formatting:** Updated filenames to conform to new structure (5f444fc, NEBV-1246)
* **Code Refactoring:** Cleaned up instruments data processing (e8ceb94, NEBV-1246)
* **Code Refactoring:** Defaulted render variables to null instead of undefined (fb29a17, NEBV-1246)
* **Code Refactoring:** Fixed missing s in variable reference (1c04600, NEBV-1246)
* **Code Refactoring:** Updated instrument data iteration variable name for better clarity (88447a9, NEBV-1246)
* **Code Refactoring:** Updated to use classnames module (0f33855, NEBV-1246)
* **Documentation:** Added storybook cases (9a471e3, NEBV-1189)
* **Documentation:** Added storybook cases for basic usage and select prop (7a78cb3, NEBV-1246)


### Interaction

* **Documentation:** adds documentation on interactions addon (3406501)


### Intl

* **Tests:** fixes failing tests due to FormattedMessage (6fc516a, NEBV-1262)


### Jest

* **Tests:** converts tests from Sinon spys to Jest mocks (9cc6886)
* **Tests:** fixes broken tests following Jest conversion (77ee0e1)
* **Code Formatting:** changes \`test( (a9b94d2)
* **Project Maintenance:** adds code coverage reporting via Jest (e75879c)
* **Project Maintenance:** adds Jest snapshotting based on Storybook stories (9c50d99)
* **Project Maintenance:** adds junit output for GitLab (1f9d21b)
* **Project Maintenance:** converts from Mocha/Chai to Jest (a250fb0)
* **Project Maintenance:** fixes Jest looking at the app folder instead of src (88a79dd)
* **Project Maintenance:** fixes proptypes and translations for Jest (9c27eb3)


### jest conversion

* **Code Refactoring:** for downloads textbox (0a88dac, NEBV-1195)
* **Code Refactoring:** for shortcutinfo bar (a0c8e03, NEBV-1195)


### Language support

* **Features:** adds Formatted text support to modal, bubble chart and project legend (f49a405, NEBV-1262)
* **Features:** adding language support for storybook WIP (3ba5155, NEBV-1262)


### Language Support

* **Features:** adds language support to the Feature flag title attribute (28d5c78, NEBV-1262)
* **Features:** adds language support for the Selected group bar (520089d, NEBV-1262)
* **Features:** wIP Adding language support to Selected Group bar (04f1bb9, NEBV-1262)
* **Features:** adds multi language support to the Feature Description component (7aba890, NEBV-1262)
* **Features:** adds language support to Features Menu component (f0ebbfe, NEBV-1262)
* **Code Refactoring:** fixes for PR changes (b6f67e2, NEBV-1262)


### Language support modal

* **Bug Fixes:** refactors formatted text to not break test (7c6b11a, NEBV-1262)


### Languages

* **Features:** adds the first formatted message for language support (75d6663, NEBV-1262)
* **Bug Fixes:** fixes a spelling mistake (7e83e65)
* **Bug Fixes:** fixes a spelling mistake (ba95d44)


### legend item; features legend

* **Code Refactoring:** removed space for checkmark boxes (d4b40e1, NEBV-1273)


### Loading Pipe

* **Documentation:** adds documentation for the Loading pipe component (04b0570, NEBV-1291)
* **Documentation:** fixes typo in README (ec04775, NEBV-1291)
* **Documentation:** removes Accessibility Requirements (799c1cc, NEBV-1291)


### LocationWheelMinimap

* **Features:** draws regions with correct position and orientation (9ee8505)
* **Features:** draws regions with correct position and orientation (6f1a10a)
* **Features:** displays and scales to the current region and province (9fa7144)
* **Features:** renders the province and region (5333715)
* **Features:** adds a basic component (6b38c2f)
* **Features:** adds a basic component (f557f0d)
* **Features:** displays and scales to the current region and province (814659e)
* **Features:** renders the province and region (4771cd1)
* **Bug Fixes:** fixes incorrect filename (e72ff4e)
* **Bug Fixes:** fixes a memory issue with Promises + React's lifecycle (876bfb5)
* **Documentation:** adds more detailed requirements (ca1a55c)
* **Documentation:** adds requirement to hide when in Company mode (2372f98)
* **Documentation:** adds requirements (718cd21)
* **Documentation:** includes the source shapefile for generating TopoJSON (ff95d4e)


### main info bar

* **Code Refactoring:** jest conversion (dc2a2d3, NEBV-1195)
* **Code Refactoring:** test fixes (6aca98a, NEBV-1195)


### MatterJS

* **Project Maintenance:** updates MatterJS to latest fork with Firefox support (0204173, NEBV-1271)


### methodology text box

* **Code Refactoring:** jest conversion (9a2d43d, NEBV-1195)


### minfobar

* **Code Refactoring:** pr comments (672d27e, NEBV-1195)


### Mocha

* **Project Maintenance:** removes remainder of code related to Mocha/Chai (1624755)


### Modal

* **Features:** adds a new Modal component (e5edf09, NEBV-1182)
* **Bug Fixes:** fixes typo in README (a439b73, NEBV-1182)
* **Tests:** adds Tests and refactors jsdom to workaround polyfill (2c6ef09, NEBV-1182)
* **Tests:** adds tests for toggling modal open / closed (00dc551, NEBV-1182)
* **Code Formatting:** fixes linting errors in Modal (4ed21c3, NEBV-1262)
* **Code Refactoring:** changes Modal component into a dialog window (72d709b, NEBV-1182)
* **Code Refactoring:** fixes PropType error in tests (09ce22d)
* **Code Refactoring:** refactors for pull request (3ca54e4, NEBV-1182)
* **Code Refactoring:** refactors refs for PR change (73ae1fe, NEBV-1182)
* **Code Refactoring:** separates Modal from ModalContent to prevent test crashes (27f2582, NEBV-1182)


### npm

* **Project Maintenance:** removes audit support for GitLab (3dbc587)


### Package

* **Documentation:** updates contributor information for visualization code (c788b0c)


### Project Legend

* **Features:** adds more language support for the project legend component (aace394, NEBV-1262)


### PullToSpin

* **Features:** architect and initial implementation of pull to spin (1196a91, NEBV-1218)
* **Bug Fixes:** fixes not rendering in firefox (7739bd9)


### PullToSpin and ProjectDot

* **Code Refactoring:** pullToSpin refactor for lines, shadows, focus, text. ProjectDot (845a80f)


### react-spring

* **Tests:** fixes react-spring imports in Jest (ba389a4)
* **Project Maintenance:** removes .cjs import now that spring 8.0.7 is released (3c9c21c)


### redux

* **Features:** adds view two components to redux (01fe00b, NEBV-1285)
* **Features:** added immutable and handles state for wheel (0ec99e5, NEBV-1285)
* **Features:** adds testing and file structure (82d9870, NEBV-1285)
* **Features:** adds store for view one and two (5e1af58, NEBV-1285)
* **Features:** adds store and reducer (0a3b448, NEBV-1285)
* **Features:** adds for view three (252757d, NEBV-1285)
* **Features:** adds actions with their tests (2069a50, NEBV-1285)
* **Features:** adds folders for project menu, trend button, and wheel (fb26a6c, NEBV-1285)
* **Features:** adds new architecture for redux without the tests :P (8a0a485, NEBV-1285)
* **Tests:** adds test for selectedFeature (a12bf84, NEBV-1285)
* **Code Refactoring:** adds new architecture and selectedFeature action folder (3aea865, NEBV-1285)
* **Documentation:** fixed typo (6a45c7d, NEBV-1285)


### redux and state docs

* **Features:** pr comments (24d6f04, NEBV-1269)


### redux doc

* **Features:** adds actions for redux (d95f910, NEBV-1269)
* **Features:** adds type for projectmenu position (d148095, NEBV-1269)
* **Features:** simplifies redux actions (d0a03ba, NEBV-1269)


### reduz

* **Features:** adds searchBar and viewThree (906f454, NEBV-1285)


### refactored code

* **Code Refactoring:** changed formattedMessage, styles, and tests. (6a347e3, NEBV-1265)


### refactored to conditional rendering

* **Code Refactoring:** refactored for a change request (6704a66)


### Region Companies

* **Features:** wIP adds new component Region Companies (be8e863, NEBV-1267)
* **Bug Fixes:** adds fixes for merge requests (181080f, NEBV-1267)
* **Code Formatting:** adds overflow scroll to list of company names (f494a90, NEBV-1267)


### region condition chart

* **Features:** chart component tests and stories (9e1f783, NEBV-1268)
* **Code Refactoring:** snap shot update (84d9e50, NEBV-1268)


### region condition summary

* **Features:** add styling to the chart box and scaled bars inside container (98ca002, NEBV-1268)
* **Features:** private region condition chart component with tests, stories, and mo (f6cdb4b, NEBV-1268)
* **Code Refactoring:** add changes from pr comments (1faae22, NEBV-1268)
* **Code Refactoring:** add formattedMessage test and refactor to remove unnecessary cla (05c7bc2, NEBV-1268)
* **Code Refactoring:** combined region condition chart and region condition summary int (43523a4, NEBV-1268)
* **Code Refactoring:** import colours scss (75ecd4f, NEBV-1268)
* **Documentation:** create readme doc for requirements and component overview (f4fbb14, NEBV-1268)


### Regional Companies

* **Bug Fixes:** fixup for PR issue (3dad863, NEBV-1267)
* **Code Refactoring:** fixes suggestions for PR (b181e43, NEBV-1267)


### Regional Companies (WIP)

* **Features:** adds a new feature Regional Companies (d6f7bb2, NEBV-1267)


### RegionCompanies

* **Features:** refactors company data to support ids and button clicks (14b991e, NEBV-1267)


### Remove App folder

* **Bug Fixes:** remove app folder (fbb3f8e)


### Removed Control

* **Bug Fixes:** removed control component (a9db50c)


### Renovate

* **Project Maintenance:** adds "Awaiting Review" label to renovate PRs (af868de)


### SCSS

* **Bug Fixes:** fixes all broken SCSS references for colours (6edf133, NEBV-1240)


### SearchBar

* **Features:** added highlightSummary tests, content, and stories (652450c, NEBV-1304)
* **Features:** added Tab Component for SearchBar Parent (e1c0187, NEBV-1265)
* **Features:** added design and functionality for FilterContent (8771b08, NEBV-1282)
* **Features:** added SearchContent with design and functionality (0ca15a0, NEBV-1282)
* **Features:** added initial setup of SuggestionWindow in SearchBar (f9e8eff, NEBV-1259)
* **Features:** suggestedKeywords added styles, tests, and props (17b1ab5, NEBV-1304)
* **Features:** add initial setup of suggestedKeywords (1636e92, NEBV-1304)
* **Features:** added functionality for suggestionWindow (f4d0c52, NEBV-1259)
* **Features:** added different mode, refactored code, added tests (23a6c24, NEBV-1282)
* **Bug Fixes:** changed color to a darker gray to match design doc (0383993, NEBV-1265)
* **Bug Fixes:** linting fix and scss styles (ed1ef39, NEBV-1265)
* **Bug Fixes:** fixed filterYear styling to match design doc (776bafd, NEBV-1282)
* **Bug Fixes:** added english json change to french json (48181fd, NEBV-1265)
* **Bug Fixes:** styles change and readme docs updated (0d211fd, NEBV-1282)
* **Bug Fixes:** formattedMessage render fix, and prop error fix (e75dc11, NEBV-1282)
* **Bug Fixes:** fixed formatted message component and some tests (ef58d94, NEBV-1282)
* **Tests:** added tests in filterContent (d05c895, NEBV-1282)
* **Tests:** added additional tests from previously adding more logic to component (ede3b75, NEBV-1282)
* **Code Formatting:** fixing linting errors (6d91e56, NEBV-1282)
* **Code Refactoring:** added tests , fixed classNames, refactored code, removed unnecessary comments (3591a46, NEBV-1282)
* **Code Refactoring:** changed styles, tests, and storybook rendering (7f92155, NEBV-1282)
* **Code Refactoring:** changed two ternary into one function (9ba9c28, NEBV-1265)
* **Code Refactoring:** refactored code to reduce functions and redux actions (bd2fdda, NEBV-1282)
* **Code Refactoring:** refactored functionality on searchBar and seperated to two stories (4b4b969, NEBV-1265)
* **Code Refactoring:** refactored searchContent (542aef1, NEBV-1282)
* **Code Refactoring:** simplified code and improved reset functionality (b641e7a, NEBV-1282)
* **Code Refactoring:** updated projectStatus to enum text in json (0aba7f0, NEBV-1282)
* **Code Refactoring:** updated proptypes, improved tests, and refactored code (46c5b7f, NEBV-1282)


### selected group bar

* **Features:** added knobs to stories (aace7ab, NEBV-1273)


### share icon

* **Features:** add component shareicon (4a0c686, NEBV-1184)
* **Code Refactoring:** jest conversion (29e52c0, NEBV-1195)


### shareicon

* **Features:** added folder with docs, storybook, and basic tests (5de5e7e, NEBV-1184)


### ShareIcon

* **Tests:** fixes tests and PR comments (9d019fb, NEBV-1195)


### shortcut info bar

* **Features:** added basic component and tests; update docs for main info bar (9b4853c, NEBV-1194)
* **Tests:** add tests (abc2822, NEBV-1195)


### SmallMultiplesLegend

* **Features:** Added translation messages (7e66b70, NEBV-1262)
* **Features:** Added message formatting/translation (37adf04, NEBV-1262)
* **Code Refactoring:** Updated SmallMultiplesLegend code to match up with InstrumentsLegend (f8df617, NEBV-1246)
* **Documentation:** Updated storybook example data to use translation messages (4b906d5, NEBV-1262)


### StackGroupProps

* **Tests:** adds test to check props inversion for StackGroup (8080d29, NEBV-1209)


### state data

* **Code Refactoring:** add line break (17235fc, NEBV-1269)
* **Code Refactoring:** fixes typos and adds backticks to state data doc (7683c5f, NEBV-1269)
* **Documentation:** adds doc for redux (f57515b, NEBV-1269)
* **Documentation:** adds state to storybook and component states to state.md (c564f76, NEBV-1269)


### state data doc

* **Features:** missed a comment :P (8416c5f, NEBV-1269)


### Storybook

* **Project Maintenance:** fixes IE11+react-spring for storybook (954642d)


### StoryBook InteractionFeedbackProposal

* **Features:** feedback on interaction for components in storybook (5211a90)


### Storyshots

* **Tests:** fixes bugs with storybook storyshots having proptype issues (afa828a)


### Stream Graph

* **Features:** adding intl to Stream Graph component (93f00f7, NEBV-1262)
* **Bug Fixes:** fixup dom structure to pass test checking for title (1256aeb, NEBV-1262)


### streamgraph

* **Features:** fix stackprops to match component (674a847, NEBV-1209)
* **Features:** fix PR comments (527bb75, NEBV-1209)
* **Features:** change stackgroup tests to pending and mock yHeight calculation (ef3e48a, NEBV-1209)
* **Features:** added props in control and stack group components (72bc58a, NEBV-1209)
* **Bug Fixes:** linting (5d1f3ae, NEBV-1209)
* **Code Refactoring:** change component name from VictoryStackReplacement to StackGroupProps (43c90bf, NEBV-1209)
* **Code Refactoring:** fixed calculations for Control positioning based on size of chart (ae00dc5, NEBV-1209)
* **Code Refactoring:** private component for victorystackreplacement (d12e64f, NEBV-1209)
* **Code Refactoring:** refactored props in Control component and fixed bug in arrow key interaction (c23e260, NEBV-1209)
* **Code Refactoring:** tests and refactor math (8178d81, NEBV-1209)


### StreamGraph

* **Features:** uses Victory props to calculate ChartIndicator position and label (332b398, NEBV-1209)
* **Code Refactoring:** removes unused functions and simplifies logic (fe6d08b, NEBV-1209)
* **Code Refactoring:** reverts testing changes for stream graph component (0bf5b1e, NEBV-1262)


### streamgraph/stackgroup

* **Features:** test added for Control component (b4ac7ff, NEBV-1209)
* **Tests:** handled branch test (e294fee, NEBV-1209)


### StreamLayer/StackGroup

* **Tests:** adds tests for StackGroup (5416ed5, NEBV-1209)


### SuggestionWindow

* **Features:** altered proptypes, tests, and styles. (819285c, NEBV-1259)


### Tab

* **Bug Fixes:** fixed clipping of findIcon (e5672b3, NEBV-1265)
* **Code Refactoring:** refactored code to better mimic design doc (9df5eee, NEBV-1265)
* **Code Refactoring:** removed unused tests, and refactored code in stories (c3ae474, NEBV-1265)


### Testing

* **Documentation:** updates testing docs to indicate that we use Jest instead of Mocha/Sinon/Chai (14ef519)


### Tests/MountWithIntl

* **Code Refactoring:** makes 'MountWithIntl' return the root element instead of its first ch (3c26b5b)
* **Code Refactoring:** makes 'MountWithIntl' return the root element instead of its first ch (62f02e9)


### Tests/Utilities

* **Features:** exports 'intl' for tests that need to check locale text (89392da)
* **Code Formatting:** adds missing semicolon (4bfeb8a)
* **Code Formatting:** adds missing semicolon (4f1c200)


### TrendButton

* **Features:** Added translation to the button label (d848f5f, NEBV-1262)


### update spec.js.snap

* **Tests:** updating snapshot (8db6008)


### utilities/handleInteraction.js

* **Features:** add cursor pointer to the handle interaction utility to show t (3bf4b8b)


### View and Grid

* **Documentation:** made chage requests (bc49a58)


### View Containers

* **Features:** added footer container (3d3b0f9, NEBV-1263)
* **Features:** added view one and three (86acc71, NEBV-1263)
* **Features:** added view three (8b74cec, NEBV-1263)


### wheel; list; projectMenu; RegionCompanies; circleContainer

* **Code Refactoring:** fixing docs and adding knobs (b081d1b, NEBV-1273)


### Wheel/LegendRay

* **Documentation:** adds/Initial architectural commit (4ec22af)


### wheel/ring

* **Code Refactoring:** update snapshots (8e81240, NEBV-1273)


### WheelRay

* **Bug Fixes:** fix index spin when rotation < 0 (c17b004)


* **Features:** Updated shallow mount test function to accept translation messages (53a9081, NEBV-1270)
* **Tests:** Updated test utility to add functionality to shallow render components with internationalization context (e224742, NEBV-1262)
* **Tests:** Updated tests to check formatted message classes (3b4a921, NEBV-1262)
* **Code Formatting:** fixes PR comments (c7edcfc)
* **Documentation:** Added a translations read me (00a9dc3, NEBV-1270)
* **Documentation:** Added readme for state data (20ad3ec, NEBV-1269)
* **Documentation:** Fixed translation code examples (3bc70f0, NEBV-1270)
* **Documentation:** Minor fixes (99aec15, NEBV-1269)
* **Documentation:** Moved GraphQL Storybook files (1689863, NEBV-1269)
* **Documentation:** Updated state data template (f99d460, NEBV-1269)
* **Documentation:** Updated translation test example for clarification (bf7e58f, NEBV-1270)
* **Project Maintenance:** Updated contributors (137c99b)


### WheelRay & Wheel

* **Bug Fixes:** fix plot for rotation > 0, bug remains at rotation < 0 (6409172)


### BREAKING CHANGES

* **Modal:** `modalAction` is now a func, instead of `{ task: () => {}, text: '' }`
* **ChartIndicator:** ChartIndicator props and position calculations have changed
* **BrowseByBtn index and stories:** mode addition to the specs, changes the way the button information is conditionally rendered
* **streamgraph:** n
* **PullToSpin:** none
* **StoryBook InteractionFeedbackProposal:** none
* **PullToSpin:** none
* **CompanyWheel and WheelRay:** Refactoring of wheelraylegend and dummy functions on the randomdatasample which the stories are
pulling from
* **CompanyWheel, PullToSpin components:** Renaming of files
* **Stream Graph:** Tests

## [0.0.1](http://neb-conditions-devdoc.s3-website.us-west-2.amazonaws.com/v0.0.1) (2019-01-04)


### (TrendButton)

* **Documentation:** Changed Readme and Storybook (c8312cc, NEBV-1174)


### All around

* **Code Formatting:** changes to mostly the classes name to be in line with the UpperCamelCase standard (33ac647)


### Architecture/Component

* **Documentation:** Updated private component folder structure (3aff36e)
* **Documentation:** Updated private component folder structure (210146c)


### BubbleChart

* **Features:** Added circle size change for text (f855da1, NEBV-1232)
* **Features:** Added second instrument bubble (3a723ca, NEBV-1232)
* **Features:** Divided into public and private component (0c0a184, NEBV-1232)
* **Features:** Altered Data to group energybubbles (31bb070, NEBV-1232)
* **Features:** Added some accessibility features (b3f3e47, NEBV-1232)
* **Features:** Added some initial interaction on the charts (8447068, NEBV-1232)
* **Features:** Code refactor to use d3 for nested bubbles (31a1bc2, NEBV-1232)
* **Features:** tests, readme and setup (b03934a, NEBV-1232)
* **Tests:** Fixed tests to reflect changes in doc (450f8f8, NEBV-1232)
* **Documentation:** ReadMe Docs update (29aceb7, NEBV-1232)


### Changed component name to CircleContainer and added the classnames package

* **Features:** Name Change Circle (63d489e)


### CircleContainer

* **Features:** changed minor lint issues and spelling errors (3267e11)
* **Documentation:** Adds a TODO item to the CircleContainer component (f18e40e, NEBV-1210)


### CircleContainer compoenent

* **Features:** pack.lock.json merge conflict (ac52819)


### CircleContainer compoenet

* **Features:** Removed usage of React.memo (a230643, NEBV-1183)


### CircleContainer component

* **Features:** Made PR comment changes to merge (b87e27c)
* **Features:** spelling (5db80b8)
* **Features:** fixed spelling errors in the read me (fc3a6e4)
* **Features:** Fixed too long line character line lengths in files (0ec392b)
* **Features:** Made the component a React.memo(component) (1842898, NEBV-1183)
* **Features:** Return a memoized compoenet, fixed tests breaking (155724d, NEBV-1183)
* **Features:** Added className prop with tests (1e77ec8, NEBV-1183)


### colors.scss

* **Code Formatting:** added common and other colors (cdd3da9)
* **Code Formatting:** refactor of scss structure (9ab8348, NEBV-1240)
* **Code Refactoring:** mmodify standard color structure, fix mistakes (a3f5573)


### Commitizen

* **Project Maintenance:** adds cz-customizable instead of cz-conventional-changelog (5c2e6c0)


### Company wheel and Ring

* **Documentation:** append tests and fix some todos for the upcoming components feedback i (5d271f9)


### CompanyWheel

* **Bug Fixes:** Further tweaks on dynamic spacing of wheel (a0fec54)
* **Bug Fixes:** Fix wheel wabble on rotation (a2ee1d1)


### CompanyWheel animation

* **Features:** implementation of company wheel (ea1d3bc)


### CompanyWheel WheelRayLegend

* **Bug Fixes:** modify responsibility of render and degree calculation (d8b2453)


### CompanyWheel/ProjectDot - RayLegend

* **Code Refactoring:** stories, css and code simplification (77e638e)


### CompanyWheel/Ring/index.jsx

* **Code Refactoring:** trimming dull code (e1986dc)


### CompnayWheel, docs

* **Code Refactoring:** Wheel animation, Wheel data structure, dot style (89da6c6)


### Component Structure

* **Project Maintenance:** removes \`index.\` from spec and stories filenames (8c101d4)


### Component Template

* **Documentation:** Replace placeholder components with template (52fe6ed, NEBV-1149)


### Coverage

* **Tests:** Fixes `npm run test` on Windows (d1dbf07)
* **Tests:** Fix coverage reports for NYC+Mocha (b240af5)


### Data

* **Documentation:** Adds initial docs on data structure and queries (1947c09)
* **Documentation:** Cleans up unused data documentation and fixes PR comments (602cae7, NEBV-1226)


### Dependencies

* **Project Maintenance:** Removes direct dependency on d3/d3-scale since they aren't used (43de5ac, NEBV-1178)


### editorconfig

* **Code Formatting:** Adds editorconfig and VSCode config for 2-space indentation (5deafaf)


### EditorConfig

* **Project Maintenance:** Added a EditorConfig file for basic code formatting (9ce9948)
* **Project Maintenance:** Fixed trailing lines exception for all markdown files (7231b90)


### eslint

* **Tests:** Fixes `npm run lint` command (c248c3f, NEBV-1147)


### ESLint

* **Tests:** Fixes `npm run lint` not working with latest version of ESLint (f90d1a8)
* **Tests:** Fix linting errors and improve linting config (f910eed, NEBV-1149)
* **Code Formatting:** Fixes linting issues after package updates (8a4155f)
* **Code Refactoring:** Fix missing button type linting issue (6f436c0)
* **Project Maintenance:** Fixes range of null linting error (b2b3780)
* **Project Maintenance:** Fixes Windows error with single-quotes in npm script (d096ee2)


### feature description

* **Features:** added styles (eeaa474, NEBV-1190)
* **Features:** basic tests added for feature description (d5fd2c4, NEBV-1190)


### Feature Flag

* **Features:** Adds boilerplate for the FeatureFlag component (8bab1e1, NEBV-1176)
* **Tests:** Adds tests for feature flag (b5f9fa6, NEBV-1210)
* **Code Refactoring:** Refactors feature flag to a public component (929d698)
* **Documentation:** Fixes typo (ad9e4d8, NEBV-1176)


### feature-description

* **Code Refactoring:** make required props and remove unneccessary test (e47ed4c, NEBV-1190)


### FeatureDescription

* **Documentation:** Fixes typo (omit -> emit) (b706c1c, NEBV-1190)


### FeaturesMenu

* **Features:** Initial setup for the FeaturesMenu (83390d3, NEBV-1187)
* **Features:** Changed drop down to set the default value in select to match the state of other components (a8cefa9, NEBV-1236)
* **Features:** Added rendering of the component for drop down and no drop down modes (9dccb6e, NEBV-1236)
* **Features:** Added selected prop for setting a default selected feature (bbca72e, NEBV-1236)
* **Tests:** Added test for checking no option is rendered with selected (bb8736b, NEBV-1236)
* **Tests:** Added tests for the rendering of the component (2c7266e, NEBV-1187)
* **Tests:** Added tests for the selected prop (9f0f113, NEBV-1236)
* **Tests:** Updated tests for selected property on drop downs to look at option elements (cbfb061, NEBV-1236)
* **Code Formatting:** Added styling for view 2 drop down mode (7b0848c, NEBV-1236)
* **Code Formatting:** Added styling for view 3 list mode (4f44d40, NEBV-1236)
* **Code Refactoring:** Moved the list menu and drop down creation into the component definition (d942ff8, NEBV-1236)
* **Documentation:** Added examples to storybook (42e715d, NEBV-1236)
* **Documentation:** Added requirements for the FeaturesMenu (1f08d1a, NEBV-1187)
* **Documentation:** Added selected example (08878c3, NEBV-1236)
* **Documentation:** Added storybook knobs for selected and drop down mode (51cd29b, NEBV-1245)
* **Documentation:** Updated knob for drop down mode (5f9a21b, NEBV-1245)
* **Reverts:** Updated tests for selected property on drop downs to look at option elements (f36d5f2, NEBV-1236)


### FileSetup for BubbleChart

* **Features:** Documents set up (cae114e, NEBV-1193)


### Forgot to pull current dev branch

* **Bug Fixes:** Not following gitflow (bda34cc, NEBV-1183)


### Git Standards

* **Documentation:** Adds example of bugfix branch naming guideline (df53301)


### handleInteraction

* **Features:** Adds memoization to handleInteraction using memoizeReference (9433443)
* **Features:** Adds check for callback and returns {} when missing (a1d0162)
* **Bug Fixes:** Adds lodash.memoize dependency that was removed in another PR (282adb2)


### Icon compnent

* **Features:** Changed where Icons were added to tests and stories (0a6f227)


### Icon component

* **Features:** removed line (5f6be8a)
* **Features:** made default props null (d958f74)
* **Features:** fixed spelling, fixed ESLint error issue (c43c8a0)
* **Features:** fixed spelling, changed line length (6d7a2ba)
* **Features:** Removed sinon import in test file (14a8915)
* **Features:** Removed extra mocha params for single test (8d90a24)
* **Features:** Fixed spelling errors, Removed classnames import and useage (541146d, NEBV-1207)
* **Features:** Changed CSS, refactored tests and added new elements (078f539, NEBV-1227)
* **Features:** added classnames, refactored tests (79cfcee, NEBV-1205)
* **Features:** Created Component, added tests, and stories (41972b7, NEBV-1184)


### Icons

* **Code Refactoring:** Removes the spread of handle interactions and moves styling for icons to its own fi (9874ab8, NEBV-1210)


### IconSelector

* **Features:** added tests, changed component (b31a37b, NEBV-1183)
* **Features:** added tests, changed component (2da600f)
* **Features:** Adds initial scaffolding of IconSelector (fd17e09, NEBV-1183)


### info bar

* **Features:** imported Icon public component to be used for share icons in info bar (a7a754a, NEBV-1195)
* **Features:** basic tests, storybook, and styles added for text box components (90473d4, NEBV-1195)
* **Features:** private components for about, methodology, and downloads text (79608f3, NEBV-1195)
* **Code Refactoring:** removed unnecessary files and clarified readme docs (13855a7, NEBV-1195)


### InstrumentBubble

* **Features:** BubbleChart simplification (3057ac1, NEBV-1234)
* **Features:** Changed Component Structure (c55d44c, NEBV-1234)
* **Tests:** Added Tests (0801de7, NEBV-1234)
* **Tests:** Moved data to a prop for test cases (4623e51, NEBV-1234)
* **Code Formatting:** Added comments with todo (aafbdcd, NEBV-1234)
* **Code Formatting:** className change to PascalCase (db74692, NEBV-1234)
* **Code Formatting:** Fixed linting errors and styling (4b213c8, NEBV-1234)
* **Code Refactoring:** Added descriptions and reduced duplicate code (ad14bec, NEBV-1234)
* **Code Refactoring:** Changed to accept props (729b1fe, NEBV-1234)
* **Code Refactoring:** Moved data to props in Storybook (9d7775e, NEBV-1234)
* **Code Refactoring:** Refactored Code to use data as props (bbfde1e, NEBV-1234)
* **Code Refactoring:** Refactored pickColor function (2d4819f, NEBV-1234)
* **Documentation:** Added extra description (7026f30, NEBV-1234)
* **Documentation:** Changed Readme docs (3d94a97, NEBV-1234)
* **Documentation:** Changed README docs (a342ba3, NEBV-1234)
* **Documentation:** Docs changed with to do description (db3490e, NEBV-1234)
* **Documentation:** Modified docs to reflect the code structure change (1f77507, NEBV-1234)
* **Documentation:** Package.json and package-lock (5ee6eee, NEBV-1234)


### InstrumentsLegend

* **Features:** Initial setup for the InstrumentsLegend and it's LegendItem private component (84fcad1, NEBV-1189)
* **Tests:** Added tests for rendering of LegendItem (5e9c5ed, NEBV-1189)
* **Documentation:** Added requirements for the InstrumentsLegend and it's LegendItem private component (f1c6aa7, NEBV-1189)


### Introduction

* **Documentation:** Adds better introduction and cleans up some inaccurate lines (b298f42, NEBV-1257)


### Legend

* **Code Refactoring:** Naming refactor for Legend to be consistent (e596a6a, NEBV-1176)


### Lint

* **Code Formatting:** Fixes react/jsx-curly-spacing in CircleContainer story (1fb2330)


### List

* **Features:** Adds keyboard interaction and prop to disable (424e117, NEBV-1173)
* **Features:** Adds support for component items (47620c3, NEBV-1173)
* **Features:** Updated components using List to provided applicable properties (b796348, NEBV-1245)
* **Features:** Uses item index as onChange value instead of rendered component (edfe96a, NEBV-1173)
* **Features:** Updated styles and icons for horizontal and vertical rendering (6854e61, NEBV-1245)
* **Features:** Updated interaction element to avoid previous and next buttons getting focus (56cafda, NEBV-1245)
* **Features:** Adds previous/next arrow button placeholders (aa528f1, NEBV-1183, NEBV-1173)
* **Features:** Adds className prop to List (517c9af, NEBV-1173)
* **Tests:** Fixed prop warnings (409808f, NEBV-1245)
* **Tests:** Added tests previous and next button click events (1f669b3, NEBV-1245)
* **Tests:** Added tests for vertical and horizontal rendering (2891129, NEBV-1245)
* **Code Formatting:** Moved SVG out of FeaturesMenu styles and updated FeaturesMenu styles for use with updated List styles (1d6f6cf, NEBV-1245)
* **Code Refactoring:** Updated quotes used in scss (8882d68, NEBV-1245)
* **Documentation:** Added example with the guide line (29d682a, NEBV-1245)
* **Documentation:** Adds propTypes descriptions to List (a9c2ded, NEBV-1173)
* **Documentation:** Updates docs to match currently supported List functionality (8590312, NEBV-1173)


### memoizeReference

* **Features:** Adds memoizeReference for generating unique identifiers for functions, objec (f25ae71)


### Merge conflict issue

* **Bug Fixes:** Fixed merge conflict (6eea351, NEBV-1183)


### Mocha

* **Project Maintenance:** Fixes jsdom loading to not pollute node globals (c4bfeb0)


### NEBV-1174(TrendButton)

* **Features:** Placeholder StreamGraph and basic Storybook setup (01943a3, NEBV-1174)
* **Features:** Added basic component setup and tests (66b3876, NEBV-1174)
* **Tests:** Test Fixes (a476a8e, NEBV-1174, NEBV-1174)
* **Tests:** Fixing test issues with png files (3d24a35)
* **Code Formatting:** Style Fix (a349ba3, NEBV-1174)
* **Documentation:** Changed styling of readme docs to properly render (4892d3d, NEBV-1174)
* **Documentation:** Updated Readme and describe content in test file (67dd512, NEBV-1174)
* **Project Maintenance:** Add imgs and change text in placeholder component (d72cbe9, NEBV-1174)
* **Project Maintenance:** Added styles (e52bc87, NEBV-1174)
* **Project Maintenance:** Changed storybook component (935665b, NEBV-1174)


### NPM

* **Project Maintenance:** Fixes HTTP/HTTPS mismatch in package-lock.json (a9bcc9d)
* **Project Maintenance:** Updates all package dependencies to their latest version (b3011b5)


### NYC

* **Project Maintenance:** Fixes NYC not running tests in BitBucket Pipelines (458a0f3)


### Project Chart

* **Features:** Adds temporary feature flags to the project chart (c373a5c, NEBV-1176)
* **Features:** Adds boilerplate for Project Chart component (c4922ca, NEBV-1176)
* **Tests:** Fixes tests for Project Chart after refactor (14c074f, NEBV-1176)
* **Tests:** Adds some tests for project chart and refactors long line (5864f48, NEBV-1176)
* **Code Refactoring:** Move story structure to private component and fix up ref (a70dbe9, NEBV-1176)
* **Code Refactoring:** Refactors how the condition count is generated (a0e68f5)
* **Documentation:** Adds Knob for ProjectChart selection (7d06c44, NEBV-1210)


### Project Legend

* **Features:** Adds a new project legend for project conditions (0a06011, NEBV-1206)
* **Features:** Adds boilerplate for project legend component (25a77a6, NEBV-1206)
* **Features:** Updates project legend to accept items instead of a selected feature (3ab46cb, NEBV-1176)
* **Tests:** Updates rendering tests for the project legend (d753415, NEBV-1176)
* **Code Refactoring:** Fixups for merge request (9852933, NEBV-1206)
* **Code Refactoring:** Part one of PR refactor (6b0ce6c, NEBV-1206)
* **Code Refactoring:** Renames all Project Legend to Legend to follow template spec (1cd9245, NEBV-1176)


### Project Menu

* **Features:** Updates project menu and its private components (197df92, NEBV-1210)
* **Features:** Adds project tracking to project menu (84fc783, NEBV-1176)
* **Features:** Updates what project menu should be passing to the project legend (af7dc8a, NEBV-1176)
* **Features:** Adds logic for selected project chart flag colours and Adds testing (a9dc6e2, NEBV-1210)
* **Features:** (bug on safari) keep centered selected project (962eb3f, NEBV-1210)
* **Features:** Angled styling for the project menu (05b50e2, NEBV-1210)
* **Bug Fixes:** Fixes typo in props (af5a1e9, NEBV-1176)
* **Bug Fixes:** Changes list items to be nodes to be passed down to the list component (bc80c77, NEBV-1176)
* **Bug Fixes:** Adds pull request fixes (f3f0302, NEBV-1210)
* **Tests:** Adds a couple of basic tests (d45abdb, NEBV-1176)
* **Code Formatting:** Adds more styling for the ConditionCount and the pipelines (e474364, NEBV-1210)
* **Code Formatting:** Adds styling to the ProjectChart and FeatureFlag (3703b2a, NEBV-1210)
* **Code Formatting:** Fixes indentation of styling (172a102, NEBV-1210)
* **Code Refactoring:** PR fixes (adds newline) (b2430cd, NEBV-1210)
* **Code Refactoring:** PR fixes making props required and removing story (e7f0d8d, NEBV-1176)
* **Code Refactoring:** Remove sinon until needed (b8a71f8, NEBV-1176)
* **Code Refactoring:** Removes Project legend from the project menu component (72588ae, NEBV-1176)
* **Code Refactoring:** Removes utility for sorting (a5f7ee0, NEBV-1176)
* **Code Refactoring:** Updates the project menu to pass the selected proeject ID to its passed in o (5ad02a2, NEBV-1176)
* **Documentation:** Adds descriptions to props (beae8c1, NEBV-1176)
* **Documentation:** Adds more stories for the FeatureFlag component (9686f05, NEBV-1210)
* **Documentation:** Adds tests for Project menu and boilerplate for Project Legend (ccf469c, NEBV-1176)
* **Documentation:** Creates a new story component for the ProjectMenu (173042c, NEBV-1176)
* **Documentation:** Updates docs to have multiple story links (b2b7cc4, NEBV-1176)
* **Documentation:** Updates Project Menu and private components stories (2504e01, NEBV-1176)
* **Documentation:** Updates README docs for the ProjectMenu component (6042ec9, NEBV-1176)


### ProjectDot

* **Features:** architect and initial implementation of project dot (33b46fe, NEBV-1215)


### ProjectDot, Spelling and formatting

* **Code Refactoring:** refactoring of projectdot to accept props differently (ca2ca9c)


### ProjectMenu

* **Code Formatting:** Fixes Safari and IE11 styling of ProjectMenu with blank bars (ca97e61, NEBV-1210)


### PropTypes

* **Bug Fixes:** fixes proptypes for some of the tests (45035cb)


### README

* **Project Maintenance:** Added reference to the ticket for the nyc issue (cd4ec95)
* **Project Maintenance:** Added root README (5357856)


### Removed redundant test, Added Test documentation folder

* **Code Refactoring:** Removed Test, Added Documentation (f705a8d, NEBV-1183)


### Ring and company wheel

* **Code Refactoring:** change rendering responsibility, fix docs, and test (c9b6fc4)


### Ring component

* **Features:** implementation (139361a)


### SCSS

* **Tests:** Adds css/scss to ignore path in Mocha test execution (ddcf73c)
* **Tests:** Adds css/scss to ignore path in Mocha test execution (b7cdd4f)


### SelectedGroupBar

* **Features:** Added better README.md, changed tests to reflect removal of nonbreaking spac (774e785)


### SelectedGroupBar componenet

* **Features:** Fixed broken test due to spacing (33594d7, NEBV-1205)


### SelectedGroupBar component

* **Features:** changed prop name (f08716f)
* **Features:** Changed png (90ad5f6)
* **Features:** changed tests and proptyle (a905358)
* **Features:** fixed the image path for displaying readme image (46fda55)
* **Features:** Changed path for example image (8b2dac5)
* **Features:** Removed no breaking space (0383f47)
* **Features:** Fixed stories (1b82ad8)
* **Features:** Fixed broken tests for isses with props (84d0ee7)
* **Features:** fixed and PR comments, and an extra stroy for color (2563f4b)
* **Features:** removed Sinon import and Enzyme { mount } import in test file (a1312fe)
* **Features:** removed extra mocha params (a4d2a4d)
* **Features:** Created component, added tests, and stories (c0f6e91, NEBV-1205)


### SelectedGroupBar Component

* **Features:** Changed the example image (c490e29)


### shouldBehaveLikeAComponent

* **Tests:** ensures component name is still className (f9e0930)
* **Code Refactoring:** moves wrapper instantiation into beforeEach (fb555ad)
* **Code Refactoring:** refactors arguments to work with beforeEach (764e3f2)


### shouldHaveInteractionProps

* **Tests:** Adds test utilitiy for verifying that interactions are accessible (952b4a1)


### SmallMultiplesLegend

* **Features:** Initial setup for the SmallMultiplesLegend (ca1fcf7, NEBV-1177)
* **Features:** Added rendering of the title for the component (f84a305, NEBV-1177)
* **Features:** Removed the rendering of the title (4b029b6, NEBV-1224)
* **Features:** Handled a non-matching highlight name (853f929, NEBV-1224)
* **Features:** Added rendering of the legend items (bf9ae93, NEBV-1177)
* **Features:** Initial setup for the SmallMultiplesLegendItem private component (d97466f, NEBV-1177)
* **Features:** Updated data property to be required (4788db3, NEBV-1177)
* **Features:** Added on change event for the component (87d11d0, NEBV-1177)
* **Features:** Added unhighlighting of LegendItem (1904dde, NEBV-1177)
* **Features:** Added selected property for setting the selected list item (8fafd5a, NEBV-1245)
* **Features:** Update style and layout to reflect changes in design (e4a1616, NEBV-1224)
* **Features:** Added highlight ability (401259f, NEBV-1177)
* **Features:** Added rendering of the title for items in the SmallMultiplesLegend (ba80ddb, NEBV-1177)
* **Features:** Removed all label and replaced with mock for translation (7cb8251, NEBV-1177)
* **Features:** Added rendering of charts for the legend items (b117737, NEBV-1224)
* **Features:** Added placeholders for graph in the items private component (6c095a9, NEBV-1177)
* **Features:** Added search for the max data value and passed that to LegendItem (3d693bb, NEBV-1224)
* **Features:** Added class name property for component (e9c38df, NEBV-1224)
* **Tests:** Added tests for LegendItem unhighlight (aadc26f, NEBV-1177)
* **Tests:** Updated tests for component property changes (aa8d93f, NEBV-1224)
* **Tests:** Added test for rendering the list of legend items (d602c9b, NEBV-1177)
* **Tests:** Finished tests for rendering the chart (ead4f04, NEBV-1224)
* **Tests:** Added tests for setting the component class (e40333c, NEBV-1224)
* **Tests:** Updated test to include color in data (e0e0ed5, NEBV-1224)
* **Tests:** Added tests for setting a selected data item (86fddfd, NEBV-1245)
* **Tests:** Added test for invalid highlight name (810c6ad, NEBV-1224)
* **Tests:** Added test for rendering the title of the component (063b93f, NEBV-1177)
* **Tests:** Added test for rendering the title of items in the SmallMultiplesLegend (fede342, NEBV-1177)
* **Tests:** Added tests the component class (9b5353c, NEBV-1177)
* **Tests:** Added tests for on change events (7512464, NEBV-1177)
* **Tests:** Added tests for component highlighting (53915f1, NEBV-1177)
* **Tests:** Add test for title rendering when the data is provided (12ede3d, NEBV-1177)
* **Tests:** Added tests for getting and passing the max value to the LegendItem (205194f, NEBV-1224)
* **Code Formatting:** Fixed linting error (2245944, NEBV-1177)
* **Code Formatting:** Fixed linting errors (cb8071c, NEBV-1177)
* **Code Refactoring:** Added changes from feedback (5d6faca, NEBV-1224)
* **Code Refactoring:** Added key property to LegendItems and shortten code to create LegendItems (d86e829, NEBV-1177)
* **Code Refactoring:** Flatten tests (9b2cd14, NEBV-1224)
* **Code Refactoring:** Flatten tests in private component (c4ebcb5, NEBV-1224)
* **Code Refactoring:** Moved List component creation out of constructor (80ea8cc, NEBV-1177)
* **Code Refactoring:** Moved the getLegendList functionality back into SmallMultiplesLegend definition (b7b7add, NEBV-1177)
* **Code Refactoring:** Removed test reference object (f6f89b8, NEBV-1224)
* **Code Refactoring:** Renamed component properties to match StreamGraph (2ba9271, NEBV-1177)
* **Code Refactoring:** Renamed data id property to name (6e90dbc, NEBV-1224)
* **Code Refactoring:** Replacing mount with shallow in test (8132dd1, NEBV-1224)
* **Code Refactoring:** Shortened name of private component SmallMultiplesLegendItems (667d885, NEBV-1177)
* **Documentation:** Added an example for LegendItem unhighlighting (6c7f9a5, NEBV-1177)
* **Documentation:** Added descriptions for properties (db557c4, NEBV-1177)
* **Documentation:** Added example for highlighting a data item (95cf2b3, NEBV-1177)
* **Documentation:** Added requirements for the SmallMultiplesLegend (62d27d6, NEBV-1177)
* **Documentation:** Added requirements for the SmallMultiplesLegendItem (ea0d974, NEBV-1177)
* **Documentation:** Added storybook knobs for selected and highlight (a0d59eb, NEBV-1245)
* **Documentation:** Fixed class name descriptions (323c710, NEBV-1224)
* **Documentation:** Fixed grammar (ef0751f, NEBV-1224)
* **Documentation:** Updated completed task items (123b353, NEBV-1224)
* **Documentation:** Updated component stories with the new properties (c823095, NEBV-1224)
* **Documentation:** Updated component usage (78befc9, NEBV-1177)
* **Documentation:** Updated example to include the on change event (bd51a15, NEBV-1177)
* **Documentation:** Updated highlight property name (8f9a2c5, NEBV-1224)
* **Documentation:** Updated private component Storybook position (cd14a6f, NEBV-1177)


### Sort utility

* **Tests:** Removes un-nessisary check (dba6a0d, NEBV-1176)


### Standards/Git

* **Documentation:** Added guidelines for feature branch naming (46ba902)
* **Documentation:** Adds Conventional Commits as a commit standard (4455660, NEBV-1147)


### Status

* **Documentation:** Adds status banner to all stories for iLab/NEB (5c77053, NEBV-1257)


### Storybook

* **Features:** Adds support for building storybook for S3 (e6f4bf8, NEBV-1237)
* **Code Refactoring:** Updates the nesting of storybook private components (434cbe8, NEBV-1176)
* **Documentation:** Adds parent components as classnames for private component style scoping (e00f657, NEBV-1206)
* **Project Maintenance:** fixes storybook compilation bug with classname hierarchy (3086775)


### Storybook Styles Addon

* **Features:** Adds styles decorator to storybook for providing iLab-like status indi (b03b549, NEBV-1239)


### stream graph

* **Features:** logging previous design streamgraph functionality (5e07d0e, NEBV-1178)


### streamgraph

* **Features:** added basic tests to component (39f8d39, NEBV-1209)
* **Features:** docs updated, new architecture for victory, wip (2f75848, NEBV-1178)
* **Features:** tests added; fix max condition value (f1ef98a, NEBV-1178)
* **Features:** updates readme docs (c63d110, NEBV-1178)
* **Features:** arrow keys and drag handling (81886df, NEBV-1209)
* **Features:** click to change location support (0ec3c3a, NEBV-1209)
* **Features:** code clean up and testing (d69c96a, NEBV-1209)
* **Features:** added click handler for streamgraph control (5d39417, NEBV-1209)
* **Features:** updated design and docs to match new design doc (c396297, NEBV-1178)
* **Bug Fixes:** removed duplicate control (ce359cb, NEBV-1209)
* **Tests:** setting up format for crosshair (ff90353)
* **Code Refactoring:** basic look of streamgraph control (b708252, NEBV-1209)
* **Code Refactoring:** changed to a class to accomodate new design components (c99dd1b, NEBV-1178)
* **Code Refactoring:** first part of pr changes (d726e34, NEBV-1209)
* **Code Refactoring:** made Control a public component (f72c016, NEBV-1209)
* **Code Refactoring:** pr changes (ce761dc, NEBV-1209)
* **Code Refactoring:** private component for Control (a02a266, NEBV-1209)
* **Code Refactoring:** remove unneccessary streamlayer component (29cf74b, NEBV-1178)


### streamlayer

* **Features:** architect streamlayer public component (d3f3a81, NEBV-1208)


### streamLayer

* **Features:** created a public component for the streamLayer (fa665f2, NEBV-1208)


### Testing

* **Documentation:** Adds documentation for testing process (eeec53f, NEBV-1257)
* **Documentation:** Fixes PR concerns (6ab1fc9)
* **Documentation:** Fixes PR concerns and typos (2a23d2b, NEBV-1257)
* **Documentation:** Fixes PR concerns with testing process doc (85bcc21, NEBV-1257)


* **Tests:** adds missing glob for app/utilities/*.spec.js (d09536f)
* **Project Maintenance:** Upgrade babel from v6 to v7 (579798d)


### Tests

* **Code Refactoring:** Pulling out shared test (940d017)
* **Project Maintenance:** Moved test folder to app/tests (d406243)


### TrendButton

* **Bug Fixes:** Proper Display of TrendButton in storybook (fcba082, NEBV-1174)
* **Bug Fixes:** Fixed render issue with Firefox (d5aed6e, NEBV-1174)
* **Tests:** Removes inaccurate test for TrendButton+StreamGraph (cf9c0d6, NEBV-1178)
* **Tests:** Changed function name and prop (57496cd, NEBV-1174)
* **Code Formatting:** Changed spacing and styling in scss file (38ea3ef, NEBV-1174)
* **Code Formatting:** Fixed spacing in Readme doc (4a5ae60, NEBV-1174)
* **Code Formatting:** Fixed styling (93cb5c3, NEBV-1174)
* **Code Formatting:** Syntax Fix (131bc5d, NEBV-1174)
* **Code Refactoring:** Changed onClick prop and steamGraphData (a7eccfb, NEBV-1174)
* **Code Refactoring:** Changed proptypes and unused parameters (0736c19, NEBV-1174)
* **Code Refactoring:** Refactored code, test file, and storybook (b623042, NEBV-1174)
* **Code Refactoring:** Removes reference to StreamGraphs, which will be implemented differently in t (9c0d1da, NEBV-1178)
* **Documentation:** Changed docs (1ba9fce, NEBV-1174)
* **Documentation:** Fixed style in code docs (dfafffa, NEBV-1174)
* **Documentation:** Update README docs for TrendButton Component (5a96aa0)
* **Project Maintenance:** Added Opn-cli for OS consistency (64c2203, NEBV-1174)
* **Project Maintenance:** Modify storybook to use knobs (54e87e7, NEBV-1174)


### utilities/handleInteraction

* **Features:** Adds handleInteraction helper to bind event listeners and tabInde (3d8307d, NEBV-1173)


### View2

* **Project Maintenance:** Removes unused View2 container (5320360, NEBV-1257)


### VSCode

* **Tests:** Fix mocha-sidebar support (90539eb)
* **Tests:** Commit .vscode/settings.json for preconfigured mocha (459bb27)


### VSCode/Mocha-Sidebar

* **Project Maintenance:** fixes VSCode Mocha-Sidebar not finding the test configuration (a8edaee)


### WheelRayLegend

* **Tests:** increasing test coverage, much more to be done. (a4cf755)
* **Code Refactoring:** Fixing for the merge review comments and other linting issues. (57f5ad0)


### WheelRayLegend private component and some logic

* **Features:** This is a rough implementation no TDD (652273c)


### BREAKING CHANGES

* **List:** <List onChange={...} /> emits index instead of value
* **CompanyWheel animation:** addition of react-spring to the project
* **IconSelector:** Changed component PropTypes
* **IconSelector:** Changed PropTypes
* **colors.scss:** name of colors, structure changed

