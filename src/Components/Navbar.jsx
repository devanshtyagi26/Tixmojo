import React, { useRef, useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import "../i18n";
import Hamburger from "./Hamburger";

function Navbar({ toggleScrollPage, isSidebarOpen, toggleUserSidebar, isUserSidebarOpen }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  const handleUserClick = () => {
    if (toggleUserSidebar) {
      toggleUserSidebar();
    } else {
      navigate("/page-not-found");
    }
  };

  return (
    <nav 
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: "60px",
        left: "0",
        top: "0",
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: "0 4px 20px rgba(111, 68, 255, 0.1)",
        transition: "all 0.3s ease",
        position: "fixed",
        zIndex: 100,
        padding: "0 32px",
      }}
    >
      {/* Logo on the left */}
      <div className="nav-left" style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{
          fontWeight: "800",
          color: "var(--primary)",
          fontSize: isMobile ? "20px" : "26px",
          fontFamily: "Raleway, sans-serif",
          letterSpacing: "-0.5px"
        }}>
          TIXMOJO
        </h2>
      </div>

      {/* Right section with search, user icon, and hamburger */}
      <div className="nav-right" style={{ 
        display: "flex", 
        alignItems: "center",
        gap: isMobile ? "12px" : "20px"
      }}>
        {/* Search bar */}
        <div 
          className="search-bar" 
          onClick={handleSearchClick}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(111, 68, 255, 0.08)",
            borderRadius: "50px",
            padding: isMobile ? "8px 12px" : "10px 16px",
            width: isMobile ? "40px" : "240px",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
        >
          <IoIosSearch style={{ 
            color: "var(--primary)",
            fontSize: "20px",
            marginRight: isMobile ? "0" : "8px",
          }} />
          
          {!isMobile && (
            <input
              ref={inputRef}
              type="text"
              placeholder={t("navbar.search")}
              style={{
                border: "none",
                background: "transparent",
                outline: "none",
                fontSize: "14px",
                width: "100%",
                color: "var(--dark)",
              }}
            />
          )}
        </div>

        {/* User icon */}
        <div 
          onClick={handleUserClick}
          style={{
            width: "38px",
            height: "38px",
            borderRadius: "50%",
            backgroundColor: "var(--purple-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--purple-200)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--purple-100)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <BiUser style={{ color: "var(--primary)", fontSize: "22px" }} />
        </div>

        {/* Hamburger menu */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <Hamburger
            onToggle={toggleScrollPage}
            isSidebarOpen={isSidebarOpen}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;