import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, LayoutAnimation } from 'react-native';
import LoginStyles from "./LoginScreen.style";
import useStateWithCallback from "../../helpers/useStateWithCallback";
import emailValidator from "../../helpers/emailValidator";
import Tooltip from "../../globalComponent/ToolTip/Tooltip";
import { login, emailVerify } from '../../AuthService/AuthService';
import { useToast } from '../../globalComponent/ToastContainer/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const { addToast } = useToast();
  const [loginData, setLoginData] = useState({
    email: '',
    OTP: '',
    password:''
  });
  const [activeUserType, setActiveUserType] = useState('Faculty'); // 'Faculty' or 'Admin'
  const [isEmailTooltipVisible, setEmailTooltipVisible] = useStateWithCallback(false);
  const [isPasswordTooltipVisible, setPasswordTooltipVisible] = useStateWithCallback(false);
  const [isOTPTooltipVisible, setOTPTooltipVisible] = useStateWithCallback(false);
  const [isOTPInputDisabled, setOTPInputDiasbled] = useStateWithCallback(true);

  const handleEmailChange = (text) => {
    isEmailTooltipVisible && setEmailTooltipVisible(false);
    setLoginData({ ...loginData, email: text });
  };
  const handlePaaswordChange = (text) => {
    isPasswordTooltipVisible && setPasswordTooltipVisible(false);
    setLoginData({ ...loginData, password: text });
  };

  const handleOTPChange = (text) => {
    isOTPTooltipVisible && setOTPTooltipVisible(false);
    setLoginData({ ...loginData, OTP: text });
  };

  const handleEmailValidation = () => {
    if (emailValidator(loginData?.email)) {
      setEmailTooltipVisible(false);
      handleEmailVerify();
      return;
    } else {
      LayoutAnimation.spring();
      setEmailTooltipVisible(true);
    }
  };

  const handleOTPValidation = () => {
    if (loginData?.OTP) {
      setOTPTooltipVisible(false);
      handleLogin();
      return;
    } else {
      LayoutAnimation.spring();
      setOTPTooltipVisible(true);
    }
  };

  const handleLogin = async () => {
    try {
      await login(
        'tbl_user_master',
        `email_id = '${loginData.email}' AND OTP = '${loginData.OTP}'`
      );
      const userRoleArray = await AsyncStorage.getItem('userRolePermission') || [];
      const userRolePermission = JSON?.parse(userRoleArray) || [];
      navigation.replace('PostLogin', { userRolePermission });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        addToast('Invalid email or OTP', 'error');
      } else if (error.message === 'Token has expired') {
        addToast('Token has expired, please log in again', 'error');
        navigation.replace('Login');
      } else {
        console.error('Login Failed', error);
        addToast('Login failed, please try again later', 'error');
      }
    }
  };

  const handleEmailVerify = async () => {
    try {
      const response = await emailVerify(
        'tbl_user_master',
        `email_id = '${loginData.email}' AND isActive = 1`
      );
      if (response) {
        addToast(`OTP Sent Successfully to ${loginData.email}`, 'success');
        setOTPInputDiasbled(false);
      }
    } catch (error) {
      if (error.message === 'Invalid Email Id') {
        addToast('Invalid Email Id', 'error');
      } else {
        console.error('Email Verification Failed', error);
        addToast('Email verification failed, please try again later', 'error');
      }
    }
  };

  
  const handleAdminLogin = async () => {
    try {
      if(loginData.email.replace(/\s+/g, '') === "" || !emailValidator(loginData?.email)){
        setEmailTooltipVisible(true);
      }
      else if(loginData.password.replace(/\s+/g, '') === ""){
        setPasswordTooltipVisible(true);
      }
      else{
      await login( 'tbl_user_master', `email_id = '${loginData.email}' AND Password = '${loginData.password}'`);
      const userRoleArray = await AsyncStorage.getItem('userRolePermission') || [];
      const userRolePermission = JSON?.parse(userRoleArray) || [];     
      navigation.replace('PostLogin', { userRolePermission });
      }
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        addToast('Invalid email or password', 'error');
      } else if (error.message === 'Token has expired') {
        addToast('Token has expired, please log in again', 'error');
        navigation.replace('Login');
      } else {
        console.error('Login Failed', error);
        addToast('Login failed, please try again later', 'error');
      }
    }
  };
  return (
    <View style={LoginStyles.container}>
      <Image style={LoginStyles.bgimg1} source={require("../../local-assets/login-shape-bg-1.png")} />
      <View style={LoginStyles.form}>
        <View style={LoginStyles.logininfoWrap}>
          <View style={LoginStyles.loginheadWrap}>
            <Text style={LoginStyles.loginheading}>Login</Text>
            <Text style={LoginStyles.loginsubheading}>Login into your Account</Text>
          </View>
          <View style={LoginStyles.userTypeSelection}>
            <Pressable
              style={[LoginStyles.userTypeButton, activeUserType === 'Faculty' && LoginStyles.activeUserTypeButton]}
              onPress={() => setActiveUserType('Faculty')}
            >
              <Text style={[LoginStyles.userTypeText, activeUserType === 'Faculty' && LoginStyles.activeUserTypeText]}>
                Faculty
              </Text>
            </Pressable>
            <Pressable
              style={[LoginStyles.userTypeButton, activeUserType === 'Admin' && LoginStyles.activeUserTypeButton]}
              onPress={() => setActiveUserType('Admin')}
            >
              <Text style={[LoginStyles.userTypeText, activeUserType === 'Admin' && LoginStyles.activeUserTypeText]}>
                Admin
              </Text>
            </Pressable>
          </View>
          <View style={{ marginTop: 14 }}>
            <Text style={LoginStyles.label}>Email Id</Text>
            {isEmailTooltipVisible && (
              <Tooltip>
                <View style={LoginStyles.emailTooltipContainer}>
                  <Text style={LoginStyles.emailTooltipTextStyle}>
                    That
                    <Text style={LoginStyles.emailTooltipRedTextStyle}> email address </Text>
                    doesn't look right
                  </Text>
                </View>
              </Tooltip>
            )}
            <TextInput
              placeholder='Enter Your Email ID'
              style={LoginStyles.input}
              value={loginData.email}
              onChangeText={handleEmailChange}
              autoCapitalize="none"
              onFocus={() => setEmailTooltipVisible(false)}
              editable={isOTPInputDisabled}
            />
            {activeUserType === 'Faculty' ?  (<View>
              {!isOTPInputDisabled && (
              <View>
                <Text style={LoginStyles.label}>OTP</Text>
                {isOTPTooltipVisible && (
                  <Tooltip>
                    <View style={LoginStyles.passwordTooltipContainer}>
                      <Text style={LoginStyles.passwordTooltipTextStyle}>
                        Incorrect
                        <Text style={LoginStyles.passwordTooltipRedTextStyle}> OTP</Text>
                      </Text>
                    </View>
                  </Tooltip>
                )}
                <TextInput
                  placeholder='Enter The OTP'
                  value={loginData.OTP}
                  onChangeText={handleOTPChange}
                  style={LoginStyles.input}
                  autoCapitalize="none"
                  onFocus={() => { setOTPTooltipVisible(false); }}
                />
              </View>
            )}
            <Pressable
              style={[LoginStyles.loginButtonStyle]}
              onPress={() => { isOTPInputDisabled ? handleEmailValidation() : handleOTPValidation(); }}
            >
              <Text style={[LoginStyles.loginTextStyle]}>{isOTPInputDisabled ? "Send OTP" : "Login"}</Text>
            </Pressable> 
            </View>)
            : 
            (<View>
            <Text style={LoginStyles.label}>Password</Text>
            {isPasswordTooltipVisible && (
              <Tooltip>
                <View style={LoginStyles.emailTooltipContainer}>
                  <Text style={LoginStyles.emailTooltipTextStyle}>
                    That
                    <Text style={LoginStyles.emailTooltipRedTextStyle}> password </Text>
                    doesn't look right
                  </Text>
                </View>
              </Tooltip>
            )}
            <TextInput
              placeholder='Enter Your Password'
              style={LoginStyles.input}
              value={loginData.password}
              onChangeText={handlePaaswordChange}
              autoCapitalize="none"
              onFocus={() => [setPasswordTooltipVisible(false),setEmailTooltipVisible(false)]}
            />
                <Pressable
              style={[LoginStyles.loginButtonStyle]}
              onPress={() => handleAdminLogin()}
            >
              <Text style={[LoginStyles.loginTextStyle]}>Sign In</Text>
            </Pressable>
            </View>)       
             }
           
          </View>
        </View>
      </View>
      <Image style={LoginStyles.bgimages2} source={require("../../local-assets/login-shape-bg-2.png")} />
    </View>
  );
}

export default LoginScreen;
