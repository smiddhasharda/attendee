import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Function to set a "cookie"
export const setCookie = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
        console.log('Cookie set:', key, value);
    } catch (error) {
        console.error('Error setting cookie:', error);
    }
};

// Function to get a "cookie"
export const getCookie = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        console.log('Cookie retrieved:', key, value);
        return value;
    } catch (error) {
        console.error('Error getting cookie:', error);
    }
};

// Function to remove a "cookie"
export const removeCookie = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
        console.log('Cookie removed:', key);
    } catch (error) {
        console.error('Error removing cookie:', error);
    }
};
//  Clear AsyncStorage
const clearStorage = async () => {
  try {
    await AsyncStorage.clear();
    console.log('AsyncStorage cleared');
  } catch (error) {
    console.error('Error clearing AsyncStorage:', error);
  }
};

clearStorage();
// CookiesManager component
const CookiesManager = () => {
    return (
        <View>
            <Text>CookiesManager</Text>
        </View>
    );
};

export default CookiesManager;
