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
      {/* Timer positioned inside the ticket selection when viewing this section */}
      {showTimer && (
        <div style={{ 
          marginBottom: '20px',
          width: '100%',
          maxWidth: '350px',
          margin: '0 auto 25px auto'
        }}>
          <CountdownTimer expiryTime={expiryTime} onExpire={onExpire} />
        </div>
      )}
      
      <div style={{ paddingTop: '10px' }}>
        <h2
          style={{
            fontSize: '28px',
            fontWeight: '800',
            color: 'var(--neutral-800)',
            marginBottom: '18px',
            fontFamily: 'var(--font-heading)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            letterSpacing: '-0.01em',
          }}
        >
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
          Select Your Tickets
        </h2>

        <p
          style={{
            color: 'var(--neutral-600)',
            marginBottom: '30px',
            fontSize: '16px',
            maxWidth: '80%',
          }}
        >
          Choose the tickets you want to purchase for {event.title}
        </p>
      </div>

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