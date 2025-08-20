import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainWrapper from './MainWrapper';
import reportWebVitals from './reportWebVitals';
import { SelectedIngredientsProvider } from './SelectedIngredientsContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <SelectedIngredientsProvider>
        <MainWrapper />
      </SelectedIngredientsProvider>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
