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

const EventDetails = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [expiryTime, setExpiryTime] = useState(null);
  const [isInTicketSection, setIsInTicketSection] = useState(false);
  const [organizerEvents, setOrganizerEvents] = useState([]);
  
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
    
    // Scroll to ticket selection section
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }, 100);
  };
  
  // Handle timer expiry
  const handleTimerExpire = () => {
    setShowTimer(false);
    setShowTicketSelection(false);
    alert('Your session has expired. The page will now refresh.');
    window.location.reload();
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
            transform: 'scale(0.85)',
            transformOrigin: 'top right',
            transition: 'all 0.3s ease',
            filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
          }}
        >
          <CountdownTimer expiryTime={expiryTime} onExpire={handleTimerExpire} />
          
          {/* Responsive styles */}
          <style>
            {`
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

        {/* Contact Popup */}
        {showContactPopup && (
          <OrgContactPopup event={event} setShowContactPopup={setShowContactPopup} />
        )}
      </EventContainer>
    </>
  );
};

export default EventDetails;