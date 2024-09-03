 import { createContext, useState, useContext } from 'react';

// Create Context
const CookiesContext = createContext();

// Create a provider component
export const CookiesProvider = ({ children }) => {
  const [hasConsented, setHasConsented] = useState(false);

  return (
    <CookiesContext.Provider value={{ hasConsented, setHasConsented }}>
      {children}
    </CookiesContext.Provider>
  );
};

// Custom hook for using context
export const useCookies = () => {
  const context = useContext(CookiesContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookiesProvider');
  }
  return context;
};
