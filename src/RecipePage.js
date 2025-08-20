import './App.css';
import backbutton from './backcirclebutton.svg';
import ingredientlisticon from './ingredient-list-white-icon.svg';
import suggstionicon from './suggestion-white-icon.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function RecipePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recipe: initialRecipe, selectedIngredients } = state || {};

  const [recipe, setRecipe] = useState(initialRecipe || null);
  const [loading, setLoading] = useState(!initialRecipe); // If no initial recipe, show loading
  const [error, setError] = useState(null);

  // Fetch full recipe details if we don't have ingredients or instructions
  useEffect(() => {
    async function fetchRecipeDetails() {
      if (!initialRecipe || !initialRecipe.ingredients || !initialRecipe.instructions) {
        if (!initialRecipe?.id) {
          setError('Recipe ID not provided.');
          setLoading(false);
          return;
        }
        setLoading(true);
        try {
          const res = await fetch(`/api/recipes/${initialRecipe.id}`);
          if (!res.ok) throw new Error('Failed to fetch recipe details');
          const data = await res.json();
          setRecipe(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      }
    }
    fetchRecipeDetails();
  }, [initialRecipe]);

  if (loading) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading recipe details...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>Error: {error}</p>;
  }

  if (!recipe) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No recipe data found.</p>;
  }

  // Ensure selectedIngredients is always an array
  const safeSelectedIngredients = Array.isArray(selectedIngredients) ? selectedIngredients : [];

  // Defensive: Map ingredients to get names (handle objects or strings)
  const ingredientsList = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map(ing => (typeof ing === 'string' ? ing : (ing.name || '')))
    : [];

  // Defensive: Instructions fallback
  const instructionsText = recipe.instructions || 'No instructions available.';

  // Count matched ingredients by comparing selectedIngredients names with recipe ingredients names
  const matchedCount = safeSelectedIngredients.length
    ? safeSelectedIngredients.filter(selIng =>
        ingredientsList.some(ing => ing.toLowerCase() === selIng.name.toLowerCase())
      ).length
    : 0;

  return (
    <div className="IngredientPageWrap">
      {/* Top bar */}
      <div className="TopBar">
        <div
          className="BackBtnIcon"
          onClick={() => navigate(-1)}
          role="button"
          tabIndex={0}
          onKeyPress={e => {
            if (e.key === 'Enter' || e.key === ' ') navigate(-1);
          }}
        >
          <img src={backbutton} alt="back" style={{ width: '100%' }} />
        </div>
        <div className="ExpiryContainer">
          <span className="ExpiresText">Cooking Time:</span>
          <span>
            <strong>{recipe.time}</strong>
          </span>
        </div>
      </div>

      {/* Main image */}
      <div className="IngredientImageBigContainer">
        <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%' }} />
      </div>

      {/* Recipe details */}
      <div className="IngredientValueDetailsContainer">
        <div className="TopGroup">
          <span className="IngredientName">
            <strong>{recipe.title}</strong>
          </span>
          <div className="RemoveBtnContainer">
            <div className="RecipeRating">
              <span>
                <strong>{matchedCount}</strong>
              </span>
              /<span>
                <strong>{ingredientsList.length}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Ingredients list */}
        <div className="ValueTextContainer">
          <h3>Ingredients:</h3>
          <ol style={{lineHeight:'1.5'}}>
            {ingredientsList.map((item, index) => {
              const isAvailable = safeSelectedIngredients.some(
                selIng => selIng.name.toLowerCase() === item.toLowerCase()
              );
              return (
                <li key={index}>
                  <span
                    className="Ingredient"
                    style={{
                      color: isAvailable ? '#DC143C' : 'black',
                      fontWeight: isAvailable ? 'bold' : 'normal',
                    }}
                  >
                    {item}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Instructions */}
        <div className="ValueTextContainer">
          <h3>Instructions:</h3>
          <p style={{ textAlign: 'justify', textJustify: 'inter-word', lineHeight:'1.5' }}>{instructionsText}</p>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="BottomGroupOne">
        <div className="BottomGroupTop">

          {/* Suggestion button */}
          <div
            className="BottomBtn"
            onClick={() => navigate('/ingredient-to-recipe/suggestions')}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/ingredient-to-recipe/suggestions');
              }
            }}
          >
            <div className="BtnIconContainer">
              <img src={suggstionicon} alt="suggestion" style={{ width: '100%' }} />
            </div>
            <span>
              <strong style={{ color: 'yellow' }}>Suggestion</strong>
            </span>
          </div>

          {/* Ingredient List button */}
          <div
            className="BottomBtn"
            onClick={() => navigate('/ingredient-to-recipe')}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/ingredient-to-recipe');
              }
            }}
          >
            <div className="BtnIconContainer">
              <img src={ingredientlisticon} alt="ingredients" style={{ width: '100%' }} />
            </div>
            <span>
              <strong style={{ color: 'yellow' }}>Ingredients</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
