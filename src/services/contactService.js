import { post } from './api';

/**
 * Submits the contact form data to the API
 * @param {Object} formData - Form data including name, email, and message
 * @returns {Promise} - Resolves when the form is successfully submitted
 */
export const contactFormSubmit = async (formData) => {
  try {
    return await post('/contact', formData);
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
};