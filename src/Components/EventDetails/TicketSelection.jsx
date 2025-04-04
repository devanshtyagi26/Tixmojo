import React, { useState } from 'react';
import TicketTable from './TicketTable';
import TicketCart from './TicketCart';
import CountdownTimer from './CountdownTimer';

const TicketSelection = ({ event, expiryTime, onExpire, showTimer }) => {
  // Sample ticket data - in a real app, this would come from the API
  const [tickets, setTickets] = useState([
    {
      id: 1,
      name: 'Early Bird Ticket',
      description: 'Includes entry for 1 person',
      price: '29.00',
      currency: 'AUD',
      available: 10
    },
    {
      id: 2,
      name: 'General Admission',
      description: 'Standard entry ticket',
      price: '39.00',
      currency: 'AUD',
      available: 50
    },
    {
      id: 3,
      name: 'VIP Package',
      description: 'Premium entry with exclusive perks',
      price: '79.00',
      currency: 'AUD',
      available: 5
    },
    {
      id: 4,
      name: 'Group Ticket (4 people)',
      description: 'Discounted entry for 4 people',
      price: '99.00',
      currency: 'AUD',
      available: 8
    },
    {
      id: 5,
      name: 'Backstage Pass',
      description: 'General admission + backstage access',
      price: '149.00',
      currency: 'AUD',
      available: 3
    }
  ]);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [ticketQuantities, setTicketQuantities] = useState({});

  // Add ticket to cart
  const handleAddToCart = (ticket) => {
    // Update quantities
    setTicketQuantities((prev) => ({
      ...prev,
      [ticket.id]: 1
    }));

    // Update cart
    setCartItems((prev) => [
      ...prev,
      { ticket, quantity: 1 }
    ]);
  };

  // Update ticket quantity
  const handleQuantityChange = (ticketId, newQuantity) => {
    // If quantity is 0, remove from cart
    if (newQuantity === 0) {
      handleRemoveFromCart(ticketId);
      return;
    }

    // Update quantities
    setTicketQuantities((prev) => ({
      ...prev,
      [ticketId]: newQuantity
    }));

    // Update cart items
    setCartItems((prev) =>
      prev.map(item =>
        item.ticket.id === ticketId
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Remove ticket from cart
  const handleRemoveFromCart = (ticketId) => {
    // Update quantities
    setTicketQuantities((prev) => {
      const { [ticketId]: _, ...rest } = prev;
      return rest;
    });

    // Update cart
    setCartItems((prev) => prev.filter(item => item.ticket.id !== ticketId));
  };

  // Handle checkout
  const handleProceedToCheckout = (total, discount) => {
    console.log(`Proceeding to checkout: $${total.toFixed(2)} with ${discount * 100}% discount`);
    alert('This would navigate to the checkout page in a real application.');
  };

  return (
    <div
      style={{
        borderRadius: '24px',
        padding: '30px',
        backgroundColor: 'var(--purple-50)',
        marginTop: '50px',
        marginBottom: '50px',
        boxShadow: '0 10px 30px rgba(111, 68, 255, 0.1)',
        border: '1px solid var(--purple-100)',
        position: 'relative',
      }}
    >
      {/* Compact timer positioned in the ticket selection header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: 'var(--primary)' }}
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h2
            style={{
              fontSize: '28px',
              fontWeight: '800',
              color: 'var(--neutral-800)',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.01em',
              margin: 0
            }}
          >
            Select Your Tickets
          </h2>
        </div>
        
        {/* Compact horizontal timer */}
        {showTimer && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--purple-50)',
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid var(--purple-100)'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: '600',
              color: 'var(--purple-700)',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Time left:
            </span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              fontFamily: 'var(--font-heading)'
            }}>
              <span style={{
                background: 'var(--purple-600)',
                color: 'white',
                borderRadius: '4px',
                padding: '1px 4px',
                fontSize: '14px',
                fontWeight: '700',
                minWidth: '24px',
                textAlign: 'center'
              }}>
                {String(Math.floor((expiryTime - new Date()) / (1000 * 60))).padStart(2, '0')}
              </span>
              <span style={{ color: 'var(--purple-700)', fontWeight: '600' }}>:</span>
              <span style={{
                background: 'var(--purple-600)',
                color: 'white',
                borderRadius: '4px',
                padding: '1px 4px',
                fontSize: '14px',
                fontWeight: '700',
                minWidth: '24px',
                textAlign: 'center'
              }}>
                {String(Math.floor(((expiryTime - new Date()) / 1000) % 60)).padStart(2, '0')}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <p
        style={{
          color: 'var(--neutral-600)',
          marginBottom: '25px',
          fontSize: '15px',
          maxWidth: '80%',
        }}
      >
        Choose the tickets you want to purchase for {event.title}
      </p>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '30px',
        }}
      >
        {/* Left side - Ticket table */}

        <TicketTable
          tickets={tickets}
          onAddToCart={handleAddToCart}
          onQuantityChange={handleQuantityChange}
          ticketQuantities={ticketQuantities}
        />


        {/* Right side - Ticket cart */}

        <TicketCart
          cartItems={cartItems}
          onRemoveItem={handleRemoveFromCart}
          onProceedToCheckout={handleProceedToCheckout}
        />

      </div>
    </div>
  );
};

export default TicketSelection;