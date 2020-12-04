import React from 'react';
import ScenarioSelect from './index';

describe('ScenarioSelect', () => {
  test('should set default multiSelect to false', () => {
    const scenarioSelect = <ScenarioSelect />;

    expect(scenarioSelect.props).toStrictEqual({ multiSelect: false });
  });
});
