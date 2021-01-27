import { CONFIG_LAYOUT, PAGES } from '../constants';

export const initialState = {
  // by-region, by-sector, electricity, scenarios, oil-and-gas
  page: 'landing',
  // energyDemand, electricityGeneration, oilProduction, gasProduction
  mainSelection: null,
  yearId: null,
  // petajoules, kilobarrelEquivalents, gigawattHours, kilobarrels, thousandCubicMetres,
  // cubicFeet, millionCubicMetres
  unit: null,
  // region, source
  view: null,
  sector: null,
  scenarios: null,
  provinces: null,
  provinceOrder: null,
  sources: null,
  sourceOrder: null,
  // timeline
  baseYear: null,
  compareYear: null,
  // oil-and-gas
  noCompare: null,
};

export const getReducer = (regions, sources, sectors, yearIdIterations) => {
  const getSelection = (page, selection) => {
    const validSelections = Object.keys(CONFIG_LAYOUT).filter(
      selectionKey => CONFIG_LAYOUT[selectionKey].pages.includes(page),
    );

    return validSelections.includes(selection) ? selection : (validSelections[0] || null);
  };
  const getYearId = (page, yearId) => {
    if (page === initialState.page) {
      return null;
    }

    const yearIds = Object.keys(yearIdIterations);

    return yearIds.includes(yearId) ? yearId : yearIds.sort().reverse()[0];
  };
  const getUnit = (selection, unit) => {
    const validUnits = CONFIG_LAYOUT[selection]?.unit || [];
    return validUnits.includes(unit) ? unit : (validUnits[0] || null);
  };
  const getView = (page, view) => {
    const validViews = PAGES.find(pageItem => pageItem.id === page).views;

    if (!validViews) {
      return null;
    }

    return validViews.includes(view) ? view : validViews[0];
  };
  const getSector = (page, sector) => {
    if (page !== 'by-sector') {
      return null;
    }

    return sectors.order.includes(sector) ? sector : sectors.order[0];
  };
  const getScenarios = (page, yearId, scenarios) => {
    if (page === initialState.page) {
      return null;
    }

    const validScenarios = yearIdIterations[yearId].scenarios;
    const validatedScenarios = validScenarios.filter(scenario => scenarios?.includes(scenario));

    if (validatedScenarios.length) {
      return (page === 'scenarios') ? validatedScenarios : [validatedScenarios[0]];
    }

    // Evolving will always take precedence
    return validScenarios.includes('Evolving') ? ['Evolving'] : [validScenarios[0]];
  };
  const getProvinces = (page, view, provinces) => {
    if (page === initialState.page) {
      return null;
    }

    const validatedProvinces = regions.order.filter(region => provinces?.includes(region));

    if ((page === 'by-region') || (view === 'source')) {
      return (provinces?.includes('ALL') || !provinces) ? regions.order : validatedProvinces;
    }

    if (
      provinces?.includes('ALL')
      || !validatedProvinces.length
      || (validatedProvinces.length === regions.order.length)
    ) {
      return ['ALL'];
    }

    return [validatedProvinces[0]];
  };
  const getProvinceOrder = (page, order) => {
    if (page === initialState.page) {
      return null;
    }

    const validatedProvinces = regions.order.filter(region => order?.includes(region));

    return (validatedProvinces.length === regions.order.length) ? order : regions.order;
  };
  const getValidSources = (page, selection) => {
    const type = PAGES.find(pageItem => pageItem.id === page).sourceTypes?.[selection];

    return sources[type]?.order;
  };
  const getSources = (page, selection, view, selectedSources) => {
    const validSources = getValidSources(page, selection);

    if (!validSources) {
      return null;
    }

    const validatedSources = validSources.filter(source => selectedSources?.includes(source));

    if ((page === 'by-sector') || (view === 'region')) {
      return (selectedSources?.includes('ALL') || !selectedSources) ? validSources : validatedSources;
    }

    if (
      selectedSources?.includes('ALL')
      || !validatedSources.length
      || (validatedSources.length === validSources.length)
    ) {
      return ['ALL'];
    }

    return [validatedSources[0]];
  };
  const getSourceOrder = (page, selection, order) => {
    const validSources = getValidSources(page, selection);

    if (!validSources) {
      return null;
    }

    const validatedSources = validSources.filter(source => order?.includes(source));

    return (validatedSources.length === validSources.length) ? order : validSources;
  };
  const getBaseYear = (page, baseYear) => {
    const value = parseInt(baseYear, 10);

    // set to 0 if not available so that the year slider stays at the minimum year number.
    return Number.isNaN(value) ? 0 : value;
  };
  const getCompareYear = (page, compareYear) => {
    const value = parseInt(compareYear, 10);

    // set to 0 if not available so that the year slider stays at the minimum year number.
    return Number.isNaN(value) ? 0 : value;
  };

  return (state, action) => {
    let mainSelection;
    let yearId;
    let view;

    switch (action.type) {
      case 'page/changed':
        if (!action.payload || (action.payload === initialState.page)) {
          return initialState;
        }

        mainSelection = getSelection(action.payload, state.mainSelection);
        yearId = getYearId(action.payload, state.yearId);
        view = getView(action.payload, state.view);

        return {
          ...state,
          page: action.payload,
          mainSelection,
          yearId,
          unit: getUnit(mainSelection, state.unit),
          view,
          sector: getSector(action.payload, state.sector),
          scenarios: getScenarios(action.payload, yearId, state.scenarios),
          provinces: getProvinces(action.payload, view, state.provinces),
          provinceOrder: getProvinceOrder(action.payload, state.provinceOrder),
          // Always reset the sources on page change
          sources: getSources(action.payload, mainSelection, view, null),
          sourceOrder: getSourceOrder(action.payload, mainSelection, state.sourceOrder),
          baseYear: getBaseYear(action.payload, state.baseYear),
          compareYear: getCompareYear(action.payload, state.compareYear),
        };
      case 'mainSelection/changed':
        mainSelection = getSelection(state.page, action.payload);

        return {
          ...state,
          mainSelection,
          unit: getUnit(mainSelection, state.unit),
          // Always reset the sources on selection change
          sources: getSources(state.page, mainSelection, state.view, null),
          sourceOrder: getSourceOrder(state.page, mainSelection, state.sourceOrder),
        };
      case 'yearId/changed':
        yearId = getYearId(state.page, action.payload);

        return {
          ...state,
          yearId,
          // Reset the scenarios to the default
          scenarios: getScenarios(state.page, yearId, null),
        };
      case 'unit/changed':
        return {
          ...state,
          unit: getUnit(state.mainSelection, action.payload),
        };
      case 'view/changed':
        view = getView(state.page, action.payload);

        return {
          ...state,
          view,
          provinces: getProvinces(state.page, view, state.provinces),
          sources: getSources(state.page, state.mainSelection, view, state.sources),
          sourceOrder: getSourceOrder(state.page, state.mainSelection, state.sourceOrder),
        };
      case 'sector/changed':
        return {
          ...state,
          sector: getSector(state.page, action.payload),
        };
      case 'scenarios/changed':
        return {
          ...state,
          scenarios: getScenarios(state.page, state.yearId, action.payload),
        };
      case 'provinces/changed':
        return {
          ...state,
          provinces: getProvinces(state.page, state.view, action.payload),
        };
      case 'provinceOrder/changed':
        return {
          ...state,
          provinceOrder: getProvinceOrder(state.page, action.payload),
        };
      case 'sources/changed':
        return {
          ...state,
          sources: getSources(state.page, state.mainSelection, state.view, action.payload),
        };
      case 'sourceOrder/changed':
        return {
          ...state,
          sourceOrder: getSourceOrder(state.page, state.mainSelection, action.payload),
        };
      case 'baseYear/changed':
        return {
          ...state,
          baseYear: getBaseYear(state.page, action.payload),
        };
      case 'compareYear/changed':
        return {
          ...state,
          compareYear: getCompareYear(state.page, action.payload),
        };
      case 'noCompare/changed':
        return {
          ...state,
          noCompare: Boolean(action.payload),
        };
      default:
        return state;
    }
  };
};
