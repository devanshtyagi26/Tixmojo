import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MdNavigateBefore, MdNavigateNext } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { IoLocationOutline } from "react-icons/io5";

// Custom Previous Button
const CustomPrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="navigation-btn"
    style={{
      position: "absolute",
      left: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
    }}
  >
    <MdNavigateBefore size={24} />
  </button>
);

// Custom Next Button
const CustomNextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="navigation-btn"
    style={{
      position: "absolute",
      right: "20px",
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 10,
    }}
  >
    <MdNavigateNext size={24} />
  </button>
);

function FlyerCarousel() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    beforeChange: (current, next) => setActiveSlide(next),
    customPaging: i => (
      <div
        style={{
          width: "12px",
          height: "12px",
          background: i === activeSlide ? "var(--primary)" : "rgba(107, 56, 251, 0.2)",
          borderRadius: "50%",
          transition: "all 0.3s ease",
          margin: "0 5px",
        }}
      />
    ),
  };

  // Updated flyer data with more engaging content
  const flyers = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
      title: "EDM Summer Fest 2025",
      description: "The biggest electronic dance music festival of the year",
      date: "15 Jun - 17 Jun",
      location: "Sydney Olympic Park",
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2940&auto=format&fit=crop",
      title: "Jazz Nights Under the Stars",
      description: "An unforgettable evening of smooth jazz and fine dining",
      date: "22 May",
      location: "Sydney Opera House",
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
      title: "Rock Legends Reunion",
      description: "The iconic bands reunite for one spectacular night",
      date: "30 Apr",
      location: "Sydney Entertainment Centre",
    },
  ];

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Discover Events Near You</h1>
        <p className="hero-subtitle">
          Find the best concerts, festivals, and performances happening in your city
        </p>
        
        <div className="hero-search">
          <IoIosSearch className="hero-search-icon" />
          <input 
            type="text" 
            placeholder="Search events, artists, or venues..." 
          />
        </div>
      </div>
      
      <div
        style={{
          width: "100%",
          maxWidth: "1500px",
          height: "100%", 
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          opacity: 0.15,
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <Slider {...settings}>
          {flyers.map((flyer) => (
            <div key={flyer.id}>
              <img
                src={flyer.image}
                alt={`Flyer ${flyer.id}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          ))}
        </Slider>
      </div>
      
      <div
        style={{
          position: "absolute",
          bottom: "-100px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1200px",
          zIndex: 5,
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            overflow: "hidden",
            justifyContent: "center",
          }}
        >
          {flyers.map((flyer) => (
            <FeaturedCard 
              key={flyer.id}
              image={flyer.image}
              title={flyer.title}
              description={flyer.description}
              date={flyer.date}
              location={flyer.location}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FeaturedCard({ image, title, description, date, location }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="recommended-card"
      style={{
        maxWidth: "350px",
        display: window.innerWidth <= 768 ? (title === "Jazz Nights Under the Stars" ? "none" : "block") : "block",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="recommended-badge">Featured</div>
      <div className="recommended-image">
        <img src={image} alt={title} />
      </div>
      <div className="recommended-content">
        <h3 className="recommended-title">{title}</h3>
        <p style={{ 
          fontSize: "14px", 
          color: "var(--gray-medium)", 
          marginBottom: "15px",
          lineHeight: 1.4,
        }}>
          {description}
        </p>
        <div className="recommended-info">
          <span className="recommended-icon">📅</span>
          {date}
        </div>
        <div className="recommended-info">
          <IoLocationOutline className="recommended-icon" />
          {location}
        </div>
        
        <button 
          className="btn btn-primary"
          style={{ 
            marginTop: "15px",
            width: "100%",
            transform: isHovered ? "translateY(-5px)" : "translateY(0)",
            transition: "transform 0.3s ease",
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}

export default FlyerCarousel;