import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";
import Cards from "./Cards.jsx";

// Note: Scrollbar styling is now in imports.css for better maintainability

const EventsSection = ({ 
  title = "Events in", 
  location = "Sydney", 
  events = [],
  containerId = "scrollContainer",
  onLocationChange = () => {},
  availableLocations = ["Sydney", "Melbourne", "Brisbane", "Singapore", "Tokyo", "London", "New York"]
}) => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(location);
  const scrollContainerRef = useRef(null);
  const dropdownRef = useRef(null);
  
  const { t } = useTranslation();
  
  // Filter options
  const filterOptions = [
    t("eventsSection.filters.all"), 
    t("eventsSection.filters.today"), 
    t("eventsSection.filters.tomorrow"), 
    t("eventsSection.filters.thisWeek")
  ];
  
  // Keep selectedLocation in sync with location prop
  useEffect(() => {
    setSelectedLocation(location);
  }, [location]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Define handleFilterClick forward declaration to avoid dependency issues
  const handleFilterClickRef = useRef(null);
  
  // Filter the events based on the selected filter, location, and reassign sequential rankings
  const filteredEvents = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    // First, filter all events by location
    let locationFilteredEvents = events.filter(event => 
      // If an event has an eventLocation property, check if it matches the selected location
      // Otherwise check if the eventAddress contains the location name
      (event.eventLocation && event.eventLocation === location) || 
      (!event.eventLocation && event.eventAddress && event.eventAddress.includes(location))
    );
    
    // Then apply date filter
    let dateFilteredEvents = [];
    
    if (activeFilter === "All") {
      // For "All", include all events for this location
      dateFilteredEvents = [...locationFilteredEvents];
    } else {
      // For other filters, filter by date
      dateFilteredEvents = locationFilteredEvents.filter(event => {
        // Extract start date from format like "25 Mar - 27 Mar"
        const dateParts = event.eventDate.split(" - ")[0].split(" ");
        const day = parseInt(dateParts[0], 10);
        
        // Convert month abbreviation to month number (0-11)
        const monthMap = {
          'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
          'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
        };
        const month = monthMap[dateParts[1]];
        
        // Create a date object for the event start date (use current year)
        const eventDate = new Date(today.getFullYear(), month, day);
        
        // Adjust for next year if the month is earlier than current (for events at end/beginning of year)
        if (month < today.getMonth()) {
          eventDate.setFullYear(today.getFullYear() + 1);
        }
        
        // Filter based on the selected option
        switch (activeFilter) {
          case "Today":
            return eventDate.getTime() === today.getTime();
          case "Tomorrow":
            return eventDate.getTime() === tomorrow.getTime();
          case "This Week":
            return eventDate >= today && eventDate < nextWeek;
          default:
            return true;
        }
      });
    }
    
    // Sort filtered events by rankScore
    dateFilteredEvents.sort((a, b) => (b.rankScore || 0) - (a.rankScore || 0));
    
    // Create a new array with reassigned sequential rankings (1, 2, 3, 4...)
    const eventsWithSequentialRanking = dateFilteredEvents.map((event, index) => {
      // Create a new object to avoid modifying the original
      return {
        ...event,
        // Assign sequential ranking starting from 1
        eventRanking: String(index + 1)
      };
    });
    
    return eventsWithSequentialRanking;
  }, [events, activeFilter, location]);
  
  // Handle filter click
  const handleFilterClick = useCallback((filter) => {
    // Add visual feedback on click
    const button = document.querySelector(`.filter-tab[aria-pressed="true"]`);
    if (button) {
      button.style.transform = "scale(0.98)";
      setTimeout(() => {
        button.style.transform = "scale(1)";
      }, 150);
    }
    
    setActiveFilter(filter);
    
    // Scroll to the top of the container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, []);
  
  // Store the handle filter click function in a ref for use in handleLocationSelect
  useEffect(() => {
    handleFilterClickRef.current = handleFilterClick;
  }, [handleFilterClick]);
  
  // Handle location selection
  const handleLocationSelect = useCallback((newLocation) => {
    setSelectedLocation(newLocation);
    setIsDropdownOpen(false);
    
    // Call the parent's location change handler with the new location
    if (onLocationChange) {
      onLocationChange(newLocation);
    }
    
    // Reset filter to "All" when location changes
    if (handleFilterClickRef.current) {
      handleFilterClickRef.current("All");
    }
  }, [onLocationChange]);

  // Navigation handlers with useRef instead of direct DOM manipulation
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // Update navigation buttons based on scroll position
  const updateNavigationButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
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
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  }, []);

  return (
    <div className="events-section-container" style={{ marginBottom: "80px" }}>
      {/* City selector and title */}
      <div
        style={{
          padding: "0 60px",
          marginBottom: "20px",
        }}
      >
        <h2
          className="events-section-title"
          style={{
            fontSize: "34px",
            fontWeight: "500",
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
          <div 
            ref={dropdownRef}
            className="location-dropdown"
          >
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="events-section-location"
              aria-label={`Change location from ${selectedLocation}`}
              aria-expanded={isDropdownOpen}
              aria-haspopup="listbox"
              style={{
                fontSize: "34px",
                fontWeight: "205",
                fontFamily: "Poppins, sans-serif",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                color: "rgb(0, 0, 0)",
                lineHeight: "51px",
                letterSpacing: "6%",
                borderBottom: "1px solid #000",
                paddingBottom: "2px",
                cursor: "pointer",
                background: "none",
                border: "none",
                padding: 0,
                outline: "none",
              }}
            >
              {selectedLocation}
              <span style={{ marginLeft: "5px", transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }}>▾</span>
            </button>
            
            {isDropdownOpen && (
              <div
                className="location-dropdown-content"
                role="listbox"
                aria-label="Select a location"
              >
                {availableLocations.map((city) => (
                  <div
                    key={city}
                    className={`location-dropdown-item ${selectedLocation === city ? 'selected' : ''}`}
                    role="option"
                    aria-selected={selectedLocation === city}
                    onClick={() => handleLocationSelect(city)}
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "16px",
                    }}
                  >
                    {city}
                  </div>
                ))}
              </div>
            )}
          </div>
        </h2>
      </div>

      {/* Filter options */}
      <div
        style={{
          padding: "0 60px",
          borderBottom: "1px solid rgba(0,0,0,0.1)",
          marginBottom: "5px",
          position: "relative",
        }}
      >
        <div
          className="filter-options-container"
          style={{
            display: "flex",
            gap: "40px",
          }}
        >
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => handleFilterClick(filter)}
              className={`filter-tab ${activeFilter === filter ? 'active' : ''}`}
              aria-pressed={activeFilter === filter}
              style={{
                color: activeFilter === filter ? "#000" : "#666",
                marginRight: "10px",
              }}
            >
              {filter}
            </button>
          ))}

          {/* Navigation controls */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              position: "absolute",
              right: "40px",
              top: "-26px", // Adjusted for better alignment with the new buttons
            }}
          >
            <div
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
              >
                <MdNavigateBefore />
              </button>
              <button
                onClick={handleScrollRight}
                disabled={!showRightButton}
                onKeyDown={(e) => handleKeyDown(e, handleScrollRight)}
                aria-label="Scroll right"
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
              >
                <MdNavigateNext />
              </button>
            </div>
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
          gap: "3rem",
          padding: "40px 60px 30px",
          scrollbarWidth: "thin",
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
          msOverflowStyle: "none" /* Hide scrollbar in IE and Edge */,
        }}
      >
        {/* Display empty state if no events */}
        {filteredEvents.length === 0 ? (
          <div 
            style={{
              width: "100%", 
              textAlign: "center", 
              padding: "60px 0",
              color: "#666",
              fontFamily: "Poppins, sans-serif",
              fontSize: "18px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "15px"
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{t("eventsSection.noEvents.title")}</div>
            <div>{t("eventsSection.noEvents.message", { location: location, filter: activeFilter })}</div>
            <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
              <button 
                onClick={() => handleFilterClick("All")}
                style={{
                  background: "none",
                  border: "1px solid #666",
                  borderRadius: "4px",
                  padding: "8px 16px",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f3f3f3" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none" }}
              >
                {t("eventsSection.noEvents.viewAll")}
              </button>
            </div>
          </div>
        ) : (
          /* Display all event cards */
          filteredEvents.map((event, index) => (
            <div key={index} style={{ flex: "0 0 auto" }}>
              <Cards
                eventName={event.eventName}
                eventDate={event.eventDate}
                eventAddress={event.eventAddress}
                eventPrice={event.eventPrice}
                eventPoster={event.eventPoster}
                eventRanking={event.eventRanking}
                rankScore={event.rankScore}
                eventLocation={event.eventLocation}
              />
            </div>
          ))
        )}
      </div>

      {/* Scrollbar styles are now in imports.css */}
    </div>
  );
};

// PropTypes validation
EventsSection.propTypes = {
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

export default EventsSection;