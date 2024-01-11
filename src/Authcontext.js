import React, { createContext, useContext, useState } from 'react';

// Create the context
export const AuthContext = createContext();

// Create a custom hook to access the context
export const useAuth = () => {
 return useContext(AuthContext);
};

// Create the context provider component
export const AuthProvider = ({ children }) => {
 const [isLoggedIn, setIsLoggedIn] = useState(false); // Initially, the user is not logged in

 // Function to handle login (You can modify this as needed)
 const login = () => {
  setIsLoggedIn(true);
  console.log("User has logged in");
};
 // Function to handle logout (You can modify this as needed)
 const logout = () => {
  setIsLoggedIn(false);
  window.location.href = "/";
};
 // Value provided by the context
 const contextValue = {
   isLoggedIn,
   login,
   logout
 };

 return (
   <AuthContext.Provider value={contextValue}>
     {children}
   </AuthContext.Provider>
 );
};