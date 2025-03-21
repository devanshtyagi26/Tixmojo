import { BiBuoy } from "react-icons/bi";
import { HiArrowSmRight, HiChartPie } from "react-icons/hi";
import { PiListHeartBold } from "react-icons/pi";
import { HiOutlineInformationCircle, HiOutlinePhone } from "react-icons/hi";
import "../Style/sidebarAnimation.css";

const styles = {
  sidebar: {
    width: "250px",
    height: "70vh",
    backgroundColor: "#f8f9fa",
    boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    position: "absolute",
    right: "0",
    top: "calc(60px - 10px)",
    zIndex: "1000",
    fontFamily: "Poppins",
    borderRadius: "13px",
    border: "1px solid #e2e6ea",
    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
    background: "rgb(255, 255, 255)",
  },
  itemGroup: {
    marginBottom: "20px",
  },
  item: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    borderRadius: "5px",
    transition: "background 0.3s ease",
  },
  icon: {
    marginRight: "10px",
    fontSize: "20px",
  },
  itemHover: {
    background: "#e2e6ea",
  },
  divider: {
    width: "100%",
    height: "1px",
    backgroundColor: "#e2e6ea",
  },
  overlay: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: "999",
  },
};

export function SidebarScroll({ toggleScrollPage }) {
  const handleClick = () => {
    toggleScrollPage();
  };

  return (
    <>
      <div style={styles.overlay} onClick={handleClick}></div>
      <div style={styles.sidebar} className="slide-in">
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
