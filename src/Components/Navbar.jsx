import React, { useRef, useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { TbTicket } from "react-icons/tb";
import { useTranslation } from "react-i18next";
import "../i18n";
import Hamburger from "./Hamburger";

function Navbar({ toggleScrollPage, isSidebarOpen }) {
  const { t } = useTranslation();
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
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: scrolled ? "0 4px 20px rgba(111, 68, 255, 0.1)" : "none",
        transition: "all 0.3s ease",
        position: "fixed",
        zIndex: 100,
        padding: "0 32px",
      }}
    >
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
        
        {!isMobile && (
          <div className="nav-links" style={{ 
            display: "flex", 
            marginLeft: "40px", 
            gap: "24px"
          }}>
            <NavLink active={true}>Events</NavLink>
            <NavLink>Venues</NavLink>
            <NavLink>Artists</NavLink>
            <NavLink>Promoters</NavLink>
          </div>
        )}
      </div>

      <div className="nav-right" style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: isMobile ? "16px" : "24px" 
      }}>
        <div 
          className="search-bar" 
          onClick={handleSearchClick}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "rgba(111, 68, 255, 0.08)",
            borderRadius: "50px",
            padding: isMobile ? "8px 12px" : "10px 16px",
            width: isMobile ? "40px" : "200px",
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

        {!isMobile && (
          <button className="btn btn-outline" style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "8px",
            padding: "8px 16px",
          }}>
            <TbTicket />
            My Tickets
          </button>
        )}


        <div 
          onClick={toggleScrollPage}
          style={{ 
            width: "40px", 
            height: "40px", 
            borderRadius: "50%", 
            backgroundColor: isSidebarOpen ? "var(--primary)" : "var(--primary-light)", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
            boxShadow: isSidebarOpen ? "0 2px 10px rgba(111, 68, 255, 0.25)" : "none",
          }}
        >
          <BiUser style={{ color: "white", fontSize: "20px" }} />
        </div>

        <div style={{
          display: isMobile ? "flex" : "none",
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

function NavLink({ children, active }) {
  return (
    <a 
      href="#"
      style={{
        color: active ? "var(--primary)" : "var(--dark)",
        fontWeight: active ? "600" : "500",
        fontSize: "15px",
        textDecoration: "none",
        position: "relative",
        padding: "4px 0",
        transition: "all 0.3s ease",
      }}
    >
      {children}
      {active && (
        <span style={{
          position: "absolute",
          bottom: "-2px",
          left: "0",
          width: "100%",
          height: "3px",
          background: "var(--primary)",
          borderRadius: "2px",
        }}></span>
      )}
    </a>
  );
}

export default Navbar;