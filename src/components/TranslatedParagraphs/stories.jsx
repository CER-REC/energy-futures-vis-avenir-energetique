import { doc } from 'storybook-readme';
import { storiesForComponent } from '../../../.storybook/utils';
import ReadMe from './README.md';

storiesForComponent('Components|TranslatedParagraphs', module)
  .add('documentation', doc(ReadMe));
