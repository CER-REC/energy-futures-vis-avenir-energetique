import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';
import queryString from 'query-string';

import { CONFIG_LAYOUT, PAGES } from '../constants';
import useAPI from './useAPI';

const parameters = ['page', 'mainSelection', 'yearId', 'sector', 'unit', 'view'];
const delimitedParameters = ['scenarios', 'provinces', 'provinceOrder', 'sources', 'sourceOrder'];
const history = createBrowserHistory();
const ConfigContext = createContext();

const initialState = {
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
};

const getReducer = (regions, sources, yearIdIterations) => {
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
  const getView = (page, view) => (page !== 'electricity' ? null : (view || 'region'));
  // TODO: Replace default sector with default from API
  const getSector = (page, sector) => (page !== 'by-sector' ? null : (sector || 'ALL'));
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

    if ((page === 'by-region') || ((page === 'electricity') && (view === 'source'))) {
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

    if ((page === 'by-sector') || ((page === 'electricity') && (view === 'region'))) {
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
        };
      case 'mainSelection/changed':
        mainSelection = getSelection(state.page, action.payload);

        return {
          ...state,
          mainSelection,
          unit: getUnit(mainSelection, state.unit),
          sources: getSources(state.page, mainSelection, state.view, state.sources),
          sourceOrder: getSourceOrder(state.page, mainSelection, state.sourceOrder),
        };
      case 'yearId/changed':
        yearId = getYearId(state.page, action.payload);

        return {
          ...state,
          yearId,
          // Reset the scenarios to the default
          scenarios: getScenarios(state.page, yearId),
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
      default:
        return state;
    }
  };
};

export const ConfigProvider = ({ children }) => {
  const { regions, sources, yearIdIterations } = useAPI();
  const reducer = useMemo(
    () => getReducer(regions, sources, yearIdIterations),
    [regions, sources, yearIdIterations],
  );
  const [config, configDispatch] = useReducer(reducer, initialState);

  /**
   * URL parachuting.
   */
  useEffect(() => {
    const query = queryString.parse(history.location.search);

    configDispatch({ type: 'page/changed', payload: query.page });
    configDispatch({ type: 'mainSelection/changed', payload: query.mainSelection });
    configDispatch({ type: 'yearId/changed', payload: query.yearId });
    configDispatch({ type: 'unit/changed', payload: query.unit });
    configDispatch({ type: 'view/changed', payload: query.view });
    configDispatch({ type: 'sector/changed', payload: query.sector });
    configDispatch({ type: 'scenarios/changed', payload: query.scenarios?.split(',') });
    configDispatch({ type: 'provinces/changed', payload: query.provinces?.split(',') });
    configDispatch({ type: 'provinceOrder/changed', payload: query.provinceOrder?.split(',') });
    configDispatch({ type: 'sources/changed', payload: query.sources?.split(',') });
    configDispatch({ type: 'sourceOrder/changed', payload: query.sourceOrder?.split(',') });
  }, [configDispatch]);

  /**
   * Update the URL if the control setting is modified.
   */
  useEffect(() => {
    const queryParameters = parameters.map(
      parameter => `${parameter}=${config[parameter] || ''}`,
    );
    const delimitedQueryParameters = delimitedParameters.map(
      parameter => `${parameter}=${config[parameter]?.join(',') || ''}`,
    );

    history.replace({
      pathname: history.location.pathname,
      search: `?${queryParameters.concat(delimitedQueryParameters).join('&')}`,
    });
  }, [config]);

  return (
    <ConfigContext.Provider value={{ config, configDispatch }}>
      {children}
    </ConfigContext.Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node,
};

ConfigProvider.defaultProps = { children: null };

export default () => useContext(ConfigContext);
