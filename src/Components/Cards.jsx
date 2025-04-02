import React, { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SlCalender } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";

const Cards = memo(function Cards({
  eventName,
  eventPoster,
  eventAddress,
  eventDate,
  eventPrice,
  eventRanking,
  isRecommendation = false,
}) {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleClick = useCallback(() => {
    console.log(`Viewing details for ${eventName}`);
    // In a real app, this could navigate to event details page
  }, [eventName]);

  const handleButtonClick = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent triggering card click event
      console.log(`Booking ticket for ${eventName} at price: AUD ${eventPrice}`);
      // In a real app, this could open a booking modal or navigate to a checkout page
    },
    [eventName, eventPrice]
  );

  // Removed random values for demo purposes

  return (
    <div
      className="card"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      role="button"
      aria-label={`Event: ${eventName}`}
      tabIndex={0}
      style={{
        cursor: "pointer",
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Ranking badge with circular background */}
      {eventRanking && (
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          zIndex: 10,
          width: "45px",
          height: "45px",
          borderRadius: "50%",
          backgroundColor: "var(--primary-light)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
          border: "1px solid var(--primary)",
          transition: "transform 0.3s ease",
        }}>
          {/* Ranking number */}
          <span style={{
            fontSize: "30px",
            fontWeight: "700",
            lineHeight: "1",
            color: "white",
            fontFamily: "Raleway, sans-serif",
            marginTop: "-6px" // Slight adjustment to visually center the number
          }}>
            {eventRanking}
          </span>
        </div>
      )}

      {/* Event image */}
      <div style={{
        position: "relative",
        height: "55%",
        overflow: "hidden",
        borderRadius: "8px 8px 0 0",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${eventPoster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "transform 0.5s ease",
          transform: isHovered ? "scale(1.1)" : "scale(1)",
        }}></div>
        
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "linear-gradient(0deg, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.1) 100%)",
          opacity: isHovered ? 0.9 : 0.6,
          transition: "opacity 0.3s ease",
        }}></div>
      </div>

      {/* Content */}
      <div style={{
        padding: "20px",
        height: "45%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}>
        <div>
          <h3 style={{
            fontSize: "20px",
            fontWeight: "800",
            marginBottom: "12px",
            lineHeight: "1.3",
            color: "var(--dark)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
            fontFamily: "Raleway, sans-serif",
          }}>
            {eventName}
          </h3>

          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "10px",
            fontSize: "14px",
            color: "var(--gray-medium)",
          }}>
            <SlCalender style={{ color: "var(--primary)", marginRight: "10px", fontSize: "16px" }} />
            <span style={{ fontWeight: "500" }}>{eventDate}</span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "flex-start",
            fontSize: "14px",
            color: "var(--gray-medium)",
            marginBottom: "12px",
          }}>
            <IoLocationOutline style={{ 
              color: "var(--primary)", 
              marginRight: "10px",
              marginTop: "2px",
              flexShrink: 0,
              fontSize: "18px"
            }} />
            <span style={{ lineHeight: "1.4", fontWeight: "500" }}>{eventAddress}</span>
          </div>

          {/* Removed attending and rating sections */}
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "10px",
        }}>
          <div style={{
            fontSize: "14px",
            color: "var(--gray-medium)",
            fontWeight: "500",
          }}>
            From
          </div>
          
          <button
            className="price-badge"
            onClick={handleButtonClick}
            aria-label={`Book ticket from AUD ${eventPrice}`}
            style={{
              border: "1px solid var(--dark)",
              background: "var(--light)",
              color: "var(--dark)",
              borderRadius: "4px",
              padding: "8px 12px",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "none"
            }}
          >
            {t("eventsSection.priceLabel", { price: eventPrice })}
          </button>
        </div>
      </div>
    </div>
  );
});

// PropTypes validation
Cards.propTypes = {
  eventName: PropTypes.string,
  eventPoster: PropTypes.string,
  eventAddress: PropTypes.string,
  eventDate: PropTypes.string,
  eventPrice: PropTypes.string,
  eventRanking: PropTypes.string,
  rankScore: PropTypes.number,
  eventLocation: PropTypes.string,
  isRecommendation: PropTypes.bool,
};

export default Cards;