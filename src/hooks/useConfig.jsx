import React, { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';
import queryString from 'query-string';

import { DEFAULT_CONFIG, REGION_ORDER, SOURCE_ORDER } from '../types';
import useAPI from './useAPI';

const parameters = ['page', 'mainSelection', 'yearId', 'sector', 'unit', 'view'];
const delimitedParameters = ['scenarios', 'provinces', 'provinceOrder', 'sources', 'sourceOrder'];
const history = createBrowserHistory();
const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
  // TODO: Cleanup app state structure (remove order parameters) and consider moving to useReducer
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const { yearIdIterations } = useAPI();

  /**
   * URL parachuting.
   */
  // TODO: Address potential issues of list values with commas inside the value
  useEffect(() => {
    const query = queryString.parse(history.location.search);
    const yearIds = Object.keys(yearIdIterations).sort();
    const yearId = yearIds.indexOf(query.yearId) === -1 ? yearIds.reverse()[0] : query.yearId;
    const scenarios = yearIdIterations[yearId]?.scenarios || [];
    let queryScenarios = query.scenarios?.split(',').filter(scenario => scenarios.indexOf(scenario) !== -1);

    if (!queryScenarios?.length) {
      queryScenarios = [scenarios[0]];
    }

    setConfig({
      ...DEFAULT_CONFIG,
      ...query,
      provinces: query.provinces ? query.provinces.split(',') : REGION_ORDER,
      provinceOrder: query.provinceOrder ? query.provinceOrder.split(',') : REGION_ORDER,
      sources: query.sources ? query.sources.split(',') : SOURCE_ORDER,
      sourceOrder: query.sourceOrder ? query.sourceOrder.split(',') : SOURCE_ORDER,
      yearId,
      scenarios: queryScenarios,
    });
  }, [yearIdIterations]);

  /**
   * Update the URL if the control setting is modified.
   */
  useEffect(() => {
    const queryParameters = parameters.map(
      parameter => `${parameter}=${config[parameter]}`,
    );
    const delimitedQueryParameters = delimitedParameters.map(
      parameter => `${parameter}=${config[parameter].join(',')}`,
    );

    history.replace({
      pathname: history.location.pathname,
      search: `?${queryParameters.concat(delimitedQueryParameters).join('&')}`,
    });
  }, [config]);

  return (
    <ConfigContext.Provider value={{ config, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node,
};

ConfigProvider.defaultProps = { children: null };

export default () => useContext(ConfigContext);
