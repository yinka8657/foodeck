import './App.css';
import backbutton from './backcirclebutton.svg';
import ingredientlisticon from './ingredient-list-white-icon.svg';
import suggstionicon from './suggestion-white-icon.svg';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';



function RecipePage() {

    const navigate = useNavigate();

    const { state } = useLocation();
const recipe = state?.recipe;

if (!recipe) {
  return <p>No recipe data found</p>;
}

  return (
    <div className="IngredientPageWrap">
        <div className='TopBar'>
            <div className='BackBtnIcon' onClick={() => navigate(-1)}>
                <img src={backbutton} alt="back" style={{ width: '100%' }} />
            </div>
            <div className='ExpiryContainer'>
                <span className='ExpiresText'>
                    Cooking Time:
                </span>
                <span>
                    <strong>
                        {recipe.time}
                    </strong>
                </span> 
            </div>
        </div>
        <div className='IngredientImageBigContainer'>
            <img src={recipe.image} alt="back" style={{ width: '100%' }} />
        </div>
        <div className='IngredientValueDetailsContainer'>
            <div className='TopGroup'>

                <span className='IngredientName'> <strong>{recipe.title}</strong></span>

                <div className='RemoveBtnContainer'>
                    <div className='RecipeRating'>
                        <span><strong>5</strong></span>/<span><strong>{recipe.ingredients.length}</strong></span>
                    </div>
                </div>
            </div>
            <div className='ValueTextContainer'>
                <h3>Ingredients:</h3>
                <ol>
                    {recipe.ingredients.map((item, index) => (

                        <li key={index}><span className='Ingredient'>{item}</span></li>

                        ))}
                </ol>
            </div>
            <div className='ValueTextContainer'>
                <h3>Instructions:</h3>
                <p>
                    {recipe.instructions}
                </p>
            </div>
        </div>
        <div className='BottomGroupOne'>
            <div className='BottomGroupTop'>
                <div className='BottomBtn'>
                    <div className='BtnIconContainer'>
                        <div className='NotifyCount'>
                            <span>2</span>
                        </div>
                        <img src={suggstionicon} alt="remove" style={{ width: '100%' }} />
                    </div>
                    <span><strong>Suggestion</strong></span>
                </div>
                <div className='BottomBtn'>
                    <div className='BtnIconContainer'>
                        <img src={ingredientlisticon} alt="remove" style={{ width: '100%' }} />
                    </div>
                    <span><strong>Ingredient List</strong></span>
                </div>
            </div>
            <div className='BottomGroupBottom'>
                <div className='BottomBtnBottom'>
                    <div className='BtnIconContainer'>
                        <img src={ingredientlisticon} alt="remove" style={{ width: '100%' }} />
                    </div>
                    <span><strong>Remove Recipe</strong></span>
                </div>
            </div>
        </div>
    </div>
  );
}

export default RecipePage;