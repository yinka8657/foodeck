import React, { createContext, useState, useEffect, useCallback } from 'react';
import API_URL from "./config";

export const SelectedIngredientsContext = createContext();

// Normalize ingredient names
const normalizeNames = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((ing) => {
      if (typeof ing === "string") return ing.trim();
      if (ing && typeof ing.name === "string") return ing.name.trim();
      return null;
    })
    .filter(Boolean);

// Safe localStorage wrapper
const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn("⚠️ Storage quota exceeded, using memory fallback:", e);
    window._memoryStore = window._memoryStore || {};
    window._memoryStore[key] = value;
  }
};

const safeGetItem = (key) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return window._memoryStore ? window._memoryStore[key] : null;
  }
};

// Debounce utility
const useDebounce = (value, delay) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
};

export const SelectedIngredientsProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState(() => safeGetItem('selectedIngredients') || []);
  const [recipeCount, setRecipeCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [recipeError, setRecipeError] = useState(null);

  const debouncedIngredients = useDebounce(selectedIngredients, 400); // 400ms debounce

  // Load all recipes once
  useEffect(() => {
    let cancelled = false;
    setLoadingRecipes(true);
    fetch(`${API_URL}/api/recipes`)
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setRecipes(Array.isArray(data) ? data : []);
          setLoadingRecipes(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error("Error fetching meals:", err);
          setRecipeError(err.message);
          setLoadingRecipes(false);
        }
      });
    return () => { cancelled = true; };
  }, []);

  // Cache for suggested recipes
  const suggestionCache = React.useRef({});

  const fetchRecipeCount = useCallback(async (ingredients) => {
    const normalized = normalizeNames(ingredients);
    if (!normalized.length) {
      setRecipeCount(0);
      return;
    }

    const cacheKey = normalized.join('_');
    if (suggestionCache.current[cacheKey]) {
      setRecipeCount(suggestionCache.current[cacheKey].length);
      return;
    }

    try {
      setLoadingCount(true);
      const res = await fetch(`${API_URL}/api/recipes/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedIngredients: normalized }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error ${res.status}: ${text}`);
      }

      const data = await res.json();
      suggestionCache.current[cacheKey] = Array.isArray(data) ? data : [];
      setRecipeCount(suggestionCache.current[cacheKey].length);
    } catch (err) {
      console.error("Error fetching recipe count:", err);
      setRecipeCount(0);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  // Trigger fetch after debounced selection
  useEffect(() => {
    safeSetItem('selectedIngredients', selectedIngredients);
    fetchRecipeCount(debouncedIngredients);
  }, [selectedIngredients, debouncedIngredients, fetchRecipeCount]);

  return (
    <SelectedIngredientsContext.Provider
      value={{
        selectedIngredients,
        setSelectedIngredients,
        recipeCount,
        setRecipeCount,
        loadingCount,
        recipes,
        loadingRecipes,
        recipeError
      }}
    >
      {children}
    </SelectedIngredientsContext.Provider>
  );
};
