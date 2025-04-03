import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import EventsSection from "../Components/EventsSection.jsx";
import FlyerCarousel from "../Components/FlyerCarousel.jsx";
import NewRecommendSection from "../Components/NewRecommendSection.jsx";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";
import { PageSEO } from "../utils/SEO.jsx";

import "../i18n";

function Home() {
  const { t, i18n } = useTranslation();
  const [popularEventsLocation, setPopularEventsLocation] = useState(
    t("eventsSection.locations.default")
  );

  // Get events data from i18n
  const eventsData = t("eventsSection.eventsData", { returnObjects: true });
  
  // Get spotlight events data from i18n
  const spotlightEventsData = t("eventsSection.spotlightEvents", { returnObjects: true });

  // Format date based on current locale
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

  // Helper function to add dates to events
  const addDatesToEvents = (events) => {
    return events.map(event => {
      let eventDate;
      
      switch(event.eventDateType) {
        case 'today':
          eventDate = `${dates.today} - ${dates.today}`;
          break;
        case 'tomorrow':
          eventDate = `${dates.tomorrow} - ${dates.tomorrow}`;
          break;
        case 'thisWeek':
          eventDate = `${dates.thisWeek} - ${dates.thisWeek}`;
          break;
        case 'nextWeek':
          eventDate = `${dates.nextWeek} - ${dates.nextWeek}`;
          break;
        case 'nextMonth':
          eventDate = `${dates.nextMonth} - ${dates.nextMonth}`;
          break;
        default:
          eventDate = `${dates.today} - ${dates.tomorrow}`;
      }
      
      return { ...event, eventDate };
    });
  };

  // Add dynamic dates to regular events data based on eventDateType
  const eventsWithDates = useMemo(() => {
    return addDatesToEvents(eventsData);
  }, [eventsData, dates, i18n.language]);
  
  // Add dynamic dates to spotlight events data
  const spotlightEventsWithDates = useMemo(() => {
    return addDatesToEvents(spotlightEventsData);
  }, [spotlightEventsData, dates, i18n.language]);

  // Get available locations for dropdowns from i18n
  const locationKeys = t("eventsSection.availableLocations", { returnObjects: true });
  const availableLocations = useMemo(() => {
    return locationKeys.map(key => t(`eventsSection.locations.${key}`));
  }, [t, locationKeys]);

  // Handler for popular events location selector
  const handlePopularLocationChange = (newLocation) => {
    setPopularEventsLocation(newLocation);
  };

  // Only the popular events location handler is needed

  return (
    <>
      <PageSEO 
        title="Find and Book Amazing Events" 
        description="Discover top events, concerts, and shows in your area. TixMojo helps you find tickets for the best live entertainment experiences."
        path="/"
        keywords="events, tickets, concerts, shows, festivals, entertainment, live music"
      />
      
      {/* Hero Section with Carousel */}
      <ScrollAnimation direction="down" distance={30} duration={1.2}>
        <FlyerCarousel />
      </ScrollAnimation>

      
      {/* Popular Events Section */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.2}>
        <EventsSection
          title={t("eventsSection.sectionTitles.popular")}
          location={popularEventsLocation}
          events={eventsWithDates}
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
          events={spotlightEventsWithDates}
          containerId="trendingRecommendations"
        />
      </ScrollAnimation>
    </>
  );
}

export default Home;
