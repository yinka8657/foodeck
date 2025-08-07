import './App.css';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function RecipeSuggestionList({ selectedIngredients }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setRecipes([]);
      return;
    }

    setLoading(true);


    fetch("http://localhost:5000/api/recipes/suggest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      selectedIngredients: selectedIngredients.map((ing) => ing.name),
    }),
  })

      .then((res) => res.json())
      .then((data) => {
        setRecipes(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching suggestions:", error);
        setLoading(false);
      });
  }, [selectedIngredients]);

  if (loading) return <p>Loading suggestions...</p>;
  if (recipes.length === 0) return <p style={{ marginLeft: "1em", color: "#666" }}>No suggestions found.</p>;

  return (
    <div className="Recipehome" style={{ top: '130px' }}>
      <div className='RecipeListContainer'>
        <div className='RecipeListTopContainer'>
          <ul className='ItemList'>
            <div className='RecipeItem'>
              {recipes.map((item, index) => (
                <Link
                  to="/recipe"
                  state={{ recipe: item }}
                  key={index}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <li className='RecipeItemDetails'>
                    <div className='RecipeImageContainer'>
                      <img
                        src={item.image}
                        alt="recipeImage"
                        style={{ width: '100%', objectFit: 'cover', height: '100%' }}
                      />
                    </div>
                    <div className='RecipeInfoTextContainer'>
                      <span className='RecipeTitle'><strong>{item.title}</strong></span><br />
                      <span className='RecipeValue'><strong>Value:</strong> {item.value}</span><br />
                      <span className='CookingTime'><strong>Time:</strong> {item.time}</span>
                    </div>
                    <div className='InfoIconContainer' style={{ display: 'block' }}>
                      <div className='RecipeRating'>
                        <span><strong>{recipes.length}</strong></span>/<span><strong>{item.ingredients.length}</strong></span>
                      </div>
                    </div>
                  </li>
                </Link>
              ))}
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default RecipeSuggestionList;
