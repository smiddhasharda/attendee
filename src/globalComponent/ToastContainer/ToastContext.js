// ToastContext.js

import React, { createContext, useContext, useState } from 'react';
import ToastContainer from './ToastContainer';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    // Hide the toast after a certain duration
    setTimeout(() => {
      setToastVisible(false);
    }, 3000); // You can adjust the duration as needed
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toastVisible && <ToastContainer message={toastMessage} type={toastType} onHide={hideToast} />}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  return useContext(ToastContext);
};
