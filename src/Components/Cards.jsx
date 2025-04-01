import React, { useState, useCallback, memo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { SlCalender } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";

// Styles object with responsive adjustments
const style = {
  card: {
    position: "relative",
    width: "23rem",
    height: "33rem",
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
    background: "rgb(255, 255, 255)",
    borderRadius: "8px",
    fontFamily: "Poppins, sans-serif",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
    cursor: "pointer",
    "@media (maxWidth: 768px)": {},
  },
  // Hover effect for card
  cardHover: {
    transform: "scale(1.03)",
    boxShadow: "0px 12px 30px rgba(0, 0, 0, 0.2)",
  },
  // Main event image section - clean with no overlays or text
  cardImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#333",
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    transition: "transform 0.5s ease, filter 0.5s ease",
    overflow: "hidden",
  },
  // Image container to handle overflow of zoomed image
  imageContainer: {
    width: "100%",
    height: "70%",
    overflow: "hidden",
    position: "relative",
  },
  // Darkening overlay for image
  imageDarkOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0)",
    transition: "background-color 0.5s ease",
    zIndex: 1,
  },
  // Darkening overlay for image on hover
  imageDarkOverlayHover: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  // Image zoom on hover
  cardImageHover: {
    transform: "scale(1.1)",
  },
  // Large number in the corner
  cornerNumber: {
    position: "absolute",
    top: "-35px",
    left: "-15px",
    zIndex: 2,
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    color: "rgb(255, 255, 255)",
    fontFamily: "Montserrat",
    fontSize: "150px",
    fontWeight: 800,
    lineHeight: "120px",
    letterSpacing: "0%",
    textAlign: "left",
    webkitTextStroke: "10px black",
    paintOrder: "stroke fill",
    "@media (maxWidth: 768px)": {
      fontSize: "120px",
      top: "-25px",
      left: "-10px",
    },
  },
  // Main content section below the image
  content: {
    padding: "20px 25px",
  },
  // Title of the event
  eventTitle: {
    fontSize: "20px",
    fontWeight: "800",
    color: "#000000",
    textTransform: "uppercase",
    marginBottom: "15px",
    lineHeight: "1.2",
    "@media (maxWidth: 768px)": {
      fontSize: "20px",
    },
  },
  // Container for both info sections
  infoContainer: {
    display: "flex",
    marginTop: "12px",
    width: "100%",
  },
  // Container for all icons
  iconsColumn: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "14px",
    width: "24px",
    marginRight: "10px",
  },
  // Container for all text details
  detailsColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    flex: 1,
  },
  // Consistent icon style for both icons
  icon: {
    color: "#666666",
    fontSize: "18px",
    width: "18px",
    height: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  iconLocation: {
    color: "#666666",
    fontSize: "24px",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  // Text styling for date
  dateText: {
    color: "#000000",
    fontSize: "14px",
    fontWeight: "500",
    lineHeight: "1.4",
  },
  // Text styling for location
  locationText: {
    color: "#000000",
    fontSize: "14px",
    fontWeight: "400",
    width: "55%",
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: "1.4",
  },
  // Price badge styled as a button
  priceBadge: {
    position: "absolute",
    bottom: "25px",
    right: "25px",
    backgroundColor: "#FFFFFF",
    color: "#000",
    border: "1px solid #000",
    borderRadius: "5px",
    padding: "10px 15px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  // Hover state for price button
  priceBadgeHover: {
    backgroundColor: "#000",
    color: "#FFFFFF",
    transform: "translateY(-2px)",
    boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
  },
};

const Cards = memo(function Cards({
  eventName,
  eventPoster,
  eventAddress,
  eventDate,
  eventPrice,
  eventRanking,
  // rankScore is used for sorting but not in UI, so commenting to avoid lint error
  // rankScore,
  // eventLocation is used for filtering but not in UI, so commenting to avoid lint error
  // eventLocation,
  isRecommendation = false, // new prop to identify recommendation cards
}) {
  const { t } = useTranslation();
  // State to track hover states
  const [isPriceHovered, setIsPriceHovered] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);

  // Handlers for price button hover
  const handlePriceMouseEnter = useCallback(() => setIsPriceHovered(true), []);
  const handlePriceMouseLeave = useCallback(() => setIsPriceHovered(false), []);

  // Handlers for card hover
  const handleCardMouseEnter = useCallback(() => setIsCardHovered(true), []);
  const handleCardMouseLeave = useCallback(() => setIsCardHovered(false), []);

  // Handler for price button click
  const handlePriceClick = useCallback(
    (e) => {
      e.stopPropagation(); // Prevent triggering card click event
      console.log(
        `Booking ticket for ${eventName} at price: AUD ${eventPrice}`
      );
      // In a real app, this could open a booking modal or navigate to a checkout page
    },
    [eventName, eventPrice]
  );

  // Handler for card click
  const handleCardClick = useCallback(() => {
    console.log(`Viewing details for ${eventName}`);
    // In a real app, this could navigate to event details page
  }, [eventName]);

  // Default fallback values for props
  const displayName = eventName || "BROWN EVERYWHERE";
  const displayDate = eventDate || "25 Mar - 27 Mar";
  const displayAddress = eventAddress || "Pulse Live (Former Yang), Singapore";
  const displayPoster =
    eventPoster ||
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop";
  const displayRanking = eventRanking;

  return (
    <div
      className={`card`}
      style={{
        ...style.card,
        ...(isCardHovered ? style.cardHover : {}),
      }}
      onMouseEnter={handleCardMouseEnter}
      onMouseLeave={handleCardMouseLeave}
      onClick={handleCardClick}
      role="button"
      aria-label={`Event: ${displayName}`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {isRecommendation && (
        <div style={style.cornerNumber}>{displayRanking}</div>
      )}
      <div style={style.imageContainer}>
        <div
          style={{
            ...style.cardImage,
            ...(isCardHovered ? style.cardImageHover : {}),
            backgroundImage: `url(${displayPoster})`,
          }}
          aria-hidden="true"
        />
        <div
          style={{
            ...style.imageDarkOverlay,
            ...(isCardHovered ? style.imageDarkOverlayHover : {}),
          }}
          aria-hidden="true"
        />
      </div>

      <div style={style.content}>
        <div style={style.eventTitle}>{displayName}</div>
        <div style={style.infoContainer}>
          <div style={style.iconsColumn} aria-hidden="true">
            <SlCalender style={style.icon} />
            <IoLocationOutline style={style.iconLocation} />
          </div>
          <div style={style.detailsColumn}>
            <div style={style.dateText}>{displayDate}</div>
            <div style={style.locationText}>{displayAddress}</div>
          </div>
        </div>
      </div>

      {eventPrice && (
        <button
          style={{
            ...style.priceBadge,
            ...(isPriceHovered ? style.priceBadgeHover : {}),
          }}
          onMouseEnter={handlePriceMouseEnter}
          onMouseLeave={handlePriceMouseLeave}
          onClick={handlePriceClick}
          aria-label={`Book ticket from AUD ${eventPrice}`}
        >
          {t("eventsSection.priceLabel", { price: eventPrice })}
        </button>
      )}
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
