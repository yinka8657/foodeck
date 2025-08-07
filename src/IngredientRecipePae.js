import React, { useState, useEffect } from 'react';
import './App.css';
import IngredientList from './IngredientList';
import RecipeSuggestionList from './RecipeSuggestionList';

function IngredientRecipePage() {
  // Load selected ingredients from localStorage initially
  const [selectedIngredients, setSelectedIngredients] = useState(() => {
    const saved = localStorage.getItem("selectedIngredients");
    return saved ? JSON.parse(saved) : [];
  });


  // Save to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedIngredients", JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);

  return (
    <div className="Recipehome" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <IngredientList
        selectedIngredients={selectedIngredients}
        setSelectedIngredients={setSelectedIngredients}
      />
      <RecipeSuggestionList selectedIngredients={selectedIngredients} />
    </div>
  );
}

export default IngredientRecipePage;
