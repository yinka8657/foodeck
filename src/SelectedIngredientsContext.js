import React, { createContext, useState, useEffect, useCallback } from 'react';
import API_URL from "./config"; // ✅ import from central config

export const SelectedIngredientsContext = createContext();

// Utility for normalization
const normalizeNames = (arr) =>
  (Array.isArray(arr) ? arr : [])
    .map((ing) => {
      if (typeof ing === "string") return ing.trim();
      if (ing && typeof ing.name === "string") return ing.name.trim();
      return null;
    })
    .filter(Boolean);

export const SelectedIngredientsProvider = ({ children }) => {
  const [selectedIngredients, setSelectedIngredients] = useState(() => {
    try {
      const saved = localStorage.getItem('selectedIngredients');
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error("Error parsing localStorage data:", err);
      return [];
    }
  });

  const [recipeCount, setRecipeCount] = useState(0);
  const [loadingCount, setLoadingCount] = useState(false);

  const [recipes, setRecipes] = useState([]);
  const [loadingRecipes, setLoadingRecipes] = useState(true);
  const [recipeError, setRecipeError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoadingRecipes(true);
    fetch(`${API_URL}/api/recipes`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Error fetching meals: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setRecipes(Array.isArray(data) ? data : []);
          setLoadingRecipes(false);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Error fetching meals:", error);
          setRecipeError(error.message);
          setLoadingRecipes(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchRecipeCount = useCallback(async (ingredients) => {
    const normalizedIngredients = normalizeNames(ingredients);
    if (normalizedIngredients.length === 0) {
      setRecipeCount(0);
      return;
    }
    try {
      setLoadingCount(true);
      const res = await fetch(`${API_URL}/api/recipes/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedIngredients: normalizedIngredients }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Server error ${res.status}: ${errorText}`);
      }
      const data = await res.json();
      setRecipeCount(Array.isArray(data) ? data.length : 0);
    } catch (err) {
      console.error("Error fetching recipe count:", err);
      setRecipeCount(0);
    } finally {
      setLoadingCount(false);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedIngredients', JSON.stringify(selectedIngredients));
    fetchRecipeCount(selectedIngredients);
  }, [selectedIngredients, fetchRecipeCount]);

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
