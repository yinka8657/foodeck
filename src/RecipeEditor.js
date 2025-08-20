// RecipeEditor.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import  API_URL  from "./config";

export default function RecipeEditor({ onSaved }) {
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const [time, setTime] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newIng, setNewIng] = useState({ name: "", image: "", description: "" });

  useEffect(() => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delay = setTimeout(() => {
      axios
        .get(`${API_URL}/api/ingredients?q=${encodeURIComponent(query)}`)
        .then((res) => setSearchResults(res.data))
        .catch(() => setSearchResults([]));
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  const addIngredient = (ingredient) => {
    if (!selected.find((s) => s.id === ingredient.id)) {
      setSelected([...selected, ingredient]);
    }
    setQuery("");
    setSearchResults([]);
  };

  const startNewIngredient = (name) => {
    setNewIng({ name: name.trim(), image: "", description: "" });
    setShowNewForm(true);
  };

  const confirmNewIngredient = () => {
    if (!newIng.name.trim()) return;
    setSelected((cur) => [...cur, { ...newIng }]);
    setShowNewForm(false);
    setNewIng({ name: "", image: "", description: "" });
    setQuery("");
    setSearchResults([]);
  };

  const removeIngredient = (idOrName) => {
    setSelected(selected.filter((s) => s.id !== idOrName && s.name !== idOrName));
  };

  const handleSubmit = async () => {
    try {
        const ingredientIds = selected.filter((s) => s.id).map((s) => s.id);
        const ingredientDetails = selected
          .filter((s) => !s.id)
          .map((s) => ({
            name: s.name,
            image: s.image || null,
            description: s.description || null,
            quantity: s.quantity || null, // optional if you later add quantities
          }));

          const payload = {
            title: title.trim(),
            value: value || null,
            time: time || null,
            image_url: imageUrl || null,
            ingredientIds,
            ingredientDetails, // ✅ must match backend
          };

      const res = await axios.post(`${API_URL}/api/recipes`, payload);
      if (onSaved) onSaved(res.data);

      setTitle("");
      setValue("");
      setTime("");
      setImageUrl("");
      setSelected([]);
    } catch (err) {
      console.error("Error saving recipe:", err);
      alert("Failed to save recipe.");
    }
  };

  const canAddQueryAsNew =
    query.trim().length > 1 &&
    !searchResults.some((r) => r.name.toLowerCase() === query.trim().toLowerCase());

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "auto", marginTop:"100px" }}>
      <h2>Add a New Recipe</h2>

      <input
        placeholder="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        placeholder="Nutritional Value"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        placeholder="Cooking Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <input
        placeholder="Image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      <h3>Ingredients</h3>

      <input
        placeholder="Search or add ingredient"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "100%", marginBottom: 10, padding: 8 }}
      />

      {searchResults.length > 0 && (
        <div style={{ border: "1px solid #ccc", marginBottom: 10 }}>
          {searchResults.map((ing) => (
            <div
              key={ing.id}
              onClick={() => addIngredient(ing)}
              style={{ padding: "8px 10px", cursor: "pointer" }}
            >
              {ing.name}
            </div>
          ))}
        </div>
      )}

      {canAddQueryAsNew && (
        <div
          onClick={() => startNewIngredient(query)}
          style={{
            padding: "8px 10px",
            cursor: "pointer",
            borderTop: "1px solid #eee",
            fontStyle: "italic",
          }}
        >
          ➕ Add “{query.trim()}” as a new ingredient
        </div>
      )}

      {showNewForm && (
        <div style={{ border: "1px solid #ddd", padding: 10, marginTop: 8 }}>
          <h4>New Ingredient Details</h4>
          <input
            value={newIng.name}
            onChange={(e) => setNewIng({ ...newIng, name: e.target.value })}
            placeholder="Name"
            style={{ width: "100%", marginBottom: 6, padding: 8 }}
          />
          <input
            value={newIng.image}
            onChange={(e) => setNewIng({ ...newIng, image: e.target.value })}
            placeholder="Image URL"
            style={{ width: "100%", marginBottom: 6, padding: 8 }}
          />
          <textarea
            value={newIng.description}
            onChange={(e) => setNewIng({ ...newIng, description: e.target.value })}
            placeholder="Description"
            style={{ width: "100%", marginBottom: 6, padding: 8 }}
          />
          <button type="button" onClick={confirmNewIngredient} style={{ marginRight: 6 }}>
            ✅ Add
          </button>
          <button type="button" onClick={() => setShowNewForm(false)}>❌ Cancel</button>
        </div>
      )}

      <div style={{ marginTop: 10 }}>
        {selected.map((s) => (
          <div key={s.id || s.name} style={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
            <span>{s.name}</span>
            <button
              onClick={() => removeIngredient(s.id || s.name)}
              style={{ marginLeft: 8 }}
            >
              ❌
            </button>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} style={{ marginTop: 20, padding: 10 }}>
        💾 Save Recipe
      </button>
    </div>
  );
}
