import React from "react";
import { Link } from "react-router-dom";
import { FaTicketAlt, FaHandshake, FaChartLine, FaHeadset, FaTools } from "react-icons/fa";
import { HiArrowNarrowRight } from "react-icons/hi";
import ScrollAnimation from "../utils/ScrollAnimation";
import { PageSEO } from "../utils/SEO";
import "../Style/imports.css";

const AboutUs = () => {
  return (
    <>
      <PageSEO
        title="About Us | TixMojo"
        description="Learn about TixMojo, a cutting-edge ticketing platform dedicated to connecting you with exciting events and unforgettable experiences."
        canonicalPath="/about-us"
      />
      
      <div style={{ paddingTop: "90px" }}>
        {/* Hero Section */}
        <ScrollAnimation animation="fade-in" delay={0.1}>
          <section style={{
            textAlign: "center",
            padding: "3rem 1rem 2rem",
            background: "linear-gradient(135deg, var(--purple-50) 0%, white 100%)",
            borderBottom: "1px solid var(--purple-100)"
          }}>
            <h1 style={{
              color: "var(--primary)",
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: "1.5rem",
              letterSpacing: "-0.03em"
            }}>ABOUT US</h1>
            
            <div style={{
              maxWidth: "800px",
              margin: "0 auto",
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "var(--neutral-800)"
            }}>
              <p>
                Welcome to <span style={{ fontWeight: "700", color: "var(--primary)" }}>Tixmojo</span>, where experiences begin with a simple click! We are a cutting-edge ticketing platform dedicated to connecting you with the most exciting events, unforgettable experiences, and seamless bookings.
              </p>
            </div>
          </section>
        </ScrollAnimation>
        
        {/* Mission Section */}
        <ScrollAnimation animation="fade-up" delay={0.2}>
          <section style={{
            padding: "3rem 1rem",
            maxWidth: "1000px",
            margin: "0 auto"
          }}>
            <h2 style={{
              color: "var(--primary)",
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              position: "relative",
              display: "inline-block"
            }}>
              OUR MISSION
              <span style={{
                position: "absolute",
                bottom: "-5px",
                left: "0",
                width: "100%",
                height: "8px",
                background: "rgba(111, 68, 255, 0.2)",
                zIndex: "-1",
                borderRadius: "4px"
              }}></span>
            </h2>
            
            <div style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "var(--neutral-800)"
            }}>
              <p>
                Our mission is to empower event enthusiasts and organizers by providing a robust, user-friendly platform that ensures every ticket purchase is a step closer to creating memories that last a lifetime. Whether it's a concert, theater performance, festival, or corporate event, we aim to make ticketing simple, efficient, and enjoyable.
              </p>
            </div>
          </section>
        </ScrollAnimation>
        
        {/* Why Choose Us Section */}
        <ScrollAnimation animation="fade-up" delay={0.3}>
          <section style={{
            padding: "3rem 1rem",
            background: "var(--purple-50)",
            borderTop: "1px solid var(--purple-100)",
            borderBottom: "1px solid var(--purple-100)"
          }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <h2 style={{
                color: "var(--primary)",
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "2rem",
                position: "relative",
                display: "inline-block"
              }}>
                WHY CHOOSE US?
                <span style={{
                  position: "absolute",
                  bottom: "-5px",
                  left: "0",
                  width: "100%",
                  height: "8px",
                  background: "rgba(111, 68, 255, 0.2)",
                  zIndex: "-1",
                  borderRadius: "4px"
                }}></span>
              </h2>
              
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1.5rem",
                marginTop: "2rem"
              }}>
                {/* Feature Cards */}
                <FeatureCard 
                  icon={<FaTicketAlt />}
                  title="Diverse Events"
                  description="From live music and sports to cultural festivals and conferences, we offer tickets to a wide variety of events to cater to every interest."
                />
                
                <FeatureCard 
                  icon={<FaHandshake />}
                  title="Easy-to-Use Platform"
                  description="With our intuitive interface, you can browse, book, and pay for tickets effortlessly."
                />
                
                <FeatureCard 
                  icon={<FaChartLine />}
                  title="Secure Transactions"
                  description="Your security is our priority. We provide safe and reliable payment options to ensure a stress-free experience."
                />
                
                <FeatureCard 
                  icon={<FaHeadset />}
                  title="Customer Support"
                  description="Got a question? Our dedicated support team is always ready to assist you with your queries."
                />
                
                <FeatureCard 
                  icon={<FaTools />}
                  title="Custom Solutions for Organizers"
                  description="We work hand-in-hand with event organizers to provide tools for event promotion, real-time analytics, and hassle-free ticket management."
                />
              </div>
            </div>
          </section>
        </ScrollAnimation>
        
        {/* Vision Section */}
        <ScrollAnimation animation="fade-up" delay={0.2}>
          <section style={{
            padding: "3rem 1rem",
            maxWidth: "1000px",
            margin: "0 auto"
          }}>
            <h2 style={{
              color: "var(--primary)",
              fontSize: "2rem",
              fontWeight: "700",
              marginBottom: "1.5rem",
              position: "relative",
              display: "inline-block"
            }}>
              OUR VISION
              <span style={{
                position: "absolute",
                bottom: "-5px",
                left: "0",
                width: "100%",
                height: "8px",
                background: "rgba(111, 68, 255, 0.2)",
                zIndex: "-1",
                borderRadius: "4px"
              }}></span>
            </h2>
            
            <div style={{
              fontSize: "1.1rem",
              lineHeight: "1.6",
              color: "var(--neutral-800)"
            }}>
              <p>
                We envision a world where ticketing is no longer a hurdle but a gateway to unforgettable experiences. By continuously innovating and leveraging the latest technology, we strive to redefine the event-ticketing landscape.
              </p>
            </div>
          </section>
        </ScrollAnimation>
        
        {/* For Event Organizers Section */}
        <ScrollAnimation animation="fade-up" delay={0.3}>
          <section style={{
            padding: "3rem 1rem",
            background: "linear-gradient(135deg, var(--purple-50) 0%, white 100%)",
            borderTop: "1px solid var(--purple-100)",
            borderBottom: "1px solid var(--purple-100)"
          }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <h2 style={{
                color: "var(--primary)",
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "1.5rem",
                position: "relative",
                display: "inline-block"
              }}>
                FOR EVENT ORGANIZERS
                <span style={{
                  position: "absolute",
                  bottom: "-5px",
                  left: "0",
                  width: "100%",
                  height: "8px",
                  background: "rgba(111, 68, 255, 0.2)",
                  zIndex: "-1",
                  borderRadius: "4px"
                }}></span>
              </h2>
              
              <div style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                color: "var(--neutral-800)"
              }}>
                <p>
                  Are you an organizer? Let us help you reach your audience with ease. From ticket sales to marketing tools and real-time reporting, we provide end-to-end solutions that make managing your event a breeze.
                </p>
              </div>
              
              <div style={{ marginTop: "2rem" }}>
                <Link 
                  to="/page-not-found"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    background: "var(--primary)",
                    color: "white",
                    padding: "0.75rem 1.5rem",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 6px rgba(111, 68, 255, 0.2)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--purple-800)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 6px 8px rgba(111, 68, 255, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 4px 6px rgba(111, 68, 255, 0.2)";
                  }}
                >
                  Learn About Organizer Tools <HiArrowNarrowRight />
                </Link>
              </div>
            </div>
          </section>
        </ScrollAnimation>
        
        
        {/* Join Us Banner */}
        <ScrollAnimation animation="fade-up" delay={0.5}>
          <section style={{
            padding: "3rem 1rem",
            background: "var(--primary)",
            color: "white",
            textAlign: "center"
          }}>
            <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
              <h2 style={{
                fontSize: "2rem",
                fontWeight: "700",
                marginBottom: "1.5rem"
              }}>
                JOIN US ON THE JOURNEY TO SIMPLIFY EVENT EXPERIENCES!
              </h2>
              
              <p style={{
                fontSize: "1.1rem",
                lineHeight: "1.6",
                maxWidth: "800px",
                margin: "0 auto 2rem"
              }}>
                Whether you're looking for the perfect outing or seeking to create an extraordinary event, Tixmojo is here to make it happen.
              </p>
              
              <Link 
                to="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "white",
                  color: "var(--primary)",
                  padding: "0.75rem 1.5rem",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  transition: "all 0.3s ease",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--purple-50)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "white";
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                }}
              >
                Explore Events <HiArrowNarrowRight />
              </Link>
            </div>
          </section>
        </ScrollAnimation>
      </div>
    </>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div style={{
      background: "white",
      borderRadius: "10px",
      padding: "1.5rem",
      boxShadow: "0 4px 6px rgba(111, 68, 255, 0.1)",
      border: "1px solid var(--purple-100)",
      transition: "all 0.3s ease",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-5px)";
      e.currentTarget.style.boxShadow = "0 8px 15px rgba(111, 68, 255, 0.15)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "0 4px 6px rgba(111, 68, 255, 0.1)";
    }}
    >
      <div style={{
        color: "var(--primary)",
        fontSize: "2rem",
        marginBottom: "1rem"
      }}>
        {icon}
      </div>
      
      <h3 style={{
        color: "var(--primary)",
        fontSize: "1.3rem",
        fontWeight: "700",
        marginBottom: "0.75rem"
      }}>
        {title}
      </h3>
      
      <p style={{
        color: "var(--neutral-700)",
        lineHeight: "1.6"
      }}>
        {description}
      </p>
    </div>
  );
};


export default AboutUs;