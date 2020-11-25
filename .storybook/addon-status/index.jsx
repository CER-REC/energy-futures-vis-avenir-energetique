import React from 'react';
import { makeDecorator } from '@storybook/addons';
import Status from './Status';

const defaultOptions = {};

function addStatus(storyFn, context, providedOptions) {
  const props = {
    ...defaultOptions,
    ...providedOptions,
  };

  return (
    <Status {...props}>
      {storyFn(context)}
    </Status>
  );
}

const optionToObject = (val = {}) => (typeof val === 'string' ? { name: val } : val);

export default makeDecorator({
  name: 'withStatus',
  parameterName: 'status',
  allowDeprecatedUsage: false,
  skipIfNoParametersOrOptions: true,
  wrapper: (getStory, context, { options, parameters }) => {
    const optionsObj = optionToObject(options);
    const parametersObj = optionToObject(parameters);

    // Hide if this was used as a decorator for both the storybook and a story.
    if (optionsObj.name && parametersObj.name) { return getStory(context); }

    const mergedOptions = { ...optionsObj, ...parametersObj };
    return addStatus(getStory, context, mergedOptions);
  },
});
