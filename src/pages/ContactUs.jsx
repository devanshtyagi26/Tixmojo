import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import styled from 'styled-components';
import { FaRegEnvelope, FaPhoneAlt } from 'react-icons/fa';
import ScrollAnimation from '../utils/ScrollAnimation';
import { PageSEO } from '../utils/SEO';
import { contactFormSubmit } from '../services/contactService';
import { useTranslation } from 'react-i18next';

const ContactUs = () => {
  const { t } = useTranslation();
  
  // Make navbar background always visible on this page
  useEffect(() => {
    // Find the nav element directly
    const navElement = document.querySelector('nav');
    
    if (navElement) {
      // Store original styles to restore later
      const originalBackground = navElement.style.background;
      const originalBackdropFilter = navElement.style.backdropFilter;
      const originalBoxShadow = navElement.style.boxShadow;
      
      // Apply new styles directly
      navElement.style.background = 'rgba(255, 255, 255, 0.95)';
      navElement.style.backdropFilter = 'blur(10px)';
      navElement.style.boxShadow = '0 4px 20px rgba(111, 68, 255, 0.1)';
      
      // Clean up function to restore original styles when component unmounts
      return () => {
        navElement.style.background = originalBackground;
        navElement.style.backdropFilter = originalBackdropFilter;
        navElement.style.boxShadow = originalBoxShadow;
      };
    }
  }, []);
  
  // Form validation schema with translations
  const schema = yup.object().shape({
    name: yup.string().required(t('contactPage.validation.nameRequired')).min(2, t('contactPage.validation.nameLength')),
    email: yup.string().required(t('contactPage.validation.emailRequired')).email(t('contactPage.validation.emailValid')),
    message: yup.string().required(t('contactPage.validation.messageRequired')).min(10, t('contactPage.validation.messageLength'))
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await contactFormSubmit(data);
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitError(error.message || t('contactPage.form.error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageSEO
        title="Contact Us | TixMojo"
        description="Reach out to the TixMojo team for questions, feedback, or support. We're here to help!"
        canonicalPath="/contact"
      />
      
      <ContactContainer>
        <ContactHero>
          <h1><span>{t('contactPage.title')}</span></h1>
        </ContactHero>
        
        <ContactWrapper>
          <ContactForm>
            <h2>Send Us a Message</h2>
            <p>Have questions about an event, need help with tickets, or want to provide feedback? Fill out the form below and our team will get back to you soon.</p>
            
            {submitSuccess ? (
              <SuccessMessage>
                <div className="success-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3>{t('contactPage.form.success')}</h3>
                <p>{t('contactPage.form.successMessage')}</p>
                <Button type="button" onClick={() => setSubmitSuccess(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                  {t('contactPage.form.sendAnother')}
                </Button>
              </SuccessMessage>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)}>
                <FormRow>
                  <FormGroup>
                    <FieldLabel>Full Name <span>Required</span></FieldLabel>
                    <Input 
                      type="text" 
                      placeholder="Enter your full name" 
                      {...register('name')}
                      error={errors.name ? true : false}
                    />
                    {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
                  </FormGroup>
                  
                  <FormGroup>
                    <FieldLabel>Email Address <span>Required</span></FieldLabel>
                    <Input 
                      type="email" 
                      placeholder="Enter your email address" 
                      {...register('email')}
                      error={errors.email ? true : false}
                    />
                    {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
                  </FormGroup>
                </FormRow>
                
                <FormGroup>
                  <FieldLabel>Message <span>Required</span></FieldLabel>
                  <TextArea 
                    placeholder="What would you like to ask us?" 
                    rows="5"
                    {...register('message')}
                    error={errors.message ? true : false}
                  />
                  {errors.message && <ErrorMessage>{errors.message.message}</ErrorMessage>}
                </FormGroup>
                
                {submitError && (
                  <FormError>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    {submitError}
                  </FormError>
                )}
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
                      {t('contactPage.form.sending')}
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                      {t('contactPage.form.button')}
                    </>
                  )}
                </Button>
              </form>
            )}
          </ContactForm>
          
          <ContactSidebar>
            <h2>Contact Info</h2>
            
            <SidebarSection>
              <SidebarTitle>Customer Support</SidebarTitle>
              <ContactItem>
                <FaRegEnvelope />
                <div>
                  <span>Email Us</span>
                  <a href="mailto:info@tixmojo.com">{t('contactPage.info.emailAddress')}</a>
                </div>
              </ContactItem>
              
              <ContactItem>
                <FaPhoneAlt />
                <div>
                  <span>Call Us</span>
                  <a href="tel:+61483952024">{t('contactPage.info.phoneNumber')}</a>
                </div>
              </ContactItem>
            </SidebarSection>
            
            <SidebarSection>
              <SidebarTitle>Office Hours</SidebarTitle>
              <p style={{ fontSize: '14px', color: 'var(--gray)', margin: '0 0 5px 0' }}>
                <strong>Monday-Friday:</strong> 9:00 AM - 6:00 PM
              </p>
              <p style={{ fontSize: '14px', color: 'var(--gray)', margin: '0' }}>
                <strong>Weekend:</strong> 10:00 AM - 4:00 PM
              </p>
            </SidebarSection>
            
            <QuickLinks>
              <h4>Helpful Resources</h4>
              <ul>
                <li><a href="/page-not-found">FAQ</a></li>
                <li><a href="/page-not-found">Terms & Conditions</a></li>
                <li><a href="/page-not-found">Refund Policy</a></li>
                <li><a href="/page-not-found">Privacy Policy</a></li>
              </ul>
            </QuickLinks>
            
            <InfoBadge>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
              <p>For <strong>urgent ticket issues</strong>, please call our customer service line for immediate assistance.</p>
            </InfoBadge>
          </ContactSidebar>
        </ContactWrapper>
      </ContactContainer>
    </>
  );
};

// Styled Components
const ContactContainer = styled.div`
  width: 100%;
  min-height: calc(100vh - 90px);
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f8f9fc;
`;

const ContactHero = styled.div`
  width: 100%;
  height: 260px;
  background: linear-gradient(135deg, var(--purple-700) 0%, var(--purple-500) 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='rgba(255,255,255,.08)' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.7;
  }
  
  h1 {
    color: white;
    font-size: 48px;
    font-weight: 800;
    text-align: center;
    margin: 0;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 2;
    position: relative;
    
    span {
      display: inline-block;
      padding: 0 15px;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 70px;
        height: 4px;
        background: white;
        border-radius: 2px;
      }
    }
  }
  
  @media (max-width: 768px) {
    height: 200px;
    
    h1 {
      font-size: 36px;
    }
  }
`;

const ContactWrapper = styled.div`
  display: flex;
  max-width: 1200px;
  width: 100%;
  margin: -60px auto 60px;
  position: relative;
  z-index: 2;
  
  @media (max-width: 992px) {
    flex-direction: column;
    margin-top: -40px;
    padding: 0 20px;
  }
`;

const ContactForm = styled.div`
  flex: 3;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 40px;
  margin-right: 20px;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 25px;
    color: var(--dark);
    position: relative;
    display: inline-block;
    
    &::before {
      content: '';
      position: absolute;
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 25px;
      background: var(--purple-600);
      border-radius: 3px;
    }
  }
  
  p {
    color: var(--gray);
    margin-bottom: 30px;
    font-size: 15px;
    line-height: 1.6;
  }
  
  form {
    margin-bottom: 0;
  }
  
  @media (max-width: 992px) {
    margin-right: 0;
    margin-bottom: 20px;
  }
`;

const ContactSidebar = styled.div`
  flex: 1;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  padding: 40px;
  display: flex;
  flex-direction: column;
  
  h2 {
    font-size: 24px;
    font-weight: 700;
    margin-bottom: 25px;
    color: var(--dark);
    position: relative;
    display: inline-block;
    
    &::before {
      content: '';
      position: absolute;
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      width: 6px;
      height: 25px;
      background: var(--purple-600);
      border-radius: 3px;
    }
  }
`;

const EventImageBackground = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 0 12px 12px 0;
  
  @media (max-width: 992px) {
    border-radius: 12px 12px 0 0;
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(111, 68, 255, 0.9) 0%, rgba(236, 56, 188, 0.7) 100%);
  z-index: 1;
  
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: -100px;
    width: 100px;
    height: 100%;
    background: linear-gradient(90deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 100%);
    z-index: 2;
  }
`;

const ConcertCrowd = styled.div`
  width: 100%;
  height: 100%;
  background-color: #333;
  position: relative;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  
  &::before {
    background: radial-gradient(circle at 30% 50%, #5a3db3 0%, transparent 50%),
                radial-gradient(circle at 70% 20%, #e83a93 0%, transparent 40%);
    opacity: 0.5;
  }
  
  &::after {
    background-image: 
      repeating-linear-gradient(
        45deg,
        rgba(255, 255, 255, 0.05) 0px,
        rgba(255, 255, 255, 0.05) 2px,
        transparent 2px,
        transparent 4px
      ),
      repeating-linear-gradient(
        -45deg,
        rgba(255, 255, 255, 0.05) 0px,
        rgba(255, 255, 255, 0.05) 2px,
        transparent 2px,
        transparent 4px
      );
    opacity: 0.3;
    animation: movePattern 20s linear infinite;
  }
  
  @keyframes movePattern {
    0% {
      background-position: 0 0;
    }
    100% {
      background-position: 100px 100px;
    }
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  position: relative;
  flex: 1;
  
  label {
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--dark);
  }
`;

const FieldLabel = styled.label`
  display: flex;
  justify-content: space-between;
  
  span {
    color: var(--purple-600);
    font-size: 13px;
    font-weight: 500;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${props => props.error ? 'var(--error-400)' : '#e1e5ee'};
  border-radius: 6px;
  background: ${props => props.error ? 'var(--error-50)' : 'white'};
  font-size: 15px;
  color: var(--dark);
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  
  &:focus {
    outline: none;
    border-color: var(--purple-400);
    box-shadow: 0 0 0 3px rgba(111, 68, 255, 0.15);
  }
  
  &::placeholder {
    color: #b0b7c3;
    font-weight: 400;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid ${props => props.error ? 'var(--error-400)' : '#e1e5ee'};
  border-radius: 6px;
  background: ${props => props.error ? 'var(--error-50)' : 'white'};
  font-size: 15px;
  color: var(--dark);
  resize: vertical;
  min-height: 120px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  
  &:focus {
    outline: none;
    border-color: var(--purple-400);
    box-shadow: 0 0 0 3px rgba(111, 68, 255, 0.15);
  }
  
  &::placeholder {
    color: #b0b7c3;
    font-weight: 400;
  }
`;

const Button = styled.button`
  background: var(--purple-600);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 15px 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  svg {
    margin-right: 8px;
    font-size: 18px;
  }
  
  &:hover {
    background: var(--purple-700);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(111, 68, 255, 0.2);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #b0b7c3;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const ErrorMessage = styled.p`
  color: var(--error-600);
  font-size: 14px;
  margin-top: 5px;
  margin-left: 2px;
`;

const FormError = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: #FFF5F5;
  border-left: 4px solid #E53E3E;
  color: #E53E3E;
  padding: 12px 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
  line-height: 1.5;
  
  svg {
    margin-right: 10px;
    color: #E53E3E;
    flex-shrink: 0;
  }
`;

const SuccessMessage = styled.div`
  background-color: #F0FFF4;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  
  h3 {
    color: #276749;
    font-size: 28px;
    margin-bottom: 15px;
    font-weight: 700;
  }
  
  p {
    color: #2F855A;
    margin-bottom: 30px;
    font-size: 16px;
    line-height: 1.6;
  }
  
  button {
    padding: 12px 24px;
    margin-top: 10px;
  }
  
  .success-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background-color: #38A169;
    color: white;
    border-radius: 50%;
    margin: 0 auto 20px;
    font-size: 30px;
  }
`;

const SidebarSection = styled.div`
  margin-bottom: 30px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SidebarTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 15px;
  position: relative;
  transition: all 0.3s ease;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  svg {
    color: var(--purple-600);
    margin-right: 12px;
    font-size: 20px;
    flex-shrink: 0;
  }
  
  div {
    display: flex;
    flex-direction: column;
  }
  
  span {
    font-weight: 600;
    margin-bottom: 2px;
    color: var(--dark);
  }
  
  a {
    color: var(--gray);
    text-decoration: none;
    transition: all 0.2s;
    font-size: 14px;
    
    &:hover {
      color: var(--purple-600);
    }
  }
`;

const QuickLinks = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #f0f0f5;
  
  h4 {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 15px;
    color: var(--dark);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  li {
    margin-bottom: 10px;
    position: relative;
    padding-left: 15px;
    
    &:before {
      content: '•';
      position: absolute;
      left: 0;
      top: 0;
      color: var(--purple-500);
    }
    
    a {
      color: var(--gray);
      text-decoration: none;
      transition: all 0.2s;
      font-size: 14px;
      
      &:hover {
        color: var(--purple-600);
      }
    }
  }
`;

const InfoBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background-color: #f5f6fa;
  padding: 8px 12px;
  border-radius: 4px;
  margin-top: 20px;
  border-left: 3px solid var(--purple-500);
  
  svg {
    color: var(--purple-600);
    margin-right: 8px;
    font-size: 16px;
  }
  
  p {
    margin: 0;
    font-size: 13px;
    color: var(--gray);
  }
  
  strong {
    color: var(--dark);
    font-weight: 600;
  }
`;

export default ContactUs;