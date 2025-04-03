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

        // Create a properly formatted event object from API data
        const formattedEvent = {
          id: eventData.id,
          title: eventData.eventName,
          tag:
            eventData.eventDateType === "today"
              ? "Today's Event"
              : eventData.eventDateType === "tomorrow"
              ? "Tomorrow's Event"
              : "Featured Event",
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
        description={`Join us for ${event.title} - ${event.tag} on ${event.date}. Get tickets now!`}
        path={`/events/${eventId}`}
        keywords={`events, ${event.tag.toLowerCase()}, ${event.title.toLowerCase()}, tickets`}
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
                marginBottom: "10px",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              {event.title}
            </h1>

            <div
              style={{
                display: "inline-block",
                backgroundColor: "var(--neutral-200)",
                borderRadius: "50px",
                padding: "6px 16px",
                fontSize: "14px",
                color: "var(--neutral-800)",
                fontWeight: "500",
              }}
            >
              # {event.tag}
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
          <div style={{ marginTop: "50px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "var(--dark)",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              About This Event
            </h2>
            <div
              className="event-description"
              style={{
                lineHeight: "1.7",
                color: "var(--neutral-800)",
                fontSize: "16px",
              }}
              dangerouslySetInnerHTML={{ __html: event.description }}
            />
          </div>
        </ScrollAnimation>

        {/* Organizer info */}
        <ScrollAnimation
          direction="up"
          distance={20}
          duration={0.8}
          delay={0.4}
        >
          <div style={{ marginTop: "40px" }}>
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "700",
                marginBottom: "20px",
                color: "var(--dark)",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              Organizer
            </h2>
            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary-light)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: "15px",
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "18px",
                }}
              >
                {event.organizer.charAt(0)}
              </div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "var(--dark)",
                }}
              >
                {event.organizer}
              </div>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </>
  );
};

export default EventDetails;
