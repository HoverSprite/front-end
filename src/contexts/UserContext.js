// src/contexts/UserContext.js

import React, { createContext, useContext } from 'react';

// Create the context
const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ user, setUser, children }) => (
    <UserContext.Provider value={{ user, setUser }}>
        {children}
    </UserContext.Provider>
);

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);
