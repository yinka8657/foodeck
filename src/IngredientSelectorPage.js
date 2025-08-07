// src/IngredientSelectorPage.js
import React, { useState, useEffect } from 'react';
import IngredientList from './IngredientList';

function IngredientSelectorPage() {
  const [selectedIngredients, setSelectedIngredients] = useState(() => {
    const saved = localStorage.getItem('selectedIngredients');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);

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
