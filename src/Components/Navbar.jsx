import React, { useRef, useState, useEffect, useCallback } from "react";
import { IoIosSearch, IoMdClose } from "react-icons/io";
import { BiUser } from "react-icons/bi";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../i18n";
import Hamburger from "./Hamburger";
import LoginButton from "./Auth/LoginButton";
import { useAuth } from "../context/AuthContext";
import { searchEvents } from "../services/api";
import { SlCalender } from "react-icons/sl";
import { IoLocationOutline } from "react-icons/io5";

function Navbar({
  toggleScrollPage,
  isSidebarOpen,
  toggleUserSidebar,
  isUserSidebarOpen,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, isAuthenticated } = useAuth();
  const inputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Debug user profile data
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      console.log("Navbar user profile data:", {
        hasProfilePicture: Boolean(currentUser.profilePicture),
        hasPicture: Boolean(currentUser.picture),
        profilePictureUrl: currentUser.profilePicture || currentUser.picture || 'None',
        name: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`
      });
    }
  }, [currentUser, isAuthenticated]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    // Add click outside listener to collapse search bar and dropdown when clicking elsewhere
    const handleClickOutside = (event) => {
      // Check if click is outside both the search input and dropdown
      const isOutsideSearchBar = inputRef.current && !inputRef.current.contains(event.target);
      const isOutsideDropdown = dropdownRef.current && !dropdownRef.current.contains(event.target);
      
      if (isOutsideSearchBar && isOutsideDropdown) {
        setSearchFocused(false);
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchClick = () => {
    setSearchFocused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
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

  // Debounced search function
  const debouncedSearch = useCallback((query) => {
    let timeoutId;
    
    return (query) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        if (query && query.trim() && query.trim().length >= 2) {
          setIsSearching(true);
          try {
            const results = await searchEvents(query.trim(), '');
            
            // Format the results with properly formatted dates
            const formattedResults = results.slice(0, 5).map(event => ({
              ...event,
              formattedDate: formatEventDate(event)
            }));
            
            setSearchResults(formattedResults);
            setShowDropdown(true);
          } catch (error) {
            console.error("Error fetching search results:", error);
            setSearchResults([]);
          } finally {
            setIsSearching(false);
          }
        } else {
          setSearchResults([]);
          setShowDropdown(false);
        }
      }, 300); // 300ms delay to reduce API calls while typing
    };
  }, [formatEventDate]);

  // Memoize the debounced search function
  const performSearch = useCallback(debouncedSearch(), [debouncedSearch]);

  // Handle input change with live search
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    performSearch(value);
  };
  
  // Handle search submission
  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    
    if (searchInput.trim()) {
      // Build search URL with query parameter
      const searchParams = new URLSearchParams();
      searchParams.set('q', searchInput.trim());
      
      // Navigate to search results page
      navigate(`/search?${searchParams.toString()}`);
      
      // Reset search UI state
      setSearchFocused(false);
      setShowDropdown(false);
      
      // For mobile, this may be important to blur the keyboard
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };
  
  // Handle click on search result item
  const handleSearchResultClick = (eventId, eventName) => {
    navigate(`/events/${eventId || eventName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`);
    setShowDropdown(false);
    setSearchFocused(false);
    setSearchInput('');
  };

  const handleUserClick = (e) => {
    if (e) e.preventDefault();
    
    if (toggleUserSidebar) {
      toggleUserSidebar();
    } else {
      navigate("/page-not-found");
    }
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100vw",
        height: "60px",
        left: "0",
        top: "0",
        background: scrolled ? "rgba(255, 255, 255, 0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : "none",
        boxShadow: "0 4px 20px rgba(111, 68, 255, 0.1)",
        transition: "all 0.3s ease",
        position: "fixed",
        zIndex: 100,
        padding: "0 32px",
      }}
    >
      {/* Logo on the left */}
      <div
        className="nav-left"
        style={{ display: "flex", alignItems: "center" }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <h2
            style={{
              fontWeight: "800",
              color: "var(--primary)",
              fontSize: isMobile ? "20px" : "26px",
              fontFamily: "var(--font-primary)",
              letterSpacing: "-0.5px",
              userSelect: "none",
              cursor: "pointer",
            }}
          >
            TIXMOJO
          </h2>
        </Link>
      </div>

      {/* Right section with search, user icon, and hamburger */}
      <div
        className="nav-right"
        style={{
          display: "flex",
          alignItems: "center",
          gap: isMobile ? (searchFocused ? "8px" : "12px") : "20px",
          transition: "all 0.3s ease",
        }}
      >
        {/* Search bar */}
        <div
          className="search-bar"
          onClick={handleSearchClick}
          ref={inputRef}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: searchFocused
              ? "rgba(111, 68, 255, 0.12)"
              : "rgba(111, 68, 255, 0.08)",
            borderRadius: "50px",
            padding: isMobile ? "8px 12px" : "10px 16px",
            width: isMobile
              ? searchFocused
                ? "180px"
                : "40px"
              : searchFocused
                ? "320px"
                : "240px",
            transition: "all 0.3s cubic-bezier(0.19, 1, 0.22, 1)",
            cursor: "pointer",
            boxShadow: searchFocused
              ? "0 4px 12px rgba(111, 68, 255, 0.15)"
              : "none",
            border: searchFocused
              ? "1px solid rgba(111, 68, 255, 0.3)"
              : "1px solid transparent",
            position: "relative", // Added for dropdown positioning
          }}
        >
          <IoIosSearch
            style={{
              color: "var(--primary)",
              fontSize: searchFocused ? "22px" : "20px",
              marginRight: isMobile && !searchFocused ? "0" : "8px",
              transition: "all 0.3s ease",
            }}
          />

          {(!isMobile || searchFocused) && (
            <form onSubmit={handleSearchSubmit} style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Search Events..."
                onFocus={() => setSearchFocused(true)}
                value={searchInput}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearchSubmit();
                  } else if (e.key === 'Escape') {
                    setShowDropdown(false);
                    setSearchFocused(false);
                  } else if (e.key === 'ArrowDown' && showDropdown && searchResults.length > 0) {
                    // Move focus to the first result item for keyboard navigation
                    const firstResult = document.querySelector('.search-result-item');
                    if (firstResult) firstResult.focus();
                    e.preventDefault();
                  }
                }}
                style={{
                  border: "none",
                  background: "transparent",
                  outline: "none",
                  fontSize: "14px",
                  width: "100%",
                  color: "var(--dark)",
                  transition: "all 0.3s ease",
                }}
                ref={inputRef}
              />
            </form>
          )}

          {/* Close button when search is focused */}
          {searchFocused && (
            <IoMdClose
              onClick={(e) => {
                e.stopPropagation(); // Prevent triggering the search bar click
                setSearchFocused(false);
                setShowDropdown(false);
                setSearchInput('');
              }}
              style={{
                color: "var(--neutral-600)",
                fontSize: "18px",
                cursor: "pointer",
                marginLeft: "8px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--primary)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--neutral-600)";
                e.currentTarget.style.transform = "scale(1)";
              }}
            />
          )}
          
          {/* Search Results Dropdown */}
          {showDropdown && searchFocused && (
            <div 
              ref={dropdownRef}
              style={{
                position: 'absolute',
                top: 'calc(100% + 5px)',
                left: 0,
                width: '350px',
                maxHeight: '400px',
                overflowY: 'auto',
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(111, 68, 255, 0.15)',
                zIndex: 1000,
                border: '1px solid var(--purple-100)',
                padding: '12px 0',
              }}
            >
              {isSearching ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--neutral-600)' }}>
                  <div style={{ display: 'inline-block', width: '20px', height: '20px', borderRadius: '50%', 
                                border: '2px solid var(--primary)', borderTopColor: 'transparent',
                                animation: 'spin 1s linear infinite' }}></div>
                  <style>
                    {`@keyframes spin { to { transform: rotate(360deg); } }`}
                  </style>
                  <p style={{ marginTop: '8px', fontSize: '14px' }}>Searching...</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--neutral-600)' }}>
                  <p style={{ fontSize: '14px' }}>No results found. Try different keywords.</p>
                </div>
              ) : (
                <>
                  <div style={{ padding: '0 15px 10px', borderBottom: '1px solid var(--purple-100)' }}>
                    <p style={{ fontSize: '13px', color: 'var(--neutral-600)', margin: '0' }}>
                      {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} found
                    </p>
                  </div>
                  {searchResults.map((event, index) => (
                    <div
                      key={event.id || `event-${index}`}
                      className="search-result-item"
                      onClick={() => handleSearchResultClick(event.id, event.eventName)}
                      tabIndex="0"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSearchResultClick(event.id, event.eventName);
                        } else if (e.key === 'ArrowDown') {
                          const nextResult = e.target.nextElementSibling;
                          if (nextResult) nextResult.focus();
                          e.preventDefault();
                        } else if (e.key === 'ArrowUp') {
                          const prevResult = e.target.previousElementSibling;
                          if (prevResult && prevResult.classList.contains('search-result-item')) {
                            prevResult.focus();
                          } else {
                            inputRef.current.focus();
                          }
                          e.preventDefault();
                        } else if (e.key === 'Escape') {
                          setShowDropdown(false);
                          setSearchFocused(false);
                          e.preventDefault();
                        }
                      }}
                      style={{
                        padding: '12px 15px',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        outline: 'none',
                        borderLeft: '3px solid transparent',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--purple-50)';
                        e.currentTarget.style.borderLeft = '3px solid var(--primary)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderLeft = '3px solid transparent';
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--purple-50)';
                        e.currentTarget.style.borderLeft = '3px solid var(--primary)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderLeft = '3px solid transparent';
                      }}
                    >
                      {/* Event thumbnail */}
                      <div style={{ width: '60px', height: '45px', flexShrink: 0, borderRadius: '6px', overflow: 'hidden' }}>
                        <img 
                          src={event.eventPoster || "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"} 
                          alt={event.eventName}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3";
                          }}
                        />
                      </div>
                      
                      {/* Event details */}
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: '600', color: 'var(--dark)', 
                                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {event.eventName}
                        </h4>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          {/* Date */}
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--neutral-600)' }}>
                            <SlCalender style={{ marginRight: '4px', fontSize: '10px' }} />
                            <span>{event.formattedDate || formatEventDate(event)}</span>
                          </div>
                          
                          {/* Location */}
                          <div style={{ display: 'flex', alignItems: 'center', fontSize: '12px', color: 'var(--neutral-600)', 
                                       maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            <IoLocationOutline style={{ marginRight: '4px', fontSize: '10px', flexShrink: 0 }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {event.eventAddress || 
                               (event.venueName && event.venueAddress ? `${event.venueName}, ${event.venueAddress}` : 
                               event.venueAddress || event.eventLocation || 'TBA')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* View all results link */}
                  <div 
                    style={{ 
                      padding: '12px 15px', 
                      textAlign: 'center', 
                      borderTop: '1px solid var(--purple-100)',
                      cursor: 'pointer',
                    }}
                    onClick={handleSearchSubmit}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--purple-50)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span style={{ 
                      fontWeight: 600, 
                      color: 'var(--primary)',
                      fontSize: '14px',
                    }}>
                      View all search results
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Login button or user profile */}
        {!(isMobile && searchFocused) && (
          <div style={{
            display: "flex",
            alignItems: "center",
            opacity: searchFocused && !isMobile ? "0.7" : "1",
            transition: "opacity 0.3s ease",
          }}>
            {isAuthenticated() ? (
              <div
                onClick={(e) => handleUserClick(e)}
                style={{
                  width: "38px",
                  height: "38px",
                  borderRadius: "50%",
                  backgroundColor: "var(--purple-100)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 2px 6px rgba(111, 68, 255, 0.15)",
                  border: currentUser?.profilePicture ? "2px solid var(--purple-200)" : "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                  e.currentTarget.style.boxShadow = "0 3px 8px rgba(111, 68, 255, 0.3)";
                  // Log auth status on hover for debugging
                  console.log("Auth Status (Navbar):", {
                    isAuthenticated: isAuthenticated(),
                    currentUser
                  });
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "0 2px 6px rgba(111, 68, 255, 0.15)";
                }}
              >
                {/* Active indicator dot */}
                <div
                  style={{
                    position: "absolute",
                    bottom: "2px",
                    right: "2px",
                    width: "10px",
                    height: "10px",
                    backgroundColor: "#44cc77",
                    borderRadius: "50%",
                    border: "2px solid white",
                    zIndex: 2,
                  }}
                />
                {currentUser?.profilePicture || currentUser?.picture ? (
                  <img
                    src={currentUser.profilePicture || currentUser.picture}
                    alt={`${currentUser.firstName || 'User'}'s profile`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "50%", /* Ensure image is round */
                    }}
                    onError={(e) => {
                      console.error("Failed to load profile image:", e);
                      e.target.onerror = null; 
                      e.target.style.display = "none";
                      e.target.parentNode.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--primary);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>';
                    }}
                  />
                ) : (
                  <BiUser style={{ color: "var(--primary)", fontSize: "22px" }} />
                )}
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        )}

        {/* Hamburger menu - hide on mobile when search is focused */}
        {!(isMobile && searchFocused) && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: searchFocused && !isMobile ? "0.7" : "1",
              transition: "opacity 0.3s ease",
            }}
          >
            <Hamburger
              onToggle={toggleScrollPage}
              isSidebarOpen={isSidebarOpen}
            />
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
