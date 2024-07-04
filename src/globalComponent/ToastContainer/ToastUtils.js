// ToastUtils.js
import { createContext, useContext, useState, useEffect } from 'react';

// Create Toast Context
const ToastContext = createContext();

export const useToast = () => {
  return useContext(ToastContext);
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts([...toasts, { id, message, type }]);
    setTimeout(() => removeToast(id), 2000); // Remove toast after 2 seconds
  };

  const removeToast = (id) => {
    setToasts(toasts.filter(toast => toast.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast,removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};
