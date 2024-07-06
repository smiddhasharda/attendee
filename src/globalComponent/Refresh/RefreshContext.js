import React, { createContext, useState, useCallback } from "react";

export const RefreshContext = createContext();

export const RefreshProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);

  const triggerRefresh = useCallback(() => {
    setRefresh((prev) => !prev);
  }, []);

  return (
    <RefreshContext.Provider value={{ refresh, triggerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
