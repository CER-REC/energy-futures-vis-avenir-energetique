import React from 'react';
import { storiesOf } from '@storybook/react';
import HighLevel from './highLevel.md';
import Component from './components.md';
import View from './views.md';
import Translation from './translations.md';

const noop = () => <></>;
storiesOf('Documentation|Architecture', module)
  .add('High Level', noop, { readme: { content: HighLevel } })
  .add('Components', noop, { readme: { content: Component } })
  .add('Views', noop, { readme: { content: View } })
  .add('Translations', noop, { readme: { content: Translation } });
