import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RecipeHome from './RecipeHome';
import RecipePage from './RecipePage';
import MainLayout from './MainLayout';
import IngredientSelectorPage from './IngredientSelectorPage'; // renamed
import RecipeSuggestionPage from './RecipeSuggestionPage'; // stays the same

function App() {

  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 480);
    };

    checkScreenSize(); // Check on mount

    window.addEventListener('resize', checkScreenSize); // Update on resize

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return (

    

    <Router>
      {isMobile ? (
        <Routes>
          <Route path="/" element={<MainLayout><RecipeHome /></MainLayout>} />
          <Route path="/ingredient-to-recipe" element={<MainLayout><IngredientSelectorPage /></MainLayout>} />
          <Route path="/ingredient-to-recipe/suggestions" element={<MainLayout><RecipeSuggestionPage /></MainLayout>} />
          <Route path="/recipe" element={<RecipePage />} />
        </Routes>
          ) : (
        <div className="switch-message">
          Please switch to a mobile device for the best experience.
        </div>
      )}
    </Router>
  );
}

export default App;
