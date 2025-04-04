import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getEventById, getEventsByOrganizer } from "../services/api.js";
import { ScrollAnimation } from "../utils/ScrollAnimation.jsx";

// Import Modular Components
import EventDetailsHeader from "../Components/EventDetails/EventDetailsHeader.jsx";
import EventMainInfo from "../Components/EventDetails/EventMainInfo.jsx";
import EventTabs from "../Components/EventDetails/EventTabs.jsx";
import OrgContactPopup from "../Components/EventDetails/OrgContactPopup.jsx";
import LoadingIndicator from "../Components/EventDetails/LoadingIndicator.jsx";
import EventContainer from "../Components/EventDetails/EventContainer.jsx";
import EventSEOWrapper from "../Components/EventDetails/EventSEOWrapper.jsx";
import NewOrganizerInfo from "../Components/EventDetails/NewOrganizerInfo.jsx";
import TicketSelection from "../Components/EventDetails/TicketSelection.jsx";
import CountdownTimer from "../Components/EventDetails/CountdownTimer.jsx";

function EventDetails() {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [expiryTime, setExpiryTime] = useState(null);
  const [showExpiryPopup, setShowExpiryPopup] = useState(false);
  const [isInTicketSection, setIsInTicketSection] = useState(false);
  const [organizerEvents, setOrganizerEvents] = useState([]);

  // Force component re-render for timer updates
  const [, forceUpdate] = useState();

  // Reset session state on page load/refresh
  useEffect(() => {
    // Reset all session-related states when component mounts (page load/refresh)
    setShowTimer(false);
    setShowTicketSelection(false);
    setShowExpiryPopup(false);
    setExpiryTime(null);

    // Listen for page visibility changes to reset session when returning to the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        setShowTimer(false);
        setShowTicketSelection(false);
        setShowExpiryPopup(false);
        setExpiryTime(null);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!showTimer) return;

    // Update every 500ms to ensure smooth timer display
    const timerUpdateInterval = setInterval(() => {
      forceUpdate({});
    }, 500);

    return () => clearInterval(timerUpdateInterval);
  }, [showTimer]);

  // Intersection Observer to detect if user is viewing the ticket selection section
  useEffect(() => {
    if (!showTicketSelection) return;

    const ticketSectionRef = document.getElementById('ticket-selection-section');
    if (!ticketSectionRef) return;

    const options = {
      root: null,
      rootMargin: '-100px 0px',
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        setIsInTicketSection(entry.isIntersecting);
      });
    }, options);

    observer.observe(ticketSectionRef);

    return () => {
      observer.disconnect();
    };
  }, [showTicketSelection]);

  useEffect(() => {
    // Fetch event details from API
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const eventData = await getEventById(eventId);

        // Format the event data from the API
        const formattedEvent = {
          id: eventData.id,
          title: eventData.eventName,
          tags: Array.isArray(eventData.tags) ? eventData.tags : [eventData.tags],
          image: eventData.eventPoster,
          date: eventData.date,
          time: eventData.time,
          venueName: eventData.venueName,
          venueAddress: eventData.venueAddress,
          locationMap: eventData.locationMap ||
            `https://maps.google.com/?q=${encodeURIComponent(eventData.venueAddress)}`,
          price: {
            currency: eventData.currency || "AUD",
            value: eventData.eventPrice,
          },
          description: eventData.description,
          organizer: {
            id: eventData.organizerId || '',
            name: eventData.organizer?.name || '',
            description: eventData.organizer?.description || '',
            location: eventData.organizer?.location || '',
            contactEmail: eventData.organizer?.contactEmail || '',
            phone: eventData.organizer?.phone || '',
            website: eventData.organizer?.website || '',
            specialization: eventData.organizer?.specialization || [],
            yearEstablished: eventData.organizer?.yearEstablished || '',
            stats: eventData.organizer?.stats || {
              totalEvents: 0,
              rating: 0,
              ticketsSold: "0"
            }
          },
          sponsors: eventData.sponsors || [],
        };

        setEvent(formattedEvent);

        // Now fetch all events from the same organizer
        if (eventData.organizerId) {
          try {
            const orgEvents = await getEventsByOrganizer(eventData.organizerId);
            // Filter out the current event and limit to 3
            const sameOrganizerEvents = orgEvents
              .filter(e => e.id !== eventData.id)
              .slice(0, 3);

            setOrganizerEvents(sameOrganizerEvents);
          } catch (error) {
            console.error("Error fetching organizer events:", error);
            setOrganizerEvents([]);
          }
        }

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
    // Show the ticket selection section
    setShowTicketSelection(true);

    // Initialize the timer (10 minutes from now)
    setExpiryTime(new Date(Date.now() + 600000));
    setShowTimer(true);

    // Scroll to ticket selection section after it's rendered
    setTimeout(() => {
      const ticketSection = document.getElementById('ticket-selection-section');
      if (ticketSection) {
        const yOffset = -20; // Small offset to show a bit of content above the section
        const y = ticketSection.getBoundingClientRect().top + window.pageYOffset + yOffset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      }
    }, 150); // Slightly longer timeout to ensure component is rendered
  };

  // Handle timer expiry
  const handleTimerExpire = () => {
    console.log("Timer expired - showing custom popup");

    // Reset ticket selection state
    setShowTimer(false);
    setShowTicketSelection(false);

    // Show custom expiry popup
    setShowExpiryPopup(true);
  };

  // Handle returning to the event after session expiry
  const handleReturnToEvent = () => {
    console.log("Returning to event - reloading page");

    // First reset all states
    setShowExpiryPopup(false);
    setShowTimer(false);
    setShowTicketSelection(false);
    setExpiryTime(null);

    // Scroll to top
    window.scrollTo(0, 0);

    // Force a page reload after a short delay
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!event) {
    return null;
  }

  // Event is ready to render
  return (
    <>
      <EventSEOWrapper event={event} eventId={eventId} />

      {/* Fixed Timer - Only shown when not in ticket section */}
      {showTimer && !isInTicketSection && (
        <div
          className="fixed-timer"
          style={{
            position: 'fixed',
            top: '90px',
            right: '20px',
            zIndex: 1000,
            width: '280px',
            transform: 'scale(0.85) translateX(0)',
            transformOrigin: 'top right',
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
            opacity: 1,
            animation: 'slideInFixed 0.3s ease-out'
          }}
        >
          <CountdownTimer expiryTime={expiryTime} onExpire={handleTimerExpire} />

          {/* Responsive styles */}
          <style>
            {`
              @keyframes slideInFixed {
                from {
                  opacity: 0;
                  transform: scale(0.85) translateX(50px);
                }
                to {
                  opacity: 1;
                  transform: scale(0.85) translateX(0);
                }
              }
              
              @media (max-width: 768px) {
                .fixed-timer {
                  top: 70px;
                  right: 10px;
                  width: 240px;
                  transform: scale(0.75);
                }
              }
              
              @media (max-width: 480px) {
                .fixed-timer {
                  top: auto;
                  bottom: 10px;
                  right: 10px;
                  width: 220px;
                  transform: scale(0.7);
                }
              }
            `}
          </style>
        </div>
      )}

      <EventContainer>
        <EventDetailsHeader event={event} />
        <EventMainInfo event={event} handleGetTickets={handleGetTickets} />

        {/* Ticket Selection Component - Only shown when Get Tickets is clicked */}
        {showTicketSelection && (
          <ScrollAnimation
            direction="up"
            distance={20}
            duration={0.8}
            delay={0.5}
          >
            <div
              id="ticket-selection-section"
              style={{
                position: 'relative',
                marginTop: '40px',
                marginBottom: '50px'
              }}
            >
              <button
                onClick={() => setShowTicketSelection(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'var(--purple-50)',
                  border: '1px solid var(--purple-100)',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(111, 68, 255, 0.08)',
                  zIndex: 20,
                  color: 'var(--purple-600)',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.background = 'var(--purple-100)';
                  e.currentTarget.style.color = 'var(--purple-800)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = 'var(--purple-50)';
                  e.currentTarget.style.color = 'var(--purple-600)';
                }}
              >
                ✕
              </button>
              <TicketSelection
                event={event}
                expiryTime={expiryTime}
                onExpire={handleTimerExpire}
                showTimer={showTimer && isInTicketSection}
              />
            </div>
          </ScrollAnimation>
        )}

        {/* Visual separator after ticket selection */}
        {showTicketSelection && (
          <div style={{
            height: '1px',
            background: 'linear-gradient(to right, rgba(111, 68, 255, 0.05), rgba(111, 68, 255, 0.2), rgba(111, 68, 255, 0.05))',
            margin: '20px 0 40px 0',
            width: '100%'
          }} />
        )}

        <EventTabs
          event={event}
          setShowContactPopup={setShowContactPopup}
          organizerEvents={organizerEvents}
          handleGetTickets={handleGetTickets}
          navigate={navigate}
        />

        {/* Organizer info - New Modern Design */}
        <NewOrganizerInfo
          event={event}
          organizerEvents={organizerEvents}
          setShowContactPopup={setShowContactPopup}
          navigate={navigate}
        />

        {/* Contact Popup */}
        {showContactPopup && (
          <OrgContactPopup event={event} setShowContactPopup={setShowContactPopup} />
        )}

        {/* Session Expiry Popup */}
        {showExpiryPopup && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10000,
              backdropFilter: 'blur(5px)'
            }}
            onClick={handleReturnToEvent}
          >
            <div
              style={{
                width: '90%',
                maxWidth: '450px',
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '30px',
                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                animation: 'fadeInPopup 0.3s ease-out'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Clock icon */}
              <div style={{
                width: '70px',
                height: '70px',
                backgroundColor: 'var(--purple-100)',
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="var(--purple-600)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
              </div>

              <h2 style={{
                fontSize: '24px',
                fontWeight: '800',
                color: 'var(--neutral-900)',
                marginBottom: '10px',
                fontFamily: 'var(--font-heading)'
              }}>Session Expired</h2>

              <p style={{
                fontSize: '16px',
                color: 'var(--neutral-600)',
                marginBottom: '25px',
                lineHeight: 1.5
              }}>
                Your ticket selection session has timed out. To purchase tickets, please start a new ticket selection.
              </p>

              <button
                onClick={handleReturnToEvent}
                style={{
                  backgroundColor: 'var(--purple-600)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px 25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 10px rgba(111, 68, 255, 0.2)',
                  fontFamily: 'var(--font-heading)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--purple-700)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--purple-600)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Return to Event
              </button>

              {/* Animation keyframes */}
              <style>
                {`
                  @keyframes fadeInPopup {
                    from {
                      opacity: 0;
                      transform: translateY(20px) scale(0.95);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0) scale(1);
                    }
                  }
                `}
              </style>
            </div>
          </div>
        )}
      </EventContainer>
    </>
  );
}

// Use a standard export statement
export default EventDetails;