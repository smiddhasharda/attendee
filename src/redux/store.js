// store.js
import { createStore, applyMiddleware } from 'redux';
import * as thunk from 'redux-thunk'; // Import all exports as 'thunk'
import { composeWithDevTools } from '@redux-devtools/extension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rootReducer from './reducer';

// Load initial state from AsyncStorage
const loadState = async () => {
  try {
    const serializedState = atob(await AsyncStorage.getItem(btoa('reduxState')));
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch (err) {
    console.error('Error loading state from AsyncStorage:', err);
    return undefined;
  }
};

// Save state to AsyncStorage whenever it changes
const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    AsyncStorage.setItem(btoa('reduxState'), btoa(serializedState));
  } catch (err) {
    console.error('Error saving state to AsyncStorage:', err);
  }
};

// Apply the Redux Thunk middleware to the store
const middleware = [thunk.thunk]; // Access 'thunk' property
const store = createStore(
  rootReducer,
  loadState(),
  composeWithDevTools(applyMiddleware(...middleware)),
);

// Subscribe to store changes and save state to AsyncStorage
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
