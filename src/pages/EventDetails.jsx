import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineLocationMarker, HiOutlineExternalLink } from "react-icons/hi";
import { BsCalendar2Date } from "react-icons/bs";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { EventSEO } from "../utils/SEO.jsx";
import { getEventById, getEventsByOrganizer } from "../services/api.js";
import { IoTicketOutline } from "react-icons/io5";
import { IoMdMail, IoMdGlobe, IoMdCall, IoMdClose } from "react-icons/io";
import { BiDetail, BiStar, BiMap, BiMusic, BiInfoCircle } from "react-icons/bi";

const EventDetails = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("details");
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  // Define default tag colors
  const tagColor = {
    background: "#e0f2f1",
    text: "#00695c",
    shadow: "none",
  };

  useEffect(() => {
    // Fetch event details from API
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventData = await getEventById(eventId);

        // Format the event data from the API
        const formattedEvent = {
          id: eventData.id,
          title: eventData.eventName,
          tags: Array.isArray(eventData.tags) ? eventData.tags : [eventData.tags],
          image: eventData.eventPoster,
          date: eventData.date,
          time: eventData.time,
          venueName: eventData.venueName,
          venueAddress: eventData.venueAddress,
          locationMap: eventData.locationMap ||
            `https://maps.google.com/?q=${encodeURIComponent(eventData.venueAddress)}`,
          price: {
            currency: eventData.currency || "AUD",
            value: eventData.eventPrice,
          },
          description: eventData.description,
          organizer: {
            id: eventData.organizerId || '',
            name: eventData.organizer?.name || '',
            description: eventData.organizer?.description || '',
            location: eventData.organizer?.location || '',
            contactEmail: eventData.organizer?.contactEmail || '',
            phone: eventData.organizer?.phone || '',
            website: eventData.organizer?.website || '',
            specialization: eventData.organizer?.specialization || [],
            yearEstablished: eventData.organizer?.yearEstablished || '',
            stats: eventData.organizer?.stats || {
              totalEvents: 0,
              rating: 0,
              ticketsSold: "0"
            }
          },
          sponsors: eventData.sponsors || [],
        };

        setEvent(formattedEvent);
        
        // Now fetch all events from the same organizer
        if (eventData.organizerId) {
          try {
            const orgEvents = await getEventsByOrganizer(eventData.organizerId);
            // Filter out the current event and limit to 3
            const sameOrganizerEvents = orgEvents
              .filter(e => e.id !== eventData.id)
              .slice(0, 3);
            
            setOrganizerEvents(sameOrganizerEvents);
          } catch (error) {
            console.error("Error fetching organizer events:", error);
            setOrganizerEvents([]);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching event:", error);
        setLoading(false);
        // Redirect to 404 if event not found
        navigate("/page-not-found");
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId, navigate]);

  const handleGetTickets = () => {
    console.log("Getting tickets for:", event?.title);
    // In a real app, this would navigate to checkout
    navigate("/page-not-found");
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "70vh",
        }}
      >
        <div
          style={{
            color: "var(--primary)",
            fontSize: "18px",
            fontWeight: "500",
          }}
        >
          Loading event details...
        </div>
      </div>
    );
  }

  if (!event) {
    return null;
  }
  // Event is ready to render
  return (
    <>
      <EventSEO
        event={{
          title: event.title,
          description: `Join us for ${event.title} - ${event.tags[0]} on ${event.date}. Get tickets now!`,
          date: event.date,
          endDate: event.date, // If no specific end date is available
          location: {
            name: event.venueName,
            address: event.venueAddress,
          },
          image: event.image,
          price: {
            currency: event.price.currency,
            value: event.price.value,
          },
          performer: {
            name: event.organizer.name,
            type: "Organization",
          },
          // Add any specific offers if you have them
          offers: [
            {
              name: "Standard Ticket",
              price: event.price.value,
            },
          ],
        }}
        path={`/events/${eventId}`}
      />

      <div
        style={{
          padding: "110px 32px 60px 32px",
          maxWidth: "1200px",
          margin: "0 auto",
          minHeight: "90vh",
        }}
      >
        <ScrollAnimation direction="down" distance={30} duration={0.8}>
          <div style={{ marginBottom: "10px" }}>
            <h1
              style={{
                fontSize: "42px",
                fontWeight: "800",
                color: "var(--dark)",
                fontFamily: "var(--font-heading)",
              }}
            >
              {event.title}
            </h1>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "10px",
                marginTop: "5px",
              }}
            >
              {/* Display tags from the backend */}
              {event.tags.map((tag, index) => {
                return (
                  <div
                    key={index}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      borderRadius: "50px",
                      padding: "4px 12px",
                      fontSize: "12px",
                      fontWeight: "600",
                      transition: "all 0.2s ease",
                      cursor: "pointer",
                      backgroundColor: "#e0f2f1",
                      color: "#00695c",
                      boxShadow: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    # {tag}
                  </div>
                );
              })}
            </div>
          </div>
        </ScrollAnimation>

        <div
          style={{
            display: "flex",
            flexDirection: window.innerWidth < 768 ? "column" : "row",
            gap: "30px",
            marginTop: "30px",
          }}
        >
          {/* Left column - Event image */}
          <ScrollAnimation
            direction="left"
            distance={30}
            duration={0.9}
            delay={0.1}
          >
            <div
              style={{
                flex: window.innerWidth < 768 ? "1" : "3",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(111, 68, 255, 0.12)",
              }}
            >
              <img
                src={event.image}
                alt={event.title}
                style={{
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  width: "700px",
                  minHeight: "300px",
                  maxHeight: window.innerWidth < 768 ? "300px" : "350px",
                }}
              />
            </div>
          </ScrollAnimation>

          {/* Right column - Event details */}
          <ScrollAnimation
            direction="right"
            distance={30}
            duration={0.9}
            delay={0.2}
          >
            <div
              style={{
                flex: window.innerWidth < 768 ? "1" : "2",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "3rem",
                  marginTop: "2rem",
                }}
              >
                {/* Date & Time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",

                    padding: "0 15px",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      backgroundColor: "var(--purple-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                      flexShrink: 0,
                    }}
                  >
                    <BsCalendar2Date
                      style={{
                        color: "var(--primary)",
                        fontSize: "22px",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "18px",
                        color: "var(--dark)",
                        marginBottom: "4px",
                      }}
                    >
                      {event.date}
                    </div>
                    <div
                      style={{
                        color: "var(--gray-medium)",
                        fontSize: "16px",
                        fontWeight: "500",
                      }}
                    >
                      {event.time}
                    </div>
                  </div>
                </div>

                {/* Venue */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",

                    padding: "0 15px",
                  }}
                >
                  <div
                    style={{
                      width: "45px",
                      height: "45px",
                      borderRadius: "50%",
                      backgroundColor: "var(--purple-100)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: "15px",
                      flexShrink: 0,
                    }}
                  >
                    <HiOutlineLocationMarker
                      style={{
                        color: "var(--primary)",
                        fontSize: "22px",
                      }}
                    />
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "18px",
                        color: "var(--dark)",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "4px",
                      }}
                    >
                      <a
                        href={event.locationMap}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ textDecoration: "none", color: "var(--dark)" }}
                        onMouseEnter={(e) => {
                          e.target.style.color = "var(--primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.color = "var(--dark)";
                        }}
                      >
                        {event.venueName}
                      </a>
                      <a
                        href={event.locationMap}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          marginLeft: "8px",
                          color: "var(--primary)",
                        }}
                      >
                        <HiOutlineExternalLink
                          style={{
                            fontSize: "18px",
                          }}
                        />
                      </a>
                    </div>
                    <a
                      href={event.locationMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "var(--gray-medium)",
                        fontSize: "16px",
                        lineHeight: "1.5",
                        fontWeight: "500",
                        textDecoration: "none",
                        borderBottom: "1px dashed var(--purple-300)",
                        display: "inline-block",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = "var(--primary)";
                        e.target.style.borderColor = "var(--primary)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = "var(--gray-medium)";
                        e.target.style.borderColor = "var(--purple-300)";
                      }}
                    >
                      {event.venueAddress}
                    </a>
                  </div>
                </div>

                {/* Price */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "3px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "left",
                      flexDirection: "column",
                      marginRight: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        color: "var(--neutral-800)",
                        fontWeight: "500",
                      }}
                    >
                      Tickets Starting from
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IoTicketOutline
                        style={{
                          color: "var(--primary)",
                          fontSize: "32px",
                          marginRight: "5px",
                        }}
                      >
                        {" "}
                      </IoTicketOutline>
                      <span
                        style={{
                          fontWeight: "800",
                          fontSize: "35px",
                          color: "black",
                          fontFamily: "var(--font-heading)",
                          lineHeight: "1",
                        }}
                      >
                        {event.price.currency} {event.price.value}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleGetTickets}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0px 6px 15px rgba(255, 87, 87, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0px 4px 10px rgba(255, 87, 87, 0.3)";
                    }}
                    style={{
                      backgroundColor: "#ff5757",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      padding: "15px",
                      fontSize: "20px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0px 4px 10px rgba(255, 87, 87, 0.3)",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "0.5px",
                    }}
                  >
                    Get Tickets
                  </button>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>

        {/* Event Description - New Interactive Design */}
        <ScrollAnimation
          direction="up"
          distance={20}
          duration={0.8}
          delay={0.3}
        >
          <div
            style={{
              marginTop: "60px",
              position: "relative",
              overflow: "hidden",
              borderRadius: "24px",
              boxShadow: "0 20px 40px rgba(111, 68, 255, 0.08)",
              border: "1px solid var(--purple-100)",
              background: "var(--neutral-50)",
            }}
          >
            {/* Tabs Navigation */}
            <div
              style={{
                display: "flex",
                borderBottom: "1px solid var(--purple-100)",
                position: "relative",
                overflow: "hidden",
                backgroundColor: "var(--purple-50)",
              }}
            >
              {/* Active tab indicator - animated */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  height: "3px",
                  backgroundColor: "var(--primary)",
                  transition: "all 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67)",
                  left: activeTab === "details" ? "0%" : 
                        activeTab === "venue" ? "25%" : 
                        activeTab === "highlights" ? "50%" : "75%",
                  width: "25%",
                  borderRadius: "3px 3px 0 0",
                }}
              />
              
              {/* Tab buttons */}
              <button
                onClick={() => setActiveTab("details")}
                style={{
                  flex: 1,
                  padding: "20px 15px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: activeTab === "details" ? "700" : "500",
                  color: activeTab === "details" ? "var(--primary)" : "var(--neutral-700)",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "details") {
                    e.currentTarget.style.backgroundColor = "var(--purple-100)";
                    e.currentTarget.style.color = "var(--primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "details") {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--neutral-700)";
                  }
                }}
              >
                <BiDetail size={22} />
                <span>Details</span>
              </button>
              
              <button
                onClick={() => setActiveTab("venue")}
                style={{
                  flex: 1,
                  padding: "20px 15px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: activeTab === "venue" ? "700" : "500",
                  color: activeTab === "venue" ? "var(--primary)" : "var(--neutral-700)",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "venue") {
                    e.currentTarget.style.backgroundColor = "var(--purple-100)";
                    e.currentTarget.style.color = "var(--primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "venue") {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--neutral-700)";
                  }
                }}
              >
                <BiMap size={22} />
                <span>Venue</span>
              </button>
              
              <button
                onClick={() => setActiveTab("highlights")}
                style={{
                  flex: 1,
                  padding: "20px 15px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: activeTab === "highlights" ? "700" : "500",
                  color: activeTab === "highlights" ? "var(--primary)" : "var(--neutral-700)",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "highlights") {
                    e.currentTarget.style.backgroundColor = "var(--purple-100)";
                    e.currentTarget.style.color = "var(--primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "highlights") {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--neutral-700)";
                  }
                }}
              >
                <BiStar size={22} />
                <span>Highlights</span>
              </button>
              
              <button
                onClick={() => setActiveTab("more")}
                style={{
                  flex: 1,
                  padding: "20px 15px",
                  backgroundColor: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: activeTab === "more" ? "700" : "500",
                  color: activeTab === "more" ? "var(--primary)" : "var(--neutral-700)",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== "more") {
                    e.currentTarget.style.backgroundColor = "var(--purple-100)";
                    e.currentTarget.style.color = "var(--primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== "more") {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "var(--neutral-700)";
                  }
                }}
              >
                <BiInfoCircle size={22} />
                <span>More Info</span>
              </button>
            </div>

            {/* Tab Content */}
            <div
              style={{
                padding: "32px 40px",
                position: "relative",
                background: "var(--neutral-50)",
                minHeight: "300px",
              }}
            >
              {/* Background Pattern */}
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "15px",
                  opacity: 0.04,
                  zIndex: 0,
                  pointerEvents: "none",
                }}
              >
                <svg width="150" height="150" viewBox="0 0 100 100" fill="none">
                  <circle cx="10" cy="10" r="3" fill="var(--primary)" />
                  <circle cx="10" cy="30" r="3" fill="var(--primary)" />
                  <circle cx="10" cy="50" r="3" fill="var(--primary)" />
                  <circle cx="10" cy="70" r="3" fill="var(--primary)" />
                  <circle cx="10" cy="90" r="3" fill="var(--primary)" />
                  <circle cx="30" cy="10" r="3" fill="var(--primary)" />
                  <circle cx="30" cy="30" r="3" fill="var(--primary)" />
                  <circle cx="30" cy="50" r="3" fill="var(--primary)" />
                  <circle cx="30" cy="70" r="3" fill="var(--primary)" />
                  <circle cx="30" cy="90" r="3" fill="var(--primary)" />
                  <circle cx="50" cy="10" r="3" fill="var(--primary)" />
                  <circle cx="50" cy="30" r="3" fill="var(--primary)" />
                  <circle cx="50" cy="50" r="3" fill="var(--primary)" />
                  <circle cx="50" cy="70" r="3" fill="var(--primary)" />
                  <circle cx="50" cy="90" r="3" fill="var(--primary)" />
                  <circle cx="70" cy="10" r="3" fill="var(--primary)" />
                  <circle cx="70" cy="30" r="3" fill="var(--primary)" />
                  <circle cx="70" cy="50" r="3" fill="var(--primary)" />
                  <circle cx="70" cy="70" r="3" fill="var(--primary)" />
                  <circle cx="70" cy="90" r="3" fill="var(--primary)" />
                  <circle cx="90" cy="10" r="3" fill="var(--primary)" />
                  <circle cx="90" cy="30" r="3" fill="var(--primary)" />
                  <circle cx="90" cy="50" r="3" fill="var(--primary)" />
                  <circle cx="90" cy="70" r="3" fill="var(--primary)" />
                  <circle cx="90" cy="90" r="3" fill="var(--primary)" />
                </svg>
              </div>

              {/* Details Tab Content */}
              <div 
                style={{ 
                  display: activeTab === "details" ? "block" : "none",
                  animation: activeTab === "details" ? "fadeIn 0.5s ease" : "none",
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "var(--primary)",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <BiDetail size={24} /> About This Event
                </h3>
                
                {/* Event Summary */}
                <div
                  style={{
                    backgroundColor: "var(--purple-50)",
                    borderRadius: "12px",
                    padding: "20px",
                    marginBottom: "25px",
                    border: "1px solid var(--purple-100)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginBottom: "15px",
                    }}
                  >
                    {event.tags.map((tag, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "white",
                          color: "var(--primary)",
                          padding: "4px 12px",
                          borderRadius: "20px",
                          fontSize: "13px",
                          fontWeight: "600",
                          boxShadow: "0 2px 6px rgba(111, 68, 255, 0.1)",
                          border: "1px solid var(--purple-200)",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <BsCalendar2Date color="var(--primary)" size={18} />
                      <span style={{ fontWeight: "500", fontSize: "15px" }}>
                        {event.date}
                      </span>
                    </div>
                    
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: "var(--neutral-400)",
                      }}
                    />
                    
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <HiOutlineLocationMarker color="var(--primary)" size={18} />
                      <span style={{ fontWeight: "500", fontSize: "15px" }}>
                        {event.venueName}
                      </span>
                    </div>
                    
                    <div
                      style={{
                        width: "4px",
                        height: "4px",
                        borderRadius: "50%",
                        backgroundColor: "var(--neutral-400)",
                      }}
                    />
                    
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <BiMusic color="var(--primary)" size={18} />
                      <span style={{ fontWeight: "500", fontSize: "15px" }}>
                        Organized by {event.organizer.name}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div
                  className="event-description"
                  style={{
                    position: "relative",
                    color: "var(--neutral-800)",
                    fontSize: "16px",
                    lineHeight: 1.8,
                    fontWeight: "400",
                    maxHeight: isDescriptionExpanded ? "none" : "300px",
                    overflow: isDescriptionExpanded ? "visible" : "hidden",
                    transition: "all 0.5s ease",
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: event.description }} />
                  
                  {/* Gradient fade for unexpanded content */}
                  {!isDescriptionExpanded && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "80px",
                        background: "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,1))",
                        pointerEvents: "none",
                      }}
                    />
                  )}
                </div>
                
                {/* Expand/Collapse button */}
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "var(--purple-100)",
                    color: "var(--primary)",
                    border: "none",
                    borderRadius: "30px",
                    padding: "8px 20px",
                    fontSize: "14px",
                    fontWeight: "600",
                    margin: "20px auto 0",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--purple-200)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--purple-100)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  {isDescriptionExpanded ? "Show Less" : "Read More"}
                </button>
              </div>
              
              {/* Venue Tab Content */}
              <div 
                style={{ 
                  display: activeTab === "venue" ? "block" : "none",
                  animation: activeTab === "venue" ? "fadeIn 0.5s ease" : "none",
                  position: "relative", 
                  zIndex: 1,
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "var(--primary)",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <BiMap size={24} /> Venue Information
                </h3>
                
                <div
                  style={{
                    display: "flex",
                    flexDirection: window.innerWidth < 768 ? "column" : "row",
                    gap: "30px",
                    marginBottom: "20px",
                  }}
                >
                  {/* Venue Details */}
                  <div
                    style={{
                      flex: "1",
                      backgroundColor: "var(--purple-50)",
                      borderRadius: "16px",
                      padding: "24px",
                      boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
                      border: "1px solid var(--purple-100)",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "var(--dark)",
                        marginBottom: "15px",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {event.venueName}
                    </h4>
                    
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "20px",
                      }}
                    >
                      <HiOutlineLocationMarker 
                        size={22} 
                        style={{ 
                          color: "var(--primary)",
                          marginTop: "3px",
                        }} 
                      />
                      <p
                        style={{
                          color: "var(--neutral-700)",
                          fontSize: "16px",
                          lineHeight: 1.6,
                          margin: 0,
                        }}
                      >
                        {event.venueAddress}
                      </p>
                    </div>
                    
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        marginBottom: "25px",
                      }}
                    >
                      <BsCalendar2Date 
                        size={20} 
                        style={{ 
                          color: "var(--primary)",
                          marginTop: "3px",
                        }} 
                      />
                      <div>
                        <p
                          style={{
                            color: "var(--neutral-700)",
                            fontSize: "16px",
                            margin: "0 0 5px 0",
                            fontWeight: "600",
                          }}
                        >
                          {event.date}
                        </p>
                        <p
                          style={{
                            color: "var(--neutral-600)",
                            fontSize: "14px",
                            margin: 0,
                          }}
                        >
                          {event.time}
                        </p>
                      </div>
                    </div>
                    
                    <div 
                      style={{
                        marginBottom: "25px",
                        padding: "15px",
                        backgroundColor: "white",
                        borderRadius: "12px",
                        border: "1px dashed var(--purple-200)",
                      }}
                    >
                      <p
                        style={{
                          margin: "0 0 8px 0",
                          fontWeight: "600",
                          fontSize: "14px",
                          color: "var(--primary)",
                        }}
                      >
                        Venue Facilities
                      </p>
                      <ul
                        style={{
                          margin: 0,
                          padding: "0 0 0 20px",
                          color: "var(--neutral-700)",
                          fontSize: "14px",
                          lineHeight: 1.6,
                        }}
                      >
                        <li>Wheelchair accessible</li>
                        <li>Air-conditioned</li>
                        <li>Restrooms</li>
                        <li>Food and beverages</li>
                      </ul>
                    </div>
                    
                    <a
                      href={event.locationMap}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "var(--primary)",
                        fontWeight: "600",
                        textDecoration: "none",
                        padding: "12px 20px",
                        borderRadius: "8px",
                        backgroundColor: "white",
                        boxShadow: "0 4px 12px rgba(111, 68, 255, 0.12)",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-3px)";
                        e.currentTarget.style.boxShadow = "0 6px 15px rgba(111, 68, 255, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(111, 68, 255, 0.12)";
                      }}
                    >
                      <HiOutlineLocationMarker size={18} />
                      Open in Google Maps
                    </a>
                  </div>
                  
                  {/* Interactive Map Preview */}
                  <div
                    style={{
                      flex: "1.5",
                      borderRadius: "16px",
                      overflow: "hidden",
                      height: "350px",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundImage: `url(https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(event.venueAddress)}&zoom=15&size=600x400&markers=color:purple%7C${encodeURIComponent(event.venueAddress)}&key=YOUR_API_KEY)`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        filter: "saturate(1.1)",
                        boxShadow: "inset 0 0 10px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    
                    {/* Map Overlay with Info */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        padding: "20px",
                        background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
                        color: "white",
                      }}
                    >
                      <h5 
                        style={{
                          margin: "0 0 5px 0",
                          fontSize: "18px",
                          fontWeight: "700",
                        }}
                      >
                        {event.venueName}
                      </h5>
                      <p
                        style={{
                          margin: "0 0 10px 0",
                          fontSize: "14px",
                          opacity: 0.9,
                        }}
                      >
                        {event.venueAddress}
                      </p>
                      
                      <a
                        href={event.locationMap}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          color: "white",
                          backgroundColor: "var(--primary)",
                          fontWeight: "600",
                          textDecoration: "none",
                          padding: "8px 15px",
                          borderRadius: "8px",
                          fontSize: "14px",
                          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                          transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--purple-700)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary)";
                        }}
                      >
                        <HiOutlineExternalLink size={16} />
                        View in Google Maps
                      </a>
                    </div>
                    
                    {/* Location Pin */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "20px",
                        height: "20px",
                        backgroundColor: "var(--primary)",
                        borderRadius: "50%",
                        border: "3px solid white",
                        boxShadow: "0 0 0 2px var(--primary)",
                        animation: "pulseAnimation 2s infinite",
                      }}
                    />
                  </div>
                </div>
                
                {/* Nearby Information */}
                <div
                  style={{
                    backgroundColor: "white",
                    borderRadius: "16px",
                    padding: "25px",
                    marginTop: "30px",
                    boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
                    border: "1px solid var(--purple-100)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "var(--dark)",
                      marginBottom: "15px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <svg 
                      width="22" 
                      height="22" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ color: "var(--primary)" }}
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    Useful Information
                  </h4>
                  
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: window.innerWidth < 768 ? "1fr" : "1fr 1fr",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--primary)",
                          margin: "0 0 10px 0",
                        }}
                      >
                        Getting There
                      </h5>
                      <ul
                        style={{
                          margin: 0,
                          padding: "0 0 0 20px",
                          color: "var(--neutral-700)",
                          fontSize: "14px",
                          lineHeight: 1.6,
                        }}
                      >
                        <li>Public transit available nearby</li>
                        <li>Limited parking available on site</li>
                        <li>Taxi drop-off point at main entrance</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--primary)",
                          margin: "0 0 10px 0",
                        }}
                      >
                        Nearby Amenities
                      </h5>
                      <ul
                        style={{
                          margin: 0,
                          padding: "0 0 0 20px",
                          color: "var(--neutral-700)",
                          fontSize: "14px",
                          lineHeight: 1.6,
                        }}
                      >
                        <li>Restaurants within walking distance</li>
                        <li>Convenience stores</li>
                        <li>ATM machines</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Highlights Tab Content */}
              <div 
                style={{ 
                  display: activeTab === "highlights" ? "block" : "none",
                  animation: activeTab === "highlights" ? "fadeIn 0.5s ease" : "none",
                  position: "relative", 
                  zIndex: 1,
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "var(--primary)",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <BiStar size={24} /> Event Highlights
                </h3>
                
                {/* Feature Banner - Extract from event description */}
                <div
                  style={{
                    position: "relative",
                    borderRadius: "16px",
                    overflow: "hidden",
                    height: "180px",
                    marginBottom: "25px",
                    boxShadow: "0 10px 25px rgba(111, 68, 255, 0.15)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${event.image})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      filter: "brightness(0.7)",
                    }}
                  />
                  
                  <div
                    style={{
                      position: "relative",
                      height: "100%",
                      padding: "25px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        display: "inline-block",
                        backgroundColor: "var(--primary)",
                        color: "white",
                        padding: "5px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "600",
                        marginBottom: "10px",
                        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      FEATURED
                    </div>
                    
                    <h4
                      style={{
                        margin: "0 0 5px 0",
                        color: "white",
                        fontSize: "24px",
                        fontWeight: "700",
                        textShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
                        fontFamily: "var(--font-heading)",
                      }}
                    >
                      {event.title}
                    </h4>
                    
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255, 255, 255, 0.9)",
                        fontSize: "15px",
                        fontWeight: "500",
                        textShadow: "0 1px 3px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      {event.date} at {event.venueName}
                    </p>
                  </div>
                </div>
                
                {/* Extract Highlights from Description */}
                {(() => {
                  // Parse the description to extract bullet points from the list
                  const tempDiv = document.createElement('div');
                  tempDiv.innerHTML = event.description;
                  
                  // Find all lists in the description
                  const lists = tempDiv.querySelectorAll('ul');
                  let highlights = [];
                  
                  // Extract list items from the first list we find
                  if (lists.length > 0) {
                    const listItems = lists[0].querySelectorAll('li');
                    listItems.forEach((item) => {
                      highlights.push(item.textContent.trim());
                    });
                  }
                  
                  // If no lists found or they're empty, use tags instead
                  if (highlights.length === 0 && event.tags) {
                    highlights = event.tags.map(tag => `Experience the best of ${tag}`);
                  }
                  
                  // Ensure we have at least 6 items
                  while (highlights.length < 6 && event.tags) {
                    highlights.push(`Exclusive ${event.tags[0]} experience`);
                  }
                  
                  // Get the first 6 highlights
                  return highlights.slice(0, 6).map((highlight, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "white",
                        padding: "20px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 12px rgba(111, 68, 255, 0.08)",
                        border: "1px solid var(--purple-100)",
                        transition: "all 0.3s ease",
                        cursor: "default",
                        marginBottom: "20px",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 8px 20px rgba(111, 68, 255, 0.12)";
                        e.currentTarget.style.borderColor = "var(--purple-300)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(111, 68, 255, 0.08)";
                        e.currentTarget.style.borderColor = "var(--purple-100)";
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "15px",
                        }}
                      >
                        <div
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            backgroundColor: "var(--purple-100)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--primary)",
                            flexShrink: 0,
                            marginTop: "3px",
                          }}
                        >
                          <BiStar size={18} />
                        </div>
                        
                        <div>
                          <p
                            style={{
                              margin: 0,
                              color: "var(--neutral-800)",
                              fontSize: "16px",
                              lineHeight: 1.5,
                              fontWeight: "600",
                            }}
                          >
                            {highlight}
                          </p>
                        </div>
                      </div>
                    </div>
                  ));
                })()}
                
                {/* Call to Action */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "30px",
                  }}
                >
                  <button
                    onClick={handleGetTickets}
                    style={{
                      backgroundColor: "var(--primary)",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      padding: "15px 25px",
                      fontSize: "16px",
                      fontWeight: "600",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 6px 15px rgba(111, 68, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontFamily: "var(--font-heading)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--purple-700)";
                      e.currentTarget.style.transform = "translateY(-3px)";
                      e.currentTarget.style.boxShadow = "0 8px 20px rgba(111, 68, 255, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "var(--primary)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 6px 15px rgba(111, 68, 255, 0.2)";
                    }}
                  >
                    <IoTicketOutline size={20} />
                    Get Tickets Now - {event.price.currency} {event.price.value}
                  </button>
                </div>
              </div>
              
              {/* More Info Tab Content */}
              <div 
                style={{ 
                  display: activeTab === "more" ? "block" : "none",
                  animation: activeTab === "more" ? "fadeIn 0.5s ease" : "none",
                  position: "relative", 
                  zIndex: 1,
                }}
              >
                <h3
                  style={{
                    fontSize: "22px",
                    fontWeight: "700",
                    color: "var(--primary)",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <BiInfoCircle size={24} /> Additional Information
                </h3>
                
                {/* Organizer Information */}
                <div
                  style={{
                    backgroundColor: "var(--purple-50)",
                    borderRadius: "16px",
                    overflow: "hidden",
                    marginBottom: "25px",
                    border: "1px solid var(--purple-100)",
                    boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
                  }}
                >
                  <div
                    style={{
                      padding: "20px 25px",
                      borderBottom: "1px solid var(--purple-100)",
                      backgroundColor: "white",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "var(--dark)",
                        margin: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ color: "var(--primary)" }}
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Organizer Information
                    </h4>
                  </div>
                  
                  <div
                    style={{
                      padding: "25px",
                      display: "flex",
                      flexDirection: window.innerWidth < 768 ? "column" : "row",
                      gap: "30px",
                    }}
                  >
                    <div
                      style={{
                        flex: "1",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "15px",
                          marginBottom: "20px",
                        }}
                      >
                        <div
                          style={{
                            width: "60px",
                            height: "60px",
                            borderRadius: "15px",
                            backgroundColor: "var(--primary)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "24px",
                            fontWeight: "700",
                            boxShadow: "0 5px 15px rgba(111, 68, 255, 0.2)",
                          }}
                        >
                          {event.organizer.name.charAt(0)}
                        </div>
                        
                        <div>
                          <h5
                            style={{
                              margin: "0 0 5px 0",
                              fontSize: "20px",
                              fontWeight: "700",
                              color: "var(--dark)",
                            }}
                          >
                            {event.organizer.name}
                          </h5>
                          
                          <div
                            style={{
                              fontSize: "14px",
                              color: "var(--neutral-600)",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: "8px",
                                height: "8px",
                                borderRadius: "50%",
                                backgroundColor: "#22c55e",
                              }}
                            />
                            Verified Organizer
                          </div>
                        </div>
                      </div>
                      
                      <p
                        style={{
                          margin: "0 0 15px 0",
                          fontSize: "15px",
                          lineHeight: 1.6,
                          color: "var(--neutral-700)",
                        }}
                      >
                        {event.organizer.description}
                      </p>
                      
                      {event.organizer.specialization && event.organizer.specialization.length > 0 && (
                        <div
                          style={{
                            margin: "0 0 15px 0",
                          }}
                        >
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: "600",
                              color: "var(--primary)",
                              marginBottom: "8px",
                            }}
                          >
                            Specializations
                          </div>
                          
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            {event.organizer.specialization.map((specialty, index) => (
                              <span
                                key={index}
                                style={{
                                  backgroundColor: "var(--purple-100)",
                                  color: "var(--primary)",
                                  padding: "4px 10px",
                                  borderRadius: "15px",
                                  fontSize: "12px",
                                  fontWeight: "600",
                                }}
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <button
                        onClick={() => setShowContactPopup(true)}
                        style={{
                          backgroundColor: "white",
                          color: "var(--primary)",
                          border: "1px solid var(--purple-200)",
                          borderRadius: "8px",
                          padding: "10px 15px",
                          fontSize: "14px",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.2s ease",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                          alignSelf: "flex-start",
                          marginTop: "auto",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = "var(--primary)";
                          e.currentTarget.style.color = "white";
                          e.currentTarget.style.borderColor = "var(--primary)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "white";
                          e.currentTarget.style.color = "var(--primary)";
                          e.currentTarget.style.borderColor = "var(--purple-200)";
                        }}
                      >
                        <svg 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                        >
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        Contact Organizer
                      </button>
                    </div>
                    
                    {organizerEvents.length > 0 && (
                      <div
                        style={{
                          flex: "1",
                          borderLeft: window.innerWidth < 768 ? "none" : "1px solid var(--purple-100)",
                          paddingLeft: window.innerWidth < 768 ? "0" : "30px",
                          marginTop: window.innerWidth < 768 ? "20px" : "0",
                          paddingTop: window.innerWidth < 768 ? "20px" : "0",
                          borderTop: window.innerWidth < 768 ? "1px solid var(--purple-100)" : "none",
                        }}
                      >
                        <h5
                          style={{
                            margin: "0 0 15px 0",
                            fontSize: "16px",
                            fontWeight: "700",
                            color: "var(--dark)",
                          }}
                        >
                          More Events by This Organizer
                        </h5>
                        
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "15px",
                          }}
                        >
                          {organizerEvents.slice(0, 2).map((orgEvent, index) => (
                            <div
                              key={index}
                              style={{
                                display: "flex",
                                gap: "12px",
                                padding: "12px",
                                backgroundColor: "white",
                                borderRadius: "10px",
                                cursor: "pointer",
                                transition: "all 0.2s ease",
                                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                              }}
                              onClick={() => navigate(`/events/${orgEvent.id}`)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = "var(--purple-50)";
                                e.currentTarget.style.transform = "translateX(5px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "white";
                                e.currentTarget.style.transform = "translateX(0)";
                              }}
                            >
                              <div
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  borderRadius: "8px",
                                  overflow: "hidden",
                                  flexShrink: 0,
                                }}
                              >
                                <img
                                  src={orgEvent.eventPoster}
                                  alt={orgEvent.eventName}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              
                              <div>
                                <h6
                                  style={{
                                    margin: "0 0 5px 0",
                                    fontSize: "15px",
                                    fontWeight: "600",
                                    color: "var(--dark)",
                                  }}
                                >
                                  {orgEvent.eventName}
                                </h6>
                                
                                <div
                                  style={{
                                    fontSize: "13px",
                                    color: "var(--primary)",
                                    fontWeight: "600",
                                    marginBottom: "2px",
                                  }}
                                >
                                  {orgEvent.date?.split(",")[0] || ""}
                                </div>
                                
                                <div
                                  style={{
                                    fontSize: "12px",
                                    color: "var(--neutral-600)",
                                  }}
                                >
                                  {orgEvent.venueName}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {organizerEvents.length > 2 && (
                          <button
                            onClick={() => navigate(`/page-not-found?organizer=${event.organizer.id}`)}
                            style={{
                              backgroundColor: "transparent",
                              color: "var(--primary)",
                              border: "none",
                              fontSize: "14px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              marginTop: "15px",
                              padding: "5px 0",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.textDecoration = "underline";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.textDecoration = "none";
                            }}
                          >
                            View all events
                            <svg 
                              width="16" 
                              height="16" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                              <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* FAQ Section */}
                <div
                  style={{
                    backgroundColor: "white",
                    padding: "25px",
                    borderRadius: "16px",
                    boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
                    marginBottom: "25px",
                    border: "1px solid var(--purple-100)",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "18px",
                      fontWeight: "700",
                      color: "var(--dark)",
                      marginBottom: "20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{ color: "var(--primary)" }}
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    Event FAQ
                  </h4>
                  
                  {/* FAQ Item - Expandable */}
                  <div
                    style={{
                      marginBottom: "15px",
                      borderBottom: "1px solid var(--purple-100)",
                      paddingBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "10px 5px",
                      }}
                      onClick={() => setShowMoreOptions(!showMoreOptions)}
                    >
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--neutral-800)",
                          margin: 0,
                        }}
                      >
                        What's included in my ticket?
                      </h5>
                      <span
                        style={{
                          transition: "transform 0.3s ease",
                          transform: showMoreOptions ? "rotate(180deg)" : "rotate(0deg)",
                          color: "var(--primary)",
                          fontSize: "12px",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                    
                    {/* FAQ Answer - Collapsible */}
                    <div
                      style={{
                        maxHeight: showMoreOptions ? "500px" : "0",
                        overflow: "hidden",
                        transition: "max-height 0.3s ease",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: 1.6,
                          color: "var(--neutral-700)",
                          marginTop: "10px",
                          padding: "0 5px 0 15px",
                          borderLeft: "2px solid var(--purple-200)",
                        }}
                      >
                        Your ticket includes entry to the event, access to all scheduled performances, and a complimentary welcome drink. VIP tickets include priority seating, exclusive meet-and-greet opportunities, and a commemorative program.
                      </p>
                    </div>
                  </div>
                  
                  {/* Additional FAQ items */}
                  <div
                    style={{
                      marginBottom: "15px",
                      borderBottom: "1px solid var(--purple-100)",
                      paddingBottom: "15px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "10px 5px",
                      }}
                    >
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--neutral-800)",
                          margin: 0,
                        }}
                      >
                        Is there a dress code?
                      </h5>
                      <span
                        style={{
                          color: "var(--primary)",
                          fontSize: "12px",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        cursor: "pointer",
                        padding: "10px 5px",
                      }}
                    >
                      <h5
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "var(--neutral-800)",
                          margin: 0,
                        }}
                      >
                        Can I get a refund if I can't attend?
                      </h5>
                      <span
                        style={{
                          color: "var(--primary)",
                          fontSize: "12px",
                        }}
                      >
                        ▼
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Sponsors section */}
                {event.sponsors && event.sponsors.length > 0 && (
                  <div
                    style={{
                      backgroundColor: "var(--purple-50)",
                      padding: "25px",
                      borderRadius: "16px",
                      boxShadow: "0 5px 15px rgba(111, 68, 255, 0.08)",
                      border: "1px solid var(--purple-100)",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "18px",
                        fontWeight: "700",
                        color: "var(--dark)",
                        marginBottom: "20px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <svg 
                        width="18" 
                        height="18" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        style={{ color: "var(--primary)" }}
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                      </svg>
                      Event Sponsors
                    </h4>
                    
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "12px",
                      }}
                    >
                      {event.sponsors.map((sponsor, index) => (
                        <div
                          key={index}
                          style={{
                            backgroundColor: "white",
                            padding: "12px 20px",
                            borderRadius: "10px",
                            boxShadow: "0 2px 8px rgba(111, 68, 255, 0.08)",
                            fontSize: "15px",
                            fontWeight: "600",
                            color: "var(--neutral-800)",
                            border: "1px solid var(--purple-100)",
                            transition: "all 0.2s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 5px 15px rgba(111, 68, 255, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 2px 8px rgba(111, 68, 255, 0.08)";
                          }}
                        >
                          {sponsor}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </ScrollAnimation>

        {/* Organizer info - New Modern Design */}
        <ScrollAnimation
          direction="up"
          distance={20}
          duration={0.8}
          delay={0.4}
        >
          <div
            style={{
              marginTop: "50px",
              marginBottom: "40px",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(111, 68, 255, 0.08)",
              border: "1px solid var(--purple-100)",
            }}
          >
            {/* Header section */}
            <div
              style={{
                background:
                  "linear-gradient(120deg, var(--accent-pink) 0%, var(--primary) 100%)",
                padding: "25px 35px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Animated decorative shapes */}
              <div
                style={{
                  position: "absolute",
                  top: "-20px",
                  right: "20%",
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-15px",
                  right: "40%",
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                }}
              />

              {/* Section title with icon */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  position: "relative",
                  zIndex: 5,
                }}
              >
                <div
                  style={{
                    width: "46px",
                    height: "46px",
                    borderRadius: "12px",
                    background: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "16px",
                    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: "white" }}
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "white",
                      fontFamily: "var(--font-heading)",
                      letterSpacing: "-0.5px",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.15)",
                    }}
                  >
                    Organized By
                  </h3>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      color: "rgba(255, 255, 255, 0.8)",
                      marginTop: "4px",
                    }}
                  >
                    Bringing you this amazing experience
                  </div>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div
              style={{
                padding: "0",
                display: "flex",
                flexDirection: window.innerWidth < 768 ? "column" : "row",
                background: "var(--neutral-50)",
              }}
            >
              {/* Left side - Organizer Profile */}
              <div
                style={{
                  padding: "30px",
                  flex: "0 0 300px",
                  borderRight:
                    window.innerWidth < 768
                      ? "none"
                      : "1px solid var(--purple-100)",
                  borderBottom:
                    window.innerWidth < 768
                      ? "1px solid var(--purple-100)"
                      : "none",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(180deg, var(--purple-50) 0%, var(--neutral-50) 100%)",
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "24px",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "60px",
                    fontWeight: "700",
                    marginBottom: "20px",
                    boxShadow: "0 15px 30px rgba(111, 68, 255, 0.2)",
                    position: "relative",
                  }}
                >
                  {event.organizer.name.charAt(0)}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      right: "-8px",
                      backgroundColor: "#22c55e",
                      width: "30px",
                      height: "30px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "3px solid white",
                      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                </div>

                {/* Organizer name */}
                <h3
                  style={{
                    margin: "0 0 5px 0",
                    fontSize: "24px",
                    fontWeight: "700",
                    color: "var(--dark)",
                    textAlign: "center",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {event.organizer.name}
                </h3>

                {/* Verified badge */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "4px 10px",
                    backgroundColor: "var(--purple-100)",
                    borderRadius: "20px",
                    marginBottom: "20px",
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: "600",
                      color: "var(--primary)",
                    }}
                  >
                    Verified Organizer
                  </span>
                </div>

                {/* Stats */}
                <div
                  style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "center",
                    gap: "16px",
                    marginBottom: "25px",
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "var(--primary)",
                      }}
                    >
                      {event.organizer.stats?.totalEvents || "0"}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--gray-medium)",
                      }}
                    >
                      Events
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "var(--primary)",
                      }}
                    >
                      {event.organizer.stats?.rating || "0"}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--gray-medium)",
                      }}
                    >
                      Rating
                    </div>
                  </div>

                  <div
                    style={{
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "22px",
                        fontWeight: "700",
                        color: "var(--primary)",
                      }}
                    >
                      {event.organizer.stats?.ticketsSold || "0"}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--gray-medium)",
                      }}
                    >
                      Tickets
                    </div>
                  </div>
                </div>

                {/* Contact button */}
                <button
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "var(--primary)",
                    color: "white",
                    borderRadius: "12px",
                    border: "none",
                    fontSize: "15px",
                    fontWeight: "600",
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    width: "100%",
                    maxWidth: "220px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: "0 8px 20px rgba(111, 68, 255, 0.15)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 25px rgba(111, 68, 255, 0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(111, 68, 255, 0.15)";
                  }}
                  onClick={() => setShowContactPopup(true)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.364 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.337 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  Contact Organizer
                </button>
              </div>

              {/* Right side - About & Other Events */}
              <div
                style={{
                  flex: "1 1 auto",
                  padding: "30px",
                }}
              >
                {/* About section */}
                <div
                  style={{
                    marginBottom: "30px",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "var(--dark)",
                      marginTop: 0,
                      marginBottom: "15px",
                      position: "relative",
                      paddingLeft: "15px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "4px",
                        height: "20px",
                        backgroundColor: "var(--primary)",
                        borderRadius: "2px",
                      }}
                    />
                    About the Organizer
                  </h4>
                  <p
                    style={{
                      margin: 0,
                      lineHeight: 1.7,
                      color: "var(--neutral-700)",
                      marginBottom: "15px",
                    }}
                  >
                    <strong style={{ color: "var(--primary)" }}>
                      {event.organizer.name}
                    </strong>{" "}
                    {event.organizer.description || 'Information about the organizer is not available.'}
                  </p>
                  
                  {/* Additional organizer details */}
                  {event.organizer.yearEstablished && (
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "var(--neutral-700)" }}>
                      <strong>Established:</strong> {event.organizer.yearEstablished}
                    </p>
                  )}
                  
                  {event.organizer.location && (
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "var(--neutral-700)" }}>
                      <strong>Location:</strong> {event.organizer.location}
                    </p>
                  )}
                  
                  {event.organizer.specialization && event.organizer.specialization.length > 0 && (
                    <p style={{ margin: "5px 0", fontSize: "14px", color: "var(--neutral-700)" }}>
                      <strong>Specialization:</strong> {event.organizer.specialization.join(", ")}
                    </p>
                  )}
                </div>

                {/* Past Events section */}
                <div>
                  <h4
                    style={{
                      fontSize: "20px",
                      fontWeight: "700",
                      color: "var(--dark)",
                      marginTop: 0,
                      marginBottom: "15px",
                      position: "relative",
                      paddingLeft: "15px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: "4px",
                        height: "20px",
                        backgroundColor: "var(--primary)",
                        borderRadius: "2px",
                      }}
                    />
                    Other Events
                  </h4>

                  {/* Event cards */}
                  <div
                    style={{
                      display: "flex",
                      gap: "15px",
                      overflowX: "auto",
                      padding: "5px 0 15px 0",
                    }}
                  >
                    {organizerEvents.length > 0 ? (
                      organizerEvents.map((orgEvent) => (
                        <div
                          key={orgEvent.id}
                          style={{
                            flex: "0 0 250px",
                            borderRadius: "12px",
                            overflow: "hidden",
                            boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                            border: "1px solid var(--purple-100)",
                            transition: "all 0.3s ease",
                            cursor: "pointer",
                          }}
                          onClick={() => navigate(`/events/${orgEvent.id}`)}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-5px)";
                            e.currentTarget.style.boxShadow =
                              "0 10px 25px rgba(111, 68, 255, 0.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow =
                              "0 5px 15px rgba(0, 0, 0, 0.05)";
                          }}
                        >
                          <div
                            style={{
                              height: "120px",
                              backgroundImage: `url(${orgEvent.eventPoster})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          />
                          <div
                            style={{
                              padding: "15px",
                            }}
                          >
                            <div
                              style={{
                                fontSize: "14px",
                                color: "var(--primary)",
                                fontWeight: "600",
                                marginBottom: "5px",
                              }}
                            >
                              {orgEvent.date?.split(',')[0]}
                            </div>
                            <div
                              style={{
                                fontSize: "16px",
                                fontWeight: "700",
                                color: "var(--dark)",
                                marginBottom: "10px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {orgEvent.eventName}
                            </div>
                            <div
                              style={{
                                fontSize: "13px",
                                color: "var(--gray-medium)",
                              }}
                            >
                              {orgEvent.venueName || orgEvent.eventAddress}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: "15px 0", color: "var(--gray-medium)", fontStyle: "italic" }}>
                        No other events found for this organizer.
                      </div>
                    )}
                  </div>

                  {organizerEvents.length > 0 && (
                    <button
                      style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "transparent",
                        color: "var(--primary)",
                        borderRadius: "10px",
                        border: "1px solid var(--purple-200)",
                        fontSize: "14px",
                        fontWeight: "600",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        justifyContent: "center",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--purple-50)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                      onClick={() => navigate(`/page-not-found?organizer=${event.organizer.id}`)}
                    >
                      View All Events by {event.organizer.name}
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6"></polyline>
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
      
      {/* Contact Popup */}
      {showContactPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            backdropFilter: "blur(5px)",
          }}
          onClick={() => setShowContactPopup(false)}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "30px",
              width: "90%",
              maxWidth: "420px",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.2)",
              position: "relative",
              animation: "fadeInUp 0.3s ease-out",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                backgroundColor: "var(--purple-50)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                color: "var(--neutral-800)",
              }}
              onClick={() => setShowContactPopup(false)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-100)";
                e.currentTarget.style.transform = "rotate(90deg)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-50)";
                e.currentTarget.style.transform = "rotate(0deg)";
              }}
            >
              <IoMdClose size={20} />
            </button>

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "20px",
                  backgroundColor: "var(--primary)",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "40px",
                  fontWeight: "700",
                  margin: "0 auto 15px auto",
                  boxShadow: "0 15px 30px rgba(111, 68, 255, 0.2)",
                }}
              >
                {event.organizer.name.charAt(0)}
              </div>
              <h3 style={{ 
                margin: "0 0 5px 0", 
                color: "var(--dark)",
                fontSize: "24px",
                fontFamily: "var(--font-heading)" 
              }}>
                {event.organizer.name}
              </h3>
              <p style={{ 
                margin: "0", 
                color: "var(--neutral-600)",
                fontSize: "14px" 
              }}>
                Contact Information
              </p>
            </div>

            {/* Contact Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Website */}
              <a
                href={`https://${event.organizer.website}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  backgroundColor: "var(--purple-50)",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "var(--neutral-800)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--purple-100)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--purple-50)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  boxShadow: "0 4px 10px rgba(111, 68, 255, 0.1)",
                  flexShrink: 0,
                }}>
                  <IoMdGlobe size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: "600", marginBottom: "3px" }}>Website</div>
                  <div style={{ fontSize: "14px", color: "var(--primary)" }}>{event.organizer.website}</div>
                </div>
              </a>

              {/* Email */}
              <a
                href={`mailto:${event.organizer.contactEmail}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  backgroundColor: "var(--purple-50)",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "var(--neutral-800)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--purple-100)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--purple-50)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  boxShadow: "0 4px 10px rgba(111, 68, 255, 0.1)",
                  flexShrink: 0,
                }}>
                  <IoMdMail size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: "600", marginBottom: "3px" }}>Email</div>
                  <div style={{ fontSize: "14px", color: "var(--primary)" }}>{event.organizer.contactEmail}</div>
                </div>
              </a>

              {/* Phone */}
              <a
                href={`tel:${event.organizer.phone}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  padding: "15px",
                  backgroundColor: "var(--purple-50)",
                  borderRadius: "12px",
                  textDecoration: "none",
                  color: "var(--neutral-800)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--purple-100)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--purple-50)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  backgroundColor: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--primary)",
                  boxShadow: "0 4px 10px rgba(111, 68, 255, 0.1)",
                  flexShrink: 0,
                }}>
                  <IoMdCall size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: "600", marginBottom: "3px" }}>Phone</div>
                  <div style={{ fontSize: "14px", color: "var(--primary)" }}>{event.organizer.phone}</div>
                </div>
              </a>
            </div>

            {/* CTA Button */}
            <button
              style={{
                width: "100%",
                marginTop: "25px",
                padding: "14px",
                borderRadius: "12px",
                backgroundColor: "var(--primary)",
                color: "white",
                border: "none",
                fontWeight: "600",
                fontSize: "16px",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 8px 20px rgba(111, 68, 255, 0.15)",
              }}
              onClick={() => {
                setShowContactPopup(false);
                // Add any additional action here if needed
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--purple-700)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 12px 25px rgba(111, 68, 255, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--primary)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 8px 20px rgba(111, 68, 255, 0.15)";
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
