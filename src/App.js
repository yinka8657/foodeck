import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

// Pages
import RecipeHome from './RecipeHome';
import RecipePage from './RecipePage';
import IngredientPage from './IngredientPage';
import RecipeEditor from './RecipeEditor';
import IngredientSelectorPage from './IngredientSelectorPage';
import RecipeSuggestionPage from './RecipeSuggestionPage';
import LogoPage from './LogoPage';

// Layout
import MainLayout from './MainLayout';

// Context
import { SelectedIngredientsProvider } from './SelectedIngredientsContext';

function App({ user, onLogout }) {
  const [isMobile, setIsMobile] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth <= 480);
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const handleLoad = () => setTimeout(() => setIsLoaded(true), 200);

    if (document.readyState === 'complete') handleLoad();
    else window.addEventListener('load', handleLoad);

    return () => window.removeEventListener('load', handleLoad);
  }, []);

  const handleLogoFinish = () => setShowLogo(false);

  if (!isLoaded) return null;
  if (!isMobile) return <div className="switch-message">Please switch to a mobile device for the best experience.</div>;
  if (showLogo) return <LogoPage onFinish={handleLogoFinish} />;

  return (
    <SelectedIngredientsProvider>
      <MainLayout user={user} onLogout={onLogout}>
        <Routes>
          <Route path="/" element={<RecipeHome />} />
          <Route path="/ingredient-to-recipe" element={<IngredientSelectorPage />} />
          <Route path="/ingredient-to-recipe/suggestions" element={<RecipeSuggestionPage />} />
          <Route path="/recipe" element={<RecipePage />} />
          <Route path="/ingredientPage" element={<IngredientPage />} />
          <Route path="/admin/new-recipe" element={<RecipeEditor />} />
        </Routes>
      </MainLayout>
    </SelectedIngredientsProvider>
  );
}

export default App;
