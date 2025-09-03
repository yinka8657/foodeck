import './App.css';
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { SelectedIngredientsContext } from './SelectedIngredientsContext';
import sortbuttonbackward from './sort-back.svg';
import sortbuttonforward from './sort-forward.svg';
import solidstar from "./star-solid.svg";

import API_URL from "./config"; // central config

function RecipeSuggestionList() {
  const { selectedIngredients, setRecipeCount } = useContext(SelectedIngredientsContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [sortDescending, setSortDescending] = useState(true); 
  const [ratings, setRatings] = useState({}); // store { recipeId: { average, count } }

  // Log selected ingredients
  useEffect(() => {
    console.log("Selected ingredients in RecipeSuggestionList:", selectedIngredients);
  }, [selectedIngredients]);

  // Update recipe count
  useEffect(() => {
    const filteredRecipes = recipes.filter(item => {
      const ingredientsList = Array.isArray(item.ingredients) ? item.ingredients : [];
      const matchCount = selectedIngredients.filter(selIng =>
        ingredientsList.some(recipeIng => recipeIng.name.toLowerCase() === selIng.name.toLowerCase())
      ).length;
      return matchCount > 0;
    });
  
    setRecipeCount(filteredRecipes.length);
  }, [recipes, selectedIngredients, setRecipeCount]);

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
        localStorage.setItem(cacheKey + "_time", Date.now());
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
        setFetchError(error.message);
      })
      .finally(() => setLoading(false));
  }, [selectedIngredients, setRecipeCount]);

  // Fetch average ratings for all recipes (batch)
  useEffect(() => {
    async function fetchRatings() {
      if (!recipes.length) return;
      try {
        const ids = recipes.map(r => r.id).join(",");
        const res = await fetch(`${API_URL}/api/recipes/ratings/average?ids=${ids}`);
        if (!res.ok) throw new Error("Failed to fetch averages");
        const data = await res.json();
        setRatings(data); // { recipeId: { average, count } }
      } catch (err) {
        console.error("Error fetching averages:", err);
      }
    }

    fetchRatings();
  }, [recipes]);

  // --- Sort logic ---
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
    .filter(item => item.matchCount > 0)
    .sort((a, b) => {
      // 1. Sort by ratio (primary)
      if (b.ratio !== a.ratio) return b.ratio - a.ratio;

      // 2. If tie, sort by average rating
      const ratingA = ratings[a.id]?.average || 0;
      const ratingB = ratings[b.id]?.average || 0;
      if (ratingB !== ratingA) return ratingB - ratingA;

      // 3. If tie, sort by cooking time (depending on sortDescending)
      const timeA = parseInt(a.time) || 0;
      const timeB = parseInt(b.time) || 0;
      if (timeA !== timeB) return sortDescending ? timeB - timeA : timeA - timeB;

      // 4. Final fallback: alphabetical
      return a.title.localeCompare(b.title);
    });

  // --- UI states ---
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

  return (
    <div className="Recipehome" style={{ top: '100px', paddingTop: "15px" }}>
      {/* --- Sort Button --- */}
      <div 
        className='SortButton' 
        onClick={() => setSortDescending(prev => !prev)}
      >
        <img 
          src={sortDescending ? sortbuttonbackward : sortbuttonforward} 
          alt="sort" 
          style={{ width: '100%', height: '100%' }} 
        />
      </div>

      <div className='WhatsCookinText'>
        <h1 style={{ lineHeight: '0' }}>You Can Cook</h1>
      </div>

      <div className="RecipeListContainer">
        <div className="RecipeListTopContainer">
          <ul className="ItemList">
            <div className="RecipeItem .no-scrollbar">
              {sortedRecipes.map((item, index) => {
                const ingredientsList = Array.isArray(item.ingredients) ? item.ingredients : [];
                const ratingInfo = ratings[item.id] || { average: 0, count: 0 };

                return (
                  <Link 
                    to="/recipe" 
                    state={{ recipe: item, selectedIngredients }} 
                    key={index} 
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <li className="RecipeItemDetails">
                      <div className="RecipeImageContainer">
                        <img src={item.image} alt="recipeImage" style={{ width: '100%', objectFit: 'cover', height: '100%' }} />
                      </div>
                      <div className="RecipeInfoTextContainer">
                        <span className="RecipeTitle" style={{ lineHeight: '20px' }}><strong>{item.title}</strong></span><br />
                        <span className="RecipeValue"><strong>Value:</strong> {item.value}</span><br />
                        <span className="CookingTime"><strong>Time:</strong> {item.time}</span>
                      </div>
                      <div className="InfoIconContainer" style={{ display: 'block' }}>
                        <div className="RecipeRating" style={{ fontSize: "12px", padding:"5px", width:"25px"}}>
                          <span><strong>{item.matchCount}</strong></span>/<span><strong>{ingredientsList.length}</strong></span>
                        </div>
                        <div className='Rating' style={{width: "100%", margin:"5px auto 0 auto", paddingTop:"2px", borderTop:"1px black solid", display:"flex"}}>
                          <img
                            src={solidstar}
                            alt={`rating-${index + 1}`}
                            style={{ width: "15px", display: "block" }} 
                          />
                          <span>{ratingInfo.average.toFixed(1)}</span>
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
