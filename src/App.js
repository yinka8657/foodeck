import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ReactGA from "react-ga4";

// Pages
import RecipeHome from './RecipeHome';
import RecipePage from './RecipePage';
import IngredientPage from './IngredientPage';
import RecipeEditor from './RecipeEditor';
import IngredientSelectorPage from './IngredientSelectorPage';
import RecipeSuggestionPage from './RecipeSuggestionPage';
import LogoPage from './LogoPage';
import './App.css';
import InstallPage from "./InstallPage";
import AnalyticsTracker from "./AnalyticsTracker";


// Layout
import MainLayout from './MainLayout';

// Context
import { SelectedIngredientsProvider } from './SelectedIngredientsContext';

function App({ user, onLogout }) {
  const [isMobile, setIsMobile] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);


  // React GA4

  useEffect(() => {
    ReactGA.initialize("G-DN29GHT6MT"); // replace with your GA4 Measurement ID
    ReactGA.send("pageview"); // track initial pageview
  }, []);

  //Conditional Rendering for Different Screens

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

  //Pinch and Zoom prevent on iOS

  useEffect(() => {
    const handleTouch = (event) => {
      if (event.touches.length > 1) {
        event.preventDefault(); // prevent pinch
      }
    };
    document.addEventListener("touchstart", handleTouch, { passive: false });

    return () => {
      document.removeEventListener("touchstart", handleTouch);
    };
  }, []);


  const handleLogoFinish = () => setShowLogo(false);

  if (!isLoaded) return null;
  if (!isMobile) return <div className="switch-message">Please switch to a mobile device for the best experience.</div>;
  if (showLogo) return <LogoPage onFinish={handleLogoFinish} />;

  // Fix for inconsistent vh across devices
  function setVh() {
    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );
  }

  // Set on load
  setVh();

  // Update on resize/orientation change
  window.addEventListener('resize', setVh);
  window.addEventListener('orientationchange', setVh);


  return (
    <SelectedIngredientsProvider>
      <MainLayout user={user} onLogout={onLogout}>

         {/* Analytics tracker sits here so it runs on every route change */}
         <AnalyticsTracker /> 

        <Routes>
          <Route path="/" element={<RecipeHome />} />
          <Route path="/ingredient-to-recipe" element={<IngredientSelectorPage />} />
          <Route path="/ingredient-to-recipe/suggestions" element={<RecipeSuggestionPage />} />
          <Route path="/recipe" element={<RecipePage user={user} />} />
          <Route path="/ingredientPage" element={<IngredientPage />} />
          <Route path="/admin/new-recipe" element={<RecipeEditor />} />
          {/* Other routes */}
          <Route path="/install" element={<InstallPage style={{ width: '100%' }} />} />
        </Routes>
      </MainLayout>
    </SelectedIngredientsProvider>
  );
}

export default App;
