import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Accept payment details from location.state (simulation or direct pass)
  const locationState = location.state;
  const [payment, setPayment] = useState(locationState || null);
  const [loading, setLoading] = useState(!locationState);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If payment already present (simulation mode or direct pass), skip fetch
    if (locationState && locationState.id) {
      setPayment(locationState);
      setLoading(false);
      return;
    }
    // Otherwise, try to fetch from backend using id in state or lastPaymentId
    const paymentIntentId = locationState?.id || sessionStorage.getItem('lastPaymentId');
    if (!paymentIntentId) {
      navigate('/', { replace: true });
      return;
    }
    setLoading(true);
    fetch(`/api/stripe/payment-details/${paymentIntentId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPayment(data.data);
        } else {
          navigate('/', { replace: true });
          setError(data.message || 'Could not fetch payment details.');
          setPayment(null);
        }
        setLoading(false);
      })
      .catch(() => {
        navigate('/', { replace: true });
        setError('Could not fetch payment details.');
        setLoading(false);
      });
  }, [locationState, navigate]);

  if (loading) return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading payment details...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 60 }}>{error}</div>;
  if (!payment) return null;

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 24, borderRadius: 10, background: '#f6f9fc', boxShadow: '0 2px 8px #e0e0e0' }}>
      <h2 style={{ color: '#6f44ff', marginBottom: 12 }}>Payment Successful!</h2>
      <p style={{ color: '#424770', fontSize: 18, marginBottom: 20 }}>Thank you for your purchase. Your payment has been processed.</p>
      <div style={{ background: '#fff', borderRadius: 8, padding: 20, boxShadow: '0 1px 4px #eee', marginBottom: 16 }}>
        <div style={{ marginBottom: 10 }}><strong>Amount Paid:</strong> ${((payment.amount || 0) / 100).toFixed(2)}</div>
        <div style={{ marginBottom: 10 }}><strong>Payment ID:</strong> {payment.id}</div>
        {payment.created && (
          <div style={{ marginBottom: 10 }}><strong>Date:</strong> {new Date(payment.created * 1000).toLocaleString()}</div>
        )}
        {payment.email && (
          <div style={{ marginBottom: 10 }}><strong>Email:</strong> {payment.email}</div>
        )}
        {payment.card && (
          <div style={{ marginBottom: 10 }}><strong>Card:</strong> **** **** **** {payment.card.last4}</div>
        )}
      </div>
      <span style={{ cursor: 'pointer', color: '#6f44ff' }} onClick={() => navigator.clipboard.writeText(payment.id)}>
        📋 {payment.id}
      </span>

      <button onClick={() => navigate('/')} style={{ padding: '10px 24px', background: '#6f44ff', color: '#fff', border: 'none', borderRadius: 5, fontWeight: 600, cursor: 'pointer' }}>Go to Home</button>
    </div>
  );
};

export default PaymentSuccess;
