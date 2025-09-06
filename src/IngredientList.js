import './App.css';
import addrecipeicon from './addrecipeicon.svg';
import removeicon from './removeicon.svg';
import removeiconconfirm from './removeiconconfirm.svg';
import search from './search.svg';
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { SelectedIngredientsContext } from './SelectedIngredientsContext';
import API_URL from "./config";

function IngredientList({ showTopBar }) {
  const { selectedIngredients, setSelectedIngredients } = useContext(SelectedIngredientsContext);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`${API_URL}/api/ingredients?q=${encodeURIComponent(query)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setSearchResults(data);
          setShowSearch(true);
        })
        .catch(() => {
          setSearchResults([]);
          setShowSearch(false);
        });
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  const handleSelectResult = (item) => {
    if (!selectedIngredients.some(i => i.id === item.id)) {
      setSelectedIngredients([item, ...selectedIngredients]);
    }
    setQuery('');
    setShowSearch(false);
  };

  const handleRemoveClick = (id, e) => {
    e.stopPropagation();
    if (confirmRemoveId === id) {
      setSelectedIngredients(selectedIngredients.filter(item => item.id !== id));
      setConfirmRemoveId(null);
    } else {
      setConfirmRemoveId(id);
    }
  };

  return (
    <div className="Recipehome" style={{ top:"100px", paddingTop:"0"}}>
      {/* Sticky search bar wrapper */}
      <div
  className="Recipe-search-bar-wrapper"
  style={{
    position: "sticky",
    zIndex: 1000,
    transform: showTopBar ? "translateY(0)" : "translateY(-100%)",
    transition: "transform 0.3s ease"
  }}
>
  <div
    className="Recipe-search-bar"
    style={{
      display: "flex",
      alignItems: "center",
      boxSizing: "border-box",
      backgroundColor: "white",
      width: "100%",
      top: "0"
    }}
  >
    <img src={addrecipeicon} alt="add recipe" style={{ width: "10vw" }} />
    <input
      type="text"
      placeholder="Search Ingredient"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      style={{ fontSize: "20px", margin: "0 10px", flex: 1 }}
    />
    <img src={search} alt="search" style={{ width: "8vw" }} />

    <div
      className={`SearchDisplayContainer ${showSearch && searchResults.length > 0 ? 'show' : ''}`}
      style={{ position: 'absolute', top: '60px', left: 0, right: 0, zIndex: 999, width:"95vw", marginTop:"20px" }}
    >
      <ul className="SearchList" style={{ fontSize: '20px', fontWeight: '600', margin: 0 }}>
        {searchResults.length === 0 && query && (
          <li className='SearchResult'>No results</li>
        )}
        {searchResults.map(item => (
          <li
            className='SearchResult' style= {{}}
            key={item.id}
            onClick={() => handleSelectResult(item)}
          >
            <span>{item.name}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
</div>


      {/* Selected ingredients list */}
      <div className='RecipeListContainer' style={{}}>
        <div className='RecipeListTopContainer'>
          <div className='RecipeItem'>
            <ul className='ItemList no-scrollbar'>
              {selectedIngredients.length === 0 && (
                <li
                  style={{
                    listStyle: 'none',
                    padding: '1em',
                    color: '#666',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                  }}
                >
                  No ingredients added yet. <br />
                  Add Ingredients for Recipe Suggestions.
                </li>
              )}
              {selectedIngredients.map(item => (
                <li className='RecipeItemDetails' key={item.id}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Link
                      to="/ingredientPage"
                      state={{ ingredient: item }}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1 }}
                    >
                      <div className='RecipeImageContainer' style={{ width: '80px', height: '100px', overflow: 'hidden' }}>
                        <img
                          src={item.image || "https://via.placeholder.com/100"}
                          alt="ingredient"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className='RecipeInfoTextContainer' style={{ padding: '17px 15px' }}>
                        <span className='RecipeTitle' style={{ lineHeight: '20px' }}><strong>{item.name}</strong></span><br />
                        <span className='RecipeValue'><strong>Value:</strong> {item.value}</span><br />
                        <span className='CookingTime'><strong>Expires:</strong> {item.expiry}</span>
                      </div>
                    </Link>
                    <div className='InfoIconContainer'>
                      <img
                        src={confirmRemoveId === item.id ? removeiconconfirm : removeicon}
                        alt="remove"
                        style={{ width: '8vw', cursor: 'pointer' }}
                        onClick={(e) => handleRemoveClick(item.id, e)}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientList;
