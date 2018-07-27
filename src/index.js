import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter as Router } from 'react-router-dom'
import { MyProvider } from './context/ContextComp'

ReactDOM.render(
  <MyProvider>
    <Router>
      <App />
    </ Router>
  </MyProvider>  ,
  document.getElementById('root'));
//registerServiceWorker();
