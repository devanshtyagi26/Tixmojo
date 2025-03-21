import React, { useRef, useState, useEffect } from "react";
import { IoIosSearch } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import Logo from "../assets/Logo";
import "../i18n";
import Hamburger from "./Hamburger";

const styles = {
  /* Navbar */
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100vw",
    height: "60px",
    left: "0",
    top: "0",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    background: "rgb(255, 255, 255)",
    overflow: "hidden",
  },
  /* TIXMOJO */

  /* Hamburger */
  hamburger: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    marginRight: "1rem",
  },
  hamburgerIcon: {
    height: "2rem",
    width: "2rem",
  },
  /* Search Bar */
  searchBar: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    width: "40%",
    height: "50%",
    background: "rgb(255, 255, 255)",
    boxSizing: "border-box",
    border: "1.5px solid rgb(0, 0, 0)",
    borderRadius: "30.08px",
    padding: "0 1rem",
    cursor: "pointer",
  },
  /* Search Input */
  searchInput: {
    width: "100%",
    height: "100%",
    border: "none",
    outline: "none",
    fontSize: "1rem",
    fontWeight: "400",
    lineHeight: "1.5rem",
    letterSpacing: "0%",
    textAlign: "left",
    color: "rgb(0, 0, 0, 0.5)",
  },
  /* Search Icon */
  searchIcon: {
    height: "1.5rem",
    width: "1.5rem",
  },
  /* User Icon */
  userIcon: {
    height: "2rem",
    width: "2rem",
    cursor: "pointer",
  },
  /* User */
  user: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginRight: "1rem",
  },

  /* User Container */
  userContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
  },

  // Mobile User
  userIconMobile: {
    display: "none",
  },
  searchBarMobile: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "0.5rem",
    width: "55%",
    height: "50%",
    background: "rgb(255, 255, 255)",
    boxSizing: "border-box",
    border: "1.5px solid rgb(0, 0, 0)",
    borderRadius: "30.08px",
    padding: "0 1rem",
    cursor: "pointer",
    marginLeft: "1rem",
  },
};

function Navbar({ toggleScrollPage }) {
  const { t } = useTranslation();
  const inputRef = useRef(null);

  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav style={styles.nav}>
      <Logo isMobile={isMobile} />

      {isMobile ? (
        <div style={styles.searchBarMobile} onClick={handleDivClick}>
          <IoIosSearch style={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("navbar.search")}
            style={styles.searchInput}
          />
        </div>
      ) : (
        <div style={styles.searchBar} onClick={handleDivClick}>
          <IoIosSearch style={styles.searchIcon} />
          <input
            ref={inputRef}
            type="text"
            placeholder={t("navbar.search")}
            style={styles.searchInput}
          />
        </div>
      )}

      <div style={styles.userContainer}>
        {isMobile ? (
          <div style={styles.userMobile}>
            <BiUser style={styles.userIconMobile} />
          </div>
        ) : (
          <div style={styles.user}>
            <BiUser style={styles.userIcon} />
          </div>
        )}
        <div style={styles.hamburger}>
          <Hamburger onToggle={toggleScrollPage} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
