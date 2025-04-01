import React, { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SlCalender } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";
import { HiOutlineTicket } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { BiTime } from "react-icons/bi";

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

  // Random values for demo purposes
  const randomAttending = Math.floor(Math.random() * 200) + 50;
  const randomHour = Math.floor(Math.random() * 12) + 1;
  const randomMinute = Math.floor(Math.random() * 60);
  const randomAmPm = Math.random() > 0.5 ? "PM" : "AM";
  const randomScore = Math.floor(Math.random() * 5) + 1;
  
  // Format the random time
  const randomTime = `${randomHour}:${randomMinute.toString().padStart(2, '0')} ${randomAmPm}`;

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
      {/* Featured tag for first 3 items */}
      {parseInt(eventRanking) <= 3 && isRecommendation && (
        <div className="featured-tag">Featured</div>
      )}

      {/* Event image */}
      <div style={{
        position: "relative",
        height: "55%",
        overflow: "hidden",
        borderRadius: "16px 16px 0 0",
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
          background: "linear-gradient(0deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 60%)",
          opacity: isHovered ? 0.8 : 0.5,
          transition: "opacity 0.3s ease",
        }}></div>

        {/* Time of day badge */}
        <div style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          color: "var(--dark)",
          padding: "6px 12px",
          borderRadius: "30px",
          fontSize: "12px",
          fontWeight: "600",
          display: "flex",
          alignItems: "center",
          gap: "4px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}>
          <BiTime />
          {randomTime}
        </div>
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
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "10px",
            lineHeight: "1.3",
            color: "var(--dark)",
          }}>
            {eventName}
          </h3>

          <div style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "8px",
            fontSize: "13px",
            color: "var(--gray-medium)",
          }}>
            <SlCalender style={{ color: "var(--primary)", marginRight: "8px" }} />
            {eventDate}
          </div>

          <div style={{
            display: "flex",
            alignItems: "flex-start",
            fontSize: "13px",
            color: "var(--gray-medium)",
            marginBottom: "8px",
          }}>
            <IoLocationOutline style={{ 
              color: "var(--primary)", 
              marginRight: "8px",
              marginTop: "2px",
              flexShrink: 0,
            }} />
            <span style={{ lineHeight: "1.4" }}>{eventAddress}</span>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              color: "var(--gray-medium)",
            }}>
              <HiOutlineTicket style={{ color: "var(--primary)", marginRight: "8px" }} />
              {randomAttending} attending
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              fontSize: "13px",
              color: "var(--gray-medium)",
              gap: "4px",
            }}>
              <FaStar style={{ color: "#FFD700" }} />
              <span>{randomScore}.0</span>
            </div>
          </div>
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