const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Allow CORS so React can connect
app.use(cors());

app.use(express.json()); // <-- Needed for POST requests

// Dummy recipes data
const recipes = [
  {
    id: 1,
    "title": 'Jollof Rice',
    "value": 'Carbohydrate',
    "time": '45–60 mins',
    "image": 'https://www.yumlista.com/storage/recipes/AiEgolJU4zflIQ03P49S9Czgbtjp0DptdYOa2nM5.jpg',
    "ingredients": ['2 cups long grain parboiled rice','4 large tomatoes','2 red bell peppers','2 scotch bonnet peppers','1 large onion (divided)','3 tablespoons tomato paste','1/4 cup vegetable oil','2 teaspoons curry powder','1 teaspoon dried thyme','2 bay leaves','2 seasoning cubes','Salt to taste','2–3 cups chicken stock or water','Optional: butter, sliced fresh tomato & onion for garnish'],
    instructions: 'To prepare Nigerian Jollof Rice, start by blending the tomatoes, red bell peppers, scotch bonnet peppers, and half of the onion into a smooth mixture, then boil the blend to reduce water content. In a pot, heat oil and sauté the remaining sliced onions until fragrant, then stir in tomato paste and fry for about 5 minutes to remove its tang. Add the reduced pepper mixture and cook on medium heat, stirring often, until the sauce thickens and the oil floats to the top. Season with curry powder, thyme, bay leaves, seasoning cubes, and salt. Rinse the parboiled rice until the water runs clear, then add it to the sauce, stirring to coat each grain. Pour in chicken stock to just cover the rice, reduce the heat to low, cover the pot with foil and a lid to trap steam, and cook until the rice is tender and the liquid is absorbed. Stir lightly once or twice during cooking, and avoid burning. If desired, finish with a knob of butter and garnish with fresh tomato and onion slices before serving with fried plantain, chicken, or fish.'	
  },
  {
    id: 2,
    "title": 'Egusi Soup',
    "value": 'Protein',
    "time": '60 mins',
    "image": 'https://lowcarbafrica.com/wp-content/uploads/2018/06/Egusi-Soup-IG-1.jpg',
    "ingredients": ['2 cups Egusi (melon) seeds, ground','1 kg assorted meats (beef, goat meat, tripe, cow skin/shaki)','1 cup stockfish and/or dried fish','1 cup palm oil','1 medium onion, chopped','2 tablespoons ground crayfish','2 teaspoons ground pepper (or to taste)','2 seasoning cubes (e.g. Knorr or Maggi)','Salt, to taste','2 cups chopped spinach (or ugwu/ugu, bitterleaf or waterleaf)','3 cups meat stock (or water)','Optional: 1 scotch bonnet (for extra heat), 1 tsp iru (locust bean)'],
    instructions:'To make Egusi Soup, start by washing and seasoning assorted meats (such as beef, goat meat, tripe, or cow skin) along with stockfish or dried fish using salt, chopped onions, and seasoning cubes, then boil until everything is tender. Meanwhile, prepare a thick paste by mixing ground egusi (melon seeds) with a little water. In a separate pot, heat palm oil and sauté chopped onions until soft, then add the egusi paste in scoops and let it fry without stirring for about 10–12 minutes until it begins to form soft lumps and release oil. Stir gently and allow it to cook further. Next, pour in the cooked meats, fish, and meat stock, then season with crayfish, ground pepper, more seasoning cubes, and salt to taste. Let the soup simmer on low heat for 10–15 minutes so the flavors can develop. Finally, add chopped leafy vegetables such as spinach, ugu, bitterleaf, or waterleaf, stir well, and cook for another 5–10 minutes until the vegetables are tender. Serve hot with pounded yam, eba, fufu, or rice.'
  },
  {
    id: 3,
    "title": 'Oil Beans',
    "value": 'Protein & Fiber',
    "time": '60–75 mins',
    "image": 'https://www.seriouseats.com/thmb/M2fKreFO_aUCgHZxj-03J4vqIBg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/20240223-SEA-Ewa-Riro-MaureenCelestine-41-66d4b8c6ef3a4124807dfbf11398767d.jpg',
    ingredients: [
    "2 cups brown or black-eyed beans",
    "1 medium onion, chopped",
    "1/4 cup palm oil",
    "2–3 tablespoons ground crayfish",
    "1–2 scotch bonnet peppers",
    "Salt to taste",
    "1–2 seasoning cubes (Maggi or Knorr)",
    "Water as needed",
    "Fried plantain or yam (optional, for serving)"
  ],
  "instructions": "To make Nigerian stewed beans (Ewa), rinse and boil the beans in water until soft—this usually takes about 45 minutes to 1 hour depending on the type of beans used. Add water as needed while cooking to avoid burning and stir occasionally. Once the beans are soft and some have broken down to create a thick texture, reduce the heat and stir in chopped onions, ground crayfish, pepper, and palm oil. Add salt and seasoning cubes to taste, and let it simmer for another 10–15 minutes, stirring frequently to prevent sticking and to allow the flavors to blend. You can mash a portion of the beans if you prefer a thicker, more traditional Ewa consistency. Serve hot on its own or with fried plantains, bread, or boiled yam for a satisfying meal."
  },
  {
    "id": 4,
    "title": "Moi Moi",
    "value": "Protein",
    "time": "60 mins",
    "image": "https://cdn.guardian.ng/wp-content/uploads/2024/08/Moimoi-with-corned-beef-recipe-by-Pinterest.jpg",
    "ingredients": [
      "Peeled brown beans",
      "Red bell peppers",
      "Onions",
      "Scotch bonnets",
      "Palm oil or vegetable oil",
      "Seasoning cubes",
      "Boiled eggs (optional)",
      "Titus fish (optional)",
      "Salt"
    ],
    "instructions": "Blend the peeled beans with red peppers, onions, and scotch bonnets until smooth. Mix the batter with oil, seasoning, and salt. Optionally add flaked fish and sliced boiled eggs. Pour mixture into containers or wraps (foil, leaves, or bowls) and steam for 45–60 minutes until firm. Allow to cool slightly and serve with pap, custard, or on its own."
  },
  {
    "id": 5,
    "title": "Afang Soup",
    "value": "Protein & Vegetables",
    "time": "55 mins",
    "image": "https://www.mydiasporakitchen.com/wp-content/uploads/2018/05/img_0794.jpg",
    "ingredients": [
      "Water leaves",
      "Okazi leaves",
      "Beef",
      "Stock fish",
      "Snails",
      "Periwinkle",
      "Crayfish",
      "Palm oil",
      "Seasoning cubes",
      "Salt"
    ],
    "instructions": "Wash and boil meats, stock fish, and snails until soft. Add palm oil, ground crayfish, seasoning cubes, and salt. Stir in finely sliced water leaves and cook briefly. Add shredded Okazi leaves and let it cook until thick and well combined. Add periwinkles and allow soup to simmer. Serve hot with fufu or pounded yam."
  },
    {
    "id": 6,
    "title": "Fisherman Soup",
    "value": "Protein & Seafood",
    "time": "45 mins",
    "image": "https://www.chefspencil.com/wp-content/uploads/Fisherman-Soup-500x375.jpeg",
    "ingredients": [
      "Fresh fish (Catfish or Tilapia)",
      "Shrimp",
      "Periwinkle",
      "Palm oil",
      "Crayfish",
      "Pepper",
      "Onions",
      "Uziza leaves",
      "Seasoning cubes",
      "Salt"
    ],
    "instructions": "Clean and season fish and seafood with salt, pepper, and onions. In a pot, heat palm oil and pour in ground crayfish and blended pepper. Add the seafood and allow to cook gently without stirring too much to avoid breaking the fish. Add uziza leaves and season to taste. Let simmer for a few minutes and serve hot with pounded yam or fufu."
  },
   {
    "id": 7,
    "title": "Nkwobi (Cow Foot Pepper Soup)",
    "value": "Protein",
    "time": "60 mins",
    "image": "https://worldlytreat.com/wp-content/uploads/2023/03/Nkwobi-spicy-cow-leg.jpg",
    "ingredients": [
      "Cow foot (trotters)",
      "Palm oil",
      "Uziza leaves",
      "Ehuru seeds (calabash nutmeg)",
      "Potash",
      "Seasoning cubes",
      "Crayfish",
      "Onion",
      "Salt"
    ],
    "instructions": "Boil chopped cow foot with onions and seasoning cubes until tender. Mix palm oil with potash water until it thickens. Blend crayfish and ehuru, then add into the oil mix. Stir in the cooked cow foot and simmer for a few minutes. Garnish with sliced uziza leaves. Serve warm in a bowl as a delicacy or with a cold drink."
  },
  {
    "id": 8,
    "title": "Ofada Rice and Ayamase Sauce",
    "value": "Carbohydrate & Protein",
    "time": "70 mins",
    "image": "https://leadership.ng/wp-content/uploads/2024/04/Screenshot-2024-04-14-061058.png",
    "ingredients": [
      "Ofada rice",
      "Green bell peppers",
      "Scotch bonnet (atarodo)",
      "Onions",
      "Assorted meat (shaki, ponmo, beef, etc.)",
      "Palm oil",
      "Locust beans (iru)",
      "Seasoning cubes",
      "Salt"
    ],
    "instructions": "Cook Ofada rice separately and set aside. For the Ayamase sauce, blend green peppers, scotch bonnet, and onions, then boil to reduce water. Bleach palm oil in a pot, add chopped onions, locust beans, and the blended pepper mix. Stir in boiled assorted meats, season with salt and cubes, then simmer until thick and oil rises to the top. Serve with the hot Ofada rice."
  },
  {
    "id": 9,
    "title": "Banga Soup",
    "value": "Protein & Fat",
    "time": "60 mins",
    "image": "https://www.myactivekitchen.com/wp-content/uploads/2015/03/niger-delta-banga-soup-recipe-img-7-500x500.jpg",
    "ingredients": [
      "Palm nut extract",
      "Beef or goat meat",
      "Dry fish",
      "Stockfish",
      "Crayfish",
      "Banga spices",
      "Seasoning cubes",
      "Scent leaves or dried basil",
      "Salt"
    ],
    "instructions": "Boil meats, stockfish, and dry fish with seasoning cubes. In a separate pot, heat palm nut extract and let it boil. Add the cooked meats, ground crayfish, Banga spice mix, and salt. Stir and allow to simmer until thick. Add scent leaves toward the end of cooking for aroma. Serve hot with starch, fufu, or pounded yam."
  },
  {
    "id": 10,
    "title": "Bobotie",
    "value": "Protein & Carbohydrate",
    "time": "75 mins",
    "image": "https://www.panningtheglobe.com/wp-content/uploads/2013/02/bobotie-square.jpg",
    "ingredients": [
      "Minced beef",
      "Onions",
      "Garlic",
      "Bread slices",
      "Milk",
      "Curry powder",
      "Turmeric",
      "Chutney",
      "Raisins",
      "Eggs",
      "Bay leaves",
      "Salt",
      "Black pepper"
    ],
    "instructions": "Soak the bread in milk, squeeze out excess, and mash. Sauté onions and garlic, add curry and turmeric, then stir in minced beef and cook till browned. Add mashed bread, chutney, raisins, salt, and pepper. Transfer mixture to a greased baking dish, flatten top, and pour over beaten eggs mixed with remaining milk. Place bay leaves on top and bake until custard is set and golden. Serve with yellow rice or salad."
  },
  {
    "id": 11,
    "title": "Couscous Royale",
    "value": "Carbohydrate & Protein",
    "time": "90 mins",
    "image": "https://www.saveur.com/uploads/2019/02/08/FZ76GWAUBFC62GDJBRKTV647TQ.jpg?auto=webp",
    "ingredients": [
      "Couscous grains",
      "Lamb chunks",
      "Chicken thighs",
      "Merguez sausages",
      "Carrots",
      "Zucchini",
      "Chickpeas",
      "Tomatoes",
      "Onions",
      "Garlic",
      "Harissa",
      "Olive oil",
      "Spices (cumin, coriander, cinnamon)",
      "Salt",
      "Pepper"
    ],
    "instructions": "Brown all meats in olive oil, then remove. In the same pot, sauté onions, garlic, tomatoes, and spices. Add chickpeas, chopped carrots, and zucchini, then return the meats and cover with water. Simmer till tender. Prepare couscous by steaming or soaking in hot water and fluffing with a fork. Serve meats and vegetables over couscous with a dollop of harissa for heat."
  },
  {
    "id": 12,
    "title": "Yassa Poulet",
    "value": "Protein & Fat",
    "time": "60 mins",
    "image": "https://travelandmunchies.com/wp-content/uploads/2023/02/IMG_1680-scaled.jpg",
    "ingredients": [
      "Chicken thighs or drumsticks",
      "Lemons",
      "Onions",
      "Garlic",
      "Mustard",
      "Vegetable oil",
      "Chili peppers",
      "Bouillon cubes",
      "Salt",
      "Black pepper"
    ],
    "instructions": "Marinate chicken with lemon juice, mustard, chopped onions, garlic, salt, and pepper for several hours. Sear chicken in oil until browned, then set aside. In the same pot, cook down the marinated onions with more mustard and chilies. Return chicken to the pot and simmer until fully cooked and sauce is thickened. Serve hot with rice or couscous."
  }
];







// GET endpoint
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});


// Search recipes by title
app.get('/api/recipes/search', (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const filtered = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(query)
  );
  res.json(filtered);
});


// Suggest recipes based on selected ingredients
app.post("/api/recipes/suggest", (req, res) => {
  const { selectedIngredients } = req.body;

  if (!selectedIngredients || !Array.isArray(selectedIngredients)) {
    return res.status(400).json({ error: "selectedIngredients must be an array" });
  }

  // Convert selected ingredients to lowercase for loose matching
  const lowerCaseIngredients = selectedIngredients.map(i => i.toLowerCase());

  // Filter recipes where at least one ingredient is matched
  const matchingRecipes = recipes.filter(recipe => 
    recipe.ingredients.some(ingredient =>
      lowerCaseIngredients.some(selected =>
        ingredient.toLowerCase().includes(selected)
      )
    )
  );

  res.json(matchingRecipes);
});

















// Sample ingredients data
const ingredients = [
  {
    id: 1,
    name: "Salt",
    image: "https://assets.clevelandclinic.org/transform/LargeFeatureImage/803796f4-66ab-4ba8-8967-b4ab94f07acf/TooMuchSodiuml-1051727580-770x533-1_jpg",
    description: "Essential seasoning used in virtually every African dish.",
    value: "Minerals",
    expiry: "10/12/2028"
  },
  {
    id: 2,
    name: "Melon",
    image: "https://www.neogric.com/wp-content/uploads/2025/04/Neogric-Melon-Seeds-2.jpg",
    description: "Ground melon seeds used in thick soups like Egusi soup.",
    value: "Protein",
    expiry: "01/04/2029"
  },
  {
    id: 3,
    name: "Onion",
    image: "https://www.bhg.com/thmb/vr6SyEgkmNO0Qu2wxph90gKYey4=/4000x0/filters:no_upscale():strip_icc()/BHG-recipes-how-to-cooking-basics-types-of-onions-hero-55bb0103826149529d4824f69372fa10.jpg",
    description: "A strong-flavored vegetable used for its aromatic base.",
    value: "Fiber",
    expiry: "02/05/2029"
  },
  {
    id: 4,
    name: "Palm Oil",
    image: "https://www.tastingtable.com/img/gallery/what-is-red-palm-oil-and-how-is-it-best-used/intro-1693393090.jpg",
    description: "Rich red oil extracted from palm fruit, used in many Nigerian dishes.",
    value: "Fat",
    expiry: "07/11/2028"
  },
  {
    id: 5,
    name: "Maggi Cube",
    image: "https://zeemart.shop/wp-content/uploads/2021/05/Maggi-Crayfish-2.jpg",
    description: "Seasoning cube commonly used in African cooking for umami flavor.",
    value: "Sodium",
    expiry: "09/03/2027"
  },
  {
    id: 6,
    name: "Stockfish",
    image: "https://www.foodvestglobal.com/wp-content/uploads/2024/01/Stockfishcut.jpg",
    description: "Dried codfish used in stews and soups for added flavor.",
    value: "Protein",
    expiry: "05/02/2029"
  },
  {
    id: 7,
    name: "Crayfish",
    image: "https://www.shutterstock.com/image-photo/dried-shrimp-market-600nw-2014339892.jpg",
    description: "Dried and ground crustaceans used as seasoning in local dishes.",
    value: "Protein",
    expiry: "11/07/2029"
  },
  {
    id: 8,
    name: "Okra",
    image: "https://cdn2.hubspot.net/hubfs/2731727/okra.jpg",
    description: "A green vegetable used in okra soup, known for its slimy texture.",
    value: "Fiber",
    expiry: "04/12/2025"
  },
  {
    id: 9,
    name: "Bitterleaf",
    image: "https://motherlandharvest.com/cdn/shop/products/F0C6C0D5-2D76-441A-AFFF-7E927B7361FA.jpg?v=1674152003",
    description: "A leaf vegetable used in soups like bitterleaf soup (Ofe Onugbu).",
    value: "Antioxidants",
    expiry: "02/01/2026"
  },
  {
    id: 10,
    name: "Pepper",
    image: "https://htsfarms.ng/wp-content/uploads/2024/03/Fresh-pepper-atarodo-1.jpg",
    description: "Hot chili pepper used for heat and flavor in soups and sauces.",
    value: "Vitamin C",
    expiry: "03/08/2026"
  }
];








// Routes for ingredients

// Get ingredients (optionally filtered by query)
app.get("/api/ingredients", (req, res) => {
  const query = req.query.q?.toLowerCase() || '';

  const filteredIngredients = ingredients.filter(ingredient =>
    ingredient.name.toLowerCase().includes(query)
  );

  res.json(filteredIngredients);
});

// Get one ingredient by ID
app.get("/api/ingredients/:id", (req, res) => {
  const ingredient = ingredients.find(i => i.id == req.params.id);
  if (!ingredient) return res.status(404).json({ error: "Ingredient not found" });
  res.json(ingredient);
});

// Add a new ingredient
app.post("/api/ingredients", (req, res) => {
  const { name, image, description } = req.body;
  const newIngredient = {
    id: ingredients.length + 1,
    name,
    image,
    description
  };
  ingredients.push(newIngredient);
  res.status(201).json(newIngredient);
});





// Start server
app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});