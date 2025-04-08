/**
 * Payment Service with Local Mock Implementation
 * 
 * This service simulates payment API calls locally since the backend endpoints
 * appear to be missing or not properly configured
 */

// Local storage key for simulated sessions
const STORAGE_KEY = 'tixmojo_payment_sessions';

// Generate a random ID for simulated sessions and orders
const generateId = (prefix) => `${prefix}_${Math.random().toString(36).substring(2, 15)}`;

// Get sessions from local storage
const getSessions = () => {
  try {
    const sessions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return sessions;
  } catch (e) {
    console.error('Error reading sessions from local storage:', e);
    return {};
  }
};

// Save sessions to local storage
const saveSessions = (sessions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving sessions to local storage:', e);
  }
};

/**
 * Initialize a payment session locally
 * @param {Array} cartItems - Cart items with ticket and quantity information
 * @param {Object} event - Current event information
 * @returns {Promise} Session information including sessionId and expiryTime
 */
export const initializePaymentSession = async (cartItems, event) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Generate a new session ID
  const sessionId = generateId('sess');
  
  // Calculate total amount from cart items
  const totalAmount = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.ticket.price) * item.quantity);
  }, 0);
  
  // Create a session expiry time (15 minutes from now)
  const expiryTime = new Date(Date.now() + 15 * 60 * 1000);
  
  // Create a new session
  const session = {
    id: sessionId,
    eventId: event.id,
    cartItems,
    totalAmount,
    createdAt: new Date().toISOString(),
    expiryTime: expiryTime.toISOString(),
    status: 'initialized',
    discount: 0,
    buyerInfo: null,
    paymentInfo: null
  };
  
  // Save the session
  const sessions = getSessions();
  sessions[sessionId] = session;
  saveSessions(sessions);
  
  // Return the session information
  return {
    sessionId,
    expiryTime: expiryTime.toISOString(),
    totalAmount
  };
};

/**
 * Validate buyer information
 * @param {String} sessionId - Current payment session ID
 * @param {Object} buyerInfo - Buyer information including name, email, phone
 * @returns {Promise} Validation response
 */
export const validateBuyerInfo = async (sessionId, buyerInfo) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Update the session with buyer info
  session.buyerInfo = buyerInfo;
  session.status = 'buyer_info_validated';
  
  // Save the updated session
  sessions[sessionId] = session;
  saveSessions(sessions);
  
  // Return a success response
  return {
    success: true,
    message: 'Buyer information validated successfully',
    sessionId
  };
};

/**
 * Process payment
 * @param {String} sessionId - Current payment session ID
 * @param {Object} paymentInfo - Payment information (processed securely on server)
 * @returns {Promise} Payment response including order ID
 */
export const processPayment = async (sessionId, paymentInfo) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Validate payment information (simulated)
  if (!paymentInfo.cardholderName || !paymentInfo.cardNumber || !paymentInfo.expiryDate || !paymentInfo.cvv) {
    throw new Error('Invalid payment information');
  }
  
  // Update the session with payment info (never store full card details in a real app)
  session.paymentInfo = {
    cardholderName: paymentInfo.cardholderName,
    cardLast4: paymentInfo.cardNumber.slice(-4),
    cardExpiry: paymentInfo.expiryDate,
    paymentMethod: 'credit_card'
  };
  
  // Update the session status
  session.status = 'payment_succeeded';
  
  // Generate an order ID
  const orderId = generateId('order');
  session.orderId = orderId;
  
  // Save the updated session
  sessions[sessionId] = session;
  saveSessions(sessions);
  
  // Return order information
  return {
    success: true,
    orderId,
    message: 'Payment processed successfully',
    tickets: session.cartItems.map(item => ({
      ticketId: item.ticket.id,
      quantity: item.quantity,
      price: item.ticket.price,
      name: item.ticket.name
    })),
    totalAmount: session.totalAmount,
    discount: session.discount,
    buyerInfo: session.buyerInfo
  };
};

/**
 * Apply promo code
 * @param {String} sessionId - Current payment session ID
 * @param {String} promoCode - Promo code to apply
 * @returns {Promise} Promo response including discount amount
 */
export const applyPromoCode = async (sessionId, promoCode) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Simulate promo code validation
  // For demonstration purposes, apply a standard 10% discount for any code that starts with "TIXMOJO"
  // and 15% for "WELCOME", otherwise return an error
  let discount = 0;
  let isValid = false;
  let message = 'Invalid promo code';
  
  if (promoCode.toUpperCase().startsWith('TIXMOJO')) {
    discount = 0.1; // 10% discount
    isValid = true;
    message = 'Promo code applied: 10% discount';
  } else if (promoCode.toUpperCase() === 'WELCOME') {
    discount = 0.15; // 15% discount
    isValid = true;
    message = 'Promo code applied: 15% discount';
  }
  
  if (isValid) {
    // Update the session with discount
    session.discount = discount;
    sessions[sessionId] = session;
    saveSessions(sessions);
  }
  
  // Return the discount information
  return {
    isValid,
    discount,
    message,
    totalBeforeDiscount: session.totalAmount,
    totalAfterDiscount: session.totalAmount * (1 - discount)
  };
};

/**
 * Get current session status
 * @param {String} sessionId - Current payment session ID
 * @returns {Promise} Session status and time remaining
 */
export const getSessionStatus = async (sessionId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Calculate time remaining
  const expiryTime = new Date(session.expiryTime);
  const now = new Date();
  const timeRemaining = Math.max(0, expiryTime.getTime() - now.getTime());
  
  // Check if the session is expired
  const isExpired = timeRemaining <= 0;
  
  // If expired, update the status
  if (isExpired && session.status !== 'expired') {
    session.status = 'expired';
    sessions[sessionId] = session;
    saveSessions(sessions);
  }
  
  // Return the session status
  return {
    status: session.status,
    timeRemaining,
    isExpired,
    expiryTime: session.expiryTime
  };
};

/**
 * Create a payment intent (compatibility with Stripe service)
 * @param {String} sessionId - Current payment session ID
 * @returns {Promise} Payment intent creation response
 */
export const createPaymentIntent = async (sessionId) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Get the session
  const sessions = getSessions();
  const session = sessions[sessionId];
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  // Generate a client secret (for compatibility with Stripe service)
  const clientSecret = `fallback_${generateId('secret')}`;
  
  // Return the client secret
  return {
    clientSecret,
    isSimulated: true,
    amount: session.totalAmount,
    currency: 'usd'
  };
};

/**
 * Confirm payment success (compatibility with Stripe service)
 * @param {String} sessionId - Current payment session ID
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {Promise} Confirmation response including order ID
 */
export const confirmPaymentSuccess = async (sessionId, paymentIntentId) => {
  // Delegate to process payment
  return processPayment(sessionId, {
    cardholderName: 'Simulated Card',
    cardNumber: '4242424242424242',
    expiryDate: '12/29',
    cvv: '123'
  });
};

// Export all functions
export default {
  initializePaymentSession,
  validateBuyerInfo,
  processPayment,
  applyPromoCode,
  getSessionStatus,
  // Add Stripe compatibility methods
  createPaymentIntent,
  confirmPaymentSuccess
};