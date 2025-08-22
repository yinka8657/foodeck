import './App.css';
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { SelectedIngredientsContext } from './SelectedIngredientsContext';
import API_URL from "./config"; // central config

function RecipeSuggestionList() {
  const { selectedIngredients, setRecipeCount } = useContext(SelectedIngredientsContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  // Log selected ingredients
  useEffect(() => {
    console.log("Selected ingredients in RecipeSuggestionList:", selectedIngredients);
  }, [selectedIngredients]);

  // Update recipe count
  useEffect(() => {
    setRecipeCount(recipes.length);
  }, [recipes, setRecipeCount]);

  // Fetch & cache suggestions
  useEffect(() => {
    if (!selectedIngredients || selectedIngredients.length === 0) {
      setRecipes([]);
      setRecipeCount(0);
      return;
    }

    const cacheKey = `recipeSuggestions_${selectedIngredients.map(i => i.name).join("_")}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      setRecipes(parsed);
      setRecipeCount(parsed.length);
    }

    setLoading(true);
    setFetchError(null);

    fetch(`${API_URL}/api/recipes/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        selectedIngredients: selectedIngredients.map((ing) => ing.name),
      }),
    })
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server error: ${text}`);
        }
        if (contentType && contentType.includes("application/json")) {
          return res.json();
        } else {
          const text = await res.text();
          throw new Error(`Unexpected response format: ${text}`);
        }
      })
      .then((data) => {
        const recipesArray = Array.isArray(data) ? data : [];
        setRecipes(recipesArray);
        setRecipeCount(recipesArray.length);
        localStorage.setItem(cacheKey, JSON.stringify(recipesArray));
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
        setFetchError(error.message);
      })
      .finally(() => setLoading(false));
  }, [selectedIngredients, setRecipeCount]);

  // Render messages for empty, loading, or error states
  if (!selectedIngredients || selectedIngredients.length === 0) {
    return (
      <p className="center-message" style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '60vh', fontSize: '1.5rem', fontWeight: '600', color: '#666',
        textAlign: 'center', padding: '0 1rem'
      }}>
        No Recipe Suggestion yet...<br />Add ingredients to see suggestions.
      </p>
    );
  }

  if (loading) return <p className="center-message">Loading suggestions...</p>;
  if (fetchError) return <p className="center-message" style={{ color: 'red', padding: '1rem' }}>Failed to load suggestions: {fetchError}</p>;
  if (recipes.length === 0) return <p className="center-message">No suggestions found.</p>;

  // Sort recipes by match ratio
  const sortedRecipes = [...recipes]
    .map((item) => {
      const ingredientsList = Array.isArray(item.ingredients) ? item.ingredients : [];
      const matchCount = selectedIngredients.filter((selIng) =>
        ingredientsList.some((recipeIng) =>
          recipeIng.name.toLowerCase() === selIng.name.toLowerCase()
        )
      ).length;
      return {
        ...item,
        matchCount,
        ratio: ingredientsList.length > 0 ? matchCount / ingredientsList.length : 0,
      };
    })
     // FILTER OUT recipes with 0 matches
      .filter(item => item.matchCount > 0)
    // SORT BY RATIO
      .sort((a, b) => b.ratio - a.ratio);

  return (
    <div className="Recipehome" style={{ top: '100px', paddingTop: "40px" }}>
      <div className='WhatsCookinText'>
        <h1 style={{ lineHeight: '0' }}>You Can Cook</h1>
      </div>
      <div className="RecipeListContainer">
        <div className="RecipeListTopContainer">
          <ul className="ItemList">
            <div className="RecipeItem .no-scrollbar">
              {sortedRecipes.map((item, index) => {
                const ingredientsList = Array.isArray(item.ingredients) ? item.ingredients : [];
                return (
                  <Link to="/recipe" state={{ recipe: item, selectedIngredients }} key={index} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <li className="RecipeItemDetails">
                      <div className="RecipeImageContainer">
                        <img src={item.image} alt="recipeImage" style={{ width: '100%', objectFit: 'cover', height: '100%' }} />
                      </div>
                      <div className="RecipeInfoTextContainer" >
                        <span className="RecipeTitle" style={{ lineHeight: '20px' }}><strong>{item.title}</strong></span><br />
                        <span className="RecipeValue"><strong>Value:</strong> {item.value}</span><br />
                        <span className="CookingTime"><strong>Time:</strong> {item.time}</span>
                      </div>
                      <div className="InfoIconContainer" style={{ display: 'block' }}>
                        <div className="RecipeRating">
                          <span><strong>{item.matchCount}</strong></span>/<span><strong>{ingredientsList.length}</strong></span>
                        </div>
                      </div>
                    </li>
                  </Link>
                );
              })}
              <span style={{ margin: "auto", display: "flex", justifyContent: "center", fontStyle: "italic", color: "gray" }}>- End of List -</span>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecipeSuggestionList;
