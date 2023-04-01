import React from 'react';
import ReactHtmlParser from 'react-html-parser';
import html from '../../../.serveLazyDevServerTemplate.html';
import { storiesForView } from '../../../.storybook/utils';
import '../../styles.css';
import ReadMe from './README.md';
import App from '.';
import ErrorBoundary from '../../components/ErrorBoundary';

let bodyInnerHtml = html.substring(html.indexOf('<body '), html.lastIndexOf('</body>'));

bodyInnerHtml = bodyInnerHtml.substring(bodyInnerHtml.indexOf('>') + 1);

storiesForView('Containers|App', module, ReadMe)
  .add('default', () => <App />)
  .add('within WET', () => ReactHtmlParser(bodyInnerHtml, {
    transform: (node) => {
      switch (node.attribs?.id) {
        case 'wb-bar':
        case 'wb-srch':
          return null;
        case 'reactRoot':
          return <App key="reactRoot" />;
        default:
          return undefined;
      }
    },
  }))
  .add('WithErrors', () => {
    const BuggyComponent = () => {
      throw new Error('I crashed!');
    };

    return (
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    );
  });
