import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PageSEO } from "../utils/SEO.jsx";
import "../i18n";
import { getPageNotFound } from "../services/api";

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
  const [pageNotFoundData, setPageNotFoundData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageNotFoundData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPageNotFound();
        setPageNotFoundData(data);
      } catch (error) {
        console.error("Error fetching page not found data:", error);
        setError("Failed to load Page Not Found information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageNotFoundData();
  }, []);


  const { t, i18n } = useTranslation();
  // Loading state
  if (isLoading) {
    return (
      <>
        <PageSEO
          title="Contact Us | TixMojo"
          description="Reach out to the TixMojo team for questions, feedback, or support. We're here to help!"
          canonicalPath="/contact"
        />
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          paddingTop: "90px"
        }}>
          <div style={{
            fontSize: "1.2rem",
            color: "var(--primary)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "3px solid var(--primary)",
                borderTopColor: "transparent",
                marginBottom: "1rem",
                animation: "spin 1s linear infinite"
              }}
            />
            <style>
              {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
            </style>
            Loading...
          </div>
        </div>
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <PageSEO
          title="Contact Us | TixMojo"
          description="Reach out to the TixMojo team for questions, feedback, or support. We're here to help!"
          canonicalPath="/contact"
        />
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
          paddingTop: "90px",
          textAlign: "center"
        }}>
          <div style={{
            fontSize: "1.2rem",
            color: "#e53935",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: "500px",
            padding: "2rem",
            borderRadius: "8px",
            background: "#ffebee",
            border: "1px solid #ffcdd2"
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="#e53935">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p style={{ marginTop: "1rem" }}>{error}</p>
            <button
              onClick={() => window.location.reload()}
              style={{
                marginTop: "1.5rem",
                background: "var(--primary)",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(111, 68, 255, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <PageSEO
        title="Page Not Found"
        description="The page you are looking for could not be found. Navigate back to our home page to find events and tickets."
        path="/page-not-found"
        noindex={true}
      />
      <div style={styles.container}>
        <h1 style={styles.h1}>{pageNotFoundData?.title}</h1>
        <p style={styles.p}>{pageNotFoundData?.message}</p>
        <Link to="/" style={styles.link}>
          {pageNotFoundData?.redirect}
        </Link>
      </div>
    </>
  );
}

export default PageNotFound;
