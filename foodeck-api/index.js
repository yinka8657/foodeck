require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const authRoutes = require('./authRoutes');
const db = require('./db');  // your better-sqlite3 instance

const app = express();
const PORT = process.env.PORT || 5000;

// *** IMPORTANT: trust proxy setting ***
// This tells Express to trust the first proxy (e.g. nginx, Heroku router, Cloudflare) that forwards requests.
// Needed for correct IP detection behind proxies (fixes your X-Forwarded-For warning).
app.set('trust proxy', 1);

// Middlewares
app.use(cors());
app.use(express.json()); // needed for POST JSON bodies
app.use(helmet());

// Rate limiter: limits each IP to 100 requests per 15 minutes
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
  })
);

// Auth routes
app.use('/api/auth', authRoutes);

// --- Recipes Endpoints ---

// Get all recipes with ingredients included
app.get('/api/recipes', (req, res) => {
  try {
    const recipes = db.prepare(`
      SELECT id, title, value, time, image_url AS image, description, instructions
      FROM recipes ORDER BY id
    `).all();

    if (recipes.length === 0) return res.json([]);

    const recipeIds = recipes.map(r => r.id);
    const placeholders = recipeIds.map(() => '?').join(',');

    const ingredientsRows = db.prepare(`
      SELECT ri.recipe_id, i.name
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id IN (${placeholders})
      ORDER BY i.name
    `).all(...recipeIds);

    const ingredientsByRecipe = {};
    for (const row of ingredientsRows) {
      if (!ingredientsByRecipe[row.recipe_id]) {
        ingredientsByRecipe[row.recipe_id] = [];
      }
      ingredientsByRecipe[row.recipe_id].push(row.name);
    }

    const recipesWithIngredients = recipes.map(recipe => ({
      ...recipe,
      ingredients: ingredientsByRecipe[recipe.id] || [],
    }));

    res.json(recipesWithIngredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Search recipes by title (case insensitive)
app.get('/api/recipes/search', (req, res) => {
  try {
    const query = `%${(req.query.q || '').toLowerCase()}%`;
    const recipes = db.prepare(`
      SELECT id, title, value, time, image_url AS image, description 
      FROM recipes 
      WHERE LOWER(title) LIKE ? ORDER BY id
    `).all(query);
    res.json(recipes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to search recipes' });
  }
});

// Suggest recipes based on selected ingredients (with full ingredients included)
app.post('/api/recipes/suggest', (req, res) => {
  try {
    const { selectedIngredients } = req.body;
    if (!selectedIngredients || !Array.isArray(selectedIngredients)) {
      return res.status(400).json({ error: 'selectedIngredients must be an array' });
    }

    if (selectedIngredients.length === 0) {
      // Return all recipes with ingredients (reuse logic)
      const recipes = db.prepare(`
        SELECT id, title, value, time, image_url AS image, description, instructions
        FROM recipes ORDER BY id
      `).all();

      if (recipes.length === 0) return res.json([]);

      const recipeIds = recipes.map(r => r.id);
      const placeholders = recipeIds.map(() => '?').join(',');

      const ingredientsRows = db.prepare(`
        SELECT ri.recipe_id, i.name
        FROM recipe_ingredients ri
        JOIN ingredients i ON ri.ingredient_id = i.id
        WHERE ri.recipe_id IN (${placeholders})
        ORDER BY i.name
      `).all(...recipeIds);

      const ingredientsByRecipe = {};
      for (const row of ingredientsRows) {
        if (!ingredientsByRecipe[row.recipe_id]) {
          ingredientsByRecipe[row.recipe_id] = [];
        }
        ingredientsByRecipe[row.recipe_id].push(row.name);
      }

      const recipesWithIngredients = recipes.map(recipe => ({
        ...recipe,
        ingredients: ingredientsByRecipe[recipe.id] || [],
      }));

      return res.json(recipesWithIngredients);
    }

    // Lowercase ingredient names for case-insensitive matching
    const loweredNames = selectedIngredients.map(i => i.toLowerCase());

    // Prepare placeholders for SQLite query
    const placeholders = loweredNames.map(() => '?').join(',');

    // Get ingredient ids matching selected ingredients (case insensitive)
    const ingredientRows = db.prepare(`
      SELECT id FROM ingredients WHERE LOWER(name) IN (${placeholders})
    `).all(...loweredNames);

    if (ingredientRows.length === 0) {
      // No matching ingredients found, return empty
      return res.json([]);
    }

    const ingredientIds = ingredientRows.map(row => row.id);

    // Find distinct recipes that have at least one of the selected ingredient ids
    const recipes = db.prepare(`
      SELECT DISTINCT r.id, r.title, r.value, r.time, r.image_url AS image, r.description, r.instructions
      FROM recipes r
      JOIN recipe_ingredients ri ON r.id = ri.recipe_id
      WHERE ri.ingredient_id IN (${ingredientIds.map(() => '?').join(',')})
      ORDER BY r.id
    `).all(...ingredientIds);

    if (recipes.length === 0) {
      return res.json([]);
    }

    // Get ingredients for all matched recipes in one query
    const recipeIds = recipes.map(r => r.id);
    const recipePlaceholders = recipeIds.map(() => '?').join(',');

    const ingredientsRows = db.prepare(`
      SELECT ri.recipe_id, i.name
      FROM recipe_ingredients ri
      JOIN ingredients i ON ri.ingredient_id = i.id
      WHERE ri.recipe_id IN (${recipePlaceholders})
      ORDER BY i.name
    `).all(...recipeIds);

    // Group ingredients by recipe_id
    const ingredientsByRecipe = {};
    for (const row of ingredientsRows) {
      if (!ingredientsByRecipe[row.recipe_id]) {
        ingredientsByRecipe[row.recipe_id] = [];
      }
      ingredientsByRecipe[row.recipe_id].push(row.name);
    }

    // Attach ingredients array to each recipe
    const recipesWithIngredients = recipes.map(recipe => ({
      ...recipe,
      ingredients: ingredientsByRecipe[recipe.id] || [],
    }));

    res.json(recipesWithIngredients);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to suggest recipes' });
  }
});

// Get detailed recipe by id with ingredients included
app.get('/api/recipes/:id', (req, res) => {
  try {
    const recipeId = req.params.id;
    const recipe = db.prepare(`
      SELECT id, title, value, time, image_url AS image, description, instructions 
      FROM recipes WHERE id = ?
    `).get(recipeId);
    if (!recipe) return res.status(404).json({ error: 'Recipe not found' });

    // Get ingredient names for recipe
    const ingredients = db.prepare(`
      SELECT i.id, i.name, i.image, i.description, i.value, i.expiry
      FROM ingredients i
      JOIN recipe_ingredients ri ON i.id = ri.ingredient_id
      WHERE ri.recipe_id = ?
      ORDER BY i.name
    `).all(recipeId);

    res.json({ ...recipe, ingredients });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch recipe details' });
  }
});

// --- Ingredients Endpoints ---

// Get all ingredients (optionally filtered by query)
app.get('/api/ingredients', (req, res) => {
  try {
    const q = `%${(req.query.q || '').toLowerCase()}%`;
    const ingredients = db.prepare(`
      SELECT id, name, image, description, value, expiry 
      FROM ingredients
      WHERE LOWER(name) LIKE ?
      ORDER BY name
    `).all(q);
    res.json(ingredients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch ingredients' });
  }
});

// Get ingredient by id
app.get('/api/ingredients/:id', (req, res) => {
  try {
    const ingredient = db.prepare(`
      SELECT id, name, image, description, value, expiry FROM ingredients WHERE id = ?
    `).get(req.params.id);

    if (!ingredient) return res.status(404).json({ error: 'Ingredient not found' });
    res.json(ingredient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch ingredient' });
  }
});

// Add new ingredient
app.post('/api/ingredients', (req, res) => {
  try {
    const { name, image, description, value, expiry } = req.body;
    if (!name || !image || !description) {
      return res.status(400).json({ error: 'name, image, and description are required' });
    }

    const insert = db.prepare(`
      INSERT INTO ingredients (name, image, description, value, expiry)
      VALUES (?, ?, ?, ?, ?)
    `);

    const info = insert.run(name, image, description, value || '', expiry || '');

    const newIngredient = db.prepare('SELECT * FROM ingredients WHERE id = ?').get(info.lastInsertRowid);

    res.status(201).json(newIngredient);
  } catch (error) {
    console.error(error);
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ error: 'Ingredient with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to add ingredient' });
  }
});

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler (for next(err))
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
