import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../i18n";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "80vh",
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
    margin: "40px 0",
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
  const { t, i18n } = useTranslation();
  return (
    <>
      <div style={styles.container}>
        <h1 style={styles.h1}>{t("pageNotFound.title")}</h1>
        <p style={styles.p}>{t("pageNotFound.message")}</p>
        <Link to="/" style={styles.link}>
          {t("pageNotFound.redirect")}
        </Link>
      </div>
    </>
  );
}

export default PageNotFound;
