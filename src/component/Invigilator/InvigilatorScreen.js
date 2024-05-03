 import React,{useEffect,useCallback, useState} from 'react';
 import { View, Text, StyleSheet, Dimensions,ScrollView,FlatList,Pressable } from 'react-native';
 import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';

 import {  fetch } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get("window").width;

 const InvigilatorScreen = () => {
  const { showToast } = useToast();
  const [invigilatorData, setInvigilatorData] = useState([]);
  const [isBulkuploadInvigilater, setIsBulkuploadInvigilater] = useState(false);
  const checkAuthToken = useCallback(async () => {
    const authToken = await AsyncStorage.getItem("authToken");

    if (!authToken) {
      showToast("Authentication token not available", "error");
      throw new Error("Authentication token not available");
    }

    return authToken;
  }, [showToast]);

  const handleGetInigilatorDuty = async () => {
    try {
      const authToken = await checkAuthToken();
      const response = await fetch(
        {
          operation: "fetch",
          tblName: "tbl_invigilator_duty",
          data: "",
          conditionString: "",
          checkAvailability: "",
          customQuery: "",
        },
        authToken
      );

      if (response) {
        setInvigilatorData(response.data)
      }
    } catch (error) {
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
    handleGetInigilatorDuty();
  }, []);

   return (
    <View style={styles.boxcontainer}>
      {isBulkuploadInvigilater ?  <Bulkpload handleClose={() => setIsBulkuploadInvigilater(false)} />
:
<View>
<ScrollView>
<Pressable onPress={() => setIsBulkuploadInvigilater(true)}>
                    <Text style={styles.cancelbtn}>BulkUpload</Text>
                  </Pressable>
              <FlatList
                data={invigilatorData}
                keyExtractor={(item) => item.PK_InvigilatorDutyId.toString()}
                ListHeaderComponent={() => (
                  <View style={styles.tableHeader}>
                    <Text style={[styles.tableHeaderText, { flex: 2 }]}>Duty Id</Text>
                    <Text style={[styles.tableHeaderText, { flex: 3 }]}>Employee Id</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Invigilator Name</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Room</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Shift</Text>
                    <Text style={[styles.tableHeaderText, { flex: 1 }]}>Duty Status</Text>
                  </View>
          )} renderItem={({ item }) => (          
            <View style={styles.listItem}>
              <Text style={[styles.listItemText, { flex: 1 }]}>{item.PK_InvigilatorDutyId}</Text>
              <Text style={[styles.listItemText, { flex: 1 }]}>{item.employeeId}</Text>
              <Text style={[styles.listItemText, { flex: 1 }]}>{item.invigilatorName}</Text>
              <Text style={[styles.listItemText, { flex: 1 }]}>{item.room}</Text>
              <Text style={[styles.listItemText, { flex: 1 }]}>{item.date}</Text>
              <Text style={[styles.listItemText, { flex: 1 }]}>{item.shift}</Text>
              <Text style={[styles.listItemText, { flex: 1 }]}>{item.duty_status}</Text>    
            </View>
            )}
              />
            </ScrollView>
</View>
      }
  </View>
   );
 };
 
 export default InvigilatorScreen;

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
    tableHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: '#f0f0f0',
      paddingVertical: 10,
      paddingHorizontal: 15,
      marginBottom: 10,
    },
    tableHeaderText: {
      fontWeight: 'bold',
    },
    listItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    listItemText: {
      flex: 1,
    },
  });
  