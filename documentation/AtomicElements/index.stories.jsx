import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, number } from '@storybook/addon-knobs';

import ReadMe from './README.md';
import Typography from './typography';
import Buttons from './buttons';
import Forms from './forms';
import Fonts from './fonts';

const options = {
  range: true,
  min: 1,
  max: 60,
  step: 1,
};

const noop = () => <></>;
storiesOf('Atomic Design|HTML', module)
  .addDecorator(withKnobs)
  .add('Description', noop, { readme: { content: ReadMe } })
  .add('Typography', () => <Typography />)
  .add('Buttons', () => <Buttons />)
  .add('Forms', () => <Forms />)
  .add('Fonts', () => <Fonts fontSize={number('Font Size', 14, options)} />);
