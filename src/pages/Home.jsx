import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import EventsSection from "../Components/EventsSection.jsx";
import FlyerCarousel from "../Components/FlyerCarousel.jsx";
import NewRecommendSection from "../Components/NewRecommendSection.jsx";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { IoSearchOutline, IoCalendarOutline, IoLocationOutline, IoTicketOutline } from "react-icons/io5";
import { MdOutlineLocalActivity, MdNavigateNext } from "react-icons/md";
import { Link } from "react-router-dom";

import "../i18n";
// Get today and tomorrow's dates formatted as "DD MMM"
const formatDate = (date) => {
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayFormatted = formatDate(today);
const tomorrowFormatted = formatDate(tomorrow);

// Create next week date
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 5); // 5 days from now
const nextWeekFormatted = formatDate(nextWeek);

// Create dates for future events
const futureDate1 = new Date(today);
futureDate1.setDate(futureDate1.getDate() + 14);
const futureFormatted1 = formatDate(futureDate1);

const futureDate2 = new Date(today);
futureDate2.setDate(futureDate2.getDate() + 30);
const futureFormatted2 = formatDate(futureDate2);

// Event data with concert images, date-aware events, locations, and rank scores
const eventsData = [
  {
    eventName: "TODAY'S LIVE CONCERT",
    eventDate: `${todayFormatted} - ${todayFormatted}`,
    eventRanking: "1",
    eventAddress: "Pulse Live (Former Yang), Sydney",
    eventLocation: "Sydney",
    eventPrice: "399",
    eventPoster:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
    rankScore: 95, // High rank score for today's event
  },
  {
    eventName: "TOMORROW'S DANCE PARTY",
    eventDate: `${tomorrowFormatted} - ${tomorrowFormatted}`,
    eventRanking: "1", // First position for tomorrow's events
    eventAddress: "Marina Bay Sands, Sydney",
    eventLocation: "Sydney",
    eventPrice: "299",
    eventPoster:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    rankScore: 90,
  },
  {
    eventName: "THIS WEEK FESTIVAL",
    eventDate: `${nextWeekFormatted} - ${nextWeekFormatted}`,
    eventRanking: "1", // First position for this week's events
    eventAddress: "National Stadium, Sydney",
    eventLocation: "Sydney",
    eventPrice: "499",
    eventPoster:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2940&auto=format&fit=crop",
    rankScore: 88,
  },
  {
    eventName: "TODAY'S JAZZ NIGHT",
    eventDate: `${todayFormatted} - ${todayFormatted}`,
    eventRanking: "2", // Second position for today's events
    eventAddress: "Esplanade Concert Hall, Sydney",
    eventLocation: "Sydney",
    eventPrice: "199",
    eventPoster:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2940&auto=format&fit=crop",
    rankScore: 85,
  },
  {
    eventName: "TOMORROW'S COMEDY SHOW",
    eventDate: `${tomorrowFormatted} - ${tomorrowFormatted}`,
    eventRanking: "2", // Second position for tomorrow's events
    eventAddress: "Sentosa Beach, Sydney",
    eventLocation: "Sydney",
    eventPrice: "249",
    eventPoster:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2850&auto=format&fit=crop",
    rankScore: 82,
  },
  {
    eventName: "NEXT MONTH SYMPHONIC",
    eventDate: `${futureFormatted2} - ${futureFormatted2}`,
    eventRanking: "1", // First position for next month's events
    eventAddress: "Victoria Concert Hall, Sydney",
    eventLocation: "Sydney",
    eventPrice: "349",
    eventPoster:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=2940&auto=format&fit=crop",
    rankScore: 75,
  },
  {
    eventName: "NEXT WEEK EDM PARTY",
    eventDate: `${futureFormatted1} - ${futureFormatted1}`,
    eventRanking: "1", // First position for next week's events
    eventAddress: "Gardens by the Bay, Sydney",
    eventLocation: "Sydney",
    eventPrice: "450",
    eventPoster:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2940&auto=format&fit=crop",
    rankScore: 80,
  },
  {
    eventName: "THIS WEEK INDIE ROCK",
    eventDate: `${nextWeekFormatted} - ${nextWeekFormatted}`,
    eventRanking: "2", // Second position for this week's events
    eventAddress: "The Promontory, Sydney",
    eventLocation: "Sydney",
    eventPrice: "279",
    eventPoster:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2940&auto=format&fit=crop",
    rankScore: 78,
  },
  {
    eventName: "TODAY'S OUTDOOR FESTIVAL",
    eventDate: `${todayFormatted} - ${todayFormatted}`,
    eventRanking: "3", // Lower position for today's events
    eventAddress: "Botanical Gardens, Sydney",
    eventLocation: "Sydney",
    eventPrice: "159",
    eventPoster:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2940&auto=format&fit=crop",
    rankScore: 70,
  },
  {
    eventName: "TOMORROW'S ART EXHIBITION",
    eventDate: `${tomorrowFormatted} - ${tomorrowFormatted}`,
    eventRanking: "3", // Lower position for tomorrow's events
    eventAddress: "Modern Art Gallery, Sydney",
    eventLocation: "Sydney",
    eventPrice: "120",
    eventPoster:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2940&auto=format&fit=crop",
    rankScore: 65,
  },
  {
    eventName: "THIS WEEK THEATER SHOW",
    eventDate: `${nextWeekFormatted} - ${nextWeekFormatted}`,
    eventRanking: "3", // Lower position for this week's events
    eventAddress: "Sydney Opera House, Sydney",
    eventLocation: "Sydney",
    eventPrice: "299",
    eventPoster:
      "https://images.unsplash.com/photo-1607998803461-4e9aaa2291a0?q=80&w=2940&auto=format&fit=crop",
    rankScore: 60,
  },
];

// Trending events data
const trendingEventsData = [
  {
    eventName: "ELECTRONIC MUSIC FESTIVAL",
    eventDate: `${futureFormatted1} - ${futureFormatted1}`,
    eventRanking: "1",
    eventAddress: "Olympic Park, Melbourne",
    eventLocation: "Melbourne",
    eventPrice: "350",
    eventPoster:
      "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2835&auto=format&fit=crop",
    rankScore: 98,
  },
  {
    eventName: "INTERNATIONAL JAZZ FESTIVAL",
    eventDate: `${tomorrowFormatted} - ${nextWeekFormatted}`,
    eventRanking: "1",
    eventAddress: "Federation Square, Melbourne",
    eventLocation: "Melbourne",
    eventPrice: "189",
    eventPoster:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2432&auto=format&fit=crop",
    rankScore: 94,
  },
  {
    eventName: "FOOD & WINE EXPO",
    eventDate: `${todayFormatted} - ${tomorrowFormatted}`,
    eventRanking: "2",
    eventAddress: "Crown Exhibition Hall, Melbourne",
    eventLocation: "Melbourne",
    eventPrice: "79",
    eventPoster:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2787&auto=format&fit=crop",
    rankScore: 88,
  },
  {
    eventName: "STAND-UP COMEDY NIGHT",
    eventDate: `${nextWeekFormatted}`,
    eventRanking: "2",
    eventAddress: "Comedy Theatre, Melbourne",
    eventLocation: "Melbourne",
    eventPrice: "120",
    eventPoster:
      "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2729&auto=format&fit=crop",
    rankScore: 85,
  },
  {
    eventName: "FASHION WEEK",
    eventDate: `${futureFormatted1} - ${futureFormatted2}`,
    eventRanking: "1",
    eventAddress: "Convention Center, Tokyo",
    eventLocation: "Tokyo",
    eventPrice: "250",
    eventPoster:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=2787&auto=format&fit=crop",
    rankScore: 92,
  },
  {
    eventName: "ROCK LEGENDS TOUR",
    eventDate: `${futureFormatted1}`,
    eventRanking: "1",
    eventAddress: "Saitama Super Arena, Tokyo",
    eventLocation: "Tokyo",
    eventPrice: "290",
    eventPoster:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
    rankScore: 90,
  },
];

// Upcoming events data
const upcomingEventsData = [
  {
    eventName: "ANNUAL TECH CONFERENCE",
    eventDate: `${futureFormatted2} - ${formatDate(
      new Date(futureDate2.getTime() + 86400000 * 3)
    )}`,
    eventRanking: "1",
    eventAddress: "Jacob K. Javits Convention Center, New York",
    eventLocation: "New York",
    eventPrice: "599",
    eventPoster:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop",
    rankScore: 96,
  },
  {
    eventName: "BROADWAY MUSICAL PREMIERE",
    eventDate: `${futureFormatted1}`,
    eventRanking: "1",
    eventAddress: "Broadway Theatre, New York",
    eventLocation: "New York",
    eventPrice: "299",
    eventPoster:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?q=80&w=2669&auto=format&fit=crop",
    rankScore: 93,
  },
  {
    eventName: "NEW YORK FILM FESTIVAL",
    eventDate: `${futureFormatted2} - ${formatDate(
      new Date(futureDate2.getTime() + 86400000 * 10)
    )}`,
    eventRanking: "2",
    eventAddress: "Lincoln Center, New York",
    eventLocation: "New York",
    eventPrice: "149",
    eventPoster:
      "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2670&auto=format&fit=crop",
    rankScore: 91,
  },
  {
    eventName: "CONTEMPORARY ART EXHIBITION",
    eventDate: `${futureFormatted1} - ${futureFormatted2}`,
    eventRanking: "2",
    eventAddress: "MoMA, New York",
    eventLocation: "New York",
    eventPrice: "89",
    eventPoster:
      "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=2787&auto=format&fit=crop",
    rankScore: 88,
  },
  {
    eventName: "MARINA BAY COUNTDOWN",
    eventDate: `${futureFormatted2}`,
    eventRanking: "1",
    eventAddress: "Marina Bay Sands, Singapore",
    eventLocation: "Singapore",
    eventPrice: "199",
    eventPoster:
      "https://images.unsplash.com/photo-1552560880-2482cef14240?q=80&w=2670&auto=format&fit=crop",
    rankScore: 95,
  },
  {
    eventName: "SOUTHEAST ASIAN FOOD FESTIVAL",
    eventDate: `${nextWeekFormatted} - ${futureFormatted1}`,
    eventRanking: "1",
    eventAddress: "Gardens By The Bay, Singapore",
    eventLocation: "Singapore",
    eventPrice: "59",
    eventPoster:
      "https://images.unsplash.com/photo-1485962398705-ef6a13c41e8f?q=80&w=2574&auto=format&fit=crop",
    rankScore: 87,
  },
];

// Combined data for Featured Events
const featuredEvents = [
  ...trendingEventsData.slice(0, 2),
  ...upcomingEventsData.slice(0, 2),
  ...eventsData.slice(0, 2),
];

// Event categories with icons
const eventCategories = [
  { name: "Music", icon: <MdOutlineLocalActivity />, count: 42 },
  { name: "Sports", icon: <MdOutlineLocalActivity />, count: 28 },
  { name: "Arts", icon: <MdOutlineLocalActivity />, count: 35 },
  { name: "Food", icon: <MdOutlineLocalActivity />, count: 19 },
  { name: "Business", icon: <MdOutlineLocalActivity />, count: 23 },
  { name: "Wellness", icon: <MdOutlineLocalActivity />, count: 17 },
];

function Home() {
  const { t } = useTranslation();
  const searchInputRef = useRef(null);
  
  const [popularEventsLocation, setPopularEventsLocation] = useState(
    t("eventsSection.locations.sydney")
  );

  const [trendingEventsLocation, setTrendingEventsLocation] = useState(
    t("eventsSection.locations.melbourne")
  );

  const [upcomingEventsLocation, setUpcomingEventsLocation] = useState(
    t("eventsSection.locations.newYork")
  );

  // Define available locations for dropdowns
  const availableLocations = [
    t("eventsSection.locations.sydney"),
    t("eventsSection.locations.melbourne"),
    t("eventsSection.locations.singapore"),
    t("eventsSection.locations.tokyo"),
    t("eventsSection.locations.newYork"),
  ];

  // Handler for popular events location selector
  const handlePopularLocationChange = (newLocation) => {
    setPopularEventsLocation(newLocation);
  };

  // Handler for trending events location selector
  const handleTrendingLocationChange = (newLocation) => {
    setTrendingEventsLocation(newLocation);
  };

  // Handler for upcoming events location selector
  const handleUpcomingLocationChange = (newLocation) => {
    setUpcomingEventsLocation(newLocation);
  };

  // Handler for search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search query:", searchInputRef.current.value);
    // In a real app, this would navigate to search results
    searchInputRef.current.value = "";
  };

  return (
    <>
      {/* Hero Section with enhanced search */}
      <ScrollAnimation direction="down" distance={30} duration={1.2}>
        <div className="hero-container" style={{
          background: "linear-gradient(135deg, var(--purple-800) 0%, var(--purple-600) 100%)",
          minHeight: "600px",
          padding: "80px 20px 100px",
          marginTop: "90px",
          position: "relative",
          overflow: "hidden",
          borderRadius: "0 0 30px 30px",
        }}>
          {/* Animated background shapes */}
          <div style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.08)",
            top: "-50px",
            right: "-50px",
            animation: "float 15s infinite ease-in-out",
          }}></div>
          <div style={{
            position: "absolute",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(255, 255, 255, 0.05)",
            bottom: "50px",
            left: "-50px",
            animation: "float 18s infinite ease-in-out reverse",
          }}></div>
          
          <div className="container" style={{
            maxWidth: "1200px",
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}>
            <div className="hero-content" style={{ textAlign: "center" }}>
              <h1 className="hero-title" style={{
                fontSize: "60px",
                fontWeight: "800",
                marginBottom: "24px",
                color: "var(--light)",
                letterSpacing: "-0.5px",
                lineHeight: "1.1",
              }}>
                Find Your Perfect Event
              </h1>
              <p className="hero-subtitle" style={{
                fontSize: "20px",
                color: "var(--light)",
                opacity: "0.9",
                maxWidth: "700px",
                margin: "0 auto 40px",
                lineHeight: "1.5",
              }}>
                Discover amazing concerts, festivals, and experiences near you
              </p>
              
              {/* Enhanced search section */}
              <div className="hero-search" style={{
                maxWidth: "800px",
                margin: "0 auto",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
                background: "rgba(255, 255, 255, 0.12)",
                padding: "30px",
                borderRadius: "20px",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.2)",
              }}>
                <form onSubmit={handleSearchSubmit} style={{
                  display: "flex",
                  gap: "10px",
                  position: "relative",
                }}>
                  <div style={{ position: "relative", flex: "1" }}>
                    <IoSearchOutline style={{
                      position: "absolute",
                      left: "20px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "22px",
                      color: "var(--primary)",
                    }} />
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search events, artists, or venues"
                      style={{
                        width: "100%",
                        padding: "18px 24px 18px 56px",
                        borderRadius: "12px",
                        border: "none",
                        fontSize: "16px",
                        backgroundColor: "var(--neutral-50)",
                        boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{
                    height: "60px",
                    padding: "0 30px",
                    fontSize: "16px",
                  }}>
                    Search
                  </button>
                </form>
                
                {/* Quick filters */}
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                  marginTop: "5px",
                  flexWrap: "wrap",
                }}>
                  <Link to="/page-not-found" style={{
                    textDecoration: "none",
                    color: "var(--light)",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.3s ease",
                  }}>
                    <IoCalendarOutline /> Events Today
                  </Link>
                  <Link to="/page-not-found" style={{
                    textDecoration: "none",
                    color: "var(--light)",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.3s ease",
                  }}>
                    <IoLocationOutline /> Near Me
                  </Link>
                  <Link to="/page-not-found" style={{
                    textDecoration: "none",
                    color: "var(--light)",
                    background: "rgba(255, 255, 255, 0.2)",
                    padding: "8px 16px",
                    borderRadius: "30px",
                    fontSize: "14px",
                    fontWeight: "500",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "all 0.3s ease",
                  }}>
                    <IoTicketOutline /> Free Events
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Categories Section */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.2}>
        <div className="section-container" style={{
          marginTop: "-60px",
          marginBottom: "40px",
        }}>
          <div className="container" style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}>
            <div style={{
              background: "var(--light)",
              borderRadius: "20px",
              padding: "40px 30px",
              boxShadow: "0 8px 30px rgba(111, 68, 255, 0.12)",
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}>
                <h2 style={{
                  fontSize: "28px",
                  fontWeight: "700",
                  color: "var(--dark)",
                }}>
                  Browse by Category
                </h2>
                <Link to="/page-not-found" style={{
                  textDecoration: "none",
                  color: "var(--primary)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontWeight: "600",
                  fontSize: "15px",
                }}>
                  View All <MdNavigateNext />
                </Link>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(175px, 1fr))",
                gap: "20px",
              }}>
                {eventCategories.map((category, index) => (
                  <Link 
                    key={index} 
                    to="/page-not-found"
                    style={{
                      textDecoration: "none",
                      color: "var(--dark)",
                    }}
                  >
                    <div style={{
                      background: "var(--purple-50)",
                      padding: "25px 20px",
                      borderRadius: "12px",
                      textAlign: "center",
                      transition: "all 0.3s ease",
                      border: "1px solid var(--purple-100)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}>
                      <div style={{
                        fontSize: "32px",
                        color: "var(--primary)",
                        marginBottom: "15px",
                      }}>
                        {category.icon}
                      </div>
                      <h3 style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        marginBottom: "6px",
                      }}>
                        {category.name}
                      </h3>
                      <p style={{
                        color: "var(--gray-medium)",
                        fontSize: "14px",
                      }}>
                        {category.count} Events
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Featured Events Section */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.3}>
        <div className="section-container" style={{ marginBottom: "40px" }}>
          <div className="container" style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: "30px",
            }}>
              <div>
                <h2 className="section-title" style={{
                  marginBottom: "10px",
                  position: "relative",
                  display: "inline-block",
                }}>
                  <span style={{
                    position: "absolute",
                    height: "12px",
                    width: "100%",
                    bottom: "8px",
                    left: "0",
                    background: "rgba(111, 68, 255, 0.15)",
                    zIndex: "0",
                    borderRadius: "4px",
                  }}></span>
                  <span style={{ position: "relative", zIndex: "1" }}>
                    Featured Events
                  </span>
                </h2>
                <p className="section-subtitle" style={{ marginBottom: "20px" }}>
                  Curated selection of the most exciting events
                </p>
              </div>
              <Link to="/page-not-found" style={{
                textDecoration: "none",
                color: "var(--primary)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: "600",
                fontSize: "15px",
              }}>
                View All <MdNavigateNext />
              </Link>
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
              gap: "30px",
            }}>
              {featuredEvents.map((event, index) => (
                <div key={index} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <Link to="/page-not-found" style={{ textDecoration: "none" }}>
                    <div style={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      boxShadow: "var(--card-shadow)",
                      transition: "all 0.3s ease",
                      height: "300px",
                      position: "relative",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundImage: `url(${event.eventPoster})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "transform 0.5s ease",
                      }}></div>
                      <div style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "linear-gradient(0deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.3) 50%, rgba(0, 0, 0, 0) 100%)",
                      }}></div>
                      <div style={{
                        position: "relative",
                        zIndex: 1,
                        padding: "24px",
                        color: "white",
                      }}>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "8px",
                          fontSize: "14px",
                        }}>
                          <IoCalendarOutline />
                          <span>{event.eventDate}</span>
                        </div>
                        <h3 style={{
                          fontSize: "22px",
                          fontWeight: "700",
                          marginBottom: "10px",
                          lineHeight: "1.3",
                        }}>
                          {event.eventName}
                        </h3>
                        <div style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "16px",
                          fontSize: "14px",
                        }}>
                          <IoLocationOutline />
                          <span>{event.eventAddress}</span>
                        </div>
                        <div style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}>
                          <span style={{
                            background: "var(--primary)",
                            padding: "6px 12px",
                            borderRadius: "30px",
                            fontSize: "14px",
                            fontWeight: "600",
                          }}>
                            ${event.eventPrice}
                          </span>
                          <button className="btn-outline" style={{
                            background: "transparent",
                            border: "1px solid white",
                            color: "white",
                            padding: "6px 16px",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                          }}>
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Main Carousel */}
      <ScrollAnimation direction="down" distance={30} duration={1.2}>
        <FlyerCarousel />
      </ScrollAnimation>
      
      {/* Popular Events Section */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.2}>
        <EventsSection
          title={t("eventsSection.sectionTitles.popular")}
          location={popularEventsLocation}
          events={eventsData}
          containerId="popularEventsContainer"
          onLocationChange={handlePopularLocationChange}
          availableLocations={availableLocations}
        />
      </ScrollAnimation>
      
      {/* New Recommendation Section without rankings */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.3}>
        <NewRecommendSection
          title="Spotlight Events"
          subtitle="Curated selection of must-see events you don't want to miss"
          events={eventsData.slice(0, 8)}
          containerId="trendingRecommendations"
        />
      </ScrollAnimation>

      {/* Trending Now Section */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.4}>
        <EventsSection
          title={t("eventsSection.sectionTitles.trending")}
          location={trendingEventsLocation}
          events={trendingEventsData}
          containerId="trendingEventsContainer"
          onLocationChange={handleTrendingLocationChange}
          availableLocations={availableLocations}
        />
      </ScrollAnimation>

      {/* Subscribe Section */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.5}>
        <div className="section-container" style={{ marginBottom: "40px" }}>
          <div className="container" style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 20px",
          }}>
            <div style={{
              background: "linear-gradient(135deg, var(--purple-800) 0%, var(--purple-600) 100%)",
              borderRadius: "20px",
              padding: "60px 40px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* Background design elements */}
              <div style={{
                position: "absolute",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)",
                top: "-100px",
                right: "10%",
              }}></div>
              <div style={{
                position: "absolute",
                width: "300px",
                height: "300px",
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.05)",
                bottom: "-150px",
                left: "-50px",
              }}></div>
              
              <h2 style={{
                fontSize: "38px",
                fontWeight: "800",
                color: "white",
                marginBottom: "20px",
                position: "relative",
                zIndex: 1,
              }}>
                Never Miss an Event
              </h2>
              <p style={{
                fontSize: "18px",
                color: "rgba(255, 255, 255, 0.9)",
                marginBottom: "40px",
                maxWidth: "600px",
                position: "relative",
                zIndex: 1,
              }}>
                Subscribe to get personalized event recommendations and exclusive offers
              </p>
              <form style={{
                display: "flex",
                gap: "15px",
                maxWidth: "600px",
                width: "100%",
                position: "relative",
                zIndex: 1,
              }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    flex: "1",
                    padding: "16px 24px",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "16px",
                    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <button type="submit" className="btn btn-primary" style={{
                  padding: "0 30px",
                  borderRadius: "12px",
                  backgroundColor: "var(--accent-pink)",
                  boxShadow: "0 4px 15px rgba(255, 94, 163, 0.25)",
                }}>
                  Subscribe
                </button>
              </form>
              <p style={{
                fontSize: "14px",
                color: "rgba(255, 255, 255, 0.7)",
                marginTop: "15px",
                position: "relative",
                zIndex: 1,
              }}>
                By subscribing, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </ScrollAnimation>

      {/* Upcoming Events Section */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.6}>
        <EventsSection
          title={t("eventsSection.sectionTitles.upcoming")}
          location={upcomingEventsLocation}
          events={upcomingEventsData}
          containerId="upcomingEventsContainer"
          onLocationChange={handleUpcomingLocationChange}
          availableLocations={availableLocations}
        />
      </ScrollAnimation>
    </>
  );
}

export default Home;
