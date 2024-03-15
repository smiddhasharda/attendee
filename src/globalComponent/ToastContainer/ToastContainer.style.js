// ToastContainer.style.js

import { StyleSheet, Platform } from 'react-native';
// import WebToastStyles from './WebToast.module.css';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  toastContainer: {
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      android: {
        elevation: 5,
      },
      // web: { // Include web-specific styles
      //   ...WebToastStyles['web-toast'],
      //   ...WebToastStyles['toast-text'],
      // },
    }),
  },
  toastText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;
