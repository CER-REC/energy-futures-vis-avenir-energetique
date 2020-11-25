import React from 'react';
import { storiesOf } from '@storybook/react';
import Process from './process.md';
import Documentation from './documentation.md';

const noop = () => <></>;
storiesOf('Documentation|Testing', module)
  .add('Process', noop, { readme: { content: Process } })
  .add('Documentation', noop, { readme: { content: Documentation } });
