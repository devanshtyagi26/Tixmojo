import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Cards from "./Cards";

// Recommendation Section displays a horizontal scrollable list of events
// This component uses the original Cards component but scales it down to show 4 cards at once
function RecommendationSection({ events, containerId }) {
  const { t } = useTranslation();
  const containerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle window resize and update cardStyles
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Update navigation buttons based on scroll position
  const updateNavigationButtons = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Scroll left when the left button is clicked
  const scrollLeft = () => {
    if (containerRef.current) {
      // Scroll by 2 cards worth of width (about half the container)
      containerRef.current.scrollBy({
        left: -containerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  // Scroll right when the right button is clicked
  const scrollRight = () => {
    if (containerRef.current) {
      // Scroll by 2 cards worth of width (about half the container)
      containerRef.current.scrollBy({
        left: containerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  };

  // Set up scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updateNavigationButtons);
      // Initial check for button visibility
      updateNavigationButtons();
      return () => {
        container.removeEventListener("scroll", updateNavigationButtons);
      };
    }
  }, []);

  // Make sure there are events to display
  if (!events || events.length === 0) {
    return null;
  }

  return (
    <div style={{ margin: "60px 0" }}>
      {/* Section heading with Recommended title */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: windowWidth <= 768 ? "0 20px" : "0 60px",
        }}
      >
        <h2
          style={{
            fontSize: windowWidth <= 768 ? "28px" : "32px",
            fontWeight: "700",
            marginRight: "20px",
            whiteSpace: "nowrap",
          }}
        >
          {t("eventsSection.sectionTitles.recommended")}
        </h2>

        {/* Navigation buttons */}
        <div style={{ display: "flex", gap: "15px" }}>
          <button
            onClick={scrollLeft}
            disabled={!showLeftButton}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: showLeftButton ? "#000" : "#e0e0e0",
              color: "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: showLeftButton ? "pointer" : "default",
              fontSize: "24px",
            }}
            aria-label="Scroll left"
          >
            <MdNavigateBefore />
          </button>
          <button
            onClick={scrollRight}
            disabled={!showRightButton}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              backgroundColor: showRightButton ? "#000" : "#e0e0e0",
              color: "#fff",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: showRightButton ? "pointer" : "default",
              fontSize: "24px",
            }}
            aria-label="Scroll right"
          >
            <MdNavigateNext />
          </button>
        </div>
      </div>

      {/* Scrollable container for event cards */}
      <div
        id={containerId}
        ref={containerRef}
        style={{
          display: "flex",
          overflowX: "auto",
          scrollbarWidth: "none", // Hide scrollbar for Firefox
          msOverflowStyle: "none", // Hide scrollbar for IE/Edge
          padding: windowWidth <= 768 ? "0 20px" : "0 60px",
          gap: windowWidth <= 480 ? "120px" : "110px", // Adjust gap for screen size
          scrollSnapType: "x mandatory",
          position: "relative",
          marginLeft: windowWidth <= 768 ? "0" : "60px",
        }}
        className="hide-scrollbar" // For webkit browsers (Chrome, Safari)
      >
        {/* Map through events and render each card with scaling */}
        {events.map((event, index) => {
          // Responsive card styling based on window width
          const cardStyle = {
            flex: "0 0 auto",
            transformOrigin: "center left",
            scrollSnapAlign: "start",
          };

          // Responsive settings based on window width
          if (windowWidth > 1200) {
            // Desktop view: 4 cards per view
            Object.assign(cardStyle, {
              width: "23%",
              transform: "scale(0.75)",
              margin: "-40px -30px",
              minWidth: "260px",
              height: "40rem",
            });
          } else if (windowWidth > 768) {
            // Tablet view: 3 cards per view
            Object.assign(cardStyle, {
              width: "30%",
              transform: "scale(0.8)",
              margin: "-30px -20px",
              minWidth: "230px",
            });
          } else if (windowWidth > 480) {
            // Small tablet view: 2 cards per view
            Object.assign(cardStyle, {
              width: "45%",
              transform: "scale(0.85)",
              margin: "-25px -15px",
              minWidth: "200px",
            });
          } else {
            // Mobile view: 1 card per view
            Object.assign(cardStyle, {
              width: "85%",
              transform: "scale(0.9)",
              margin: "-15px -10px",
              minWidth: "180px",
            });
          }

          return (
            <div key={index} style={cardStyle}>
              <Cards
                eventName={event.eventName}
                eventDate={event.eventDate}
                eventAddress={event.eventAddress}
                eventPrice={event.eventPrice}
                eventPoster={event.eventPoster}
                eventRanking={event.eventRanking}
                eventLocation={event.eventLocation}
                isRecommendation={true}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

RecommendationSection.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventName: PropTypes.string.isRequired,
      eventDate: PropTypes.string.isRequired,
      eventAddress: PropTypes.string.isRequired,
      eventPrice: PropTypes.string,
      eventPoster: PropTypes.string,
      eventRanking: PropTypes.string,
      eventLocation: PropTypes.string,
    })
  ).isRequired,
  containerId: PropTypes.string.isRequired,
};

export default RecommendationSection;
