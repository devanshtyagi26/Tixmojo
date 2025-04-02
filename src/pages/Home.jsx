import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import EventsSection from "../Components/EventsSection.jsx";
import FlyerCarousel from "../Components/FlyerCarousel.jsx";
import NewRecommendSection from "../Components/NewRecommendSection.jsx";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";

import "../i18n";
// Get today and tomorrow's dates formatted as "DD MMM"
const formatDate = (date) => {
  const day = date.getDate();
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[date.getMonth()];
  return `${day} ${month}`;
};

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayFormatted = formatDate(today);
const tomorrowFormatted = formatDate(tomorrow);

// Create next week date
const nextWeek = new Date(today);
nextWeek.setDate(nextWeek.getDate() + 5); // 5 days from now
const nextWeekFormatted = formatDate(nextWeek);

// Create dates for future events
const futureDate1 = new Date(today);
futureDate1.setDate(futureDate1.getDate() + 14);
const futureFormatted1 = formatDate(futureDate1);

const futureDate2 = new Date(today);
futureDate2.setDate(futureDate2.getDate() + 30);
const futureFormatted2 = formatDate(futureDate2);

// Event data with concert images, date-aware events, locations, and rank scores
const eventsData = [
  {
    eventName: "TODAY'S LIVE CONCERT",
    eventDate: `${todayFormatted} - ${todayFormatted}`,
    eventRanking: "1",
    eventAddress: "Pulse Live (Former Yang), Sydney",
    eventLocation: "Sydney",
    eventPrice: "399",
    eventPoster:
      "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2940&auto=format&fit=crop",
    rankScore: 95, // High rank score for today's event
  },
  {
    eventName: "TOMORROW'S DANCE PARTY",
    eventDate: `${tomorrowFormatted} - ${tomorrowFormatted}`,
    eventRanking: "1", // First position for tomorrow's events
    eventAddress: "Marina Bay Sands, Sydney",
    eventLocation: "Sydney",
    eventPrice: "299",
    eventPoster:
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2574&auto=format&fit=crop",
    rankScore: 90,
  },
  {
    eventName: "THIS WEEK FESTIVAL",
    eventDate: `${nextWeekFormatted} - ${nextWeekFormatted}`,
    eventRanking: "1", // First position for this week's events
    eventAddress: "National Stadium, Sydney",
    eventLocation: "Sydney",
    eventPrice: "499",
    eventPoster:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2940&auto=format&fit=crop",
    rankScore: 88,
  },
  {
    eventName: "TODAY'S JAZZ NIGHT",
    eventDate: `${todayFormatted} - ${todayFormatted}`,
    eventRanking: "2", // Second position for today's events
    eventAddress: "Esplanade Concert Hall, Sydney",
    eventLocation: "Sydney",
    eventPrice: "199",
    eventPoster:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=2940&auto=format&fit=crop",
    rankScore: 85,
  },
  {
    eventName: "TOMORROW'S COMEDY SHOW",
    eventDate: `${tomorrowFormatted} - ${tomorrowFormatted}`,
    eventRanking: "2", // Second position for tomorrow's events
    eventAddress: "Sentosa Beach, Sydney",
    eventLocation: "Sydney",
    eventPrice: "249",
    eventPoster:
      "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2850&auto=format&fit=crop",
    rankScore: 82,
  },
  {
    eventName: "NEXT MONTH SYMPHONIC",
    eventDate: `${futureFormatted2} - ${futureFormatted2}`,
    eventRanking: "1", // First position for next month's events
    eventAddress: "Victoria Concert Hall, Sydney",
    eventLocation: "Sydney",
    eventPrice: "349",
    eventPoster:
      "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?q=80&w=2940&auto=format&fit=crop",
    rankScore: 75,
  },
  {
    eventName: "NEXT WEEK EDM PARTY",
    eventDate: `${futureFormatted1} - ${futureFormatted1}`,
    eventRanking: "1", // First position for next week's events
    eventAddress: "Gardens by the Bay, Sydney",
    eventLocation: "Sydney",
    eventPrice: "450",
    eventPoster:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2940&auto=format&fit=crop",
    rankScore: 80,
  },
  {
    eventName: "THIS WEEK INDIE ROCK",
    eventDate: `${nextWeekFormatted} - ${nextWeekFormatted}`,
    eventRanking: "2", // Second position for this week's events
    eventAddress: "The Promontory, Sydney",
    eventLocation: "Sydney",
    eventPrice: "279",
    eventPoster:
      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2940&auto=format&fit=crop",
    rankScore: 78,
  },
  {
    eventName: "TODAY'S OUTDOOR FESTIVAL",
    eventDate: `${todayFormatted} - ${todayFormatted}`,
    eventRanking: "3", // Lower position for today's events
    eventAddress: "Botanical Gardens, Sydney",
    eventLocation: "Sydney",
    eventPrice: "159",
    eventPoster:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2940&auto=format&fit=crop",
    rankScore: 70,
  },
  {
    eventName: "TOMORROW'S ART EXHIBITION",
    eventDate: `${tomorrowFormatted} - ${tomorrowFormatted}`,
    eventRanking: "3", // Lower position for tomorrow's events
    eventAddress: "Modern Art Gallery, Sydney",
    eventLocation: "Sydney",
    eventPrice: "120",
    eventPoster:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=2940&auto=format&fit=crop",
    rankScore: 65,
  },
  {
    eventName: "THIS WEEK THEATER SHOW",
    eventDate: `${nextWeekFormatted} - ${nextWeekFormatted}`,
    eventRanking: "3", // Lower position for this week's events
    eventAddress: "Sydney Opera House, Sydney",
    eventLocation: "Sydney",
    eventPrice: "299",
    eventPoster:
      "https://images.unsplash.com/photo-1607998803461-4e9aaa2291a0?q=80&w=2940&auto=format&fit=crop",
    rankScore: 60,
  },
];

function Home() {
  const { t } = useTranslation();
  const [popularEventsLocation, setPopularEventsLocation] = useState(
    t("eventsSection.locations.sydney")
  );

  const [trendingEventsLocation, setTrendingEventsLocation] = useState(
    t("eventsSection.locations.melbourne")
  );

  const [upcomingEventsLocation, setUpcomingEventsLocation] = useState(
    t("eventsSection.locations.newYork")
  );

  // Define available locations for dropdowns
  const availableLocations = [
    t("eventsSection.locations.sydney"),
    t("eventsSection.locations.melbourne"),
    t("eventsSection.locations.singapore"),
    t("eventsSection.locations.tokyo"),
    t("eventsSection.locations.newYork"),
  ];

  // Handler for popular events location selector
  const handlePopularLocationChange = (newLocation) => {
    setPopularEventsLocation(newLocation);
  };

  // Handler for trending events location selector
  const handleTrendingLocationChange = (newLocation) => {
    setTrendingEventsLocation(newLocation);
  };

  // Handler for upcoming events location selector
  const handleUpcomingLocationChange = (newLocation) => {
    setUpcomingEventsLocation(newLocation);
  };

  return (
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
          events={eventsData}
          containerId="popularEventsContainer"
          onLocationChange={handlePopularLocationChange}
          availableLocations={availableLocations}
        />
      </ScrollAnimation>
      
      {/* New Recommendation Section without rankings */}
      <ScrollAnimation direction="up" distance={40} duration={1} delay={0.3}>
        <NewRecommendSection
          title="Spotlight Events"
          subtitle="Curated selection of must-see events you don't want to miss"
          events={eventsData.slice(0, 8)}
          containerId="trendingRecommendations"
        />
      </ScrollAnimation>
    </>
  );
}

export default Home;
