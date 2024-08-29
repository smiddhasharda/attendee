import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Dimensions,
  Pressable,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fetch, update } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from 'crypto-js';

const { width, height } = Dimensions.get("window");
const isMobile = width < 768;

const ManagePasswordScreen = ({
  navigation,
  userAccess,
  userData
}) => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassword] = useState(false);
  const { addToast } = useToast();

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confPassword: "",
    isOldPassError: "",
    isNewPassError: "",
    isConfPassError: "",
  });

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

  const generateIV = () => {
    if (Platform.OS === 'web') {
      // For web, use CryptoJS's random generator
      return CryptoJS.lib.WordArray.random(16);
    } else {
      // For React Native, use a simple random number generator
      const arr = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return CryptoJS.lib.WordArray.create(arr);
    }
  };
  
  const encrypt = (plaintext) => {
    const encryptScreteKey = 'b305723a4d2e49a443e064a111e3e280';
    const iv = generateIV();
    const key = CryptoJS.enc.Utf8.parse(encryptScreteKey);
    
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
  
    const encryptedBase64 = encrypted.toString();
    const ivHex = CryptoJS.enc.Hex.stringify(iv);
  
    return `${ivHex}:${encryptedBase64}`;
  };

  const validatePassword = (newPassword) => {
    let NewPassword = newPassword?.replace(/\s+/g, '')?.trim()
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(NewPassword);
    const hasLowerCase = /[a-z]/.test(NewPassword);
    const hasNumber = /[0-9]/.test(NewPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(NewPassword);
    if (!NewPassword) {
      return "New password is required";
    }
    else if (NewPassword.length < minLength) {
      return "Password should be min lenght 8";
    }
    else if (!hasUpperCase) {
      return "Password must have 1 Uppercase";
    }
    else if (!hasLowerCase) {
      return "Password Must have one lower case";
    }
    else if (!hasNumber) {
      return "must have 1 Number ";
    }
    else if (!hasSpecialChar) {
      return "must have 1 special char";
    }
  };

  const checkAuthToken = useCallback(async () => {
    const authToken = atob(await AsyncStorage.getItem(btoa("authToken")));

    if (!authToken) {
      addToast("Authentication token is not available", "error");
      throw new Error("Authentication token is not available");
    }

    return authToken;
  }, [addToast]);

  const handlresetPassword = async () => {
    try {
      const newPasswordError = validatePassword(password.newPassword);
      if (!password.oldPassword?.replace(/\s+/g, '')?.trim()) {
        setPassword({
          ...password,
          isOldPassError: "Old password is required!",
        });
        return;
      } else if (newPasswordError) {
        setPassword({ ...password, isNewPassError: newPasswordError });
        return;
      } else if (!password.confPassword?.replace(/\s+/g, '')?.trim()) {
        setPassword({
          ...password,
          isConfPassError: "Confirm password is required!",
        });
        return;
      } else if (password.newPassword !== password.confPassword) {
        setPassword({
          ...password,
          isConfPassError: "Passwords do not match!",
        });
        return;
      } else if (password.oldPassword === password.newPassword) {
        setPassword({
          ...password,
          isNewPassError: "new passwords and old password not will be same!",
        });
        return;
      } else {
        const authToken = await checkAuthToken();
        const Parameter =  {
          operation: "fetch",
          tblName: "tbl_user_master",
          data: "",
          conditionString: `password = '${password.oldPassword}' AND user_id = ${userData.user_id}`,
          checkAvailability: "",
          customQuery: "",
        };
        const encryptedParams = encrypt(JSON.stringify(Parameter));
     
        const response = await fetch(
          encryptedParams,
          authToken
        );
        if (response?.data?.receivedData?.length > 0) {
          const Parameter1 = {
            operation: "update",
            tblName: "tbl_user_master",
            data: { password: password.newPassword},
            conditionString: `user_id = ${userData.user_id}`,
            checkAvailability: "",
            customQuery: "",
          };
          const encryptedParams1 = encrypt(JSON.stringify(Parameter1));
          await update(
            encryptedParams1,
            authToken
          );

          addToast("Password changed successfully!", "success");
          setPassword({
            oldPassword: "",
            newPassword: "",
            confPassword: "",
            isOldPassError: "",
            isNewPassError: "",
            isConfPassError: "",
          });
        }
      }
    } catch (error) {
      handleAuthErrors(error);
    }
  };

  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        addToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        addToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        addToast("No response received from the server", "error");
        break;
      default:
        addToast("Module Operation Failed", "error");
    }
  };

  return (
    <SafeAreaView style={styles.passwordWrap}>
      <View style={styles.container}>
        <Text style={styles.headertext}>Reset Password</Text>
        <View style={styles.managePassword}>
          <View>
            <Text style={styles.label}>Old Password</Text>
            <View>
              <TextInput
                placeholder="Enter old Password"
                value={password.oldPassword}
                style={styles.input}
                onChangeText={(text) =>
                  setPassword({ ...password, oldPassword: text })
                }
                onFocus={() => setPassword({ ...password, isOldPassError: "" })}
                secureTextEntry={!showOldPassword}
              />
              <>
                {password.isOldPassError && (
                  <Text style={{ color: "red" }}>
                    {password.isOldPassError}
                  </Text>
                )}
              </>
              <Ionicons
                name={showOldPassword ? "eye" : "eye-off"}
                style={[styles.eyeicon, { top: 10 }]}
                onPress={() => setShowOldPassword(!showOldPassword)}
              />
            </View>
            <View
              style={[styles.inputWrap, isMobile ? styles.inputmobWrap : null]}
            >
              <View style={{ width: isMobile ? "100%" : "48%" }}>
                <Text style={styles.label}>New Password</Text>
                <TextInput
                  placeholder="Enter New  Password"
                  value={password.newPassword}
                  style={styles.input}
                  onChangeText={(text) =>
                    setPassword({ ...password, newPassword: text })
                  }
                  onFocus={() =>
                    setPassword({
                      ...password,
                      isNewPassError: "",
                      isConfPassError: "",
                    })
                  }
                  secureTextEntry={!showNewPassword} // it hide the text if false
                />
                <>
                  {password.isNewPassError && (
                    <Text style={{ color: "red" }}>
                      {password.isNewPassError}
                    </Text>
                  )}
                </>

                <Ionicons
                  name={showNewPassword ? "eye" : "eye-off"}
                  style={styles.eyeicon}
                  onPress={() => setshowNewPassword(!showNewPassword)}
                />
              </View>
              <View style={{ width: isMobile ? "100%" : "48%" }}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                  placeholder="Enter your confirm Password"
                  value={password.confPassword}
                  style={styles.input}
                  onChangeText={(text) =>
                    setPassword({ ...password, confPassword: text })
                  }
                  onFocus={() =>
                    setPassword({
                      ...password,
                      isNewPassError: "",
                      isConfPassError: "",
                    })
                  }
                  secureTextEntry={!showConfirmPassword}
                />
                <>
                  {password.isConfPassError && (
                    <Text style={{ color: "red" }}>
                      {password.isConfPassError}
                    </Text>
                  )}
                </>
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  style={styles.eyeicon}
                  onPress={() => setshowConfirmPassword(!showConfirmPassword)}
                />
              </View>
            </View>
          </View>
          <Pressable style={styles.resetbtn} onPress={handlresetPassword}>
            <Text style={{ textAlign: "center", color: "#fff" }}>Reset</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ManagePasswordScreen;

const styles = StyleSheet.create({
  passwordWrap: {
    flex: 1,
    // backgroundColor:"#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  managePassword: {
    // backgroundColor:"#f6f6f6",
    // minWidth:isMobile ? 240: 400,
    // minHeight:isMobile ? 200: 240,
    padding: 10,
    borderRadius: 10,
  },
  container: {
    width: isMobile ? "90%" : "95%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  headertext: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  resetbtn: {
    backgroundColor: "green",
    padding: 8,
    borderRadius: 6,
    marginTop: 20,
  },
  eyeicon: {
    fontSize: 20,
    position: "absolute",
    right: 18,
    top: 40,
  },
  inputWrap: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputmobWrap: {
    flexDirection: "column",
  },
});
