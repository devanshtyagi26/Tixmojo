import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { HiOutlineLocationMarker, HiOutlineExternalLink } from "react-icons/hi";
import { BsCalendar2Date } from "react-icons/bs";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { PageSEO } from "../utils/SEO.jsx";
import { getEventById } from "../services/api.js";
import { IoTicketOutline } from "react-icons/io5";

const EventDetails = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <PageSEO
        title={event.title}
        description={`Join us for ${event.title} - ${event.tags[0]} on ${event.date}. Get tickets now!`}
        path={`/events/${eventId}`}
        keywords={`events, ${event.tags
          .map((t) => t.toLowerCase())
          .join(", ")}, ${event.title.toLowerCase()}, tickets`}
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
                fontFamily: "Raleway, sans-serif",
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
                      cursor: "default",
                      background: "#e0f2f1",
                      text: "#00695c",
                      shadow: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        tagColor.shadow !== "none"
                          ? tagColor.shadow.replace("0.15", "0.25")
                          : "0 2px 8px rgba(0, 0, 0, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = tagColor.shadow;
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
                          fontFamily: "Raleway, sans-serif",
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
                      fontFamily: "Raleway, sans-serif",
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

        {/* Event Description */}
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
              background:
                "linear-gradient(165deg, var(--purple-50) 0%, white 100%)",
              borderRadius: "18px",
              padding: "40px 35px 35px",
              boxShadow: "0 15px 35px rgba(111, 68, 255, 0.1)",
              border: "1px solid var(--purple-100)",
              overflow: "hidden",
            }}
          >
            {/* Decorative accent elements */}
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "6px",
                background:
                  "linear-gradient(90deg, var(--purple-300) 0%, var(--primary) 100%)",
              }}
            ></div>

            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, var(--purple-100) 0%, transparent 70%)",
                opacity: "0.4",
                zIndex: 0,
              }}
            ></div>

            {/* Title element with decorative shape */}
            <div
              style={{
                position: "relative",
                marginBottom: "25px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "var(--primary)",
                  padding: "10px 22px",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "20px",
                  fontFamily: "Raleway, sans-serif",
                  borderRadius: "12px",
                  boxShadow: "0 6px 15px rgba(111, 68, 255, 0.25)",
                  position: "relative",
                  zIndex: 2,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  style={{ marginRight: "10px" }}
                >
                  <path
                    d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 16V12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 8H12.01"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                About This Event
              </div>
              <div
                style={{
                  position: "absolute",
                  right: "-15px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  width: "30px",
                  height: "30px",
                  background: "var(--purple-200)",
                  borderRadius: "50%",
                  zIndex: 1,
                  opacity: 0.7,
                }}
              ></div>
            </div>

            {/* Content with enhanced design */}
            <div
              style={{
                position: "relative",
                zIndex: 1,
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "14px",
                padding: "25px",
                boxShadow: "0 4px 15px rgba(111, 68, 255, 0.06)",
                border: "1px solid var(--purple-100)",
              }}
            >
              {/* Decorative quotation marks */}
              <div
                style={{
                  position: "absolute",
                  top: "-5px",
                  left: "10px",
                  fontSize: "60px",
                  fontFamily: "Georgia, serif",
                  color: "var(--purple-200)",
                  opacity: "0.7",
                  zIndex: 0,
                  lineHeight: 0.8,
                  pointerEvents: "none",
                }}
              >
                "
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "-30px",
                  right: "10px",
                  fontSize: "60px",
                  fontFamily: "Georgia, serif",
                  color: "var(--purple-200)",
                  opacity: "0.7",
                  zIndex: 0,
                  lineHeight: 0.8,
                  pointerEvents: "none",
                }}
              >
                "
              </div>

              <div
                className="event-description"
                style={{
                  lineHeight: "1.9",
                  color: "var(--neutral-800)",
                  fontSize: "16px",
                  position: "relative",
                  zIndex: 1,
                  fontWeight: "400",
                  letterSpacing: "0.2px",
                }}
                dangerouslySetInnerHTML={{ __html: event.description }}
              />
            </div>
          </div>
        </ScrollAnimation>

        {/* Organizer info */}
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
              display: "flex",
              flexDirection: window.innerWidth < 768 ? "column" : "row",
              gap: "30px",
              alignItems: window.innerWidth < 768 ? "flex-start" : "center",
              background:
                "linear-gradient(145deg, var(--purple-50) 0%, white 100%)",
              borderRadius: "18px",
              padding: "35px",
              boxShadow: "0 15px 35px rgba(111, 68, 255, 0.12)",
              border: "1px solid var(--purple-100)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Decorative elements */}
            <div
              style={{
                position: "absolute",
                top: "0",
                right: "0",
                width: "120px",
                height: "120px",
                background:
                  "radial-gradient(circle, var(--purple-200) 0%, transparent 70%)",
                opacity: "0.4",
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "absolute",
                left: "-60px",
                bottom: "-60px",
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, var(--purple-100) 0%, transparent 70%)",
                opacity: "0.5",
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "absolute",
                right: "80px",
                bottom: "20px",
                width: "15px",
                height: "15px",
                borderRadius: "50%",
                backgroundColor: "var(--purple-300)",
                opacity: "0.6",
                zIndex: 0,
              }}
            />

            <div
              style={{
                position: "absolute",
                right: "40px",
                top: "60px",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "var(--purple-400)",
                opacity: "0.5",
                zIndex: 0,
              }}
            />

            {/* Organizer avatar section with enhanced styling */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 1,
                position: "relative",
              }}
            >
              {/* Avatar container with decorative ring */}
              <div
                style={{
                  position: "relative",
                  width: "100px",
                  height: "100px",
                  marginBottom: "18px",
                  padding: "5px",
                  background:
                    "linear-gradient(135deg, var(--purple-200) 0%, var(--purple-400) 100%)",
                  borderRadius: "50%",
                  boxShadow: "0 8px 25px rgba(111, 68, 255, 0.25)",
                }}
              >
                {/* Glowing effect behind avatar */}
                <div
                  style={{
                    position: "absolute",
                    top: "-8px",
                    left: "-8px",
                    right: "-8px",
                    bottom: "-8px",
                    borderRadius: "50%",
                    background:
                      "radial-gradient(circle, rgba(111, 68, 255, 0.2) 0%, transparent 70%)",
                    zIndex: 0,
                  }}
                />

                {/* Actual avatar */}
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background:
                      "linear-gradient(135deg, var(--primary) 0%, var(--purple-800) 100%)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    fontWeight: "800",
                    fontSize: "36px",
                    position: "relative",
                    zIndex: 1,
                    boxShadow: "inset 0 4px 10px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {event.organizer.charAt(0)}
                </div>
              </div>

              {/* Badge with enhanced styling */}
              <div
                style={{
                  position: "relative",
                  backgroundColor: "var(--primary)",
                  borderRadius: "30px",
                  padding: "8px 20px 8px 40px",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "15px",
                  fontFamily: "Raleway, sans-serif",
                  boxShadow: "0 5px 15px rgba(111, 68, 255, 0.25)",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {/* Verified icon */}
                <div
                  style={{
                    position: "absolute",
                    left: "15px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                      stroke="white"
                      strokeWidth="2"
                    />
                    <path
                      d="M7.5 12L10.5 15L16.5 9"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                Verified Organizer
              </div>
            </div>

            {/* Organizer content with enhanced styling */}
            <div
              style={{
                zIndex: 1,
                flex: 1,
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "14px",
                padding: "25px",
                boxShadow: "0 8px 25px rgba(111, 68, 255, 0.08)",
                border: "1px solid var(--purple-100)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <div
                  style={{
                    width: "4px",
                    height: "25px",
                    borderRadius: "2px",
                    backgroundColor: "var(--primary)",
                    marginRight: "12px",
                  }}
                />
                <div
                  style={{
                    fontSize: "28px",
                    fontWeight: "700",
                    color: "var(--dark)",
                    fontFamily: "Raleway, sans-serif",
                    letterSpacing: "0.5px",
                  }}
                >
                  {event.organizer}
                </div>
              </div>

              <div
                style={{
                  fontSize: "16px",
                  lineHeight: "1.7",
                  color: "var(--gray-medium)",
                  marginBottom: "22px",
                  position: "relative",
                  paddingLeft: "15px",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: "0",
                    top: "0",
                    bottom: "0",
                    width: "3px",
                    borderRadius: "3px",
                    background:
                      "linear-gradient(to bottom, var(--purple-300), transparent)",
                    opacity: "0.5",
                  }}
                />
                Verified event creator with a track record of organizing
                exceptional experiences.
                <strong style={{ color: "var(--purple-700)" }}>
                  {" "}
                  {event.organizer}
                </strong>{" "}
                is known for attention to detail and creating memorable events
                in Sydney. Contact for any questions about this experience.
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "15px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  style={{
                    backgroundColor: "var(--primary)",
                    color: "white",
                    border: "none",
                    borderRadius: "10px",
                    padding: "12px 22px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 6px 15px rgba(111, 68, 255, 0.25)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateY(-3px) scale(1.02)";
                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(111, 68, 255, 0.35)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 15px rgba(111, 68, 255, 0.25)";
                  }}
                  onClick={() => navigate("/page-not-found")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.908.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Contact Organizer
                </button>
                <button
                  style={{
                    backgroundColor: "white",
                    color: "var(--primary)",
                    border: "1px solid var(--purple-300)",
                    borderRadius: "10px",
                    padding: "12px 22px",
                    fontWeight: "600",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    transition: "all 0.3s ease",
                    boxShadow: "0 4px 12px rgba(111, 68, 255, 0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--purple-50)";
                    e.currentTarget.style.borderColor = "var(--primary)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 15px rgba(111, 68, 255, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "white";
                    e.currentTarget.style.borderColor = "var(--purple-300)";
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 12px rgba(111, 68, 255, 0.08)";
                  }}
                  onClick={() => navigate("/page-not-found")}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M19 21v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                      stroke="var(--primary)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  View More Events
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </>
  );
};

export default EventDetails;
