import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import MainWrapper from './MainWrapper';
import reportWebVitals from './reportWebVitals';
import { SelectedIngredientsProvider } from './SelectedIngredientsContext'; // 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <SelectedIngredientsProvider>
      <MainWrapper />
    </SelectedIngredientsProvider>
  </React.StrictMode>
);

reportWebVitals();
