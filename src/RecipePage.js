import './App.css';
import backbutton from './backcirclebutton.svg';
import ingredientlisticon from './ingredient-list-white-icon.svg';
import suggstionicon from './suggestion-white-icon.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// YouTube video container with clickable thumbnail
function RecipeVideo({ recipeTitle }) {
  const [videoId, setVideoId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    async function fetchRandomVideo() {
      try {
        const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
        if (!apiKey) return;
        const query = encodeURIComponent(`how to cook ${recipeTitle}`);
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=5&type=video`
        );
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          const randomVideo = data.items[Math.floor(Math.random() * data.items.length)];
          setVideoId(randomVideo.id.videoId);
          setThumbnail(randomVideo.snippet.thumbnails.medium.url);
        }
      } catch (err) {
        console.error("YouTube fetch error:", err);
      }
    }
    fetchRandomVideo();
  }, [recipeTitle]);

  if (!videoId) return null;

  return (
    <div style={{
      margin: '1rem auto',
      width: '100%',
      maxWidth: '90vw',
      background: 'transparent',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ marginBottom: '1rem', marginTop: '0', textAlign: 'center', color: '#444', fontSize:'20px' }}>
        Watch how to cook {recipeTitle}
      </h2>
      <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
        {!loaded && thumbnail && (
          <img
            src={thumbnail}
            alt={`Thumbnail for ${recipeTitle}`}
            style={{ 
              position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer', objectFit: 'cover'
            }}
            onClick={() => setLoaded(true)}
          />
        )}
        {loaded && (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={`How to cook ${recipeTitle}`}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              border: '0',
              borderRadius: '8px'
            }}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        )}
      </div>
    </div>
  );
}

function RecipePage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recipe: initialRecipe, selectedIngredients } = state || {};

  const [recipe, setRecipe] = useState(initialRecipe || null);
  const [loading, setLoading] = useState(!initialRecipe);
  const [error, setError] = useState(null);

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

  if (loading) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading recipe details...</p>;
  if (error) return <p style={{ textAlign: 'center', marginTop: '2rem', color: 'red' }}>Error: {error}</p>;
  if (!recipe) return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No recipe data found.</p>;

  const safeSelectedIngredients = Array.isArray(selectedIngredients) ? selectedIngredients : [];
  const ingredientsList = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map(ing => (typeof ing === 'string' ? ing : (ing.name || '')))
    : [];
  const instructionsText = recipe.instructions || 'No instructions available.';
  const matchedCount = safeSelectedIngredients.length
    ? safeSelectedIngredients.filter(selIng =>
        ingredientsList.some(ing => ing.toLowerCase() === selIng.name.toLowerCase())
      ).length
    : 0;

  return (
    <div className="IngredientPageWrap">
      <div className="TopBar">
        <div
          className="BackBtnIcon"
          onClick={() => navigate(-1)}
          role="button"
          tabIndex={0}
          onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate(-1); }}
        >
          <img src={backbutton} alt="back" style={{ width: '100%' }} />
        </div>
        <div className="ExpiryContainer">
          <span className="ExpiresText">Cooking Time:</span>
          <span><strong>{recipe.time}</strong></span>
        </div>
      </div>

      <div className="IngredientImageBigContainer">
        <img src={recipe.image_url} alt={recipe.title} style={{ width: '100%', height: '100%' }} />
      </div>

      <div className="IngredientValueDetailsContainer">
        <div className="TopGroup">
          <span className="IngredientName"><strong>{recipe.title}</strong></span>
          <div className="RemoveBtnContainer">
            <div className="RecipeRating">
              <span><strong>{matchedCount}</strong></span>/<span><strong>{ingredientsList.length}</strong></span>
            </div>
          </div>
        </div>

        <div className="ValueTextContainer">
          <h3>Ingredients:</h3>
          <ol style={{ lineHeight: '1.5' }}>
            {ingredientsList.map((item, index) => {
              const isAvailable = safeSelectedIngredients.some(selIng => selIng.name.toLowerCase() === item.toLowerCase());
              return (
                <li key={index}>
                  <span style={{ color: isAvailable ? '#DC143C' : 'black', fontWeight: isAvailable ? 'bold' : 'normal' }}>
                    {item}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="ValueTextContainer">
          <h3>Instructions:</h3>
          <p style={{ textAlign: 'justify', lineHeight: '1.5' }}>{instructionsText}</p>
        </div>
      </div>

      <RecipeVideo recipeTitle={recipe.title} />

      <div className="BottomGroupOne">
        <div className="BottomGroupTop">
          <div
            className="BottomBtn"
            onClick={() => navigate('/ingredient-to-recipe/suggestions')}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/ingredient-to-recipe/suggestions'); }}
          >
            <div className="BtnIconContainer">
              <img src={suggstionicon} alt="suggestion" style={{ width: '100%' }} />
            </div>
            <span><strong style={{ color: 'yellow' }}>Suggestion</strong></span>
          </div>

          <div
            className="BottomBtn"
            onClick={() => navigate('/ingredient-to-recipe')}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate('/ingredient-to-recipe'); }}
          >
            <div className="BtnIconContainer">
              <img src={ingredientlisticon} alt="ingredients" style={{ width: '100%' }} />
            </div>
            <span><strong style={{ color: 'yellow' }}>Ingredients</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipePage;
