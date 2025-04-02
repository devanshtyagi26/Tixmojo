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
        height: "70px",
        left: "0",
        top: "0",
        background: scrolled ? "rgba(255, 255, 255, 0.98)" : "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(12px)",
        boxShadow: scrolled ? "0 4px 20px rgba(111, 68, 255, 0.1)" : "none",
        transition: "all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)",
        position: "fixed",
        zIndex: 100,
        padding: "0 32px",
        borderBottom: "1px solid",
        borderColor: scrolled ? "rgba(111, 68, 255, 0.08)" : "transparent",
      }}
    >
      {/* Logo on the left */}
      <div className="nav-left" style={{ display: "flex", alignItems: "center" }}>
        <h2 style={{
          fontWeight: "800",
          color: "var(--primary)",
          fontSize: isMobile ? "20px" : "24px",
          fontFamily: "Inter, sans-serif",
          letterSpacing: "-0.5px"
        }}>
          TIXMOJO
        </h2>
      </div>

      {/* Right section with search, user icon, and hamburger */}
      <div className="nav-right" style={{ 
        display: "flex", 
        alignItems: "center",
        gap: isMobile ? "12px" : "16px"
      }}>
        {/* Search bar */}
        <div 
          className="search-bar" 
          onClick={handleSearchClick}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(111, 68, 255, 0.06)",
            borderRadius: "12px",
            padding: isMobile ? "8px 12px" : "10px 14px",
            width: isMobile ? "40px" : "220px",
            transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
            cursor: "pointer",
            border: "1px solid",
            borderColor: "rgba(111, 68, 255, 0.1)",
            boxShadow: "0 2px 6px rgba(111, 68, 255, 0.04)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(111, 68, 255, 0.08)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(111, 68, 255, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(111, 68, 255, 0.06)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(111, 68, 255, 0.04)";
          }}
        >
          <IoIosSearch style={{ 
            color: "var(--primary)",
            fontSize: "18px",
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
                fontFamily: "Inter, sans-serif",
              }}
            />
          )}
        </div>

        {/* User icon */}
        <div 
          onClick={handleUserClick}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "12px",
            backgroundColor: "rgba(111, 68, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
            border: "1px solid",
            borderColor: "rgba(111, 68, 255, 0.1)",
            boxShadow: "0 2px 6px rgba(111, 68, 255, 0.04)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(111, 68, 255, 0.08)";
            e.currentTarget.style.boxShadow = "0 2px 8px rgba(111, 68, 255, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(111, 68, 255, 0.06)";
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(111, 68, 255, 0.04)";
          }}
        >
          <BiUser style={{ color: "var(--primary)", fontSize: "20px" }} />
        </div>

        {/* Hamburger menu */}
        <div style={{
          width: "40px",
          height: "40px",
          borderRadius: "12px",
          backgroundColor: "rgba(111, 68, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)",
          border: "1px solid",
          borderColor: "rgba(111, 68, 255, 0.1)",
          boxShadow: "0 2px 6px rgba(111, 68, 255, 0.04)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(111, 68, 255, 0.08)";
          e.currentTarget.style.boxShadow = "0 2px 8px rgba(111, 68, 255, 0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(111, 68, 255, 0.06)";
          e.currentTarget.style.boxShadow = "0 2px 6px rgba(111, 68, 255, 0.04)";
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