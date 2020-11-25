import React from 'react';
import { storiesOf } from '@storybook/react';
import Git from './git.md';
import Code from './code.md';

const noop = () => <></>;
storiesOf('Documentation|Standards', module)
  .add('Git', noop, { readme: { content: Git } })
  .add('Code', noop, { readme: { content: Code } });
