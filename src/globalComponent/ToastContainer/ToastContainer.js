// ToastContainer.js
import React, { useEffect, useState } from 'react';
import { View, Text, Animated, TouchableOpacity } from 'react-native';
import ToastContainerStyle from './ToastContainer.style';
import { useToast } from './ToastUtils';

const NativeToast = ({ id, message, type }) => {
  const [progress, setProgress] = useState(new Animated.Value(1));
  const { removeToast } = useToast();

  useEffect(() => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 10000, // 10 seconds
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <TouchableOpacity onPress={() => removeToast(id)}>
    <View
      style={[
        ToastContainerStyle.toastContainer,
        { backgroundColor: type === 'success' ? '#4CAF50' : '#FF5252' },
      ]}
    >
      <Text style={ToastContainerStyle.toastText}>{message}</Text>
      <Animated.View style={[ToastContainerStyle.progressBar, { width: progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }) }]} />
    </View>
    </TouchableOpacity>
  );
};

const ToastContainer = () => {
  const { toasts } = useToast();

  useEffect(() => {
    // This useEffect can be used to handle any additional logic related to toasts
  }, [toasts]);

  return (
    <View style={ToastContainerStyle.container}>
      {toasts.map((toast) => (
        <NativeToast key={toast.id} id={toast.id} message={toast.message} type={toast.type} />
      ))}
    </View>
  );
};

export default ToastContainer;
