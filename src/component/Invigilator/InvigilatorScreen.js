 import React,{useEffect,useCallback, useState} from 'react';
 import { View, Text, StyleSheet, Dimensions,ScrollView,FlatList,Pressable } from 'react-native';
 import Bulkpload from '../../globalComponent/Bulkupload/BulkUpload';

 import {  fetch } from "../../AuthService/AuthService";
import { useToast } from "../../globalComponent/ToastContainer/ToastContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get("window").width;

 const InvigilatorScreen = ({userAccess}) => {
  const UserAccess = userAccess?.module?.find( (item) => item?.FK_ModuleId === 4 );
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

    <View style={styles.container}>
   {isBulkuploadInvigilater ?  <Bulkpload handleClose={() => setIsBulkuploadInvigilater(false)} /> : 
    <View style={styles.userListWrap}>
      <Text style={styles.header}>Invigilator Duty List :</Text>      
        <View style={styles.addWrap}>
        {UserAccess?.create === 1 &&    
        <Pressable onPress={() => setUserContainerVisible(true)}>
                  <Text>Add</Text>
                </Pressable> }
        </View>
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
    </View>
    }
    </View>   
   );
 };
 
 export default InvigilatorScreen;

 const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  formContainer: {
    marginBottom: 20,
    backgroundColor:"#fff",
    padding:20,
    elevation:2,
  },
  userListWrap:{
   backgroundColor:"#fff",
   padding:20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
  listItemActiveStatus: {
    color: 'green',
  },
  listItemInactiveStatus: {
    color: 'red',
  },
  listItemEditButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
  },
  listItemEditText: {
    color: 'white',
  },

  logoImageStyle: {
    width: 200,
    height: 200,
    alignSelf: "center",
  },
  textInputContainer: {
    marginTop: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTextInputContainer: {
    // marginTop: 16,
    // alignItems: "center",
    // justifyContent: "center",
  },
  dividerStyle: {
    height: 0.5,
    marginTop: 24,
    marginBottom: 12,
    borderRadius: 16,
    alignSelf: "center",
    backgroundColor: "#ccc",
  },
  eyeIconContainer: {
    right: 16,
    top: 14,
    position: "absolute",
  },
  eyeIcon: {
    width: 24,
    height: 24,
    // tintColor: "#555",
  },
  
  shakeText: {
    color: "red",
    marginTop: 8,
    marginLeft: 12,
    marginRight: "auto",
  },
  emailTextInputContainer: {
    // alignItems: "center",
    // justifyContent: "center",
  },
  emailTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTooltipTextStyle: {
    fontSize: 16,
  },
  emailTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  emailTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  emailTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipStyle: {
    marginTop: 30,
  },
  passwordTooltipContainer: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  passwordTooltipTextStyle: {
    fontSize: 16,
  },
  passwordTooltipRedTextStyle: {
    fontWeight: "bold",
    color: "red",
  },
  passwordTooltipBackgroundStyle: {
    backgroundColor: "transparent",
  },
  passwordTooltipContentStyle: {
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  addWrap:{
   width:100,
   alignSelf:"flex-end",
   marginBottom:10,
  },
});
  