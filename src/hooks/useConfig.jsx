import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import { createBrowserHistory } from 'history';
import queryString from 'query-string';

import { initialState, getReducer } from './reducer';
import useAPI from './useAPI';

const parameters = ['page', 'mainSelection', 'yearId', 'sector', 'unit', 'view'];
const delimitedParameters = ['scenarios', 'provinces', 'provinceOrder', 'sources', 'sourceOrder'];
const history = createBrowserHistory();
const ConfigContext = createContext();

export const ConfigProvider = ({ children }) => {
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
