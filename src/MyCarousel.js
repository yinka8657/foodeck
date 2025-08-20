import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

const MyCarousel = ({ selectedIngredients = [] }) => {
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/recipes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const shuffled = data.sort(() => 0.5 - Math.random());
          setRecipes(shuffled.slice(0, 5));
        }
      })
      .catch(err => console.error("Error fetching recipes:", err));
  }, []);

  return (
    <div style={{ maxWidth: "500px", margin: "2vh auto" }}>
      {recipes.length > 0 ? (
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          emulateTouch
          swipeable
          useKeyboardArrows
        >
          {recipes.map((recipe, index) => (
            <div key={index} style={{ cursor: 'pointer' }}>
              {/* Wrap entire slide in Link */}
              <Link
                to="/recipe"
                state={{ recipe, selectedIngredients }}
                style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
              >
                <img
                  src={recipe.image_url || "/placeholder.jpg"}
                  alt={recipe.title}
                  style={{ objectFit: "cover", height: "300px", width: "100%" }}
                />
                <p className="legend" style={{ fontSize: "x-large", marginTop: '0.5rem' }}>
                  {recipe.title}
                </p>
              </Link>
            </div>
          ))}
        </Carousel>
      ) : (
        <p style={{ textAlign: "center", fontSize: "1.2rem", marginTop: "2rem" }}>
          Loading recipes...
        </p>
      )}
    </div>
  );
};

export default MyCarousel;
