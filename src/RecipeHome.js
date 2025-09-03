import './App.css';
import addrecipeicon from './addrecipeicon.svg';
import search from './search.svg';
import MyCarousel from './MyCarousel';
import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { SelectedIngredientsContext } from './SelectedIngredientsContext';

function RecipeHome({ showTopBar }) {
  const { selectedIngredients, recipes, loadingRecipes, recipeError } =
    useContext(SelectedIngredientsContext);

  const [searchTerm, setSearchTerm] = useState("");

  if (loadingRecipes) return <p>Loading African meals...</p>;
  if (recipeError) return <p style={{ color: "red" }}>Error: {recipeError}</p>;

  const normalizeNames = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((ing) => {
        if (typeof ing === "string") return ing.trim().toLowerCase();
        if (ing && typeof ing.name === "string") return ing.name.trim().toLowerCase();
        return null;
      })
      .filter(Boolean);

  const filteredSortedRecipes = recipes
    .filter(recipe => recipe.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .map(recipe => {
      const normalizedRecipeIngredients = normalizeNames(recipe.ingredients);
      const normalizedSelected = normalizeNames(selectedIngredients);
      const matchCount = normalizedSelected.reduce(
        (count, selIng) => normalizedRecipeIngredients.includes(selIng) ? count + 1 : count,
        0
      );
      return {
        ...recipe,
        matchCount,
        totalIngredients: normalizedRecipeIngredients.length,
      };
    })
    .sort((a, b) => {
      if (b.matchCount !== a.matchCount) return b.matchCount - a.matchCount;
      return a.title.localeCompare(b.title);
    });

  const firstPart = filteredSortedRecipes.slice(0, 4);
  const secondPart = filteredSortedRecipes.slice(4);

  return (
    <div className="Recipehome" style={{top:"100px", paddingTop:"0"}}>
      {/* Sticky search bar wrapper */}
      <div
        className="Recipe-search-bar-wrapper"
        style={{
          position: "sticky",
          zIndex: 1000,
          backgroundColor: "white",
          paddingBottom: "0.5rem",
          transition: "transform 0.3s ease",
          transform: showTopBar ? "translateY(0)" : "translateY(-100%)",
        }}
      >
        <div className="Recipe-search-bar" style={{top:"0"}}>
          <img src={addrecipeicon} alt="addrecipeicon" style={{ width: "10vw" }} />
          <form onSubmit={(e) => e.preventDefault()} style={{ flex: 1, margin: "0 10px" }}>
            <input
              type="text"
              placeholder="Search Recipe"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: "20px", width: "100%" }}
            />
          </form>
          <img src={search} alt="search" style={{ width: "8vw" }} />
        </div>
      </div>
      <div className="RecipeListContainer" style={{}}>
        <div className="WhatsCookinText" style={{ paddingTop: "10px" }}>
          <h1 style={{ lineHeight: "0" }}>African Cuisines</h1>
        </div>

        <div className="RecipeListTopContainer">
          <ul className="ItemList no-scrollbar" style={{marginBottom:"150px"}}>
            {filteredSortedRecipes.length === 0 ? (
              <p className="no-recipe-message">
                No recipes found
              </p>
            ) : (
              <>
                {firstPart.map((item, index) => (
                  <Link
                    to="/recipe"
                    state={{ recipe: item, selectedIngredients }}
                    key={index}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <li className="RecipeItemDetails">
                      <div className="RecipeImageContainer">
                        <img src={item.image_url} alt="recipeImage"
                             style={{ width: "100%", objectFit: "cover", height: "100%" }} />
                      </div>
                      <div className="RecipeInfoTextContainer">
                        <span className="RecipeTitle"><strong>{item.title}</strong></span>
                        <br />
                        <span className="RecipeValue"><strong>Ingredients:</strong> {item.matchCount}/{item.totalIngredients}</span>
                        <br />
                        <span className="CookingTime"><strong>Time:</strong> {item.time}</span>
                      </div>
                    </li>
                  </Link>
                ))}

                <MyCarousel selectedIngredients={selectedIngredients} />

                {secondPart.map((item, index) => (
                  <Link
                    to="/recipe"
                    state={{ recipe: item, selectedIngredients }}
                    key={index}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <li className="RecipeItemDetails">
                      <div className="RecipeImageContainer">
                        <img src={item.image_url} alt="recipeImage"
                             style={{ width: "100%", objectFit: "cover", height: "100%" }} />
                      </div>
                      <div className="RecipeInfoTextContainer">
                        <span className="RecipeTitle"><strong>{item.title}</strong></span>
                        <br />
                        <span className="RecipeValue"><strong>Ingredients:</strong> {item.matchCount}/{item.totalIngredients}</span>
                        <br />
                        <span className="CookingTime"><strong>Time:</strong> {item.time}</span>
                      </div>
                    </li>
                  </Link>
                ))}
                <span style={{margin:"auto", display:"flex", justifyContent:"center", fontStyle:"italic", color:"gray"}}>- End of List -</span>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecipeHome;
