import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";
import { Link } from "react-router-dom";
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100vw",
    backgroundColor: "#f8f9fa",
  },
  h1: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  p: {
    fontSize: "1.5rem",
    color: "#333",
    textAlign: "center",
  },
  link: {
    textDecoration: "none",
    color: "white",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: "bold",
    backgroundColor: "#333",
    padding: "10px 20px",
    borderRadius: "5px",
  },
};
function PageNotFound() {
  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.h1}>PageNotFound Page</h1>
        <p style={styles.p}>The page you are looking for does not exist.</p>
        <Link to="/" style={styles.link}>
          Go to Home
        </Link>
      </div>
    </>
  );
}

export default PageNotFound;
