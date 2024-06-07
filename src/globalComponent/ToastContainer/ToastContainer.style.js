// ToastContainer.style.js
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 20, 
    width: '100%',
    right:10,
    alignItems: 'flex-end',
    zIndex: 1000, 
  },
  toastContainer: {
    padding: 14,
    borderRadius: 8,
    flexDirection: 'column',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: "#f5f5f5",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'white',
    alignSelf: 'stretch',
    borderRadius: 2,
  },
});

export default styles;
