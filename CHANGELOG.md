# [2.2.0](http://neb-energy-futures-devdoc.s3-website.us-west-2.amazonaws.com/v2.2.0) (2021-01-17)


### DraggableVerticalList

* **Features:** moves the react-beautiful-dnd mock to the testing setup file (b900695)
* **Features:** adds check to see if dragging is disabled (d409a59)
* **Bug Fixes:** applies suggested fixes (7805ce4)


### Electricity

* **Features:** adds randomness in mock data generation to make the stories look more realistic (87639b0)
* **Features:** applies a different approach for locating bubble groups in test scripts (90e2b29)
* **Features:** removes unnecessary component parameter for hiding the year slider (46b95aa)
* **Features:** updates the method how config parameters are passed into the stories (8aeb386)
* **Features:** adds testing scripts, README, and stories for the Electricity page (7a7f4be)


### Hooks

* **Features:** moves the mockApolloClient to the test folder (abf7d65)
* **Features:** replaces the mock Apollo client with the one with wildcards (77d07d1)
* **Features:** adds testing scripts for React hooks (dccc366)
* **Bug Fixes:** adds the updated mockApolloClient which is missing from the previous commit (955df58)


### Landing

* **Features:** adds test cases for verifying responsiveness in the Landing page (8d5fc14)
* **Features:** adds testing scripts. README, and stories for the landing page (2d649fe)


### LinkButtonGroup

* **Features:** completes testing for user events such as clicking (a5a567e)
* **Features:** adds testing scripts, README, and stories for the LinkButtonGroup component (d0fabae)
* **Bug Fixes:** removes an unnecessary comment in the LinkButtonGroup README (3fdac56)


### OilAndGas

* **Features:** uses method 'exists' to verify the rendering for a better accuracy (10e0353)
* **Features:** adds testing scrips, README, and stories for the Oil-and-Gas page (e2ea746)


### PageLayout

* **Features:** improves the method for testing responsiveness (94f83da)
* **Features:** finds a workaround for the error in generating storyshots (677868b)
* **Features:** adds testing scripts, README. and stories for the PageLayout component (98b2dc2)


### Share

* **Bug Fixes:** adds small fixes based on feedback (ec5912a)
* **Bug Fixes:** fixes tests for social media (7fb9ed0)
* **Bug Fixes:** applies suggested fixes (26501c2)
* **Bug Fixes:** applies a small amount of cleanup (959fbdb)
* **Bug Fixes:** remove global nock (43f1a83)
* **Bug Fixes:** applies alans suggested fixes (9ece583)
* **Bug Fixes:** changes delay in timeout to 1000 (8798ae3)
* **Bug Fixes:** removes tests for copy button (0362962)
* **Bug Fixes:** another attempt to fix tests (5f00a8a)
* **Bug Fixes:** attepts to fix test suite (b7537ee)
* **Bug Fixes:** fixes act issue (ab24af9)
* **Bug Fixes:** fixes broken tests (71494fd)
* **Tests:** added more tests and fixes (0e765e9)


### Testing

* **Features:** removes components and testing methods that are no longer used (46ba209)
* **Features:** cleans up errors and warnings in test output (89f6f41)
* **Features:** mutes warning messages caused by react-beautiful-dnd during testing (d5eaabd)
* **Features:** improves old test scripts for HorizontalControlBar and VerticalDraggableList (4f0c584)


* **Bug Fixes:** Added UTF-8 BOM to CSV file generation (763a388)
* **Project Maintenance:** Scaled down social media image size (5fe8808)


### Scenarios

* **Features:** adds testing scripts, README, and stories for the Scenarios page (c4465d2)


### Share Tests

* **Bug Fixes:** fixes broken tests (6ec6784)


### ShareButtons

* **Tests:** adds some tests to share buttons (107d301)


### shareLinks

* **Code Refactoring:** improves readme and changes to exist test (f9214d0)


### Utilities

* **Features:** adds testing scripts for custom React hooks (40d2396)
* **Features:** fixes the Number.toLocaleString issues under node 12.13 on GitLab runtime (dfc781b)
* **Features:** adds testing scrips for the utility functions (080052d)


### YearSlider

* **Features:** adds testing logic for verifying the year auto-play function (13c8eab)
* **Features:** adds testing scripts, README, and stories for the component (13f7339)

# [2.1.0](http://neb-energy-futures-devdoc.s3-website.us-west-2.amazonaws.com/v2.1.0) (2020-12-14)


* **Features:** Added a blank array as a dataLayer fallback and remove console logs for GTM events (4495201)


### byRegion

* **Bug Fixes:** reduces motion stiffness of bar chart (7957260)


### ByRegion

* **Features:** updates the method how config parameters are passed into the stories (c4abaaf)
* **Features:** adds a piece of comment explaining the generation of the mock data (aab3bae)
* **Features:** adds testing scripts, README, and stories for the By-Region page (18c80c5)


### BySector

* **Features:** updates the method how config parameters are passed into the stories (d014fe7)
* **Features:** adds the missing change in the previous commit (f407098)
* **Features:** adds testing scripts, README, and stories for the By-Sector page (7bde808)


### DataAnalytics

* **Features:** uses 'hover' instead of 'click' as the action type when capturing viz POI event (ad9177a)
* **Features:** updates some useConfig calls to narrow down the exposure of internal structure (9a7a8da)
* **Features:** captures user events then hovering on viz (706ce4a)
* **Features:** captures user events in helps and media buttons (4e79c95)
* **Features:** captures user events in control and navigation components (181a549)
* **Features:** adds shortcut methods to simplify the event report process (f70d27c)
* **Features:** updates the local WET template to connect to the DEV env (075a0b3)
* **Features:** sets up basic infrastructure for connecting with the backend envs (f758a51)
* **Bug Fixes:** updates data analytics event name to 'visualization interaction' (c779851)
* **Bug Fixes:** prevents event tags from being translated (8085634)
* **Bug Fixes:** fixes the testing error in Hint after adding the useConfig hook (0b53634)


### DraggableVerticalList

* **Features:** improves testing logic for a better coverage (f67e7e2)
* **Features:** adds testing scripts, README, and stories (e690158)


### Hint

* **Features:** removes unnecessary beforeEach methods from the test (aedda3c)
* **Bug Fixes:** fixes a newly introduced linting warning in the testing scripts (ebb9b0a)


### LinkButtonGroup

* **Features:** adds analytics calls to linkButtonGroup buttons (60a0692)
* **Bug Fixes:** pulls in config locally now (36c3a24)
* **Bug Fixes:** fixes linting issue (7c88f69)


### pageSelect

* **Features:** improved test coverage for pageSelect (8e96153)
* **Documentation:** adds documentation and some tests to pageSelect (da5c570)


### PageSelect

* **Bug Fixes:** small tweak to improve code quality (242746a)


### scenarioSelect

* **Documentation:** adds docs and testing to scenarioSelect (d9ebf32)


### ScenarioSelect

* **Tests:** adds tests, including storybook (ea8acc6)


### ShareButtons

* **Features:** adds analytics to share buttons (3b2d0be)


### Storybook

* **Features:** updates README for the HorizontalContrlBar component (da178a5)
* **Features:** adds theme and stories of the HorizontalControlBar component in Storybook (a10e9e0)


### Testing

* **Features:** fixes incorrect methods when testing the existence of nodes in MaxTick and VizTooltip (55453ef)
* **Features:** fixes incorrect methods when testing the existence of nodes in Nivo layers (21cac3d)
* **Features:** removes unnecessary beforeEach method in testcases of MaxTick and VizTooltip (44b39d1)
* **Features:** adds test cases and README for MaxTick and VizTooltip components (47e8d86)
* **Features:** adds testing scripts for FadeLayer and ForecastLayer (03d2d16)
* **Features:** adds tests and README for the Hint related components (2eaa963)
* **Features:** adds test cases for the HorizontalControlBar component (cfade5f)


### YearSelect

* **Tests:** adds storybook setup (f61fcce)
* **Tests:** adds tests for yearSelect (fba0494)

# [2.0.0](http://neb-energy-futures-devdoc.s3-website.us-west-2.amazonaws.com/v2.0.0) (2020-11-25)


* **Features:** Fixed corrupted PDF file (8359793)
* **Features:** Updated the email subject (0872bc9)
* **Features:** Added social media card images (1dd6641)
* **Features:** Added other defaults for page select translations (bc0e425)
* **Features:** Fixed errors for empty Storybook snapshots (5dac141)
* **Features:** Validated sectors in config reducer (784abe1)
* **Features:** Updated source list component in the oil and gas visualization to be consistent with the electricity visualization (1a9b70a)
* **Features:** Updated region list component in the oil and gas visualization to be consistent with the electricity visualization (004f392)
* **Features:** Reversed change to oil and gas label as it's being used as part of the translation ID (7e0bc3e)
* **Features:** Updated reducer view state to accommodate the oil and gas visualization views (791405f)
* **Features:** Added source and source order actions to the config reducer (e73998f)
* **Features:** Removed the side effect in DraggableVerticalList of resetting the region/source lists (9c3c05c)
* **Features:** Updated components to use dispatch for config and removed config update side effects (9251650)
* **Features:** Replaced useState with useReducer in the config provider (c36cd5c)
* **Features:** Added a toast message when the URL is copied to the clipboard (f6fba15)
* **Features:** Fixed missing electricity CSV data and static scenarios CSV data (a9b3ce6)
* **Features:** Fixed region translation in the electricity chart (ad8073f)
* **Features:** Added Storybook item for the Share component (ce51a8b)
* **Features:** Addressed special case for the electricity visualization (18fec55)
* **Features:** Added conversion of the units in the CSV data (74823a0)
* **Features:** Added the CSV structures (dae7aeb)
* **Features:** Added CSV creation and download (412e79f)
* **Features:** Moved region and scenario translations under common (cc36aab)
* **Features:** Added translations for downloading CSV data (f5de38c)
* **Features:** Added libraries to create and download the CSV data (a7cfcb8)
* **Features:** Added copying of the shortened Bitly link (9ac7578)
* **Features:** Added email share contents (4bc3969)
* **Features:** Moved share controls into it's own component (da6bca8)
* **Features:** Create mock nodes for Material UI slider components during a snapshot (f82430c)
* **Features:** Enabled and updated oil production query (fbcec29)
* **Features:** Updated queries and controls to use sector enums (4d4d707)
* **Features:** Pulled sector enums from the translation results into the API hook (4c46db9)
* **Features:** Updated sector translation key structure (f32de06)
* **Features:** Replaced sector constant with enum keys (94258dd)
* **Features:** Updated Storybook snapshots to use mocked data for the GraphQL API (dcd4730)
* **Features:** Added Apollo Testing and Synchronous Promise packages for Storybook snapshots (c6055c5)
* **Features:** Added loading of API translations for Storybook (de03cb1)
* **Features:** Fixed source state being reset on initial load (228f183)
* **Features:** Added source translations to the by sector and electricity graphs (6c6e3e3)
* **Features:** Added source configurations from API, and removed previous source constants and temporary stubs (08fac28)
* **Features:** Added source configurations for API hook (db7f5a3)
* **Features:** Added translation for ALL ite in the vertical list (127131d)
* **Features:** Updated region key references to use the keys provided by the API (9290cab)
* **Features:** Added translations from the API to the i18n messages (db042c9)
* **Features:** Fixed hook call ordering (33d7f94)
* **Features:** Added the config and GraphQL decorators to the relevant stories (8af919d)
* **Features:** Created Storybook decorator for the app config context and GraphQL (9a9143f)
* **Features:** Changed config context usage to use state directly inside the provider (8c04b7d)
* **Features:** Updated LoadingIndicator test to mount with INTL and set the type (9bdcd6a)
* **Features:** Updated React INTL mounting for tests (7e0b344)
* **Features:** Added back in translations for the error boundary component (063b751)
* **Features:** Set default year iterations API configuration (1fc3f70)
* **Features:** Fixed Apollo provider for Storybook (1977d5d)
* **Features:** Updated Energy Futures data hook to use the iterations from API configuration (7ec4e26)
* **Features:** Stubbed in evolving scenario translations (7014804)
* **Features:** Fixed leftover merge issues (aeaccc2)
* **Features:** Removed unneeded scenario/year constants and update year and scenario defaults to use the API configuration (f61bc8e)
* **Features:** Removed unused import (dda2f1b)
* **Features:** Updated scenario selection to use the data from the API configurations (5d55754)
* **Features:** Renamed year iteration mapping in API configurations (d24aafb)
* **Features:** Updated year selection to use the data from the API configurations (e75601e)
* **Features:** Moved Apollo provider to the root to be able to get API configurations for translations (4501003)
* **Features:** Migrated React INTL in storybook to the newest version (3f7a1be)
* **Features:** Added in translations for the loading, scenarios and support warnings (788a9ff)
* **Features:** Updated loading indicator with translation support (df03c87)
* **Features:** Removed leftover translations from conditions scaffolding (9fda0ca)
* **Features:** Updated React Intl to the latest version (d72f053)
* **Features:** Added a hook to get the API configurations starting with the iterations list (eaf3488)
* **Bug Fixes:** Removed unnecessary Sass option definition in Webpack (d998bad)
* **Code Refactoring:** Added null for consistency (b1fbe72)
* **Code Refactoring:** Created Storybook Apollo client module (3f7770d)
* **Code Refactoring:** Moved function to format API translations to i18n messages into a utitlies module (63da69b)
* **Code Refactoring:** Moved Storybook Apollo client into a module for reuse and mocking during snapshot tests (7d6f434)
* **Code Refactoring:** Moved the API iteration and translation query into queries module for Storybook config reuse (3c03c24)
* **Code Refactoring:** Removed unneeded imports (4e58b86)
* **Code Refactoring:** Rename year and scenario configuration keys (de26e1a)
* **Code Refactoring:** Split out headers and download CSV function to useMemo and useCallback (3204af2)
* **Code Refactoring:** Split out reducer into another module (6107050)
* **Code Refactoring:** Update story names for consistency (59c0730)
* **Code Refactoring:** Updated source type structure and added the type for the oil and gas visualization (977670c)
* **Code Refactoring:** Updated useAPI structure to remove data key (e5979ad)
* **Documentation:** Removed leftover changelog file from the conditions project (c6f63e4)
* **Documentation:** Updated DraggableVerticalList Storybook example (f9adb34)
* **Project Maintenance:** Added PDF files to the binary list (c0295c1)
* **Project Maintenance:** Updated about files (bf28e65)


### A11y

* **Features:** adds the missing translations and fixes linting issues (e852102)
* **Features:** adds more aria-labels and puts them in the language files (d77cfab)
* **Features:** adds aria-labels for help buttons and share buttons (fbff3a8)


### All

* **Code Refactoring:** adds the mock-up by-scenario page (dba7531)
* **Code Refactoring:** adopts code structure from Conditions and cleanning up (c7935c9)
* **Code Refactoring:** disconnects the wiring with the GraphQL middleware (f40b1e0)
* **Code Refactoring:** initial UI scaffolding for 2.0 (b4e2c0f)
* **Code Refactoring:** removes SCSS code in components (51a9940)
* **Code Refactoring:** updates Storybook version and adds the second page (5aff034)


### Apollo

* **Code Refactoring:** connects with the real GraphQL API and cleans up old scripts (7b87393)


### App

* **Bug Fixes:** adds domready to enhance the loading process (af5bb27)


### B-07458

* **Features:** added title page select bar placeholder (ad837bb)


### BubbleChart

* **Features:** makes the bubbles display better on tablet in the Electricity page (98e9204)
* **Features:** updates class names so that the DOM structure is more meaningful in the annotatio (4839167)
* **Features:** updates the look-and-feel of the bubbles and adds an annotation (43a82b9)
* **Features:** adds internationalization in the bubble tooltips and annotations (febc3ba)
* **Features:** makes the bubbles also support group-by-source (a0d6d3a)
* **Features:** makes the legend type check always required and fixes a typo (7bd92d6)
* **Features:** updates the algorithem and display chart tooltips and legend (3512c4d)
* **Features:** updates the arrangment algorithm of the bubbles based on the new design (90b3a52)
* **Features:** replaces hard-coded min and max year values with the real values (d62fd19)
* **Features:** moves solarWindGeothermal from SOURCE_ORDER to ELECTRICITY_SOURCE_ORDER (51e335f)
* **Features:** moves the source list reset logic to the page layout component (23e9d19)
* **Features:** makes the source select work (633230c)
* **Features:** removes unnecessary config.provinces check when constructing request queries (abe64cb)
* **Features:** adds an abbreviation formatter for displaying large numerical values (12e4191)
* **Features:** skips the request call if none of the regions are selected (85daff8)
* **Features:** fixes linting and testing warnings and errors (ac66ac4)
* **Features:** disables buttons that are not currently supported (a596c2d)
* **Features:** adds drag-n-drop supports in by-region and by-sector (f49bf40)
* **Features:** consolidates raw data parsing logic into a utility file (62dc416)
* **Features:** connects with real data and adds the auto-play (7bf8c86)
* **Bug Fixes:** fixes newly introduced lint errors (24f9479)
* **Bug Fixes:** deletes the types file which is no longer necessary (154267a)
* **Bug Fixes:** shows the original value in the unit formatter if it is smaller than 1 (4cd0ff0)
* **Bug Fixes:** fixes a mis-labelled region tooltip (2b7e7a4)


### by region

* **Bug Fixes:** fixed margin issue where right numbers are cut off (245b797)


### by region/sector/scenario

* **Features:** added working forecast bar (ddc75bb)


### by sector

* **Bug Fixes:** fixed color issue and ordering issue. (a32f0ad)


### by-sector

* **Code Refactoring:** Remove mock data (0c06872)


### By-Sector

* **Bug Fixes:** Fixed x axis formatting a little (6ec9269)


### byRegion

* **Features:** energyDemand byRegion graph is hooked up to test server (04b80b7)
* **Code Refactoring:** applied changes suggested in code review (a624e48)


### ByRegion/Sector/Scenario

* **Bug Fixes:** fixed syntax error (607bcfc)


### bySector

* **Features:** Made tick marks consistant with other charts (db9252d)
* **Bug Fixes:** added boolean check on ordered data (9f18778)


### charts

* **Features:** basic setup for fade out (95af532)


### ColorPalette

* **Features:** cleans up lint warnings (ed9b236)
* **Features:** updates colors for oil, gas, and regions on Oct 27th (c3312d8)
* **Features:** updates source colors based on the latest design (0a77313)


### Controls

* **Features:** experiments on converting the controls to drop-down selects (277d194)
* **Features:** wires the controls together and adds URL parachuting (2fe6dc7)


### convertUnit

* **Features:** added unit converter logic from EF1 (19ac445)
* **Bug Fixes:** improves the formatUnitAbbreviation method to produce better formatting (88dcd54)


### ConvertUnit

* **Features:** updates the convertion coefficients related to Mboe/d (4973569)
* **Features:** changes Mboe back to Mboe/d (732f48e)
* **Features:** updates the unit conversion logic (3dbcc6f)
* **Features:** completes unit translations in tooltips (bf6d8a6)
* **Features:** changes MB/d to Mb/d (b8d23ca)
* **Features:** removes manually added scientific abbreviations from unit formatting (87d9d16)
* **Features:** fixes issues in the unit abbreviation format logic (a58afa9)


### data hook

* **Features:** some clean up (6bd4e6d)
* **Code Refactoring:** refactored the way the hook grabbed year min/max (28f5400)


### Demand

* **Features:** Mock up flower chart with D3 (ef690ef)


### DemandPage

* **Features:** adds the demand page in the menu structure (c7f3aa7)


### DraggableVerticalList

* **Features:** adds the grasp indicator (3-dots) if the list is draggable (e674a51)
* **Features:** makes the draggable list support keyboard navigation (012d9ba)
* **Features:** improves the styling in oil sub-category items (221dd81)
* **Features:** fixes a typography error when rendering the oil tranportation subgroup (5525324)
* **Features:** adds oil type initial text in subgroup items (b44579b)
* **Features:** completes most of the features for render both patterns and gradients i (b9db553)
* **Features:** adds basic look-and-feel for the oil subgroup (4a72c56)
* **Features:** adds help text in each draggable list according to the content (cc2c8ee)
* **Features:** adds detailed tooltips beside item boxes (29ba0d7)
* **Features:** makes it able to distinguish between unselected and unavailable items (b10a5cd)
* **Features:** makes draggable boxes support the disabled state (e20bccf)
* **Features:** makes the draggable vertical list support greyscale boxes if colors are (6a9e280)
* **Features:** updates the color palette of both regions and sources to the newly desi (b74db91)
* **Bug Fixes:** disables unavailable sources from draggable lists in oil-and-gas (9cf7ff0)
* **Bug Fixes:** fixes a propTypes warning when passing in icon components (cf0ae30)
* **Bug Fixes:** verifies the existence of the setItems method before using it (1bf607f)
* **Bug Fixes:** makes selects remain when switching between single- and multi-selection (694e03d)
* **Code Refactoring:** makes the component generic to support readonly and single-select m (a3d14df)


### EF2.0

* **Bug Fixes:** fixed infinite expanding issue with vizs (6d3b938)


### Electricity

* **Bug Fixes:** fixes an error when updating the baseYear value (207b476)
* **Bug Fixes:** resolves the conflict in the config when updating main selections (18a2da5)
* **Bug Fixes:** fixes the issue that units are sometime incorrect (76971ac)
* **Bug Fixes:** fixes a linting introduced after the recent manual merge (cb24b6b)
* **Code Refactoring:** an experiment on rendering the bubble chart with Nivo (2253d89)


### ESLint

* **Bug Fixes:** makes the missing storybook config file join the lint test (6fdffeb)
* **Bug Fixes:** cleans up all existing lint warnings and errors (6dac783)


### euseEnergyFutureData

* **Code Refactoring:** applied suggested fixes from code review (cd90d79)


### fadeLayer

* **Bug Fixes:** fixed opacity issue (b6317e8)


### FadeLayer

* **Features:** fixes linting warnings (3e5e5ef)
* **Features:** makes the fade-out effect look consistent across all viz (e206523)
* **Features:** replaces the SVG filtering with pattern masking for supporting Firefox (ac20b7b)
* **Features:** remains semi-transparency in the scenarios visualization (f2a6a80)


### Font

* **Features:** applies the FireSansCondensed font family (29310ff)


### forcastBar

* **Bug Fixes:** fixed naming issue in readme (0cdfbf8)


### forecast

* **Bug Fixes:** forecast start year is now dynamic (4dfae6d)
* **Code Refactoring:** simplified forecastStart logic (03396cb)


### forecast bar

* **Code Refactoring:** extracted useStyles out of component (0ab3ae1)
* **Code Refactoring:** removed unnecessary lambdas (6fb7b9c)


### forecastBar

* **Bug Fixes:** introduced fade to the bar (e1db5fe)
* **Bug Fixes:** bar no longer interferes with hover actions (34ac841)
* **Code Refactoring:** extract bar into its own component (34befdf)


### ForecastLayer

* **Features:** removes the old ForecastBar component because it is no longer used (11d345b)
* **Features:** moves the forecast bar into a Nivo viz layer (882db27)


### forecastStart

* **Bug Fixes:** forecast numbers backwards (68a58c4)


### Git

* **Code Refactoring:** ignores the HTML snapshot test folder temporarily (0ca58f5)


### hexToRGBA

* **Bug Fixes:** added case for 3 digit hexs (8f79089)


### Hint

* **Features:** separates year and text in the year select description (b4e5698)
* **Features:** makes the UI support selection-based hover text and updates the shortened text (163521b)
* **Features:** fixes linting issues in the recently added keyboard navigation change (34e79ad)
* **Features:** adds explanation of how to use kayboard to navigate the draggable lists (18b886d)
* **Features:** makes it possible to define the help text dialog widths individually (008ec42)
* **Features:** expands the Hint component for handling more complex content (97d7357)
* **Features:** adds mock-up hints in the navigation and controls (2dd95c1)


### Horizontal Control Bar

* **Code Refactoring:**  update HCB to better reflect new design (9157ecf)


### horizontalControlBar

* **Features:** basic structure for control bar (bf9d505)


### HorizontalControlBar

* **Features:** changes variable name from SECTORS to SECTOR_ORDER (4cfeac6)
* **Features:** updates real tooltip text for control buttons (bc22a69)
* **Features:** adds a placeholder page for the oil-and-gas viz (e076394)
* **Bug Fixes:** fixes the incorrect sector icon order (bc66952)
* **Bug Fixes:** removes meaningless title and icons (7ddedbd)
* **Bug Fixes:**  fixed eslint useEffect problem (4efbacd)
* **Code Refactoring:** adds missing control buttons and removes the old component (fa06bdc)
* **Code Refactoring:** remove clutter, simplify styles, rename component (b75879d)


### Icons

* **Features:** updates icons for the oil-and-gas page and sectors (f72cfc4)
* **Features:** replaces page and source icons with the new design (acf6e1c)
* **Bug Fixes:** corrects the bio icon in the by-sector page (ac2d53b)
* **Bug Fixes:** fixes the wrong svg of the commercial icon (c015dd7)


### Jest

* **Bug Fixes:** fixes issues occur in existing testings (3772c13)


### LandingPage

* **Features:** adds both language versions of the report cover images (460e127)
* **Features:** updates landing page portal thumbnails (73a6b9c)
* **Features:** adjusts font sizes here and there based on designers' feedback (59cab57)
* **Features:** updates font families used in the landing page (510b901)
* **Features:** adds more improvements in the landing page based on designers' feedback (931ab71)
* **Features:** updates the landing page based on designers' feedback (c8a5ef7)
* **Features:** adds !important to the font override to suppress the WET template font (c854c01)
* **Features:** updates the logic of the link buttons in the landing page (a0b84c2)
* **Features:** updates the layout of the landing page based on the new design (fa3bbd7)
* **Features:** adds page routing and a mock-up landing page (f1388c3)
* **Bug Fixes:** fixes the corrupted methodology PDF file and other small bugfixes (63018f7)
* **Bug Fixes:** fixes some incorrect fonts in the landing page (7910c20)
* **Bug Fixes:** fixes a typo in the landing page (6206b63)


### LinkButtonGroup

* **Features:** displays year ID description in the summary tab (70f163c)
* **Features:** updates the look-and-feel of the report link pop-up (edf2679)
* **Features:** consolidates multiple contents into tabs and applies the new design (16ffd1a)
* **Features:** moves the report link to the top of the context list (36ff876)
* **Features:** adds real text for link button hover messages (8fd9fd4)
* **Features:** introduces package 'micro-down' for parsing markdown text (f17eb9c)
* **Features:** applies the new look-and-feel to the link button pop-up (db4ef3e)
* **Features:** updates social media icons (e70819f)
* **Features:** updates the grouping and the accent color bar layout based on the design (cf55fde)
* **Features:** refines styling and fixes a typo (f42c8c3)
* **Features:** adds a quick mock-up of the link and social media buttons (60d9e39)
* **Bug Fixes:** fixes the hard-coded methodology link in the link button panel (cc87261)
* **Bug Fixes:** removes the horizontal scrollbar in the report panel on Firefox (00d8e6e)
* **Bug Fixes:** makes buttons with long text wrap automatically (1480da1)
* **Bug Fixes:** removes a piece of incorrect comment text (ca96876)
* **Bug Fixes:** fixes some small button layout issues (bd38e75)


### MaxTick

* **Features:** reduces whitespace on the right side of viz by relocating the max tick (d70843f)


### Mock-up Data

* **Code Refactoring:** updates the mock-up data with parsed structures (41f0f7d)


### NavAndControls

* **Bug Fixes:** adjusts font and button sizes and alignments in nav and controls (eae86ab)


### NivoCharts

* **Features:** applies the custom y-axis tick style to all basic charts (b7566da)
* **Features:** displays unit beside the y-axis tick with the largest value only (4e2901f)
* **Bug Fixes:** fixes recent lint issues introduced by the y-axis tick styling code (cbd3f97)


### o@g

* **Performance Improvements:** update nivo treemap version (ec8ef50)


### o&g

* **Features:** add updated translations for gasProduction (694c337)
* **Features:** removes percentage text in legend on single select (546f5cf)
* **Features:** adds check to percentages logic (3b26080)
* **Features:** applies fixes from code review (d7d267b)
* **Features:** updated the treeMap tile to binary flipped (ae4acfe)
* **Features:** updated legend text (aec2ba7)
* **Features:** applied a variety of small styling changes (195c178)
* **Features:** styled compare button (04a8155)
* **Features:** applied minor styling changes (a89f6ca)
* **Features:** adjusted styles for small treeMaps and legend (c67bade)
* **Features:** uses oil and gas colors now (9cc4cff)
* **Features:** set foundation for small treeMap section (part 2) (977300b)
* **Features:** set basic foundation for the small treeMap section (5db4d14)
* **Features:** added legend and fixed scroll bar (705ff8e)
* **Features:** added tooltip formatting. Fixed name labels. Fixed sizing a bit (bfeabf8)
* **Features:** small cosmetic changes; Year display (7c53447)
* **Features:** convert layout to table and adjust sizing algorithm (b6b3fe8)
* **Features:** added slider (6a7fd25)
* **Bug Fixes:** fix linting issue (b8439eb)
* **Bug Fixes:** add french translations (5918c2e)
* **Bug Fixes:** refines data sort logic (69c745c)
* **Bug Fixes:** makes legend text smaller (93e1cbd)
* **Bug Fixes:** fixes bug with treeMap name display (c4251d7)
* **Bug Fixes:** removes squares beside years display (3f3d697)
* **Bug Fixes:** replaces treeMap titles (57eeca6)
* **Bug Fixes:** reorders units to be inperial first (d796836)
* **Bug Fixes:** changes the button text from source to type (188ebe5)
* **Bug Fixes:** updates source acronyms for oil and gas (74b9a2b)
* **Bug Fixes:** changes compare to be on by default (b1b43ef)
* **Bug Fixes:** changes animation black background to white (0bfd3d0)
* **Bug Fixes:** changes sort logic to always sort by curr treemapData (fa240ec)
* **Bug Fixes:** increases padding a bit to remove cosmetic issue (06f17cc)
* **Bug Fixes:** fixes misaligned comparison treemaps (360ab2a)
* **Bug Fixes:** reduces padding on table cells (a4e85b8)
* **Bug Fixes:** small cosmetic fixes (ea6cc0f)
* **Bug Fixes:** source icons now use design abbreviations (df4edd2)
* **Bug Fixes:** small cosmetic fixes (7755b78)
* **Bug Fixes:** fixed issue with sources not coming back correct (f3ad7a2)
* **Bug Fixes:** removed bottom border on slider (776837c)
* **Bug Fixes:** fixed bug where page would crash if certain provs were selected (4374f8f)
* **Bug Fixes:** fixed scrollbar issue (7fc4180)
* **Bug Fixes:** fixed query param bug. Adjusted chart sizing (5295569)
* **Bug Fixes:** fixed table layout. fixed chart sizing (3d005fd)
* **Code Refactoring:** cleaned up code quite a bit (d9d8038)
* **Code Refactoring:** removes linting override and small cleanup (8fc0065)
* **Performance Improvements:** simplified logic for treemaps (9f34a29)


### O&G

* **Features:** basic legend created (52a5ce1)
* **Bug Fixes:** fixed translation issue (115f2f5)
* **Bug Fixes:** further fixed crash on page switch bug (f252fbf)


### oAndG

* **Features:** added specific queries for all sources. Fixed colors (380523f)


### oil-and-gas

* **Bug Fixes:** temp fix to show oil and gas page (64f9ca4)
* **Bug Fixes:** applied fixes from code review (f8421ab)


### oilAndGas

* **Features:** Basic foundation for table layout (b937ab6)
* **Features:** refactored to enable easier sizing (b6ed21c)


### OilAndGas

* **Features:** polishes the styling around the treemaps (710f411)
* **Features:** slightly updates the treemap size calculation logic (7ce6270)
* **Features:** refines the oil-and-gas UI here and there (6f32ff3)
* **Features:** fixes the issue caused by out-range year values (4c1e6b8)
* **Features:** updates the no-data placeholder using the region/source name (defae4a)
* **Features:** adds placeholders if no data is available (aa09f64)
* **Features:** fixes some small layout issues (186db84)
* **Features:** applies a max size to the treemaps (8852125)
* **Features:** fixes linting issues in the new treemap size calculation (307a0ce)
* **Features:** adds some small UI improvements in the page (e8baa38)
* **Features:** uses viz DOM width to calculate the size of each treemap (b1d4268)
* **Features:** memorizes the compare button state in the URL query parameters (884894a)
* **Features:** renders small boxes at the bottom of treemaps (03fbfca)
* **Features:** fixes recent introduced linting issues (dfba0f2)
* **Features:** removes empty cells when the item has zero values in both current and compare data (800b9f4)
* **Features:** displays paired tooltips in the oil-and-gas comparison (d921fc0)
* **Features:** makes space for absent treemaps to ensure the vertical alignment (2d158ec)
* **Features:** updates the styling and translations (4fc8f44)
* **Features:** links the baseYear and compareYear from URL (c80940e)
* **Features:** disables the page temporarily for the external demos (693009b)
* **Features:** basic scaffolding for oilAndGas viz (fbbf353)
* **Bug Fixes:** fixes the missing small values group box when not comparing (8ea0d2d)
* **Bug Fixes:** fixes the sometime incorrect y-position of the small values group box (498ed21)
* **Bug Fixes:** fixes the issue that gaps in the row results in extremely large treemaps (cba9ed9)
* **Bug Fixes:** fixes the overlapping tooltip boxes over the treemaps (6c263ab)
* **Bug Fixes:** fixing the linting issue (80d1432)
* **Bug Fixes:** fixes the bug in the previous treemap size logic that sizes in rows were not related (5a7dfb9)
* **Bug Fixes:** fixes a styling error when rendering the year boxes at the top-right corner (57b6241)


### PageLayout

* **Features:** gets the viz bounding dimension at the top level and passes it down to viz (92ee68f)
* **Features:** adds basic responsiveness for supporting both desktop and tablet (9bba4a1)
* **Features:** adjusts component layouts so that long French text can be displayed properly (8bcb08c)
* **Features:** updates the page layout arrangement based on the latest design (27a2a29)
* **Features:** adds sources in oil-and-gas page and adjusts the basic page layout (5655a56)
* **Features:** applies y-axis ticks to the chart grids as well (390fc68)
* **Features:** improves the logic for generating chart max ticks when in extreme cases (8262d80)
* **Features:** displays the actual max value in the highest y-axis tick (d8bc2cb)
* **Features:** uses tickValues to control the distribution of the y-axis ticks (df7652a)
* **Features:** reverts back to static rendering when generating y-axis ticks (79fe3d6)
* **Features:** generates vis tick class names conditionally (fe9aee7)
* **Features:** reduces white spaces around the title row and vertical draggable lists (70e93ba)
* **Features:** consolidates request loading and error handling in the layout level (7f7a3eb)
* **Bug Fixes:** fixes a couple of testing errors caused by recent changes in the layout (969a4c1)
* **Bug Fixes:** fixes the infinite render loop caused by the sources update (da6a9a4)
* **Bug Fixes:** fixes some small rendering issues on Safari (d6ad57c)
* **Code Refactoring:** updates the page layout based on the new design and consolidates theme variabl (3aabd01)


### PageSelect

* **Features:** replaces the selected page title with a more readable version (1003081)
* **Features:** updates the UI design and displays page labels (9bfdb3c)
* **Features:** adds the animated page select based on the new design (7fb0361)
* **Bug Fixes:** fixes the clicking target issue and adds tooltips (04e83d7)
* **Code Refactoring:** replaces the old nav with the new page select (9bdbc2e)


### parseData

* **Bug Fixes:** all charts now have access to min and max years for their data (1344eb8)


### queries

* **Bug Fixes:** minor fix to include scenario in oil_prod_all (2783e7f)
* **Bug Fixes:** fixed formatting. (66a11bc)


### README

* **Documentation:** Updated project name in the README (4bf9951)


### Region

* **Bug Fixes:** addresses issues in the region select and other UI improvements (de30151)
* **Code Refactoring:** improves the look-and-feel and interaction based on the new design (f584f49)


### Regions

* **Code Refactoring:** refines look-and-feel and the drag-n-drop experience (eb18c3e)


### RegionSelect

* **Features:** makes the ALL button stateful and more meaningful (afe3dc7)


### scenarios

* **Bug Fixes:** pointsLayer colors are now dynamic (578a9b6)


### Scenarios

* **Features:** updates scenario button colors (c79d558)
* **Code Refactoring:** applied suggested changes (2f7a51d)


### scenarios, bysector

* **Bug Fixes:** wrap functions in usecallback (f9e61fe)


### ScenarioSelect

* **Features:** updates the logic in generating yearly descriptions (e56940c)
* **Features:** makes reference button support different tooltip text in different years (392f940)
* **Features:** makes Evolving as the first and the default scenario option when it is availab (a808429)
* **Features:** changes to more specific triggers in the useEffect hook (d9fd106)
* **Features:** wraps methods in proper hooks for a better performance (ceb277c)
* **Features:** supports multi-selection and multiple colors (806d0c8)
* **Features:** makes the scenario select collapse into a drop-down on tablet screens (0f3f9e9)
* **Bug Fixes:** reverts unnecessary changes (4849715)
* **Bug Fixes:** fixes the the broken scenario auto-correct mechanism (e7a4848)
* **Bug Fixes:** fixes a couple of small linting issues (c3f212d)


### Share

* **Features:** fixes the testing error caused by the dialog attribute keepMounted (6242b74)
* **Features:** supports the copy-link-to-clipboard action on Safari (be7586f)


### SocialMediaShares

* **Features:** fixes the typography issue in the toast message after copying a link (3309399)


### SourceSelect

* **Features:** adds the source select as a vertical draggable list (3de2520)


### Storybook

* **Code Refactoring:** updates the Storybook config according to recent changes (cba5c31)


### Theme

* **Features:** adds missing font size definitions (2d1547a)
* **Features:** removes CSS reset (cd5e8fe)


### TitleBar

* **Bug Fixes:** fixes the missing image issue in Storybook (5f69344)
* **Code Refactoring:** updates the year select and the scenario buttons in title bar based on the new d (5f6cfbc)


### Translations

* **Features:** final updates of the French translations (dcd5d81)
* **Features:** fixes a typo in a French translation text (e6a6648)
* **Features:** updates the remaining French translation text (2a69333)
* **Features:** removes words 'crude' and 'natural' from the oil-and-gas page titles (456b33f)
* **Features:** updates by-sector page title text (1aa9fdc)
* **Features:** shortens the gas production button text (1d507b2)
* **Features:** updates the French translations for eletricity page annotations (2ec4bc0)
* **Features:** integrates markdown files of the about content into the UI (fc43085)
* **Features:** adds markdown files for the about content in both English and French (4769324)
* **Features:** fixes missing translation tags here and there (12be74c)
* **Features:** adds French translations from the doc (ae4ad9b)
* **Features:** uses 'react-markdown' for markdown text parsing and rendering (1d5b0df)
* **Features:** updates the Result 2020 help text (36c9c1f)
* **Bug Fixes:** updates button tooltip text in scenario buttons (218a8e4)


### UseAPI

* **Features:** removes the Nivo stream library because it is not used (ee03f4d)
* **Features:** removes SASS packages because they are no longer used (2f5952c)
* **Bug Fixes:** adds a temporary patch that removes duplidate translation entries (aae76f6)


### useConfig

* **Features:** sets 'Evolving' as the default scenario if available (3edf901)
* **Bug Fixes:** set evolving to be default scenario (6fe1e48)


### UseConfig

* **Features:** removes the unnecessary parseInt when decoding baseYear and compareYear from the UR (90fbdd7)
* **Features:** adds baseYear and compareYear in the URL query parameters (13fc33f)


### useEnergyData

* **Bug Fixes:** changes oil source from c5 to C_5 (65ebe61)


### useEnergyFutureData

* **Features:** added data processing for bySector page (76ba448)
* **Features:** moved byregion data processing into data hook (d61b5de)
* **Features:** added-hook-to-retrieve-data (6ba6529)
* **Bug Fixes:** removes source solarWindGeothermal from the by-sector page (a68d211)
* **Bug Fixes:** added more fields to query in data hook (40005f1)
* **Code Refactoring:** made some styling changes as suggested by team (76efabb)
* **Code Refactoring:** refactored and cleaned up data hook (6054329)


### useENergyFutureData

* **Code Refactoring:** apply suggested changes from code review (eacc7f6)


### VizTooltip

* **Features:** fixes rendering issues in viz tooltips especially in the oil-and-gas page (5d7138e)
* **Features:** makes it possible to hide total and percentages in chart tooltips (0beae99)
* **Features:** makes viz tooltip of by-sector and scenarios page consistent (6de5b40)


### VizToolTip

* **Features:** auto-converts to mmBOE/D if necessary in the unit abbreviation formatter (18cadf2)


### webpack

* **Bug Fixes:** forgot to update the publicPath in babel (8611a88)


### yearSelect

* **Bug Fixes:** Update title (4ccdeb2)


### YearSelect

* **Features:** adds tooltip text in year select buttons and fixes some help text mistakes (dd486a9)
* **Features:** moves the button styling into the theme so that it can be reused (01e8bc2)
* **Features:** experiments on various ways of toggle between years (16c2114)
* **Bug Fixes:** Issue where bottom slider came up as NaN (cdb2961)
* **Code Refactoring:** adds a placeholder for the 2016 alternative data-set and some other UI changes (006f7f3)


### yearSelecter

* **Features:** changed around some logic for the year display (03c8f9c)


### YearSlider

* **Features:** shows the forecast indicator in the oil-and-gas year slider (ce6891c)
* **Features:** updates the reducer logic for generating baseYear and compareYear (51d3470)
* **Features:** adjusts the z-index of the forecast bar so that it does not cover the slider focus (24684eb)
* **Features:** adds an optional forecast bar (529c524)
* **Features:** refines styling to improve the look-and-feel of the slider (ea016bf)
* **Features:** makes the year slider support the 2nd compared slider (9fe63a3)
* **Features:** moves the year slider to its own component (45740ec)
* **Bug Fixes:** fixes the incorrect button size of the year slider play button (19ecc9c)
* **Bug Fixes:** fixes the broken Storyboard testing (a7ea189)

