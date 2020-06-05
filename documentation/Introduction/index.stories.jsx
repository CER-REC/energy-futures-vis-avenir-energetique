import React from 'react';
import { storiesOf } from '@storybook/react';
import README from './README.md';
import ProgressMatrix from './ProgressMatrix';
import CHANGELOG from '../../CHANGELOG.md';

const noop = () => <></>;
storiesOf('Documentation|Introduction', module)
  .add('to the document', noop, { readme: { content: README } })
  .add('progress matrix', () => <ProgressMatrix />)
  .add('changelog', noop, { readme: { content: CHANGELOG } });
