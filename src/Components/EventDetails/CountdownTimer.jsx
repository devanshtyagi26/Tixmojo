import React, { useState, useEffect } from 'react';
import { FaRegClock } from 'react-icons/fa';

const CountdownTimer = ({ expiryTime, onExpire }) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0
  });
  
  // Calculate percentage of time remaining for the progress bar
  // Assuming we start with 10 minutes (600 seconds)
  const [progressPercentage, setProgressPercentage] = useState(100);
  const TOTAL_SECONDS = 600; // 10 minutes
  
  useEffect(() => {
    // Calculate initial time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = expiryTime - now;
      
      if (difference <= 0) {
        // Timer expired
        setTimeLeft({ minutes: 0, seconds: 0 });
        setProgressPercentage(0);
        onExpire();
        return;
      }
      
      // Calculate minutes and seconds
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      const totalSecondsLeft = minutes * 60 + seconds;
      
      // Calculate progress percentage (capped between 0-100)
      const progress = Math.min(100, Math.max(0, (totalSecondsLeft / TOTAL_SECONDS) * 100));
      
      setTimeLeft({ minutes, seconds });
      setProgressPercentage(progress);
    };

    // Call immediately to set initial state
    calculateTimeLeft();
    
    // Set up the interval
    const timerId = setInterval(calculateTimeLeft, 1000);
    
    // Clear interval on component unmount
    return () => clearInterval(timerId);
  }, [expiryTime, onExpire]);

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (progressPercentage > 50) return 'var(--purple-600)';
    if (progressPercentage > 20) return 'orange';
    return '#ff4545';
  };
  
  const timerColor = getTimerColor();
  
  // Pulse animation for low time
  const shouldPulse = progressPercentage <= 20;

  return (
    <div 
      style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        fontFamily: 'var(--font-heading)',
        marginBottom: '25px',
        position: 'relative',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        padding: '15px 20px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        maxWidth: '400px',
        margin: '0 auto 25px auto',
        border: '1px solid rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        color: timerColor,
        fontWeight: '600',
        fontSize: '15px',
        animation: shouldPulse ? 'pulse 1.5s infinite' : 'none'
      }}>
        <FaRegClock style={{ fontSize: '16px' }} />
        <span>Session Expires In</span>
      </div>
      
      {/* Timer Display */}
      <div 
        style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: timerColor,
            color: 'white',
            width: '48px',
            height: '54px',
            borderRadius: '8px',
            fontSize: '28px',
            fontWeight: '700',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
          }}
        >
          {String(timeLeft.minutes).padStart(2, '0')}
        </div>
        <span style={{ 
          color: timerColor, 
          fontWeight: '700', 
          fontSize: '28px',
          animation: shouldPulse ? 'pulse 1.5s infinite' : 'none'
        }}>:</span>
        <div 
          style={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: timerColor,
            color: 'white',
            width: '48px',
            height: '54px',
            borderRadius: '8px',
            fontSize: '28px',
            fontWeight: '700',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'background-color 0.3s ease'
          }}
        >
          {String(timeLeft.seconds).padStart(2, '0')}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '2px',
        overflow: 'hidden',
        marginTop: '6px'
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercentage}%`,
          backgroundColor: timerColor,
          borderRadius: '2px',
          transition: 'width 1s ease, background-color 0.3s ease'
        }} />
      </div>
      
      {/* Message */}
      <span 
        style={{ 
          fontSize: '13px', 
          color: 'var(--neutral-700)', 
          textAlign: 'center',
          fontWeight: '500',
          marginTop: '5px'
        }}
      >
        Complete your purchase before the timer expires
      </span>
      
      {/* Add CSS animation for pulse effect */}
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.7; }
            100% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default CountdownTimer;