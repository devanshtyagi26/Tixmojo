import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function HeroSection() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchQuery}`);
    navigate("/page-not-found");
  };

  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: "85vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundImage: "url(https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2940&auto=format&fit=crop)",
      backgroundSize: "cover",
      backgroundPosition: "center",
      marginTop: "70px",
      padding: "0 20px",
    }}>
      {/* Overlay with gradient */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "linear-gradient(to bottom, rgba(22, 22, 43, 0.8) 0%, rgba(111, 68, 255, 0.6) 100%)",
        backdropFilter: "blur(2px)",
        zIndex: 1,
      }} />
      
      {/* Content */}
      <div style={{
        position: "relative",
        zIndex: 2,
        maxWidth: "800px",
        textAlign: "center",
      }}>
        <h1 style={{
          fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
          fontWeight: "800",
          color: "white",
          marginBottom: "20px",
          lineHeight: "1.1",
          textShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
          letterSpacing: "-1px",
        }}>
          Discover Incredible Events
        </h1>
        
        <p style={{
          fontSize: "clamp(1.1rem, 2vw, 1.4rem)",
          color: "white",
          marginBottom: "40px",
          maxWidth: "700px",
          fontWeight: "500",
          lineHeight: "1.5",
          opacity: 0.9,
        }}>
          Find the best local experiences, concerts, workshops and more - all in one place
        </p>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} style={{
          width: "100%",
          maxWidth: "600px",
          margin: "0 auto",
          position: "relative",
        }}>
          <input
            type="text"
            placeholder="Search events, artists or venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "18px 24px 18px 60px",
              borderRadius: "50px",
              border: "2px solid rgba(255, 255, 255, 0.2)",
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              fontSize: "16px",
              fontWeight: "500",
              boxShadow: "0 10px 30px rgba(111, 68, 255, 0.25)",
              outline: "none",
              transition: "all 0.3s ease",
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = "0 10px 30px rgba(111, 68, 255, 0.4)";
              e.target.style.border = "2px solid var(--primary)";
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = "0 10px 30px rgba(111, 68, 255, 0.25)";
              e.target.style.border = "2px solid rgba(255, 255, 255, 0.2)";
            }}
          />
          <IoIosSearch style={{
            position: "absolute",
            left: "24px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--primary)",
            fontSize: "24px",
          }} />
          
          <button type="submit" style={{
            position: "absolute",
            right: "8px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "var(--primary)",
            color: "white",
            border: "none",
            borderRadius: "50px",
            padding: "10px 24px",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "var(--primary-dark)";
            e.target.style.transform = "translateY(-50%) scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "var(--primary)";
            e.target.style.transform = "translateY(-50%) scale(1)";
          }}
          >
            Search
          </button>
        </form>
        
        {/* Tags */}
        <div style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "10px",
          marginTop: "25px",
        }}>
          {["Concerts", "Festivals", "Workshops", "Sports", "Art", "Food"].map((tag) => (
            <div key={tag} 
              onClick={() => navigate("/page-not-found")}
              style={{
                background: "rgba(255, 255, 255, 0.2)",
                backdropFilter: "blur(10px)",
                border: "1px solid rgba(255, 255, 255, 0.3)",
                borderRadius: "50px",
                padding: "8px 16px",
                fontSize: "14px",
                color: "white",
                fontWeight: "500",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.3)";
                e.target.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "rgba(255, 255, 255, 0.2)";
                e.target.style.transform = "translateY(0)";
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
      
      {/* Bottom gradient shadow */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "150px",
        background: "linear-gradient(to top, rgba(248, 245, 255, 1) 0%, rgba(248, 245, 255, 0) 100%)",
        zIndex: 1,
      }} />
    </div>
  );
}

export default HeroSection;