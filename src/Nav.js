import './App.css';
import addrecipeactive from './addrecipeactive.svg';
import inglistactive from './inglistactive.svg';
import suggestlistactive from './suggestlistactive.svg';
import addrecipe from './addrecipe.svg';
import inglist from './inglist.svg';
import suggestlist from './suggestlist.svg';
import { Link, useLocation } from 'react-router-dom';

import React, { useContext } from 'react';
import { SelectedIngredientsContext } from './SelectedIngredientsContext';

function Nav() {
  const location = useLocation();
  const path = location.pathname;

  // Get recipeCount from context
  const { recipeCount } = useContext(SelectedIngredientsContext);

  return (
    <div className='NavContainer'>
      <div className="Nav">

        <Link to="/ingredient-to-recipe" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className='NavIcon'>
            {path === '/ingredient-to-recipe' ? (
              <img src={inglistactive} alt="ingredientlist" style={{ width: '8vw' }} />
            ) : (
              <img src={inglist} alt="ingredientlist" style={{ width: '8vw' }} />
            )}
          </div>
        </Link>

        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className='NavIcon'>
            {path === '/' ? (
              <img src={addrecipeactive} alt="addrecipe" style={{ width: '8vw' }} />
            ) : (
              <img src={addrecipe} alt="addrecipe" style={{ width: '8vw' }} />
            )}
          </div>
        </Link>

        <Link to="/ingredient-to-recipe/suggestions" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div className='NavIcon'>
            <div className='NotifyCountBlack' style={{ top: '-8px', right:'-8px' }}>
              <span>{recipeCount}</span>
            </div>
            {path === '/ingredient-to-recipe/suggestions' ? (
              <img src={suggestlistactive} alt="suggestionlist" style={{ width: '8vw' }} />
            ) : (
              <img src={suggestlist} alt="suggestionlist" style={{ width: '8vw' }} />
            )}
          </div>
        </Link>

      </div>
    </div>    
  );
}

export default Nav;
