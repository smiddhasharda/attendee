import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import ToastContainerStyle from './ToastContainer.style';
import { useToast } from './ToastUtils';

const NativeToast = ({ id, message, type, autoClose = true }) => {
  const [progress, setProgress] = useState(new Animated.Value(1));
  const { removeToast } = useToast();

  useEffect(() => {
    if (autoClose) {
      Animated.timing(progress, {
        toValue: 0,
        duration: 2000, // 2 seconds
        useNativeDriver: false,
      }).start(() => removeToast(id)); // Remove toast after animation completes
    }
  }, [progress, autoClose]);

  return (
    <Pressable onPress={() => removeToast(id)}>
      <View
        style={[
          ToastContainerStyle.toastContainer,
          { backgroundColor: type === 'success' ? '#4CAF50' : '#FF5252' },
        ]}
      >
        <Text style={ToastContainerStyle.toastText}>{message}</Text>
        {autoClose && (
          <Animated.View
            style={[
              ToastContainerStyle.progressBar,
              {
                width: progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        )}
      </View>
    </Pressable>
  );
};

export default NativeToast;
