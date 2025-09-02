// supabaseClient.js
const { createClient } = require("@supabase/supabase-js");

// Public client (recipes, ingredients, etc.)
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

  module.exports = { supabase };
