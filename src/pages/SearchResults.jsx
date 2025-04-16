import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { searchEvents } from '../services/api';
import { PageSEO } from '../utils/SEO';
import { ScrollAnimation } from '../utils/ScrollAnimation.jsx';
import { useAnimation } from '../context/AnimationContext';
import Cards from '../Components/HomePage/Cards';
import Loader from '../Components/Loader';

const SearchResults = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { animationsEnabled, sidebarOpen } = useAnimation();
  
  // Get search query from URL parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q') || '';
  const searchLocation = queryParams.get('location') || '';
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Format event date from various formats
  const formatEventDate = useCallback((event) => {
    if (!event) return 'Upcoming';
    
    // Define today and tomorrow dates for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    try {
      // Handle server data format with full date as a string (e.g., "Thursday, 3 Apr, 2025")
      if (event.date && typeof event.date === 'string' && event.date.includes(',')) {
        const serverDateParts = event.date.split(', ');
        if (serverDateParts.length >= 2) {
          // For displaying, we can return the original formatted date
          return event.date;
        }
      }
      
      // Handle format like "25 Mar - 27 Mar"
      if (event.eventDate) {
        return event.eventDate;
      }
      
      // If we have a dateType property, use it for special labels
      if (event.eventDateType) {
        if (event.eventDateType === 'today') return 'Today';
        if (event.eventDateType === 'tomorrow') return 'Tomorrow';
        if (event.eventDateType === 'thisWeek') return 'This Week';
      }
      
      return event.eventDate || event.date || 'Upcoming';
    } catch (error) {
      console.error("Error formatting event date:", error, event);
      return 'Upcoming';
    }
  }, []);
  
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!searchQuery && !searchLocation) {
          setResults([]);
          setLoading(false);
          return;
        }
        
        const data = await searchEvents(searchQuery, searchLocation);
        
        // Debug the first event to understand its structure
        if (data && data.length > 0) {
          console.log('Search result sample event:', data[0]);
          console.log('Formatted date:', formatEventDate(data[0]));
        }
        
        setResults(data);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSearchResults();
  }, [searchQuery, searchLocation]);
  
  // Format search query for display
  const getSearchTitle = () => {
    if (searchQuery && searchLocation) {
      return `Results for "${searchQuery}" in ${searchLocation}`;
    } else if (searchQuery) {
      return `Results for "${searchQuery}"`;
    } else if (searchLocation) {
      return `Events in ${searchLocation}`;
    } else {
      return 'Search Results';
    }
  };
  
  return (
    <div 
      style={{
        padding: '90px 32px 60px 32px',
        maxWidth: '1200px',
        margin: '0 auto',
        minHeight: '90vh',
      }}
    >
      <PageSEO 
        title={`${getSearchTitle()} | TixMojo`}
        description={`Search results for events matching "${searchQuery}" in ${searchLocation || 'all locations'}`}
        noindex={true}
      />
      
      <ScrollAnimation
        direction="down"
        distance={20}
        duration={0.8}
        disabled={!animationsEnabled || sidebarOpen}
      >
        <div style={{ marginBottom: '30px' }}>
          <h1 
            style={{
              fontSize: window.innerWidth > 768 ? '36px' : '28px',
              fontWeight: '800',
              color: 'var(--dark)',
              marginBottom: '5px',
            }}
          >
            {getSearchTitle()}
          </h1>
          
          {!loading && (
            <p 
              style={{
                fontSize: '16px',
                color: 'var(--gray-medium)',
                marginBottom: '20px',
              }}
            >
              {results.length > 0 
                ? `Found ${results.length} ${results.length === 1 ? 'event' : 'events'} matching your search`
                : 'No events found matching your search criteria'}
            </p>
          )}
          
          {/* Search Form for refining search */}
          <div 
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '10px',
              marginTop: '20px',
              marginBottom: '30px',
            }}
          >
            <input
              type="text"
              defaultValue={searchQuery}
              placeholder="Event name, description..."
              style={{
                flex: '1',
                minWidth: '200px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-300)',
                fontSize: '14px',
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target.value;
                  const locationSelect = document.getElementById('location-select');
                  const locationValue = locationSelect ? locationSelect.value : '';
                  
                  const params = new URLSearchParams();
                  if (input) params.set('q', input);
                  if (locationValue) params.set('location', locationValue);
                  
                  navigate(`/search?${params.toString()}`);
                }
              }}
            />
            
            <select
              id="location-select"
              defaultValue={searchLocation}
              style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-300)',
                backgroundColor: 'white',
                fontSize: '14px',
                minWidth: '150px',
              }}
            >
              <option value="">All Locations</option>
              <option value="Sydney">Sydney</option>
              <option value="Melbourne">Melbourne</option>
              <option value="Brisbane">Brisbane</option>
              <option value="Singapore">Singapore</option>
              <option value="Tokyo">Tokyo</option>
            </select>
            
            <button
              style={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onClick={() => {
                const input = document.querySelector('input[type="text"]').value;
                const locationSelect = document.getElementById('location-select');
                const locationValue = locationSelect ? locationSelect.value : '';
                
                const params = new URLSearchParams();
                if (input) params.set('q', input);
                if (locationValue) params.set('location', locationValue);
                
                navigate(`/search?${params.toString()}`);
              }}
            >
              Search
            </button>
          </div>
        </div>
      </ScrollAnimation>
      
      {/* Loading State */}
      {loading && (
        <div 
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '50px',
          }}
        >
          <Loader />
        </div>
      )}
      
      {/* Error State */}
      {!loading && error && (
        <div 
          style={{
            textAlign: 'center',
            marginTop: '50px',
            padding: '20px',
            borderRadius: '8px',
            backgroundColor: '#ffebee',
            color: '#c62828',
          }}
        >
          <h3 style={{ marginBottom: '10px' }}>Error</h3>
          <p>{error}</p>
          <button
            style={{
              marginTop: '15px',
              padding: '10px 15px',
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}
      
      {/* No Results State */}
      {!loading && !error && results.length === 0 && (
        <div 
          style={{
            textAlign: 'center',
            marginTop: '50px',
          }}
        >
          <div
            style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              backgroundColor: 'var(--purple-100)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              margin: '0 auto 20px',
            }}
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3
            style={{
              fontSize: '24px',
              fontWeight: '700',
              marginBottom: '10px',
              color: 'var(--neutral-800)',
            }}
          >
            No results found
          </h3>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--neutral-600)',
              maxWidth: '400px',
              margin: '0 auto 20px',
            }}
          >
            We couldn't find any events matching your search criteria. Try adjusting your search terms or browse our popular events.
          </p>
          <button
            style={{
              backgroundColor: 'var(--primary)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 20px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onClick={() => navigate('/')}
          >
            Browse Popular Events
          </button>
        </div>
      )}
      
      {/* Results Display */}
      {!loading && !error && results.length > 0 && (
        <ScrollAnimation
          direction="up"
          distance={20}
          duration={0.8}
          delay={0.2}
          disabled={!animationsEnabled || sidebarOpen}
        >
          <div className="search-results-grid" style={{ 
              marginTop: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
              gap: '25px',
              justifyContent: 'center'
            }}>
            {/* Map through the results and create a Cards component for each */}
            {results.map((event, index) => {
              // Extra protection in case event is null or undefined
              if (!event) return null;
              
              // Get formatted event date
              const eventDate = formatEventDate(event);
              
              // Determine event address
              const eventAddress = event.eventAddress || 
                (event.venueName && event.venueAddress 
                  ? `${event.venueName}, ${event.venueAddress}` 
                  : event.venueAddress || event.eventLocation || 'TBA');
              
              return (
                <div key={event.id || index}>
                  <Cards
                    eventName={event.eventName || "Unnamed Event"}
                    eventDate={eventDate}
                    eventAddress={eventAddress}
                    eventPrice={event.eventPrice || "Free"}
                    eventPoster={event.eventPoster || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"}
                    eventRanking={String(index + 1)}
                    hideRanking={true}
                    id={event.id}
                  />
                </div>
              );
            })}
          </div>
        </ScrollAnimation>
      )}
    </div>
  );
};

export default SearchResults;