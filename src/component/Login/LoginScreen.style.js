import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bgimg1: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  bgimages2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  form: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position:'relative',
    zIndex:99999
  },
  logininfoWrap: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    left: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    padding: 10,
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
    left: 10,
    backgroundColor: '#f8d7da',
    borderRadius: 5,
    padding: 10,
  },
  passwordTooltipTextStyle: {
    color: '#721c24',
  },
  passwordTooltipRedTextStyle: {
    fontWeight: 'bold',
    color: '#721c24',
  },
});

export default styles;
