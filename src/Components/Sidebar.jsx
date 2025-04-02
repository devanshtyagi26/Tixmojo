import { BiBuoy } from "react-icons/bi";
import { HiArrowSmRight, HiChartPie } from "react-icons/hi";
import { PiListHeartBold } from "react-icons/pi";
import { HiOutlineInformationCircle, HiOutlinePhone } from "react-icons/hi";
import "../Style/sidebarAnimation.css";
import { useEffect } from "react";

const styles = {
  sidebar: {
    width: "250px",
    height: "70vh",
    backgroundColor: "var(--purple-50)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    position: "fixed",
    right: "0",
    top: "calc(90px - 10px)",
    zIndex: "1000",
    fontFamily: "Poppins",
    borderRadius: "13px",
    border: "1px solid var(--purple-100)",
    boxShadow: "0px 4px 4px 0px rgba(111, 68, 255, 0.1)",
    background: "var(--light)",
  },
  itemGroup: {
    marginBottom: "20px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    textDecoration: "none",
    color: "var(--neutral-800)",
    fontSize: "16px",
    borderRadius: "5px",
    transition: "background 0.3s ease",
  },
  icon: {
    marginRight: "10px",
    fontSize: "20px",
  },
  itemHover: {
    background: "var(--purple-100)",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "var(--purple-100)",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(22, 22, 43, 0.5)",
    zIndex: "999",
  },
};

export function SidebarScroll({ toggleScrollPage, isSidebarOpen }) {
  const handleClick = () => {
    toggleScrollPage();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        toggleScrollPage();
      }
    };

    if (isSidebarOpen) {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.add("slide-in");
      sidebar.classList.remove("slide-out");
      document.addEventListener("keydown", handleKeyDown);
    } else {
      const sidebar = document.getElementById("sidebar");
      sidebar.classList.remove("slide-in");
      sidebar.classList.add("slide-out");
      document.removeEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isSidebarOpen, toggleScrollPage]);

  return (
    <>
      <div style={styles.overlay} onClick={handleClick}></div>
      <div style={styles.sidebar} id="sidebar">
        <div style={styles.itemGroup}>
          <a href="#" style={styles.item}>
            <HiChartPie style={styles.icon} /> Dashboard
          </a>
          <a href="#" style={styles.item}>
            <HiArrowSmRight style={styles.icon} /> Sign In
          </a>
        </div>
        <span style={styles.divider}></span>
        <div style={styles.itemGroup}>
          <a href="#" style={styles.item}>
            <PiListHeartBold style={styles.icon} /> List With Us
          </a>
          <a href="#" style={styles.item}>
            <HiOutlineInformationCircle style={styles.icon} /> About Us
          </a>
          <a href="#" style={styles.item}>
            <HiOutlinePhone style={styles.icon} /> Contact Us
          </a>
          <a href="#" style={styles.item}>
            <BiBuoy style={styles.icon} /> Help
          </a>
        </div>
      </div>
    </>
  );
}
