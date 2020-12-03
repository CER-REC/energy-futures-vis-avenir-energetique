import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';
import queryString from 'query-string';

import { initialState, getReducer } from './reducer';
import useAPI from './useAPI';
import { NOOP } from '../utilities/parseData';

const parameters = ['page', 'mainSelection', 'yearId', 'sector', 'unit', 'view', 'baseYear', 'compareYear', 'noCompare'];
const delimitedParameters = ['scenarios', 'provinces', 'provinceOrder', 'sources', 'sourceOrder'];
const history = createBrowserHistory();
const ConfigContext = createContext();

export const ConfigProvider = ({ children, mockConfig, mockConfigDispatch }) => {
  const { regions, sources, sectors, yearIdIterations } = useAPI();
  const reducer = useMemo(
    () => getReducer(regions, sources, sectors, yearIdIterations),
    [regions, sources, sectors, yearIdIterations],
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
    configDispatch({ type: 'baseYear/changed', payload: query.baseYear });
    configDispatch({ type: 'compareYear/changed', payload: query.compareYear });
    configDispatch({ type: 'noCompare/changed', payload: query.noCompare });
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
    <ConfigContext.Provider
      value={mockConfig
        ? { config: mockConfig, configDispatch: mockConfigDispatch }
        : { config, configDispatch }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

ConfigProvider.propTypes = {
  children: PropTypes.node,
  mockConfig: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  mockConfigDispatch: PropTypes.func,
};

ConfigProvider.defaultProps = {
  children: null,
  mockConfig: undefined,
  mockConfigDispatch: NOOP,
};

export default () => useContext(ConfigContext);
