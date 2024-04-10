import React, { useState, useEffect } from "react";
import { Image, SafeAreaView, StatusBar, Text, Pressable, View, LayoutAnimation, } from "react-native";
import CheckBox from 'expo-checkbox';
import TextInput from "react-native-text-input-interactive";
import LoginStyles from "./LoginScreen.style";
import useStateWithCallback from "../../helpers/useStateWithCallback";
import emailValidator from "../../helpers/emailValidator";
import Tooltip from "../../globalComponent/ToolTip/Tooltip";
import { login,emailVerify  } from '../../AuthService/AuthService';
import { useToast } from '../../globalComponent/ToastContainer/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ style, logoImageStyle, loginTextStyle, loginButtonStyle, logoImageSource = require("../../local-assets/attendlogin.jpg"), emailPlaceholder = "Email", OTPPlaceholder = "OTP", navigation, children }) => {
  const { showToast } = useToast();

  const [loginData, setLoginData] = useState({
    email:  '',
    OTP: '',
  });

  const [isOTPVisible, setOTPVisible] = useState(false);
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

  const handleEyePress = () => {
    setOTPVisible((oldValue) => !oldValue);
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
      if(response){
        showToast(`OTP Send Successfully  to ${loginData.email}`, 'success');
        setOTPInputDiasbled(false);
      }      
    } catch (error) {
      if (error.message === 'Invalid Email Id') {
        showToast('Invalid Email Id', 'error');
      } else {
        console.error('Login Failed', error);
        showToast('Login failed, please try again later', 'error');
      }
    }
  };
  

  const renderLogo = () => (
    <Image
    resizeMode="contain"
    source={logoImageSource}
    style={[LoginStyles.logoImageStyle, logoImageStyle]}
  />
  );

  const renderEmailInput = () => {
    const tooltipContent = () => (
      <View style={LoginStyles.emailTooltipContainer}>
        <Text style={LoginStyles.emailTooltipTextStyle}>
          That{" "}
          <Text style={LoginStyles.emailTooltipRedTextStyle}>email address</Text>{" "}
          doesn't look right
        </Text>
      </View>
    );
    return (
      <View style={LoginStyles.emailTextInputContainer}>
        <>
          {isEmailTooltipVisible && (
            <Tooltip>{tooltipContent()}</Tooltip>
          )}
          <TextInput
            placeholder={emailPlaceholder}
            style={LoginStyles.textInputValue}
            value={loginData.email}
            onChangeText={handleEmailChange}
            autoCapitalize="none"
            onFocus={() => setEmailTooltipVisible(false)}
          />
        </>
      </View>
    );
  };

  const renderOTPInput = () => {
    const eyeIcon = isOTPVisible
      ? require("../../local-assets/eye.png")
      : require("../../local-assets/eye-off.png");

    const renderTooltipContent = () =>
      <View style={LoginStyles.passwordTooltipContainer}>
        <Text style={LoginStyles.passwordTooltipTextStyle}>
          Incorrect{" "}
          <Text style={LoginStyles.passwordTooltipRedTextStyle}>OTP</Text>
        </Text>
      </View>;
    return (
        <View style={LoginStyles.passwordTextInputContainer}>
          {isOTPTooltipVisible && (
            <Tooltip>{renderTooltipContent()}</Tooltip>
          )}
          <TextInput
            placeholder={OTPPlaceholder}
            value={loginData.OTP}
            secureTextEntry={!isOTPVisible}
            onChangeText={handleOTPChange}
            enableIcon
            style={LoginStyles.textInputValue}
            iconImageSource={eyeIcon}
            autoCapitalize="none"
            onFocus={() => {
              setOTPTooltipVisible(false);
            }}
            onIconPress={handleEyePress}
          />
        </View>
      
    );
  };

  const renderTextInputContainer = () => (
    <View style={[LoginStyles.textInputContainer]}>
      {renderEmailInput()}
      {!isOTPInputDisabled && renderOTPInput()}
    </View>
  );

  const renderButton = () => (
    <View> 
      <Pressable
    style={[LoginStyles.loginButtonStyle, loginButtonStyle]}
    onPress={() => { isOTPInputDisabled ? handleEmailValidation() : handleOTPValidation();}}
  >
    <Text style={[LoginStyles.loginTextStyle, loginTextStyle]}>{isOTPInputDisabled ? "Send OTP" : "Login"}</Text>
  </Pressable>
   </View>
   
  );
    
  return (
    <SafeAreaView style={[LoginStyles.container, style]}>
      <StatusBar barStyle="dark-content" />
      {renderLogo()}
      <SafeAreaView style={[LoginStyles.otpbtn, style]}>
      {renderTextInputContainer()}
      {renderButton()}
      </SafeAreaView>
      {children}
    </SafeAreaView>
  );
};

export default LoginScreen;
