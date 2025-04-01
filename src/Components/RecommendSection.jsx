import React, {
  useState,
  useRef,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Cards from "./Cards.jsx";

// Note: Scrollbar styling is now in imports.css for better maintainability

const Recommendations = ({
  title = "Recommended",
  events = [],
  containerId = "scrollContainer",
}) => {
  const scrollContainerRef = useRef(null);

  const { t } = useTranslation();

  // Navigation handlers with useRef instead of direct DOM manipulation
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Update navigation buttons based on scroll position
  const updateNavigationButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // Set up scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", updateNavigationButtons);
      // Initial check for button visibility
      updateNavigationButtons();
      return () => {
        container.removeEventListener("scroll", updateNavigationButtons);
      };
    }
  }, [updateNavigationButtons]);

  const handleScrollLeft = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, []);

  const handleScrollRight = useCallback(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollContainerRef.current.clientWidth / 2,
        behavior: "smooth",
      });
    }
  }, []);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = useCallback((e, action) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <div className="events-section-container" style={{ marginBottom: "80px" }}>
      {/* City selector and title */}
      <div
        className="events-section-header"
        style={{
          padding: "0 60px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2
          className="events-section-title"
          style={{
            fontSize: "34px",
            fontWeight: "700",
            fontFamily: "Poppins, sans-serif",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "rgb(0, 0, 0)",
            lineHeight: "51px",
            letterSpacing: "6%",
          }}
        >
          {title}
        </h2>

        {/* Navigation controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            position: "relative",
          }}
        >
          <div
            className="navigation-buttons"
            style={{
              display: "flex",
              gap: "15px",
              alignItems: "center",
            }}
          >
            <button
              onClick={handleScrollLeft}
              disabled={!showLeftButton}
              onKeyDown={(e) => handleKeyDown(e, handleScrollLeft)}
              aria-label="Scroll left"
              style={{
                width: "44px",
                height: "44px",
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
            >
              <MdNavigateBefore />
            </button>
            <button
              onClick={handleScrollRight}
              disabled={!showRightButton}
              onKeyDown={(e) => handleKeyDown(e, handleScrollRight)}
              aria-label="Scroll right"
              style={{
                width: "44px",
                height: "44px",
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
            >
              <MdNavigateNext />
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scrollable container */}
      <div
        id={containerId}
        ref={scrollContainerRef}
        className="scrollbar-container"
        style={{
          display: "flex",
          overflowX: "auto",
          gap: "1.5rem",
          padding: "0px 42px 38px 42px",
          scrollbarWidth: "thin",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none" /* Hide scrollbar in IE and Edge */,
        }}
      >
        {events.map((event, index) => (
          <div
            key={index}
            style={{
              flex: "0 0 auto",
              opacity: 1, // Default opacity for desktop
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
            className="event-card"
          >
            <Cards
              eventName={event.eventName}
              eventDate={event.eventDate}
              eventAddress={event.eventAddress}
              eventPrice={event.eventPrice}
              eventPoster={event.eventPoster}
              eventRanking={event.eventRanking}
              rankScore={event.rankScore}
              eventLocation={event.eventLocation}
              isRecommendation={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// PropTypes validation
Recommendations.propTypes = {
  title: PropTypes.string,
  location: PropTypes.string,
  events: PropTypes.arrayOf(
    PropTypes.shape({
      eventName: PropTypes.string.isRequired,
      eventDate: PropTypes.string.isRequired,
      eventAddress: PropTypes.string.isRequired,
      eventPrice: PropTypes.string.isRequired,
      eventPoster: PropTypes.string.isRequired,
      eventRanking: PropTypes.string.isRequired,
      eventLocation: PropTypes.string,
      rankScore: PropTypes.number,
    })
  ),
  containerId: PropTypes.string,
  onLocationChange: PropTypes.func,
  availableLocations: PropTypes.arrayOf(PropTypes.string),
};

export default Recommendations;
