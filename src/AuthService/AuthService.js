import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import CryptoJS from 'crypto-js';

// const API_URL = 'http://localhost:3502/api';


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
      config.params = { ...config.params, data: data } ;
    } else {
      config.data = {data : data};
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
        console.log(error)
        throw new Error(error.response?.data?.error || 'Request failed');
      } else if (error.request) {
        throw new Error('No response received from the server');
      }
    }

    throw new Error('Error setting up the request');
  }
};

const decrypt = (encryptedData) => {
  const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
  const [iv, encrypted] = encryptedData.split(':');
  const ivBytes = CryptoJS.enc.Hex.parse(iv);
  const encryptedBytes = CryptoJS.enc.Hex.parse(encrypted);
  const decrypted = CryptoJS.AES.decrypt(
    { ciphertext: encryptedBytes },
    CryptoJS.enc.Utf8.parse(encryptScreteKey),
    {
      iv: ivBytes,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8);
};

const encrypt = (text) => {
  const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(text, CryptoJS.enc.Utf8.parse(encryptScreteKey), {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return iv.toString() + ':' + encrypted.toString();
};

const handleAsyncStorageError = (error) => {
  console.error('Error while interacting with AsyncStorage:', error);
  throw new Error('AsyncStorage operation failed');
};

const login = async (tblName, conditionString) => {
  try {
    const Parameter = encrypt(JSON.stringify({tblName,conditionString}))
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
  return request('post', 'register', { tblName, conditionString });
};
const emailVerify = async (tblName, conditionString,viewTblName,viewConditionString) => {
  const Parameter = encrypt(JSON.stringify({ tblName, conditionString, viewTblName, viewConditionString }))
  return request('post', 'emailVerify',Parameter);
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
const bulkupload = async (data, authToken) => {  
  return request('post', 'bulkupload', data, authToken);
};
const view = async (data, authToken) => {     
  return request('get', 'view', data, authToken);
};
const photoView = async (data, authToken) => {     
  return request('get', 'photoView', data, authToken);
}
export { login, register,emailVerify, logout, insert, update, fetch, remove, common,multer,bulkupload,view,photoView };