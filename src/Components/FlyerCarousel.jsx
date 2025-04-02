import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore } from "react-icons/md"; // Importing the left arrow icon
import { MdNavigateNext } from "react-icons/md"; // Importing the right arrow icon
import { useNavigate } from "react-router-dom";

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
      background: "var(--light)",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 8px rgba(111, 68, 255, 0.15)",
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
        backgroundColor: "var(--purple-200)",
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
        backgroundColor: "var(--surface)",
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
      background: "var(--surface)",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 8px rgba(111, 68, 255, 0.15)",
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
        backgroundColor: "var(--purple-200)",
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
        backgroundColor: "var(--surface)",
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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2940&auto=format&fit=crop",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
    },
  ];

  return (
    <div
      style={{
        width: "100%", // Fit to width
        maxWidth: "1500px", // Increased size while maintaining the aspect ratio
        margin: "0 auto",
        marginTop: "90px", // Add top margin to account for navbar height
        padding: "20px",
      }}
    >
      <Slider {...settings}>
        {flyers.map((flyer) => (
          <div key={flyer.id}>
            <img
              className="flyerimage"
              onClick={() => navigate("/page-not-found")}
              src={flyer.image}
              alt={`Flyer ${flyer.id}`}
              style={{
                width: "100%", // Fit the width of the container
                height: "auto", // Maintain aspect ratio
                aspectRatio: windowWidth <= 768 ? "3/2" : "945 / 256", // Enforce the aspect ratio
                borderRadius: "10px",
                transition: "transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)", // Add cubic-bezier animation
                boxShadow: "0 4px 8px rgba(111, 68, 255, 0.15)",
              }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default FlyerCarousel;
