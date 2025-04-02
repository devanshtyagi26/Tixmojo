import React, { useRef, useState, useEffect } from "react";
import { IoTicketOutline, IoCalendarOutline, IoSearchOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { MdOutlineLocalActivity, MdOutlineExplore } from "react-icons/md";
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
  const [activeLink, setActiveLink] = useState("home");

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

  const handleLinkClick = (linkName) => {
    setActiveLink(linkName);
    navigate("/page-not-found");
  };

  // New gradient colors for the navbar
  const gradientBg = "linear-gradient(to right, var(--purple-900), var(--accent-indigo))";
  const transparentBg = "transparent";

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
        background: scrolled ? gradientBg : transparentBg,
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(0, 0, 0, 0.2)" : "none",
        transition: "all 0.3s ease",
        position: "fixed",
        zIndex: 100,
        padding: "0 32px",
      }}
    >
      {/* Logo on the left */}
      <div className="nav-left" style={{ display: "flex", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <div style={{
            width: "40px",
            height: "40px",
            backgroundColor: "white",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginRight: "15px",
            boxShadow: "0 4px 12px rgba(111, 68, 255, 0.2)",
            transform: "rotate(-10deg)",
          }}>
            <IoTicketOutline style={{ color: "var(--primary)", fontSize: "24px" }} />
          </div>
          <h2 style={{
            fontWeight: "800",
            color: scrolled ? "white" : "var(--primary)",
            fontSize: isMobile ? "20px" : "26px",
            fontFamily: "Raleway, sans-serif",
            letterSpacing: "-0.5px",
            transition: "color 0.3s ease",
          }}>
            TIXMOJO
          </h2>
        </Link>
      </div>

      {/* Center navigation links - only visible on desktop */}
      {!isMobile && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
        }}>
          {[
            { name: "home", label: "Home", icon: <MdOutlineExplore /> },
            { name: "events", label: "Events", icon: <MdOutlineLocalActivity /> },
            { name: "calendar", label: "Calendar", icon: <IoCalendarOutline /> },
          ].map((link) => (
            <div
              key={link.name}
              onClick={() => handleLinkClick(link.name)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                color: scrolled ? "white" : "var(--dark)",
                backgroundColor: activeLink === link.name 
                  ? (scrolled ? "rgba(255, 255, 255, 0.15)" : "rgba(111, 68, 255, 0.1)")
                  : "transparent",
                transition: "all 0.3s ease",
                position: "relative",
              }}
              onMouseEnter={(e) => {
                if (activeLink !== link.name) {
                  e.currentTarget.style.backgroundColor = scrolled 
                    ? "rgba(255, 255, 255, 0.1)" 
                    : "rgba(111, 68, 255, 0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (activeLink !== link.name) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <span style={{ fontSize: "18px" }}>{link.icon}</span>
              <span style={{ fontWeight: activeLink === link.name ? "600" : "500" }}>
                {link.label}
              </span>
              {activeLink === link.name && (
                <span style={{
                  position: "absolute",
                  bottom: "5px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "20px",
                  height: "3px",
                  borderRadius: "3px",
                  backgroundColor: scrolled ? "white" : "var(--primary)",
                }}></span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Right section with search, user icon, and hamburger */}
      <div className="nav-right" style={{ 
        display: "flex", 
        alignItems: "center",
        gap: isMobile ? "14px" : "20px"
      }}>
        {/* Search bar */}
        <div 
          className="search-bar" 
          onClick={handleSearchClick}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: scrolled 
              ? "rgba(255, 255, 255, 0.15)" 
              : "rgba(111, 68, 255, 0.08)",
            borderRadius: "50px",
            padding: isMobile ? "8px 12px" : "10px 16px",
            width: isMobile ? "40px" : "240px",
            transition: "all 0.3s ease",
            cursor: "pointer",
            border: scrolled 
              ? "1px solid rgba(255, 255, 255, 0.2)" 
              : "1px solid transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = scrolled 
              ? "rgba(255, 255, 255, 0.2)" 
              : "rgba(111, 68, 255, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = scrolled 
              ? "rgba(255, 255, 255, 0.15)" 
              : "rgba(111, 68, 255, 0.08)";
          }}
        >
          <IoSearchOutline style={{ 
            color: scrolled ? "white" : "var(--primary)",
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
                color: scrolled ? "white" : "var(--dark)",
                "::placeholder": {
                  color: scrolled ? "rgba(255, 255, 255, 0.7)" : "var(--gray-medium)",
                },
              }}
            />
          )}
        </div>

        {/* My Tickets Button - only on desktop */}
        {!isMobile && (
          <button
            onClick={() => navigate("/page-not-found")}
            className="btn"
            style={{
              backgroundColor: scrolled 
                ? "white" 
                : "var(--accent-teal)",
              color: scrolled 
                ? "var(--primary)" 
                : "var(--dark)",
              border: "none",
              padding: "8px 16px",
              borderRadius: "30px",
              fontWeight: "600",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: scrolled 
                ? "0 4px 12px rgba(0, 0, 0, 0.15)" 
                : "0 4px 12px rgba(46, 235, 201, 0.25)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = scrolled 
                ? "0 6px 15px rgba(0, 0, 0, 0.2)" 
                : "0 6px 15px rgba(46, 235, 201, 0.35)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = scrolled 
                ? "0 4px 12px rgba(0, 0, 0, 0.15)" 
                : "0 4px 12px rgba(46, 235, 201, 0.25)";
            }}
          >
            <IoTicketOutline />
            My Tickets
          </button>
        )}

        {/* User icon */}
        <div 
          onClick={handleUserClick}
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            backgroundColor: scrolled 
              ? "rgba(255, 255, 255, 0.2)" 
              : "var(--purple-100)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.3s ease",
            border: isUserSidebarOpen 
              ? (scrolled ? "2px solid white" : "2px solid var(--primary)") 
              : "2px solid transparent",
            boxShadow: isUserSidebarOpen 
              ? "0 4px 15px rgba(111, 68, 255, 0.3)" 
              : "none",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = scrolled 
              ? "rgba(255, 255, 255, 0.3)" 
              : "var(--purple-200)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = scrolled 
              ? "rgba(255, 255, 255, 0.2)" 
              : "var(--purple-100)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <BiUser style={{ 
            color: scrolled ? "white" : "var(--primary)", 
            fontSize: "22px" 
          }} />
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
            scrolled={scrolled}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;