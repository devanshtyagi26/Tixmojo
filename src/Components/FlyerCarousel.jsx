import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore } from "react-icons/md"; // Importing the left arrow icon
import { MdNavigateNext } from "react-icons/md"; // Importing the right arrow icon

// Custom Previous Button
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      left: "-22px",
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      zIndex: 10, // Ensure it's above the image
    }}
  >
    <MdNavigateBefore style={{ zIndex: 2 }} />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "44px",
        height: "44px",
        backgroundColor: "#d0d0d0",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1, // Place it behind the icon
      }}
    />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "70px",
        height: "70px",
        backgroundColor: "white",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 0, // Place it behind the icon
      }}
    />
  </button>
);

// Custom Next Button
const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      right: "-22px",
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
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "24px",
      zIndex: 10, // Ensure it's above the image
    }}
  >
    <MdNavigateNext style={{ zIndex: 2 }} />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "44px",
        height: "44px",
        backgroundColor: "#d0d0d0",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1, // Place it behind the icon
      }}
    />
    <span
      style={{
        content: '""',
        position: "absolute",
        width: "70px",
        height: "70px",
        backgroundColor: "white",
        borderRadius: "50%",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 0, // Place it behind the icon
      }}
    />
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
        maxWidth: "1500px", // Increased size while maintaining the aspect ratio
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* SVG for clipPath */}
      <svg width="0" height="0">
        <defs>
          <clipPath id="flyerClipPath" clipPathUnits="userSpaceOnUse">
            <path d="M1491 0C1495.97 0 1500 4.02944 1500 9V171.891C1465.11 171.891 1436.83 200.174 1436.83 235.063C1436.83 269.681 1464.67 297.794 1499.18 298.231L1500 298.237V461.127C1500 466.098 1495.97 470.127 1491 470.127H9C4.02944 470.127 0 466.098 0 461.127V298.084C32.8334 295.821 58.7656 268.472 58.7656 235.063C58.7655 201.656 32.8333 174.305 0 172.042V9C2.52225e-06 4.02944 4.02944 4.22794e-08 9 0H1491Z" />
          </clipPath>
        </defs>
      </svg>

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
                // clipPath: "url(#flyerClipPath)", // Apply the custom clipPath
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
