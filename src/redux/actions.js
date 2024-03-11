import AsyncStorage from '@react-native-async-storage/async-storage';

// Action types
const REMEMBER_ME = 'RememberMe';
const SET_REMEMBERED_CREDENTIALS = 'SET_REMEMBERED_CREDENTIALS';

// Action creators
export const setRememberMe = (value) => ({
  type: REMEMBER_ME,
  payload: value,
});

export const setRememberedCredentials = (credentials) => async (dispatch) => {
  try {
    await AsyncStorage.setItem('credentials', JSON.stringify(credentials));
    dispatch({
      type: SET_REMEMBERED_CREDENTIALS,
      payload: credentials,
    });
  } catch (error) {
    console.error('Error setting remembered credentials:', error);
  }
};

export const loadRememberedCredentials = async () => {
  try {
    const serializedCredentials = await AsyncStorage.getItem('credentials');
    if (serializedCredentials) {
      const credentials = JSON.parse(serializedCredentials);
      return { email: credentials.email, password: credentials.password };
    }
  } catch (error) {
    console.error('Error loading remembered credentials:', error);
  }
  return null;
};

export const initializeRememberedCredentials = () => async (dispatch) => {
  try {
    const credentials = await loadRememberedCredentials();

    if (credentials && credentials.email !== '' && credentials.password !== '') {
      await dispatch(setRememberedCredentials(credentials));
      dispatch(setRememberMe(true));
    } else {
      dispatch(setRememberMe(false));
    }
  } catch (error) {
    console.error('Error initializing remembered credentials:', error);
  }
};
