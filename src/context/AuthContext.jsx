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
    localStorage.setItem('user', JSON.stringify(userData));
    setCurrentUser(userData);
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