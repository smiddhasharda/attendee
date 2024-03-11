// ToastContainer.js
import React, { useEffect } from 'react';
import { View, Text, Platform } from 'react-native';
import ToastContainerStyle from './ToastContainer.style';
// import WebToastStyles from './WebToast.module.css';
import { useToast } from './ToastContext';

// // Web-specific toast component
// const WebToast = ({ message, type }) => (
//   <div className={`${WebToastStyles['web-toast']} ${type === 'success' ? WebToastStyles.success : WebToastStyles.error}`}>
//     <p className={WebToastStyles['toast-text']}>{message}</p>
//   </div>
// );

// React Native toast component
const NativeToast = ({ message, type }) => (
  <View
    style={[
      ToastContainerStyle.toastContainer,
      { backgroundColor: type === 'success' ? '#4CAF50' : '#FF5252' },
    ]}
  >
    <Text style={ToastContainerStyle.toastText}>{message}</Text>
  </View>
);

const ToastContainer = (props) => {
  const { toasts } = useToast();

  useEffect(() => {
    // This useEffect can be used to handle any additional logic related to toasts
  }, [toasts]);

  return (
    <View style={ToastContainerStyle.container}>
        <React.Fragment key="toast-key">
        {/* {Platform.OS === 'web' ? (a
          // <WebToast message={props.message} type={props.type} />
        ) : ( */}
          <NativeToast message={props.message} type={props.type} />
        {/* )} */}
      </React.Fragment>
    </View>
  );

};

export default ToastContainer;
