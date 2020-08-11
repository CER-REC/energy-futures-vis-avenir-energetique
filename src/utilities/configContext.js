import React from 'react';
import { DEFAULT_CONFIG } from '../types';

/**
 * A global store of the current state of the control setting.
 */
// eslint-disable-next-line import/prefer-default-export
export const ConfigContext = React.createContext({
  config: DEFAULT_CONFIG,
  setConfig: () => {},
});
