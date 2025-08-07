// src/RecipeSuggestionPage.js
import React, { useState, useEffect } from 'react';
import RecipeSuggestionList from './RecipeSuggestionList';

function RecipeSuggestionPage() {
  const [selectedIngredients, setSelectedIngredients] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('selectedIngredients');
    if (saved) {
      setSelectedIngredients(JSON.parse(saved));
    }
  }, []);

  return (
    <div style={{ padding: '1em' }}>
      <RecipeSuggestionList selectedIngredients={selectedIngredients} />
    </div>
  );
}

export default RecipeSuggestionPage;
