import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext, MdCalendarToday, MdLocationOn } from "react-icons/md"; 
import { useNavigate } from "react-router-dom";

// Custom Previous Button
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(255, 255, 255, 0.9)",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 12px rgba(111, 68, 255, 0.2)",
      width: "50px",
      height: "50px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "26px",
      color: "var(--primary)",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "var(--primary)";
      e.currentTarget.style.color = "white";
      e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
      e.currentTarget.style.color = "var(--primary)";
      e.currentTarget.style.transform = "translateY(-50%)";
    }}
  >
    <MdNavigateBefore />
  </button>
);

// Custom Next Button
const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
      background: "rgba(255, 255, 255, 0.9)",
      border: "none",
      borderRadius: "50%",
      boxShadow: "0 4px 12px rgba(111, 68, 255, 0.2)",
      width: "50px",
      height: "50px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "26px",
      color: "var(--primary)",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = "var(--primary)";
      e.currentTarget.style.color = "white";
      e.currentTarget.style.transform = "translateY(-50%) scale(1.1)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
      e.currentTarget.style.color = "var(--primary)";
      e.currentTarget.style.transform = "translateY(-50%)";
    }}
  >
    <MdNavigateNext />
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
    speed: 700, // Transition speed
    slidesToShow: 1, // Number of slides to show
    slidesToScroll: 1, // Number of slides to scroll
    autoplay: true, // Enable autoplay
    autoplaySpeed: 5000, // Autoplay interval
    arrows: true, // Enable custom arrows
    prevArrow: <CustomPrevArrow />, // Custom previous button
    nextArrow: <CustomNextArrow />, // Custom next button
    fade: true, // Use fade transition
    cssEase: "cubic-bezier(0.7, 0, 0.3, 1)", // Custom easing
    dotsClass: "slick-dots custom-dots",
    appendDots: dots => (
      <div style={{ 
        position: "absolute", 
        bottom: "20px",
        left: "50%", 
        transform: "translateX(-50%)",
        padding: "10px",
        borderRadius: "30px",
        background: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(5px)",
        margin: "0",
      }}>
        <ul style={{ 
          margin: "0", 
          padding: "0 10px",
          display: "flex",
          gap: "8px",
        }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div style={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        background: "rgba(255, 255, 255, 0.5)",
        cursor: "pointer",
        transition: "all 0.3s ease",
      }}/>
    ),
  };

  const flyers = [
    {
      id: 1,
      title: "Dance Night Festival",
      date: "20 Apr",
      location: "Marina Bay Sands, Sydney",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    },
    {
      id: 2,
      title: "Jazz & Blues Experience",
      date: "25 Apr",
      location: "Opera House, Sydney",
      image:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2940&auto=format&fit=crop",
    },
    {
      id: 3,
      title: "Rock Legends Tour",
      date: "02 May",
      location: "Olympic Park, Sydney",
      image:
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
    },
  ];

  return (
    <div
      style={{
        width: "100%", // Fit to width
        maxWidth: "1200px", // Increased size while maintaining the aspect ratio
        margin: "0 auto",
        padding: "40px 20px",
        position: "relative",
      }}
    >
      <Slider {...settings}>
        {flyers.map((flyer) => (
          <div key={flyer.id} style={{ position: "relative" }}>
            <div style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              background: "linear-gradient(0deg, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 40%, rgba(0, 0, 0, 0.2) 100%)",
              borderRadius: "16px",
              zIndex: 2,
            }}></div>
            
            <img
              className="flyerimage"
              onClick={() => navigate("/page-not-found")}
              src={flyer.image}
              alt={`${flyer.title}`}
              style={{
                width: "100%", // Fit the width of the container
                height: windowWidth <= 768 ? "300px" : "450px", // Fixed height for better proportions
                objectFit: "cover",
                borderRadius: "16px",
                transition: "transform 1s cubic-bezier(0.25, 1, 0.5, 1)",
              }}
            />
            
            <div style={{
              position: "absolute",
              bottom: "40px",
              left: "40px",
              zIndex: 3,
              color: "white",
              textAlign: "left",
              maxWidth: "70%",
            }}>
              <h2 style={{
                fontSize: windowWidth <= 768 ? "28px" : "40px",
                fontWeight: "800",
                marginBottom: "20px",
                textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}>
                {flyer.title}
              </h2>
              
              <div style={{
                display: "flex",
                gap: "20px",
                marginBottom: "30px",
                fontSize: "16px",
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <MdCalendarToday />
                  <span>{flyer.date}</span>
                </div>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  <MdLocationOn />
                  <span>{flyer.location}</span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  navigate("/page-not-found");
                }}
                style={{
                  background: "var(--primary)",
                  color: "white",
                  border: "none",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 15px rgba(111, 68, 255, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--primary-dark)";
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(111, 68, 255, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--primary)";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 15px rgba(111, 68, 255, 0.3)";
                }}
              >
                Get Tickets
              </button>
            </div>
          </div>
        ))}
      </Slider>
      
      {/* Custom dots styling for active dot */}
      <style>
        {`
          .custom-dots .slick-active div {
            background: white !important;
            transform: scale(1.3);
          }
          
          @media (max-width: 768px) {
            .custom-dots {
              bottom: 10px !important;
            }
          }
        `}
      </style>
    </div>
  );
}

export default FlyerCarousel;
