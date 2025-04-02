import React from "react";
import { Link } from "react-router-dom";
import { IoLogoFacebook, IoLogoTwitter, IoLogoInstagram, IoTicketOutline, IoLocationOutline, IoCalendarOutline, IoMailOutline, IoPhonePortraitOutline, IoChevronForward } from "react-icons/io5";
import { FaLinkedinIn, FaYoutube, FaSpotify, FaTiktok } from "react-icons/fa";
import { FiPhone, FiMapPin } from "react-icons/fi";
import { MdOutlineLocalActivity, MdOutlineExplore } from "react-icons/md";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  // New gradient colors for the footer
  const footerGradient = "linear-gradient(to right, var(--purple-900), #2c1a5a)";
  
  return (
    <footer style={{
      background: footerGradient,
      color: "var(--light)",
      padding: "0 0 30px",
      marginTop: "60px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Decorative wave shape at the top */}
      <div style={{
        position: "absolute",
        top: "-5px",
        left: 0,
        width: "100%",
        height: "80px",
        background: "var(--light)",
        borderRadius: "0 0 50% 50% / 0 0 100% 100%",
        transform: "scaleX(1.5)",
      }}></div>
      
      {/* Newsletter Section */}
      <div style={{
        background: "rgba(255, 255, 255, 0.03)",
        backdropFilter: "blur(10px)",
        padding: "80px 20px 40px",
        marginTop: "50px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "center",
        }}>
          <h2 style={{
            fontSize: "36px",
            fontWeight: "700",
            marginBottom: "15px",
            background: "linear-gradient(to right, #ffffff, var(--accent-teal))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Subscribe to Our Newsletter
          </h2>
          <p style={{
            fontSize: "16px",
            color: "rgba(255, 255, 255, 0.7)",
            marginBottom: "30px",
            maxWidth: "600px",
            margin: "0 auto 30px",
          }}>
            Get updates on the latest events, exclusive offers, and personalized recommendations
          </p>
          
          <form style={{
            display: "flex",
            maxWidth: "500px",
            margin: "0 auto",
            position: "relative",
          }}>
            <input
              type="email"
              placeholder="Your email address"
              style={{
                flex: "1",
                padding: "16px 24px",
                borderRadius: "12px",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                color: "white",
                fontSize: "16px",
                outline: "none",
              }}
            />
            <button 
              type="submit"
              style={{
                position: "absolute",
                right: "5px",
                top: "5px",
                padding: "11px 24px",
                borderRadius: "8px",
                border: "none",
                background: "var(--accent-teal)",
                color: "var(--dark)",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(46, 235, 201, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      
      {/* Main Footer Content */}
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "60px 20px 40px",
        position: "relative",
        zIndex: 2,
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "40px",
          marginBottom: "60px",
        }}>
          {/* Company Info */}
          <div>
            <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", marginBottom: "20px" }}>
              <div style={{
                width: "40px",
                height: "40px",
                backgroundColor: "white",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "15px",
                boxShadow: "0 4px 12px rgba(46, 235, 201, 0.2)",
                transform: "rotate(-10deg)",
              }}>
                <IoTicketOutline style={{ color: "var(--primary)", fontSize: "24px" }} />
              </div>
              <h2 style={{
                fontWeight: "800",
                color: "white",
                fontSize: "28px",
                fontFamily: "Raleway, sans-serif",
                letterSpacing: "-0.5px",
              }}>
                TIXMOJO
              </h2>
            </Link>
            
            <p style={{
              fontSize: "15px",
              lineHeight: "1.6",
              color: "rgba(255, 255, 255, 0.7)",
              marginBottom: "24px",
            }}>
              Your ultimate destination for discovering and booking tickets to the most exciting events. Find concerts, festivals, sports, and more all in one place.
            </p>
            
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              marginBottom: "30px",
            }}>
              {[
                { icon: <IoLogoFacebook />, label: "Facebook", color: "#1877F2" },
                { icon: <IoLogoTwitter />, label: "Twitter", color: "#1DA1F2" },
                { icon: <IoLogoInstagram />, label: "Instagram", color: "#E1306C" },
                { icon: <FaSpotify />, label: "Spotify", color: "#1DB954" },
                { icon: <FaTiktok />, label: "TikTok", color: "#EE1D52" },
                { icon: <FaYoutube />, label: "YouTube", color: "#FF0000" },
              ].map((social, index) => (
                <Link 
                  key={index}
                  to="/page-not-found"
                  aria-label={social.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: "18px",
                    transition: "all 0.3s ease",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = social.color;
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 5px 15px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.08)";
                    e.currentTarget.style.color = "rgba(255, 255, 255, 0.8)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {social.icon}
                </Link>
              ))}
            </div>
            
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
            }}>
              <Link 
                to="/page-not-found"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "40px",
                  padding: "5px 10px",
                  backgroundColor: "#000",
                  borderRadius: "8px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ color: "white", fontSize: "22px", marginRight: "8px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.86-3.08.38-1.06-.5-2.03-.48-3.14 0-1.39.62-2.21.44-3.05-.38-4.4-4.79-3.84-11.98 1.02-12.28 1.31.13 2.22.73 2.97.73.77 0 2.22-.73 3.76-.62 1.28.1 2.44.56 3.28 1.58-2.92 1.71-2.44 5.37.39 6.62-.98 2.05-2.23 4.1-4.15 4.97zm-4.36-19C11.25 1.34 9.85 2.27 9 3.79c-.95 1.66-.68 4.47 1.28 5.71.82-1.67-.15-3.35-.96-4.11 1.31-1.47 3.28-1.63 3.37-4.11z"></path>
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ color: "white", fontSize: "10px", fontWeight: "300", lineHeight: "1" }}>Download on the</span>
                  <span style={{ color: "white", fontSize: "16px", fontWeight: "600", lineHeight: "1.2" }}>App Store</span>
                </div>
              </Link>
              <Link 
                to="/page-not-found"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "40px",
                  padding: "5px 10px",
                  backgroundColor: "#000",
                  borderRadius: "8px",
                  transition: "transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ color: "white", fontSize: "22px", marginRight: "8px" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.609 22.186a.996.996 0 0 1-.028-1.39L11.11 12 3.58 3.203a.996.996 0 0 1 .029-1.389zM14.4 13.5l3-1.5-5.025-2.925L14.399 13.5zM12 10.5l-9.375-5.55c-.05-.484.122-.921.477-1.182.245-.181.53-.268.82-.268.215 0 .43.05.608.152l10.47 6.096V4.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5v10.031c0 .531-.278 1.028-.734 1.295l-.001.001c-.86.5-1.866.206-2.265-.653L12 10.5z"></path>
                  </svg>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                  <span style={{ color: "white", fontSize: "10px", fontWeight: "300", lineHeight: "1" }}>GET IT ON</span>
                  <span style={{ color: "white", fontSize: "16px", fontWeight: "600", lineHeight: "1.2" }}>Google Play</span>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "24px",
              color: "white",
              position: "relative",
              paddingBottom: "12px",
            }}>
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "30px",
                height: "3px",
                background: "var(--accent-teal)",
                borderRadius: "3px",
              }}></span>
              Quick Links
            </h3>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: "14px",
            }}>
              {[
                { name: "Explore Events", icon: <MdOutlineExplore /> }, 
                { name: "Today's Events", icon: <IoCalendarOutline /> }, 
                { name: "Sell Tickets", icon: <IoTicketOutline /> },
                { name: "Venues", icon: <IoLocationOutline /> },
                { name: "About Us", icon: <IoChevronForward /> },
                { name: "Contact Us", icon: <IoChevronForward /> },
              ].map((link, index) => (
                <li key={index}>
                  <Link 
                    to="/page-not-found"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent-teal)";
                      e.currentTarget.style.paddingLeft = "5px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{link.icon}</span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Event Categories */}
          <div>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "24px",
              color: "white",
              position: "relative",
              paddingBottom: "12px",
            }}>
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "30px",
                height: "3px",
                background: "var(--accent-pink)",
                borderRadius: "3px",
              }}></span>
              Event Categories
            </h3>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "14px",
            }}>
              {[
                "Concerts", 
                "Festivals",
                "Theatre",
                "Comedy",
                "Sports",
                "Arts",
                "Family",
                "Workshops",
                "Nightlife",
                "Culture"
              ].map((category, index) => (
                <li key={index}>
                  <Link 
                    to="/page-not-found"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      textDecoration: "none",
                      fontSize: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "var(--accent-pink)";
                      e.currentTarget.style.paddingLeft = "5px";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                      e.currentTarget.style.paddingLeft = "0";
                    }}
                  >
                    <MdOutlineLocalActivity />
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Contact Us */}
          <div>
            <h3 style={{
              fontSize: "18px",
              fontWeight: "700",
              marginBottom: "24px",
              color: "white",
              position: "relative",
              paddingBottom: "12px",
            }}>
              <span style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "30px",
                height: "3px",
                background: "var(--accent-indigo)",
                borderRadius: "3px",
              }}></span>
              Contact Us
            </h3>
            <ul style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}>
              {[
                { 
                  icon: <FiMapPin />, 
                  text: "123 Event Street, Sydney, NSW 2000, Australia" 
                },
                { 
                  icon: <IoPhonePortraitOutline />, 
                  text: "+61 2 1234 5678" 
                },
                { 
                  icon: <IoMailOutline />, 
                  text: "help@tixmojo.com" 
                },
              ].map((contact, index) => (
                <li 
                  key={index} 
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    marginBottom: "18px",
                    gap: "12px",
                  }}
                >
                  <span style={{
                    color: "var(--accent-indigo)",
                    fontSize: "22px",
                    marginTop: "2px",
                  }}>
                    {contact.icon}
                  </span>
                  <Link
                    to="/page-not-found"
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }}
                  >
                    {contact.text}
                  </Link>
                </li>
              ))}
            </ul>
            
            <div style={{ marginTop: "30px" }}>
              <h4 style={{
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "15px",
                color: "white",
              }}>
                Customer Support Hours
              </h4>
              <p style={{
                color: "rgba(255, 255, 255, 0.7)",
                fontSize: "15px",
                lineHeight: "1.6",
              }}>
                Monday - Friday: 9am - 6pm<br />
                Saturday: 10am - 4pm<br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          paddingTop: "30px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}>
          <div style={{
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "14px",
          }}>
            © {year} TixMojo. All rights reserved.
          </div>
          
          <div style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "25px",
          }}>
            {[
              "Privacy Policy", 
              "Terms of Service", 
              "Refund Policy",
              "Accessibility"
            ].map((item, index) => (
              <Link 
                key={index}
                to="/page-not-found"
                style={{
                  color: "rgba(255, 255, 255, 0.6)",
                  textDecoration: "none",
                  fontSize: "14px",
                  transition: "color 0.3s ease",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "white";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)";
                }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div style={{
        position: "absolute",
        bottom: "20%",
        right: "5%",
        width: "300px",
        height: "300px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(111, 68, 255, 0.1) 0%, rgba(111, 68, 255, 0) 70%)",
        pointerEvents: "none",
      }}></div>
      
      <div style={{
        position: "absolute",
        top: "30%",
        left: "5%",
        width: "200px",
        height: "200px",
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(46, 235, 201, 0.1) 0%, rgba(46, 235, 201, 0) 70%)",
        pointerEvents: "none",
      }}></div>
    </footer>
  );
}

export default Footer;