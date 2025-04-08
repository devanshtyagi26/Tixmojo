import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import stripeService from '../../services/stripeService';

// Appearance options for Stripe Elements - simplified
const stripeElementsOptions = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#6f44ff',
      colorBackground: '#ffffff',
      colorText: '#424770',
      colorDanger: '#ff0056',
      fontFamily: 'Raleway, system-ui, sans-serif',
      borderRadius: '8px',
      fontSizeBase: '16px'
    }
  }
};

// Stripe form component
const CheckoutForm = ({ 
  sessionId, 
  buyerInfo, 
  onPaymentSuccess, 
  onPaymentError,
  isSubmitting,
  setIsSubmitting,
  amount,
  clientSecret,
  isSimulationMode
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState(null);
  const [cardComplete, setCardComplete] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Simulation mode form data for testing
  const [simulationFormData, setSimulationFormData] = useState({
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    billingName: buyerInfo ? `${buyerInfo.firstName} ${buyerInfo.lastName}` : '',
    billingEmail: buyerInfo?.email || '',
    billingPhone: buyerInfo?.phone || '',
    billingZip: ''
  });
  const [simulationFormComplete, setSimulationFormComplete] = useState(false);
  
  // Handle simulation form input changes
  const handleSimulationInputChange = (e) => {
    const { name, value } = e.target;
    setSimulationFormData({
      ...simulationFormData,
      [name]: value
    });
    
    // Check if all fields are filled
    const updatedData = { ...simulationFormData, [name]: value };
    const isComplete = 
      updatedData.cardNumber.length >= 16 && 
      updatedData.cardExpiry.length >= 5 &&
      updatedData.cardCvc.length >= 3 &&
      updatedData.billingName.length > 0 &&
      updatedData.billingEmail.length > 0 &&
      updatedData.billingZip.length > 0;
    
    setSimulationFormComplete(isComplete);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    if (!clientSecret) {
      // Client secret is not available
      return;
    }

    if (isProcessing || isSubmitting) {
      return;
    }

    setIsProcessing(true);
    setIsSubmitting(true);
    setPaymentError(null);

    try {
      // Check if we're in simulation mode
      if (isSimulationMode) {
        // Simulate payment processing
        console.log('Simulating Stripe payment processing...');
        
        // Introduce a delay to simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Extract payment intent ID from the client secret (simulated)
        const simulatedPaymentIntentId = clientSecret.split('_secret_')[0];
        
        // Confirm payment success on the server
        await stripeService.confirmPaymentSuccess(sessionId, simulatedPaymentIntentId);
        
        // Call the success callback
        onPaymentSuccess(simulatedPaymentIntentId);
      } else {
        // Real Stripe payment processing
        if (!stripe || !elements) {
          throw new Error('Stripe.js has not loaded yet');
        }
        
        // Process the payment with Stripe using the PaymentElement - simplified approach
        const result = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: window.location.href // In a real app, you'd use a proper success URL
          },
          redirect: 'if_required'
        });

        if (result.error) {
          // Show error to customer
          setPaymentError(result.error.message);
          onPaymentError(result.error.message);
        } else if (result.paymentIntent.status === 'succeeded') {
          // Payment was successful
          // Confirm payment success on the server
          await stripeService.confirmPaymentSuccess(sessionId, result.paymentIntent.id);
          
          // Call the success callback
          onPaymentSuccess(result.paymentIntent.id);
        } else {
          // Unexpected status
          setPaymentError(`Payment status: ${result.paymentIntent.status}`);
          onPaymentError(`Unexpected payment status: ${result.paymentIntent.status}`);
        }
      }
    } catch (error) {
      console.error('Payment confirmation error:', error);
      setPaymentError('Error processing payment. Please try again.');
      onPaymentError('Error processing payment. Please try again.');
    } finally {
      setIsProcessing(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Show simulation mode notice if in simulation mode */}
      {isSimulationMode && (
        <div style={{
          backgroundColor: 'rgba(111, 68, 255, 0.05)',
          borderRadius: '8px',
          border: '1px solid var(--purple-200)',
          padding: '10px 15px',
          marginBottom: '15px',
          fontSize: '14px',
          color: 'var(--purple-800)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            <strong>Demo Payment Mode</strong>
          </div>
          <p style={{ margin: 0 }}>
            This is a demo payment form. No actual charges will be made, and no real card data is processed.
            Enter any card number (like 4242 4242 4242 4242), any future expiry date, and any CVC.
          </p>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        {/* Show Stripe Card Element only */}
        <div
          style={{
            marginBottom: '10px',
            transition: 'all 0.2s ease',
            borderRadius: '8px'
          }}
        >
          {isSimulationMode ? (
            /* Simplified simulation card form - styled to match Stripe Element */
            <div>              
              <div style={{ 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '15px',
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}>
                <div style={{ 
                  fontSize: '14px',
                  marginBottom: '12px',
                  color: 'var(--neutral-600)',
                  fontWeight: '500'
                }}>
                  Card
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  <input
                    id="cardNumber"
                    name="cardNumber"
                    placeholder="1234 1234 1234 1234"
                    value={simulationFormData.cardNumber}
                    onChange={handleSimulationInputChange}
                    style={{
                      width: '100%',
                      padding: '16px',
                      fontSize: '16px',
                      borderRadius: '8px',
                      border: '1px solid #e0e0e0',
                      outline: 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: 'none',
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--purple-600)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#e0e0e0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <input
                      id="cardExpiry"
                      name="cardExpiry"
                      placeholder="MM / YY"
                      value={simulationFormData.cardExpiry}
                      onChange={handleSimulationInputChange}
                      style={{
                        flex: 1,
                        padding: '16px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--purple-600)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <input
                      id="cardCvc"
                      name="cardCvc"
                      placeholder="CVC"
                      value={simulationFormData.cardCvc}
                      onChange={handleSimulationInputChange}
                      style={{
                        flex: 1,
                        padding: '16px',
                        fontSize: '16px',
                        borderRadius: '8px',
                        border: '1px solid #e0e0e0',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'none',
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'var(--purple-600)';
                        e.target.style.boxShadow = '0 0 0 3px rgba(111, 68, 255, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e0e0e0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  </div>
                </div>
              </div>
            
              {/* Simulation test card tip */}
              <div style={{
                padding: '10px 12px',
                backgroundColor: 'rgba(111, 68, 255, 0.05)',
                border: '1px solid var(--purple-100)',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--purple-800)',
                marginBottom: '15px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Test card: <strong>4242 4242 4242 4242</strong> | Exp: <strong>Any future date</strong> | CVC: <strong>Any 3 digits</strong></span>
              </div>
            </div>
          ) : (
            /* Real Stripe Payment Element - Card only */
            <PaymentElement 
              onChange={e => setCardComplete(e.complete)}
              options={{
                // Simplified options for Stripe's latest API
                type: 'card'
              }}
            />
          )}
        </div>
        
        {/* Show error message if there is one */}
        {paymentError && (
          <p style={{ 
            color: 'var(--primary)', 
            fontSize: '12px', 
            marginTop: '5px',
            fontWeight: '500'
          }}>
            {paymentError}
          </p>
        )}
      </div>

      {/* Payment button */}
      <button
        onClick={handleSubmit}
        disabled={isProcessing || 
          (isSimulationMode ? !simulationFormComplete : (!stripe || !elements || !cardComplete)) || 
          !clientSecret}
        style={{
          width: '100%',
          backgroundColor: isProcessing || 
            (isSimulationMode ? !simulationFormComplete : (!stripe || !elements || !cardComplete)) || 
            !clientSecret
              ? 'var(--neutral-200)' 
              : 'var(--primary)',
          color: 'white',
          padding: '16px',
          borderRadius: '8px',
          border: 'none',
          fontSize: '16px',
          fontWeight: '700',
          cursor: isProcessing || 
            (isSimulationMode ? !simulationFormComplete : (!stripe || !elements || !cardComplete)) || 
            !clientSecret
              ? 'not-allowed' 
              : 'pointer',
          transition: 'all 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
        }}
        onMouseEnter={(e) => {
          const isEnabled = !isProcessing && 
            (isSimulationMode ? simulationFormComplete : (stripe && elements && cardComplete)) && 
            clientSecret;
          
          if (isEnabled) {
            e.currentTarget.style.backgroundColor = '#e50036';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 60, 0.25)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isProcessing || 
            (isSimulationMode ? !simulationFormComplete : (!stripe || !elements || !cardComplete)) || 
            !clientSecret
              ? 'var(--neutral-200)' 
              : 'var(--primary)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {isProcessing ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="40 20" />
              <style>{`
                @keyframes spin {
                  100% {
                    transform: rotate(360deg);
                  }
                }
              `}</style>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
            Pay ${amount?.toFixed(2) || '0.00'}
          </>
        )}
      </button>
      
      {/* Secure payment notice */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '15px',
        color: 'var(--neutral-500)',
        fontSize: '13px',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
        Secure Payment | Powered by Stripe
      </div>
    </div>
  );
};

// Main Stripe payment form with Elements provider
const StripePaymentForm = ({ 
  sessionId, 
  buyerInfo, 
  onPaymentSuccess, 
  onPaymentError,
  isSubmitting,
  setIsSubmitting,
  amount
}) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [isConfigured, setIsConfigured] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const [isSimulationMode, setIsSimulationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Create a payment intent when the component loads
  useEffect(() => {
    async function createIntent() {
      try {
        setIsLoading(true);
        // Request a payment intent from the server
        const response = await stripeService.createPaymentIntent(sessionId);
        
        // Check if we're in simulation mode
        if (response.isSimulated) {
          console.log('Running in Stripe simulation mode');
          setIsSimulationMode(true);
        }
        
        // Set the client secret from the payment intent
        setClientSecret(response.clientSecret);
        setIsLoading(false);
      } catch (error) {
        console.error('Error creating payment intent:', error);
        setIsLoading(false);
      }
    }

    // Get the Stripe publishable key from the service
    const publishableKey = stripeService.getStripePublishableKey();
    
    // Check if Stripe is properly configured
    const isConfigured = stripeService.isStripeConfigured();
    setIsConfigured(isConfigured);

    if (isConfigured) {
      // Initialize Stripe with the publishable key
      setStripePromise(loadStripe(publishableKey));
    }

    if (sessionId) {
      createIntent();
    }
  }, [sessionId]);

  // Our simulated Stripe service will always return as configured, but we'll handle
  // the transition in case the user has an actual Stripe key configured
  if (!isConfigured) {
    console.log("Using simulated Stripe implementation");
    // Force simulation mode
    setIsSimulationMode(true);
    
    // Use a simulated Stripe instance
    if (!stripePromise) {
      const dummyKey = 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Dummy key for simulation
      setStripePromise(loadStripe(dummyKey));
    }
    
    // Generate a simulated client secret if needed
    if (!clientSecret) {
      setClientSecret(`sim_${Math.random().toString(36).substring(2)}_secret_${Math.random().toString(36).substring(2)}`);
    }
  }

  // If Stripe is loading or client secret isn't ready, show a loading message
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '150px'
      }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
          <circle cx="12" cy="12" r="10" stroke="var(--purple-600)" strokeWidth="4" strokeDasharray="40 20" />
          <style>{`
            @keyframes spin {
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </svg>
        <span style={{ marginLeft: '15px', color: 'var(--neutral-600)' }}>
          {!stripePromise ? 'Loading Stripe...' : 'Preparing payment form...'}
        </span>
      </div>
    );
  }

  // If client secret isn't ready, show an error
  if (!clientSecret) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: 'rgba(255, 0, 60, 0.05)',
        borderRadius: '8px',
        border: '1px solid var(--primary)',
        marginBottom: '20px'
      }}>
        <h3 style={{ color: 'var(--primary)', marginTop: 0 }}>Error Initializing Payment</h3>
        <p>We couldn't initialize the payment process. Please try again later or contact support.</p>
      </div>
    );
  }

  // Set up the options with client secret for Elements
  // Create a simplified configuration that meets Stripe's requirements
  const options = {
    clientSecret,
    appearance: stripeElementsOptions.appearance,
    // Simple configuration that works based on Stripe's latest API
    locale: 'en'
  };

  // Render Stripe Elements provider with the Checkout form
  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm 
        sessionId={sessionId}
        buyerInfo={buyerInfo}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        amount={amount}
        clientSecret={clientSecret}
        isSimulationMode={isSimulationMode}
      />
    </Elements>
  );
};

// Export as both named and default export
export { StripePaymentForm };
export default StripePaymentForm;