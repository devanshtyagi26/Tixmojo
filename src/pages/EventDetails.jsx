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

const EventDetails = () => {
  const { t } = useTranslation();
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [showTicketSelection, setShowTicketSelection] = useState(false);
  const [organizerEvents, setOrganizerEvents] = useState([]);

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
    
    // Scroll to ticket selection section
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
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
            <div style={{ 
              position: 'relative',
              marginBottom: '50px'
            }}>
              <button
                onClick={() => setShowTicketSelection(false)}
                style={{
                  position: 'absolute',
                  top: '15px',
                  right: '15px',
                  background: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  zIndex: 20,
                  color: 'var(--neutral-700)',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.color = 'var(--primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.color = 'var(--neutral-700)';
                }}
              >
                ✕
              </button>
              <TicketSelection event={event} />
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