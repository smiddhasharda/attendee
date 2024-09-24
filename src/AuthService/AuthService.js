import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { API_URL } from '@env';
import {encrypt,decrypt} from '../globalComponent/cryptography/cryptography'
const API_URL = 'http://3.111.185.105:3502/api';


const request = async (method, endpoint, data, authToken,params) => {
  try {
    const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
    const url = `${API_URL}/${endpoint}`;
    const EncryptedData = encrypt(JSON.stringify(data));
    const config = {
      method,
      url,
      headers,
      params: params || {},
    };

    // if (method === 'get') {
    //   config.params = { ...config.params, data: data } ;
    // } else {
    //   config.data = {data : data};
    // }


    if (method === 'get') {
      config.params = { ...config.params, data: EncryptedData };
    }
    else if(endpoint === 'multer' || endpoint === 'bulkupload') {
      if (data instanceof FormData) {
        config.data = data;
      } else {
        config.data = data;
      }
    } else {
      if (EncryptedData instanceof FormData) {
        config.data = EncryptedData;
      } else {
        config.data = { data: EncryptedData };
      }
    }


    const response = await axios(config);

    if (!response || !response?.data) {
      throw new Error('Invalid response format');
    }

    // return response?.data;
    return response;

    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(error.response?.data?.error || 'Request failed');
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

const login = async (tblName, conditionString,secondaryCondition) => {
  try {
    const Parameter = {tblName,conditionString,secondaryCondition};
    const response = await request('post', 'login',Parameter);
    const decryptedData = decrypt(response?.data?.receivedData);
    const DecryptedData = JSON.parse(decryptedData);
    const { token,userRole,userData } = DecryptedData;
    // const { token, expirationTimestamp,userRole,userData } = response;

    await AsyncStorage.setItem(btoa('userRolePermission'), userRole ? btoa(JSON?.stringify(userRole)) : '').catch(handleAsyncStorageError);
    await AsyncStorage.setItem(btoa('authToken'), btoa(token)).catch(handleAsyncStorageError);
    await AsyncStorage.setItem(btoa('userData'), userData ? btoa(JSON?.stringify(userData)) : '').catch(handleAsyncStorageError);
    // await AsyncStorage.setItem(btoa('tokenExpiration'), btoa(expirationTimestamp.toString())).catch(handleAsyncStorageError);
    return token;
  } catch (error) {
    throw error;
  }
};

const register = async (tblName, conditionString) => {
  const Parameter = { tblName, conditionString };
  const response = await request('post', 'register',Parameter );
    const decryptedData = decrypt(response?.data?.receivedData);
    const DecryptedData = JSON.parse(decryptedData);
  return DecryptedData;
};
const emailVerify = async (tblName, conditionString,viewTblName,viewConditionString) => {
  const Parameter = { tblName, conditionString, viewTblName, viewConditionString };
  const response = await request('post', 'emailVerify',Parameter);
    // const decryptedData = decrypt(response?.data?.receivedData);
    // const DecryptedData = JSON.parse(decryptedData);
  return response;
};

const logout = async () => {
  try {
    await AsyncStorage.removeItem(btoa('authToken')).catch(handleAsyncStorageError);
    // await AsyncStorage.removeItem(btoa('tokenExpiration')).catch(handleAsyncStorageError);
    await AsyncStorage.removeItem(btoa('credentials')).catch(handleAsyncStorageError);
    await AsyncStorage.removeItem(btoa('userRolePermission')).catch(handleAsyncStorageError);
    await AsyncStorage.removeItem(btoa('userData')).catch(handleAsyncStorageError);
  } catch (error) {
    handleAsyncStorageError(error);
  }
};

const insert = async (data, authToken) => {
  const response = await request('post', 'insert', data, authToken);
    // const decryptedData = decrypt(response?.data?.receivedData);
    // const DecryptedData = JSON.parse(decryptedData);
  return response;
};
const update = async (data, authToken) => {
  const response = await request('put', 'update', data, authToken);
  // const decryptedData = decrypt(response?.data?.receivedData);
  // const DecryptedData = JSON.parse(decryptedData);
return response;
};
const fetch = async (data, authToken) => {
  const response = await request('get', 'fetch', data, authToken);
  const decryptedData = decrypt(response?.data?.receivedData);
  const DecryptedData = JSON.parse(decryptedData);
return DecryptedData; 
};
const remove = async (data, authToken) => {
  const response = await request('delete', 'remove', data, authToken);
  const decryptedData = decrypt(response?.data?.receivedData);
  const DecryptedData = JSON.parse(decryptedData);
return DecryptedData;
};
const common = async (data, authToken) => {
  const response = await request('post', 'common', data, authToken);
  const decryptedData = decrypt(response?.data?.receivedData);
  const DecryptedData = JSON.parse(decryptedData);
return DecryptedData;
};
const multer = async (data, authToken) => {
  const response = await request('post', 'multer', data, authToken);
  // const decryptedData = decrypt(response?.data?.receivedData);
  // const DecryptedData = JSON.parse(decryptedData);
return response;
};
const bulkupload = async (data, authToken) => {  
  const response = await request('post', 'bulkupload', data, authToken);
  // const decryptedData = decrypt(response?.data?.receivedData);
  // const DecryptedData = JSON.parse(decryptedData);
return response;
};
const view = async (data, authToken) => { 
  const response = await request('get', 'view', data, authToken);
  const decryptedData = decrypt(response?.data?.receivedData);
  const DecryptedData = JSON.parse(decryptedData);
return DecryptedData;    
};
const photoView = async (data, authToken) => { 
  const response =  await request('get', 'photoView', data, authToken);
  const decryptedData = decrypt(response?.data?.receivedData);
  const DecryptedData = JSON.parse(decryptedData);
return DecryptedData;    
}
export { login, register,emailVerify, logout, insert, update, fetch, remove, common,multer,bulkupload,view,photoView };