import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// const API_URL = 'http://localhost:5000/api';
const API_URL = 'http://3.111.185.105:3502/api';


const request = async (method, endpoint, data, authToken,params) => {
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const url = `${API_URL}/${endpoint}`;
    
    const config = {
      method,
      url,
      headers,
      params: params || {},
    };
    if (method === 'get') {
      config.params = { ...config.params, ...data };
    } else {
      config.data = data;
    }

    const response = await axios(config);

    if (!response || !response.data) {
      throw new Error('Invalid response format');
    }

    return response.data;
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Request failed');
      } else if (error.request) {
        throw new Error('No response received from the server');
      }
    }

    throw new Error('Error setting up the request');
  }
};

const handleAsyncStorageError = (error) => {
  console.error('Error while interacting with AsyncStorage:', error);
  throw new Error('AsyncStorage operation failed');
};

const login = async (tblName, conditionString) => {
  try {
    const response = await request('post', 'login', { tblName, conditionString });
    const { token, expirationTimestamp,userRole,userData } = response;
    await AsyncStorage.setItem('userRolePermission', userRole ? JSON?.stringify(userRole) : '').catch(handleAsyncStorageError);
    await AsyncStorage.setItem('authToken', token).catch(handleAsyncStorageError);
    await AsyncStorage.setItem('userData', userData ? JSON?.stringify(userData) : '').catch(handleAsyncStorageError);
    await AsyncStorage.setItem('tokenExpiration', expirationTimestamp.toString()).catch(handleAsyncStorageError);
    return token;
  } catch (error) {
    throw error;
  }
};

const register = async (tblName, conditionString) => {
  return request('post', 'register', { tblName, conditionString });
};
const emailVerify = async (tblName, conditionString) => {
  return request('post', 'emailVerify', { tblName, conditionString });
};

const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken').catch(handleAsyncStorageError);
    await AsyncStorage.removeItem('tokenExpiration').catch(handleAsyncStorageError);
    await AsyncStorage.removeItem('credentials').catch(handleAsyncStorageError);
    await AsyncStorage.removeItem('userRolePermission').catch(handleAsyncStorageError);
  } catch (error) {
    handleAsyncStorageError(error);
  }
};

const insert = async (data, authToken) => {
  return request('post', 'insert', data, authToken);
};
const update = async (data, authToken) => {
  return request('put', 'update', data, authToken);
};
const fetch = async (data, authToken) => {
  return request('get', 'fetch', data, authToken);
};
const remove = async (data, authToken) => {
  return request('delete', 'remove', data, authToken);
};
const common = async (data, authToken) => {
  return request('post', 'common', data, authToken);
};
const multer = async (data, authToken) => {
  return request('post', 'multer', data, authToken);
};

export { login, register,emailVerify, logout, insert, update, fetch, remove, common,multer };