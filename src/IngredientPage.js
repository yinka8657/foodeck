import './App.css';
import addrecipeicon from './addrecipeicon.svg';
import removeicon from './removeicon.svg';
import removeiconconfirm from './removeiconconfirm.svg';
import search from './search.svg';
import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

function IngredientList({ selectedIngredients, setSelectedIngredients }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetch(`http://localhost:5000/api/ingredients`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          const filtered = data.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(filtered);
          setShowSearch(true);
        })
        .catch(() => {
          setSearchResults([]);
          setShowSearch(false);
        });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelectResult = (item) => {
    if (!selectedIngredients.find(r => r.id === item.id)) {
      const updated = [item, ...selectedIngredients];
      setSelectedIngredients(updated);
    }
    setQuery('');
    setShowSearch(false);
  };

  const handleRemoveClick = (id, e) => {
    e.stopPropagation();
    if (confirmRemoveId === id) {
      const updated = selectedIngredients.filter(item => item.id !== id);
      setSelectedIngredients(updated);
      setConfirmRemoveId(null);
    } else {
      setConfirmRemoveId(id);
    }
  };

  return (
    <div className="Recipehome">
      <div className='Recipe-search-bar'>
        <img src={addrecipeicon} alt="add recipe" style={{ width: '10vw' }} />
        <input
          type="text"
          placeholder="Search Ingredient"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        <img src={search} alt="search" style={{ width: '10vw' }} />
      </div>

      <div className={`SearchDisplayContainer ${showSearch && searchResults.length > 0 ? 'show' : ''}`}>
        <ul className='SearchList'>
          {searchResults.length === 0 && query && (
            <li className='SearchResult'>No results</li>
          )}
          {searchResults.map((item, index) => (
            <li className='SearchResult' key={index} onClick={() => handleSelectResult(item)}>
              <span>{item.name}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className='RecipeListContainer'>
        <div className='RecipeListTopContainer'>
          <div className='RecipeItem'>
            <ul className='ItemList'>
              {selectedIngredients.length === 0 && (
                <li style={{ listStyle: 'none', padding: '1em', color: '#666' }}>
                  No ingredients added yet.
                </li>
              )}
              {selectedIngredients.map((item, index) => (
                <li className='RecipeItemDetails' key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Link
                      to="/recipe"
                      state={{ recipe: item }}
                      style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flex: 1 }}
                    >
                      <div className='RecipeImageContainer'>
                        <img
                          src={item.image || 'https://via.placeholder.com/100'}
                          alt="ingredient"
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div className='RecipeInfoTextContainer' style={{ paddingLeft: '15px' }}>
                        <span className='RecipeTitle'><strong>{item.name}</strong></span><br />
                        <span className='RecipeValue'><strong>Value:</strong> {item.value || 'N/A'}</span><br />
                        <span className='CookingTime'><strong>Expires:</strong> {item.time || 'N/A'}</span>
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
