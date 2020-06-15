import React from 'react';
import ReactDOM from 'react-dom';
import DomReady from 'domready';
import './styles.css'; // Import this before any components to ensure CSS ordering works
import App from './containers/App';

DomReady(() => {
  ReactDOM.render(<App />, document.getElementById('reactRoot'));
});
