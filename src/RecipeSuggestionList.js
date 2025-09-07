import './App.css';
import React, { useEffect, useState, useContext, useMemo } from "react";
import { Link } from 'react-router-dom';
import { SelectedIngredientsContext } from './SelectedIngredientsContext';
import sortbuttonbackward from './sort-back.svg';
import sortbuttonforward from './sort-forward.svg';
import solidstar from "./star-solid.svg";
import API_URL from "./config";

function RecipeSuggestionList() {
  const { selectedIngredients, setRecipeCount } = useContext(SelectedIngredientsContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [sortDescending, setSortDescending] = useState(true);
  const [ratings, setRatings] = useState({});
  const [fetched, setFetched] = useState(false);
  const [ratingsFetched, setRatingsFetched] = useState(false);

  // Stable key for caching + effect dependencies
  const ingredientKey = useMemo(() => {
    if (!selectedIngredients?.length) return "";
    return selectedIngredients.map(i => i.name).sort().join("_");
  }, [selectedIngredients]);

  // Fetch & cache recipes
  useEffect(() => {
    if (!ingredientKey) {
      setRecipes([]);
      setFetched(false);
      setRatingsFetched(false);
      setRecipeCount(0);
      return;
    }

    const cacheKey = `recipeSuggestions_${ingredientKey}`;
    const cacheTimeKey = cacheKey + "_time";
    const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

    let cached = null;
    let cacheTime = null;
    try {
      cached = localStorage.getItem(cacheKey);
      cacheTime = localStorage.getItem(cacheTimeKey);
    } catch (e) {
      console.warn("localStorage not available:", e);
    }

    if (cached && cacheTime && Date.now() - parseInt(cacheTime, 10) < CACHE_EXPIRY) {
      try {
        const parsed = JSON.parse(cached);
        setRecipes(parsed);
        setFetched(true);
        return;
      } catch (e) {
        console.warn("Cache parse error:", e);
      }
    }

    setLoading(true);
    setFetchError(null);

    fetch(`${API_URL}/api/recipes/suggest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ selectedIngredients: ingredientKey.split("_") }),
    })
      .then(async res => {
        if (!res.ok) throw new Error(await res.text());
        const contentType = res.headers.get("content-type");
        return contentType?.includes("application/json") ? res.json() : [];
      })
      .then(data => {
        const recipesArray = Array.isArray(data) ? data : [];
        setRecipes(recipesArray);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(recipesArray));
          localStorage.setItem(cacheTimeKey, Date.now().toString());
        } catch (e) {
          console.warn("localStorage save failed:", e);
        }
      })
      .catch(err => setFetchError(err.message))
      .finally(() => setFetched(true));
  }, [ingredientKey, setRecipeCount]);

  // Fetch ratings
  useEffect(() => {
    if (!recipes.length) {
      setRatingsFetched(false);
      return;
    }
    const ids = recipes.map(r => r.id).filter(Boolean).join(",");
    if (!ids) return;

    setRatingsFetched(false);
    fetch(`${API_URL}/api/recipes/ratings/average?ids=${ids}`)
      .then(res => res.text().then(txt => ({ ok: res.ok, txt })))
      .then(({ ok, txt }) => {
        if (!ok) throw new Error(txt);
        const data = JSON.parse(txt);
        setRatings(data);
        setRatingsFetched(true);
      })
      .catch(err => {
        console.error("Error fetching ratings:", err);
        setRatingsFetched(true); // mark as done to avoid infinite loading
      });
  }, [recipes]);

  // Compute matchCount for all recipes once
  const recipesWithMatch = useMemo(() => {
    return recipes.map(item => {
      const ingredientsList = Array.isArray(item.ingredients) ? item.ingredients : [];
      const matchCount = selectedIngredients.filter(selIng =>
        ingredientsList.some(recipeIng => recipeIng.name.toLowerCase() === selIng.name.toLowerCase())
      ).length;
      return { ...item, matchCount, ratio: ingredientsList.length ? matchCount / ingredientsList.length : 0 };
    });
  }, [recipes, selectedIngredients]);

  // Filter & sort recipes (only once ratings are fetched)
  const sortedRecipes = useMemo(() => {
    if (!ratingsFetched) return [];
    const filtered = recipesWithMatch.filter(r => r.matchCount > 0);
    return filtered.sort((a, b) => {
      if (b.ratio !== a.ratio) return b.ratio - a.ratio;
      const ratingA = ratings[a.id]?.average || 0;
      const ratingB = ratings[b.id]?.average || 0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      const timeA = parseInt(a.time) || 0;
      const timeB = parseInt(b.time) || 0;
      if (timeA !== timeB) return sortDescending ? timeB - timeA : timeA - timeB;
      return a.title.localeCompare(b.title);
    });
  }, [recipesWithMatch, ratings, sortDescending, ratingsFetched]);

  // Update recipe count only after filtering
  useEffect(() => {
    if (ratingsFetched) {
      setRecipeCount(sortedRecipes.length);
    }
  }, [sortedRecipes, setRecipeCount, ratingsFetched]);

  // --- UI ---
  if (!selectedIngredients?.length) return <p className="center-message">No Recipe Suggestion yet... Add ingredients to see suggestions.</p>;
  if ((loading && !fetched) || !ratingsFetched) return <p className="center-message">Loading suggestions...</p>;
  if (fetchError && !recipes.length) return <p className="center-message" style={{ color: 'red' }}>Failed to load suggestions: {fetchError}</p>;
  if (!loading && fetched && ratingsFetched && !sortedRecipes.length) return <p className="center-message">No suggestions found.</p>;

  return (
    <div className="Recipehome" style={{ top: '100px', paddingTop: "15px" }}>
      <div className='SortButton' onClick={() => setSortDescending(prev => !prev)}>
        <img src={sortDescending ? sortbuttonbackward : sortbuttonforward} alt="sort" style={{ width: '100%', height: '100%' }} />
      </div>
      <div className='WhatsCookinText'><h1 style={{ lineHeight: '0' }}>You Can Cook</h1></div>
      <div className="RecipeListContainer">
        <div className="RecipeListTopContainer">
          <ul className="ItemList">
            <div className="RecipeItem .no-scrollbar">
              {sortedRecipes.map((item, index) => {
                const ingredientsList = Array.isArray(item.ingredients) ? item.ingredients : [];
                const ratingInfo = ratings[item.id] || { average: 0, count: 0 };
                return (
                  <Link
                    key={index}
                    to="/recipe"
                    state={{ recipe: item, selectedIngredients }}
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <li className="RecipeItemDetails">
                      <div className="RecipeImageContainer">
                        <img src={item.image} alt="recipeImage" style={{ width: '100%', objectFit: 'cover', height: '100%' }} />
                      </div>
                      <div className="RecipeInfoTextContainer">
                        <span className="RecipeTitle"><strong>{item.title}</strong></span><br />
                        <span className="RecipeValue"><strong>Value:</strong> {item.value}</span><br />
                        <span className="CookingTime"><strong>Time:</strong> {item.time}</span>
                      </div>
                      <div className="InfoIconContainer">
                        <div className="RecipeRating" style={{ fontSize: "12px", padding: "5px", width: "25px" }}>
                          <span><strong>{item.matchCount}</strong></span>/<span><strong>{ingredientsList.length}</strong></span>
                        </div>
                        <div className='Rating' style={{ width: "100%", margin: "5px auto 0 auto", paddingTop: "2px", borderTop: "1px black solid", display: "flex" }}>
                          <img src={solidstar} alt={`rating-${index}`} style={{ width: "15px" }} />
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
