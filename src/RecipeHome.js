import './App.css';
import addrecipeicon from './addrecipeicon.svg';
import search from './search.svg';
import info from './info.svg';
import MyCarousel from './MyCarousel';

import React, { useEffect, useState } from "react";

import { Link } from 'react-router-dom';





function RecipeHome() {

    

    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        fetch("http://localhost:5000/api/recipes")
          .then((res) => res.json())
          .then((data) => {
            setRecipes(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching meals:", error);
            setLoading(false);
          });
      }, []);

      if (loading) return <p>Loading African meals...</p>;

    const firstPart = recipes.slice(0, 4);
    const secondPart = recipes.slice(4);

  return (
    <div className="Recipehome">
        <div className='Recipe-search-bar'>
            <img src={addrecipeicon} alt="addrecipeicon" style={{ width: '10vw' }} />
            <form>
                <input type="text"placeholder='Search Recipe'></input>
            </form>
            <img src={search} alt="search" style={{ width: '10vw' }} />
        </div>
        <div className='RecipeListContainer'>
            <h2>Recipe</h2>
            <div className='RecipeListTopContainer'>
                <ul className='ItemList'>
                    <div className='RecipeItem'>
                    
                        {firstPart.map((item, index) => (
                            
                            <Link
                                    to="/recipe"
                                    state={{ recipe: item }}
                                    key={index}
                                    style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                    <li className='RecipeItemDetails'>
                                        <div className='RecipeImageContainer'>
                                        <img src={item.image} alt="recipeImage" style={{ width: '100%', objectFit: 'cover', height: '100%' }} />
                                        </div>
                                        <div className='RecipeInfoTextContainer'>
                                        <span className='RecipeTitle'><strong>{item.title}</strong></span><br />
                                        <span className='RecipeValue'><strong>Value:</strong> {item.value}</span><br />
                                        <span className='CookingTime'><strong>Time:</strong> {item.time}</span>
                                        </div>
                                        <div className='InfoIconContainer' style={{ display: 'none' }}>
                                        <img src={info} alt="recipeImage" style={{ width: '100%', display: 'none' }} />
                                        </div>
                                    </li>
                            </Link>

                        ))}
                        <MyCarousel />

                        {secondPart.map((item, index) => (
                                    <Link
                                        to="/recipe"
                                        state={{ recipe: item }}
                                        key={index}
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <li className='RecipeItemDetails'>
                                        <div className='RecipeImageContainer'>
                                            <img src={item.image} alt="recipeImage" style={{ width: '100%', objectFit: 'cover', height: '100%' }} />
                                        </div>
                                        <div className='RecipeInfoTextContainer'>
                                            <span className='RecipeTitle'><strong>{item.title}</strong></span><br />
                                            <span className='RecipeValue'><strong>Value:</strong> {item.value}</span><br />
                                            <span className='CookingTime'><strong>Time:</strong> {item.time}</span>
                                        </div>
                                <div className='InfoIconContainer' style={{ display: 'none' }}>
                                    <img src={info} alt="recipeImage" style={{ width: '100%', display: 'none' }} />
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

export default RecipeHome;