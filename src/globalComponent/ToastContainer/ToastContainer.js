import React from 'react';
import { View } from 'react-native';
import ToastContainerStyle from './ToastContainer.style';
import { useToast } from './ToastUtils';
import NativeToast from './NativeToast';

const ToastContainer = () => {
  const { toasts } = useToast();

  return (
    <View style={ToastContainerStyle.container}>
      {toasts.map((toast) => (
        <NativeToast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          type={toast.type}
          autoClose={toast.autoClose} // Pass the autoClose prop to NativeToast
        />
      ))}
    </View>
  );
};

export default ToastContainer;
