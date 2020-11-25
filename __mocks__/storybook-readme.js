import React from 'react';

export const doc = () => () => React.createElement('div');
export const addReadme = (storyFn, context) => storyFn(context);
export const configureReadme = () => () => {};
