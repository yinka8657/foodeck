import './App.css';
import addrecipeicon from './addrecipeicon.svg';
import removeicon from './removeicon.svg';
import removeiconconfirm from './removeiconconfirm.svg';
import search from './search.svg';
import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { SelectedIngredientsContext } from './SelectedIngredientsContext';  // import your context
import API_URL from "./config";


function IngredientList() {
  // Use context instead of props
  const { selectedIngredients, setSelectedIngredients } = useContext(SelectedIngredientsContext);

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  // Debounced search effect
  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const timeoutId = setTimeout(() => {
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

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Add ingredient if not already selected
  const handleSelectResult = (item) => {
    if (!selectedIngredients.some(r => r.id === item.id)) {
      setSelectedIngredients([item, ...selectedIngredients]);
    }
    setQuery('');
    setShowSearch(false);
  };

  // Remove ingredient with confirm click
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
    <div className="Recipehome">
      <div className='Recipe-search-bar' style={{boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'}}>
        <img src={addrecipeicon} alt="add recipe" style={{ width: '10vw' }} />
        <input
          type="text"
          placeholder="Search Ingredient"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ fontSize: '20px', marginRight: '10px', marginLeft: '10px' }}
        />
        <img src={search} alt="search" style={{ width: '8vw' }} />
      </div>

      <div onTouchMove={(e) => e.stopPropagation()} className={`SearchDisplayContainer ${showSearch && searchResults.length > 0 ? 'show' : ''}`}>
        <ul className='SearchList' style={{ width: '100%', fontSize: '20px', fontWeight: '600' }}>
          {searchResults.length === 0 && query && (
            <li className='SearchResult'>No results</li>
          )}
          {searchResults.map(item => (
            <li
              className='SearchResult'
              key={item.id}
              onClick={() => handleSelectResult(item)}
            >
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className='RecipeListContainer'>
        <div className='RecipeListTopContainer'>
          <div className='RecipeItem'>
            <ul className='ItemList .no-scrollbar'>

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
                      <div className='RecipeInfoTextContainer' style={{ padding: '17px 15px', }}>
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
