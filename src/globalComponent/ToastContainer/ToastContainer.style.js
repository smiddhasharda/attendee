// ToastContainer.style.js
import { StyleSheet, Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50, // Adjust this value to position the toast further down or up
    width: '100%',
    alignItems: 'center',
    zIndex: 1000, // Ensure it's above other elements
  },
  toastContainer: {
    padding: 16,
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
