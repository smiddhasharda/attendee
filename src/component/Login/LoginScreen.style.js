import { StyleSheet,Platform } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgimg1: {
    position: 'absolute',
    transform: [{ skewX: '-65deg' }],
    top: -180,
    left: -620,
  },
  bgimages2: {
    position: 'absolute',
    transform: [{ skewX: '162deg' }],
    top: 190,
    right: -540,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    zIndex: 99999,
  },
  logininfoWrap: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
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
      web:{
        boxShadow: '0px 2px 3.84px rgba(0, 0, 0, 0.25)',
      }
    }),
  },
  loginheadWrap: {
    marginBottom: 20,
  },
  loginheading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loginsubheading: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 14,
    paddingLeft: 10,
  },
  loginButtonStyle: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  loginTextStyle: {
    color: '#fff',
    fontSize: 16,
  },
  userTypeSelection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  userTypeButton: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
  },
  activeUserTypeButton: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  userTypeText: {
    fontSize: 16,
    color: '#000',
  },
  activeUserTypeText: {
    color: '#fff',
  },
  emailTooltipContainer: {
    position: 'absolute',
    top: 50,
    left: 58,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    padding: 10,
    width: 256,
  },
  emailTooltipTextStyle: {
    color: '#721c24',
  },
  emailTooltipRedTextStyle: {
    fontWeight: 'bold',
    color: '#721c24',
  },
  passwordTooltipContainer: {
    position: 'absolute',
    top: 50,
    left: 78,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    padding: 10,
    width: 260,
  },
  passwordTooltipTextStyle: {
    color: '#721c24',
  },
  passwordTooltipRedTextStyle: {
    fontWeight: 'bold',
    color: '#721c24',
  },
  eyeButton: {
    position: 'absolute',
    top: 12,
    right: 10,
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
});

export default styles;