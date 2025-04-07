import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Cleave from 'cleave.js/react';
import zxcvbn from 'zxcvbn';
import ISO31661a2 from 'iso-3166-1-alpha-2';
import creditCardType from 'credit-card-type';
import { useAuth } from '../../context/AuthContext';

// Buyer information validation schema
const buyerInfoSchema = yup.object({
  firstName: yup
    .string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/, 'First name can only contain letters, spaces, hyphens, and apostrophes'),
  
  lastName: yup
    .string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot exceed 50 characters')
    .matches(/^[a-zA-Z\s-']+$/, 'Last name can only contain letters, spaces, hyphens, and apostrophes'),
  
  email: yup
    .string()
    .required('Email is required')
    .email('Please enter a valid email address')
    .max(100, 'Email address is too long'),
  
  phone: yup
    .string()
    .required('Phone number is required')
    .matches(/^\d{5,15}$/, 'Phone number must contain 5-15 digits')
});

// Payment information validation schema
const paymentInfoSchema = yup.object({
  cardholderName: yup
    .string()
    .required('Cardholder name is required')
    .min(3, 'Cardholder name must be at least 3 characters')
    .max(100, 'Cardholder name is too long')
    .matches(/^[a-zA-Z\s-']+$/, 'Cardholder name can only contain letters, spaces, hyphens, and apostrophes'),
  
  cardNumber: yup
    .string()
    .required('Card number is required')
    .test('is-credit-card', 'Invalid credit card number', (value) => {
      // Remove all non-digits
      const digitsOnly = value ? value.replace(/\D/g, '') : '';
      
      // Basic card validation using credit-card-type
      const cardInfo = creditCardType(digitsOnly);
      if (cardInfo.length === 0) return false;
      
      // Check if the length matches expected length for the card type
      const { lengths } = cardInfo[0];
      return lengths.includes(digitsOnly.length);
    }),
  
  expiryDate: yup
    .string()
    .required('Expiry date is required')
    .test('expiry-date', 'Expiry date is invalid or expired', (value) => {
      if (!value) return false;
      
      // MM/YY format validation
      if (!/^\d{2}\/\d{2}$/.test(value)) return false;
      
      const [month, year] = value.split('/');
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year, 10) + 2000; // Convert YY to 20YY
      
      if (monthNum < 1 || monthNum > 12) return false;
      
      const now = new Date();
      const currentMonth = now.getMonth() + 1; // 1-12
      const currentYear = now.getFullYear();
      
      // Check if the card is expired
      return (yearNum > currentYear || (yearNum === currentYear && monthNum >= currentMonth));
    }),
  
  cvv: yup
    .string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  
  zipCode: yup
    .string()
    .required('Postal/ZIP code is required')
    .min(3, 'Postal/ZIP code is too short')
    .max(10, 'Postal/ZIP code is too long')
});

// Country data
const countryOptions = ISO31661a2.getCountries()
  .map(country => ({
    code: ISO31661a2.getCode(country),
    name: country,
    dialCode: getDialCode(ISO31661a2.getCode(country))
  }))
  .filter(country => country.code && country.dialCode)
  .sort((a, b) => a.name.localeCompare(b.name));

// Popular countries to show at the top
const popularCountries = ['US', 'GB', 'CA', 'AU', 'NZ', 'IN'];
const sortedCountries = [
  ...countryOptions.filter(c => popularCountries.includes(c.code)),
  ...countryOptions.filter(c => !popularCountries.includes(c.code))
];

// Helper function to get dial code based on country code
function getDialCode(countryCode) {
  const codes = {
    'US': '+1', 'CA': '+1', 'GB': '+44', 'AU': '+61', 
    'NZ': '+64', 'IN': '+91', 'DE': '+49', 'FR': '+33',
    'IT': '+39', 'ES': '+34', 'JP': '+81', 'CN': '+86',
    'RU': '+7', 'BR': '+55', 'MX': '+52', 'ZA': '+27'
  };
  
  return codes[countryCode] || '';
}

const PaymentPortal = ({ event, expiryTime, onExpire, cartItems, totalAmount, discount, onBack, onCancel }) => {
  // Timer state from parent
  const [timeLeft, setTimeLeft] = useState({
    minutes: 0,
    seconds: 0
  });
  
  // Step state
  const [currentStep, setCurrentStep] = useState('buyerInfo'); // 'buyerInfo', 'paymentInfo'
  
  // Country code state
  const [selectedCountry, setSelectedCountry] = useState({
    code: 'AU',
    name: 'Australia',
    dialCode: '+61'
  });
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  
  // Card type state
  const [cardType, setCardType] = useState('');
  
  // Form submission state
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  
  // Security indicator for card entry
  const [cardSecurityScore, setCardSecurityScore] = useState(0);
  
  // Get user from auth context
  const { currentUser, isAuthenticated } = useAuth();
  
  // Default values for form with enhanced Google data handling
  const getDefaultValues = () => {
    // If user is authenticated, use their data
    if (isAuthenticated() && currentUser) {
      // For Google auth, ensure we handle all available fields
      if (currentUser.provider === 'google') {
        // Format phone number if present, removing non-digits
        const formattedPhone = currentUser.phone ? 
          currentUser.phone.replace(/\D/g, '') : '';
        
        // Set default country code based on user locale if available
        if (currentUser.locale) {
          const countryCodeMap = {
            'en-US': 'US',
            'en-GB': 'GB',
            'en-AU': 'AU', 
            'en-CA': 'CA',
            'ja-JP': 'JP'
          };
          
          const countryCode = countryCodeMap[currentUser.locale];
          if (countryCode) {
            const country = sortedCountries.find(c => c.code === countryCode);
            if (country) {
              setSelectedCountry(country);
            }
          }
        }
        
        return {
          firstName: currentUser.firstName || currentUser.given_name || '',
          lastName: currentUser.lastName || currentUser.family_name || '',
          email: currentUser.email || '',
          phone: formattedPhone
        };
      } else {
        // Standard user data
        return {
          firstName: currentUser.firstName || '',
          lastName: currentUser.lastName || '',
          email: currentUser.email || '',
          phone: currentUser.phone || ''
        };
      }
    }
    
    // Otherwise use empty values
    return {
      firstName: '',
      lastName: '',
      email: '',
      phone: ''
    };
  };
  
  // Form for buyer information
  const buyerInfoForm = useForm({
    resolver: yupResolver(buyerInfoSchema),
    mode: 'onBlur',
    defaultValues: getDefaultValues()
  });
  
  // Update form values when currentUser changes
  useEffect(() => {
    if (isAuthenticated() && currentUser) {
      const defaultValues = getDefaultValues();
      
      // Reset form with new values
      buyerInfoForm.reset(defaultValues);
      
      console.log("Updated form with user data:", defaultValues);
    }
  }, [currentUser, isAuthenticated]);
  
  // Form for payment information
  const paymentInfoForm = useForm({
    resolver: yupResolver(paymentInfoSchema),
    mode: 'onBlur',
    defaultValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      zipCode: ''
    }
  });
  
  // Update timer every second
  useEffect(() => {
    if (!expiryTime) return;
    
    const updateTimer = () => {
      try {
        // Ensure expiryTime is a Date object
        const expiry = expiryTime instanceof Date ? expiryTime : new Date(expiryTime);
        const now = new Date();
        const difference = expiry.getTime() - now.getTime();
        
        if (difference <= 0) {
          setTimeLeft({ minutes: 0, seconds: 0 });
          
          // Clear all form data when timer expires
          clearFormData();
          
          // Call the expiry handler from parent
          if (typeof onExpire === 'function') {
            console.log("Payment portal timer expired - calling parent handler");
            onExpire();
          }
          return;
        }
        
        // Calculate minutes and seconds
        const mins = Math.floor((difference / 1000 / 60) % 60);
        const secs = Math.floor((difference / 1000) % 60);
        
        setTimeLeft({ minutes: mins, seconds: secs });
      } catch (error) {
        console.error("Error in countdown timer:", error);
      }
    };
    
    // Initial update
    updateTimer();
    
    // Update every second
    const interval = setInterval(updateTimer, 1000);
    
    // Clean up
    return () => clearInterval(interval);
  }, [expiryTime, onExpire]);
  
  // Clear all form data - for security
  const clearFormData = () => {
    buyerInfoForm.reset();
    paymentInfoForm.reset();
    setCurrentStep('buyerInfo');
  };
  
  // Handle card type detection
  const handleCardNumberChange = (e) => {
    const cardNumber = e.target.value.replace(/\s/g, '');
    const detectedCards = creditCardType(cardNumber);
    
    if (detectedCards.length > 0) {
      const card = detectedCards[0];
      setCardType(card.type);
    } else {
      setCardType('');
    }
    
    // Calculate security score based on card number length
    if (cardNumber.length > 10) {
      const score = zxcvbn(cardNumber.substring(0, 6) + cardNumber.substring(cardNumber.length - 4));
      setCardSecurityScore(score.score); // 0-4 score from zxcvbn
    } else {
      setCardSecurityScore(0);
    }
  };
  
  // Handle form submission for buyer info
  const handleBuyerInfoSubmit = async (data) => {
    if (isFormSubmitting) return;
    
    setIsFormSubmitting(true);
    
    try {
      // Simulate server-side validation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would call an API endpoint
      console.log("Buyer info validated:", {
        ...data, 
        phone: selectedCountry.dialCode + data.phone
      });
      
      // Move to payment info step
      setCurrentStep('paymentInfo');
    } catch (error) {
      console.error("Error validating buyer info:", error);
      buyerInfoForm.setError('root', { 
        type: 'manual',
        message: 'Server validation failed. Please try again.' 
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };
  
  // Handle form submission for payment info
  const handlePaymentInfoSubmit = async (data) => {
    if (isFormSubmitting) return;
    
    setIsFormSubmitting(true);
    
    try {
      // Get buyer info from the first step
      const buyerInfo = buyerInfoForm.getValues();
      
      // Combine data from both forms
      const paymentData = {
        buyerInfo: {
          ...buyerInfo,
          phone: selectedCountry.dialCode + buyerInfo.phone,
          userId: currentUser?.id || null,
          authProvider: currentUser?.provider || null
        },
        paymentInfo: {
          ...data,
          // For security, we'd never send full card details to our server
          // We'd use a payment processor token instead
          cardNumber: data.cardNumber.replace(/\s/g, '').slice(-4).padStart(16, '*'),
          cardType: cardType || 'unknown'
        },
        ticketInfo: {
          tickets: cartItems,
          totalAmount,
          discount,
          finalAmount: (totalAmount + 10 - (totalAmount * discount))
        },
        eventId: event.id
      };
      
      // Log the payment data for debugging (remove in production)
      console.log("Processing payment with data:", paymentData);
      
      // Simulate server-side payment processing with different times based on auth method
      // Google auth is "faster" for demonstration purposes
      const processingTime = currentUser?.provider === 'google' ? 800 : 1500;
      await new Promise(resolve => setTimeout(resolve, processingTime));
      
      // In a real app, this would be handled by a payment processor
      console.log("Payment processed successfully");
      
      // Show success message or redirect
      alert('Payment processed successfully! In a real application, you would be redirected to a confirmation page.');
    } catch (error) {
      console.error("Error processing payment:", error);
      paymentInfoForm.setError('root', { 
        type: 'manual',
        message: 'Payment processing failed. Please try again.' 
      });
    } finally {
      setIsFormSubmitting(false);
    }
  };
  
  // Handle back button
  const handleBack = () => {
    // If on payment info step, go back to buyer info step
    if (currentStep === 'paymentInfo') {
      setCurrentStep('buyerInfo');
    } else {
      // If on buyer info step, go back to ticket selection
      // This will be handled by the parent component through onBack prop
      if (typeof onBack === 'function') {
        onBack();
      }
    }
  };
  
  // Get input style based on validation state
  const getInputStyle = (errors, touched, focused) => {
    const baseStyle = {
      width: '100%',
      padding: '15px',
      fontSize: '16px',
      borderRadius: '8px',
      border: '1px solid',
      outline: 'none',
      transition: 'all 0.2s ease',
    };
    
    if (errors) {
      return {
        ...baseStyle,
        borderColor: 'var(--primary)',
        backgroundColor: 'rgba(255, 0, 60, 0.03)',
      };
    }
    
    if (focused) {
      return {
        ...baseStyle,
        borderColor: 'var(--purple-400)',
        boxShadow: '0 0 0 3px rgba(111, 68, 255, 0.1)',
      };
    }
    
    if (touched) {
      return {
        ...baseStyle,
        borderColor: 'var(--purple-200)',
      };
    }
    
    return {
      ...baseStyle,
      borderColor: '#e0e0e0',
    };
  };
  
  // Get card icon based on detected card type
  const getCardIcon = () => {
    const icons = {
      'visa': '💳 Visa',
      'mastercard': '💳 Mastercard',
      'american-express': '💳 Amex',
      'discover': '💳 Discover',
      'diners-club': '💳 Diners',
      'jcb': '💳 JCB',
      'unionpay': '💳 UnionPay',
      'maestro': '💳 Maestro',
      'mir': '💳 Mir',
      'elo': '💳 Elo',
      'hiper': '💳 Hiper',
      'hipercard': '💳 Hipercard'
    };
    
    return cardType && icons[cardType] ? icons[cardType] : '💳 Card';
  };
  
  return (
    <div
      style={{
        borderRadius: '24px',
        padding: '30px',
        backgroundColor: 'var(--neutral-50)',
        marginTop: '50px',
        marginBottom: '50px',
        boxShadow: '0 10px 30px rgba(111, 68, 255, 0.1)',
        border: '1px solid var(--purple-100)',
        position: 'relative',
      }}
    >
      {/* Back and cancel buttons */}
      <div style={{ 
        display: 'flex',
        gap: '10px',
        marginBottom: '20px'
      }}>
        <button
          onClick={handleBack}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid var(--neutral-300)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--neutral-100)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5"></path>
            <path d="M12 19l-7-7 7-7"></path>
          </svg>
          Back
        </button>
        
        <button
          onClick={() => {
            // Call onCancel if available, otherwise refresh page
            if (typeof onCancel === 'function') {
              onCancel();
            } else {
              window.location.reload();
            }
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid var(--primary)',
            borderRadius: '20px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            color: 'var(--primary)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 0, 60, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18"></path>
            <path d="M6 6l12 12"></path>
          </svg>
          Cancel Booking
        </button>
      </div>
      
      {/* Main content container */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'row',
        gap: '30px',
        flexWrap: 'wrap'
      }}>
        {/* Left side - Payment form */}
        <div style={{ 
          flex: '1',
          minWidth: '300px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '30px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
        }}>
          {/* Progress tabs */}
          <div style={{
            display: 'flex',
            marginBottom: '30px',
            borderRadius: '30px',
            overflow: 'hidden',
            width: 'fit-content',
          }}>
            <div style={{
              backgroundColor: currentStep === 'buyerInfo' ? 'var(--primary)' : 'rgb(245, 245, 245)',
              color: currentStep === 'buyerInfo' ? 'white' : 'var(--neutral-800)',
              padding: '10px 20px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s',
            }}>
              BUYER INFORMATION
            </div>
            <div style={{
              backgroundColor: currentStep === 'paymentInfo' ? 'var(--primary)' : 'rgb(245, 245, 245)',
              color: currentStep === 'paymentInfo' ? 'white' : 'var(--neutral-800)',
              padding: '10px 20px',
              fontWeight: '600',
              fontSize: '14px',
              transition: 'all 0.3s',
            }}>
              PAYMENT DETAILS
            </div>
          </div>
          
          {/* Form fields change based on current step */}
          {currentStep === 'buyerInfo' ? (
            <form onSubmit={buyerInfoForm.handleSubmit(handleBuyerInfoSubmit)}>
              {/* First and Last Name */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="firstName" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: buyerInfoForm.formState.errors.firstName ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    First Name
                  </label>
                  <input
                    id="firstName"
                    {...buyerInfoForm.register('firstName')}
                    autoComplete="given-name"
                    placeholder="John"
                    style={getInputStyle(
                      buyerInfoForm.formState.errors.firstName,
                      buyerInfoForm.formState.touchedFields.firstName,
                      buyerInfoForm.formState.dirtyFields.firstName
                    )}
                  />
                  {buyerInfoForm.formState.errors.firstName && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {buyerInfoForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="lastName" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: buyerInfoForm.formState.errors.lastName ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    {...buyerInfoForm.register('lastName')}
                    autoComplete="family-name"
                    placeholder="Doe"
                    style={getInputStyle(
                      buyerInfoForm.formState.errors.lastName,
                      buyerInfoForm.formState.touchedFields.lastName,
                      buyerInfoForm.formState.dirtyFields.lastName
                    )}
                  />
                  {buyerInfoForm.formState.errors.lastName && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {buyerInfoForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Phone Number with Country Code */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="phone" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: buyerInfoForm.formState.errors.phone ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Phone Number
                </label>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '8px',
                  border: `1px solid ${buyerInfoForm.formState.errors.phone ? 'var(--primary)' : '#e0e0e0'}`,
                  overflow: 'hidden',
                  backgroundColor: buyerInfoForm.formState.errors.phone ? 'rgba(255, 0, 60, 0.03)' : 'white',
                  position: 'relative',
                }}>
                  {/* Country code dropdown */}
                  <div 
                    onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                    style={{ 
                      padding: '15px',
                      backgroundColor: '#f9f9f9',
                      borderRight: '1px solid #e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: 'var(--neutral-600)',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      minWidth: '110px',
                      userSelect: 'none',
                    }}
                  >
                    {selectedCountry.dialCode} ({selectedCountry.code})
                    <svg 
                      width="12" 
                      height="12" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      style={{
                        transition: 'transform 0.2s ease',
                        transform: showCountryDropdown ? 'rotate(180deg)' : 'rotate(0)',
                      }}
                    >
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </div>
                  
                  {/* Phone input */}
                  <input
                    id="phone"
                    type="tel"
                    {...buyerInfoForm.register('phone')}
                    autoComplete="tel"
                    placeholder="412 345 678"
                    style={{
                      flex: 1,
                      border: 'none',
                      padding: '15px',
                      fontSize: '16px',
                      outline: 'none',
                      backgroundColor: 'transparent',
                    }}
                  />
                  
                  {/* Country dropdown */}
                  {showCountryDropdown && (
                    <div style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      backgroundColor: 'white',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                      width: '300px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      zIndex: 10,
                      marginTop: '5px',
                    }}>
                      <div style={{ padding: '10px', borderBottom: '1px solid #f0f0f0' }}>
                        <input
                          type="text"
                          placeholder="Search countries..."
                          style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #e0e0e0',
                            borderRadius: '4px',
                            fontSize: '14px',
                          }}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => {
                            // Filter countries (would implement if needed)
                          }}
                        />
                      </div>
                      
                      {sortedCountries.map((country) => (
                        <div
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country);
                            setShowCountryDropdown(false);
                          }}
                          style={{
                            padding: '8px 12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            borderBottom: '1px solid #f5f5f5',
                            backgroundColor: selectedCountry.code === country.code ? '#f5f5f5' : 'transparent',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#f9f9f9';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = selectedCountry.code === country.code ? '#f5f5f5' : 'transparent';
                          }}
                        >
                          <span>{country.name}</span>
                          <span style={{ color: 'var(--neutral-600)', fontSize: '14px' }}>
                            {country.dialCode}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {buyerInfoForm.formState.errors.phone && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {buyerInfoForm.formState.errors.phone.message}
                  </p>
                )}
              </div>
              
              {/* Email */}
              <div style={{ marginBottom: '30px' }}>
                <label 
                  htmlFor="email" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: buyerInfoForm.formState.errors.email ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  {...buyerInfoForm.register('email')}
                  autoComplete="email"
                  placeholder="your.email@example.com"
                  style={getInputStyle(
                    buyerInfoForm.formState.errors.email,
                    buyerInfoForm.formState.touchedFields.email,
                    buyerInfoForm.formState.dirtyFields.email
                  )}
                />
                {buyerInfoForm.formState.errors.email && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {buyerInfoForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              {/* Form error */}
              {buyerInfoForm.formState.errors.root && (
                <div style={{
                  backgroundColor: 'rgba(255, 0, 60, 0.05)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}>
                  {buyerInfoForm.formState.errors.root.message}
                </div>
              )}
              
              {/* Show message if data was pre-filled from Google login */}
              {isAuthenticated() && currentUser && currentUser.provider === 'google' && (
                <div style={{
                  backgroundColor: 'rgba(52, 168, 83, 0.05)',
                  border: '1px solid #34A853',
                  color: '#34A853',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>Your information was pre-filled from your Google account</span>
                </div>
              )}
              
              {/* Show message if user is not authenticated through Google */}
              {isAuthenticated() && currentUser && currentUser.provider !== 'google' && (
                <div style={{
                  backgroundColor: 'rgba(111, 68, 255, 0.05)',
                  border: '1px solid var(--purple-300)',
                  color: 'var(--purple-700)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>Your information was pre-filled from your TixMojo account</span>
                </div>
              )}
              
              {/* Next button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  disabled={isFormSubmitting || !buyerInfoForm.formState.isValid}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    backgroundColor: isFormSubmitting || !buyerInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    fontWeight: '600',
                    fontSize: '16px',
                    cursor: isFormSubmitting || !buyerInfoForm.formState.isValid ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isFormSubmitting && buyerInfoForm.formState.isValid) {
                      e.currentTarget.style.backgroundColor = '#e50036';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = isFormSubmitting || !buyerInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Continue to Payment
                  {isFormSubmitting ? (
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
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Data protection notice */}
              <div style={{
                marginTop: '25px',
                padding: '15px',
                backgroundColor: 'var(--neutral-50)',
                borderRadius: '8px',
                fontSize: '13px',
                color: 'var(--neutral-600)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
                <span>
                  Your personal details are protected and will only be used to process your ticket purchase. 
                  We use bank-level encryption and never store your full payment details.
                </span>
              </div>
            </form>
          ) : (
            <form onSubmit={paymentInfoForm.handleSubmit(handlePaymentInfoSubmit)}>
              {/* Cardholder Name */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="cardholderName" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: paymentInfoForm.formState.errors.cardholderName ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Cardholder Name
                </label>
                <input
                  id="cardholderName"
                  {...paymentInfoForm.register('cardholderName')}
                  autoComplete="cc-name"
                  placeholder="Name on card"
                  style={getInputStyle(
                    paymentInfoForm.formState.errors.cardholderName,
                    paymentInfoForm.formState.touchedFields.cardholderName,
                    paymentInfoForm.formState.dirtyFields.cardholderName
                  )}
                />
                {paymentInfoForm.formState.errors.cardholderName && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {paymentInfoForm.formState.errors.cardholderName.message}
                  </p>
                )}
              </div>
              
              {/* Card Number */}
              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="cardNumber" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: paymentInfoForm.formState.errors.cardNumber ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  Card Number
                </label>
                <div style={{
                  position: 'relative',
                }}>
                  <Cleave
                    id="cardNumber"
                    options={{
                      creditCard: true,
                      delimiter: ' ',
                    }}
                    placeholder="1234 5678 9012 3456"
                    autoComplete="cc-number"
                    {...paymentInfoForm.register('cardNumber')}
                    onChange={(e) => {
                      paymentInfoForm.setValue('cardNumber', e.target.value);
                      handleCardNumberChange(e);
                    }}
                    style={{
                      ...getInputStyle(
                        paymentInfoForm.formState.errors.cardNumber,
                        paymentInfoForm.formState.touchedFields.cardNumber,
                        paymentInfoForm.formState.dirtyFields.cardNumber
                      ),
                      paddingRight: '60px', // Space for the card icon
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--neutral-500)',
                    fontSize: '14px',
                    pointerEvents: 'none',
                  }}>
                    {cardType && getCardIcon()}
                  </div>
                </div>
                {paymentInfoForm.formState.errors.cardNumber && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {paymentInfoForm.formState.errors.cardNumber.message}
                  </p>
                )}
                
                {/* Security score indicator (only show once some digits are entered) */}
                {paymentInfoForm.watch('cardNumber') && paymentInfoForm.watch('cardNumber').length > 8 && (
                  <div style={{ 
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <div style={{
                      height: '4px',
                      flex: 1,
                      backgroundColor: '#e0e0e0',
                      borderRadius: '2px',
                      overflow: 'hidden',
                    }}>
                      <div 
                        style={{
                          height: '100%',
                          width: `${cardSecurityScore * 25}%`,
                          backgroundColor: cardSecurityScore < 2 ? '#ff5757' : 
                                          cardSecurityScore < 3 ? '#ffb347' : 
                                          cardSecurityScore < 4 ? '#4caf50' : '#2e7d32',
                          transition: 'width 0.3s ease, background-color 0.3s ease',
                        }}
                      />
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: cardSecurityScore < 2 ? '#ff5757' : 
                              cardSecurityScore < 3 ? '#ffb347' : 
                              cardSecurityScore < 4 ? '#4caf50' : '#2e7d32',
                    }}>
                      {cardSecurityScore < 2 ? 'Weak' : 
                      cardSecurityScore < 3 ? 'OK' : 
                      cardSecurityScore < 4 ? 'Good' : 'Strong'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Expiry Date and CVV */}
              <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="expiryDate" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: paymentInfoForm.formState.errors.expiryDate ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    Expiry Date
                  </label>
                  <Cleave
                    id="expiryDate"
                    options={{
                      date: true,
                      datePattern: ['m', 'y'],
                      delimiter: '/',
                    }}
                    placeholder="MM/YY"
                    autoComplete="cc-exp"
                    {...paymentInfoForm.register('expiryDate')}
                    onChange={(e) => {
                      paymentInfoForm.setValue('expiryDate', e.target.value);
                    }}
                    style={getInputStyle(
                      paymentInfoForm.formState.errors.expiryDate,
                      paymentInfoForm.formState.touchedFields.expiryDate,
                      paymentInfoForm.formState.dirtyFields.expiryDate
                    )}
                  />
                  {paymentInfoForm.formState.errors.expiryDate && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {paymentInfoForm.formState.errors.expiryDate.message}
                    </p>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <label 
                    htmlFor="cvv" 
                    style={{
                      display: 'block',
                      fontSize: '14px',
                      color: paymentInfoForm.formState.errors.cvv ? 'var(--primary)' : 'var(--neutral-500)',
                      marginBottom: '5px',
                      fontWeight: '500',
                      transition: 'color 0.2s ease',
                    }}
                  >
                    CVV / CVC
                  </label>
                  <Cleave
                    id="cvv"
                    options={{
                      blocks: [3],
                      numericOnly: true,
                    }}
                    placeholder="123"
                    autoComplete="cc-csc"
                    {...paymentInfoForm.register('cvv')}
                    onChange={(e) => {
                      paymentInfoForm.setValue('cvv', e.target.value);
                    }}
                    style={getInputStyle(
                      paymentInfoForm.formState.errors.cvv,
                      paymentInfoForm.formState.touchedFields.cvv,
                      paymentInfoForm.formState.dirtyFields.cvv
                    )}
                  />
                  {paymentInfoForm.formState.errors.cvv && (
                    <p style={{ 
                      color: 'var(--primary)', 
                      fontSize: '12px', 
                      marginTop: '5px',
                      fontWeight: '500'
                    }}>
                      {paymentInfoForm.formState.errors.cvv.message}
                    </p>
                  )}
                </div>
              </div>
              
              {/* ZIP/Postal Code */}
              <div style={{ marginBottom: '30px' }}>
                <label 
                  htmlFor="zipCode" 
                  style={{
                    display: 'block',
                    fontSize: '14px',
                    color: paymentInfoForm.formState.errors.zipCode ? 'var(--primary)' : 'var(--neutral-500)',
                    marginBottom: '5px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                >
                  ZIP / Postal Code
                </label>
                <input
                  id="zipCode"
                  {...paymentInfoForm.register('zipCode')}
                  autoComplete="postal-code"
                  placeholder="ZIP / Postal Code"
                  style={getInputStyle(
                    paymentInfoForm.formState.errors.zipCode,
                    paymentInfoForm.formState.touchedFields.zipCode,
                    paymentInfoForm.formState.dirtyFields.zipCode
                  )}
                />
                {paymentInfoForm.formState.errors.zipCode && (
                  <p style={{ 
                    color: 'var(--primary)', 
                    fontSize: '12px', 
                    marginTop: '5px',
                    fontWeight: '500'
                  }}>
                    {paymentInfoForm.formState.errors.zipCode.message}
                  </p>
                )}
              </div>
              
              {/* Form error */}
              {paymentInfoForm.formState.errors.root && (
                <div style={{
                  backgroundColor: 'rgba(255, 0, 60, 0.05)',
                  border: '1px solid var(--primary)',
                  color: 'var(--primary)',
                  padding: '10px 15px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '20px',
                }}>
                  {paymentInfoForm.formState.errors.root.message}
                </div>
              )}
              
              {/* Payment button */}
              <button
                type="submit"
                disabled={isFormSubmitting || !paymentInfoForm.formState.isValid}
                style={{
                  width: '100%',
                  backgroundColor: isFormSubmitting || !paymentInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)',
                  color: 'white',
                  padding: '16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '700',
                  cursor: isFormSubmitting || !paymentInfoForm.formState.isValid ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                }}
                onMouseEnter={(e) => {
                  if (!isFormSubmitting && paymentInfoForm.formState.isValid) {
                    e.currentTarget.style.backgroundColor = '#e50036';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 0, 60, 0.25)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = isFormSubmitting || !paymentInfoForm.formState.isValid ? 'var(--neutral-200)' : 'var(--primary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {isFormSubmitting ? (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: 'spin 1s linear infinite' }}>
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" strokeDasharray="40 20" />
                    </svg>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                    Pay ${(totalAmount + 10 - (totalAmount * discount)).toFixed(2)}
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
                Secure Payment | SSL Encrypted
              </div>
              
              {/* Supported payment methods */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                marginTop: '20px',
                flexWrap: 'wrap',
              }}>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
                <span style={{ color: 'var(--neutral-400)', fontSize: '24px' }}>💳</span>
              </div>
            </form>
          )}
          
          {/* Terms and conditions */}
          <div style={{ 
            marginTop: '30px',
            textAlign: 'center',
            fontSize: '14px',
            color: 'var(--neutral-600)'
          }}>
            By clicking 'BOOK', you agree to TixMojo's <a href="#" style={{ 
              color: 'var(--primary)',
              textDecoration: 'none',
              fontWeight: '500'
            }}>Terms of Service</a>.
          </div>
        </div>
        
        {/* Right side - Order summary */}
        <div style={{ 
          width: '300px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '20px',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)',
          height: 'fit-content',
        }}>
          {/* Timer display */}
          <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
            }}>
              {/* Minutes tens */}
              <div style={{
                width: '30px',
                height: '40px',
                backgroundColor: 'black',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                borderRadius: '4px',
              }}>
                {String(timeLeft.minutes).padStart(2, '0')[0]}
              </div>
              
              {/* Minutes ones */}
              <div style={{
                width: '30px',
                height: '40px',
                backgroundColor: 'black',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                borderRadius: '4px',
              }}>
                {String(timeLeft.minutes).padStart(2, '0')[1]}
              </div>
              
              {/* Seconds tens */}
              <div style={{
                width: '30px',
                height: '40px',
                backgroundColor: 'black',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                borderRadius: '4px',
                marginLeft: '5px',
              }}>
                {String(timeLeft.seconds).padStart(2, '0')[0]}
              </div>
              
              {/* Seconds ones */}
              <div style={{
                width: '30px',
                height: '40px',
                backgroundColor: 'black',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: '700',
                borderRadius: '4px',
              }}>
                {String(timeLeft.seconds).padStart(2, '0')[1]}
              </div>
            </div>
          </div>
          
          <div style={{
            fontSize: '14px',
            color: 'var(--neutral-600)',
            textAlign: 'center',
            marginBottom: '20px',
          }}>
            left to complete your purchase
          </div>
          
          {/* Cart items */}
          <div style={{
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '20px',
            borderBottom: '1px solid var(--neutral-200)',
            paddingBottom: '10px',
          }}>
            {cartItems.map((item, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
                borderBottom: index !== cartItems.length - 1 ? '1px solid var(--neutral-100)' : 'none',
              }}>
                <div>
                  <div style={{ fontWeight: '500', marginBottom: '2px' }}>
                    {item.ticket.name} - {item.quantity > 1 ? `${item.quantity} ENTRIES` : '1 ENTRY'}
                  </div>
                  <div style={{ 
                    fontSize: '14px',
                    color: 'var(--neutral-600)',
                  }}>
                    {parseFloat(item.ticket.price).toFixed(2)} {item.ticket.currency}
                    <span style={{ 
                      color: 'var(--primary)',
                      marginLeft: '5px',
                      fontWeight: '500'
                    }}>
                      × {item.quantity}
                    </span>
                  </div>
                </div>
                
                <button
                  disabled={true} // Disabled in payment view
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: 'var(--primary)',
                    cursor: 'not-allowed',
                    opacity: 0.5,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18"></path>
                    <path d="M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {/* Order summary */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              <span>Tickets Selected</span>
              <span style={{ fontWeight: '600' }}>
                {cartItems.reduce((total, item) => total + item.quantity, 0)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              <span>Subtotal</span>
              <span style={{ fontWeight: '600' }}>
                ${totalAmount.toFixed(2)}
              </span>
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '14px',
              marginBottom: '8px',
            }}>
              <span>Service Fee <span style={{ opacity: 0.7 }}>ⓘ</span></span>
              <span style={{ fontWeight: '600' }}>
                $10.00
              </span>
            </div>
            
            {discount > 0 && (
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '14px',
                marginBottom: '8px',
                color: 'var(--primary)',
              }}>
                <span>Discount</span>
                <span style={{ fontWeight: '600' }}>
                  -${(totalAmount * discount).toFixed(2)}
                </span>
              </div>
            )}
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '16px',
              fontWeight: '700',
              marginTop: '15px',
              padding: '10px 0',
              borderTop: '1px solid var(--neutral-200)',
            }}>
              <span>Total</span>
              <span>
                ${(totalAmount + 10 - (totalAmount * discount)).toFixed(2)}
              </span>
            </div>
          </div>
          
          {/* Secure checkout badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '20px',
            fontSize: '12px',
            color: 'var(--neutral-500)',
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            Secure Checkout
          </div>
        </div>
      </div>
      
      {/* Animation keyframes */}
      <style>
        {`
          @keyframes spin {
            100% {
              transform: rotate(360deg);
            }
          }
          
          @keyframes slideIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PaymentPortal;