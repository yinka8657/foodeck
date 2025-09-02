import React, { useState, useEffect, useRef } from "react";
import star from "./star.svg";
import solidstar from "./star-solid.svg";
import { supabase } from "./supabaseClient";

function RatingStars({ recipeId, user, recipe }) {
  // Safe logs (avoid crashing if user is null/undefined)
  console.log("RatingStars props:", { user, recipeId, recipe });
  console.log("Logged-in user ID:", user?.id || "none");

  const [rating, setRating] = useState(0);
  const justUpdated = useRef(false);

  // Load user's rating once recipe & user are ready
  useEffect(() => {
    if (!user?.id || !recipeId) return;

    const fetchRating = async () => {
      console.log("[Rating] fetch ->", { userId: user.id, recipeId });
      const { data, error } = await supabase
        .from("ratings")
        .select("rating")
        .eq("user_id", user.id)
        .eq("recipe_id", recipeId)
        .maybeSingle();

      if (error) {
        console.error("[Rating] fetch error:", error);
      } else if (data && !justUpdated.current) {
        console.log("[Rating] fetched:", data.rating);
        setRating(data.rating);
      } else {
        console.log("[Rating] no rating found");
      }

      // reset the “just updated” flag after fetch completes
      justUpdated.current = false;
    };

    fetchRating();
  }, [recipeId, user?.id]);

  const handleClick = async (index) => {
    if (!user?.id || !recipeId) return;

    const newRating = index + 1;
    console.log("Clicked star:", newRating);

    // Instant UI feedback
    setRating(newRating);
    justUpdated.current = true;
    console.log("[Rating] click ->", { newRating, userId: user.id, recipeId });

    // Save to DB and re-sync with what DB returns
    const { data, error } = await supabase
      .from("ratings")
      .upsert(
        { user_id: user.id, recipe_id: recipeId, rating: newRating },
        { onConflict: ["user_id", "recipe_id"] }
      )
      .select("rating")
      .single();

    if (error) {
      console.error("[Rating] upsert error:", error);
      // Reset so fetch will retry correctly later
      justUpdated.current = false;
    } else if (data) {
      console.log("[Rating] saved & confirmed:", data.rating);
      setRating(data.rating); // always align with server
      justUpdated.current = false;
    }
  };

  // Skip rendering if recipe not ready
  if (!recipe?.id) return null;

  return (
    <div className="RatingContainer" style={{ display: "flex", gap: 10 }}>
      {[...Array(5)].map((_, index) => (
        <button
          key={index}
          type="button"
          className="Rating"
          onClick={() => handleClick(index)}
          style={{
            background: "transparent",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
          aria-label={`Rate ${index + 1} stars`}
        >
          <img
            src={index < rating ? solidstar : star}
            alt={`rating-${index + 1}`}
            style={{ width: 40, height: 40, display: "block" }}
          />
        </button>
      ))}
      {/* Debug: show current value */}
      <span style={{ marginLeft: 8 }}>({rating})</span>
    </div>
  );
}

export default RatingStars;
