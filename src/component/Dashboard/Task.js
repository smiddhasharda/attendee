 import React,{useEffect,useCallback} from 'react';
 import { View, Text, StyleSheet, Dimensions } from 'react-native';
 import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';

 import {  view } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get("window").width;

 const Task = () => {
  const { showToast } = useToast();
  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleGetView = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await view(
        {
          operation: "fetch",
          tblName: "PS_S_PRD_EX_RME_VW",
          data: '',
          conditionString: '',
          checkAvailability: '',
          customQuery: '',
        },
        authToken
      );

      if (response) {
        console.log(response?.data);
      }
    } catch (error) {
      console.log(error)
      handleAuthErrors(error);
    }
  };


  const handleAuthErrors = (error) => {
    switch (error.message) {
      case "Invalid credentials":
        showToast("Invalid authentication credentials", "error");
        break;
      case "Data already exists":
        showToast("Module with the same name already exists", "error");
        break;
      case "No response received from the server":
        showToast("No response received from the server", "error");
        break;
      default:
        showToast("Module Operation Failed", "error");
    }
  };

  useEffect(() => {
    handleGetView();
  }, []);

   return (
    <View style={styles.boxcontainer}>
      <Bulkpload />
  </View>
   );
 };
 
 export default Task;

 const styles = StyleSheet.create({
    boxcontainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 10,
      padding: 10,
      justifyContent: "space-between"
    },
    box: {
      borderWidth: 1,
      borderColor: "#ccc",
      width: windowWidth / 1 - 10, 
      backgroundColor: "#eaeaea",
      height: 100,
      textAlign: "center",
      alignItems: "center",
      borderRadius: 10,
      marginBottom: 10,
      padding: 10,
    },
    boxtext: {
      marginTop: 10,
      alignItems: "center",  
    },
  });
  