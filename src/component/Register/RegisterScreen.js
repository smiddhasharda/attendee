import React, { useState } from 'react';
import { View, TextInput, Pressable, Alert, KeyboardAvoidingView, StyleSheet } from 'react-native';
import RegisterStyle from "./RegisterScreen.style";
import {register} from '../../AuthService/AuthService';

const RegisterScreen = ({ navigation }) => {
  const [registerData, setRegisterData] = useState({
    username: '',
    name: '',
    emailId: '',
    contactNumber: '',
    password: '',
  });

  const handleInputChange = (key, value) => {
    setRegisterData({ ...registerData, [key]: value });
  };

  const handleRegister = async () => {
    try {
      if (!registerData.username || !registerData.name || !registerData.emailId || !registerData.contactNumber || !registerData.password) {
        Alert.alert('Please fill in all fields');
        return;
      }

      await register('tbl_user_master', {
        username: registerData.username,
        name: registerData.name,
        email_id: registerData.emailId,
        contact_number: registerData.contactNumber,
        password: registerData.password,
      });

      Alert.alert('Register Successful');
      navigation.replace('Login');
    } catch (error) {
      console.log('Register Failed', error);
      Alert.alert('Register Failed', error);
    }
  };

  
  return (
    <KeyboardAvoidingView style={RegisterStyle.container} behavior="padding">
      <TextInput
        style={RegisterStyle.textInputContainer}
        placeholder="UserName"
        value={registerData.username}
        onChangeText={(text) => handleInputChange('username', text)}
      />
      <TextInput
        style={RegisterStyle.textInputContainer}
        placeholder="Name"
        value={registerData.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      <TextInput
        style={RegisterStyle.textInputContainer}
        placeholder="Email Id"
        value={registerData.emailId}
        onChangeText={(text) => handleInputChange('emailId', text)}
        keyboardType="email-address"
      />
      <TextInput
       style={RegisterStyle.textInputContainer}
        placeholder="Contact Number"
        value={registerData.contactNumber}
        onChangeText={(text) => handleInputChange('contactNumber', text)}
        keyboardType="numeric"
      />
      <TextInput
       style={RegisterStyle.textInputContainer}
        placeholder="Password"
        value={registerData.password}
        onChangeText={(text) => handleInputChange('password', text)}
        secureTextEntry
      />
       <Pressable onPress={() => handleRegister()}>
                    <Text>Register</Text>
                  </Pressable>
                  <Pressable onPress={() => navigation.navigate('Login')}>
                    <Text>Login</Text>
                  </Pressable>
      {/* <Button title="Register" onPress={handleRegister} style={ RegisterStyle.registerButtonStyle}/>
      <Button title="Login" style={ RegisterStyle.registerButtonStyle} onPress={() => navigation.navigate('Login')} /> */}
    </KeyboardAvoidingView>
  );
};


export default RegisterScreen;
