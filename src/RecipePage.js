import './App.css';
import backbutton from './backcirclebutton.svg';
import ingredientlisticon from './ingredient-list-white-icon.svg';
import suggstionicon from './suggestion-white-icon.svg';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import RatingStars from './RatingStars.js';
import PropTypes from 'prop-types';

// Constants
const LOCAL_VIDEOS = [
  { id: "local1", title: "How to cook Jollof Rice", url: "https://www.youtube.com/embed/1c5hHY2q6eU", thumbnail: "https://img.youtube.com/vi/1c5hHY2q6eU/mqdefault.jpg" },
  { id: "local2", title: "How to cook Egusi Soup", url: "https://www.youtube.com/embed/04ZkR04D9j0", thumbnail: "https://img.youtube.com/vi/04ZkR04D9j0/mqdefault.jpg" },
  { id: "local3", title: "How to cook Fried Plantain", url: "https://www.youtube.com/embed/k_bfXkzXwg0", thumbnail: "https://img.youtube.com/vi/k_bfXkzXwg0/mqdefault.jpg" },
];

// Video fetcher utility
const fetchVideoSource = async (recipeTitle) => {
  try {
    const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const query = encodeURIComponent(`how to cook ${recipeTitle}`);

    if (apiKey) {
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${apiKey}&maxResults=5&type=video`
      );
      if (!res.ok) throw new Error('YouTube API request failed');
      const data = await res.json();
      if (data.items?.length) {
        const randomVideo = data.items[Math.floor(Math.random() * data.items.length)];
        return { src: `https://www.youtube.com/embed/${randomVideo.id.videoId}`, thumbnail: randomVideo.snippet.thumbnails.medium.url, source: 'youtube' };
      }
    }

    const dmRes = await fetch(
      `https://api.dailymotion.com/videos?search=${query}&limit=5&fields=id,thumbnail_720_url,title`
    );
    if (dmRes.ok) {
      const dmData = await dmRes.json();
      if (dmData.list?.length) {
        const randomVideo = dmData.list[Math.floor(Math.random() * dmData.list.length)];
        return { src: `https://www.dailymotion.com/embed/video/${randomVideo.id}`, thumbnail: randomVideo.thumbnail_720_url, source: 'dailymotion' };
      }
    }

    const randomLocal = LOCAL_VIDEOS[Math.floor(Math.random() * LOCAL_VIDEOS.length)];
    return { src: randomLocal.url, thumbnail: randomLocal.thumbnail, source: 'local' };
  } catch (err) {
    console.error("Video fetch error:", err);
    const randomLocal = LOCAL_VIDEOS[Math.floor(Math.random() * LOCAL_VIDEOS.length)];
    return { src: randomLocal.url, thumbnail: randomLocal.thumbnail, source: 'local' };
  }
};

// Video container component
function RecipeVideo({ recipeTitle }) {
  const [videoData, setVideoData] = useState({ src: null, thumbnail: null });
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const getVideo = async () => {
      if (!recipeTitle) return;
      setLoading(true);
      const data = await fetchVideoSource(recipeTitle);
      if (isMounted) setVideoData(data);
      setLoading(false);
    };

    getVideo();

    return () => { isMounted = false; };
  }, [recipeTitle]);

  if (!videoData.src) {
    if (loading) return <div className="video-container"><p>Loading video...</p></div>;
    return null;
  }

  return (
    <div className="video-container">
      <h2 className="video-title">Watch how to cook {recipeTitle}</h2>
      <div className="video-wrapper">
        {!loaded && videoData.thumbnail && (
          <div 
            className="video-thumbnail"
            onClick={() => setLoaded(true)}
            role="button"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') setLoaded(true); }}
          >
            <img src={videoData.thumbnail} alt={`Thumbnail for ${recipeTitle}`} />
            <div className="play-overlay">
              <svg viewBox="0 0 24 24" width="68" height="68">
                <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
              </svg>
            </div>
          </div>
        )}
        {loaded && (
          <iframe
            src={videoData.src}
            title={`How to cook ${recipeTitle}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          />
        )}
      </div>
    </div>
  );
}

RecipeVideo.propTypes = { recipeTitle: PropTypes.string.isRequired };

// Ingredients list component
function IngredientsList({ ingredients, selectedIngredients }) {
  const safeSelectedIngredients = Array.isArray(selectedIngredients) ? selectedIngredients : [];

  return (
    <ol className="ingredients-list">
      {ingredients.map((item, index) => {
        const isAvailable = safeSelectedIngredients.some(selIng => selIng.name.toLowerCase() === item.toLowerCase());
        return <li key={index} className={isAvailable ? 'available' : ''}>{item}</li>;
      })}
    </ol>
  );
}

IngredientsList.propTypes = { ingredients: PropTypes.arrayOf(PropTypes.string).isRequired, selectedIngredients: PropTypes.array };

// Navigation buttons component
function NavigationButtons({ navigate }) {
  const buttonConfigs = [
    { path: '/ingredient-to-recipe/suggestions', icon: suggstionicon, label: 'Suggestion', key: 'suggestions' },
    { path: '/ingredient-to-recipe', icon: ingredientlisticon, label: 'Ingredients', key: 'ingredients' }
  ];

  return (
    <div className="BottomGroupOne">
      <div className="BottomGroupTop">
        {buttonConfigs.map(({ path, icon, label, key }) => (
          <div
            key={key}
            className="BottomBtn"
            onClick={() => navigate(path)}
            role="button"
            tabIndex={0}
            onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate(path); }}
          >
            <div className="BtnIconContainer"><img src={icon} alt={label.toLowerCase()} /></div>
            <span><strong style={{ color: 'yellow' }}>{label}</strong></span>
          </div>
        ))}
      </div>
    </div>
  );
}

NavigationButtons.propTypes = { navigate: PropTypes.func.isRequired };

// Scroll-aware TopBar
function TopBar({ navigate, recipe }) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollThreshold = 50;

  useEffect(() => {
    const scrollEl = document.querySelector('.IngredientPageWrap');
    if (!scrollEl) return;

    const handleScroll = () => {
      const currentScrollY = scrollEl.scrollTop;
      if (currentScrollY > lastScrollY.current && currentScrollY > scrollThreshold) setIsVisible(false);
      else if (currentScrollY < lastScrollY.current) setIsVisible(true);
      lastScrollY.current = currentScrollY;
    };

    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`TopBar ${isVisible ? 'visible' : 'hidden'}`} style={{ background: "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,1))" }}>
      <div
        className="BackBtnIcon"
        onClick={() => navigate(-1)}
        role="button"
        tabIndex={0}
        onKeyPress={e => { if (e.key === 'Enter' || e.key === ' ') navigate(-1); }}
      >
        <img src={backbutton} alt="back" />
      </div>
      <div className="ExpiryContainer">
        <span className="ExpiresText">Cooking Time:</span>
        <span><strong>{recipe.time}</strong></span>
      </div>
    </div>
  );
}

TopBar.propTypes = { navigate: PropTypes.func.isRequired, recipe: PropTypes.object.isRequired };

// Main RecipePage
function RecipePage({ user }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { recipe: initialRecipe, selectedIngredients } = state || {};

  const [recipe, setRecipe] = useState(initialRecipe || null);
  const [loading, setLoading] = useState(!initialRecipe);
  const [error, setError] = useState(null);

  const fetchRecipeDetails = useCallback(async () => {
    if (!initialRecipe?.ingredients || !initialRecipe?.instructions) {
      if (!initialRecipe?.id) { setError('Recipe ID not provided.'); setLoading(false); return; }
      setLoading(true);
      try {
        const res = await fetch(`/api/recipes/${initialRecipe.id}`);
        if (!res.ok) throw new Error('Failed to fetch recipe details');
        const data = await res.json();
        setRecipe(data);
      } catch (err) { setError(err.message); }
      finally { setLoading(false); }
    }
  }, [initialRecipe]);

  useEffect(() => { fetchRecipeDetails(); }, [fetchRecipeDetails]);

  if (loading) return <div className="center-message">Loading recipe details...</div>;
  if (error) return <div className="center-message error">Error: {error}</div>;
  if (!recipe) return <div className="center-message">No recipe data found.</div>;

  const ingredientsList = Array.isArray(recipe.ingredients) ? recipe.ingredients.map(ing => typeof ing === 'string' ? ing : ing.name || '') : [];
  const instructionsText = recipe.instructions || 'No instructions available.';
  const matchedCount = selectedIngredients?.filter(selIng => ingredientsList.some(ing => ing.toLowerCase() === selIng.name.toLowerCase()))?.length || 0;

  return (
    <div
      className="IngredientPageWrap"
      style={{ overflowY: 'auto', WebkitOverflowScrolling: 'auto' }}
      onTouchMove={(e) => {
        const el = e.currentTarget;
        const atTop = el.scrollTop === 0;
        const atBottom = el.scrollHeight - el.scrollTop === el.clientHeight;
        if ((atTop && e.touches[0].clientY > 0) || (atBottom && e.touches[0].clientY < 0)) e.preventDefault();
      }}
    >
      <TopBar navigate={navigate} recipe={recipe} />

      <div className="IngredientImageBigContainer">
        <img 
          src={recipe.image_url} 
          alt={recipe.title} 
          onError={e => { e.target.src = '/placeholder-recipe.jpg'; }}
        />
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
          <IngredientsList ingredients={ingredientsList} selectedIngredients={selectedIngredients} />
        </div>

        <div className="ValueTextContainer">
          <h3>Instructions:</h3>
          <p className="instructions-text">{instructionsText}</p>
        </div>
      </div>

      {user ? <RatingStars recipeId={recipe.id} user={user} recipe={recipe} /> : <p className="center-message">Log in to rate this recipe.</p>}

      <RecipeVideo recipeTitle={recipe.title} />

      <NavigationButtons navigate={navigate} />
    </div>
  );
}

RecipePage.propTypes = { user: PropTypes.object };

export default RecipePage;
