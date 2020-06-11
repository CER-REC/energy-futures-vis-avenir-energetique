import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css'; // Import this before any components to ensure CSS ordering works
import App from './containers/App';

ReactDOM.render(<App />, document.getElementById('reactRoot'));
