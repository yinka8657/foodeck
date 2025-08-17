// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import RecipeHome from './RecipeHome';
import RecipePage from './RecipePage';
import IngredientPage from './IngredientPage';
import IngredientSelectorPage from './IngredientSelectorPage';
import RecipeSuggestionPage from './RecipeSuggestionPage';
import SignUpLogin from './SignUpLogin';
import LogoPage from './LogoPage'; // Splash screen logo page

// Layout
import MainLayout from './MainLayout';

// Context
import { SelectedIngredientsProvider } from './SelectedIngredientsContext';

function App() {
  // 🖥️ Track whether the device is mobile
  const [isMobile, setIsMobile] = useState(true);

  // 👤 Logged-in user info (read from localStorage on first render)
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  //  Splash screen visibility
  const [showLogo, setShowLogo] = useState(true);

  //  Loading state — ensures app only renders after all assets are loaded
  const [isLoaded, setIsLoaded] = useState(false);

  //  Detect screen size (mobile vs desktop)
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 480);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  //  Wait until the entire page (images, fonts, etc.) is fully loaded
  useEffect(() => {
    const handleLoad = () => {
      // Add a slight delay for smoother splash transition
      setTimeout(() => setIsLoaded(true), 200);
    };

    if (document.readyState === 'complete') {
      // Page is already fully loaded
      handleLoad();
    } else {
      // Wait for the 'load' event
      window.addEventListener('load', handleLoad);
    }

    // Cleanup listener
    return () => {
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  //  Handle user logout — keep ingredients but clear auth
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  //  Callback to hide splash screen
  const handleLogoFinish = () => {
    setShowLogo(false);
  };

  //  While still loading assets, render nothing (black screen) or a loader
  if (!isLoaded) {
    return null; 
  }

  //  If not on mobile, show message
  if (!isMobile) {
    return (
      <div className="switch-message">
        Please switch to a mobile device for the best experience.
      </div>
    );
  }

  // 🎬 Show splash screen first
  if (showLogo) {
    return <LogoPage onFinish={handleLogoFinish} />;
  }

  //  Show login/signup if not logged in
  if (!user) {
    return <SignUpLogin onLogin={setUser} />;
  }

  // Show main app after login
  return (
    <SelectedIngredientsProvider>
      <Router>
        <MainLayout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<RecipeHome />} />
            <Route path="/ingredient-to-recipe" element={<IngredientSelectorPage />} />
            <Route path="/ingredient-to-recipe/suggestions" element={<RecipeSuggestionPage />} />
            <Route path="/recipe" element={<RecipePage />} />
            <Route path="/ingredientPage" element={<IngredientPage />} />
          </Routes>
        </MainLayout>
      </Router>
    </SelectedIngredientsProvider>
  );
}

export default App;
