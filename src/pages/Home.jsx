import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import EventsSection from "../Components/EventsSection.jsx";
import FlyerCarousel from "../Components/FlyerCarousel.jsx";
import NewRecommendSection from "../Components/NewRecommendSection.jsx";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { PageSEO } from "../utils/SEO.jsx";
import { getAllEvents, getSpotlightEvents, getFlyers, getLocations, getEventsFromServer } from "../services/api.js";

import "../i18n";

function Home() {
  const { t, i18n } = useTranslation();
  const [popularEventsLocation, setPopularEventsLocation] = useState("Sydney");
  const [events, setEvents] = useState([]);
  const [spotlightEvents, setSpotlightEvents] = useState([]);
  const [availableLocations, setAvailableLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format date for display
  const formatDate = (date) => {
    const day = date.getDate();
    const monthNames = t("eventsSection.dateFormat.months", { returnObjects: true });
    const month = monthNames[date.getMonth()];
    return `${day} ${month}`;
  };

  // Calculate dates for different event types
  const dates = useMemo(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 5); // 5 days from now

    const futureDate1 = new Date(today);
    futureDate1.setDate(futureDate1.getDate() + 14);

    const futureDate2 = new Date(today);
    futureDate2.setDate(futureDate2.getDate() + 30);

    return {
      today: formatDate(today),
      tomorrow: formatDate(tomorrow),
      thisWeek: formatDate(nextWeek),
      nextWeek: formatDate(futureDate1),
      nextMonth: formatDate(futureDate2)
    };
  }, [i18n.language]);

  // Format server events for display in EventsSection
  const formatServerEvents = (serverEvents) => {
    if (!Array.isArray(serverEvents) || serverEvents.length === 0) {
      console.warn("No events data received from server or invalid format");
      // Create some mock events as fallback
      return [
        {
          id: "mock-event-1",
          eventName: "SAMPLE EVENT 1",
          eventPoster: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
          eventAddress: "Sydney Opera House, Sydney",
          eventDate: "3 Apr",
          eventPrice: "299",
          eventRanking: "1",
          rankScore: 95,
          eventLocation: "Sydney"
        },
        {
          id: "mock-event-2",
          eventName: "SAMPLE EVENT 2",
          eventPoster: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2940&auto=format&fit=crop",
          eventAddress: "Olympic Park, Sydney",
          eventDate: "5 Apr",
          eventPrice: "199",
          eventRanking: "2",
          rankScore: 90,
          eventLocation: "Sydney"
        }
      ];
    }

    return serverEvents.map((event, index) => {
      if (!event) return null;
      
      try {
        console.log("Processing event:", event.id);
        
        // Handle different possible data structures safely
        const address = event.eventAddress || 
          (event.venueName && event.venueAddress ? `${event.venueName}, ${event.venueAddress}` : 
          (event.venueAddress || "Sydney, Australia"));
        
        let displayDate = "Upcoming";
        try {
          // Try different date formats
          if (event.date && typeof event.date === 'string') {
            const dateParts = event.date.split(',');
            if (dateParts.length >= 2) {
              displayDate = dateParts[1].trim();
            }
          } else if (event.eventDate) {
            displayDate = event.eventDate;
          }
        } catch (dateError) {
          console.warn("Error parsing date for event", event.id, dateError);
        }
        
        // Create display format expected by Cards component
        return {
          id: event.id || `event-${index}`,
          eventName: event.eventName || "Event " + (index + 1),
          eventPoster: event.eventPoster || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
          eventAddress: address,
          eventDate: displayDate,
          eventPrice: event.eventPrice || "Free",
          eventRanking: event.eventRanking || String(index + 1),
          rankScore: event.rankScore || 100 - index,
          eventLocation: event.eventLocation || "Sydney",
          // Preserve the eventDateType field which is essential for filtering
          eventDateType: event.eventDateType,
          // Add any other fields needed by Cards component
          date: event.date,
          time: event.time,
          tags: event.tags || ["Event"],
          description: event.description || "Join us for this exciting event!"
        };
      } catch (error) {
        console.error("Error processing event:", error, event);
        return null;
      }
    }).filter(event => event !== null); // Remove any null events
  };

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch each data type separately for better error handling
        let serverEventsData = [];
        let spotlightData = [];
        let locationsData = ["Sydney", "Melbourne", "Brisbane", "Singapore"]; // Default locations
        
        try {
          // Get raw events from server
          serverEventsData = await getEventsFromServer(popularEventsLocation);
          console.log("Raw events data from server:", serverEventsData);
        } catch (error) {
          console.error("Error fetching raw events:", error);
          // On error, fall back to standard events API
          try {
            serverEventsData = await getAllEvents(popularEventsLocation);
            console.log("Fallback: Using standard events API", serverEventsData);
          } catch (fallbackError) {
            console.error("Fallback events API also failed:", fallbackError);
          }
        }
        
        // Get spotlight events
        try {
          spotlightData = await getSpotlightEvents(popularEventsLocation);
        } catch (error) {
          console.error("Error fetching spotlight events:", error);
        }
        
        // Get locations
        try {
          locationsData = await getLocations();
        } catch (error) {
          console.error("Error fetching locations:", error);
          // Keep using default locations defined above
        }
        
        // Format server data for display
        const formattedEvents = formatServerEvents(serverEventsData);
        console.log("Formatted events:", formattedEvents);
        
        setEvents(formattedEvents);
        setSpotlightEvents(spotlightData); 
        setAvailableLocations(locationsData);
        
        setLoading(false);
      } catch (error) {
        console.error("Error in fetch data process:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, [popularEventsLocation]);

  // Handler for popular events location selector
  const handlePopularLocationChange = (newLocation) => {
    setPopularEventsLocation(newLocation);
  };

  return (
    <>
      <PageSEO 
        title="Find and Book Amazing Events" 
        description="Discover top events, concerts, and shows in your area. TixMojo helps you find tickets for the best live entertainment experiences."
        path="/"
        keywords="events, tickets, concerts, shows, festivals, entertainment, live music"
      />
      
      {loading ? (
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          height: "70vh" 
        }}>
          <div style={{ 
            color: "var(--primary)",
            fontSize: "18px",
            fontWeight: "500"
          }}>
            Loading events...
          </div>
        </div>
      ) : (
        <>
          {/* Hero Section with Carousel */}
          <ScrollAnimation direction="down" distance={30} duration={1.2}>
            <FlyerCarousel />
          </ScrollAnimation>
          
          {/* Popular Events Section */}
          <ScrollAnimation direction="up" distance={40} duration={1} delay={0.2}>
            <EventsSection
              title={t("eventsSection.sectionTitles.popular")}
              location={popularEventsLocation}
              events={events}
              containerId="popularEventsContainer"
              onLocationChange={handlePopularLocationChange}
              availableLocations={availableLocations}
            />
          </ScrollAnimation>
          
          {/* New Recommendation Section without rankings - using spotlight events data */}
          <ScrollAnimation direction="up" distance={40} duration={1} delay={0.3}>
            <NewRecommendSection
              title={t("eventsSection.sectionTitles.spotlight")}
              subtitle={t("eventsSection.subtitle.spotlight")}
              events={spotlightEvents}
              containerId="trendingRecommendations"
            />
          </ScrollAnimation>
        </>
      )}
    </>
  );
}

export default Home;