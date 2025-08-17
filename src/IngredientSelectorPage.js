// src/IngredientSelectorPage.js
import React from 'react';
import IngredientList from './IngredientList';

function IngredientSelectorPage({ selectedIngredients, setSelectedIngredients }) {
  return (
    <div style={{ padding: '1em' }}>
      <IngredientList
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />
    </div>
  );
}

export default IngredientSelectorPage;
