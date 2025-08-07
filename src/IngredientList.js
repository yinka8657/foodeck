import './App.css';
import addrecipeicon from './addrecipeicon.svg';
import removeicon from './removeicon.svg';
import removeiconconfirm from './removeiconconfirm.svg';
import search from './search.svg';
import React, { useEffect, useState } from "react";

function IngredientList({ selectedIngredients, setSelectedIngredients }) {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [confirmRemoveId, setConfirmRemoveId] = useState(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Load from localStorage when component mounts
    const saved = localStorage.getItem("selectedIngredients");
    if (saved) {
      setSelectedIngredients(JSON.parse(saved));
    }
  }, []);
  
  useEffect(() => {
    // Save to localStorage whenever it changes
    localStorage.setItem("selectedIngredients", JSON.stringify(selectedIngredients));
  }, [selectedIngredients]);




  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      fetch(`http://localhost:5000/api/ingredients?q=${query}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          console.log("Search Results:", data);
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
          style={{ fontSize: '20px' }}
        />
        <img src={search} alt="search" style={{ width: '8vw' }} />
      </div>

      <div className={`SearchDisplayContainer ${showSearch && searchResults.length > 0 ? 'show' : ''}`}>
        <ul className='SearchList' style={{ width: '100%', fontSize: '20px', fontWeight: '600' }}>
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
                <li style={{ listStyle: 'none', padding: '1em', color: '#666', display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign:'center' }}>
                  No ingredients added yet. <br></br>
                  Add Ingredients for Recipe Suggestions.
                </li>
              )}
              {selectedIngredients.map((item, index) => (
                <li className='RecipeItemDetails' key={index}>
                  <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <div className='RecipeImageContainer' style={{width: '80px', height: '80px' , overFlow: 'hidden' , borderRadius: '8px'}}>
                      <img
                        src={item.image || "https://via.placeholder.com/100"}
                        alt="ingredient"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className='RecipeInfoTextContainer' style={{ paddingLeft: '15px' }}>
                      <span className='RecipeTitle'><strong>{item.name}</strong></span><br />
                      <span className='RecipeValue'><strong>Value:</strong> {item.value}</span><br />
                      <span className='CookingTime'><strong>Expires:</strong> {item.expiry}</span>
                    </div>
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
