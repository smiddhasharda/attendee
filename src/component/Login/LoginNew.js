import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Image, LayoutAnimation } from 'react-native';
import LoginStyles from "./LoginScreen.style";
import useStateWithCallback from "../../helpers/useStateWithCallback";
import emailValidator from "../../helpers/emailValidator";
import Tooltip from "../../globalComponent/ToolTip/Tooltip";
import { login, emailVerify } from '../../AuthService/AuthService';
import { useToast } from '../../globalComponent/ToastContainer/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

function LoginNew() {
  const { showToast } = useToast();
  const [loginData, setLoginData] = useState({
    email: '',
    OTP: '',
  });

  const [isEmailTooltipVisible, setEmailTooltipVisible] = useStateWithCallback(false);
  const [isOTPTooltipVisible, setOTPTooltipVisible] = useStateWithCallback(false);
  const [isOTPInputDisabled, setOTPInputDiasbled] = useStateWithCallback(true);

  const handleEmailChange = (text) => {
    isEmailTooltipVisible && setEmailTooltipVisible(false);
    setLoginData({ ...loginData, email: text });
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
      const userRoleArray = await AsyncStorage.getItem('userRolePermission') || '';
      const userRolePermission = userRoleArray && JSON?.parse(userRoleArray) || '';
      navigation.replace('PostLogin', { userRolePermission });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        showToast('Invalid email or OTP', 'error');
      } else if (error.message === 'Token has expired') {
        showToast('Token has expired, please log in again', 'error');
        navigation.replace('Login');
      } else {
        console.error('Login Failed', error);
        showToast('Login failed, please try again later', 'error');
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
        showToast(`OTP Sent Successfully to ${loginData.email}`, 'success');
        setOTPInputDiasbled(false);
      }
    } catch (error) {
      if (error.message === 'Invalid Email Id') {
        showToast('Invalid Email Id', 'error');
      } else {
        console.error('Email Verification Failed', error);
        showToast('Email verification failed, please try again later', 'error');
      }
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
          <Text style={styles.label}>Email Id</Text>
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
            style={styles.input}
            value={loginData.email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            onFocus={() => setEmailTooltipVisible(false)}
            editable={isOTPInputDisabled}
          />
          {!isOTPInputDisabled && (
            <View>
              <Text style={styles.label}>OTP</Text>
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
                style={styles.input}
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
        </View>
      </View>
      <Image style={styles.bgimages2} source={require("../../local-assets/login-shape-bg-2.png")} />
    </View>
  );
}

export default LoginNew;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",
    position: "absolute",
    zIndex: 2,
    width: "80%",
    top: "24%",
    left: "10%",
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "bold"
  },
  input: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
  loginheading: {
    fontWeight: "bold",
    fontSize: 28,
    alignItems: "center",
  },
  loginsubheading: {
    fontSize: 16,
  },
  loginheadWrap: {
    width: "100%",
    padding: 40,
  },
  logininfoWrap: {
    width: "100%",
    padding: 40,
  },
  bgimg1: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: 1,
    top: "-72%",
    transform: [{ rotate: '142deg' }],
    left: "-48%",
  },
  bgimages2: {
    position: "absolute",
    width: "100%",
    height: "100%",
    zIndex: 1,
    transform: [{ rotate: '142deg' }],
    right: "-78%",
    bottom: "0",
  }
});
