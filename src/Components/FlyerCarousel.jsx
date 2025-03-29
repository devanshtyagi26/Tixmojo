import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom Previous Button
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      left: "-40px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "#fff",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "40px",
      height: "40px",
      cursor: "pointer",
    }}
  >
    &#8592; {/* Left arrow symbol */}
  </button>
);

// Custom Next Button
const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      right: "-40px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "#fff",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
      width: "40px",
      height: "40px",
      cursor: "pointer",
    }}
  >
    &#8594; {/* Right arrow symbol */}
  </button>
);

function FlyerCarousel() {
  const settings = {
    dots: true, // Show navigation dots
    infinite: true, // Infinite scrolling
    speed: 500, // Transition speed
    slidesToShow: 1, // Number of slides to show
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Enable autoplay
    autoplaySpeed: 3000, // Autoplay interval
    arrows: true, // Enable custom arrows
    prevArrow: <CustomPrevArrow />, // Custom previous button
    nextArrow: <CustomNextArrow />, // Custom next button
  };

  const flyers = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    },
  ];

  return (
    <div
      style={{
        width: "100%", // Fit to width
        maxWidth: "1200px", // Increased size while maintaining the aspect ratio
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <Slider {...settings}>
        {flyers.map((flyer) => (
          <div key={flyer.id}>
            <img
              src={flyer.image}
              alt={`Flyer ${flyer.id}`}
              style={{
                width: "100%", // Fit the width of the container
                height: "auto", // Maintain aspect ratio
                aspectRatio: "945 / 256", // Enforce the aspect ratio
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default FlyerCarousel;
