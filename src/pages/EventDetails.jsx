import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineLocationMarker, HiOutlineExternalLink } from "react-icons/hi";
import { BsCalendar2Date } from "react-icons/bs";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { EventSEO } from "../utils/SEO.jsx";
import { getEventById } from "../services/api.js";
import { IoTicketOutline } from "react-icons/io5";

const EventDetails = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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

        // Log the raw event data from the API to debug
        console.log("Raw event data from API:", eventData);
        console.log("Tags from API:", eventData.tags);

        // Create a properly formatted event object from API data
        // Generate tags based on event data
        let eventTags = [];

        // Add basic tag from event type
        if (eventData.eventDateType === "today") {
          eventTags.push("Today's Event");
        } else if (eventData.eventDateType === "tomorrow") {
          eventTags.push("Tomorrow's Event");
        } else {
          eventTags.push("Featured Event");
        }

        // Add tags based on event name
        if (eventData.eventName.toLowerCase().includes("concert")) {
          eventTags.push("Music", "Live Concert");
        }
        if (eventData.eventName.toLowerCase().includes("dance")) {
          eventTags.push("Dance", "Nightlife");
        }
        if (eventData.eventName.toLowerCase().includes("festival")) {
          eventTags.push("Festival", "Music");
        }
        if (eventData.eventName.toLowerCase().includes("jazz")) {
          eventTags.push("Jazz", "Music");
        }
        if (eventData.eventName.toLowerCase().includes("art")) {
          eventTags.push("Art", "Exhibition");
        }
        if (eventData.eventName.toLowerCase().includes("love")) {
          eventTags.push("Themed", "Special");
        }

        // Add location as a tag
        eventTags.push(eventData.eventLocation);

        // Add API tags if available
        if (eventData.tags) {
          if (Array.isArray(eventData.tags)) {
            eventTags.push(...eventData.tags);
          } else {
            eventTags.push(eventData.tags);
          }
        }

        // Remove duplicates and keep unique tags
        const uniqueTags = [...new Set(eventTags)];

        // Fixed tags for testing (ensure multiple tags are shown)
        const testTags = [
          "Music",
          "Featured Event",
          "Live Performance",
          eventData.eventLocation,
          "Weekend",
        ];

        const formattedEvent = {
          id: eventData.id,
          title: eventData.eventName,
          // Use unique generated tags or the test tags
          tags: testTags,
          image: eventData.eventPoster,
          date: eventData.date,
          time: eventData.time,
          venueName: eventData.venueName,
          venueAddress: eventData.venueAddress,
          locationMap:
            eventData.locationMap ||
            `https://maps.google.com/?q=${encodeURIComponent(
              eventData.venueAddress
            )}`,
          price: {
            currency: "AUD",
            value: eventData.eventPrice,
          },
          description: eventData.description,
          organizer: eventData.organizer,
          sponsors: eventData.sponsors || [],
        };

        setEvent(formattedEvent);
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
            name: event.organizer,
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
                  gap: "2rem",
                  marginTop: "2rem",
                }}
              >
                {/* Date & Time */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",

                    padding: "15px",
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

                    padding: "15px",
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

        {/* Event Description - New Modern Design */}
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
            }}
          >
            {/* Header section */}
            <div
              style={{
                background:
                  "linear-gradient(120deg, var(--primary) 0%, var(--purple-700) 100%)",
                padding: "25px 35px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Animated decorative shapes */}
              <div
                style={{
                  position: "absolute",
                  top: "-30px",
                  right: "10%",
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  bottom: "-20px",
                  right: "30%",
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  right: "5%",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.12)",
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
                    style={{ color: "white" }}
                  >
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 16V12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 8H12.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
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
                    Event Details
                  </h3>
                  <div
                    style={{
                      fontSize: "15px",
                      fontWeight: "400",
                      color: "rgba(255, 255, 255, 0.8)",
                      marginTop: "4px",
                    }}
                  >
                    Everything you need to know about this experience
                  </div>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div
              style={{
                padding: "32px 70px",
                position: "relative",
                background: "var(--neutral-50)",
              }}
            >
              {/* Decorative pattern top */}
              <div
                style={{
                  position: "absolute",
                  top: "15px",
                  right: "35px",
                  opacity: 0.07,
                  zIndex: 0,
                }}
              >
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
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

              {/* Event description content */}
              <div
                className="event-description"
                style={{
                  position: "relative",
                  zIndex: 1,
                  color: "var(--neutral-800)",
                  fontSize: "16px",
                  lineHeight: 1.8,
                  fontWeight: "400",
                  maxWidth: "900px",
                }}
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
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
                  {event.organizer.charAt(0)}
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
                  {event.organizer}
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
                      24
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
                      4.9
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
                      5k+
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
                  onClick={() => navigate("/page-not-found")}
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
                    }}
                  >
                    <strong style={{ color: "var(--primary)" }}>
                      {event.organizer}
                    </strong>{" "}
                    is a leading event organizer known for creating exceptional
                    experiences for participants. With a proven track record of
                    successful events, they focus on attention to detail and
                    memorable moments. Their team of professionals works
                    tirelessly to ensure that each event exceeds expectations
                    and creates lasting impressions.
                  </p>
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
                    {/* Sample past events */}
                    {[1, 2, 3].map((index) => (
                      <div
                        key={index}
                        style={{
                          flex: "0 0 250px",
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.05)",
                          border: "1px solid var(--purple-100)",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onClick={() => navigate("/page-not-found")}
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
                            backgroundImage: `url(${event.image})`,
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
                            {["May 15", "Jun 20", "Jul 8"][index - 1]}
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
                            {
                              [
                                "Summer Festival",
                                "Jazz Night",
                                "Art Exhibition",
                              ][index - 1]
                            }
                          </div>
                          <div
                            style={{
                              fontSize: "13px",
                              color: "var(--gray-medium)",
                            }}
                          >
                            Sydney Opera House
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

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
                    onClick={() => navigate("/page-not-found")}
                  >
                    View All Events
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
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </>
  );
};

export default EventDetails;
