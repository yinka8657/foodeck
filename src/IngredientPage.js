import './App.css';
import backbutton from './backcirclebutton.svg';
import ingredientlisticon from './ingredient-list-white-icon.svg';
import suggstionicon from './suggestion-white-icon.svg';
import { useLocation, useNavigate } from 'react-router-dom';

function IngredientPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { ingredient, selectedIngredients } = state || {};

  // Defensive: handle missing ingredient
  if (!ingredient) {
    return <p style={{ textAlign: 'center', marginTop: '2rem' }}>No ingredient data found.</p>;
  }

  // Defensive default for selectedIngredients
  const safeSelectedIngredients = Array.isArray(selectedIngredients) ? selectedIngredients : [];

  // Count how many selectedIngredients match this ingredient by name (usually 0 or 1)
  const matchedCount = safeSelectedIngredients.some(
    selIng => selIng.name.toLowerCase() === ingredient.name.toLowerCase()
  ) ? 1 : 0;

  return (
    <div className="IngredientPageWrap">
      {/* Top bar */}
      <div className="TopBar" style={{ background: "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,1))" }}>
        <div className="BackBtnIcon" onClick={() => navigate(-1)} style={{ cursor: 'pointer' }}>
          <img src={backbutton} alt="back" style={{ width: '100%' }} />
        </div>
        <div className="ExpiryContainer">
          <span className="ExpiresText">Expires:</span>
          <span><strong>{ingredient.expiry || 'N/A'}</strong></span>
        </div>
      </div>

      {/* Main image */}
      <div className="IngredientImageBigContainer">
        <img
          src={ingredient.image || 'https://via.placeholder.com/400'}
          alt={ingredient.name}
          style={{ width: '100%', height:'100%' }}
        />
      </div>

      {/* Ingredient details */}
      <div className="IngredientValueDetailsContainer">
        <div className="TopGroup">
          <span className="IngredientName"><strong>{ingredient.name}</strong></span>

          <div className="RemoveBtnContainer">
            <div className="RecipeRating">
              <span><strong>{matchedCount + 1}</strong></span>/<span><strong>1</strong></span>
            </div>
          </div>
        </div>

        <div className="ValueTextContainer">
          <h3>Value:</h3>
          <p style={{lineHeight:'1.5'}}>{ingredient.value || 'N/A'}</p>
        </div>

        <div className="ValueTextContainer" style={{marginBottom:"3em"}}>
          <h3>Description:</h3>
          <p style={{textAlign: 'justify', textJustify: "inter-word", lineHeight:'1.5'}}>{ingredient.description || 'No description available.'}</p>
        </div>

        {/* Add any other ingredient-specific details here */}
      </div>

      {/* Bottom actions */}
      <div className="BottomGroupOne">
        <div className="BottomGroupTop" style={{ display: 'flex', justifyContent: 'space-around' }}>
          <div
            className="BottomBtn"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/ingredient-to-recipe/suggestions')}
            onKeyPress={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/ingredient-to-recipe/suggestions');
              }
            }}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <div className="BtnIconContainer">
              <img src={suggstionicon} alt="suggestion" style={{ width: '100%' }} />
            </div>
            <span><strong style={{ color: 'yellow' }}>Suggestion</strong></span>
          </div>

          <div
            className="BottomBtn"
            role="button"
            tabIndex={0}
            onClick={() => navigate('/ingredient-to-recipe')}
            onKeyPress={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                navigate('/ingredient-to-recipe');
              }
            }}
            style={{ cursor: 'pointer', textAlign: 'center' }}
          >
            <div className="BtnIconContainer">
              <img src={ingredientlisticon} alt="ingredients" style={{ width: '100%' }} />
            </div>
            <span><strong style={{ color: 'yellow' }}>Ingredients</strong></span>
          </div>
        </div>
        {/* Optional remove ingredient button commented out */}
      </div>
    </div>
  );
}

export default IngredientPage;
