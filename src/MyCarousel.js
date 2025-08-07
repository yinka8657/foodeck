import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import recipeImage from './RecipeImage/eforiro.png';

const MyCarousel = () => {
  return (
    <div style={{ maxWidth: "500px", margin: "2vh auto" }}>
      <Carousel autoPlay infiniteLoop showThumbs={false}>
      <div>
            <img src={recipeImage} alt="recipeImage" />
            <p className="legend" style={{ fontSize: "x-large" }}> Jollof Rice</p> 
        </div>
        <div>
            <img src={recipeImage} alt="recipeImage" />
            <p className="legend" style={{ fontSize: "x-large" }}> Jollof Rice</p> 
        </div>
        <div>
            <img src={recipeImage} alt="recipeImage" />
            <p className="legend" style={{ fontSize: "x-large" }}> Jollof Rice</p> 
        </div>
        <div>
            <img src={recipeImage} alt="recipeImage" />
            <p className="legend" style={{ fontSize: "x-large" }}> Jollof Rice</p> 
        </div>
      </Carousel>
    </div>
  );
};

export default MyCarousel;
