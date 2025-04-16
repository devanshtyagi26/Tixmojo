import React from "react";
import { Link } from "react-router-dom";
import {
  IoLogoFacebook,
  IoLogoTwitter,
  IoLogoInstagram
} from "react-icons/io5";
import { FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { getFooter } from "../services/api";
import { useState, useEffect } from "react";

// Map of icon names to actual icon components
const iconMap = {
  IoLogoFacebook: <IoLogoFacebook />,
  IoLogoTwitter: <IoLogoTwitter />,
  IoLogoInstagram: <IoLogoInstagram />,
  FaLinkedinIn: <FaLinkedinIn />,
  FaYoutube: <FaYoutube />,
  FiMail: <FiMail />,
  FiPhone: <FiPhone />,
  FiMapPin: <FiMapPin />,
};

function Footer() {
  const [footerData, setFooterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getFooter();
        setFooterData(data);
      } catch (error) {
        console.error("Error fetching about us data:", error);
        setError("Failed to load About Us information. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  const { t } = useTranslation();
  const year = new Date().getFullYear();

  // Get footer data from translation
  const socialNetworks = footerData?.social?.networks;
  const categories = footerData?.categories?.list;

  // Contact information
  const contactInfo = [
    {
      icon: "FiMapPin",
      text: footerData?.contact?.address,
    },
    {
      icon: "FiPhone",
      text: footerData?.contact?.redirects?.one,
    },
    {
      icon: "FiMail",
      text: footerData?.contact?.redirects?.two,
    },
  ];

  // Quick links
  const quickLinks = [
    footerData?.information?.redirects?.one,
    footerData?.information?.redirects?.two,
    footerData?.information?.redirects?.three,
    footerData?.links?.redirects?.one,
    footerData?.links?.redirects?.two,
    footerData?.links?.redirects?.three,
    footerData?.otherLinks?.contactUs,
  ];
  // Loading state
  if (isLoading) {
    return (
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
    );
  }

  // Error state
  if (error) {
    return (
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
    );
  }

  return (
    <footer
      style={{
        backgroundColor: "var(--dark)",
        color: "var(--light)",
        padding: "60px 0 30px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "40px",
            marginBottom: "50px",
          }}
        >
          {/* Company Name and About Us */}
          <div>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "800",
                fontFamily: "var(--font-primary)",
                color: "white",
                marginBottom: "20px",
              }}
            >
              TIXMOJO
            </h2>

            <p
              style={{
                fontSize: "14px",
                lineHeight: "1.6",
                color: "var(--gray-light)",
                marginBottom: "20px",
              }}
            >
              {footerData?.about}
            </p>

            <div
              style={{
                display: "flex",
                gap: "15px",
              }}
            >
              {socialNetworks.map((social, index) => (
                <Link
                  key={index}
                  to="/page-not-found"
                  aria-label={social.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    backgroundColor: "var(--gray-dark)",
                    color: "var(--gray-light)",
                    fontSize: "18px",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--primary)";
                    e.currentTarget.style.color = "var(--light)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--gray-dark)";
                    e.currentTarget.style.color = "var(--gray-light)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {iconMap[social.icon]}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "white",
              }}
            >
              {footerData?.otherLinks?.title}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {quickLinks.map((link, index) => {
                let linkPath = "/page-not-found";

                // Set proper paths for privacy policy and terms pages
                if (link === "footer.links.redirects.two") {
                  linkPath = "/privacy-policy";
                } else if (link === "footer.links.redirects.one") {
                  linkPath = "/terms-conditions";
                } else if (link === "footer.information.redirects.one") {
                  linkPath = "/about-us";
                } else if (link === "footer.otherLinks.contactUs") {
                  linkPath = "/contact";
                }

                return (
                  <li key={index} style={{ marginBottom: "12px" }}>
                    <Link
                      to={linkPath}
                      style={{
                        color: "var(--gray-light)",
                        textDecoration: "none",
                        fontSize: "14px",
                        display: "inline-block",
                        position: "relative",
                        paddingLeft: "15px",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--primary-light)";
                        e.currentTarget.style.paddingLeft = "20px";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--gray-light)";
                        e.currentTarget.style.paddingLeft = "15px";
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "0",
                          top: "50%",
                          transform: "translateY(-50%)",
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: "var(--primary)",
                        }}
                      ></span>
                      {t(link)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Event Categories */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "white",
              }}
            >
              {footerData?.categories?.title}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
              }}
            >
              {categories.map((category, index) => (
                <li key={index}>
                  <Link
                    to="/page-not-found"
                    style={{
                      color: "var(--gray-light)",
                      textDecoration: "none",
                      fontSize: "14px",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--primary-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--gray-light)";
                    }}
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "white",
              }}
            >
              {footerData?.contact?.title}
            </h3>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              {contactInfo.map((contact, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "15px",
                    gap: "10px",
                  }}
                >
                  <span
                    style={{
                      color: "var(--primary)",
                      fontSize: "18px",
                      marginTop: "2px",
                    }}
                  >
                    {iconMap[contact.icon]}
                  </span>
                  <Link
                    to="/page-not-found"
                    style={{
                      color: "var(--gray-light)",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--primary-light)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "var(--gray-light)";
                    }}
                  >
                    {contact.text}
                  </Link>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: "20px" }}>
              <h4
                style={{
                  fontSize: "15px",
                  fontWeight: "600",
                  marginBottom: "15px",
                  color: "white",
                }}
              >
                {footerData?.newsletter?.title}
              </h4>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                }}
              >
                <input
                  type="email"
                  placeholder={footerData?.newsletter?.placeholder}
                  style={{
                    flex: 1,
                    padding: "10px 15px",
                    borderRadius: "50px",
                    border: "1px solid var(--gray-dark)",
                    backgroundColor: "var(--gray-dark)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                  }}
                />
                <button
                  className="btn btn-primary"
                  style={{
                    margin: 0,
                    height: "40px",
                    padding: "0 20px",
                  }}
                >
                  {footerData?.newsletter?.button}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div
          style={{
            borderTop: "1px solid var(--gray-dark)",
            paddingTop: "20px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              color: "var(--gray-light)",
              fontSize: "14px",
            }}
          >
            {footerData?.copyright}
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
            }}
          >
            <Link
              to="/privacy-policy"
              style={{
                color: "var(--gray-light)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gray-light)";
              }}
            >
              {footerData?.tnc?.privacy}
            </Link>
            <Link
              to="/page-not-found"
              style={{
                color: "var(--gray-light)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gray-light)";
              }}
            >
              {footerData?.tnc?.refund}
            </Link>
            <Link
              to="/terms-conditions"
              style={{
                color: "var(--gray-light)",
                textDecoration: "none",
                fontSize: "14px",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--gray-light)";
              }}
            >
              {footerData?.tnc?.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
