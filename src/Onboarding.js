import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import onboard1 from "./assets/onboarding1.svg";
import onboard2 from "./assets/onboarding2.svg";
import onboard3 from "./assets/onboarding3.svg";
import onboard4 from "./assets/onboarding4.svg";

function Onboarding({ onFinish }) {
  return (
    <div className="slide-content" style={{ height: `${window.innerHeight}px`,  }}>
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={30}
        slidesPerView={1}
      >
        <SwiperSlide >
          <div className="slide">
            <img src={onboard1} alt="Step 1" style={{ width: "80%" }} />
            <h2>Welcome to Afrifoody!</h2>
            <p>Your smart kitchen buddy — discover what you can cook with what you already have.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src={onboard2} alt="Step 1" style={{ width: "80%" }} />
            <h2>Add Your Ingredients</h2>
            <p>Select ingredients you already have at home.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src={onboard3} alt="Step 2" style={{ width: "80%" }} />
            <h2>Get Recipe Suggestions</h2>
            <p>Instant recipes tailored to what you have.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide">
            <img src={onboard4} alt="Step 3" style={{ width: "80%" }} />
            <h2>Cook & Enjoy</h2>
            <p>Turn ingredients into delicious meals.</p>
            <button 
              className="get-started-btn"
              onClick={onFinish}
            >
              Get Started
            </button>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Onboarding;
