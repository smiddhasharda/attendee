import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, LayoutAnimation } from 'react-native';
import { useToast } from '../../globalComponent/ToastContainer/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import emailValidator from "../../helpers/emailValidator";
import Tooltip from "../../globalComponent/ToolTip/Tooltip";
import { login, emailVerify } from '../../AuthService/AuthService';
import styles from "./LoginScreen.style";

const LoginScreen = ({ navigation }) => {
  const { addToast } = useToast();
  const [loginData, setLoginData] = useState({
    email: '',
    OTP: '',
    password: ''
  });
  const [activeUserType, setActiveUserType] = useState('Faculty');
  const [isEmailTooltipVisible, setEmailTooltipVisible] = useState(false);
  const [isPasswordTooltipVisible, setPasswordTooltipVisible] = useState(false);
  const [isOTPTooltipVisible, setOTPTooltipVisible] = useState(false);
  const [isOTPInputDisabled, setOTPInputDiasbled] = useState(true);

  const handleInputChange = (field, value) => {
    if (field === 'OTP') {
      if (/^\d*$/.test(value) && value.length <= 6) {
        setLoginData({ ...loginData, [field]: value });
      }
    } else {
      setLoginData({ ...loginData, [field]: value });
    }
  };

  const validateEmail = () => {
    if (emailValidator(loginData.email)) {
      setEmailTooltipVisible(false);
      verifyEmail();
    } else {
      LayoutAnimation.spring();
      setEmailTooltipVisible(true);
    }
  };

  const validateOTP = () => {
    if (loginData.OTP) {
      setOTPTooltipVisible(false);
      loginUser();
    } else {
      LayoutAnimation.spring();
      setOTPTooltipVisible(true);
    }
  };

  const loginUser = async () => {
    try {
      const result =  await login('tbl_user_master', `email_id = '${loginData.email.replace(/\s+/g, '').trim()}' AND OTP = ${loginData.OTP.replace(/\s+/g, '').trim()} AND isActive = 1`);
      if (result.length > 0) {
        const userRoleArray = await AsyncStorage.getItem('userRolePermission') || '[]';
        const userRolePermission = JSON.parse(userRoleArray);
        navigation.replace('PostLogin', { userRolePermission });
      }
    } catch (error) {
      handleLoginError(error);
    }
  };

  const verifyEmail = async () => {
    try {
      const response = await emailVerify('tbl_user_master', `email_id = '${loginData.email.replace(/\s+/g, '').trim()}' `,'PS_SU_PSFT_COEM_VW',`EMAILID = '${loginData.email.replace(/\s+/g, '').trim()}'`);
      if (response) {
        addToast(`OTP is sent successfully on your registered email address!`, 'success');
        setOTPInputDiasbled(false);
      }
    } catch (error) {
      handleEmailVerifyError(error);
    }
  };

  const loginAdmin = async () => {
    if (!emailValidator(loginData.email)) {
      setEmailTooltipVisible(true);
    } else if (!loginData.password.trim()) {
      setPasswordTooltipVisible(true);
    } else {
      try {
        const result = await login('tbl_user_master', `email_id = '${loginData.email.replace(/\s+/g, '').trim()}' AND Password = '${loginData.password.replace(/\s+/g, '').trim()}'`);;
        if (result.length > 0) {
          const userRoleArray = await AsyncStorage.getItem('userRolePermission') || [];
          const userRolePermission = JSON.parse(userRoleArray) || [];
          navigation.replace('PostLogin', { userRolePermission });
        }
      } catch (error) {
        handleAdminLoginError(error);
      }
    }
  };

  const handleLoginError = (error) => {
    if (error.message === 'Invalid credentials') {
      addToast('Incorrect OTP', 'error');
    } else if (error.message === 'Token has expired') {
      addToast('Token is expired, please log in again', 'error');
      navigation.replace('Login');
    } else {
      console.error('Login Failed', error);
      addToast('Login failed, please try again later', 'error');
    }
  };
  const handleAdminLoginError = (error) => {
    if (error.message === 'Invalid credentials') {
      addToast('Invalid Credential', 'error');
    } else if (error.message === 'Token has expired') {
      addToast('Token is expired, please log in again', 'error');
      navigation.replace('Login');
    } else {
      console.error('Login Failed', error);
      addToast('Login failed, please try again later', 'error');
    }
  };

  const handleEmailVerifyError = (error) => {
    if (error.message === 'Invalid Email Id') {
      addToast('Invalid Email Id', 'error');
    } 
    else if (error.message === 'Email Id Not Allowed'){
      addToast('Not Authorized kindly contact admin!', 'error');
    }
    else {
      console.error('Email Verification Failed', error);
      addToast('Email verification is failed, please try again later', 'error');
    }
  };

  return (
    <View style={styles.container}>
      <Image style={styles.bgimg1} source={require("../../local-assets/login-shape-bg-1.png")} />
      <View style={styles.form}>
        <View style={styles.logininfoWrap}>
          <View style={styles.loginheadWrap}>
            <Text style={styles.loginheading}>Login</Text>
            <Text style={styles.loginsubheading}>Login into your Account</Text>
          </View>
          <View style={styles.userTypeSelection}>
            <Pressable
              style={[styles.userTypeButton, activeUserType === 'Faculty' && styles.activeUserTypeButton]}
              onPress={() => setActiveUserType('Faculty')}
            >
              <Text style={[styles.userTypeText, activeUserType === 'Faculty' && styles.activeUserTypeText]}>
                Faculty
              </Text>
            </Pressable>
            <Pressable
              style={[styles.userTypeButton, activeUserType === 'Admin' && styles.activeUserTypeButton]}
              onPress={() => setActiveUserType('Admin')}
            >
              <Text style={[styles.userTypeText, activeUserType === 'Admin' && styles.activeUserTypeText]}>
                Admin
              </Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 14 }}>
            <Text style={styles.label}>Email Id</Text>
            {isEmailTooltipVisible && (
              <Tooltip>
                <View style={styles.emailTooltipContainer}>
                  <Text style={styles.emailTooltipTextStyle}>
                    That
                    <Text style={styles.emailTooltipRedTextStyle}> email address </Text>
                    doesn't look right
                  </Text>
                </View>
              </Tooltip>
            )}
            <TextInput
              placeholder='Enter Your Email ID'
              style={styles.input}
              value={loginData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              autoCapitalize="none"
              onFocus={() => setEmailTooltipVisible(false)}
              readOnly={!isOTPInputDisabled}
            />
            {activeUserType === 'Faculty' ? (
              <View>
                {!isOTPInputDisabled && (
                  <View>
                    <Text style={styles.label}>OTP</Text>
                    {isOTPTooltipVisible && (
                      <Tooltip>
                        <View style={styles.passwordTooltipContainer}>
                          <Text style={styles.passwordTooltipTextStyle}>
                            Incorrect
                            <Text style={styles.passwordTooltipRedTextStyle}> OTP</Text>
                          </Text>
                        </View>
                      </Tooltip>
                    )}
                    <TextInput
                      placeholder='Enter The OTP'
                      value={loginData.OTP}
                      onChangeText={(text) => handleInputChange('OTP', text)}
                      style={styles.input}
                      autoCapitalize="none"
                      onFocus={() => setOTPTooltipVisible(false)}
                    />
                  </View>
                )}
                <Pressable
                  style={styles.loginButtonStyle}
                  onPress={isOTPInputDisabled ? validateEmail : validateOTP}
                >
                  <Text style={styles.loginTextStyle}>{isOTPInputDisabled ? "Send OTP" : "Login"}</Text>
                </Pressable>
              </View>
            ) : (
              <View>
                <Text style={styles.label}>Password</Text>
                {isPasswordTooltipVisible && (
                  <Tooltip>
                    <View style={styles.emailTooltipContainer}>
                      <Text style={styles.emailTooltipTextStyle}>
                        That
                        <Text style={styles.emailTooltipRedTextStyle}> password </Text>
                        doesn't look right
                      </Text>
                    </View>
                  </Tooltip>
                )}
                <TextInput
                  placeholder='Enter Your Password'
                  style={styles.input}
                  value={loginData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                  autoCapitalize="none"
                  onFocus={() => setPasswordTooltipVisible(false)}
                />
                <Pressable
                  style={styles.loginButtonStyle}
                  onPress={loginAdmin}
                >
                  <Text style={styles.loginTextStyle}>Sign In</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </View>
      <Image style={styles.bgimages2} source={require("../../local-assets/login-shape-bg-2.png")} />
    </View>
  );
};

export default LoginScreen;