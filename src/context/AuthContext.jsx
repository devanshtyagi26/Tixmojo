import React, { createContext, useState, useEffect, useContext } from 'react';

// Create authentication context
const AuthContext = createContext(null);

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  // Login user
  const login = (userData) => {
    // Process Google OAuth data if available
    let processedData = userData;
    
    if (userData.provider === 'google') {
      // Extract and normalize phone number from Google user data if available
      let phoneNumber = userData.phoneNumber || '';
      
      // If no phone number is available but we have a sub (Google ID), we can
      // simulate one for demo purposes with the last 8 digits of the ID
      if (!phoneNumber && userData.sub) {
        const lastEight = userData.sub.slice(-8);
        phoneNumber = `+1${lastEight}`; // Simulate a US phone number
      }
      
      // Enhance the user data with normalized phone number
      processedData = {
        ...userData,
        phone: phoneNumber
      };
    }
    
    localStorage.setItem('user', JSON.stringify(processedData));
    setCurrentUser(processedData);
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Update user data
  const updateUser = (userData) => {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!currentUser;
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};